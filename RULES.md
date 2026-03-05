# 📜 QUY TẮC DỰ ÁN - CRYSTALLIZED IRON
# ⚠️ BẮT BUỘC ĐỌC VÀ TUÂN THỦ TRƯỚC MỖI LẦN LÀM VIỆC ⚠️

---

## 1. TỔNG QUAN DỰ ÁN

- **Tên dự án:** Crystallized Iron
- **Thể loại:** RPG Chiến thuật tối giản (Text-based / IDLE Management)
- **KHÔNG PHẢI** game hành động, KHÔNG CÓ hoạt ảnh chiến đấu, KHÔNG di chuyển thủ công
- **Đồ họa:** 2D tĩnh, Card-art / Pixel-art tượng trưng
- **Nền tảng:** Web H5 (chỉ Web Client, KHÔNG dùng Unity)
- **Độ tuổi:** 12+ (ít bạo lực, không đẫm máu)

---

## 2. KIẾN TRÚC KỸ THUẬT

### Stack bắt buộc:
| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Backend | Node.js + TypeScript | Server 4GB RAM |
| Frontend | Vanilla TS + Vite (Web H5) | KHÔNG dùng Unity |
| Database chính | MySQL (InnoDB) | Dữ liệu nhạy cảm, ACID |
| Database phụ | MongoDB | Log, config, template |
| Cache | Redis | Countdown IDLE, session |
| Networking | REST API + WebSocket | REST cho tĩnh, WS cho realtime |

### Quy tắc code:
- TypeScript strict mode (`strict: true` trong tsconfig)
- Mọi file `.ts` phải pass `tsc --noEmit` trước khi commit
- Không dùng `any` trừ khi bắt buộc (payload từ WebSocket)
- Comment bằng tiếng Việt hoặc tiếng Anh đều được

---

## 3. HỆ THỐNG CHIẾN ĐẤU

### PHẢI tuân thủ:
- Chiến đấu = **Text Log** (nhật ký văn bản), KHÔNG có hoạt ảnh
- Kết quả trận đánh tính toán hoàn toàn trên **Server** (Authoritative)
- Client chỉ **hiển thị** kết quả, KHÔNG được tính toán damage

### Công thức cơ bản:
```
Sát thương thực tế = max(1, Tấn công - Phòng thủ) × random(0.8, 1.2)
Chí mạng = Sát thương × 1.8 (nếu roll < critChance)
Tỷ lệ đánh trúng = Chính xác tấn công - Né tránh phòng thủ
Thứ tự hành động = So sánh Speed, cao hơn đánh trước
```

### 6 chỉ số chiến đấu:
| Chỉ số | Field name | Mặc định Lv.1 |
|--------|-----------|---------------|
| Tấn công | `attack` | 10 |
| Phòng thủ | `defense` | 5 |
| Chính xác | `accuracy` | 100 |
| Né tránh | `evasion` | 5 |
| Tốc độ | `speed` | 10 |
| Chí mạng | `critChance` | 0.05 (5%) |

---

## 4. HỆ THỐNG BẢN ĐỒ

### PHẢI tuân thủ:
- Bản đồ = **Node Graph** (đồ thị điểm nối), KHÔNG phải Tilemap
- Nhân vật hiển thị = **Chấm nhỏ / Avatar icon** trên minimap
- Thám hiểm = **Tự động (Auto-Explore)**, KHÔNG điều khiển tay
- Mỗi Node có type: `empty` | `mob` | `boss` | `treasure` | `event`
- Server tick mỗi ~4 giây đẩy nhân vật sang Node tiếp theo

### KHÔNG ĐƯỢC:
- ❌ Tạo tilemap grid ô vuông
- ❌ Cho phép người chơi di chuyển WASD/Arrow
- ❌ Xây dựng hệ thống va chạm (Collision)

---

## 5. HỆ THỐNG VẬT PHẨM

### Quy tắc cốt lõi:
- Mỗi vật phẩm có **ID duy nhất** trong MySQL (chống Dupe)
- Template vật phẩm lưu trong **MongoDB** (`item_templates`)
- Instance vật phẩm (đã roll stats) lưu trong **MySQL** (`inventory`)
- Chỉ số phụ (Sub-stats) **ngẫu nhiên** khi sinh ra

### Phẩm chất:
| Màu | Độ hiếm | Số dòng phụ |
|-----|---------|-------------|
| ⬜ Trắng | 1★ | 0-1 |
| 🟦 Xanh | 2★ | 1-2 |
| 🟪 Tím | 3★ | 2-3 |
| 🟧 Cam | 4★ | 3 |
| 🟥 Đỏ | 5★ | 3-4 |
| 🌟 Huyền thoại | 6★ | 4 |

