# 📜 QUY TẮC DỰ ÁN - CRYSTALLIZED IRON
# ⚠️ BẮT BUỘC ĐỌC VÀ TUÂN THỦ TRƯỚC MỖI LẦN LÀM VIỆC ⚠️

---

## 🎯 TRẠNG THÁI CÔNG VIỆC (ĐÁNH DẤU [x] VÀO MỤC ĐANG LÀM)

> **Hướng dẫn:** Đánh dấu `[x]` vào (các) mục bạn muốn AI thực hiện.
> AI **CHỈ ĐƯỢC LÀM** những mục được đánh dấu, **KHÔNG LÀM** mục chưa đánh dấu.

### Phạm vi công việc:
- [ ] 💻 **Code** — Viết code, sửa code, thêm tính năng
- [ ] 🔍 **Review Code** — Chỉ đọc và review code, đưa ra nhận xét, KHÔNG sửa code
- [x] 📐 **Viết thiết kế** — Tạo/sửa file thiết kế trong `Docs/`, KHÔNG code
- [ ] 🐛 **Sửa bug** — Tìm và sửa lỗi trong code hiện tại
- [ ] 🧹 **Refactor** — Tái cấu trúc code, cải thiện chất lượng, KHÔNG thêm tính năng mới
- [ ] 📖 **Tài liệu** — Viết/cập nhật README, comment, tài liệu hướng dẫn
- [ ] ❓ **Tư vấn** — Chỉ trả lời câu hỏi, giải thích, KHÔNG sửa bất kỳ file nào

### Phạm vi hệ thống (nếu cần giới hạn):
- [ ] Backend
- [ ] Frontend (Web Client)
- [ ] Database
- [ ] Admin Panel
- [x] Toàn bộ dự án

---

## 1. CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Backend | Node.js + TypeScript | Server 4GB RAM |
| Frontend | Vanilla TS + Vite (Web H5) | KHÔNG dùng Unity |
| Database chính | MySQL (InnoDB) | Dữ liệu nhạy cảm, ACID |
| Database phụ | MongoDB | Log, config, template |
| Cache | Redis | Countdown IDLE, session |
| Networking | REST API + WebSocket | REST cho tĩnh, WS cho realtime |
| Admin Panel | React + TypeScript + Vite | CHỈ chạy trên localhost |

---

## 2. CÁCH LÀM VIỆC

- **Thể loại game:** RPG Chiến thuật tối giản (Text-based / IDLE Management)
- **KHÔNG PHẢI** game hành động, KHÔNG CÓ hoạt ảnh chiến đấu, KHÔNG di chuyển thủ công
- **Đồ họa:** 2D tĩnh, Card-art / Pixel-art tượng trưng
- **Nền tảng:** Web H5 (chỉ Web Client)
- **Mô hình:** Server Authoritative - mọi tính toán logic trên Server
- Trước khi code bất kỳ hệ thống nào, **đọc file thiết kế tương ứng** trong `Docs/`

---

## 3. QUY TẮC VIẾT CODE

### TypeScript
- Strict mode bắt buộc (`strict: true` trong tsconfig)
- Mọi file `.ts` phải pass `tsc --noEmit` trước khi commit
- **KHÔNG** dùng `any` trừ khi bắt buộc (payload từ WebSocket)
- Comment bằng tiếng Việt hoặc tiếng Anh đều được

### Naming Convention
- File: PascalCase (VD: `GameServer.ts`, `MapManager.ts`)
- Interface/Type: PascalCase (VD: `PlayerState`, `ItemTemplate`)
- Biến/hàm: camelCase (VD: `getPlayerById`, `currentHp`)
- Constant: UPPER_SNAKE_CASE (VD: `MAX_LEVEL`, `TICK_INTERVAL`)

### Database
- Dữ liệu nhạy cảm (tài khoản, tiền, inventory) → **MySQL**
- Dữ liệu động, khối lượng lớn (log, template, config) → **MongoDB**
- Cache realtime (countdown, session) → **Redis**
- Mọi thao tác tiền tệ **PHẢI** dùng MySQL Transaction

---

## 4. QUY TẮC BẢO MẬT

