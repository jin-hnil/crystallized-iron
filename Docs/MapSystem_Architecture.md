# 🗺️ KIẾN TRÚC HỆ THỐNG BẢN ĐỒ (AUTO-EXPLORATION MAP SYSTEM)

Tài liệu này giải thích chi tiết về cách hệ thống bản đồ trong dự án **Crystallized Iron** được cấu trúc và vận hành theo hướng IDLE / Text-based RPG.

---

## 1. Triết lý Thiết kế Bản đồ (Design Philosophy)

Khác với các game MMORPG truyền thống đòi hỏi di chuyển thủ công (WASD/Touch) trên một Tilemap lớn, bản đồ trong Crystallized Iron mang tính **Tượng trưng (Symbolic & Minimalist)**:
1. **Giao diện Mini-map / Sơ đồ tuyến tính:** Bản đồ hiển thị dưới dạng một sơ đồ khu vực (Area Map) hoán dụ hoặc sơ đồ lưới mạng (Node Graph).
2. **Đại diện nhân vật:** Nhân vật của người chơi chỉ hiển thị như một "Chấm sáng" (Dot) hoặc một Biểu tượng nhỏ (Avatar Icon) trên sơ đồ này.
3. **Thám hiểm tự động (Auto-Exploration):** Nhân vật sẽ tự động di chuyển từ điểm này sang điểm khác trên bản đồ theo một tuyến đường định sẵn hoặc ngẫu nhiên (dựa trên thuật toán tìm đường trên đồ thị).
4. **Không có va chạm vật lý (No Collider):** Do không điều khiển bằng tay, hệ thống sẽ bỏ qua việc tính toán va chạm (Wall/Collision), giúp Server nhẹ hơn gấp nhiều lần.

---

## 2. Cấu trúc Dữ liệu Bản đồ (Data Structure)

Hệ thống Map được thiết kế xoay quanh mô hình **Node & Path (Các Điểm và Đường đi)** thay vì Grid Tilemap.

Một đối tượng `AreaMap` bao gồm:
- `id`: Mã định danh độc nhất của bản đồ (VD: `area_ruined_city`).
- `name`: Tên khu vực (VD: "Phế Tích Thiết Tinh").
- `difficultyLevel`: Mức độ khó chung (quyết định chỉ số quái vật).
- `nodes`: Mảng chứa các "Điểm đến" (Nodes). Mỗi Node có thể là:
  - `Trống (Empty)`: Di chuyển an toàn.
  - `Quái thường (Mob)`: Kích hoạt trận chiến tự động qua Battle Log.
  - `Sự kiện (Event)`: Nhặt được thẻ rác, rương báu, hoặc cạm bẫy.
  - `Boss (Thống lĩnh)`: Trận chiến cam go ở cuối bản đồ.
- `paths`: Mảng các liên kết (Edges/Links) chỉ ra Node nào được nối với Node nào.

---

## 3. Luồng Xử lý Backend (Node.js)

Quản lý lộ trình và sự kiện hoàn toàn diễn ra ngầm trên Server:

1. **Khởi tạo chu kỳ (Exploration Loop):** Khi người chơi chọn một Map và ấn "Bắt đầu Thám hiểm", Server gắn ID Map vào State của người chơi.
2. **Tick Time-based:** Dựa vào chỉ số `Speed` của nhân vật hoặc thời gian quy định (VD: 5 giây/Node), Server đẩy nhân vật qua Node tiếp theo.
3. **Roll xắc suất:** Tại mỗi Node, Server tung Random Number Generator (RNG) dựa vào bảng thiết kế `Drop Rate` & `Encounter Rate` để quyết định nhân vật sẽ gặp sự kiện gì.
4. **Tính toán chiến đấu (Headless Combat):** Nếu nhẫm vào Node "Quái", Server lập tức chạy thuật toán so sánh chỉ số (Tấn công phòng thủ) vắng bóng diễn họa, chỉ sinh ra chuỗi JSON kết quả (Text Log Battle). Nhận được đồ vật, hệ thống lưu thẳng vào rương (Database) mà không rơi ra đất.
5. **Gửi Log về Client:** Qua WebSocket, Server đẩy tệp JSON mô tả "Nhân vật đã đến Node 3, gặp Chuột Đột Biến, mất 120 máu, lụm được Áo Giáp Cháy (1 Sao)" xuống thiết bị (Web/Mobile) để hiển thị thành UI mượt mà.

---

## 4. Giao diện Phía Client (Frontend)

Client (Web H5 / Mobile App) đóng vai trò là chiếc màn hình chiếu lại những gì Backend đã quyết định:
- **Map rendering:** Vẽ các Node và đường nối bằng SVG hoặc HTML Canvas mượt mà, tĩnh lặng.
- **Animation đơn giản:** Biểu tượng nhân vật trượt từ Node A sang Node B đính kèm một micro-animation.
- **Battle Log View:** Một khung Box bên dưới sẽ liên tục xổ ra các dòng tin nhắn text cho người chơi biết chuyện gì đang xảy ra trong chuyến đi.
- **Chế độ Ngoại tuyến (Offline IDLE):** Kể cả khi Client tắt, khi mở lên lại, Server sẽ gửi một bức tranh tóm tắt số Node đã vượt qua, số đồ đã nhặt được để đưa thẳng vào Inventory.
