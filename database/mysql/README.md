# 🗄️ MySQL Database Documentation

## Tổng quan

MySQL được sử dụng trong **Crystallized Iron** để lưu trữ các dữ liệu **cốt lõi, nhạy cảm**, đòi hỏi tính toàn vẹn ACID tuyệt đối. Bất kỳ thao tác nào liên quan đến tiền tệ, vật phẩm (có ID riêng biệt), hoặc tài khoản người dùng đều phải đi qua MySQL.

**Database name:** `crystallized_iron`
**Engine:** InnoDB (hỗ trợ Transaction, Row-level Locking)
**Charset:** utf8mb4_unicode_ci (hỗ trợ tiếng Việt và emoji)

---

## Sơ đồ Quan hệ (ERD)

```
accounts (1) ──── (N) characters (1) ──── (1) currencies
                            │
                            ├──── (N) inventory
                            ├──── (N) transactions
                            └──── (N) gacha_history
```

---

## Chi tiết từng Bảng

### 1. `accounts` - Tài khoản người chơi

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `id` | BIGINT PK | Auto-increment ID |
| `username` | VARCHAR(50) UNIQUE | Tên đăng nhập |
| `email` | VARCHAR(255) UNIQUE | Email xác thực |
| `password_hash` | VARCHAR(255) | Mật khẩu đã băm Bcrypt |
| `salt` | VARCHAR(64) | Salt bổ sung (tùy chọn) |
| `status` | ENUM | `active` / `banned` / `suspended` |
| `last_login_at` | DATETIME | Lần đăng nhập cuối |
| `last_login_ip` | VARCHAR(45) | IP lần cuối (hỗ trợ IPv6) |
| `created_at` | DATETIME | Ngày tạo |
| `updated_at` | DATETIME | Ngày cập nhật |

**Lưu ý bảo mật:**
- Không bao giờ lưu mật khẩu plaintext
- Sử dụng Bcrypt với cost factor >= 12
- IP được lưu để phát hiện đăng nhập bất thường (anti-hack)

---

### 2. `characters` - Nhân vật

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `id` | BIGINT PK | ID nhân vật |
| `account_id` | BIGINT FK | Tham chiếu tài khoản |
| `name` | VARCHAR(50) UNIQUE | Tên hiển thị trong game |
| `level` | INT | Cấp độ (1-100) |
| `experience` | BIGINT | EXP hiện tại |
| `hp / max_hp` | INT | Máu hiện tại / tối đa |
| `mp / max_mp` | INT | Năng lượng hiện tại / tối đa |
| `attack` | INT | Lực tấn công |
| `defense` | INT | Phòng thủ |
| `accuracy` | INT | Chính xác |
| `evasion` | INT | Né tránh |
| `speed` | INT | Tốc độ (quyết định lượt trong Battle Log) |
| `crit_chance` | DECIMAL(5,4) | Tỷ lệ chí mạng (0.0000-1.0000) |
| `stat_points` | INT | Điểm chỉ số chưa phân bổ |
| `current_map_id` | VARCHAR(100) | Map đang thám hiểm (nullable) |
| `current_node_id` | VARCHAR(100) | Node hiện tại trên map (nullable) |

**Quy tắc:**
- Mỗi tài khoản có thể có nhiều nhân vật
- Tên nhân vật phải UNIQUE trên toàn server
- `stat_points` được cộng +5 mỗi lần lên cấp

---

### 3. `currencies` - Tiền tệ

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `character_id` | BIGINT PK/FK | 1 nhân vật = 1 bản ghi |
| `gold` | BIGINT UNSIGNED | Vàng (cày cuốc) |
| `diamonds` | BIGINT UNSIGNED | Kim Cương (nạp tiền) |

**Tại sao tách riêng bảng?**
- Để có thể lock row khi giao dịch (Row-level Locking) mà không block toàn bộ bảng `characters`
- Mỗi thay đổi tiền tệ PHẢI đi kèm 1 record trong bảng `transactions`

---

