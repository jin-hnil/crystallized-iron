# ⚔️ THIẾT KẾ HỆ THỐNG CHIẾN ĐẤU (COMBAT SYSTEM DESIGN)

Tài liệu này mô tả chi tiết thiết kế và công thức của hệ thống chiến đấu trong **Crystallized Iron**.

---

## 1. Tổng quan

- Chiến đấu = **Text Log** (nhật ký văn bản), KHÔNG có hoạt ảnh đâm chém
- Kết quả trận đánh tính toán hoàn toàn trên **Server** (Authoritative)
- Client chỉ **hiển thị** kết quả, KHÔNG được tính toán damage
- Hai tấm thẻ của Nhân vật và Quái vật đại diện đối đầu nhau trên giao diện
- Bên dưới là khung nhật ký trận đánh (Battle Log)

---

## 2. Công thức chiến đấu

### Sát thương
```
Sát thương thực tế = max(1, Tấn công - Phòng thủ) × random(0.8, 1.2)
```

### Chí mạng
```
Chí mạng = Sát thương × 1.8 (nếu roll < critChance)
```

### Tỷ lệ đánh trúng
```
Tỷ lệ đánh trúng = Chính xác tấn công - Né tránh phòng thủ
```

### Thứ tự hành động
```
Thứ tự hành động = So sánh Speed, cao hơn đánh trước
```

---

## 3. Chỉ số chiến đấu

| Chỉ số | Field name | Mặc định Lv.1 | Mô tả |
|--------|-----------|---------------|-------|
| Tấn công | `attack` | 10 | Lực đánh tổng quát, dùng tính sát thương trong Battle Log |
| Phòng thủ | `defense` | 5 | Chỉ số chống chịu, cản sát thương |
| Chính xác | `accuracy` | 100 | Đối trọng với né tránh, tính tỷ lệ đánh trúng |
| Né tránh | `evasion` | 5 | Vô hiệu hóa sát thương một đòn đánh |
| Tốc độ | `speed` | 10 | Quyết định ai xuất phát đầu tiên mỗi Turn |
| Chí mạng | `critChance` | 0.05 (5%) | Tỷ lệ xuất hiện bạo kích trên Log |
| Kháng phép | `magicResistance` | 0 | Giảm sát thương phép thuật nhận vào |
| Kháng hiệu ứng | `effectResistance` | 0 | Giảm tỷ lệ dính debuff |

> Xem thêm chi tiết tại [CharacterStats.md](CharacterStats.md)

---

## 4. Luồng xử lý trận đánh

1. **Gặp quái:** Khi nhân vật di chuyển đến Node loại `mob` hoặc `boss`, Server kích hoạt trận đánh
2. **Tính toán Turn:** Server so sánh `speed` hai bên → bên nhanh hơn đánh trước
3. **Roll đánh trúng:** Tính `accuracy - evasion` → roll xem có trúng không
4. **Tính sát thương:** Nếu trúng → tính damage theo công thức, roll crit
5. **Ghi Log:** Mỗi hành động sinh ra một dòng text log (JSON)
6. **Lặp lại:** Cho đến khi một bên HP = 0
7. **Gửi kết quả:** Toàn bộ log + kết quả gửi về Client qua WebSocket

---

## 5. Hiển thị trên Client

- **Card-based Text Battle:** Hai tấm thẻ (Card-Art) đại diện đối đầu
- **Battle Log Box:** Khung hiển thị liên tục các dòng text mô tả trận đánh
- **Ví dụ log:** *"Nhân vật A tung đòn bạo kích, gây 300 sát thương vào quái vật B"*
- Thanh HP/MP cập nhật theo kết quả từ Server

---

## 6. Tài liệu liên quan

- [CharacterStats.md](CharacterStats.md) - Chi tiết chỉ số nhân vật
- [LevelingSystem.md](LevelingSystem.md) - Hệ thống cấp độ & kinh nghiệm
- [MapSystem_Architecture.md](MapSystem_Architecture.md) - Hệ thống bản đồ (nơi kích hoạt chiến đấu)
- [CurrencySystem.md](CurrencySystem.md) - Phần thưởng tiền tệ từ chiến đấu
