# 📈 HỆ THỐNG TIẾN TRÌNH CẤP ĐỘ (LEVELING SYSTEM & EXP)

Tài liệu này dùng để định nghĩa và làm tài liệu tham khảo cho mọi cơ chế liên quan đến Cấp độ (Level) và Điểm Kinh nghiệm (EXP) trong trò chơi **Crystallized Iron**.

---

## 1. Công thức Tăng Trưởng XP (XP Progression Formula)

Tốc độ lên cấp của Hệ thống được chúng ta tính theo chuẩn của các tựa game MMO RPG dạng cày cuốc (Grinding) hàng đầu hiện nay. Chúng ta sử dụng chung một công thức toán học đường cong lập phương (Cubic/Exponential Equation). 

**Công thức xác định:** `XP_Required(L) = Lọc số nguyên của (100 * Level ^ 2.5 + 500 * Level)`

**Trong đó:**
- L (`Level`): Cấp độ hiện tại của nhân vật.
- Số cơ bản `100`: Là hệ số dùng để định hình lại nếu như muốn Server Hardcore (Cày khó) hoặc Server x10, x100 Custom.
- Mũ `2.5`: Chỉ số tăng trưởng vĩ mô. Số mũ càng lớn, độ vọt tiến trình ở các Level về sau sẽ càng cao.
- Cộng `500 * Level`: Padding bù đắp ban đầu tránh cấp 1, 2 yêu cầu quá ít EXP.

## 2. Bảng Theo Dõi Khái Quát

| Cấp hiện tại | Cấp độ Đích | Tốc độ tính toán (XP) | Nhận xét độ khó theo GDD |
| --- | --- | --- | --- |
| 1 | Lên 2 | Cần `600 XP` | Cực kỳ nhanh (đánh chạm 2, 3 quái nhỏ) |
| 10 | Lên 11 | Cần `~36.000 XP` | Bắt đầu đi sâu vào Core Loop (Cày đồ, ép thiết bị) |
| 50 | Lên 51 | Cần `~1.800.000 XP` | Giai đoạn cày tầm trung. Yêu cầu tính kiên nhẫn cao và Pt (Party) 5 người |
| 90 | Lên 91 | Cần `~7.700.000 XP` | Phải đánh các loại Rồng, Boss và Khu cực khó (Hell map). |
| 99 | Đỉnh điểm (100)| Cần `~10.000.000 XP` | Cuối Game. Chỗ đứng trên Bảng xếp hạng. |

**TẦM CAO NHẤT:** Cấp độ giới hạn tối đa hiện tại (Max Level) là `100`. Tại mức Level 100, Hàm sẽ khoá giá trị nhận EXP thành Vô hạn (Infinity), user không thể lên thành 101.

## 3. Phần thưởng Thăng Cấp (Level Up Mechanics)

Ngay khi User giết quái và biến `experience` vượt ngưỡng hoặc bằng lượng cần có, sự kiện Nhảy Cấp (Level Up Event) sẽ được Server tự động thực thi trong `Player.ts`:
1. Vòng lặp `Level++` sẽ trừ lượng XP tương đương cho tới khi lượng XP dư thừa còn lại nhỏ hơn XP Yêu cầu của Cấp tiếp theo -> Phù hợp cho việc ăn một đống điểm kinh nghiệm siêu khủng và Thăng 1 lúc 3, 4 Cấp.
2. Nhận thêm `+5 Điểm Chỉ số` (Stat Points) cho người chơi để tự cộng chỉ số.  
3. Tự động phục hồi cực đại Huyết lượng (HP = MaxHP) và Năng Lượng (MP = MaxMP).

## 4. Quản lý Tải Máy Chủ (Performance Check)

So với kiểu khai báo cấu trúc số lượng khổng lồ `BigInt`, công thức giới hạn XP cần để lên 100 hiện tại chỉ mất khoảng `~10 triệu XP`. Và tổng số XP tích lũy toàn Game trong Vòng Đời 1 nhân vật đến Max level chỉ nằm dưới `1 Tỷ XP`. 

Khối lượng này hoàn toàn nằm an toàn trong giới hạn của chuẩn biến hệ `number` (Int32 / Int64) mặc định trong JavaScript và MySQL. Nhờ đó, máy chủ RAM 4GB của bạn sẽ xử lý rất "mượt" các bước Check While vòng lặp Thăng cấp cho hàng ngàn người chơi mà bị đầy Disk.

---

## 5. Tài liệu liên quan

- [CharacterStats.md](CharacterStats.md) - Chỉ số nhân vật (nhận stat points khi lên cấp)
- [CombatSystem.md](CombatSystem.md) - Chiến đấu (nguồn EXP chính)
- [MapSystem_Architecture.md](MapSystem_Architecture.md) - Thám hiểm (nơi kiếm EXP)

