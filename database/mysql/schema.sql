-- ============================================
-- CRYSTALLIZED IRON - MySQL Database Schema
-- Mục đích: Lưu trữ dữ liệu CỐT LÕI, NHẠY CẢM
-- cần đảm bảo tính toàn vẹn ACID tuyệt đối.
-- ============================================

-- Tạo Database
CREATE DATABASE IF NOT EXISTS crystallized_iron
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE crystallized_iron;

-- ============================================
-- 1. BẢNG TÀI KHOẢN (accounts)
-- Lưu thông tin đăng nhập, xác thực người chơi.
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL COMMENT 'Bcrypt hashed password',
    salt            VARCHAR(64)     DEFAULT NULL COMMENT 'Salt bổ sung (nếu cần)',
    status          ENUM('active', 'banned', 'suspended') NOT NULL DEFAULT 'active',
    last_login_at   DATETIME        DEFAULT NULL,
    last_login_ip   VARCHAR(45)     DEFAULT NULL COMMENT 'Hỗ trợ IPv6',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- 2. BẢNG NHÂN VẬT (characters)
-- Mỗi tài khoản có thể có nhiều nhân vật.
-- Lưu chỉ số cốt lõi của nhân vật.
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    account_id      BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(50)     NOT NULL UNIQUE COMMENT 'Tên hiển thị trong game',
    level           INT UNSIGNED    NOT NULL DEFAULT 1,
    experience      BIGINT UNSIGNED NOT NULL DEFAULT 0,

    -- Chỉ số sinh tồn
    hp              INT             NOT NULL DEFAULT 100,
    max_hp          INT             NOT NULL DEFAULT 100,
    mp              INT             NOT NULL DEFAULT 50,
    max_mp          INT             NOT NULL DEFAULT 50,

    -- Chỉ số chiến đấu (Battle Log)
    attack          INT             NOT NULL DEFAULT 10,
    defense         INT             NOT NULL DEFAULT 5,
    accuracy        INT             NOT NULL DEFAULT 100,
    evasion         INT             NOT NULL DEFAULT 5,
    speed           INT             NOT NULL DEFAULT 10,
    crit_chance     DECIMAL(5,4)    NOT NULL DEFAULT 0.0500 COMMENT '0.0000 - 1.0000',

    -- Điểm phân bổ
    stat_points     INT UNSIGNED    NOT NULL DEFAULT 0,

    -- Thám hiểm
    current_map_id  VARCHAR(100)    DEFAULT NULL,
    current_node_id VARCHAR(100)    DEFAULT NULL,

    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    INDEX idx_account (account_id),
    INDEX idx_name (name),
    INDEX idx_level (level)
) ENGINE=InnoDB;

-- ============================================
-- 3. BẢNG TIỀN TỆ (currencies)
-- Tách riêng để đảm bảo ACID cho giao dịch tiền.
-- ============================================
CREATE TABLE IF NOT EXISTS currencies (
    character_id    BIGINT UNSIGNED PRIMARY KEY,
    gold            BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tiền cày cuốc (Vàng)',
    diamonds        BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Tiền nạp (Kim Cương)',
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 4. BẢNG VẬT PHẨM / KHO ĐỒ (inventory)
-- Mỗi vật phẩm có ID riêng biệt, chống Dupe.
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id    BIGINT UNSIGNED NOT NULL,
    item_template_id VARCHAR(100)   NOT NULL COMMENT 'Tham chiếu tới Item Template trong MongoDB',
    rarity          TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '1-6 sao',
    level           INT UNSIGNED    NOT NULL DEFAULT 1 COMMENT 'Cấp cường hóa của vật phẩm',
    is_equipped     TINYINT(1)      NOT NULL DEFAULT 0,
    slot_type       ENUM('weapon', 'armor', 'accessory', 'gem', 'material', 'consumable') NOT NULL,

    -- Chỉ số chính
    main_stat_type  VARCHAR(50)     NOT NULL COMMENT 'VD: attack, defense, hp',
    main_stat_value INT             NOT NULL DEFAULT 0,

    -- Chỉ số phụ (lưu dạng JSON cho linh hoạt)
    sub_stats       JSON            DEFAULT NULL COMMENT '[{"type":"speed","value":5},{"type":"critChance","value":0.02}]',

    -- Socket ngọc
    socket_count    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    socketed_gems   JSON            DEFAULT NULL COMMENT '[{"gemId":123,"stat":"attack","value":10}]',

    -- Set bonus tracking
    set_id          VARCHAR(100)    DEFAULT NULL COMMENT 'Thuộc bộ nào (nếu có)',

    acquired_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_character (character_id),
    INDEX idx_template (item_template_id),
    INDEX idx_equipped (character_id, is_equipped),
    INDEX idx_rarity (rarity),
    INDEX idx_set (set_id)
) ENGINE=InnoDB;

-- ============================================
-- 5. BẢNG GIAO DỊCH (transactions)
-- Log mọi thay đổi tiền tệ để audit và chống gian lận.
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id    BIGINT UNSIGNED NOT NULL,
    type            ENUM(
                        'explore_reward',   -- Thưởng thám hiểm
                        'sell_item',        -- Bán vật phẩm
                        'buy_item',         -- Mua vật phẩm
                        'enhance_cost',     -- Chi phí cường hóa
                        'gacha_spend',      -- Chi phí mở rương
                        'diamond_purchase', -- Nạp Kim Cương
                        'trade_send',       -- Giao dịch gửi
                        'trade_receive',    -- Giao dịch nhận
                        'system_grant'      -- Hệ thống tặng
                    ) NOT NULL,
    currency_type   ENUM('gold', 'diamonds') NOT NULL,
    amount          BIGINT          NOT NULL COMMENT 'Dương = cộng, Âm = trừ',
    balance_after   BIGINT UNSIGNED NOT NULL COMMENT 'Số dư sau giao dịch',
    description     VARCHAR(255)    DEFAULT NULL,
    reference_id    VARCHAR(100)    DEFAULT NULL COMMENT 'ID tham chiếu (item_id, trade_id...)',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_character_time (character_id, created_at),
    INDEX idx_type (type),
    INDEX idx_reference (reference_id)
) ENGINE=InnoDB;

-- ============================================
-- 6. BẢNG GACHA / MỞ RƯƠNG (gacha_history)
-- Lưu lại lịch sử mở rương cho kiểm duyệt pháp lý.
-- ============================================
CREATE TABLE IF NOT EXISTS gacha_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    character_id    BIGINT UNSIGNED NOT NULL,
    gacha_type      VARCHAR(50)     NOT NULL COMMENT 'standard, premium, event',
    cost_type       ENUM('gold', 'diamonds') NOT NULL,
    cost_amount     INT UNSIGNED    NOT NULL,
    result_item_id  BIGINT UNSIGNED DEFAULT NULL COMMENT 'ID vật phẩm nhận được (FK inventory)',
    result_rarity   TINYINT UNSIGNED NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_character (character_id),
    INDEX idx_gacha_type (gacha_type)
) ENGINE=InnoDB;
