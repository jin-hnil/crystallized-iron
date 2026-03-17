# 🧑‍⚕️ THÔNG SỐ NHÂN VẬT & SINH TỒN (CHARACTER SURVIVAL STATS)

Trong dự án Sinh Tồn 3D **Crystallized Iron**, mọi chỉ số RPG truyền thống phức tạp như `Attack`, `Defense`, `Evasion`, `Accuracy`, `Crit`, v.v. **ĐỀU ĐÃ BỊ LOẠI BỎ**. 

Nhân vật của bạn là một con người phàm trần bình thường, sự mạnh/yếu xuất phát từ súng ống đồ đạc bạn cầm, sức khỏe con người chỉ gói gọn ở mức **04 THÔNG SỐ SINH LÝ** hiển thị trên góc HUD dưới đây:

---

## 1. CHI TIẾT 04 CHỈ SỐ CỐT LÕI

### A. Máu (Health / HP)
- **Mô tả:** Lượng sinh lực quyết định sống - chết.
- **Hoạt động:** Hiện diện dưới dạng một thanh Bar màu đỏ (Từ 0 đến 100).
- **Phạt (Penalty):** Khi máu chạm vạch 0, nhân vật **Cúi gục (Death)**. Hành trang sẽ văng ra ngoài thành một hòm túi (Loot sack) để ai cũng nhặt được. Nhân vật sẽ buộc hồi sinh (Respawn) tại một túi ngủ (Sleeping bag) đã xếp sẵn hoặc bờ biển ở trạng thái Máu thấp trắng tay.
- **Hồi phục:** Quấn Băng y tế, tiêm ngòi Sinh học, sử dụng túi cứu thương (Medkit). Ăn no, uống đủ cũng đẩy từ từ lượng HP dư dần lên.

### B. Giáp (Armor Mitigation)
- **Mô tả:** Sự vững chãi và năng lực chống đạn bảo hộ.
- **Hoạt động:** Hiện diện cùng cạnh Máu bằng thanh Bar màu xám kim loại. Bạn phải có đồ bảo hộ mặc trên khung Cơ thể (Áo vải, Áo da chó, Giáp Thiết Tinh) thì chỉ số này mới lớn hơn 0.
- **Quy tắc chặn sát thương:** Nếu bị Quái cắn hoặc Đạn bắn trúng, lượng sát thương sẽ đập vào Giáp đứt đi một nửa (hoặc 1 lượng tỷ lệ % được giảm) trước khi trừ vào thanh Máu. Quần áo mặc lâu ngày dính nhiều chấn thương sẽ "Hỏng hóc" (Mất độ bền làm trừ mất Giáp).

### C. Đói (Hunger)
- **Mô tả:** Lượng thức ăn và chất dinh dưỡng trong bụng.
- **Hoạt động:** Thanh Bar màu xanh nhạt hoặc Cam nằm dưới, từ 0 đến 100.
- **Tại sao giảm:** Mọi dòng thời gian 24h trôi qua sẽ làm hệ thống tiêu hóa liên tục làm Đói từ từ. Nếu chạy đua nước rút, lao lực chặt cây bửa củi liên tay thì cơn đói xé rách cuống họng nhanh gấp đôi.
- **Phạt (Penalty):** Khi bụng đói chạm vạch 0 (Starving), nhân vật suy nhược, tầm nhìn lay lắc chao đảo, máu từ từ rút ở tiến độ ổn định cho tới khi gục xuống chết đói.
- **Hồi phục:** Nhanh chóng nạp vào Thịt cừu nướng, Mì hộp rỉ sét lượm được, Ngô trồng ở rẫy.

### D. Khát (Thirst)
- **Mô tả:** Lượng nước sống còn.
- **Hoạt động:** Thanh Bar màu Xanh biếc giọt nước, dao động 0 đến 100. Cơ thể con người chịu Khát tồi hơn chịu Đói, vì thế tốc độ tụt thanh nước sẽ luôn **nhanh hơn 1.5 lần** thanh đồ ăn. Đặc biệt nếu đang đứng trong Biome dạng Sa Mạc.
- **Phạt (Penalty):** Thiếu nước dẫn tới tình trạng Khô Hạn. Nhân vật không thể tăng tốc (Sprinting) được nữa vì thể lực tụt rễ. Máu cũng sẽ lao dốc dần cho đến chết.
- **Hồi phục:** Vơ vét bình nước uống vội, hứng nước sương mai, đun sôi nước ao sông cho hết phóng xạ bằng Bình Thiết Tinh sạch, ăn các hạt quả mọng nhiều nước.

---

## 2. CHÚ THÍCH PHÒNG TRỪ Ý ĐỊNH
Tuyệt đối nhấn mạnh với AI, nếu yêu cầu lập trình hay sửa file thuộc về `Character/Player`, **KHÔNG ĐƯỢC PHÉP** add thêm bất kì biến dạng kỹ năng thần kì nào khác. Không Mana. Không Tốc Đánh nội tại. Hãy tập trung 100% tài nguyên xử lý logic cho 4 biến `hp, armor, hunger, thirst` được bảo toàn và update real-time bằng C# trên Unity / Server.
