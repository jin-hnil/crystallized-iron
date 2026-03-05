# 🔒 Crystallized Iron — Admin Panel

## Tổng quan

Bảng điều khiển quản trị cho game **Crystallized Iron**. Cho phép admin quản lý toàn bộ dữ liệu game bao gồm tài khoản, nhân vật, vật phẩm, quái vật, và bản đồ.

> ⚠️ **BẢO MẬT:** Admin Panel **CHỈ** chạy trên `localhost` (127.0.0.1). **KHÔNG ĐƯỢC** expose ra internet.

---

## Tính năng

| Trang | Mô tả | Database |
|-------|--------|----------|
| **Dashboard** | Tổng quan hệ thống, thống kê | MySQL + MongoDB |
| **Tài khoản** | Quản lý accounts, ban/unban | MySQL |
| **Nhân vật** | Xem/sửa chỉ số nhân vật | MySQL |
| **Item Templates** | CRUD khuôn mẫu vật phẩm | MongoDB |
| **Quái vật** | CRUD cấu hình mob/boss | MongoDB |
| **Bản đồ** | Quản lý Node Graph maps | MongoDB |

---

## Cài đặt & Chạy

```bash
# Cài dependencies (lần đầu)
cd admin_panel
npm install

# Chạy dev server (CHỈ localhost)
npm run dev
# → http://127.0.0.1:5174/
```

---

## Bảo mật

- **Bind address:** `127.0.0.1` (không phải `0.0.0.0`)
- **Port:** `5174` (tách biệt với web_client ở 5173)
- **CORS:** Tắt hoàn toàn
- **Meta robots:** `noindex, nofollow`
- Không firewall rule nào mở port 5174 ra ngoài

### Truy cập từ xa (nếu cần)

Nếu cần truy cập Admin Panel từ máy khác (VD: admin ngồi ở nhà), sử dụng **SSH Tunnel**:

```bash
# Từ máy admin, mở SSH tunnel đến server
ssh -L 5174:127.0.0.1:5174 user@your-server-ip

# Sau đó truy cập trên máy admin:
# http://localhost:5174/
```

---

## Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 7
- **Styling:** Vanilla CSS (design system trong `src/index.css`)
- **Font:** JetBrains Mono + Inter

---

## Cấu trúc thư mục

```
admin_panel/
├── index.html              ← Entry point
├── vite.config.ts          ← Cấu hình Vite (locked localhost)
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx            ← React entry
    ├── App.tsx             ← Main layout + routing
    ├── types.ts            ← TypeScript interfaces
    ├── mockData.ts         ← Dữ liệu mẫu (thay bằng API)
    ├── index.css           ← Design system
    └── components/
        ├── DashboardPage.tsx
        ├── AccountsPage.tsx
        ├── CharactersPage.tsx
        ├── ItemsPage.tsx
        ├── MapsPage.tsx
        └── MobsPage.tsx
```

---

## TODO — Kết nối API thật

Hiện tại admin panel dùng **mock data** (`src/mockData.ts`). Khi backend có API admin:

1. Tạo `src/api.ts` với các hàm fetch thật
2. Thay `mockData` imports bằng API calls  
3. Thêm authentication (JWT hoặc session-based)
4. Thêm real-time stats từ Redis (CCU, active sessions)
