# 🎨 DANH SÁCH MODEL 3D (3D ASSET LIST - VERSION 3.0)

> **CHIẾN LƯỢC PHÁT TRIỂN:** Ưu tiên tạo các bản Prototype (V1) cực kỳ đơn giản, nhẹ (Low-poly đa diện) để test gameplay trước. Phần tối ưu hóa chi tiết và Shader phức tạp (V2) sẽ được thực hiện sau khi cơ chế game ổn định.
> 
> **Lấy cảm hứng từ:** ARK: Survival Evolved, Rust, Minecraft, Satisfactory

---

## 1. MÔI TRƯỜNG & TÀI NGUYÊN (ENVIRONMENT & RESOURCES)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Cột Thiết Tinh** | Tài nguyên | Quặng khoáng sản | Nguồn tài nguyên chính. Khai thác bằng cuốc lấy Thiết Tinh Thô - nguyên liệu cao cấp chế vũ khí và máy móc. | Khối nón/trụ 6 cạnh, màu bạc Metallic. (~20 tris) | Tinh thể bát diện, phát quang kẽ nứt, PBR xịn. | Thấp |
| **Tảng Đá Cuội** | Tài nguyên | Quặng khoáng sản | Nguồn đá và quặng sắt cơ bản. Đập vỡ lấy Đá, Sắt Thô. Phân bố khắp bản đồ. | Khối đa diện ngẫu nhiên (IcoSphere). (~80 tris) | Sculpting bề mặt, texture đá rêu phong. | Thấp |
| **Mỏ Quặng Sắt** | Tài nguyên | Quặng khoáng sản | Điểm khai thác sắt cố định trên map. Đặt Máy Khoan lên để tự động khai thác. *(Giống Metal Node - Rust)* | Khối đá nâu đỏ có vệt kim loại sáng. (~100 tris) | Quặng lộ thiên lấp lánh, vân khoáng PBR. | Thấp |
| **Mỏ Lưu Huỳnh** | Tài nguyên | Quặng khoáng sản | Nguồn Lưu Huỳnh chế thuốc súng và C4. Vùng nguy hiểm, thường có phóng xạ. | Khối đá vàng chanh nổi bật. (~80 tris) | Tinh thể vàng phát sáng, khói sulfur. | Thấp |
| **Cây Gỗ Khô** | Tài nguyên | Thực vật khai thác | Chặt lấy Gỗ - vật liệu xây dựng sơ khai và nhiên liệu. *(Giống cây Rust/Minecraft)* | Thân trụ 8 cạnh, 2-3 cành thẳng. (~50 tris) | Thân nứt nẻ, cành mảnh, Sapling Gen. | Thấp |
| **Cây Thông Đột Biến** | Tài nguyên | Thực vật khai thác | Cây lớn cho nhiều gỗ hơn. Lá ánh sáng lạ do nhiễm xạ. Chặt lâu nhưng drop nhiều. | Thân trụ cao, tán Plane chữ X xanh lục. (~80 tris) | Vỏ cây nứt phát sáng, lá lung linh. | Trung bình |
| **Cây Sồi Cổ Thụ** | Tài nguyên | Thực vật khai thác | Cây khổng lồ hiếm, cho rất nhiều gỗ. Cần rìu cao cấp. *(Giống Redwood - ARK)* | Thân trụ rất to, nhiều cành. (~150 tris) | Gốc rễ nổi, vỏ sần sùi, tán lá rậm. | Trung bình |
| **Bụi Cây Gai** | Trang trí | Thực vật trang trí | Vật cản tầm nhìn, gây sát thương nhẹ khi đi qua. Cảnh quan hoang dã. | 2-3 Plane đan chéo chữ X. (~10 tris) | Cành gai đan xen, Alpha map. | Thấp |
| **Cỏ Dại / Lau Sậy** | Trang trí | Thực vật trang trí | Cỏ ven sông hồ. Thu hoạch lấy Sợi Vải thô. *(Giống Fiber - ARK)* | Plane nhỏ rải rác. (~4 tris) | Cỏ lau lay theo gió, shader wind. | Thấp |
| **Bụi Quả Mọng** | Tài nguyên | Thực vật khai thác | Thu hoạch bằng tay lấy Quả Mọng - thực phẩm sơ khai. *(Giống Berry Bush - ARK)* | Bụi xanh thấp có chấm đỏ. (~20 tris) | Lá xanh chi tiết, quả mọng đỏ. | Thấp |
| **Nấm Phát Quang** | Tài nguyên | Thực vật khai thác | Mọc trong hang tối, thu hoạch làm thuốc hồi máu hoặc chất xúc tác. | Hình dù nhỏ, Emission xanh dương. (~15 tris) | Phát sáng bio-luminescent, bào tử. | Thấp |
| **Vũng Bùn Nhiễm Xạ** | Môi trường | Địa hình nguy hiểm | Nước ô nhiễm gây sát thương phóng xạ liên tục. Cần đồ bảo hộ. Có thể bơm hút làm nhiên liệu. | Plane đơn giản, màu xanh neon. (~2 tris) | Shader nước gợn sóng, hiệu ứng nhiệt. | Thấp |
| **Giếng Dầu Thô** | Môi trường | Điểm khai thác | Vị trí đặt Máy Bơm hút dầu thô - nhiên liệu cho máy phát điện và xe. | Vũng đen nhỏ trên đất. (~4 tris) | Dầu sủi bọt, cầu vồng dầu trên mặt. | Thấp |
| **Hồ Nước Ngọt** | Môi trường | Nguồn nước | Điểm lấy nước uống và tưới tiêu. Cần bình chứa hoặc ống bơm. | Plane xanh dương trong suốt. (~2 tris) | Shader nước phản chiếu, sóng nhẹ, cá. | Thấp |
| **Xác Xe Hơi** | Môi trường | Vật phẩm nhặt loot | Xác xe rải trên map. Đập lấy Sắt Vụn, Cao Su, Linh Kiện. *(Cơ chế Rust)* | Khối hộp dẹt 4 bánh trụ. (~80 tris) | Xe rỉ sét bong sơn, kính vỡ, cỏ mọc xuyên. | Trung bình |
| **Thùng Phuy Xăng** | Môi trường | Vật phẩm nhặt loot | Đập lấy nhiên liệu và Mảnh Sắt. Phát nổ nếu bắn trúng. *(Giống Barrel - Rust)* | Hình trụ đứng đơn giản. (~30 tris) | Phuy rỉ sét, nhãn nguy hiểm, dầu loang. | Thấp |
| **Hòm Thả Tiếp Tế (Airdrop)** | Môi trường | Sự kiện / Event | Hòm rơi từ trời chứa loot hiếm. Có khói dẫn đường. *(Giống Airdrop - Rust/ARK)* | Hộp vuông có dù (Plane tam giác). (~40 tris) | Thùng quân đội, dù vải rách, khói tín hiệu. | Trung bình |
| **Đống Đổ Nát / Tàn Tích** | Môi trường | POI (Điểm quan tâm) | Tàn tích thành phố cũ để khám phá, loot đồ hiếm. Vùng nguy hiểm có quái mạnh. | Vài khối hộp xếp nghiêng. (~120 tris) | Bê tông nứt, cốt thép lộ, cỏ dại mọc. | Trung bình |

