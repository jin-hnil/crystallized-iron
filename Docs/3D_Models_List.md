# 🎨 DANH SÁCH MODEL 3D (3D ASSET LIST - VERSION 2.1)

> **CHIẾN LƯỢC PHÁT TRIỂN:** Ưu tiên tạo các bản Prototype (V1) cực kỳ đơn giản, nhẹ (Low-poly đa diện) để test gameplay trước. Phần tối ưu hóa chi tiết và Shader phức tạp (V2) sẽ được thực hiện sau khi cơ chế game ổn định.

---

## 1. MÔI TRƯỜNG & TÀI NGUYÊN (ENVIRONMENT & RESOURCES)

| Model | Phân loại | Mô tả V1 (Prototype - Đơn giản & Nhẹ) | Mô tả V2 (Tối ưu & Chi tiết) | Độ phức tạp |
|-------|-----------|---------------------------------------|------------------------------|:-----------:|
| **Cột Thiết Tinh** | Tài nguyên | Khối nón/trụ 6 cạnh, màu bạc Metallic. (~20 tris) | Tinh thể bát diện, phát quang kẽ nứt, PBR xịn. | Thấp |
| **Tảng Đá Cuội** | Tài nguyên | Khối đa diện ngẫu nhiên (IcoSphere - Subdiv 1). (~80 tris) | Sculpting bề mặt, texture đá rêu phong. | Thấp |
| **Cây Gỗ Khô** | Tài nguyên | Thân trụ 8 cạnh, 2-3 cành thẳng. (~50 tris) | Thân nứt nẻ, cành mảnh, Sapling Gen chi tiết. | Thấp |
| **Bụi Cây Gai** | Trang trí | 2-3 mặt phẳng (Plane) đan chéo chữ X. (~10 tris) | Cành gai đan xen, Alpha map hiệu ứng cao. | Thấp |
| **Vũng Bùn Nhiễm Xạ** | Môi trường | Mặt phẳng đơn giản (Plane), màu xanh neon. (~2 tris) | Shader nước gợn sóng, hiệu ứng nhiệt. | Thấp |

---

## 2. KIẾN TRÚC & XÂY DỰNG (STRUCTURES & BUILDING)

| Model | Phân loại | Mô tả V1 (Prototype - Đơn giản & Nhẹ) | Mô tả V2 (Tối ưu & Chi tiết) | Độ phức tạp |
|-------|-----------|---------------------------------------|------------------------------|:-----------:|
| **Móng Nền** | Xây dựng | Tấm sàn 2x2m dày 0.2m (Cube scale). (~12 tris) | Bê tông đổ nát, có lõi thép lộ ra. | Thấp |
| **Tường Cơ Bản** | Xây dựng | Tấm vách 2x2m dày 0.1m. (~12 tris) | Tường tôn ghép, đinh tán rỉ sét. | Thấp |
| **Khung Cửa** | Xây dựng | Tường khoét lỗ hình chữ nhật đơn giản. (~20 tris) | Khép sắt I-beam gia cố xung quanh. | Thấp |
| **Cửa Gỗ/Sắt** | Xây dựng | Tấm Plane dày có bản lề là khối trụ nhỏ. (~15 tris) | Cửa nặng, có Keypad điện tử phát sáng. | Thấp |
| **Cầu Thang** | Xây dựng | Khối hộp xếp bậc hoặc thang leo phẳng. (~30 tris) | Lưới thép industrial, tay vịn cơ khí. | Trung bình |

---

## 3. MÁY MÓC & TỰ ĐỘNG HÓA (MACHINES & AUTOMATION)

| Model | Phân loại | Mô tả V1 (Prototype - Đơn giản & Nhẹ) | Mô tả V2 (Tối ưu & Chi tiết) | Độ phức tạp |
|-------|-----------|---------------------------------------|------------------------------|:-----------:|
| **Máy Khoan Tự Động** | Khai thác | Khối hộp thân máy + Nòng khoan làm nón. (~100 tris) | Piston thủy lực, ống xả khói, chuyển động cơ khí. | Trung bình |
| **Máy Bơm Chất Lỏng** | Khai thác | Cấu trúc chữ T từ các khối hộp dài. (~60 tris) | Chuyển động gật gù Dieselpunk, rỉ sét bám bẩn. | Trung bình |
| **Lò Nung Thô Sơ** | Chế biến | Khối trụ đặc có 1 mặt Emission đỏ. (~40 tris) | Cửa lò cháy sáng, hiệu ứng nhiệt, ống khói. | Thấp |
| **Máy Ép Thiết Tinh** | Chế biến | Buồng kính là khối hộp Cube (Alpha). (~50 tris) | Dây cáp chằng chịt, bảng điều khiển LCD. | Trung bình |

