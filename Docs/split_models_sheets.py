import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# ============== DATA (Copy lại từ bản trước) ==============
data = [
    # 1. MÔI TRƯỜNG & TÀI NGUYÊN
    ["Cột Thiết Tinh", "Tài nguyên", "Quặng khoáng sản", "Nguồn tài nguyên chính. Khai thác lấy Thiết Tinh Thô.", "Khối nón/trụ 6 cạnh, màu bạc Metallic.", "Tinh thể bát diện, phát quang kẽ nứt.", "Thấp"],
    ["Tảng Đá Cuội", "Tài nguyên", "Quặng khoáng sản", "Nguồn đá và sắt cơ bản. Đập vỡ lấy Đá, Sắt Thô.", "Khối đa diện ngẫu nhiên (IcoSphere).", "Sculpting bề mặt, texture đá rêu phong.", "Thấp"],
    ["Mỏ Quặng Sắt", "Tài nguyên", "Quặng khoáng sản", "Điểm khai thác sắt cố định. Đặt Máy Khoan lên.", "Khối đá nâu đỏ có vệt kim loại sáng.", "Quặng lộ thiên lấp lánh, vân khoáng PBR.", "Thấp"],
    ["Mỏ Lưu Huỳnh", "Tài nguyên", "Quặng khoáng sản", "Nguồn Lưu Huỳnh chế thuốc súng và C4.", "Khối đá vàng chanh nổi bật.", "Tinh thể vàng phát sáng, khói sulfur.", "Thấp"],
    ["Cây Gỗ Khô", "Tài nguyên", "Thực vật khai thác", "Chặt lấy Gỗ - vật liệu xây dựng sơ khai.", "Thân trụ 8 cạnh, 2-3 cành thẳng.", "Thân nứt nẻ, cành mảnh, Sapling Gen.", "Thấp"],
    ["Cây Thông Đột Biến", "Tài nguyên", "Thực vật khai thác", "Cây lớn cho nhiều gỗ hơn. Lá phát sáng lạ.", "Thân trụ cao, tán là các Plane chữ X.", "Vỏ cây nứt phát sáng, lá lung linh.", "Trung bình"],
    ["Cây Sồi Cổ Thụ", "Tài nguyên", "Thực vật khai thác", "Cây khổng lồ hiếm gặp. (Giống Redwood ARK).", "Thân trụ rất to, nhiều cành.", "Gốc rễ nổi, vỏ sần sùi, tán lá rậm.", "Trung bình"],
    ["Bụi Cây Gai", "Trang trí", "Thực vật trang trí", "Vật cản tầm nhìn, gây sát thương nhẹ.", "2-3 mặt phẳng (Plane) đan chéo chữ X.", "Cành gai đan xen, Alpha map hiệu ứng cao.", "Thấp"],
    ["Cỏ Dại / Lau Sậy", "Trang trí", "Thực vật trang trí", "Cỏ mọc ven sông hồ. Thu hoạch lấy Sợi Vải.", "Plane nhỏ đặt rải rác.", "Cỏ lau lay động theo gió, shader wind.", "Thấp"],
    ["Bụi Quả Mọng", "Tài nguyên", "Thực vật khai thác", "Thu hoạch lấy Quả Mọng - thực phẩm sơ khai.", "Bụi xanh thấp có chấm đỏ.", "Lá xanh chi tiết, quả mọng đỏ mọng nước.", "Thấp"],
    ["Nấm Phát Quang", "Tài nguyên", "Thực vật khai thác", "Mọc trong hang tối, thuốc hồi máu/xúc tác.", "Hình dù nhỏ, Emission xanh dương.", "Phát sáng bio-luminescent, bào tử bay.", "Thấp"],
    ["Vũng Bùn Nhiễm Xạ", "Môi trường", "Địa hình nguy hiểm", "Vùng nước ô nhiễm gây sát thương phóng xạ.", "Mặt phẳng đơn giản, màu xanh neon.", "Shader nước gợn sóng, hiệu ứng nhiệt.", "Thấp"],
    ["Giếng Dầu Thô", "Môi trường", "Điểm khai thác", "Vị trí đặt Máy Bơm để hút dầu thô lên.", "Vũng đen nhỏ trên đất.", "Dầu sủi bọt, cầu vồng dầu trên mặt.", "Thấp"],
    ["Hồ Nước Ngọt", "Môi trường", "Nguồn nước", "Điểm lấy nước uống và tưới tiêu.", "Plane xanh dương trong suốt.", "Shader nước phản chiếu, sóng nhẹ.", "Thấp"],
    ["Xác Xe Hơi", "Môi trường", "Vật phẩm nhặt loot", "Xác xe cũ. Đập lấy Sắt Vụn, Cao Su.", "Khối hộp dẹt 4 bánh trụ.", "Xe rỉ sét bong sơn, kính vỡ.", "Trung bình"],
    ["Thùng Phuy Xăng", "Môi trường", "Vật phẩm nhặt loot", "Đập lấy nhiên liệu. Có thể phát nổ.", "Hình trụ đứng đơn giản.", "Phuy rỉ sét, nhãn nguy hiểm.", "Thấp"],
    ["Hòm Thả Tiếp Tế (Airdrop)", "Môi trường", "Sự kiện / Event", "Hòm rơi chứa loot hiếm. Có khói dẫn đường.", "Hộp vuông có dù (Plane tam giác).", "Thùng quân đội, dù vải rách, khói tín hiệu.", "Trung bình"],
    ["Đống Đổ Nát / Tàn Tích", "Môi trường", "POI (Điểm quan tâm)", "Tàn tích thành phố khám phá loot đồ hiếm.", "Vài khối hộp xếp nghiêng ngả.", "Bê tông nứt, cốt thép lộ.", "Trung bình"],

    # 2. KIẾN TRÚC & XÂY DỰNG
    ["Móng Nền Gỗ", "Xây dựng", "Kiến trúc - Nền", "Tấm sàn cơ bản rẻ tiền. (Twig Tier Rust).", "Tấm sàn gỗ 2x2m.", "Ván gỗ ghép, đinh sắt, bề mặt sần.", "Thấp"],
    ["Móng Nền Đá", "Xây dựng", "Kiến trúc - Nền", "Nền bền hơn gỗ, chịu sát thương vừa.", "Tấm sàn đá 2x2m dày hơn.", "Đá xếp thô, vữa xi măng giữa các khe.", "Thấp"],
    ["Móng Nền Sắt", "Xây dựng", "Kiến trúc - Nền", "Nền cao cấp nhất, cực bền.", "Tấm sắt 2x2m dày 0.2m.", "Bê tông lõi thép lộ, mặt công nghiệp.", "Thấp"],
    ["Tường Gỗ", "Xây dựng", "Kiến trúc - Tường", "Tường rẻ nhất, dễ phá.", "Tấm vách gỗ 2x2m.", "Ván gỗ thô ghép dọc, kẽ hở.", "Thấp"],
    ["Tường Đá", "Xây dựng", "Kiến trúc - Tường", "Tường trung cấp, chịu được đạn thường.", "Tấm vách đá 2x2m.", "Đá xếp chồng, xi măng thô.", "Thấp"],
    ["Tường Sắt", "Xây dựng", "Kiến trúc - Tường", "Tường cao cấp nhất. (Sheet Metal Rust).", "Tấm vách sắt 2x2m dày 0.1m.", "Tường tôn ghép, đinh tán rỉ sét.", "Thấp"],
    ["Khung Cửa", "Xây dựng", "Kiến trúc - Khung", "Lắp vào tường để gắn cửa ra vào.", "Tường khoét lỗ hình chữ nhật.", "Khung sắt I-beam gia cố xung quanh.", "Thấp"],
    ["Khung Cửa Sổ", "Xây dựng", "Kiến trúc - Khung", "Khung nhỏ trên tường để quan sát.", "Tường khoét lỗ vuông nhỏ.", "Khung sắt hàn, có thể gắn song sắt.", "Thấp"],
    ["Cửa Gỗ", "Xây dựng", "Kiến trúc - Cửa", "Cửa rẻ nhất, dễ phá bằng rìu.", "Tấm Plane dày + bản lề trụ nhỏ.", "Cửa gỗ mộc, bản lề sắt rỉ.", "Thấp"],
    ["Cửa Sắt", "Xây dựng", "Kiến trúc - Cửa", "Cửa bền, cần thuốc nổ phá. Có Keypad.", "Tấm sắt dày + bản lề.", "Cửa nặng, Keypad điện tử phát sáng.", "Thấp"],
    ["Cửa Garage", "Xây dựng", "Kiến trúc - Cửa", "Cửa cuốn lớn cho xe cộ đi qua.", "Tấm sắt lớn dạng cuộn.", "Cửa cuốn lamella, motor cuốn.", "Trung bình"],
    ["Cầu Thang", "Xây dựng", "Kiến trúc - Di chuyển", "Nối các tầng nhà/căn cứ.", "Khối hộp xếp bậc.", "Lưới thép industrial, tay vịn cơ khí.", "Trung bình"],
    ["Thang Leo", "Xây dựng", "Kiến trúc - Di chuyển", "Thang dọc gắn tường để leo nhanh.", "2 thanh trụ dọc + thanh ngang.", "Thang sắt hàn thô, chân đế bắt vít.", "Thấp"],
    ["Mái Nhà / Trần", "Xây dựng", "Kiến trúc - Mái", "Che mưa nắng, ngăn quái bay tấn công.", "Tấm phẳng nghiêng 2x2m.", "Tôn lượn sóng, mối hàn, ốc vít.", "Thấp"],
    ["Sàn Tam Giác", "Xây dựng", "Kiến trúc - Nền", "Mảnh sàn tam giác để bo góc.", "Tam giác đều 2m cạnh.", "Cùng chất liệu với móng nền tương ứng.", "Thấp"],
    ["Tường Nửa", "Xây dựng", "Kiến trúc - Tường", "Tường cao nửa, làm lan can.", "Tấm vách 2x1m.", "Cùng chất liệu tier tương ứng.", "Thấp"],
    ["Hàng Rào Gỗ/Sắt", "Xây dựng", "Kiến trúc - Rào", "Rào quanh lãnh thổ, chặn quái vật.", "Tấm hàng rào có cọc.", "Cọc gỗ nhọn hoặc lưới B40 thép.", "Thấp"],

    # 3. MÁY MÓC & TỰ ĐỘNG HÓA
    ["Máy Khoan Tự Động", "Khai thác", "Máy khai thác", "Tự động khoan quặng. Cần nhiên liệu/điện.", "Khối hộp thân máy + nón khoan.", "Piston thủy lực, ống xả khói.", "Trung bình"],
    ["Máy Bơm Chất Lỏng", "Khai thác", "Máy khai thác", "Hút nước hoặc dầu từ lòng đất.", "Cấu trúc chữ T từ khối hộp dài.", "Chuyển động gật gù Dieselpunk.", "Trung bình"],
    ["Bẫy Thú", "Khai thác", "Bẫy bắt", "Bẫy lồng bắt sống động vật hoang dã.", "Lồng sắt hình hộp có cửa sập.", "Khung sắt hàn chắc, cửa lò xo.", "Trung bình"],
    ["Lò Nung Thô Sơ", "Chế biến", "Máy chế biến", "Nung quặng sắt thành phôi. (Furnace Rust).", "Khối trụ đặc có Emission đỏ.", "Cửa lò cháy sáng, hiệu ứng nhiệt.", "Thấp"],
    ["Lò Luyện Kim Lớn", "Chế biến", "Máy chế biến", "Nung nhanh hơn, nhiều slot hơn.", "Khối hộp lớn có ống khói cao.", "Gạch chịu nhiệt, miệng lò rực lửa.", "Trung bình"],
    ["Máy Ép Thiết Tinh", "Chế biến", "Máy chế biến", "Chuyển Thiết Tinh Thô thành Tinh Khiết.", "Buồng kính khối hộp Cube (Alpha).", "Dây cáp chằng chịt, bảng điều khiển.", "Trung bình"],
    ["Bàn Chế Tạo", "Chế biến", "Trạm chế tạo", "Nơi craft vật phẩm sinh tồn.", "Bàn gỗ có vật dụng trên mặt.", "Bàn gỗ cũ, ê-tô, búa, mảnh vụn.", "Thấp"],
    ["Bàn Nghiên Cứu", "Chế biến", "Trạm nghiên cứu", "Mở khóa Blueprint từ vật phẩm loot.", "Bàn có kính lúp và sách.", "Bàn lab, kính hiển vi, sách vở.", "Thấp"],
    ["Máy Tái Chế", "Chế biến", "Máy chế biến", "Phân hủy đồ cũ lấy lại nguyên liệu.", "Khối hộp có phễu trên và máng dưới.", "Máy nghiền kim loại, bánh răng.", "Trung bình"],
    ["Máy Dệt Vải", "Chế biến", "Máy chế biến", "Dệt Sợi Thô thành Vải làm quần áo.", "Khung gỗ có cuộn sợi.", "Khung dệt cơ khí, cuộn vải, sợi chỉ.", "Thấp"],
    ["Máy Lọc Nước", "Chế biến", "Máy chế biến", "Lọc nước bẩn thành nước sạch.", "Khối hộp có ống nối.", "Bộ lọc than, ống dẫn, van xả.", "Thấp"],

    # 4. HẬU CẦC & VẬN TẢI
    ["Ống Chuyền Tải", "Logistics", "Ống vận chuyển", "Chuyển đồ tự động giữa máy và rương.", "Đoạn ống vuông modular.", "Ống kính trong suốt nhìn rõ vật phẩm.", "Thấp"],
    ["Ống Bơm Lỏng", "Logistics", "Ống vận chuyển", "Bơm nước, dầu giữa bồn và máy.", "Ống trụ tròn modular.", "Ống thép, van khóa, đồng hồ áp.", "Thấp"],
    ["Phễu Thu Thập", "Logistics", "Bộ thu gom", "Nhận đồ rơi ra từ máy khoan.", "Hình nón ngược hở đáy.", "Miệng rộng khung sắt bám bụi bẩn.", "Thấp"],
    ["Băng Chuyền", "Logistics", "Băng tải", "Vận chuyển vật phẩm lộ thiên trên sàn.", "Mặt phẳng Plane dài.", "Con lăn cơ khí, chuyển động cuộn.", "Thấp"],
    ["Bộ Lọc Phân Luồng", "Logistics", "Bộ chia hướng", "Ngã 3 ống: tự phân loại đồ theo filter.", "Khối hộp có 4 cổng ống.", "Hộp điện tử, đèn LED chỉ hướng.", "Trung bình"],
    ["Máy Bơm Hút Đẩy", "Logistics", "Bơm Item", "Gắn vào rương hút/đẩy đồ vào ống.", "Khối nhỏ gắn vào mạn sườn.", "Motor nhỏ, quạt hút, đèn hoạt động.", "Thấp"],
    ["Rương Gỗ Nhỏ", "Lưu trữ", "Kho chứa", "Rương cơ bản 12 ô. (Chest Minecraft).", "Khối hộp gỗ có nắp.", "Rương gỗ thông, khóa đồng nhỏ.", "Thấp"],
    ["Rương Sắt Lớn", "Lưu trữ", "Kho chứa", "Rương 36 ô, bền hơn.", "Khối hộp sắt có nắp.", "Thùng sắt quân đội, gioăng cao su.", "Thấp"],
    ["Bồn Chứa Công Nghiệp", "Lưu trữ", "Kho chứa lớn", "Silo khổng lồ chứa hàng trăm stack.", "Khối trụ cao lớn.", "Silo thép, thang leo hông, van xả.", "Trung bình"],
    ["Bồn Chứa Lỏng", "Lưu trữ", "Bể chứa chất lỏng", "Tích trữ nước, dầu cho mùa khô.", "Khối trụ thấp rộng.", "Bồn thép tròn, van áp, đồng hồ.", "Thấp"],
    ["Xe Tải Vận Chuyển", "Phương tiện", "Xe cơ giới", "Chở hàng tấn tài nguyên xuyên map.", "Khối hộp có 4 bánh trụ.", "Xe bán tải rỉ sét, thùng chất đầy đồ.", "Trung bình"],
    ["Xe Bọc Thép", "Phương tiện", "Xe chiến đấu", "Xe giáp dày, gắn được súng máy.", "Khối hộp to bánh lớn.", "Xe bọc thép dã chiến, tháp súng xoay.", "Cao"],
    ["Toa Xe Lửa", "Phương tiện", "Xe đường ray", "Chở hàng khổng lồ trên đường sắt.", "Khối hộp dài trên 2 bộ bánh.", "Toa container rỉ sét, khớp nối.", "Trung bình"],
    ["Đầu Kéo Tàu Hỏa", "Phương tiện", "Đầu máy", "Đầu kéo các toa xe lửa diesel/điện.", "Khối hộp có ống khói phía trước.", "Đầu máy diesel thô, đèn pha, còi vô.", "Trung bình"],
    ["Đường Ray", "Xây dựng", "Hạ tầng giao thông", "Đường ray đặt cho tàu hỏa chạy.", "2 thanh song song trên tà vẹt.", "Ray thép bóng, tà vẹt gỗ, sỏi nền.", "Thấp"],
    ["Đường Nhựa", "Xây dựng", "Hạ tầng giao thông", "Đường trải cho xe chạy nhanh hơn.", "Plane xám dài.", "Nhựa đường nứt, vạch kẻ, lề đường.", "Thấp"],

    # 5. PHÒNG THỦ & VŨ KHÍ
    ["Tháp Súng Tự Động", "Phòng thủ", "Trụ phòng thủ", "Tự động bắn kẻ địch. (Auto Turret Rust).", "Khối hộp có nòng súng xoay.", "Tháp pháo 2 trục, camera hồng ngoại.", "Trung bình"],
    ["Bệ Tên Lửa SAM", "Phòng thủ", "Trụ phòng không", "Bắn hạ sinh vật bay và drone địch.", "Khối hộp có 4 ống phóng.", "Bệ xoay, ống phóng tên lửa, radar.", "Cao"],
    ["Hàng Rào Điện", "Phòng thủ", "Rào phòng thủ", "Gây sát thương điện khi chạm vào.", "Cọc + dây ngang phát sáng.", "Cọc thép, sứ cách điện, tia lửa.", "Thấp"],
    ["Bẫy Gai / Bẫy Đạp", "Phòng thủ", "Bẫy mặt đất", "Vật cản gây sát thương khi dẫm lên.", "Mặt phẳng có nhiều nón nhọn.", "Cọc gỗ/sắt nhọn, vết máu khô.", "Thấp"],
    ["Bẫy Shotgun", "Phòng thủ", "Bẫy sát thương", "Bắn đạn shotgun khi có kẻ đi qua.", "Khối nhỏ gắn tường có nòng.", "Hộp gỗ, nòng ống nước, dây cò.", "Thấp"],
    ["Bẫy Lửa", "Phòng thủ", "Bẫy sát thương", "Phun lửa vào kẻ đến gần.", "Khối nhỏ có vòi xoay.", "Bình gas, vòi phun, mồi lửa.", "Trung bình"],
    ["Pháo Cối", "Phòng thủ", "Vũ khí cố định", "Bắn đạn vòng cung tầm xa.", "Ống trụ nghiêng trên đế.", "Nòng thép, đế bê tông, bảng ngắm.", "Trung bình"],
    ["Rìu Đá Thô Sơ", "Công cụ", "Công cụ khai thác", "Công cụ đầu game chặt cây.", "Lưỡi đá buộc cán gỗ.", "Đá mài thô, dây thừng buộc.", "Thấp"],
    ["Cuốc Sắt", "Công cụ", "Công cụ khai thác", "Đào đá và quặng nhanh hơn.", "Lưỡi sắt + cán gỗ.", "Lưỡi thép đánh bóng, cán gỗ bọc da.", "Thấp"],
    ["Rìu Thiết Tinh", "Công cụ", "Công cụ khai thác", "Rìu cao cấp nhất, chặt rất nhanh.", "Lưỡi phát sáng + cán kim loại.", "Lưỡi tinh thể xanh, cán hợp kim.", "Trung bình"],
    ["Súng Lục Ống Nước", "Vũ khí", "Vũ khí tầm xa", "Súng tự chế đầu game. (Eoka Rust).", "Ống nước + cò.", "Súng ghép ống nước thô, lò xo.", "Thấp"],
    ["Súng Lục Ổ Xoay", "Vũ khí", "Vũ khí tầm xa", "Súng ngắn 6 viên chính xác TB.", "Nòng + ổ xoay trụ.", "Ổ xoay thép, báng gỗ, cò mạ.", "Trung bình"],
    ["Súng Trường AR Tự Chế", "Vũ khí", "Vũ khí tầm xa", "Súng trường tự động sát thương tốt.", "Nòng dài + báng + băng đạn.", "Thân thép, ray gắn phụ kiện.", "Trung bình"],
    ["Súng Bắn Tỉa", "Vũ khí", "Vũ khí tầm xa", "Bắn xa, sát thương cực cao.", "Nòng rất dài + ống ngắm.", "Nòng dài, ống ngắm 4x, báng gỗ.", "Trung bình"],
    ["Súng Shotgun", "Vũ khí", "Vũ khí tầm gần", "Sát thương cao tầm gần rải đạn.", "Nòng to ngắn + pump.", "Nòng kép/pump, báng nhựa.", "Trung bình"],
    ["Cung Tên", "Vũ khí", "Vũ khí tầm xa", "Vũ khí im lặng đầu game.", "Cung cong + dây.", "Cung gỗ uốn, dây thừng, tên gỗ.", "Thấp"],
    ["Rựa / Dao Sinh Tồn", "Vũ khí", "Vũ khí cận chiến", "Vũ khí cận chiến cơ bản.", "Lưỡi cong + cán.", "Lưỡi thép mài, cán gỗ bọc dây.", "Thấp"],
    ["Chất Nổ C4", "Vũ khí", "Thuốc nổ", "Phá tường và cửa kẻ thù.", "Khối hộp nhỏ dán tường.", "Khối thuốc nổ, dây kích nổ.", "Thấp"],
    ["Rocket Launcher", "Vũ khí", "Vũ khí hạng nặng", "Bắn rocket phá hủy diện rộng.", "Ống dài vai + đầu đạn.", "Ống phóng thép, kính ngắm.", "Trung bình"],

    # 6. NĂNG LƯỢNG & TÍN HIỆU
    ["Máy Phát Điện Xăng", "Năng lượng", "Nguồn điện", "Phát điện bằng nhiên liệu. Ồn.", "Khối hộp có ống xả.", "Động cơ diesel, bình xăng, ống xả.", "Thấp"],
    ["Tấm Pin Mặt Trời", "Năng lượng", "Nguồn điện", "Phát điện bằng mặt trời ban ngày.", "Tấm phẳng nghiêng trên chân đế.", "Panel xanh lam, khung nhôm, dây.", "Thấp"],
    ["Tua-bin Gió", "Năng lượng", "Nguồn điện", "Phát điện bằng gió cả ngày đêm.", "Cột cao có 3 cánh quạt.", "Cột thép, cánh quạt, nacelle.", "Trung bình"],
    ["Pin Dự Trữ", "Năng lượng", "Lưu trữ điện", "Tích trữ điện dư dự phòng.", "Khối hộp có đèn LED.", "Pin lithium công nghiệp, đồng hồ.", "Thấp"],
    ["Cột Điện / Dây Điện", "Năng lượng", "Truyền tải điện", "Nối dây giữa thiết bị điện.", "Cột trụ + dây nối.", "Cột gỗ, sứ cách điện, dây đồng.", "Thấp"],
    ["Công tắc Điện", "Tín hiệu", "Thiết bị điều khiển", "Bật/tắt dòng điện thủ công/auto.", "Hộp nhỏ gắn tường.", "Công tắc gạt, đèn báo, vỏ nhựa.", "Thấp"],

    # 7. NHÂN VẬT & QUÁI VẬT
    ["Nhân Vật (Survivor)", "Người chơi", "Nhân vật chính", "Model người chơi điều khiển.", "Khối hộp Block-man (10 parts).", "Đồ bảo hộ, mặt nạ, Topology.", "Trung bình"],
    ["Heo Rừng Gai", "Quái vật", "Quái cấp thấp", "Quái phổ biến tấn công khi bị chọc.", "Khối hộp 4 chân + nón nhọn.", "Điêu khắc cơ bắp, gai tinh thể.", "Trung bình"],
    ["Zombie Phóng Xạ", "Quái vật", "Quái cấp trung", "Zombie chậm gây sát thương phóng xạ.", "Người hình khối sơn xanh lục.", "Da mục nát, phát sáng rùng rợn.", "Trung bình"],
    ["Chim Cuộn Thép", "Quái vật", "Quái bay", "Chim bay tấn công từ trên cao.", "Chim lớn cánh dao kim loại.", "Cánh kim loại sắc, mắt đỏ.", "Trung bình"],
    ["Sói Đột Biến", "Quái vật", "Quái cấp trung", "Di chuyển nhanh, tấn công bầy.", "Hình chó 4 chân, gầy, răng dài.", "Lông rụng loang lổ, mắt vàng.", "Trung bình"],
    ["Gấu Bọc Giáp", "Quái vật", "Quái cấp cao", "Quái lớn cực bền, sát thương cao.", "Hình gấu khối lớn, giáp lưng.", "Lông rậm bùn, giáp xương sừng.", "Cao"],
    ["Nhện Khổng Lồ", "Quái vật", "Quái hang động", "Sống trong hang, phun nọc làm chậm.", "Thân tròn + 8 chân que.", "Lông cứng, mắt đỏ, nọc xanh.", "Trung bình"],
    ["Boss: Golem Thiết Tinh", "Quái vật", "Boss", "Boss khổng lồ bọc tinh thể.", "Người khổng lồ khối hộp + tinh thể.", "Thân đá, tinh thể phát sáng.", "Cao"],
    ["Thú cưỡi: Ngựa Hoang", "Quái vật", "Thú thuần hóa", "Cưỡi để di chuyển nhanh hơn.", "Hình ngựa khối đơn giản.", "Ngựa cơ bắp, yên cương, bờm.", "Trung bình"],

    # 8. TIÊU HAO & NÔNG NGHIỆP
    ["Đồ Hộp", "Sinh tồn", "Thực phẩm", "Giảm Đói. Không cần nấu.", "Lon trụ nhỏ.", "Lon thiếc không nhãn, nắp kéo.", "Thấp"],
    ["Thịt Sống", "Sinh tồn", "Thực phẩm", "Cần nấu chín drop từ quái vật.", "Khối hồng bất định hình.", "Miếng thịt đỏ, mỡ trắng.", "Thấp"],
    ["Thịt Nướng", "Sinh tồn", "Thực phẩm", "Giảm Đói nhiều, an toàn.", "Khối nâu sậm.", "Thịt nướng vàng, vết cháy xém.", "Thấp"],
    ["Chai Nước Sạch", "Sinh tồn", "Đồ uống", "Giảm Khát. Lọc từ nước bẩn.", "Chai trụ trong suốt.", "Chai nhựa đục, nắp xoáy.", "Thấp"],
    ["Kim Tiêm Y Tế", "Sinh tồn", "Thuốc hồi phục", "Hồi HP tức thời cực mạnh.", "Ống trụ nhỏ có kim.", "Ống tiêm nhựa, kim thép.", "Thấp"],
    ["Băng Gạc", "Sinh tồn", "Thuốc hồi phục", "Hồi HP chậm theo thời gian.", "Cuộn vải trắng nhỏ.", "Gạc y tế cuộn, vết máu khô.", "Thấp"],
    ["Luống Trồng Cây", "Nông nghiệp", "Cấu trúc trồng", "Ô đất trồng cây lương thực.", "Khối hộp thấp chứa đất.", "Khung gỗ, đất ẩm, mầm cây.", "Thấp"],
    ["Bể Nuôi Cá", "Nông nghiệp", "Cấu trúc nuôi", "Nuôi cá lấy thực phẩm bền vững.", "Khối hộp kính nông.", "Bể kính, khung sắt, cá bơi.", "Trung bình"],
    ["Lửa Trại", "Nội thất", "Trạm nấu ăn", "Nấu thịt sống, sưởi ấm ban đêm.", "Vài khối gỗ xếp + Plane lửa.", "Đá xếp vòng, gỗ cháy, lửa.", "Thấp"],
    ["Hộp Công Cụ", "Nội thất", "Bảo vệ vùng", "Claim vùng đất ngăn người lạ xây.", "Khối hộp gỗ nhỏ gắn tường.", "Tủ gỗ nhỏ, khóa, khe vật liệu.", "Thấp"],
]