---

## 2. KIẾN TRÚC & XÂY DỰNG (STRUCTURES & BUILDING)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Móng Nền Gỗ** | Xây dựng | Kiến trúc - Nền | Tấm sàn cơ bản rẻ nhất. Giai đoạn đầu game. *(Giống Twig Tier - Rust)* | Tấm sàn gỗ 2x2m. (~12 tris) | Ván gỗ ghép, đinh sắt, bề mặt sần. | Thấp |
| **Móng Nền Đá** | Xây dựng | Kiến trúc - Nền | Nền bền hơn gỗ, chịu sát thương vừa. Tier 2 xây dựng. | Tấm sàn đá 2x2m dày hơn. (~12 tris) | Đá xếp thô, vữa xi măng giữa khe. | Thấp |
| **Móng Nền Sắt** | Xây dựng | Kiến trúc - Nền | Nền cao cấp nhất, cực bền. Cần Sắt Tinh Luyện. *(Giống Armored - Rust)* | Tấm sắt 2x2m dày 0.2m. (~12 tris) | Bê tông lõi thép lộ, bề mặt công nghiệp. | Thấp |
| **Tường Gỗ** | Xây dựng | Kiến trúc - Tường | Tường rẻ nhất, dễ phá. Che chắn tạm giai đoạn đầu. | Tấm vách gỗ 2x2m. (~12 tris) | Ván gỗ thô ghép dọc, kẽ hở. | Thấp |
| **Tường Đá** | Xây dựng | Kiến trúc - Tường | Tường trung cấp, chịu đạn thường và quái nhỏ. | Tấm vách đá 2x2m. (~12 tris) | Đá xếp chồng, xi măng thô. | Thấp |
| **Tường Sắt** | Xây dựng | Kiến trúc - Tường | Tường cao cấp. Cần C4 hoặc Rocket để phá. *(Giống Sheet Metal - Rust)* | Tấm vách sắt 2x2m dày 0.1m. (~12 tris) | Tường tôn ghép, đinh tán rỉ sét. | Thấp |
| **Khung Cửa** | Xây dựng | Kiến trúc - Khung | Lắp vào tường để gắn cửa ra vào. Bắt buộc cho mọi lối đi. | Tường khoét lỗ chữ nhật. (~20 tris) | Khung sắt I-beam gia cố. | Thấp |
| **Khung Cửa Sổ** | Xây dựng | Kiến trúc - Khung | Khung nhỏ quan sát/bắn ra ngoài. *(Giống Window Frame - Rust)* | Tường khoét lỗ vuông nhỏ. (~20 tris) | Khung sắt hàn, gắn song sắt. | Thấp |
| **Cửa Gỗ** | Xây dựng | Kiến trúc - Cửa | Cửa rẻ nhất, dễ phá bằng rìu. Chỉ dùng tạm đầu game. | Tấm Plane dày + bản lề trụ nhỏ. (~15 tris) | Cửa gỗ mộc, bản lề sắt rỉ. | Thấp |
| **Cửa Sắt** | Xây dựng | Kiến trúc - Cửa | Cửa bền, cần thuốc nổ phá. Có Keypad khóa mã số. | Tấm sắt dày + bản lề. (~15 tris) | Cửa nặng, Keypad điện tử phát sáng. | Thấp |
| **Cửa Garage** | Xây dựng | Kiến trúc - Cửa | Cửa cuốn lớn cho xe. Mở bằng công tắc/tín hiệu. *(Giống Garage Door - Rust)* | Tấm sắt lớn dạng cuộn. (~30 tris) | Cửa cuốn lamella, motor cuốn, rỉ sét. | Trung bình |
| **Cầu Thang** | Xây dựng | Kiến trúc - Di chuyển | Nối các tầng nhà/căn cứ. Xây nhà máy nhiều tầng. | Khối hộp xếp bậc. (~30 tris) | Lưới thép industrial, tay vịn cơ khí. | Trung bình |
| **Thang Leo** | Xây dựng | Kiến trúc - Di chuyển | Thang dọc gắn tường leo nhanh. Rẻ hơn cầu thang. *(Giống Ladder - Rust)* | 2 thanh trụ dọc + ngang. (~20 tris) | Thang sắt hàn thô, chân đế bắt vít. | Thấp |
| **Mái Nhà / Trần** | Xây dựng | Kiến trúc - Mái | Che mưa nắng, ngăn quái bay tấn công từ trên. Snap vào tường. | Tấm phẳng nghiêng 2x2m. (~12 tris) | Tôn lượn sóng, mối hàn, ốc vít. | Thấp |
| **Sàn Tam Giác** | Xây dựng | Kiến trúc - Nền | Mảnh sàn tam giác bo góc tạo hình phức tạp. *(Giống Triangle Foundation - Rust)* | Tam giác đều 2m cạnh. (~6 tris) | Cùng chất liệu với móng nền tương ứng. | Thấp |
| **Tường Nửa** | Xây dựng | Kiến trúc - Tường | Tường cao nửa làm lan can hoặc bệ bắn. *(Giống Half Wall - Rust)* | Tấm vách 2x1m. (~12 tris) | Cùng chất liệu tier tương ứng. | Thấp |
| **Hàng Rào Gỗ/Sắt** | Xây dựng | Kiến trúc - Rào | Rào quanh lãnh thổ, chặn quái vật. Rào gỗ rẻ, rào sắt bền. | Tấm hàng rào có cọc. (~20 tris) | Cọc gỗ nhọn hoặc lưới B40 thép. | Thấp |
| **Đường Ray** | Xây dựng | Hạ tầng giao thông | Đường ray cho tàu hỏa chạy. Modular, snap vào nhau. | 2 thanh song song trên tà vẹt. (~20 tris) | Ray thép bóng, tà vẹt gỗ, sỏi nền. | Thấp |
| **Đường Nhựa** | Xây dựng | Hạ tầng giao thông | Đường trải cho xe chạy nhanh, tiết kiệm nhiên liệu. | Plane xám dài. (~2 tris) | Nhựa đường nứt, vạch kẻ, lề đường. | Thấp |