---

## 4. HẬU CẦC & VẬN TẢI (LOGISTICS)

| Model | Phân loại | Mô tả V1 (Prototype - Đơn giản & Nhẹ) | Mô tả V2 (Tối ưu & Chi tiết) | Độ phức tạp |
|-------|-----------|---------------------------------------|------------------------------|:-----------:|
| **Ống Chuyền Tải** | Logistics | Đoạn ống vuông (Cube scale) modular. (~12 tris) | Ống kính trong suốt nhìn rõ vật phẩm bên trong. | Thấp |
| **Phễu Thu Thập** | Logistics | Hình nón ngược hở đáy. (~30 tris) | Miệng rộng khung sắt bám bụi bẩn công nghiệp. | Thấp |
| **Rương Chứa Đồ** | Lưu trữ | Khối hộp Cube có nắp (Separate mesh). (~24 tris) | Thùng sắt quân đội, gioăng cao su, sơn bong. | Thấp |
| **Băng Chuyền** | Logistics | Mặt phẳng Plane dài. (~2 tris) | Con lăn cơ khí, chuyển động cuộn nhịp nhàng. | Thấp |

---

## 5. NHÂN VẬT & QUÁI VẬT (CHARACTERS & MUTANTS)

| Model | Phân loại | Mô tả V1 (Prototype - Đơn giản & Nhẹ) | Mô tả V2 (Tối ưu & Chi tiết) | Độ phức tạp |
|-------|-----------|---------------------------------------|------------------------------|:-----------:|
| **Nhân Vật (Survivor)** | Người chơi | Khối hộp "Steve" hoặc Block-man (10 parts). (~500 tris) | Đồ bảo hộ, mặt nạ phòng độc, Topology xịn. | Trung bình |
| **Heo Rừng Gai** | Quái vật | Khối hộp có 4 chân trụ + vài nón nhọn trên lưng. (~200 tris) | Điêu khắc cơ bắp, gai tinh thể, hiệu ứng mắt đỏ. | Trung bình |
| **Zombie Phóng Xạ** | Quái vật | Người hình khối, sơn màu xanh lục. (~500 tris) | Da mục nát, hiệu ứng phát sáng SSS rùng rợn. | Trung bình |balo, tay cầm công cụ. Phong cách Low-poly. |
| **Heo Rừng Gai (Spiky Boar)** | Quái vật | Heo rừng lớn, có các gai Thiết Tinh mọc ra từ lưng, mắt đỏ phát sáng. |
| **Zombie Phóng Xạ (Radioactive Zombie)** | Quái vật | Dáng người gầy gộc, da xanh tái, có những mảng phát sáng trên cơ thể. |
| **Chim Cuộn Thép (Steel Wing Bird)** | Quái vật | Chim lớn với đôi cánh trông như những lưỡi dao kim loại sắc bén. |

---

## 7. VẬT PHẨM CẦM TAY (PORTABLE ITEMS)
*Các item xuất hiện trong Inventory hoặc khi thả ra đất.*

| Model | Phân loại | Mô tả chi tiết |
|-------|-----------|----------------|
| **Rìu/Cuốc Thô Sơ (Scrap Axe/Pickaxe)** | Công cụ | Lưỡi làm từ mảnh sắt vụn cột vào cán gỗ bằng dây thừng. |
| **Súng Lục Ống Nước (Pipe Pistol)** | Vũ khí | Khẩu súng tự chế trông thô kệch, ghép từ các đoạn ống nước và lò xo. |
| **Bình Nước/Đồ Hộp (Consumables)** | Sinh tồn | Lon đồ hộp không nhãn mác hoặc chai nhựa đục. |
| **Gói Tài Nguyên (Resource Pack)** | Loot | Túi vải thô xuất hiện khi người chơi "Drop" nguyên liệu ra đất. |
