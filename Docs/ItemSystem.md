# 🎴 THIẾT KẾ HỆ THỐNG VẬT PHẨM (ITEM SYSTEM DESIGN)

Tài liệu này mô tả chi tiết thiết kế hệ thống vật phẩm và trang bị trong **Crystallized Iron**.

---

## 1. Tổng quan

Cốt lõi của game là hàng ngàn trang bị/cổ vật dưới dạng **Thẻ bài (Item Cards)** với các phẩm chất khác nhau. Mỗi món đồ có các dòng chỉ số ngẫu nhiên (Random Stats), tạo động lực cày cuốc không ngừng để min-max nhân vật.

---

## 2. Lưu trữ dữ liệu

| Dữ liệu | Database | Lý do |
|----------|----------|-------|
| Template vật phẩm (Item Schemas) | **MongoDB** (`item_templates`) | Đọc/Ghi nhanh, sub-stats thay đổi linh hoạt |
| Instance vật phẩm (đã roll stats) | **MySQL** (`inventory`) | Mỗi item có ID duy nhất, chống Dupe, ACID |
| ID vật phẩm | **MySQL** | Đảm bảo tính duy nhất, toàn vẹn dữ liệu |

### Quy tắc cốt lõi:
- Mỗi vật phẩm có **ID duy nhất** trong MySQL (chống Dupe)
- Chỉ số phụ (Sub-stats) **ngẫu nhiên** khi sinh ra
- Nguồn gốc vật phẩm: Chỉ có được từ Thám hiểm, Nhiệm vụ IDLE, hoặc Gacha

---

## 3. Phẩm chất vật phẩm (Rarity)

| Màu | Độ hiếm | Số dòng phụ | Mô tả |
|-----|---------|-------------|-------|
| ⬜ Trắng | 1★ | 0-1 | Thẻ rác, dùng làm nguyên liệu |
| 🟦 Xanh | 2★ | 1-2 | Trang bị cơ bản |
| 🟪 Tím | 3★ | 2-3 | Trang bị tốt |
| 🟧 Cam | 4★ | 3 | Trang bị hiếm |
| 🟥 Đỏ | 5★ | 3-4 | Trang bị cực hiếm |
| 🌟 Huyền thoại | 6★ | 4 | Cổ vật huyền thoại |

---

## 4. Chỉ số vật phẩm

### Chỉ số chính (Main Stats)
Thẻ Trang Bị cơ bản chi phối 5 thông số:
- Tấn công (Attack)
- Phòng thủ (Defense)
- Máu (HP)
- Chính xác (Accuracy)
- Né tránh (Evasion)

### Chỉ số phụ (Sub-Stats)
- Số lượng dòng phụ phụ thuộc vào **Phẩm chất** của vật phẩm
- Giá trị sub-stats được **roll ngẫu nhiên** khi item được sinh ra
- Sub-stats có thể bao gồm: % tăng chỉ số, flat bonus, hiệu ứng đặc biệt

---

## 5. Hệ thống nâng cấp

### Cường hóa (Enhance)
- Sử dụng thẻ rác làm nguyên liệu để nâng cấp thẻ chính
- Chi phí bằng Vàng (Gold)

### Khảm nạm ngọc (Socketing)
- Gắn ngọc vào slot trang bị/vũ khí
- Tăng chỉ số đột phá theo hệ ngọc

---

## 6. Tài liệu liên quan

- [CharacterStats.md](CharacterStats.md) - Chỉ số nhân vật (ảnh hưởng bởi trang bị)
- [CurrencySystem.md](CurrencySystem.md) - Tiền tệ dùng cho nâng cấp
- [CombatSystem.md](CombatSystem.md) - Chiến đấu (nơi chỉ số item phát huy)
