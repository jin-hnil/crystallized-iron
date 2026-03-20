# 🏗️ TỔNG QUAN HỆ THỐNG (SYSTEM OVERVIEW)

Tài liệu này mô tả tổng quan toàn bộ kiến trúc máy chủ và tính năng trò chơi sinh tồn 3D của **Crystallized Iron**.

---

## 1. Tổng quan dự án

| Thông tin | Chi tiết |
|-----------|----------|
| **Thể loại** | Xây dựng căn cứ, Khai thác tài nguyên, Sinh tồn, Bắn súng 3D |
| **Bối cảnh** | Hoang mạc phóng xạ / Rừng rậm hậu tận thế |
| **Nền tảng** | PC (Unity 3D Engine) |
| **Mô hình mạng** | Singleplayer / Offline (Phát triển chế độ chơi đơn trước, Multiplayer tính sau) |
| **Góc nhìn** | First Person Shooter (FPS) / Third Person Shooter (TPS) |

---

## 2. Danh sách các hệ thống lõi

Do đã từ bỏ cơ chế game Card/Text-based, dưới đây là bộ khung hệ thống mới (vui lòng truy cập từng file `Docs/` để xem thông tin sâu):

### 2.1 🌱 Hệ thống Chỉ Số Sinh Tồn (Survival Parameters)
> Chi tiết tại: [CharacterStats.md](CharacterStats.md)

Đây là quy chuẩn tối giản sức mạnh cá nhân. Mọi nhân vật đều như nhau, sức khoẻ định lượng bởi 4 thanh trạng thái duy nhất:
- **Máu:** Sinh mạng rực đỏ. Bằng 0 là Chết, rớt sạch đồ.
- **Giáp:** Lớp bọc bảo vệ bằng vải, da, hoặc Thiết Tinh, ngăn đạn và chấn thương.
- **Đói:** Thụt giảm sau mỗi lần hoạt động cuốc đá chặt cây. Cần ăn lương thực.
- **Khát:** Thụt giảm liên tục trong lúc chạy nước rút hoặc đi vào sa mạc. Cần uống nước.

### 2.2 🔫 Hệ thống Bắn súng & Hành động (Combat & Gunplay)
> Chi tiết tại: [CombatSystem.md](CombatSystem.md)

- Góc độ va chạm súng vật lý với đường đạn chân thật (Bullet trajectory, drop, recoil).
- Sát thương được ghi nhận theo Hitbox (bắn đầu gây sát thương cao gấp đôi bắn tay chân).

### 2.3 ⛏️ Hệ thống Khai thác và Tương tác (Mining/Gathering)
- Không có nút "Bấm để khai thác" theo kiểu Click Web ngày trước.
- Player tự thân cầm Rìu/Cuốc đập tay vào một khối tài nguyên tự nhiên (Đá, Cây, Cột Quặng Thiết Tinh) ở ngoài môi trường 3D. Khối đá cạn thanh độ bền sẽ phân rã làm nhiều cục nguyên liệu thô bay về kho đồ.

### 2.4 🔨 Hệ thống Xây dựng & Hậu cần (Building & Automation Mechanics)
> Chi tiết tại: [BuildingSystem.md](BuildingSystem.md)

- Game theo trường phái Sandbox mở, dùng cây đinh, mảnh phế liệu ghép móng nhà.
- Tiến hóa lên lập chuỗi tự động hóa với máy khoan (Mining), băng chuyền thu thập (Logistics), nhà máy nung quặng, cho đến hệ thống phòng thủ tấn công (Tháp canh điện) dùng dây cáp nối mạch. Mở ra kỉ nguyên cách mạng công nghiệp cho hòn đảo.

### 2.5 🎒 Hệ thống Quản lí Vật phẩm (Inventory Flow)
> Chi tiết tại: [ItemSystem.md](ItemSystem.md) | **Trực quan Logic:** [ItemLogic_Visualization.md](ItemLogic_Visualization.md)

- Xếp đồ, nạp đạn vào băng tiếp đạn, sửa chữa vũ khí hỏng.
- Cho phép Drop tài nguyên mang dư ra đất tạo thành một gói Mesh 3D để người chơi khác lấy.

### 2.6 🗺️ Hệ thống Cảnh quan Thế giới (World Map 3D)
> Chi tiết tại: [MapSystem_Architecture.md](MapSystem_Architecture.md)

- Unity Terrain / Voxel. Không có điểm nút đường (Node).
- Thời gian trôi liên tục, Chu kỳ Ngày & Đêm thay đổi không ngừng tác động tầm nhìn và sự nguy hiểm.