### 4. `inventory` - Kho vật phẩm

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `id` | BIGINT PK | ID vật phẩm DUY NHẤT (chống Dupe) |
| `character_id` | BIGINT FK | Thuộc nhân vật nào |
| `item_template_id` | VARCHAR(100) | Tham chiếu MongoDB Item Template |
| `rarity` | TINYINT | Độ hiếm 1-6 sao |
| `level` | INT | Cấp cường hóa |
| `is_equipped` | TINYINT(1) | Đang trang bị hay không |
| `slot_type` | ENUM | weapon / armor / accessory / gem / material / consumable |
| `main_stat_type` | VARCHAR(50) | Loại chỉ số chính |
| `main_stat_value` | INT | Giá trị chỉ số chính |
| `sub_stats` | JSON | Mảng chỉ số phụ ngẫu nhiên |
| `socket_count` | TINYINT | Số lỗ khảm ngọc |
| `socketed_gems` | JSON | Danh sách ngọc đã gắn |
| `set_id` | VARCHAR(100) | ID bộ trang bị (nếu có) |

**Cơ chế chống Dupe:**
- Mỗi vật phẩm có `id` AUTO_INCREMENT duy nhất
- Mọi thao tác tạo/xóa/chuyển vật phẩm phải nằm trong Transaction
- Server-side validation: kiểm tra owner trước khi thao tác

---

### 5. `transactions` - Lịch sử giao dịch

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `id` | BIGINT PK | ID giao dịch |
| `character_id` | BIGINT FK | Nhân vật thực hiện |
| `type` | ENUM | Loại giao dịch (xem danh sách bên dưới) |
| `currency_type` | ENUM | `gold` hoặc `diamonds` |
| `amount` | BIGINT | Số tiền (+/-) |
| `balance_after` | BIGINT | Số dư SAU giao dịch |
| `description` | VARCHAR(255) | Mô tả chi tiết |
| `reference_id` | VARCHAR(100) | ID tham chiếu |

**Các loại giao dịch:**
- `explore_reward` - Thưởng từ thám hiểm
- `sell_item` / `buy_item` - Mua bán
- `enhance_cost` - Chi phí cường hóa
- `gacha_spend` - Mở rương
- `diamond_purchase` - Nạp Kim Cương
- `trade_send` / `trade_receive` - Giao dịch P2P
- `system_grant` - Hệ thống tặng

---

### 6. `gacha_history` - Lịch sử mở rương

| Cột | Kiểu | Mô tả |
|-----|-------|--------|
| `id` | BIGINT PK | ID |
| `character_id` | BIGINT FK | Người mở |
| `gacha_type` | VARCHAR(50) | standard / premium / event |
| `cost_type` | ENUM | gold / diamonds |
| `cost_amount` | INT | Chi phí |
| `result_item_id` | BIGINT FK | Vật phẩm nhận được |
| `result_rarity` | TINYINT | Độ hiếm kết quả |

**Lưu ý pháp lý:**
- Bảng này **BẮT BUỘC** phải có cho hồ sơ kiểm duyệt game
- Ghi nhận đầy đủ tỷ lệ rớt và kết quả thực tế
- Không được xóa dữ liệu (retain forever)

---

## Quy tắc Transaction An toàn

```sql
-- Ví dụ: Mua vật phẩm từ shop
START TRANSACTION;

-- 1. Trừ tiền (lock row currencies)
UPDATE currencies SET gold = gold - 500
WHERE character_id = 123 AND gold >= 500;

-- 2. Kiểm tra affected rows (nếu = 0 → không đủ tiền → ROLLBACK)

-- 3. Tạo vật phẩm
INSERT INTO inventory (character_id, item_template_id, ...)
VALUES (123, 'weapon_iron_sword_001', ...);

-- 4. Ghi log giao dịch
INSERT INTO transactions (character_id, type, currency_type, amount, balance_after)
VALUES (123, 'buy_item', 'gold', -500, 1500);

COMMIT;
```

---

## Backup & Bảo trì

- **Backup:** Chạy `mysqldump` hàng ngày vào lúc 4:00 AM (thời điểm CCU thấp nhất)
- **Retention:** Giữ backup 30 ngày gần nhất
- **Monitoring:** Theo dõi slow queries với threshold > 200ms