---

## 3. MÁY MÓC & TỰ ĐỘNG HÓA (MACHINES & AUTOMATION)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Máy Khoan Tự Động** | Khai thác | Máy khai thác | Đặt lên mỏ quặng tự động khoan và nhả quặng thô. Cần nhiên liệu/điện. *(Giống Mining Drill - ARK)* | Khối hộp thân máy + nón khoan. (~100 tris) | Piston thủy lực, ống xả khói, cơ khí. | Trung bình |
| **Máy Bơm Chất Lỏng** | Khai thác | Máy khai thác | Hút nước hoặc dầu từ lòng đất. *(Giống Pump Jack - Rust)* | Cấu trúc chữ T từ khối hộp dài. (~60 tris) | Chuyển động gật gù Dieselpunk, rỉ sét. | Trung bình |
| **Bẫy Thú (Taming Trap)** | Khai thác | Bẫy bắt | Bẫy lồng bắt sống động vật hoang dã. Thuần hóa thú cưỡi/canh. *(Cảm hứng ARK)* | Lồng sắt hình hộp có cửa sập. (~60 tris) | Khung sắt hàn, cửa lò xo, bản lề. | Trung bình |
| **Lò Nung Thô Sơ** | Chế biến | Máy chế biến | Nung quặng sắt thành phôi sắt. Cần than/gỗ. Cơ bản nhất. *(Giống Furnace - Rust/Minecraft)* | Khối trụ đặc có Emission đỏ. (~40 tris) | Cửa lò cháy sáng, hiệu ứng nhiệt, ống khói. | Thấp |
| **Lò Luyện Kim Lớn** | Chế biến | Máy chế biến | Nung nhanh hơn, nhiều slot hơn Lò nhỏ. Tier 2. *(Giống Large Furnace - Rust)* | Khối hộp lớn có ống khói cao. (~80 tris) | Gạch chịu nhiệt, miệng lò rực lửa, xỉ sắt. | Trung bình |
| **Máy Ép Thiết Tinh** | Chế biến | Máy chế biến | Chuyển Thiết Tinh Thô thành Tinh Khiết bằng áp suất cao. High-end. | Buồng kính khối hộp Cube. (~50 tris) | Dây cáp chằng chịt, bảng điều khiển LCD. | Trung bình |
| **Bàn Chế Tạo (Workbench)** | Chế biến | Trạm chế tạo | Nơi craft vật phẩm. Cấp cao hơn mở khóa recipe tốt hơn. *(Giống Workbench - Rust)* | Bàn gỗ có vật dụng trên mặt. (~40 tris) | Bàn gỗ cũ, ê-tô, búa, mảnh sắt vụn. | Thấp |
| **Bàn Nghiên Cứu** | Chế biến | Trạm nghiên cứu | Mở khóa Blueprint từ vật phẩm loot. *(Giống Research Table - Rust)* | Bàn có kính lúp và sách. (~40 tris) | Bàn lab, kính hiển vi, sách vở bừa bộn. | Thấp |
| **Máy Tái Chế** | Chế biến | Máy chế biến | Bỏ đồ cũ vào phân hủy lấy lại nguyên liệu thô. *(Giống Recycler - Rust)* | Khối hộp có phễu trên + máng dưới. (~50 tris) | Máy nghiền kim loại, bánh răng, bụi sắt. | Trung bình |
| **Máy Dệt Vải** | Chế biến | Máy chế biến | Dệt Sợi Thô thành Vải làm quần áo và túi xách. Sản xuất tự động. | Khung gỗ có cuộn sợi. (~40 tris) | Khung dệt cơ khí, cuộn vải, sợi chỉ. | Thấp |
| **Máy Lọc Nước** | Chế biến | Máy chế biến | Lọc nước bẩn/nhiễm xạ thành nước sạch uống được. *(Giống Water Purifier - Rust)* | Khối hộp có ống nối. (~30 tris) | Bộ lọc than, ống dẫn, van xả. | Thấp |

