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
    *   `hp / maxHp`: Lượng Máu (Sức khỏe) hiện tại và tối đa. Mặc định nhân vật level 1 có 100 máu. Khi máu trong Log giao tranh về 0, thẻ nhân vật bị ẩn, báo hiệu thua trận.
    *   `mp / maxMp`: Năng lượng (Mana). Được tiêu tốn để kích hoạt chỉ số ngầm trong các thẻ bài/Kỹ năng đặc biệt ở một vài lượt Text Log nhất định. (Mặc định: `50`)

*   **Chỉ số Giao Tranh (Combat Stats - Quyết định Kết quả Battle Log):**
    *   `attack` (Tấn công): Lực đánh tổng quát của nhân vật. Lượng sát thương thuần túy dùng tính toán trong Text Log Battle. Mặc định khởi điểm có thể là `10`.
    *   `defense` (Phòng thủ): Chỉ số chống chịu, cản sát thương. Công thức logic log chiến đấu cơ bản: `Sát Thương Thực = Tấn Công đối phương - Phòng Thủ bản thân`. (Mặc định: `5`)
    *   `accuracy` (Chính xác): Chỉ số đối trọng với khả năng né tránh của địch. Tính toán tỷ lệ phần trăm ra đòn trúng.
    *   `evasion` (Né tránh): Khả năng hoàn toàn vô hiệu hóa sát thương một đòn đánh dựa trên chỉ số phần trăm. Tính như sau: `Tỷ lệ đánh trúng = Chính xác đòn tấn công - Né tránh phe thủ`.
    *   `speed` (Tốc độ): Quyết định ai là người xuất phát đầu tiên trong mỗi Turn của Battle Log. Rất quan trọng ở đấu trường.
    *   `critChance` (Tỉ lệ Chí mạng): Tỉ lệ xuất hiện bạo kích trên Log (Ví dụ: `0.05` tức `5%`). Sát thương x1.5 hoặc x2.

*   **Chỉ số Phát triển Nâng Cao:**
    *   `exprerience` (Kinh nghiệm - EXP): Lượng kinh nghiệm nhận được khi tiêu diệt quái/boss hay hoàn tất nhiệm vụ.
    *   `statPoints` (Điểm Chỉ số): Lượng điểm người chơi nhận được khi tăng Cấp độ (+ Level). Có thể dùng số điểm này trong UI để chủ động nâng cấp `HP, MP, Attack, Defense, Speed` nhằm xây dựng min/max thông số cho thẻ bài của mình.

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
