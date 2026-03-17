# ⚡ HỆ THỐNG ĐIỆN NĂNG (POWER GRID SYSTEM)

Tài liệu này định nghĩa cách thức Nhà Máy tạo ra năng lượng, phân phối và tiêu thụ Điện (Watts) trong trò chơi **Crystallized Iron**.

---

## 1. Thành phần của Lưới Điện (Power Network)

Hệ thống điện không yêu cầu người chơi tính toán Volt (V) hay Ampe (A) phức tạp, mà chỉ tập trung vào một khái niệm cốt lõi: **Sản Lượng (Generation) vs Tiêu Thụ (Consumption)**. Mọi thứ được nối với nhau bằng Cột điện/Dây cáp sẽ hòa vào cùng 1 Mạng Lưới Phân Phối (Power Grid).

### A. Máy Phát Điện (Generators - Power Sources)
Các công trình chuyên sản xuất điện năng để nuôi sống Base.
1. **Lò Điện Đốt Động Cơ (Burner Generator):**
   - Đốt chất rắn (Than Đá, Than Củi, Gỗ) để đun nước quay tuabin.
   - Sản lượng: 100kW. Yêu cầu liên tục tiếp tế Than qua đường ống hoặc Rương.
2. **Tuabin Quạt Gió (Wind Turbine):**
   - Không tốn nhiên liệu, nhưng sản lượng điện phập phù (dao động từ 10kW - 40kW) tùy theo Thời tiết và Độ cao đặt tháp.
3. **Pin Năng Lượng Mặt Trời (Solar Panel):**
   - Phẳng, rẻ, dán trên mái nhà. Sản sinh 30kW vào ban ngày, nhưng Vô Dụng (0kW) khi trời tối, đòi hỏi phải có Bình Ắc Quy lưu điện ban đêm.
4. **Lò Phản Ứng Hạt Nhân (Nuclear Reactor):** 
   - Sản sinh siêu năng lượng (1000kW). Cần chuỗi làm mát bằng Nước và Thiết Tinh. Nếu ống nước làm mát bị vỡ, lò sẽ lõa tâm phát nổ xóa sổ cả căn cứ.

### B. Cỗ Máy Tiêu Thụ (Consumers - Sinks)
Mọi Máy móc trong game đều chia thành hai chế độ:
- **Chế Độ Ngủ (Idle Power):** Khi máy KHÔNG hoạt động (Rương rỗng, không có quặng để khoan). Tiêu thụ một lượng điện cực nhỏ (~1% Max) gọi là điện chờ để giữ đèn LED tín hiệu sáng.
- **Chế Độ Tải Đỉnh (Active Power):** Khi máy đang cày cuốc mãnh liệt (Máy Khoan đang khoan phá, Lò Nung luyện sắt). Tiêu tốn số kW tối đa đã thiết kế.

### C. Pin Lưu Trữ (Accumulators / Batteries)
Kho chứa điện năng dư thừa.
- Ban ngày, Tấm Pin Mặt Trời dư 200kW điện. Điện này sạc đầy các Ắc quy dự phòng.
- Đêm tới, Ánh sáng tắt, toàn bộ mạng lưới Thiếu hụt điện. Lập tức Ắc quy xả điện (Discharge) để gánh hệ thống tới khi hết bình.

---

## 2. Dây cáp và Cơ chế Rớt Mạng (Blackout)

Việc truyền tải điện được mô phỏng qua các **Cột Điện (Power Poles)** bằng đồng. Bất kể máy nào nằm trong Hào Quang (Bán kính vùng phủ điện) của Cột Điện sẽ tự động cắm rắc không dây vào lưới.

### Sự cố "Sập Cầu Dao" (Power Outage)
Mạng Điện giám sát **Tổng Nhu Cầu (Total Required)** và **Tổng Cung (Total Provided)**.
- **Trạng Thái Xanh:** Cung >= Cầu. Mọi máy móc chạy Max 100% tốc độ.
- **Trạng Thái Thiếu Điện Lờ Mờ (Brownout):** Khi Tổng Nhu Cầu đòi 500kW nhưng Lò Đốt chỉ cấp được 250kW. Toàn bộ Lưới Điện trong khu vực đó sẽ sụt áp. Mọi máy móc (Bao gồm Máy Bơm đồ, Máy Khoan, Đèn, Súng Lase) đồng loạt quay **chậm đi một nửa (50% tốc độ)**. Đèn nhấp nháy báo hiệu Thiếu Than.
- **Trạng Thái Cúp Điện Đỏ (Blackout):** Pin cạn sạch, Lò đốt hết Than hẳnn. Điện = 0. Toàn khu công nghiệp đứng hình. Súng phòng không mất điện không nổ súng tạo cơ hội cho Mutant càng quét.

---

## 3. Quản trị qua Trạm Biến Áp (Substations & Power Switches)
Người chơi có thể xây **Công Tắc Điện Cầu Dao (Power Switch)** để tách mạch điện ra làm nhiều khu.
*Ví dụ:* Cài Cáp Tín Hiệu (Logic Signal) vào Cầu dao nối xuống Khu Mỏ: *"Nếu Rương Chứa Sắt Đầy 100%, dập Cầu Dao ngắt điện cụm nhà Khoan Sắt để dồn điện đun Lò Nung Thiết Tinh."*
