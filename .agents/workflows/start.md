---
description: Đọc quy tắc dự án trước khi bắt đầu làm việc
---
// turbo-all

## Quy trình bắt đầu làm việc

### Bước 1: Đọc quy tắc
- Đọc file `c:\Users\Admin\Crystallized Iron\RULES.md` để nắm rõ mọi quy tắc dự án

### Bước 2: Đọc bản thiết kế liên quan
- Xác định công việc liên quan đến hệ thống nào, đọc file thiết kế tương ứng:
  - ⭐ Tổng quan hệ thống → `Docs/SystemOverview.md`
  - Chỉ số nhân vật → `Docs/CharacterStats.md`
  - Chiến đấu → `Docs/CombatSystem.md`
  - Bản đồ → `Docs/MapSystem_Architecture.md`
  - Vật phẩm → `Docs/ItemSystem.md`
  - Tiền tệ → `Docs/CurrencySystem.md`
  - Cấp độ → `Docs/LevelingSystem.md`
  - Thiết kế game tổng quan → `Crystallized_Iron_GDD.md`
  - Database → `database/mysql/README.md` hoặc `database/mongodb/README.md`

### Bước 3: Cập nhật bản thiết kế (nếu cần)
- Nếu công việc yêu cầu thay đổi thiết kế:
  1. Sửa file thiết kế trong `Docs/` trước
  2. Thông báo cho user những gì đã sửa trên bản thiết kế
  3. Chờ user xác nhận rồi mới code
- Nếu hệ thống mới: tạo file thiết kế riêng trong `Docs/` trước khi code

### Bước 4: Code
- Triển khai code theo đúng bản thiết kế đã xác nhận
- Tuân thủ quy tắc viết code trong RULES.md

### Bước 5: Kiểm tra
- Backend: `npx tsc --noEmit` trong folder `backend/`
- Frontend: `npx tsc --noEmit` trong folder `web_client/`
- Admin Panel: `npx tsc --noEmit` trong folder `admin_panel/`
