# 🏭 HỆ THỐNG XÂY DỰNG & TỰ ĐỘNG HÓA (BASE BUILDING & AUTOMATION)

Tài liệu này định nghĩa chi tiết về cơ chế Xây dựng Công trình trong **Crystallized Iron**. Thay vì chỉ là nhà cửa sinh tồn che mưa nắng, Căn Cứ (Base) của người chơi đóng vai trò như một cỗ máy công nghiệp thu nhỏ nhằm mục đích khai thác và chế tác tối đa tài nguyên.

---

## 1. Cơ chế Đặt Công Trình (Placement System)

* **Hệ thống Grid / Snapping:** Các công trình cơ bản (Tường, Sàn, Cửa) sẽ tự động bắt dính (Snap) vào nhau để tạo ra các phòng ốc kín kẽ.
* **Tự do (Free-placement):** Các cỗ máy, trụ bảo vệ có thể đặt tự do trên sàn nhà hoặc trên bề mặt tự nhiên (với yêu cầu kiểm tra khoảng cách và độ bằng phẳng).

## 2. Các Phân Nhóm Công Trình (Building Categories)

Trò chơi bao gồm hằng hà sa số các loại công trình, được chia làm các nhóm chức năng chính như sau:

### A. Công trình Kiến Trúc & Che Chắn (Architectural Shells & Housing)
Lớp vỏ bọc nền tảng tạo không gian an toàn, cách ly hệ thống máy móc đắt tiền khỏi môi trường khắc nghiệt, thời tiết và hỏa lực của quái vật:
* **Móng nền (Foundations):** Tấm lát phẳng đặt trên mặt đất đồi núi gồ ghề, tạo mặt dàn đều để dễ dàng lắp ráp băng chuyền và lò nung.
* **Tường, Vách & Trần nhà (Walls & Roofs):** Quây kín máy phát điện và các Rương chứa, bao che chúng khỏi tầm nhìn rình rập của những kẻ đột nhập, chịu sát thương vật lý thay cho các cỗ máy mỏng manh bên trong.
* **Cửa & Cầu thang (Doors & Stairs):** Cửa có khóa mã số (Keycode Lock) chỉ cho phép chủ nhân ra vào. Cầu thang giúp mở rộng Căn cứ lên nhiều lầu, xây dựng nhà máy cao tầng.

### B. Công trình Đào Khoáng (Mining & Extraction)
Thay vì chém tay thủ công, máy móc làm thay bạn:
* **Máy Khoan Đá Tự Động (Auto-Drill):** Đặt trực tiếp lên Mỏ Quặng, sử dụng nhiên liệu để khoan và nhả ra Quặng Thô sau mỗi chu kỳ.
* **Bơm Hút (Pump Jack):** Đặt trên các giếng/hố để hút Nước hoặc dầu mỏ tự nhiên từ dưới lòng đất lên.

### C. Công trình Thu Thập & Chứa Đựng (Storage & Intake)
* **Phễu Thu Thập (Collector Bin):** Nhận đồ do máy khoan rơi ra.
* **Rương Chứa Đồ (Storage Chests):** Từ Rương Gỗ nhỏ gọn đến các Bể Chứa Công Nghiệp sắt tốn lớn (Industrial Silo). Chia lưới inventory cực sâu.
* **Bồn Chứa Lỏng (Liquid Tank):** Khối tích trữ nước dự trữ cho mùa khô.

### D. Công trình Hậu Cần & Vận Tải (Logistics & Transport)
Giao thông vận tải và luân chuyển hàng hóa chia làm hai quy mô rõ rệt:
* **Vận Tải Gần (Short-distance):**
  * **Ống Chuyền Tải Kín (Enclosed Tubes):** Mạng lưới các Ống hình hộp chữ nhật. Chung chuyển khép kín đồ đạc (từ Máy Khoan/Rương) đi dọc nhà máy.
  * **Hệ Thống Máy Bơm Đẩy Hàng (Extractors / Pumps):** Gắn vào mạn sườn của Rương/Máy móc để tạo lực hút/đẩy đồ vật vào Ống. (Đã tách riêng thành Hệ thống các cơ chế chuyên sâu. Xem chi tiết tại ➡️ [PumpSystem.md](PumpSystem.md))
  * **Bộ Lọc Phân Luồng (Smart Splitter / Router):** Một cái hộp giao lộ 1 Ống vào - 3 Ống ra. Dùng khi hàng đã trên ống chạy, bạn muốn rẽ nhánh chúng ở các Ngã 3.
  * **Hệ Thống Ống Bơm Lỏng (Liquid & Gas Piping):** Ống trụ tròn để bơm dẫn nước và nguyên liệu chất đốt từ Bạt Vũng bùn vào bồn chứa hoặc máy làm mát.
* **Vận Tải Xa (Long-distance):**
  * **Đường Đi & Cầu Cống (Roads & Bridges):** Trải nhựa đường, lát sỏi bê-tông hoặc xây dựng những nhịp cầu dài bắc qua khe vực, giúp xe cộ vượt qua những vùng đất gồ ghề bùn lầy một cách bằng phẳng, gia tăng tối đa tốc độ di chuyển và tiết kiệm nhiên liệu.
  * **Phương Tiện Cơ Giới (Xe Tải / Cars):** Chế tạo xe địa hình chuyên chở hàng tấn tài nguyên xuyên qua bản đồ 3D từ Mỏ Khai Thác vất vả về Căn cứ Vệ Tinh. Cần độ bền bỉ và đổ nhiên liệu (Xăng). Máy móc lăn bánh tốt nhất trên Đường Đi đã làm sẵn.
  * **Đường Sắt & Tàu Hỏa (Railways & Trains):** Lắp đặt mạng lưới đường ray dài vạn dặm. Đầu kéo xe lửa tự động chở hàng loạt toa hàng khổng lồ liên kết các Cứ điểm công nghiệp lớn lại với nhau. Cần bảo vệ nghiêm ngặt để tránh kẻ thù chặn tàu cướp quặng.

