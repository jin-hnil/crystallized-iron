# 📄 TÀI LIỆU THIẾT KẾ GAME (GDD): CRYSTALLIZED IRON

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án (Dự kiến):** Crystallized Iron (Huyền Thoại Chỉ Số / Gear Master Online)
- **Thể loại:** RPG Chiến thuật tối giản (Text-based / IDLE Management).
- **Độ tuổi mục tiêu:** 12+ (Phù hợp với lối chơi trí tuệ, ít bạo lực).
- **Cốt truyện & Bối cảnh:** Thế giới hậu tận thế nơi sức mạnh không đến từ kỹ năng chiến đấu trực tiếp mà đến từ việc khai thác và chế tác cổ vật (Thiết Tinh - Crystallized Iron). Người chơi vào vai một "Nhà sưu tầm" (Collector) đi tìm kiếm các mảnh vỡ lịch sử để phục dựng lại sức mạnh của nhân vật.
- **Phong cách đồ họa:** Sử dụng hình ảnh 2D tĩnh, phong cách Card-art hoặc Pixel-art tượng trưng. Các trận đánh được hiển thị qua các dòng trạng thái (Log) và sự thay đổi của thanh máu/năng lượng.
- **Nền tảng mục tiêu:** Web H5, Mobile (Android/iOS).
- **Mô hình doanh thu định hướng:** Free to Play (Miễn phí tải & chơi) kết hợp In-App Purchase.

---

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)
Hệ thống được thiết kế hướng tới khả năng Scale (mở rộng) và Real-time (thời gian thực) đối với các event server, phục vụ lượng người chơi lớn với tài nguyên cực kỳ giới hạn (Máy chủ 4GB RAM).

### A. Hạ tầng Server (Phù hợp với 4GB RAM)
Với 4GB RAM, việc đảm bảo game chịu tải được hệ thống IDLE đòi hỏi công nghệ tối ưu cao dữ liệu tĩnh và bộ đệm:
- **Backend Chính:** **Node.js** được lựa chọn làm giải pháp phát triển server.
  - *Lý do:* Hệ sinh thái đa dạng, phát triển nhanh. Để đảm bảo tính ổn định trên cấu hình giới hạn, hệ thống áp dụng cơ chế quản lý bộ nhớ cẩn thận và tính toán off-chain khi offline.
- **Client App:** Chỉ sử dụng công nghệ Frontend Web hiện đại như **React/Vue/Svelte** (chạy trên Desktop Browser hoặc đóng gói PWA/Web-View cho Mobile). Đây là giải pháp tối ưu nhất cho thể loại IDLE Text-based, chạy mượt mà, siêu nhẹ, không cần cài đặt nặng nề, và đặc biệt dễ dàng cập nhật UI/UX liên tục.
- **Networking:** RESTful API cho các tác vụ tĩnh (trang bị, nâng cấp) kết hợp **WebSockets (TCP)** cho tính năng chat hoặc hoạt động thời gian thực (Đấu giá, Lập log thời gian thực với Boss Thế Giới).

### B. Chiến lược Cấu trúc Cơ Sở Dữ Liệu (Database & Caching)
Sử dụng độc lập 1 loại DB (như MongoDB) trong game nhặt đồ dễ dẫn đến rủi ro Dupe. Hệ thống do đó áp dụng mô hình liên kết đặc biệt:

1. **MySQL (RDBMS - Dữ liệu Cốt lõi Nhạy cảm):**
   - **Lưu trữ:** Thông tin Tài khoản, Tiền tệ (Kim Cương/Vàng), Giao dịch, và Inventory (Hành trang - ID rác, Cổ vật).
   - **Tác dụng:** Đảm bảo tính toàn vẹn ACID. Mỗi vật phẩm có ID riêng biệt được quản lý chặt trên Database để chống hack/cheat chỉ số.
2. **MongoDB (NoSQL - Dữ liệu Khối lượng lớn & Động):**
   - **Lưu trữ:** Log đoạn Chat toàn cầu/riêng tư, Nhật ký Log chiến đấu, Thiết lập phân lớp thẻ đồ (các Item Schemas mở rộng ngẫu nhiên).
   - **Tác dụng:** Đọc/Ghi nhanh dòng phụ (Sub-stats) thay đổi không giới hạn.
3. **Redis (In-Memory Caching - Dữ liệu Thời gian thực):**
   - **Lưu trữ:** Bộ đếm thời gian (IDLE countdown) cho người chơi lúc offline/thám hiểm, Cache chỉ số sức mạnh khi load game.

---

## 3. CƠ CHẾ GAMEPLAY CỐT LÕI (CORE LOOP)
Vòng lặp chơi game tập trung vào 3 trụ cột (IDLE Management):

### A. Hệ thống Thám hiểm Tự động (Auto-Exploration Map)
- **Map Tượng trưng (Minimap/Node Graph):** Bản đồ không còn là một thế giới 2D rộng lớn để di chuyển thủ công. Thay vào đó, nó hiển thị dưới dạng một sơ đồ khu vực (Area Map) hoán dụ hoặc sơ đồ lưới mạng các Điểm (Node Graph) chỉ thị tuyến đường.
- **Đại diện nhân vật:** Nhân vật của người chơi chỉ hiển thị như một "Chấm nhỏ" (Dot) hoặc một Biểu tượng Đại diện (Avatar Icon) trên sơ đồ chiến thuật này.
- **Auto-Explore & Gặp gỡ:** Nhân vật sẽ tự động di chuyển từ Node này sang Node khác trên bản đồ theo thời gian thực vòng lặp IDLE. Quá trình di chuyển sẽ gặp ngẫu nhiên Quái vật (Mobs), Cạm bẫy, Rương báu, hoặc Thống lĩnh (Boss) ở các Node đặc biệt để chiến đấu thông qua cơ chế Battle Log.
- **Hoạt động Ngoại tuyến (Offline Farming):** Ngay cả khi tắt game, máy chủ vẫn tự động tính toán tiến trình rơi đồ và thám hiểm dựa trên sơ đồ Node này.