---

## 4. HẬU CẦN & VẬN TẢI (LOGISTICS & TRANSPORT)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Ống Chuyền Tải** | Logistics | Ống vận chuyển | Mạng ống kín chuyền đồ tự động giữa máy và rương. Xương sống nhà máy. | Đoạn ống vuông modular. (~12 tris) | Ống kính trong suốt nhìn rõ vật phẩm. | Thấp |
| **Ống Bơm Lỏng** | Logistics | Ống vận chuyển | Ống tròn bơm nước, dầu, chất lỏng giữa bồn và máy. | Ống trụ tròn modular. (~12 tris) | Ống thép, van khóa, đồng hồ áp suất. | Thấp |
| **Phễu Thu Thập** | Logistics | Bộ thu gom | Nhận đồ rơi từ máy, chuyển vào ống/rương. *(Giống Hopper - Minecraft)* | Hình nón ngược hở đáy. (~30 tris) | Miệng rộng khung sắt bám bụi. | Thấp |
| **Băng Chuyền** | Logistics | Băng tải | Vận chuyển vật phẩm lộ thiên trên bề mặt. *(Giống Conveyor - Satisfactory)* | Plane dài. (~2 tris) | Con lăn cơ khí, chuyển động cuộn. | Thấp |
| **Bộ Lọc Phân Luồng** | Logistics | Bộ chia hướng | Ngã 3 ống: 1 vào 3 ra, tự phân loại theo filter. *(Smart Splitter)* | Khối hộp có 4 cổng ống. (~30 tris) | Hộp điện tử, đèn LED chỉ hướng. | Trung bình |
| **Máy Bơm Hút Đẩy** | Logistics | Bơm Item | Gắn vào rương/máy để hút hoặc đẩy đồ vào ống. Động lực hệ thống ống. | Khối nhỏ gắn mạn sườn. (~20 tris) | Motor nhỏ, quạt hút, đèn hoạt động. | Thấp |
| **Rương Gỗ Nhỏ** | Lưu trữ | Kho chứa | Rương cơ bản 12 ô, rẻ. *(Giống Chest - Minecraft/Rust)* | Khối hộp gỗ có nắp. (~24 tris) | Rương gỗ thông, khóa đồng nhỏ. | Thấp |
| **Rương Sắt Lớn** | Lưu trữ | Kho chứa | Rương 36 ô, bền hơn. Cần sắt. *(Giống Large Box - Rust)* | Khối hộp sắt có nắp. (~24 tris) | Thùng sắt quân đội, gioăng cao su. | Thấp |
| **Bồn Chứa Công Nghiệp** | Lưu trữ | Kho chứa lớn | Silo khổng lồ chứa hàng trăm stack. Trung tâm kho vận. | Khối trụ cao lớn. (~40 tris) | Silo thép, thang leo hông, van xả đáy. | Trung bình |
| **Bồn Chứa Lỏng** | Lưu trữ | Bể chứa chất lỏng | Tích trữ nước, dầu cho mùa khô và máy móc. Nối ống bơm lỏng. | Khối trụ thấp rộng. (~30 tris) | Bồn thép tròn, van áp, đồng hồ mức nước. | Thấp |
| **Xe Tải Vận Chuyển** | Phương tiện | Xe cơ giới | Chở hàng tấn tài nguyên xuyên map. Cần xăng dầu. *(Giống xe Rust)* | Khối hộp có 4 bánh trụ. (~120 tris) | Xe bán tải rỉ sét, thùng đầy đồ. | Trung bình |
| **Xe Bọc Thép** | Phương tiện | Xe chiến đấu | Xe giáp dày, gắn súng máy trên nóc. Di chuyển + chiến đấu. | Khối hộp to bánh lớn. (~150 tris) | Xe bọc thép dã chiến, tháp súng quay. | Cao |
| **Toa Xe Lửa** | Phương tiện | Xe đường ray | Chở hàng khổng lồ trên đường sắt giữa các căn cứ. Cần đường ray. | Khối hộp dài trên 2 bộ bánh. (~80 tris) | Toa container rỉ sét, khớp nối, phanh. | Trung bình |
| **Đầu Kéo Tàu Hỏa** | Phương tiện | Đầu máy | Kéo toa xe lửa. Nhiên liệu diesel/điện. | Khối hộp có ống khói trước. (~100 tris) | Đầu máy diesel thô, đèn pha, còi hơi. | Trung bình |

