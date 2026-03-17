# 🗺️ KIẾN TRÚC HỆ THỐNG BẢN ĐỒ 3D (ZONES & TERRAIN)

Dự án **Crystallized Iron** chính thức chia tay Node Graph giả lập cũ, bước vào hệ thống bản đồ Địa hình Không Gian 3 Chiều mở lớn (Open World 3D).

---

## 1. Nền tảng Thế Giới (World Generation)

- **Unity Terrain System:** 
  Game sử dụng hệ thống Terrain đồi núi, bãi lở đất tự chỉnh của Unity. Địa hình này có Collider, có chỗ trũng có sông nước, có vách cao để lẩn trốn tầm bắn của súng đạn.
- **Spawn Cứ Điểm:**
  Nhà máy xí nghiệp hoặc các hố Quặng Thiết Tinh được spawn ở các vị trí tọa độ chiến lược. Đây là những POI (Điểm đáng chú ý), thu hút người chơi và quái vật tụ tập về để khai thác tài nguyên xịn hoặc bắn giết trộm đồ lẫn nhau.

## 2. Cơ chế phân bổ Tài nguyên 3D vật lý (Nodes)

Lưu ý, chữ "Node" này trên 3D khác với khái niệm đi tuyến tính theo Map.
- **Resource Prefabs:** Các gốc Cây Gỗ bự chà bá, hoặc Đồi Lưu Huỳnh, Khối Đá Sắt là các Asset 3D có Collider bao quanh đứng sừng sững ghim trên nền đất Terrain.
- **Hit Detection:** Khi người chơi đập Rìu vào, Camera bắn ra một tia Raycast kiểm tra Object đang chém trúng là "Rock" hay "Tree". Object đó sẽ tụt máu đi, cứ mỗi 3 nhịp đập, Item Cục Sắt sẽ văng rơi tõm ra đất hoặc auto bay vào túi người chơi.
- **Tự bù trừ (Respawn rate):** Mỗi cái Cây sau khi bị đập bể nát mất hút khỏi bản đồ, Hệ thống quản lý màn chơi (Game Manager cục bộ) sẽ âm thầm đánh dấu điểm đó đang trống và mọc lại (Respawn) sau vài Giờ/Phút trong đồng hồ in-game.

## 3. Hệ Thống Ngày Đêm Khắc Nghiệt (Dynamic Day/Night Cycle)

Chu kỳ Ánh sáng trong game không chỉ để cho đẹp, nó là cốt lõi cân bằng Sinh Tồn:
- **Tốc độ thời gian:** Thời gian quay liên tục. Một chu kỳ trọn vẹn (vd: 24 phút đời thực = 1 ngày game). Ban ngày kéo dài hơn ban đêm để cung cấp khung giờ "Tương đối an toàn" cho việc Xây Dựng và Đi săn.
- **Che Khuất Tầm Nhìn (Visibility):** Khi Mặt Trời lặn hẳn, Bóng tối sẽ bao phủ đen kịt hoàn toàn. Không có ánh Trăng nhân tạo soi sáng rõ đường đi. Người chơi BẮT BUỘC phải chế tạo Thiết bị Hỗ trợ (Đuốc, Đèn Pin lắp trên súng, Kính nhìn đêm) hoặc thắp sáng cả khu vực khai thác bằng Đèn Pha Nối Điện (Searchlights), nếu không sẽ bị lạc giữa rừng.
- **Bóng Đêm Thức Giấc (Night Horrors):** Màn đêm thu hút đám Mutant mắt đỏ lộng hành nhiều hơn, tỉ lệ xuất hiện Dã Thú tăng cao và đặc biệt là cực kì máu chiến (Tăng Aggro / Tầm nhìn phát hiện người). Quái vật có thể đi lang thang bủa vây lại các hầm mỏ mà ban ngày bạn đang khoan quặng tiếng ồn rầm rầm.
- **Nguồn Lạnh Lẽo (Cold Temperature penalty):** Sương mù và cái lạnh buốt xương ban đêm sẽ làm chỉ số **Máu (HP)** và **Đói (Hunger)** giảm xuống nhanh hơn bình thường. Bạn cần đốt Lửa Trại (Campfire) hoặc đứng trong bán kính nhiệt của Lò Nung Công Nghiệp (Furnace) bên trong 4 vách Tường kín gió để sưởi ấm vượt qua đêm tối.
