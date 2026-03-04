# 📄 TÀI LIỆU THIẾT KẾ GAME (GDD): CRYSTALLIZED IRON

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** Crystallized Iron
- **Thể loại:** 2D Top-Down MMORPG (Nhập vai hành động góc nhìn từ trên xuống nhiều người chơi).
- **Phong cách đồ họa:** Pixel Art / Chibi (Hình ảnh 2D gần gũi, tối ưu phần cứng).
- **Cốt truyện:** fantasy (Post-apocalyptic Fantasy). Sau sự kiện "Vẫn Thạch Rơi", thế giới bị biến đổi bởi một loại siêu khoáng chất vô định hình mang tên "Crystallized Iron" (Thiết Tinh). Người chơi hóa thân thành các "Kẻ Thức Tỉnh" (Awakeners), chọn gia nhập 1 trong 3 Phe Phái/Hiệp Hội. Bằng cách hấp thụ năng lượng từ Thiết Tinh, người chơi rèn luyện sức mạnh (Sát thương, HP, Năng lượng), chiến đấu với các sinh vật đột biến (Corrupted) và tranh đoạt quyền kiểm soát các "Mỏ Thiết Tinh Vĩnh Cửu" trong những giải đấu liên server.
- **Nền tảng mục tiêu:** PC (Windows) và Mobile (Android/iOS). Cross-platform cho phép người chơi ở nhiều thiết bị chơi chung server.
- **Mô hình doanh thu định hướng:** Free to Play (Miễn phí tải & chơi) kết hợp In-App Purchase.

---

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)
Hệ thống được thiết kế hướng tới khả năng Scale (mở rộng) và Real-time (thời gian thực) mượt mà, phục vụ lượng người chơi lớn với tài nguyên cực kỳ giới hạn (Máy chủ 4GB RAM).

### A. Hạ tầng Server (Phù hợp với 4GB RAM)
Với 4GB RAM, việc đảm bảo game chịu tải được hệ thống MMO đòi hỏi công nghệ tối ưu cao về bộ nhớ:
- **Backend Chính:** **Node.js** được lựa chọn làm giải pháp phát triển server.
  - *Lý do:* Hệ sinh thái đa dạng, phát triển nhanh, dồi dào thư viện hỗ trợ WebSocket. Để đảm bảo tính ổn định trên cấu hình giới hạn 4GB RAM, hệ thống áp dụng cơ chế quản lý bộ nhớ cẩn thận và chia tải hợp lý.
  - *Giới hạn User (CCU - Concurrent Users):* Đặt giới hạn thiết kế 500-1000 người chơi đồng trực tuyến trên mỗi máy chủ nhằm chống thất thoát RAM. Quá ngưỡng này, hệ thống sẽ tự động cân bằng tải và điều hướng luồng người chơi mới sang các cụm server/kênh khác.