### E. Công trình Nhà Máy Chế Xuất (Factories & Processing)
* **Lò Nung (Furnace):** Nung tan Đá Sắt thô rớt ra những Phôi Sắt rắn chắc. Cần bỏ than củi vào để đốt.
* **Máy Ép Thiết Tinh (Crystallizer):** Lò phản ứng cao cấp, chuyển hóa áp suất cao rèn thành thiết bị và súng ống xịn.
* **Bàn Chế Tạo (Workbench):** Nơi người chơi tương tác làm tay các đồ vật sinh tồn nhỏ lẻ.

### F. Công trình Phòng Thủ Bọc Lót (Defense & Fortification)
Bảo vệ vòng ngoài bảo bọc cho lớp Tường nhà xưởng và Thành quả lao động:
* **Hàng Rào Điện / Cửa Cuốn (Electric Fences & Rolling Gates):** Từ vách gỗ chặn đường đơn sơ đến lưới điện cao áp đánh bật kẻ địch.
* **Tháp Canh Pháo Tự Động (Auto-Turrets):** Cần nạp đạn thủ công (Hoặc nối dây chuyền), tự động khóa mục tiêu chĩa súng nổ súng vào bất kỳ sinh vật nào có ý đồ cắn xé nhà bạn.
* **Bệ Tên Lửa Phòng Không (Anti-Air SAMs):** Bắn hạ các sinh vật đột biến có cánh lượn lờ thả độc từ trên mây.
* **Bẫy Đạp (Traps):** Bàn chông gỗ, Bẫy Điện báo động rà quét.

### G. Công trình Tấn Công & Viễn Chinh (Offensive & Recon Warfare)
Sử dụng khi bạn muốn vây hãm, mở rộng lãnh địa hoặc phòng ngự tầm xa:
* **Pháo Cối (Mortar):** Nhắm bắn đạn nổ vòng cung qua núi tiêu diệt các ổ Quái Vật từ lúc chúng chưa tới nhà.
* **Tên Lửa Đạn Đạo (Ballistic Missiles):** Cơ sở quân sự khổng lồ. Yêu cầu tọa độ GPS, nhả ra quả rocket quét sạch toàn bộ lũ Mutant trên một khu vực rộng lớn. Rất tốn Uranium/Thiết Tinh.
* **Trạm Cất Cánh Drone (Drone Pad):** Nơi chế tạo và điều khiển máy bay không người lái. Gồm Drone Trinh Sát (nhỏ, nhanh, gắn Camera soi map) và Drone Cảm Tử Kamikaze (chứa C4 tông thẳng vào Boss).

### H. Công trình Sửa Chữa & Năng Lượng (Repair & Power)
* **Máy Phát Điện (Generators):** Đốt Sắt / Than để phát điện, hoặc Tấm Pin Mặt Trời lưới điện nối dây vào các Trụ Pháo và Nhà máy.
* **Lưới Điện (Power Grid):** Sử dụng Cột Điện nối dây để gom điện cung cấp cho các máy Tiêu thụ. (Xem chi tiết ➡️ [PowerSystem.md](PowerSystem.md)).
* **Trạm Sửa Chữa (Repair Station):** Rìu súng nứt mẻ bỏ vào trạm này đập búa vào sẽ tự đầy thanh độ bền. Xài điện hoặc tài nguyên phụ phí.

### I. Hệ thống Điều Khiển (Logic & Signaling Network)
Ngoài mạng lưới Ống hút đẩy đồ vật và Lưới Điện, game còn cung cấp một mạng lưới Tín hiệu Mạch điện tinh vi để điều khiển toàn bộ nhà máy hoạt động thông minh theo điều kiện (If-Then) tự động.
* **Mạng Lưới Tín Hiệu:** Gồm Dây Cáp Màu, Cảm biến Rương, Cảm biến Ánh Sáng/Quái vật, và các Bộ Não so sánh logic. 
* **Tự động hóa:** Giúp Máy bơm, Cửa rào, Đèn pha, Cầu dao tự động Bật/Tắt mà không cần người chơi canh chỉnh bằng tay. (Chi tiết cơ chế xem tại ➡️ [SignalSystem.md](SignalSystem.md)).

## 3. Tầm Quan Trọng Về Mặt Lối Chơi
1. **Giai đoạn đầu:** Thô sơ. Lạc lõng. Tự lấy búa cuốc đập đá lẻ tẻ, xây 1 cái nhà chòi giấu cái giường rơm.
2. **Giai đoạn cuối:** Trở thành người Kỹ sư điều hành cả một mạng lưới Công Nghiệp Cơ Khí khổng lồ. Vừa cầm súng M4 đi săn, vừa thiết kế băng chuyền rào điện hoàn hảo. Chạy được một cỗ máy tự làm việc đem lại cảm giác thành tựu lớn nhất cho người chơi.
