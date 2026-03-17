# 📡 HỆ THỐNG ĐIỀU KHIỂN & TÍN HIỆU (LOGIC & SIGNALING NETWORK)

Tài liệu này định nghĩa chi tiết về Mạng lưới Tín hiệu trong game **Crystallized Iron**. Đây là hệ thống nâng cao cho phép người chơi thiết lập các điều kiện tự động hóa phức tạp theo nguyên tắc Logic (If-Then) thay vì chỉ để máy móc chạy vô tội vạ.

Mạng lưới này chạy hoàn toàn độc lập và song song với Mạng Lưới Ống Vật Phẩm và Mạng Lưới Điện.

---

## 1. Cơ Chế Truyền Tải Tín Hiệu (Signal Routing)

Các máy móc trong thế giới game có thể giao tiếp với nhau bằng những con số vô hình truyền qua Dây Cáp (Cáp Đỏ / Cáp Xanh).

*   **Giá trị Tín hiệu (Signal Value):** Tín hiệu không truyền dòng điện, chúng truyền **Danh tính** và **Số lượng**. Ví dụ, một cái tín hiệu chạy trên cáp có thể là `[IronOre = 1500]` hoặc đơn giản là một rơ-le báo hiệu `[GreenSignal = 1]`.
*   **Mạng Cáp Kép (Red/Green Wires):** Việc chia cáp thành 2 màu giúp người chơi trên cùng một trụ điện có thể kéo 2 luồng dữ liệu độc lập mà không bị dính vào nhau. Giao tiếp tín hiệu chỉ chạy trong nội bộ các máy nối trêm cùng một luồng màu.

---

## 2. Các Thiết Bị Trong Mạng Lưới Logic

Mạng tín hiệu được cấu thành từ 3 mắt xích chính: **Bộ Đọc**, **Bộ Não Phân Tích**, và **Cổng Nhận Lệnh**.

### A. Máy Đọc Số Liệu (Sensors / Readers - Input)
Đây là các bộ phận "Mắt Thần" có nhiệm vụ đếm số liệu ở ngoài đời thực và bơm thông tin đó lên Sợi Cáp.
*   **Cảm Biến Rương (Storage Sensor):** Gắn vào một Rương bất kỳ hoặc Bồn Nước. Nếu rương có 1500 Cục Sắt và 200 Cục Than, Sensor sẽ đánh thẳng sóng tín hiệu `[Iron=1500]` và `[Coal=200]` hòa vào Mạng Lưới cho mọi máy móc khác đứng từ xa đọc được.
*   **Cảm Biến Môi Trường (Environment Sensor):**
    *   **Daylight Sensor:** Đo cường độ ánh sáng Mặt trời. Chuyển nó thành biến `[LightLevel]`. Dùng để làm công tắc thiết lập tự động bật Đèn rọi sáng Căn Cứ khi trời tắt nắng.
    *   **Motion/Radar Sensor:** Quét bán kính xung quanh. Ném tín hiệu báo động `[Enemy=1]` vào mạng lới lưới nếu nhện hắc ám mon men tới gần.

### B. Bộ Phân Tích Logic (Combinators - Processing)
Đây là "Bộ Não". Nó đứng giữa mạng cáp. Nhiệm vụ của nó là Lấy thông tin từ Input, suy luận, rồi Nhả kết quả khác ra mạng Output.
*   **Decider Combinator (So Sánh):** Nó đọc mạng cáp Nhập, và xét theo toán tử của người chơi. *Ví dụ: "Nếu thấy tín hiệu [Coal] < 500, thì nhả ra tín hiệu cầu cứu báo động [RedAlert = 1]"*.
*   **Arithmetic Combinator (Tính toán):** Cộng trừ nhân chia các tín hiệu. *Ví dụ: "Lấy tín hiệu Số Lượng Sắt nhân với Khối Lượng ra Trọng lượng Tàu hỏa"*.

### C. Cổng Nhận Lệnh Cuối (Machine Receiver/Switch - Output)
Đây là "Bàn tay" – Các thiết bị nhận Lệnh để Chạy máy, Tắt máy hoặc Mở cửa.
Bất kỳ máy Bơm nào (ItemPump), Lò Nổ nào (Furnace) hay Đèn Pha nào cũng được gắn Một Bo Mạch Nhận Lệnh `SignalReceiver`.
*   Người chơi nhấn vào Máy Bơm, cài đặt Mệnh lệnh Tĩnh: *"Mày chỉ được thức dậy bơm hàng Khi Mày nhận được Tín Hiệu [RedAlert > 0]"*.
*   Nếu trên đường cáp chưa nhảy `RedAlert = 1`, Máy bơm sẽ Tắt Chế độ Hoạt động (Tắt động cơ Điện sang Idle) và nằm yên mặc kệ Rương chứa đầy tràn mủ. 
*   **Hệ Thống Đóng/Mở Cổng:** Lưới điện có thể nối vào Cửa Thép tự động. Nếu Ra đa quét thấy `[Enemy > 0]`, Cửa thép khổng lồ tự động Sập Chốt Khóa chặn đường xâm nhập của Quái thú.

---

## 3. Lợi ích trong Trò Chơi
Đây là trò chơi tư duy Logic đỉnh cao vào Late Game:
1.  **Dập tắt Điện thừa thãi:** Không còn cảnh Lò nung nuốt than vô tội vạ rèn ra 10 triệu Cục Sắt lấp đầy nhà kho. Bạn nối tín hiệu giới hạn: Mạch đo trong Kho Sắt Rèn có > 1 vạn Cục Sắt. Bộ so sánh bóp cầu dao tự động ngắt điện khu Lò Nung. Giải phóng Điện mặt trời cho Cơ Sở Rèn Vũ Khí Tối Thượng!
2.  **Máy Rót Chất Lỏng Tự Động:** Nếu bồn Dầu rỗng, Bơm Hút Mỏ Dầu chạy. Bồn đầy thì tự tắt.
3.  **Hệ Thống Báo Động (Alarm):** Máy tính nhẩm tính còn quá ít Nhôm. Tự động Nhát nháy Đèn đỏ kêu Réo vang khắp xưởng và Bắn Pháo sáng yêu cầu người chơi đi đào thêm quặng Nhôm.