- **Client App:** **Unity (C#)** – Hỗ trợ đa nền tảng PC/Mobile với hệ thống xử lý vật lý 2D, Tilemap mượt mà.
- **Networking:** **WebSockets (TCP)** – Kết nối hai chiều liên tục, đảm bảo đồng bộ hóa vị trí và trạng thái chiến đấu của nhân vật tức thời (real-time).

### B. Chiến lược Cấu trúc Cơ Sở Dữ Liệu (Database & Caching)
Sử dụng độc lập 1 loại DB (như MongoDB) trong game dễ dẫn đến rủi ro Dupe đồ hoặc chậm trễ. Hệ thống do đó áp dụng mô hình liên kết đặc biệt:

1. **MySQL (RDBMS - Dữ liệu Cốt lõi Nhạy cảm):**
   - **Lưu trữ:** Thông tin Tài khoản, Password, Tiền tệ (Credits/Gems), Giao dịch, và Inventory (Hành trang).
   - **Tác dụng:** Đảm bảo tính toán vẹn ACID. Phòng chống triệt để các lỗi sao chép đồ đạc (Dupe) trong trường hợp crash server đột ngột.
2. **MongoDB (NoSQL - Dữ liệu Khối lượng lớn & Động):**
   - **Lưu trữ:** Log đoạn Chat toàn cầu/riêng tư, Nhật ký tiêu diệt Boss, Thiết lập cấu hình chỉ số Mobs/Quái (có thể nới rộng tùy ý mà không cần sửa Schema).
   - **Tác dụng:** Đọc/Ghi nhanh và linh động nạp dữ liệu.
3. **Redis (In-Memory Caching - Dữ liệu Thời gian thực):**
   - **Lưu trữ:** Tọa độ sống của người chơi (X, Y), Lượng HP/MP hiện tại, Thời gian hồi chiêu (Cooldowns), Phân vùng Map Channels.
   - **Tác dụng:** Siêu tốc độ, xử lý 100% các dữ liệu biến đổi liên tục trong mili-giây mà không đụng xuống ổ cứng (Disk I/O).

---

## 3. CƠ CHẾ GAMEPLAY CỐT LÕI (CORE LOOP)

### A. Hệ thống Nhân vật & Chỉ số
Mỗi nhân vật phát triển thông qua việc tích lũy **Điểm Chỉ số** (nhận được mỗi khi Thăng Cấp). Người chơi có thể tự do phân bổ điểm này để nâng cấp:
- **HP (Máu):** Khả năng sống sót. Hết HP nhân vật sẽ gục ngã, cần chọn Trạm cứu thương để hồi sinh hoặc dùng vật phẩm phục hồi đặc biệt.
- **MP (Năng lượng - Mana Points):** Tiêu tốn khi sử dụng kỹ năng đặc biệt hoặc các kỹ thuật di chuyển nâng cao (Lướt/Bay). Tự động hồi phục chậm hoặc dùng thuốc.
- **Sức đánh Thể chất (Physical Attack):** Lượng sát thương vật lý căn bản dùng trong đòn đánh thường và kỹ năng vật lý cận chiến/bắn cung.
- **Sức đánh Phép thuật (Magic Attack):** Lượng sát thương tính cho các kỹ năng hệ phép, năng lượng (bắn tia laser, cầu lửa).
- **Giáp (Armor):** Chỉ số phòng thủ, giảm thiểu lượng sát thương vật lý nhận vào.
- **Kháng Phép (Magic Resistance):** Giảm sát thương nhận vào từ các kỹ năng phép thuật/năng lượng.
- **Kháng Hiệu Ứng (Effect Resistance):** Tăng khả năng chống chịu, giảm thời gian hoặc né tránh các trạng thái bất lợi (như choáng, làm chậm, trúng độc).
- **Chí mạng (Crit Chance):** Tỷ lệ xuất hiện đòn đánh có sát thương đột biến.

### B. Hệ thống Bản đồ (Map & Zone)
- **Cấu trúc Không gian:** Map xây dựng dạng Tilemap nhiều lớp cảnh (Foreground va chạm, Background tĩnh/động).
- **Cơ chế Zone (Khu/Kênh):** Để chống quá tải Server và tránh tình trạng tranh giành quái quá mức, mỗi Bản đồ (Map) (Ví dụ: Rừng Nấm Đột Biến) sẽ chia thành nhiều "Khu vực" (Khu 1, Khu 2,...). Sức chứa mỗi khu cấu hình động khoảng 15-20 người chơi.
- **Chuyển bản đồ / Zone:** Nhân vật di chuyển đến cổng dịch chuyển hoặc rìa màn hình sẽ gửi tín hiệu lên Server để đổi map/đổi khu.
- **Cơ động học:** Tích hợp tính năng lướt (Dash / Roll) để thu hẹp khoảng cách hoặc né đòn, tiêu hao MP thời gian thực.

### C. Cơ chế Chiến đấu (Action & Combat)
- **Cơ bản (Đánh thường):** Chọn mục tiêu (Auto-target kẻ địch gần nhất) và click thủ công hoặc bật chế độ tự động đánh đòn vật lý liên tiếp.
- **Kỹ Năng (Skill):** Gán slot phím tắt trên PC (1, 2, 3...) hoặc nút kỹ năng trên màn hình Mobile. Hệ thống kỹ năng bao gồm: Bắn tia năng lượng, Đột kích cận chiến, Kỹ năng diện rộng (AoE), Buff sức mạnh.
- **Quái vật (Entities/Mobs):**
  - AI Tuần tra: Mob có khu vực di chuyển đặc dụng, quay đầu khi chạm tường hoặc giới hạn patrol.
  - Aggro (Sự chú ý): Khi người chơi lọt vào vùng thù địch của quái, chúng sẽ chủ động truy đuổi và tấn công.

---

## 4. HỆ THỐNG TÍNH NĂNG MỞ RỘNG (FEATURES OVERVIEW)

### A. Hệ thống Trang bị & Kho đồ (Inventory)
- **Loại thiết bị:** Vũ khí chính, Giáp ngực, Giáp chân, Găng tay, Thiết bị cốt lõi (Core Device - thay cho bùa chú/phụ kiện).
- Trang bị có thể ảnh hưởng đến ngoại hình nhân vật (Visual changes).
- Tính năng cường hóa: Sử dụng các mảnh "Crystallized Iron" vụn để đập đồ, tăng cấp độ sáng và thêm hiệu ứng hạt (Particles).

### B. Hệ thống Kinh tế & Giao dịch
- **Tiền tệ:**
  - *Tín chỉ (Credits):* Tiền thông dụng rớt từ quái/nhiệm vụ. Dùng để sinh hoạt cơ bản, mua thuốc.
  - *Đá Thiết Tinh (Iron Gems):* Đơn vị cao cấp. Có được từ Nạp thẻ hoặc chuỗi Event khó. Dùng mua Vật phẩm hiếm, Thẻ tháng, Skin.
- **Giao dịch:** Kênh Chợ Đen phi tập trung (Đấu giá) hoặc tính năng Trade trực tiếp giữa người với người (có xác thực 2 bước để chống lừa đảo).

### C. Gắn kết Xã hội (Social / Party / Guild)
- **Tổ đội (Party/Squad):** Nhóm tối đa 3-5 người. Chia sẻ điểm kinh nghiệm và hỗ trợ nhau đánh các sinh vật Tinh Anh.
- **Trò chuyện (Chat):** Chia các kênh: Kênh Toàn Cầu / Kênh Khu Vực / Nhắn Tin Riêng / Kênh Liên Minh.
- **Liên Minh (Guilds):** Lập quỹ Liên minh, có khu vực Map riêng cho Guild (Guild Base), nâng cấp kiến trúc và tham gia Đại Chiến Liên Minh gặt hái Tinh Thạch.

### D. Nhiệm vụ (Quests System)
- **Cốt truyện chính (Main Story):** Khám phá bí ẩn về Vẫn Thạch Rơi, nguyên nhân Trái Đất bị biến đổi, chạm trán với các Thống Lĩnh Đột Biến (Boss).
- **Nhiệm vụ Hàng ngày (Dailies) & Uỷ thác:** Khuyến khích user online bằng các yêu cầu đơn giản như tiêu diệt số lượng quái nhất định, thu thập tài nguyên để nhận thưởng cố định.

---

## 5. UI/UX DESIGN (GIAO DIỆN)
- **Chiến đấu (HUD):**
  - Góc trên trái: Trạng thái nhân vật (HP bar máu đỏ, MP bar thứ cấp màu xanh dương, Level).
  - Góc trên phải: Mini-map, tên khu vực hiện tại và kênh.
  - Phía dưới/Góc phải: Bảng điều khiển phím ảo cho di chuyển và chùm nút Kỹ năng.
- **Quy tắc thiết kế:** Sử dụng phong cách Sci-Fi Hologram hoặc viền kim loại rỉ sét để hợp bối cảnh thế giới tương lai/đột biến. Giao diện mờ nhẹ (Opacity) không che khuất tầm nhìn combat.

---

## 6. LỘ TRÌNH PHÁT TRIỂN DỰ KIẾN (ROADMAP / MILESTONES)

* 🔴 **Giai đoạn 1: Prototype (Core Loop & Networking)**
  * Khởi tạo map Unity 2D Tilemap.
  * Lập trình di chuyển (Walk/Dash) và Animation cơ bản.
  * Dựng Backend Node.js + WebSocket: 2-3 Client có thể nhìn thấy nhau di chuyển và chat text với nhau.

* 🟡 **Giai đoạn 2: Vertical Slice (Hoàn thiện Gameplay tĩnh)**
  * Thêm Mobs di chuyển tự động (AI Patrol).
  * Chức năng Auto-target, Đánh thường, nhặt Tín Chỉ.
  * UI Bảng chỉ số nhân vật, bấm cộng Điểm Chỉ số (Tăng HP, MP). Chuyển Map/Zone.

* 🟢 **Giai đoạn 3: Alpha Version (Mở rộng quy mô)**
  * Tổ chức CSDL (MySQL) lưu thông tin Account an toàn.
  * Hoàn thiện 3 Phe phái với bộ Skill set riêng biệt.
  * Chợ giao dịch cơ bản, Lập Party. Tích hợp Boss khu vực.

* 🔵 **Giai đoạn 4: Beta & Tối Ưu Hóa (Kiểm thử thực tế)**
  * Áp dụng Redis Caching để chống Lag mạng khi có 1000 người/server.
  * Cơ chế rào chắn Anti-Cheat, giới hạn rate Request.
  * Open Beta Test (OBT) thu thập phản hồi của nhóm người dùng đầu tiên. Phát hành chính thức.