---

## 5. PHÒNG THỦ (DEFENSE & FORTIFICATION)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Tháp Súng Tự Động** | Phòng thủ | Trụ phòng thủ | Tự động bắn kẻ địch. Cần nạp đạn + điện. Trụ cột phòng thủ. *(Giống Auto Turret - Rust)* | Khối hộp có nòng súng xoay. (~60 tris) | Tháp pháo 2 trục, camera hồng ngoại. | Trung bình |
| **Bệ Tên Lửa SAM** | Phòng thủ | Trụ phòng không | Bắn hạ sinh vật bay và drone. Tầm xa, sát thương lớn. *(Giống Rocket Turret - ARK)* | Khối hộp có 4 ống phóng. (~80 tris) | Bệ xoay, ống phóng tên lửa, radar. | Cao |
| **Hàng Rào Điện** | Phòng thủ | Rào phòng thủ | Gây sát thương điện khi chạm. Tiêu thụ điện liên tục. | Cọc + dây ngang phát sáng. (~15 tris) | Cọc thép, sứ cách điện, tia lửa. | Thấp |
| **Bẫy Gai / Bẫy Đạp** | Phòng thủ | Bẫy mặt đất | Gây sát thương khi dẫm lên. Rẻ, đặt quanh nhà. *(Giống Wooden Spikes - ARK/Rust)* | Plane có nhiều nón nhọn. (~30 tris) | Cọc gỗ/sắt nhọn, vết máu khô. | Thấp |
| **Bẫy Shotgun** | Phòng thủ | Bẫy sát thương | Kích hoạt bắn đạn shotgun khi có kẻ đi qua. Cần nạp đạn. *(Giống Shotgun Trap - Rust)* | Khối nhỏ gắn tường có nòng. (~20 tris) | Hộp gỗ, nòng ống nước, dây cò. | Thấp |
| **Bẫy Lửa (Flame Turret)** | Phòng thủ | Bẫy sát thương | Phun lửa vào kẻ gần. Cần nhiên liệu. *(Giống Flame Turret - Rust)* | Khối nhỏ có vòi xoay. (~30 tris) | Bình gas, vòi phun, mồi lửa. | Trung bình |
| **Pháo Cối** | Phòng thủ | Vũ khí cố định | Bắn đạn vòng cung tầm xa. Tiêu diệt kẻ thù trước khi đến căn cứ. | Ống trụ nghiêng trên đế. (~40 tris) | Nòng thép, đế bê tông, bảng ngắm. | Trung bình |

---

