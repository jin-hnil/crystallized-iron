# 🏗️ TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Tài liệu này mô tả tổng quan toàn bộ hệ thống trong dự án **Crystallized Iron** — một game RPG Chiến thuật tối giản (Text-based / IDLE Management) trên nền Web H5.

---

## 1. Tổng quan dự án

| Thông tin | Chi tiết |
|-----------|----------|
| **Tên dự án** | Crystallized Iron |
| **Thể loại** | RPG Chiến thuật tối giản (Text-based / IDLE Management) |
| **Bối cảnh** | Thế giới hậu tận thế, khai thác cổ vật Thiết Tinh |
| **Nền tảng** | Web H5 (Browser) |
| **Mô hình** | Server Authoritative — mọi logic trên Server |
| **Doanh thu** | Free to Play + In-App Purchase |
| **Độ tuổi** | 12+ |

### Điểm cốt lõi:
- **KHÔNG PHẢI** game hành động — không có hoạt ảnh chiến đấu, không di chuyển thủ công
- Đồ họa 2D tĩnh, phong cách Card-art / Pixel-art tượng trưng
- Chiến đấu hiển thị qua Text Log (nhật ký văn bản)
- Thám hiểm tự động (Auto-Explore) trên bản đồ Node Graph

---

## 2. Sơ đồ hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    CRYSTALLIZED IRON                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │ Nhân vật │──▶│ Chiến đấu│──▶│ Phần thưởng      │    │
│  │ & Chỉ số │   │ Text Log │   │ (EXP, Vàng, Đồ)  │    │
│  └────┬─────┘   └────┬─────┘   └────────┬─────────┘    │
│       │              │                   │              │
│       ▼              ▼                   ▼              │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐    │
│  │ Cấp độ   │   │ Bản đồ   │   │ Vật phẩm         │    │
│  │ & EXP    │   │ Node Graph│   │ & Trang bị       │    │
│  └──────────┘   └──────────┘   └────────┬─────────┘    │
│                                          │              │
│                                          ▼              │
│                                 ┌──────────────────┐    │
│                                 │ Tiền tệ & Kinh tế│    │
│                                 │ (Vàng, Kim Cương) │    │
│                                 └──────────────────┘    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  HẠ TẦNG: Node.js │ MySQL │ MongoDB │ Redis │ WebSocket│
└─────────────────────────────────────────────────────────┘
```

---

## 3. Danh sách hệ thống

### 3.1 🧑‍💻 Hệ thống Nhân vật (Character System)
> Thiết kế chi tiết: [CharacterStats.md](CharacterStats.md)

**Mô tả:** Quản lý toàn bộ thông tin và chỉ số của nhân vật người chơi.

**Chức năng:**
- Tạo nhân vật với chỉ số khởi điểm mặc định
- Quản lý HP/MP (máu/năng lượng)
- 6 chỉ số chiến đấu: Attack, Defense, Accuracy, Evasion, Speed, CritChance
- 2 chỉ số kháng tính: Magic Resistance, Effect Resistance
- Phân bổ Stat Points khi lên cấp (người chơi tự chọn)
- Đồng bộ trạng thái giữa Server ↔ Client

**Dữ liệu:** MySQL (tài khoản, chỉ số) + Redis (cache session)

---

### 3.2 ⚔️ Hệ thống Chiến đấu (Combat System)
> Thiết kế chi tiết: [CombatSystem.md](CombatSystem.md)

**Mô tả:** Xử lý toàn bộ logic trận đánh dưới dạng Text Log, không có hoạt ảnh.

**Chức năng:**
- Tính toán sát thương: `max(1, ATK - DEF) × random(0.8, 1.2)`
- Roll chí mạng: `Sát thương × 1.8` khi roll < critChance
- Tính tỷ lệ đánh trúng: `Accuracy - Evasion`
- Quyết định thứ tự hành động theo Speed
- Sinh ra Battle Log (JSON) cho mỗi turn
- Gửi kết quả về Client qua WebSocket
- Xử lý khi người chơi thua (HP = 0)

**Dữ liệu:** MongoDB (lưu battle log) — Tính toán hoàn toàn trên Server

---

### 3.3 🗺️ Hệ thống Bản đồ & Thám hiểm (Map & Exploration System)
> Thiết kế chi tiết: [MapSystem_Architecture.md](MapSystem_Architecture.md)

**Mô tả:** Quản lý bản đồ Node Graph và vòng lặp thám hiểm tự động (Auto-Explore).

**Chức năng:**
- Hiển thị bản đồ dạng Node Graph (không phải Tilemap)
- 5 loại Node: `Empty`, `Mob`, `Boss`, `Treasure`, `Event`
- Auto-Explore: Server tự động di chuyển nhân vật ~4 giây/Node
- Roll sự kiện ngẫu nhiên tại mỗi Node (Drop Rate, Encounter Rate)
- Kích hoạt chiến đấu khi gặp Node Mob/Boss
- Nhặt vật phẩm tự động khi gặp Node Treasure
- Hỗ trợ Offline Farming — Server tính toán khi người chơi offline
- Quản lý nhiều bản đồ với độ khó khác nhau

**Dữ liệu:** MongoDB (map templates, map config) + Redis (exploration state, countdown)

---

### 3.4 🎴 Hệ thống Vật phẩm (Item System)
> Thiết kế chi tiết: [ItemSystem.md](ItemSystem.md)

**Mô tả:** Quản lý trang bị, cổ vật dưới dạng Thẻ bài (Item Cards) với phẩm chất và chỉ số ngẫu nhiên.

**Chức năng:**
- 6 mức phẩm chất: ⬜ Trắng (1★) → 🌟 Huyền thoại (6★)
- Roll chỉ số phụ (Sub-stats) ngẫu nhiên khi item sinh ra
- 5 chỉ số chính: Attack, Defense, HP, Accuracy, Evasion
- Cường hóa (Enhance): Dùng thẻ rác làm nguyên liệu nâng cấp thẻ chính
- Khảm nạm ngọc (Socketing): Gắn ngọc vào slot trang bị
- Mỗi item có ID duy nhất (chống hack Dupe)
- Nguồn gốc: Chỉ từ Thám hiểm, Nhiệm vụ IDLE, hoặc Gacha

**Dữ liệu:** MongoDB (item templates) + MySQL (inventory instance, ID duy nhất)

---

### 3.5 💰 Hệ thống Tiền tệ & Kinh tế (Currency System)
> Thiết kế chi tiết: [CurrencySystem.md](CurrencySystem.md)

**Mô tả:** Quản lý 2 loại tiền tệ và toàn bộ giao dịch kinh tế trong game.

**Chức năng:**
- **Vàng (Gold):** Kiếm từ thám hiểm, bán đồ → dùng cường hóa, nâng cấp
- **Kim Cương (Diamonds):** IAP/Event → skip time, Gacha, mở rộng kho
- Mọi giao dịch bắt buộc MySQL Transaction (START/COMMIT)
- Audit trail: Mọi thay đổi tiền tệ ghi vào bảng `transactions`
- Kiểm tra số dư trước khi trừ tiền
- Cash Shop (giai đoạn Beta)

**Dữ liệu:** MySQL **ONLY** (đảm bảo ACID, KHÔNG lưu tiền ở MongoDB)

---

### 3.6 📈 Hệ thống Cấp độ (Leveling System)
> Thiết kế chi tiết: [LevelingSystem.md](LevelingSystem.md)

**Mô tả:** Quản lý kinh nghiệm (EXP) và tiến trình lên cấp của nhân vật.

**Chức năng:**
- Công thức: `XP_Required = floor(100 × Level^2.5 + 500 × Level)`
- Max Level: 100 (khóa EXP = Infinity tại lv100)
- Lên cấp: +5 Stat Points, hồi đầy HP/MP
- Hỗ trợ lên nhiều cấp cùng lúc (nếu EXP dư đủ)
- Nguồn EXP: Tiêu diệt quái/boss, hoàn thành nhiệm vụ

**Dữ liệu:** MySQL (experience, level, statPoints trong bảng players)

---

## 4. Hệ thống hỗ trợ

### 4.1 💬 Chat toàn cầu (World Chat)
**Mô tả:** Cho phép người chơi giao tiếp trong game.

**Chức năng:**
- Chat toàn cầu (World Chat) realtime qua WebSocket
- Hiển thị trong tab "World Chat" ở nửa dưới giao diện
- Lưu trữ lịch sử chat

**Dữ liệu:** MongoDB (chat logs)

---

### 4.2 🛡️ Admin Panel
**Mô tả:** Bảng điều khiển quản trị dành cho quản lý game data.

**Chức năng:**
- Quản lý Maps, Items, Characters, Accounts
- CHỈ truy cập được từ `localhost` trên server
- Xây dựng bằng React + TypeScript + Vite

---

## 5. Luồng chơi chính (Core Game Loop)

```
┌─────────────────────────────────────────────────────┐
│                  CORE GAME LOOP                      │
│                                                      │
│   ┌─────────┐     ┌──────────┐     ┌────────────┐   │
│   │ 1. Chọn │────▶│ 2. Thám  │────▶│ 3. Gặp     │   │
│   │ Bản đồ  │     │ hiểm tự  │     │ sự kiện    │   │
│   │         │     │ động     │     │ tại Node   │   │
│   └─────────┘     └──────────┘     └─────┬──────┘   │
│                                          │           │
│                    ┌─────────────────────┐│           │
│                    ▼                     ▼▼           │
│              ┌──────────┐         ┌──────────┐       │
│              │ 4a. Chiến│         │ 4b. Nhặt │       │
│              │ đấu (Log)│         │ vật phẩm │       │
│              └────┬─────┘         └────┬─────┘       │
│                   │                    │             │
│                   ▼                    ▼             │
│              ┌─────────────────────────────┐         │
│              │ 5. Nhận phần thưởng         │         │
│              │ (EXP, Vàng, Trang bị)       │         │
│              └──────────────┬──────────────┘         │
│                             │                        │
│                             ▼                        │
│              ┌─────────────────────────────┐         │
│              │ 6. Nâng cấp nhân vật        │         │
│              │ (Lên level, Cường hóa đồ,   │         │
│              │  Phân bổ điểm chỉ số)       │         │
│              └──────────────┬──────────────┘         │
│                             │                        │
│                             ▼                        │
│                     ┌──────────────┐                 │
│                     │ 7. Lặp lại   │                 │
│                     │ (Map khó hơn)│                 │
│                     └──────────────┘                 │
└─────────────────────────────────────────────────────┘
```

---

## 6. Kiến trúc kỹ thuật

```
┌──────────────┐         ┌──────────────────────────────┐
│  Web Client  │◀──WS───▶│        Backend (Node.js)     │
│  (Vite + TS) │◀──REST──▶│                              │
│              │         │  ┌────────────────────────┐   │
│  - Minimap   │         │  │  GameServer (WS)       │   │
│  - Card-Art  │         │  │  ExplorationManager    │   │
│  - Log Box   │         │  │  Player                │   │
│  - Chat      │         │  │  MapManager            │   │
└──────────────┘         │  └────────────────────────┘   │
                         │              │                │
                         │    ┌─────────┼─────────┐      │
                         │    ▼         ▼         ▼      │
                         │ ┌──────┐ ┌───────┐ ┌──────┐   │
                         │ │MySQL │ │MongoDB│ │Redis │   │
                         │ │      │ │       │ │      │   │
                         │ │Tài   │ │Log    │ │Cache │   │
                         │ │khoản │ │Chat   │ │Count │   │
                         │ │Tiền  │ │Battle │ │down  │   │
                         │ │Item  │ │Template│ │Session│  │
                         │ └──────┘ └───────┘ └──────┘   │
                         └──────────────────────────────┘
```

---

## 7. Tài liệu liên quan

| File | Nội dung |
|------|----------|
| [CharacterStats.md](CharacterStats.md) | Chi tiết chỉ số nhân vật |
| [CombatSystem.md](CombatSystem.md) | Công thức và luồng chiến đấu |
| [MapSystem_Architecture.md](MapSystem_Architecture.md) | Kiến trúc bản đồ Node Graph |
| [ItemSystem.md](ItemSystem.md) | Hệ thống vật phẩm và phẩm chất |
| [CurrencySystem.md](CurrencySystem.md) | Tiền tệ và quy tắc giao dịch |
| [LevelingSystem.md](LevelingSystem.md) | Công thức EXP và lên cấp |
| [../Crystallized_Iron_GDD.md](../Crystallized_Iron_GDD.md) | Game Design Document tổng quan |
| [../RULES.md](../RULES.md) | Quy tắc dự án bắt buộc |
