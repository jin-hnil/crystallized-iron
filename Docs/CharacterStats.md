# ⚔️ THÔNG SỐ VÀ CHỈ SỐ NHÂN VẬT (CHARACTER STATS)

Tài liệu này dùng để định nghĩa và làm tài liệu tham khảo cho mọi Hệ thống chỉ số chiến đấu, sinh tồn của các "Kẻ Thức Tỉnh" (Awakeners) trong trò chơi **Crystallized Iron**.

---

## 1. Cơ cấu Dữ lịêu Thể Hiện (Data Structure)

Theo cấu trúc trong Backend (`src/types.ts` và `src/Player.ts`), trạng thái của một nhân vật hay Kẻ Thức Tỉnh (PlayerState) bao gồm các trường thông tin:

*   **Định danh cơ bản:**
    *   `id` (String): Mã định danh (UUIDv4) của mỗi user kết nối.
    *   `name` (String): Tên hiển thị trên đầu nhân vật.
    *   `position`: Tọa độ `X, Y` mà nhân vật đang đứng trong Tilemap.

*   **Chỉ số Sinh Tồn & Cốt Lõi:**
    *   `level` (Khoảng 1-100): Cấp độ hiện tại của nhân vật.
    *   `hp / maxHp`: Lượng Máu (Sức khỏe) hiện tại và tối đa. Mặc định nhân vật level 1 có 100 máu. Khi máu về 0, nhân vật gục ngã và phải hồi sinh.
    *   `mp / maxMp`: Năng lượng (Mana Points) hiện tại và tối đa. Mặc định ở Level 1 là 50. Năng lượng này sẽ tiêu tốn mỗi khi sử dụng kỹ năng đặc biệt, lao nhanh (Dash).

*   **Chỉ số Giao Tranh (Combat Stats - Quyết định Sát thương):**
    *   `physicalAttack`: Lực đánh vật lý cơ bản. Được dùng để tính sát thương hệ cận chiến (chém kiếm, đập búa) hoặc đánh xa thuần túy (bắn tên, đạn thực). (Mặc định: `10`)
    *   `magicAttack`: Lực đánh phép thuật/năng lượng. Được dùng để tính sát thương diện rộng, các loại chưởng tia laser, cầu lửa hoặc độc chất. (Mặc định: `10`)
    *   `armor`: Giáp. Chỉ số này sẽ giảm lượng sát thương vật lý nhận vào từ kẻ địch. Ví dụ cơ chế giảm sát thương: `Sát Thương Cuối = Sát Thương Đích - Armor`. (Mặc định: `5`)
    *   `magicResistance`: Kháng phép. Chỉ số này giúp giảm lượng sát thương phép thuật hoặc năng lượng nhận vào từ kỹ năng của quái vật hoặc pháp sư. (Mặc định: `5`)
    *   `effectResistance`: Kháng hiệu ứng. Mức độ chống chịu lại các hiệu ứng bất lợi (Crowd Control / Tiêu cực) như Choáng (Stun), Trói (Root), Chậm (Slow), Chảy máu. Số này càng to thì thời gian bị dính hiệu ứng càng ngắn hoặc có tỷ lệ miễn nhiễm hoàn toàn. (Mặc định: `0`)
    *   `critChance`: Tỉ lệ Chí mạng. Giá trị biểu thị bằng tỉ lệ phần trăm từ `0.0` đến `1.0`. (Mặc định: `0.05` tức `5%`). Nếu đòn đánh kích hoạt chí mạng, sát thương gây ra có thể x2 bình thường.

*   **Chỉ số Phát triển Nâng Cao:**
    *   `exprerience` (Kinh nghiệm - EXP): Lượng kinh nghiệm nhận được khi tiêu diệt quái/boss hay hoàn tất nhiệm vụ.
    *   `statPoints` (Điểm Chỉ số): Lượng điểm người chơi nhận được khi tăng Cấp độ (+ Level). Có thể dùng số điểm này trong UI để tự cộng vào `HP, MP, Vật lý, Phép thuật, Giáp` nhằm xây dựng "Build" nhân vật riêng (Tanker, Trâu bò, hay Sát Thủ Kính).

---

## 2. Quy trình Luân chuyển Chỉ số giữa Server và Client

Hệ thống chỉ số đang áp dụng mô hình **Authoritative Server** (Máy chủ uy quyền):
1. Mọi chỉ số của nhân vật đều được lưu trữ và tính toán hoàn toàn nằm trên Code Backend Node.js (trong Class `Player`).
2. Mọi diễn biến tăng hay giảm HP, MP đều do logic trên máy chủ quyết định chứ không phải Client.
3. Client (như Unity / Web) chỉ biết được bức tranh toàn cảnh khi thông điệp `INIT_STATE` (Lúc bắt đầu vào game) hoặc bản tin đồng bộ định kỳ được truyền đến. Do vậy, việc hack chỉnh sửa máu 99999 từ Web Client/Local memory sẽ trở nên vô nghĩa, giúp trò chơi MMORPG giữ tính công bằng tuyệt đối.

---

## 3. Khả năng phát triển tương lai (Future Scalability)

Sắp tới, cấu trúc này có thể mở rộng bổ sung trực tiếp trên TypeScript Interface:
- **`attackSpeed`:** Tốc độ ra đòn đánh.
- **`moveSpeed`:** Tốc độ bước chạy/di chuyển của nhân vật (Buff tùy theo trang bị).
- **Trạng Thái Hiệu Ứng (Status Ailments):** Bổ sung array/object về các hiệu ứng Trúng Độc (`Poison`), Cháy (`Burn`), Giảm phòng thủ đang có thời hạn trên người.