---

## 6. HỆ THỐNG TIỀN TỆ

| Loại | Tên | Nguồn | Dùng để |
|------|-----|-------|---------|
| Cày cuốc | Vàng (Gold) | Thám hiểm, bán đồ | Cường hóa, nâng cấp |
| Nạp tiền | Kim Cương (Diamonds) | IAP, event | Skip time, Gacha, mở rộng kho |

### Quy tắc giao dịch:
- MỌI thay đổi tiền tệ PHẢI ghi vào bảng `transactions`
- MỌI thao tác tiền PHẢI nằm trong MySQL Transaction (START/COMMIT)
- KHÔNG ĐƯỢC trừ tiền nếu số dư không đủ

---

## 7. GIAO DIỆN (UI/UX)

### Layout chính:
- **Nửa trên:** Minimap Node Graph + Thẻ bài nhân vật (Card-Art)
- **Nửa dưới:** Khung Log (giống khung chat) với 2 tab:
  - Tab "Battle Log" (mặc định) - Nhật ký thám hiểm & chiến đấu
  - Tab "World Chat" - Chat toàn cầu (có ô nhập tin nhắn)

### Phong cách:
- Sci-fi / Hologram / Kim loại rỉ sét
- Font: `Courier New` hoặc monospace
- Màu chủ đạo: Neon blue `#00f0ff`, Neo-red `#ff3366`
- Background tối `#0b101a`

### KHÔNG ĐƯỢC:
- ❌ Tạo giao diện giống game hành động (skill bar, joystick)
- ❌ Sử dụng font serif hoặc font quá fancy
- ❌ Màu sắc sặc sỡ không theo palette

---

## 8. CẤU TRÚC THƯ MỤC

```
Crystallized Iron/
├── RULES.md                    ← ⚠️ FILE NÀY - ĐỌC TRƯỚC
├── Crystallized_Iron_GDD.md    ← Tài liệu thiết kế game
├── Docs/                       ← Tài liệu kỹ thuật chi tiết
│   ├── CharacterStats.md
│   ├── MapSystem_Architecture.md
│   └── LevelingSystem.md
├── backend/                    ← Node.js Server
│   └── src/
│       ├── index.ts            ← Entry point
│       ├── types.ts            ← Interfaces & Enums
│       ├── Player.ts           ← Class nhân vật
│       ├── GameServer.ts       ← WebSocket handler
│       ├── MapManager.ts       ← Quản lý Node Graph maps
│       ├── ExplorationManager.ts ← Vòng lặp auto-explore
│       └── db.ts               ← MySQL connection
├── web_client/                 ← Frontend (Vite + TS)
│   ├── index.html
│   └── src/
│       ├── main.ts
│       └── style.css
├── database/
│   ├── mysql/
│   │   ├── schema.sql          ← 6 bảng MySQL
│   │   └── README.md
│   └── mongodb/
│       ├── schemas.js          ← 6 collections MongoDB
│       └── README.md
└── admin_panel/                ← Bảng quản trị Admin (CHỈ localhost)
```

---

## 9. QUY TRÌNH LÀM VIỆC

1. **Trước khi code:** Đọc file `RULES.md` này
2. **Trước khi sửa chỉ số:** Kiểm tra `Docs/CharacterStats.md`
3. **Trước khi sửa map:** Kiểm tra `Docs/MapSystem_Architecture.md`
4. **Sau khi code:** Chạy `npx tsc --noEmit` ở cả `backend/` và `web_client/`
5. **Trước khi commit:** Đảm bảo không có lỗi TypeScript

---

## 10. ĐIỀU CẤM KỴ (TUYỆT ĐỐI KHÔNG LÀM)

| # | Điều cấm | Lý do |
|---|----------|-------|
| 1 | ❌ Thêm Unity Client | Dự án chỉ dùng Web |
| 2 | ❌ Tạo tilemap / grid map | Map là Node Graph |
| 3 | ❌ Thêm hoạt ảnh chiến đấu | Combat = Text Log |
| 4 | ❌ Cho client tính damage | Server Authoritative |
| 5 | ❌ Lưu tiền ở MongoDB | Tiền chỉ ở MySQL (ACID) |
| 6 | ❌ Xóa bảng transactions | Bắt buộc audit trail |
| 7 | ❌ Dùng `any` type tràn lan | TypeScript strict |
| 8 | ❌ Commit code lỗi tsc | Phải pass noEmit trước |
| 9 | ❌ Tự chạy dev server / process ngầm | Chỉ đưa ra lệnh, để người dùng tự chạy |