## 6. NĂNG LƯỢNG & TÍN HIỆU (POWER & SIGNALS)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Máy Phát Điện Xăng** | Năng lượng | Nguồn điện | Phát điện bằng nhiên liệu. Ồn, thu hút quái. Mạnh và ổn định. | Khối hộp có ống xả. (~40 tris) | Động cơ diesel, bình xăng, ống xả khói. | Thấp |
| **Tấm Pin Mặt Trời** | Năng lượng | Nguồn điện | Phát điện miễn phí ban ngày. Yếu ban đêm. Sạch, im lặng. *(Giống Solar Panel - Rust)* | Tấm phẳng nghiêng trên chân đế. (~10 tris) | Panel xanh lam, khung nhôm, dây nối. | Thấp |
| **Tua-bin Gió** | Năng lượng | Nguồn điện | Phát điện bằng gió. Cả ngày đêm nhưng không ổn định. *(Giống Wind Turbine - Rust)* | Cột cao có 3 cánh quạt. (~30 tris) | Cột thép, cánh quạt composite, nacelle. | Trung bình |
| **Pin Dự Trữ (Battery)** | Năng lượng | Lưu trữ điện | Tích trữ điện dư để dùng khi nguồn tắt. Quản lý năng lượng thông minh. | Khối hộp có đèn LED. (~15 tris) | Pin lithium công nghiệp, đồng hồ số. | Thấp |
| **Cột Điện / Dây Điện** | Năng lượng | Truyền tải điện | Nối dây giữa nguồn phát và thiết bị. Tạo lưới điện. | Cột trụ + dây nối. (~10 tris) | Cột gỗ/thép, sứ cách điện, dây đồng. | Thấp |
| **Công tắc Điện** | Tín hiệu | Thiết bị điều khiển | Bật/tắt dòng điện thủ công hoặc tự động qua tín hiệu logic. | Hộp nhỏ gắn tường. (~8 tris) | Công tắc gạt, đèn báo, vỏ nhựa. | Thấp |

---

## 7. NHÂN VẬT & QUÁI VẬT (CHARACTERS & MUTANTS)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Nhân Vật (Survivor)** | Người chơi | Nhân vật chính | Model người chơi. Hiển thị trang bị, vũ khí, balo. Cần rig animation. | Khối hộp Block-man 10 parts. (~500 tris) | Đồ bảo hộ, mặt nạ phòng độc, Topology xịn. | Trung bình |
| **Heo Rừng Gai** | Quái vật | Quái cấp thấp | Quái vật phổ biến, tấn công khi bị khiêu khích. Drop thịt và da. | Khối hộp 4 chân + nón nhọn lưng. (~200 tris) | Điêu khắc cơ bắp, gai tinh thể, mắt đỏ. | Trung bình |
| **Zombie Phóng Xạ** | Quái vật | Quái cấp trung | Zombie chậm nhưng bền, gây sát thương phóng xạ. Xuất hiện ban đêm. | Người hình khối, sơn xanh lục. (~500 tris) | Da mục nát, phát sáng SSS rùng rợn. | Trung bình |
| **Chim Cuộn Thép** | Quái vật | Quái bay | Quái bay tấn công từ trên cao. Cần súng hoặc SAM. Drop lông thép quý. | Chim lớn cánh dao kim loại. (~300 tris) | Cánh kim loại sắc, mắt đỏ, lông thép. | Trung bình |
| **Sói Đột Biến** | Quái vật | Quái cấp trung | Di chuyển nhanh, tấn công theo bầy đêm. *(Giống Raptor - ARK)* | Hình chó 4 chân, gầy, răng dài. (~250 tris) | Lông rụng loang lổ, mắt vàng, bọt mép. | Trung bình |
| **Gấu Bọc Giáp** | Quái vật | Quái cấp cao | Quái lớn rất bền, sát thương cao. Canh vùng tài nguyên quý. *(Giống Dire Bear - ARK)* | Hình gấu khối lớn, tấm giáp lưng. (~400 tris) | Lông rậm bùn, giáp xương sừng, nanh. | Cao |
| **Nhện Khổng Lồ** | Quái vật | Quái hang động | Sống trong hang tối, phun nọc làm chậm. Drop tơ nhện làm dây thừng. | Thân tròn + 8 chân que. (~300 tris) | Lông cứng, mắt đỏ 8 hạt, nọc xanh. | Trung bình |
| **Boss: Golem Thiết Tinh** | Quái vật | Boss | Boss khu vực. Khổng lồ bọc giáp tinh thể. Cần nhóm hoặc vũ khí nặng. Drop loot hiếm. | Người khổng lồ khối hộp + tinh thể. (~800 tris) | Thân đá, tinh thể phát sáng, đập đất FX. | Cao |
| **Thú cưỡi: Ngựa Hoang** | Quái vật | Thú thuần hóa | Bắt và thuần hóa để cưỡi di chuyển nhanh. Không chiến đấu. *(Cảm hứng ARK taming)* | Hình ngựa khối đơn giản. (~300 tris) | Ngựa cơ bắp, yên cương, bờm bay. | Trung bình |

---

