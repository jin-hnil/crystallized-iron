# 🗺️ KIẾN TRÚC HỆ THỐNG BẢN ĐỒ (MAP SYSTEM)

Tài liệu này giải thích chi tiết về cách hệ thống bản đồ trong dự án **Crystallized Iron** đang được cấu trúc, lưu trữ và vận hành từ Backend cho đến các công cụ hiển thị.

---

## 1. Cấu trúc Dữ liệu Bản đồ (Data Structure)

Hệ thống Map hiện tại được thiết kế theo dạng **Grid-based Tilemap** (Bản đồ dạng lưới gạch). Mỗi bản đồ không phải là một hình ảnh khổng lồ, mà là một mảng dữ liệu logic, giúp tối ưu bộ nhớ cho cả Server và Client.

Một đối tượng `GameMap` bao gồm các thông số cốt lõi sau:
- `id`: Mã định danh độc nhất của bản đồ (VD: `zone_12345`).
- `name`: Tên hiển thị (VD: "Trại Di Cư").
- `width`: Chiều rộng bản đồ tính bằng số lượng ô (Tile).
- `height`: Chiều cao bản đồ tính bằng số lượng ô.
- `tileSize`: Kích thước pixel thực tế vuông của một ô (hiện tại mặc định là `50px`).
- `layers`: Danh sách các Lớp (Layer) của bản đồ. 

**Tại sao lại dùng Layers?**
Bản đồ được chia thành nhiều lớp để xử lý các logic khác nhau:
1. **Background Layer (Visuals):** Lớp nền hiển thị hình ảnh ngói, cỏ, sàn kim loại (Neon Floor). Định nghĩa cái nhìn thấy được nhưng không có tính chất vật lý.
2. **Collision Layer (Physical/Walls):** Lớp va chạm. Các ô trên lớp này nếu có giá trị `1` sẽ được hệ thống hiểu là "Tường" hoặc "Vật cản" (Obstacle). Các thực thể như Người chơi hoặc Quái vật không thể đi xuyên qua.

*Dữ liệu của mỗi Layer là một mảng 1 chiều (1D Array) với chiều dài bằng `width * height`. Ví dụ: Map 20x15 sẽ có mảng gồm 300 phần tử (chứa các số 0, 1, 2 đại diện cho loại Tile).*

---

## 2. Luồng Xử lý Backend (Node.js)

Tại Backend, chúng ta có một module **`MapManager.ts`** chịu trách nhiệm quản lý:
- **In-Memory Storage:** Hiện tại, khi server start, các Map đang được lưu tạm trên RAM (bộ nhớ trong). (*Trong tương lai, phần này sẽ được tích hợp để lưu trực tiếp vào MongoDB dưới dạng Document*).
- **Default Map:** Khởi tạo sẵn một bản đồ mẫu có viền tường bao quanh khi server vừa chạy để đảm bảo Client có cái để testing ngay.
- **RESTful API:** Cung cấp 3 endpoint qua Express để giao tiếp với Editor và Client:
  - `GET /api/maps`: Trả về danh sách tóm tắt tất cả các map hiện có.
  - `GET /api/maps/:id`: Tải chi tiết một map cụ thể (bao gồm toàn bộ mảng dữ liệu Tile).
  - `POST /api/maps`: Nhận dữ liệu JSON từ Editor để Lưu/Cập nhật một bản đồ mới vào bộ nhớ.

---

## 3. Công cụ Thiết kế Map (Map Editor)

Thay vì code tay từng mảng số liệu, hệ thống đi kèm một App riêng (`map_editor` viết bằng React + Vite). Đây là môi trường đồ họa để Level Designer xây dựng thế giới trực quan:
- **Vòng lặp vẽ (Canvas Rendering):** Editor đọc cấu trúc JSON của Map và dùng HTML5 Canvas để vẽ lên một lưới Grid. Nó lặp qua mảng 1D, quy đổi Index thành tọa độ `(X, Y)` và vẽ màu/icon tương ứng.
- **Công cụ Paint (Bút vẽ):** Hỗ trợ nhấp và kéo chuột để "tô" các ID Tile (như 0: Tẩy xóa, 1: Tường va chạm, 2: Sàn Neon) lên các Layer khác nhau.
- **Đồng bộ hóa:** Nút "SAVE MAP TO SERVER" sẽ gom toàn bộ cấu trúc Map hiện tại, biến thành chuỗi JSON và bắn qua API `POST /api/maps` tới Backend.

---

## 4. Tích hợp vào Game Client (Hướng đi tiếp theo)

Về mặt khái niệm, khi Web Client hoặc Unity Client kết nối vào Game:
1. Người chơi đăng nhập và Server xác định họ đang ở `map_id` nào.
2. Server sẽ báo cho Client biết ID Map.
3. Client sẽ dùng API RESTful (`GET /api/maps/:id`) để tải gói JSON cấu trúc Map.
4. Client dựa vào `width`, `height`, `tileSize` và lớp `Background` để render hình ảnh môi trường.
5. Client dựa vào lớp `Collision` để xây dựng rào chắn vật lý (Collider 2D trong Unity hoặc Logic Boundary chặn tọa độ trong Web Canvas), ngăn nhân vật đi xuyên bản đồ.
6. Server cũng sở hữu các bản đồ này để xác thực (Validate). Nếu Server thấy Client gửi `MOVE` đi xuyên tường, Server sẽ từ chối và "giật" nhân vật về vị trí hợp lệ cũ (Chống Hack Xuyên Tường).
