# 💰 THIẾT KẾ HỆ THỐNG TIỀN TỆ (CURRENCY SYSTEM DESIGN)

Tài liệu này mô tả chi tiết thiết kế hệ thống kinh tế và tiền tệ trong **Crystallized Iron**.

---

## 1. Loại tiền tệ

| Loại | Tên | Nguồn | Dùng để |
|------|-----|-------|---------| 
| Cày cuốc | **Vàng (Gold)** | Thám hiểm, bán đồ rác | Cường hóa, nâng cấp, ép cấp |
| Nạp tiền | **Kim Cương (Diamonds)** | IAP (In-App Purchase), Event | Skip time, Gacha, mở rộng kho đồ |

---

## 2. Quy tắc giao dịch

### Bắt buộc:
- MỌI thay đổi tiền tệ **PHẢI** ghi vào bảng `transactions` (audit trail)
- MỌI thao tác tiền **PHẢI** nằm trong MySQL Transaction (`START/COMMIT`)
- KHÔNG ĐƯỢC trừ tiền nếu số dư không đủ (check trước khi trừ)

### Lưu trữ:
- Tiền tệ **CHỈ** lưu trong **MySQL** (đảm bảo ACID)
- **TUYỆT ĐỐI KHÔNG** lưu tiền ở MongoDB
- Bảng `transactions` không bao giờ được xóa

---

## 3. Luồng xử lý giao dịch

```
1. Client gửi yêu cầu (mua/bán/nâng cấp)
2. Server kiểm tra số dư trong MySQL
3. Nếu đủ → START TRANSACTION
4. Trừ tiền + Thực hiện hành động + Ghi log vào `transactions`
5. COMMIT TRANSACTION
6. Gửi kết quả về Client
```

---

## 4. Cash Shop (Giai đoạn Beta)

- **Kim Cương:** Dùng để skip thời gian chờ và mua tài nguyên
- **Mở rộng kho đồ:** Tăng số ô lưu trữ vật phẩm
- **Gacha đặc biệt:** Quay thẻ trang bị cao cấp

---

## 5. Tài liệu liên quan

- [ItemSystem.md](ItemSystem.md) - Hệ thống vật phẩm (tiêu thụ tiền tệ)
- [CombatSystem.md](CombatSystem.md) - Chiến đấu (nguồn kiếm Vàng)
