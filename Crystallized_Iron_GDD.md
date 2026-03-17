# 📄 TÀI LIỆU THIẾT KẾ GAME (GDD): CRYSTALLIZED IRON

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** Crystallized Iron
- **Thể loại:** Sinh tồn 3D, Khai thác tài nguyên, Xây dựng căn cứ, Bắn súng (3D Survival, Crafting, Shooter).
- **Góc nhìn:** FPS (Góc nhìn thứ nhất) hoặc TPS (Góc nhìn thứ ba).
- **Cốt truyện & Bối cảnh:** Trái đất hoang tàn sau thảm họa. Người sống sót (nhân vật) phải đi khai thác khoáng sản có giá trị nhất gọi là "Thiết Tinh" (Crystallized Iron). Trong một môi trường đầy rẫy hiểm nguy với quái vật đột biến và những xác sống, bạn sẽ dùng hai bàn tay trắng chặt cây lấy gỗ, đập đá để xây nên một pháo đài phòng thủ và chế tạo súng đạn để chống lại kẻ địch.
- **Nền tảng mục tiêu:** PC (Windows/Mac) thông qua engine Unity 3D.
- **Quy mô:** Trọng tâm vào tính tự do (Sandbox) - không có mạch nhiệm vụ ép buộc.

---

## 2. KIẾN TRÚC KỸ THUẬT (TECH STACK)
- **Engine Đồ Họa & Vật Lý:** Unity 3D (Viết bằng C#). Hỗ trợ trực tiếp va chạm ba chiều và môi trường Terrain lớn.
- **Mô hình Mạng (Network):** Trò chơi hiện đang được phát triển theo hướng **Offline / Singleplayer (Chơi Đơn)** ở giai đoạn đầu để làm vững Core Gameplay.
- **Lưu trữ dữ liệu:** Lưu trữ cục bộ qua file Save (JSON, XML) hoặc dữ liệu nội bộ SQLite. Kế hoạch về Backend và Dedicated Server đã được dời lại sang phiên bản sau.

---

## 3. CƠ CHẾ GAMEPLAY CỐT LÕI (CORE LOOP)
Vòng lặp sinh tồn cơ bản bao gồm 4 trụ cột không thể tách rời:

### A. Khai Thác Tài Nguyên (Mining & Gathering)
- Chặt cây (thu về Khối gỗ), đập bùn đất/quặng (thu về Đá vụn luyện quặng, Sắt, và quặng hiếm Thiết Tinh). 
- Động tác sử dụng rìu, cuốc đánh tay liên tục vào hitbox của gốc cây tự nhiên ngoài hoang dã.

### B. Sinh Tồn (Survival)
- Hệ thống chỉ số tối giản đến thô kệch, lược bỏ toàn bộ số liệu RPG như Manna, Evasion, Accuracy, CritRate...
- Bạn chỉ quan tâm tới đúng 4 thanh sinh lý: **MÁU, GIÁP, ĐÓI, KHÁT**.
- Nếu quên uống nước/để bụng rỗng, nhân vật sẽ dần mất máu rồi ngã quỵ.

### C. Xây Dựng và Chế Tạo Công Nghiệp (Building & Automation)
- Từ cái balo sau lưng (Inventory), bạn lấy gỗ và sắt ráp lại thành Căn cứ (Base), lắp ráp các hệ thống Máy khoan tự động, Băng chuyền.
- Xây dựng Nhà máy để nung quặng tự động, nối Dây điện từ Máy Phát Điện tới các Tháp Pháo Phòng Thủ (Auto Turret) ngăn chặn quái thú, nâng cấp Sinh Tồn thành Quản trị Chuỗi Hậu Cần Công Nghiệp.

### D. Chiến Đấu (Shooting & Combat)
- Chế tạo súng ống (Súng quay, Súng lục, Súng xả đạn, Bom) để bắn phá các quái vật bảo vệ mỏ quặng hoặc thế lực cản đường.
- Súng sử dụng đạn động học (Projectile) hoặc tia Raycast, độ recoil nảy cực cao đòi hỏi khả năng làm chủ.

---

## 4. QUẢN LÝ VẬT PHẨM VÀ BALO (INVENTORY)
- Toàn bộ cơ chế "Thẻ bài ngẫu nhiên" lúc trước đều bị khai tử.
- Vật phẩm bây giờ tồn tại thực tế và có một kích thước rõ ràng trong một giao diện balo lưới (Grid Inventory, giống Rust / Escape From Tarkov).
- Kéo thả mượt mà, rớt thành đồ vật khối 3D ra đất nếu balo quá nặng.

---

## 5. HỆ THỐNG MẦM MỐNG KẺ ĐỊCH (AI)
- Kẻ thù là quái vật hoặc các sinh vật nhiễm phóng xạ (Mutants).
- Sử dụng mô hình trí tuệ nhân tạo (NavMesh Agent) để tìm đường vòng qua các tảng đá, vượt dốc truy đuổi người chơi tới cùng.
- Khi màn đêm buông xuống, bóng tối bao trùm sẽ gia tăng tần suất xuất hiện của các sinh vật này.