## 8. VŨ KHÍ & CÔNG CỤ CẦM TAY (WEAPONS & TOOLS)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Rìu Đá Thô Sơ** | Công cụ | Công cụ khai thác | Chặt cây lấy gỗ đầu game. Chậm, bền thấp. *(Giống Stone Hatchet - Rust)* | Lưỡi đá buộc cán gỗ. (~15 tris) | Đá mài thô, dây thừng buộc, cán cong. | Thấp |
| **Cuốc Sắt** | Công cụ | Công cụ khai thác | Đào đá và quặng nhanh hơn cuốc đá. Tier 2. *(Giống Metal Pick - Rust)* | Lưỡi sắt + cán gỗ. (~15 tris) | Lưỡi thép đánh bóng, cán gỗ bọc da. | Thấp |
| **Rìu Thiết Tinh** | Công cụ | Công cụ khai thác | Rìu cao cấp nhất, chặt rất nhanh. Cần Thiết Tinh Tinh Khiết. | Lưỡi phát sáng + cán kim loại. (~20 tris) | Lưỡi tinh thể xanh, cán hợp kim, phát sáng. | Trung bình |
| **Đèn Đuốc** | Công cụ | Công cụ chiếu sáng | Chiếu sáng đêm và hang. Cần nhiên liệu (vải + mỡ). Cơ bản nhất. | Cán gỗ + Plane lửa trên đầu. (~10 tris) | Ngọn lửa particle, khói bay, ánh sáng ấm. | Thấp |
| **Đèn Pin** | Công cụ | Công cụ chiếu sáng | Chiếu sáng tập trung tầm xa. Cần pin. Gắn được lên súng. | Khối trụ nhỏ. (~8 tris) | Đèn pin quân đội, thấu kính, nút bấm. | Thấp |
| **Súng Lục Ống Nước** | Vũ khí | Vũ khí tầm xa | Súng tự chế đầu game, sát thương thấp, kém chính xác. *(Giống Eoka - Rust)* | Ống nước + cò. (~20 tris) | Súng ghép ống nước, lò xo, băng dính. | Thấp |
| **Súng Lục Ổ Xoay** | Vũ khí | Vũ khí tầm xa | Súng ngắn 6 viên, chính xác TB. Mid-game. *(Giống Revolver - Rust)* | Nòng + ổ xoay trụ. (~30 tris) | Ổ xoay thép, báng gỗ, cò mạ nickel. | Trung bình |
| **Súng Trường AR Tự Chế** | Vũ khí | Vũ khí tầm xa | Súng trường tự động, sát thương tốt. Late-game. *(Giống AK/AR - Rust)* | Nòng dài + báng + hộp tiếp đạn. (~50 tris) | Thân thép, ray gắn phụ kiện, băng đạn. | Trung bình |
| **Súng Bắn Tỉa** | Vũ khí | Vũ khí tầm xa | Bắn xa, sát thương cực cao, tốc độ chậm. *(Giống Bolt Action - Rust)* | Nòng rất dài + ống ngắm. (~40 tris) | Nòng dài, ống ngắm 4x, báng gỗ chắc. | Trung bình |
| **Súng Shotgun** | Vũ khí | Vũ khí tầm gần | Sát thương cao tầm gần, rải đạn. Hiệu quả trong nhà. *(Giống Pump Shotgun - Rust)* | Nòng to ngắn + pump. (~30 tris) | Nòng kép/pump, báng nhựa, khóa nòng. | Trung bình |
| **Cung Tên** | Vũ khí | Vũ khí tầm xa | Vũ khí im lặng đầu game. Đạn (mũi tên) từ gỗ+đá. *(Giống Bow - Rust/Minecraft)* | Cung cong + dây. (~10 tris) | Cung gỗ uốn, dây thừng, tên gỗ lông. | Thấp |
| **Rựa / Dao Sinh Tồn** | Vũ khí | Vũ khí cận chiến | Cận chiến cơ bản, dùng cả chặt cây. Đa năng. | Lưỡi cong + cán. (~12 tris) | Lưỡi thép mài, cán gỗ bọc dây. | Thấp |
| **Chất Nổ C4** | Vũ khí | Thuốc nổ | Phá tường và cửa. Craft từ lưu huỳnh + thuốc súng. *(Giống C4 - Rust)* | Khối hộp nhỏ dán tường. (~8 tris) | Khối thuốc nổ, dây kích nổ, đèn LED. | Thấp |
| **Rocket Launcher** | Vũ khí | Vũ khí hạng nặng | Bắn rocket phá hủy diện rộng. Endgame. *(Giống Rocket Launcher - Rust)* | Ống dài vai + đầu đạn. (~40 tris) | Ống phóng thép, kính ngắm, tay cầm. | Trung bình |

---

