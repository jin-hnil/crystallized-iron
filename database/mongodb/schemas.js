// ============================================
// CRYSTALLIZED IRON - MongoDB Collection Schemas
// Mục đích: Lưu trữ dữ liệu KHỐI LƯỢNG LỚN,
// CẤU TRÚC ĐỘNG, không yêu cầu ACID nghiêm ngặt.
// ============================================

// Database: crystallized_iron

// ============================================
// 1. COLLECTION: item_templates
// Khuôn mẫu (Template) cho tất cả vật phẩm trong game.
// Khi thiết kế đồ mới chỉ cần thêm Document vào đây.
// ============================================
const itemTemplateSchema = {
    _id: "weapon_iron_sword_001",             // ID duy nhất của template
    name: "Kiếm Thiết Tinh",                  // Tên hiển thị
    description: "Thanh kiếm rèn từ mảnh Thiết Tinh nguyên chất.",
    category: "weapon",                        // weapon | armor | accessory | gem | material | consumable
    slotType: "weapon",                        // Ô lắp trên nhân vật

    // Hình ảnh thẻ bài
    cardArt: {
        front: "/assets/cards/iron_sword_front.png",
        back: "/assets/cards/iron_sword_back.png",
    },

    // Chỉ số chính (Main Stat)
    mainStat: {
        type: "attack",                        // attack | defense | hp | speed | accuracy | evasion
        baseValue: 15,                         // Giá trị cơ sở ở level 1
        growthPerLevel: 3,                     // Tăng mỗi level cường hóa
    },

    // Pool chỉ số phụ ngẫu nhiên (Sub-stats)
    // Khi sinh ra item, hệ thống random 2-4 dòng từ pool này
    subStatPool: [
        { type: "speed", minValue: 1, maxValue: 8 },
        { type: "critChance", minValue: 0.01, maxValue: 0.05 },
        { type: "hp", minValue: 10, maxValue: 50 },
        { type: "accuracy", minValue: 2, maxValue: 10 },
    ],

    // Độ hiếm có thể xuất hiện (1-6 sao)
    possibleRarities: [1, 2, 3, 4, 5],

    // Số lượng socket tối đa
    maxSockets: 2,

    // Set bonus (nếu thuộc bộ)
    setId: "iron_crystal_set",
    setBonuses: {
        2: { type: "attack", value: 20 },      // 2 món cùng bộ: +20 ATK
        4: { type: "critChance", value: 0.10 }, // 4 món cùng bộ: +10% Crit
    },

    // Điều kiện sử dụng
    requirements: {
        minLevel: 1,
    },

    // Drop rate info (dùng cho hệ thống thám hiểm)
    dropInfo: {
        mapIds: ["area_ruined_city", "area_glow_forest"],
        baseDropRate: 0.08,                    // 8% cơ bản khi clear node
    },

    createdAt: new Date(),
    updatedAt: new Date(),
};

// ============================================
// 2. COLLECTION: battle_logs
// Nhật ký chiến đấu Text Log đầy đủ.
// Dùng để replay, kiểm tra, debug.
// ============================================
const battleLogSchema = {
    _id: "battle_abc123",                      // ObjectId tự sinh
    characterId: 12345,                        // FK → MySQL characters.id
    characterName: "Lina",
    mapId: "area_ruined_city",
    nodeId: "n4",
    mobName: "Sâu Sắt",

    // Chỉ số snapshot lúc vào trận
    playerSnapshot: {
        level: 5,
        hp: 100, maxHp: 100,
        attack: 25, defense: 10,
        speed: 14, critChance: 0.08,
    },
    mobSnapshot: {
        hp: 80, attack: 12,
        defense: 5, speed: 8,
    },

    // Toàn bộ log trận đánh
    turns: [
        { turn: 1, text: "Lina tấn công Sâu Sắt → 18 sát thương. [Mob HP: 62]" },
        { turn: 1, text: "Sâu Sắt phản đòn → 5 sát thương. [HP: 95/100]" },
        { turn: 2, text: "Lina tấn công Sâu Sắt (CHÍ MẠNG!) → 32 sát thương. [Mob HP: 30]" },
        { turn: 2, text: "Sâu Sắt phản đòn → 4 sát thương. [HP: 91/100]" },
        { turn: 3, text: "Lina tấn công Sâu Sắt → 20 sát thương. [Mob HP: 10]" },
        { turn: 3, text: "Sâu Sắt phản đòn → 6 sát thương. [HP: 85/100]" },
        { turn: 4, text: "Lina tấn công Sâu Sắt → 15 sát thương. [Mob HP: 0]" },
        { turn: 4, text: "✅ Chiến thắng! Nhận 25 EXP và 18 Vàng." },
    ],

    result: "win",                             // win | lose
    expGained: 25,
    goldGained: 18,
    itemsDropped: [],                          // Array of item IDs dropped
    duration: 4,                               // Số turn
    createdAt: new Date(),
};

