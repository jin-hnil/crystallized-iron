# ⚙️ HỆ THỐNG MÁY BƠM ĐẨY HÀNG (ITEM PUMP SYSTEM)

Tài liệu này định nghĩa chi tiết về cơ chế hoạt động của các loại **Máy Bơm Đẩy Hàng (Extractors / Pumps)**. Trong **Crystallized Iron**, Ống truyền tải (Enclosed Tubes) là các khoang ống rỗng, chúng không tự động hút vật phẩm. Để lấy đồ từ một Rương (Storage Box) hoặc Máy Móc và đẩy vào hệ thống ống, người chơi BẮT BUỘC phải gắn một Máy Bơm ở cổng ra.

Tuy nhiên, thay vì chia máy bơm theo "Cấp độ" (Mạnh/Yếu), hệ thống Tự động hóa của game chia Máy bơm dựa trên **Cơ Chế Hoạt Động (Operations)** đặc thù để người chơi giải quyết các bài toán Logic khác nhau trong nhà máy.

---

## 1. Các Loại Cơ Chế Máy Bơm

Hệ thống Bơm hiện tại được chia thành 3 cơ chế làm việc độc lập. Người chơi sẽ tùy vòng thiết kế dây chuyền mà chọn lắp loại bơm cho phù hợp.

### 🔴 A. Bơm Rút Tuần Tự (Standard Extractor)
- **Đặc điểm:** Hoạt động liên tục bù non, cắm đầu cắm cổ làm việc.
- **Cơ chế:** Cứ đến chu kỳ (Ví dụ: 1 giây), bộ máy sẽ quét vào Rương Nguồn. Nó nhổm tay vào hút **món đồ đầu tiên** mà nó thấy được và lập tức thổi vào Ống truyền.
- **Ứng dụng:** 
  - Phù hợp tuyệt đối để làm trạm xả tổng (Ví dụ: Xả hết 1 rương đồ hỗn hợp sang 1 kho chứa lớn khác).
  - Kết nối đầu ra của Máy Khoan Đá vào trạm trung chuyển.
- **Hạn chế:** Hoàn toàn MÙ hướng. Nếu Rương có cả Sắt và Đá, nó có quyền bốc đại Đá và nhét vào cái ống đang dẫn đến... Lò Nung luyện Sắt, gây kẹt máy!

### 🟢 B. Bơm Lọc Thông Minh (Smart Filter Pump)
- **Đặc điểm:** Hoạt động dựa trên Danh sách Kiểm Duyệt (Filter List).
- **Cơ chế:** Máy bơm này được trang bị một bảng mạch điện tử. Bạn có thể mở Giao diện người chơi (UI) để cấu hình nó chạy theo 2 quy tắc:
  1. **Whitelist (Chế độ Chỉ Cho Phép):** Bạn bỏ hình cục "Than Đá" vào. Bơm này sẽ lục banh cái Rương chỉ để tìm đúng cục Than Đá và hút lên. Tất cả những thứ khác bị ngó lơ nằm lại Rương.
  2. **Blacklist (Chế độ Danh Sách Đen):** Hút MỌI THỨ để dọn rác, NGOẠI TRỪ những món có trong danh sách cấm (Giữ lại).
- **Ứng dụng:**
  - Lõi phân loại hàng đầu. Bạn có 1 rương chứa hàng Hỗn hợp. Bạn gắn 3 cái Bơm Lọc tỏa ra 3 hướng đi 3 Lò nung khác nhau. Bơm 1 lọc Đồng, Bơm 2 lọc Sắt,...

### 🔵 C. Bơm Xả Tràn (Overflow Pump)
- **Đặc điểm:** Bơm cứu hộ khẩn cấp, chuyên ngủ đông.
- **Cơ chế:** Trong điều kiện nhà máy vận hành trơn tru, Bơm này CÚP ĐIỆN hoàn toàn không làm việc. Nó sở hữu một Cảm biến dung tích `triggerFillPercentage`. Khi lượng hàng trong Rương Nguồn dâng lên quá quy định (Ví dụ: Rương đầy > 80% sức chứa). Bơm Xả Tràn mới thức tỉnh báo động, rống lên và ồ ạt hút hàng hóa dư thừa ra ngoài. 
- **Ứng dụng:**
  - **Tránh sập dây chuyền:** Nếu Rương Nguồn chứa Củi bị kẹt cứng (đầy 100%), Máy Cưa gỗ phía trước sẽ bị nghẽn không xả hàng ra được, làm toàn bộ hệ thống bị đứng hình (Bottleneck). Gắn Bơm Xả Tràn xả Củi dư vào Lò Đốt Rác sẽ giúp nhà xưởng luôn lưu thông luồng chày.

---

## 2. Giao Thức Kết Nối Ống & Giao Lộ
Máy bơm là ngòi nổ, còn thứ định tuyến đường đi nằm ở Ống Kín.
- Đồ vật sau khi bị Cưỡng ép nhổ ra từ Rương qua Máy Bơm sẽ lập tức biến thành **Gói dữ liệu vật lý (TubePayload)**.
- Nó sẽ trượt tốc độ cao không dính vật lý trong Ống chữ nhật (`EnclosedTube`).
- Giữa đường mạng Ống, người chơi có thể xây các Ngã Ba / Ngã Tư (**Smart Filter Splitters**) để bẻ nhánh đi các hướng khác dựa vào nhãn vật phẩm.

*Công nghệ được lập trình theo thiết kế Data chìm, không Load mô hình 3D trên băng tải làm sụt giảm FPS ở cuối game, đảm bảo nhà máy có thể phục vụ hàng vạn ống một lúc.*
