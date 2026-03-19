# 🤖 AGENT RULES - CRYSTALLIZED IRON

Tài liệu này thay thế cho `RULES.md` và các workflow cũ. Đây là nguồn hướng dẫn duy nhất cho AI Agent khi tham gia phát triển dự án này.

---

## 🎯 TỔNG QUAN DỰ ÁN (Survival Shooter 3D)

Dự án đã được reboot: Chuyển hoàn toàn từ Web-based sang **Game Sinh tồn Bắn súng 3D** trên Unity.

- **Thể loại:** Khai thác, Xây dựng, Sinh tồn, Bắn súng (Survival / Crafting / Shooter).
- **Hệ thống nhân vật:** Chỉ quản lý đúng **4 CHỈ SỐ**: Máu (HP), Giáp (Armor), Đói (Hunger), Khát (Thirst).
- **Cơ chế thế giới:** 3D Terrain tự do, chặt cây, đập đá, bắn súng theo dạng Hitbox thực tế.
- **Trạng thái:** Tập trung **Offline/Singleplayer** trước. Lưu file save local (SQLite/JSON).

---

## 🛠️ CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| **Client (Game)**| Unity 3D (C#) | Đồ họa 3D, Sinh tồn Singleplayer |
| **Lưu trữ** | SQLite / JSON | Lưu file trên máy local |
| **Backend/Admin**| Node.js / TS | *(Tạm hoãn)* |

---

## 🔄 QUY TRÌNH LÀM VIỆC (WORKFLOW)

### Bước 1: Khởi đầu (Checklist)
Mỗi khi bắt đầu một phiên làm việc hoặc một task mới, AI Agent **phải**:
1. Đọc tệp thiết kế tương ứng trong `Docs/` (ví dụ: `CharacterStats.md`, `ItemSystem.md`, v.v.)
2. Nếu task yêu cầu thay đổi logic: **Sửa file thiết kế trước**, sau đó mới code.
3. Thông báo cho User những gì đã sửa trên bản thiết kế và chờ xác nhận.

### Bước 2: Viết Code (Unity C#)
- Class & File: **PascalCase** (`PlayerController.cs`).
- Biến private: **camelCase** (`currentHealth`).
- Ưu tiên kế thừa `MonoBehaviour` cho các chức năng vật lý.

### Bước 3: Kiểm tra (Verify)
- Backend/Admin: `npx tsc --noEmit` trong folder tương ứng.
- Đảm bảo tuân thủ "Điều cấm" bên dưới.

---

## 🚫 ĐIỀU CẤM (ABSOLUTE RULES)

1. ❌ **KHÔNG** dùng Web Client cho gameplay chính.
2. ❌ **KHÔNG** dùng hệ thống thẻ bài hoặc Turn-based (Game là Real-time).
3. ❌ **KHÔNG** thêm các chỉ số rườm rà ngoài 4 chỉ số cốt lõi.
4. ❌ **KHÔNG** dùng Map Node Graph (Sử dụng 3D Terrain).

---

## 📂 DANH MỤC TÀI LIỆU QUAN TRỌNG

- **GDD Tổng quan:** `Crystallized_Iron_GDD.md`
- **Hệ thống:** `Docs/SystemOverview.md`, `Docs/ItemSystem.md`, `Docs/CombatSystem.md`
- **MCP Server:** `blender-mcp-v2` (Dùng cho thiết kế model 3D - Bị loại trừ khỏi Git).

---
*Cập nhật lần cuối: 19/03/2026*