// ============================================
// 3. COLLECTION: chat_logs
// Lưu trữ tin nhắn chat cho mục đích audit,
// lịch sử, và kiểm duyệt nội dung.
// ============================================
const chatLogSchema = {
    _id: "chat_xyz789",                        // ObjectId
    channel: "global",                         // global | area | private | guild
    senderId: 12345,                           // FK → MySQL characters.id
    senderName: "Lina",
    recipientId: null,                         // null nếu public, ID nếu private
    message: "Có ai muốn đi farm Phế Tích Lv.1 không?",
    isFiltered: false,                         // true nếu bị lọc bởi hệ thống kiểm duyệt
    createdAt: new Date(),
};

// ============================================
// 4. COLLECTION: mob_configs
// Cấu hình quái vật. Có thể thêm/sửa/xóa
// mà không cần thay đổi Schema (NoSQL linh hoạt).
// ============================================
const mobConfigSchema = {
    _id: "mob_mutant_rat",
    name: "Chuột Đột Biến",
    description: "Loài chuột bị nhiễm năng lượng Thiết Tinh, trở nên hung hãn.",

    // Chỉ số cơ bản (Base stats ở level 1 của mob)
    baseStats: {
        hp: 50,
        attack: 8,
        defense: 2,
        speed: 12,
        critChance: 0.02,
    },

    // Hệ số tăng theo level khu vực
    scalingPerLevel: {
        hp: 15,
        attack: 3,
        defense: 1,
        speed: 1,
    },

    // Phần thưởng
    rewards: {
        baseExp: 15,
        baseGold: 10,
        expScaling: 5,                         // +5 EXP mỗi cấp map
        goldScaling: 3,
    },

    // Bảng rớt đồ (Drop Table)
    dropTable: [
        { itemTemplateId: "material_iron_shard", dropRate: 0.30, minQty: 1, maxQty: 3 },
        { itemTemplateId: "weapon_iron_sword_001", dropRate: 0.05, minQty: 1, maxQty: 1 },
        { itemTemplateId: "consumable_hp_potion_s", dropRate: 0.15, minQty: 1, maxQty: 2 },
    ],

    // Artwork
    cardArt: "/assets/mobs/mutant_rat.png",

    // Xuất hiện ở đâu
    spawnMaps: ["area_ruined_city"],
    isBoss: false,

    createdAt: new Date(),
    updatedAt: new Date(),
};

// ============================================
// 5. COLLECTION: exploration_logs
// Lịch sử thám hiểm (mỗi phiên auto-explore).
// ============================================
const explorationLogSchema = {
    _id: "explore_session_001",
    characterId: 12345,
    characterName: "Lina",
    mapId: "area_ruined_city",
    mapName: "Phế Tích Thiết Tinh",

    // Bắt đầu và kết thúc
    startedAt: new Date("2026-03-05T10:00:00Z"),
    endedAt: new Date("2026-03-05T10:15:00Z"),
    endReason: "death",                        // manual | death | completed

    // Tổng kết (Summary)
    summary: {
        nodesVisited: 8,
        mobsDefeated: 3,
        mobsLost: 1,
        totalExpGained: 65,
        totalGoldGained: 46,
        itemsObtained: [
            { itemTemplateId: "material_iron_shard", quantity: 2 },
        ],
    },

    // Chi tiết từng node đã đi qua
    nodeHistory: [
        { nodeId: "n1", nodeLabel: "Cổng Vào", type: "empty", timestamp: new Date() },
        { nodeId: "n2", nodeLabel: "Ngã Ba Rêu", type: "mob", result: "win", timestamp: new Date() },
        { nodeId: "n4", nodeLabel: "Hành Lang Tối", type: "mob", result: "win", timestamp: new Date() },
        { nodeId: "n6", nodeLabel: "Lõi Phế Tích", type: "boss", result: "lose", timestamp: new Date() },
    ],

    createdAt: new Date(),
};

// ============================================
// 6. COLLECTION: set_definitions
// Định nghĩa các bộ trang bị (Set Bonus).
// ============================================
const setDefinitionSchema = {
    _id: "iron_crystal_set",
    name: "Bộ Thiết Tinh",
    description: "Trang bị rèn từ Thiết Tinh nguyên chất, mang sức mạnh của khoáng chất cổ đại.",
    pieces: [
        "weapon_iron_sword_001",
        "armor_iron_chest_001",
        "accessory_iron_ring_001",
        "accessory_iron_pendant_001",
    ],
    bonuses: {
        2: { description: "+20 Tấn Công", stats: [{ type: "attack", value: 20 }] },
        4: { description: "+10% Chí Mạng", stats: [{ type: "critChance", value: 0.10 }] },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
};

// ============================================
// INDEXES (gợi ý tạo sau khi import data)
// ============================================
// db.item_templates.createIndex({ category: 1 })
// db.item_templates.createIndex({ "dropInfo.mapIds": 1 })
// db.item_templates.createIndex({ setId: 1 })
// db.battle_logs.createIndex({ characterId: 1, createdAt: -1 })
// db.battle_logs.createIndex({ mapId: 1 })
// db.chat_logs.createIndex({ channel: 1, createdAt: -1 })
// db.chat_logs.createIndex({ senderId: 1 })
// db.mob_configs.createIndex({ spawnMaps: 1 })
// db.mob_configs.createIndex({ isBoss: 1 })
// db.exploration_logs.createIndex({ characterId: 1, createdAt: -1 })
// db.exploration_logs.createIndex({ mapId: 1 })
