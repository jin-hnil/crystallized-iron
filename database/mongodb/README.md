# 🍃 MongoDB Database Documentation

## Tổng quan

MongoDB được sử dụng trong **Crystallized Iron** để lưu trữ dữ liệu **khối lượng lớn, cấu trúc động**, nơi mà tính linh hoạt của Schema quan trọng hơn tính toàn vẹn ACID. Dữ liệu ở đây thường xuyên đọc nhiều hơn ghi, và có thể mở rộng schema tùy ý mà không cần migration.

**Database name:** `crystallized_iron`
**Storage Engine:** WiredTiger (mặc định MongoDB 4.x+)

---

## Tổng quan Collections

| Collection | Mô tả | Ước tính kích thước |
|------------|--------|---------------------|
| `item_templates` | Khuôn mẫu vật phẩm (thiết kế game) | ~500-2000 documents |
| `battle_logs` | Nhật ký chi tiết trận đánh | Tăng nhanh (10K+/ngày) |
| `chat_logs` | Tin nhắn chat toàn cầu/riêng tư | Tăng nhanh (50K+/ngày) |
| `mob_configs` | Cấu hình quái vật & Boss | ~100-500 documents |
| `exploration_logs` | Lịch sử phiên thám hiểm | Tăng trung bình (5K+/ngày) |
| `set_definitions` | Định nghĩa bộ trang bị (Set Bonus) | ~20-50 documents |

---

## Chi tiết từng Collection

### 1. `item_templates` - Khuôn mẫu Vật phẩm

Đây là "bản thiết kế" chung cho mọi vật phẩm. Khi hệ thống sinh ra một món đồ cụ thể (lưu ở MySQL `inventory`), nó sẽ tham chiếu `_id` của template này.

```json
{
    "_id": "weapon_iron_sword_001",
    "name": "Kiếm Thiết Tinh",
    "description": "Thanh kiếm rèn từ mảnh Thiết Tinh nguyên chất.",
    "category": "weapon",
    "slotType": "weapon",

    "cardArt": {
        "front": "/assets/cards/iron_sword_front.png",
        "back": "/assets/cards/iron_sword_back.png"
    },

    "mainStat": {
        "type": "attack",
        "baseValue": 15,
        "growthPerLevel": 3
    },

    "subStatPool": [
        { "type": "speed", "minValue": 1, "maxValue": 8 },
        { "type": "critChance", "minValue": 0.01, "maxValue": 0.05 },
        { "type": "hp", "minValue": 10, "maxValue": 50 }
    ],

    "possibleRarities": [1, 2, 3, 4, 5],
    "maxSockets": 2,

    "setId": "iron_crystal_set",
    "setBonuses": {
        "2": { "type": "attack", "value": 20 },
        "4": { "type": "critChance", "value": 0.10 }
    },

    "requirements": { "minLevel": 1 },
    "dropInfo": {
        "mapIds": ["area_ruined_city"],
        "baseDropRate": 0.08
    }
}
```

**Quy trình sinh vật phẩm:**
1. Server roll `baseDropRate` → quyết định có rớt không
2. Random `rarity` từ `possibleRarities` (tỷ lệ nghịch với sao)
3. Random 2-4 dòng `subStats` từ `subStatPool`
4. Tạo record mới trong MySQL `inventory` với các giá trị đã roll

**Indexes:**
```js
db.item_templates.createIndex({ category: 1 })
db.item_templates.createIndex({ "dropInfo.mapIds": 1 })
db.item_templates.createIndex({ setId: 1 })
```

---

### 2. `battle_logs` - Nhật ký Chiến đấu

Lưu toàn bộ diễn biến trận đánh dạng Text Log. Dùng để:
- Replay trận đánh (xem lại log chi tiết)
- Debug cân bằng chỉ số (balance tuning)
- Phục vụ kiểm duyệt nếu cơ quan chức năng yêu cầu

```json
{
    "characterId": 12345,
    "characterName": "Lina",
    "mapId": "area_ruined_city",
    "nodeId": "n4",
    "mobName": "Sâu Sắt",

    "playerSnapshot": {
        "level": 5, "hp": 100, "maxHp": 100,
        "attack": 25, "defense": 10,
        "speed": 14, "critChance": 0.08
    },
    "mobSnapshot": {
        "hp": 80, "attack": 12,
        "defense": 5, "speed": 8
    },

    "turns": [
        { "turn": 1, "text": "Lina tấn công Sâu Sắt → 18 sát thương." },
        { "turn": 1, "text": "Sâu Sắt phản đòn → 5 sát thương." }
    ],

    "result": "win",
    "expGained": 25,
    "goldGained": 18,
    "duration": 4,
    "createdAt": "2026-03-05T10:05:00Z"
}
```

**TTL Policy:** Tự động xóa battle logs sau 90 ngày
```js
db.battle_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
```

**Indexes:**
```js
db.battle_logs.createIndex({ characterId: 1, createdAt: -1 })
db.battle_logs.createIndex({ mapId: 1 })
```

---

### 3. `chat_logs` - Nhật ký Chat

```json
{
    "channel": "global",
    "senderId": 12345,
    "senderName": "Lina",
    "recipientId": null,
    "message": "Có ai muốn đi farm Phế Tích không?",
    "isFiltered": false,
    "createdAt": "2026-03-05T10:10:00Z"
}
```