### B. Sưu tầm & Phân loại (Collection)
- Cốt lõi của game là hàng ngàn trang bị/cổ vật dưới dạng Thẻ bài (Item Cards) với các phẩm chất khác nhau (Trắng, Xanh, Tím, Cam, Đỏ).
- Mỗi món đồ có các dòng chỉ số ngẫu nhiên (Random Stats), tạo động lực cày cuốc không ngừng để min-max nhân vật.

### C. Nâng cấp (Progression)
- Sử dụng các thiết bị, vũ khí "rác" thu thập được từ bước Thám hiểm để làm nguyên liệu Nâng cấp trang bị chính.
- Tính năng Khảm nạm ngọc (Socketing) vào bộ giáp, vũ khí để tăng chỉ số đột phá.

---

## 4. CƠ CHẾ CHIẾN ĐẤU (LOGIC-BASED COMBAT)
Để tránh rắc rối về pháp lý bạo lực, trận đánh sẽ diễn ra theo dạng tính toán Text (Battle Log):

- **Tính toán dựa trên thuộc tính:** Trận đấu là sự so gánh qua lại giữa các chỉ số của hai bên:
  - `Tấn công vs Phòng thủ = Sát thương thực tế` (Trừ vào máu)
  - `Chính xác vs Né tránh = Tỷ lệ đánh trúng`
  - `Tốc độ = Thứ tự hành động quyết định ai ra tay trước trong Log`
- **Hiển thị (Card-based Text Battle):** Không có hoạt ảnh đâm chém đẫm máu. Trên giao diện, hai tấm thẻ của Nhân vật và Quái vật đại diện đối đầu nhau. Bên dưới là bảng thông báo nhật ký trận đánh.
- **Log Văn bản:** Kết quả trả về qua text *"Nhân vật A tung đòn bạo kích, gây 300 sát thương vào quái vật B"*.

---

## 5. HỆ THỐNG VẬT PHẨM & KINH TẾ

Đây là phần trọng tâm để duy trì tài nguyên game:
### A. Loại Thẻ Bài Vật Phẩm
- Thẻ Trang Bị cơ bản chi phối 5 thông số chính: Tấn công, Phòng thủ, Máu (HP), Chính xác, Né tránh. 

### B. Cơ chế Kinh tế
- **Nguồn gốc vật phẩm:** Chỉ có được từ quá trình Vượt ải, làm nhiệm vụ IDLE hoặc mở Rương quà (Gacha). Rất quan trọng cho giấy kiểm duyệt.
- **Đơn vị Tiền tệ:**
  - *Tiền cày cuốc (Vàng):* Trót lọt qua thám hiểm, bán rác. Dùng để chi trả phi nâng cấp, cường hóa.
  - *Tiền nạp (Kim cương):* Đơn vị nạp cao cấp. Dùng mở rộng số ô kho đồ, mua lượt thám hiểm bỏ qua thời gian (Skip cooldown), hoặc mua Gacha đặc biệt. 
- **Giao dịch:** Quản trị qua server-side chặt chẽ với cơ sở dữ liệu để ngăn lách luật nhân bản đồ (Dupe items).

---

## 6. UI/UX DESIGN (GIAO DIỆN)
- Thiết kế dạng **Sổ tay nhà sưu tầm** (Collector Book Layout), màn hình ngang/dọc dễ nhìn.
- Trọng tâm giao diện chia làm 2 phần chính:
  - **Nửa trên (Minimap & Thẻ bài):** Hiển thị Sơ đồ Auto-Exploration (nhân vật là 1 chấm di chuyển qua các node) và Thẻ bài nhân vật tĩnh (Card-Art), kho đồ trực quan.
  - **Nửa dưới (Box Thông Báo):** Dành trọn vẹn diện tích cho Box thông báo sự kiện (Log Thám hiểm & Chiến đấu).
- **Màu sắc/Style:** Gam màu giấy da cổ điển / Sci-fi HUD Text (tùy theo mảng concept art sau cùng, thiên về sự logic, tối giản).

---

## 7. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

* 🔴 **Giai đoạn 1: IDLE Core & Giao diện Base**
  * Viết API đếm ngược thời gian nhặt vật phẩm.
  * Backend sinh items ngẫu nhiên theo tỷ lệ rớt (Drop Rate). Giới thiệu hệ vàng và kho đồ cơ bản trên Node.js.

* 🟡 **Giai đoạn 2: Combat Logic (Log-based) & Cards**
  * Xây dựng công thức (Tấn công vs Phòng thủ) trả kết quả JSON về font-end.
  * Hiển thị bảng mô phỏng Trận đánh bằng Text Log. Cơ chế thẻ bài tĩnh mặt trước/sau.

* 🟢 **Giai đoạn 3: Nâng cấp, Khảm nạm**
  * Tạo tính năng ép cấp (Enhance) nuốt thẻ rác để nâng thẻ chính.
  * Bổ sung tính chỉ số phụ + % theo hệ ngọc khảm.

* 🔵 **Giai đoạn 4: Beta (Kinh tế & Thương mại hóa)**
  * Tích hợp Cash-shop (Kim cương) để skip time và mua tài nguyên mở rộng Kho đồ.
  * Thử nghiệm giới hạn với user lớn để tải trọng Redis đếm IDLE countdown không bị delay.