# Nhóm Sheet
sheet_map = {
    "Tài nguyên & Môi trường": ["Tài nguyên", "Trang trí", "Môi trường"],
    "Xây dựng & Hạ tầng": ["Xây dựng"],
    "Máy móc & Chế biến": ["Khai thác", "Chế biến"],
    "Hậu cần & Lưu trữ": ["Logistics", "Lưu trữ"],
    "Phương tiện": ["Phương tiện"],
    "Phòng thủ & Vũ khí": ["Phòng thủ", "Vũ khí", "Công cụ"],
    "Nhân vật & Quái vật": ["Người chơi", "Quái vật"],
    "Sinh tồn & Nông nghiệp": ["Sinh tồn", "Nông nghiệp", "Nội thất", "Tín hiệu", "Loot"]
}

# Style Constants
header_font = Font(bold=True, color="FFFFFF")
header_fill = PatternFill(start_color="2F5496", end_color="2F5496", fill_type="solid")
border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))
align = Alignment(wrap_text=True, vertical='top')
header_align = Alignment(horizontal='center', vertical='center', wrap_text=True)

def apply_styles(ws, row_count):
    # Header
    for cell in ws[1]:
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_align
        cell.border = border
    # Data
    for row in ws.iter_rows(min_row=2, max_row=row_count+1):
        for cell in row:
            cell.border = border
            cell.alignment = align
    # Widths
    widths = [25, 15, 20, 45, 35, 35, 12]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[chr(64+i)].width = w
    ws.freeze_panes = 'A2'

wb = openpyxl.Workbook()

# Sheet 1: Tổng hợp
ws_all = wb.active
ws_all.title = "Tổng hợp"
headers = ["Model", "Category", "Loại", "Mục đích", "V1 Prototype", "V2 Detailed", "Complexity"]
ws_all.append(headers)
for r in data: ws_all.append(r)
apply_styles(ws_all, len(data))

# Sheet phụ theo nhóm
for sheet_name, cat_list in sheet_map.items():
    ws = wb.create_sheet(sheet_name)
    ws.append(headers)
    filtered_data = [r for r in data if r[1] in cat_list]
    for r in filtered_data: ws.append(r)
    apply_styles(ws, len(filtered_data))

# Lưu file (v3 cho chắc ăn)
save_path = r'Docs\3D_Models_List_MultiSheet.xlsx'
wb.save(save_path)
print(f"Done! Multi-sheet Excel created at: {save_path}")