## 9. ĐỒ SINH TỒN & TIÊU HAO (CONSUMABLES & SURVIVAL)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Đồ Hộp** | Sinh tồn | Thực phẩm | Giảm Đói. Thực phẩm cơ bản loot từ tàn tích. Không cần nấu. | Lon trụ nhỏ. (~15 tris) | Lon thiếc không nhãn, nắp kéo. | Thấp |
| **Thịt Sống** | Sinh tồn | Thực phẩm | Cần nấu chín. Drop từ quái. Ăn sống bị ngộ độc. *(Giống Raw Meat - ARK)* | Khối hồng bất định hình. (~10 tris) | Miếng thịt đỏ, mỡ trắng, vết máu. | Thấp |
| **Thịt Nướng** | Sinh tồn | Thực phẩm | Giảm Đói nhiều, an toàn. Nấu Thịt Sống trong Lò Nung. | Khối nâu sậm. (~10 tris) | Thịt nướng vàng, vết cháy xém. | Thấp |
| **Chai Nước Sạch** | Sinh tồn | Đồ uống | Giảm Khát. Lọc từ nước bẩn hoặc lấy từ Hồ Nước Ngọt. | Chai trụ trong suốt. (~12 tris) | Chai nhựa đục, nắp xoáy, nước trong. | Thấp |
| **Kim Tiêm Y Tế** | Sinh tồn | Thuốc hồi phục | Hồi HP tức thời. Quý hiếm, cần nguyên liệu y tế. *(Giống Syringe - Rust)* | Ống trụ nhỏ có kim. (~8 tris) | Ống tiêm nhựa, kim thép, thuốc xanh. | Thấp |
| **Băng Gạc** | Sinh tồn | Thuốc hồi phục | Hồi HP chậm theo thời gian. Rẻ, dễ chế. *(Giống Bandage - Rust)* | Cuộn vải trắng nhỏ. (~6 tris) | Gạc y tế cuộn, vết máu khô. | Thấp |
| **Gói Tài Nguyên (Drop)** | Loot | Vật thả | Túi xuất hiện khi người chơi drop đồ ra đất. Nhặt lại được. | Túi vải nhỏ trên đất. (~10 tris) | Túi vải thô, dây buộc, phồng căng. | Thấp |
| **Túi Ngủ / Giường** | Sinh tồn | Điểm hồi sinh | Điểm respawn khi chết. Giường cooldown ngắn hơn túi ngủ. *(Giống Sleeping Bag - Rust)* | Plane trên đất hoặc khung giường. (~15 tris) | Túi ngủ vải bạt hoặc giường sắt đơn. | Thấp |

---

## 10. NÔNG NGHIỆP (FARMING)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Luống Trồng Cây** | Nông nghiệp | Cấu trúc trồng | Ô đất trồng cây lương thực/thảo dược. Cần tưới nước. *(Giống Crop Plot - ARK)* | Khối hộp thấp chứa đất. (~12 tris) | Khung gỗ, đất trồng ẩm, mầm cây. | Thấp |
| **Máy Tưới Tự Động** | Nông nghiệp | Máy nông nghiệp | Nối ống nước, tự động tưới. Tăng tốc phát triển cây. | Ống có vòi phun. (~15 tris) | Ống thép, vòi phun xoay, giọt nước. | Thấp |
| **Bể Nuôi Cá** | Nông nghiệp | Cấu trúc nuôi | Nuôi cá lấy thực phẩm bền vững. Cần nước sạch liên tục. | Khối hộp kính nông. (~20 tris) | Bể kính, khung sắt, nước xanh, cá bơi. | Trung bình |

---

## 11. NỘI THẤT & TIỆN ÍCH (FURNITURE & UTILITIES)

| Model | Phân loại | Loại Model | Mục đích sử dụng | Mô tả V1 (Prototype) | Mô tả V2 (Chi tiết) | Độ phức tạp |
|-------|-----------|------------|-------------------|----------------------|---------------------|:-----------:|
| **Lửa Trại** | Nội thất | Trạm nấu ăn | Nấu thịt sống, sưởi ấm ban đêm. Cơ bản nhất. *(Giống Campfire - Rust/Minecraft)* | Vài khối gỗ xếp + Plane lửa. (~15 tris) | Đá xếp vòng, gỗ cháy, lửa particle. | Thấp |
| **Hộp Công Cụ (Tool Cupboard)** | Nội thất | Bảo vệ vùng | Đặt để claim vùng đất, ngăn người lạ xây gần. *(Cốt lõi Rust)* | Khối hộp gỗ nhỏ gắn tường. (~12 tris) | Tủ gỗ nhỏ, khóa, khe nhét vật liệu. | Thấp |
| **Đèn Trần / Đèn Tường** | Nội thất | Chiếu sáng cố định | Chiếu sáng bên trong căn cứ. Tiêu thụ điện. Nhiều kiểu gắn. | Khối bán cầu nhỏ gắn trần/tường. (~8 tris) | Chụp đèn kim loại, bóng LED, dây điện. | Thấp |
| **Bảng Hiệu / Biển Chỉ Dẫn** | Nội thất | Thông tin | Ghi chú, đánh dấu phòng, chỉ đường. Tùy chỉnh text. | Tấm Plane gắn cọc/tường. (~4 tris) | Bảng gỗ, chữ sơn trắng, cọc đóng. | Thấp |

---

*Tổng cộng: **113 models** | Cập nhật: 19/03/2026 | Version 3.0*