**Channels:**
- `global` - Kênh toàn cầu
- `area` - Kênh khu vực (theo map đang explore)
- `private` - Nhắn tin riêng (có `recipientId`)
- `guild` - Kênh liên minh

**TTL Policy:** Xóa sau 30 ngày (trừ `private` giữ 7 ngày)
```js
db.chat_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
```

**Indexes:**
```js
db.chat_logs.createIndex({ channel: 1, createdAt: -1 })
db.chat_logs.createIndex({ senderId: 1 })
db.chat_logs.createIndex({ recipientId: 1 })
```

---

### 4. `mob_configs` - Cấu hình Quái vật

Dữ liệu thiết kế game (Game Design Data). Thay đổi thường xuyên trong quá trình balance.

```json
{
    "_id": "mob_mutant_rat",
    "name": "Chuột Đột Biến",
    "description": "Loài chuột nhiễm năng lượng Thiết Tinh.",

    "baseStats": {
        "hp": 50, "attack": 8,
        "defense": 2, "speed": 12
    },

    "scalingPerLevel": {
        "hp": 15, "attack": 3,
        "defense": 1, "speed": 1
    },

    "rewards": {
        "baseExp": 15, "baseGold": 10,
        "expScaling": 5, "goldScaling": 3
    },

    "dropTable": [
        { "itemTemplateId": "material_iron_shard", "dropRate": 0.30 },
        { "itemTemplateId": "weapon_iron_sword_001", "dropRate": 0.05 }
    ],

    "spawnMaps": ["area_ruined_city"],
    "isBoss": false
}
```

**Lưu ý:** Collection này có thể được export ra Excel/Google Sheets để Game Designer chỉnh sửa, sau đó import lại bằng script.

---

### 5. `exploration_logs` - Lịch sử Thám hiểm

Mỗi phiên thám hiểm (từ lúc bấm Start đến Stop/Death) tạo một Document.

```json
{
    "characterId": 12345,
    "mapId": "area_ruined_city",
    "startedAt": "2026-03-05T10:00:00Z",
    "endedAt": "2026-03-05T10:15:00Z",
    "endReason": "death",

    "summary": {
        "nodesVisited": 8,
        "mobsDefeated": 3,
        "mobsLost": 1,
        "totalExpGained": 65,
        "totalGoldGained": 46,
        "itemsObtained": [
            { "itemTemplateId": "material_iron_shard", "quantity": 2 }
        ]
    },

    "nodeHistory": [
        { "nodeId": "n1", "type": "empty" },
        { "nodeId": "n2", "type": "mob", "result": "win" },
        { "nodeId": "n6", "type": "boss", "result": "lose" }
    ]
}
```

---

### 6. `set_definitions` - Định nghĩa Bộ Trang bị

```json
{
    "_id": "iron_crystal_set",
    "name": "Bộ Thiết Tinh",
    "description": "Trang bị rèn từ Thiết Tinh nguyên chất.",
    "pieces": [
        "weapon_iron_sword_001",
        "armor_iron_chest_001",
        "accessory_iron_ring_001",
        "accessory_iron_pendant_001"
    ],
    "bonuses": {
        "2": {
            "description": "+20 Tấn Công",
            "stats": [{ "type": "attack", "value": 20 }]
        },
        "4": {
            "description": "+10% Chí Mạng",
            "stats": [{ "type": "critChance", "value": 0.10 }]
        }
    }
}
```

---

## Mối quan hệ giữa MySQL và MongoDB

```
┌─────────────────────────────────────────────────────────────┐
│                        SERVER (Node.js)                     │
│                                                             │
│  ┌──────────────┐    tham chiếu qua     ┌────────────────┐ │
│  │   MySQL      │    item_template_id    │   MongoDB      │ │
│  │              │ ◄──────────────────── │                │ │
│  │  inventory   │                        │ item_templates │ │
│  │  currencies  │                        │ mob_configs    │ │
│  │  accounts    │    characterId         │ battle_logs    │ │
│  │  characters  │ ──────────────────►   │ chat_logs      │ │
│  │  transactions│                        │ explore_logs   │ │
│  │  gacha_hist  │                        │ set_defs       │ │
│  └──────────────┘                        └────────────────┘ │
│         │                                        │          │
│     Dữ liệu                              Dữ liệu          │
│     NHẠY CẢM                             KHỐI LƯỢNG        │
│     (ACID)                                (Linh hoạt)       │
└─────────────────────────────────────────────────────────────┘
```

**Nguyên tắc phân chia:**
- Dữ liệu **mất là chết** (tiền, đồ, account) → **MySQL**
- Dữ liệu **mất thì tiếc nhưng tái tạo được** (log, config) → **MongoDB**
- Dữ liệu **cần tốc độ tức thời** (countdown, cache) → **Redis** (xem phần khác)

---

## Backup & Bảo trì

- **Backup:** `mongodump` hàng ngày lúc 3:00 AM
- **TTL:** Sử dụng TTL index để tự động dọn dẹp log cũ
- **Monitoring:** Theo dõi collection size, đảm bảo dữ liệu không vượt quá 70% RAM