- **Server Authoritative:** Mọi tính toán chiến đấu, kinh tế, chỉ số NẰM TRÊN SERVER
- Client chỉ **hiển thị** kết quả, KHÔNG được tính toán damage hay thay đổi chỉ số
- Mọi thay đổi tiền tệ **PHẢI** ghi vào bảng `transactions` (audit trail)
- Mỗi vật phẩm có **ID duy nhất** trong MySQL (chống Dupe)
- Admin Panel **CHỈ** truy cập được từ `localhost` trên server
- KHÔNG tin bất kỳ dữ liệu nào từ Client → luôn validate trên Server

---

## 5. GIAO DIỆN (UI/UX)

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

---

## 6. CẤU TRÚC THƯ MỤC

```
Crystallized Iron/
├── RULES.md                    ← ⚠️ FILE NÀY - QUY TẮC DỰ ÁN
├── Crystallized_Iron_GDD.md    ← Tài liệu thiết kế game tổng quan
├── Docs/                       ← Tài liệu thiết kế hệ thống chi tiết
│   ├── SystemOverview.md       ← ⭐ Tổng quan toàn bộ hệ thống
│   ├── CharacterStats.md       ← Chỉ số nhân vật
│   ├── CombatSystem.md         ← Hệ thống chiến đấu
│   ├── MapSystem_Architecture.md ← Hệ thống bản đồ
│   ├── ItemSystem.md           ← Hệ thống vật phẩm
│   ├── CurrencySystem.md       ← Hệ thống tiền tệ
│   └── LevelingSystem.md       ← Hệ thống cấp độ
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
│   │   ├── schema.sql          ← Bảng MySQL
│   │   └── README.md
│   └── mongodb/
│       ├── schemas.js          ← Collections MongoDB
│       └── README.md
└── admin_panel/                ← Bảng quản trị Admin (CHỈ localhost)
```

---

## 7. QUY TRÌNH LÀM VIỆC

### Bước 1: Đọc quy tắc
- Đọc file `RULES.md` này để nắm rõ các quy tắc bắt buộc

### Bước 2: Đọc bản thiết kế liên quan
- Xác định công việc liên quan đến hệ thống nào
- Đọc file thiết kế tương ứng trong `Docs/`:

| Hệ thống | File thiết kế |
|-----------|--------------|
| Tổng quan hệ thống | `Docs/SystemOverview.md` |
| Chỉ số nhân vật | `Docs/CharacterStats.md` |
| Chiến đấu | `Docs/CombatSystem.md` |
| Bản đồ | `Docs/MapSystem_Architecture.md` |
| Vật phẩm | `Docs/ItemSystem.md` |
| Tiền tệ | `Docs/CurrencySystem.md` |
| Cấp độ | `Docs/LevelingSystem.md` |

### Bước 3: Cập nhật bản thiết kế (nếu cần)
- Nếu công việc yêu cầu **thay đổi thiết kế** (thêm/sửa/xóa tính năng, công thức, chỉ số...):
  1. **Sửa file thiết kế trước** trong `Docs/` cho khớp với mục tiêu mới
  2. **Thông báo cho user** những gì đã sửa trên bản thiết kế
  3. Chờ user xác nhận rồi mới tiến hành code
- Nếu là **hệ thống hoàn toàn mới**: Tạo file thiết kế riêng trong `Docs/` trước khi code

### Bước 4: Code
- Triển khai code theo đúng bản thiết kế đã được xác nhận
- Tuân thủ mọi quy tắc viết code ở mục 3

### Bước 5: Kiểm tra
- Chạy `npx tsc --noEmit` ở cả `backend/`, `web_client/`, và `admin_panel/`
- Đảm bảo không có lỗi TypeScript trước khi commit

---

## 8. NHỮNG ĐIỀU KHÔNG LÀM (TUYỆT ĐỐI CẤM)

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
| 10 | ❌ Tạo giao diện giống game hành động | Không skill bar, joystick |
| 11 | ❌ Sử dụng font serif hoặc quá fancy | Chỉ dùng monospace |
| 12 | ❌ Màu sắc sặc sỡ không theo palette | Tuân thủ color scheme |
| 13 | ❌ Ghi thiết kế hệ thống vào RULES.md | Thiết kế đặt trong Docs/ |
