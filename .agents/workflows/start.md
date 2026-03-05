---
description: Đọc quy tắc dự án trước khi bắt đầu làm việc
---
// turbo-all

## Quy trình bắt đầu làm việc

1. **Đọc file RULES.md** tại `c:\Users\Admin\Crystallized Iron\RULES.md` để nắm rõ mọi quy tắc dự án.

2. **Kiểm tra GDD** tại `Crystallized_Iron_GDD.md` nếu công việc liên quan đến thiết kế game.

3. **Kiểm tra Docs/** nếu công việc liên quan đến:
   - Chỉ số nhân vật → `Docs/CharacterStats.md`
   - Hệ thống map → `Docs/MapSystem_Architecture.md`
   - Database → `database/mysql/README.md` hoặc `database/mongodb/README.md`
   - Admin Panel → `admin_panel/` (chỉ localhost)

4. Sau khi code xong, chạy kiểm tra TypeScript:
   - Backend: `npx tsc --noEmit` trong folder `backend/`
   - Frontend: `npx tsc --noEmit` trong folder `web_client/`
   - Admin Panel: `npx tsc --noEmit` trong folder `admin_panel/`
