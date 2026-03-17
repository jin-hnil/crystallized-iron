# 📜 QUY TẮC DỰ ÁN - CRYSTALLIZED IRON
# ⚠️ BẮT BUỘC ĐỌC VÀ TUÂN THỦ TRƯỚC MỖI LẦN LÀM VIỆC ⚠️

---

## 🎯 TRẠNG THÁI CÔNG VIỆC

- [x] 📐 **Viết thiết kế** — Tạo/sửa file thiết kế trong `Docs/`
- [x] 💻 **Toàn bộ dự án** — Thay đổi ý tưởng cốt lõi, từ Web chuyển sang Unity 3D

---

## 1. CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Client (Game)| Unity 3D (C#) | Đồ họa không gian 3D, Sinh tồn Singleplayer/Offline |
| Lưu trữ (Save)| C# Local Save (JSON/XML) hoặc SQLite | Tạm thời không làm Backend/Server. Lưu file save trên máy Local. |

---

## 2. CÁCH LÀM VIỆC & Ý TƯỞNG MỚI (REBOOT)

- **Thể loại game:** Khai thác tài nguyên, Xây dựng căn cứ, Sinh tồn, Chiến đấu & Bắn súng (Survival / Crafting / Shooter).
- **Hệ thống nhân vật:** Vô cùng sát với thực tế. Chỉ quản lý đúng **4 CHỈ SỐ**: Máu (HP), Giáp (Armor), Đói (Hunger), Khát (Thirst).
- **Cơ chế thế giới:** Môi trường 3D mở. Có thể chặt cây, đập đá, cầm súng và bắn súng theo dạng Hitbox thực tế. Không còn trò chơi Text-based/Thẻ bài tĩnh.
- Tất cả tài liệu thiết kế cũ trong `Docs/` đã được viết lại cho phù hợp với Survival Shooter 3D.

---

## 3. QUY TẮC VIẾT CODE

### Unity C#
- Các Scripts C# phải ưu tiên kế thừa `MonoBehaviour` với các chức năng liên quan vật lý.
- Tên class và file `.cs`: **PascalCase** (`PlayerController.cs`).
- Các biến private: **camelCase** (`currentHealth`).

### Backend (Nếu dùng Node.js quản lý DB/Auth)
- Strict TypeScript, Interface định dạng rõ dữ liệu Server-Client.

---

## 4. QUY TẮC BẢO MẬT & MẠNG (ĐÃ TẠM HOÃN)

- Trò chơi hiện đang được tập trung phát triển theo hướng **Offline/Singleplayer trước**. 
- Mọi logic va chạm, nhặt đồ và tính lượng tài nguyên đào được hiện tại sẽ do Client đảm nhận. 
- Quá trình phát triển hệ thống Multiplayer (Server-Client) và chống hack sẽ được hoãn lại.

---

## 5. NHỮNG ĐIỀU KHÔNG LÀM (TUYỆT ĐỐI CẤM - ĐÃ LOẠI BỎ IDEA CŨ)

| # | Điều cấm | Lý do |
|---|----------|-------|
| 1 | ❌ Dùng Web Client | Trò chơi đã chuyển sang dùng engine Unity 3D |
| 2 | ❌ Dùng hệ thống thẻ bài cũ | Gameplay giờ đây là nhặt vật phẩm thể rắn vào Inventory (balo lưới) |
| 3 | ❌ Thêm các thông số rườm rà | Chỉ được giữ lại đúng 4 thông số: Máu, Giáp, Đói, Khát |
| 4 | ❌ Chơi theo lượt (Turn-based / Text Log)| Game là bắn súng, chặt chém thời gian thực kiểu Rust / Tarkov |
| 5 | ❌ Dùng Map Node Graph dạng trước đây | Bản đồ nay đã là 3D Terrain tự do, không đi theo cụm điểm gò bó |
