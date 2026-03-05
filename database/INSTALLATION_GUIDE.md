# 🛠️ Hướng dẫn Cài đặt Database trên Server

## Mục lục

- [Yêu cầu Hệ thống](#yêu-cầu-hệ-thống)
- [Phần 1: Cài đặt MySQL](#phần-1-cài-đặt-mysql)
- [Phần 2: Cài đặt MongoDB](#phần-2-cài-đặt-mongodb)
- [Phần 3: Cấu hình kết nối Backend](#phần-3-cấu-hình-kết-nối-backend)
- [Phần 4: Backup & Bảo trì](#phần-4-backup--bảo-trì)
- [Xử lý Sự cố](#xử-lý-sự-cố)

---

## Yêu cầu Hệ thống

| Thành phần | Yêu cầu tối thiểu | Khuyến nghị |
|------------|-------------------|-------------|
| **OS** | Ubuntu 20.04 LTS / Debian 11+ | Ubuntu 22.04 LTS |
| **RAM** | 4 GB | 8 GB+ |
| **CPU** | 2 vCPU | 4 vCPU |
| **Disk** | 20 GB SSD | 50 GB+ SSD |
| **MySQL** | 8.0+ | 8.0.35+ |
| **MongoDB** | 6.0+ | 7.0+ |

> ⚠️ **Lưu ý:** Hướng dẫn này dành cho server **Linux (Ubuntu/Debian)**. Nếu dùng Windows Server hoặc CentOS, một số lệnh sẽ khác.

---

## Phần 1: Cài đặt MySQL

### 1.1. Cài đặt MySQL Server

```bash
# Cập nhật package list
sudo apt update && sudo apt upgrade -y

# Cài đặt MySQL Server
sudo apt install mysql-server -y

# Kiểm tra phiên bản
mysql --version

# Khởi động và enable auto-start
sudo systemctl start mysql
sudo systemctl enable mysql

# Kiểm tra trạng thái
sudo systemctl status mysql
```

### 1.2. Bảo mật MySQL (BẮT BUỘC)

```bash
# Chạy script bảo mật
sudo mysql_secure_installation
```

Khi chạy script, chọn các tùy chọn sau:

| Câu hỏi | Chọn |
|----------|------|
| VALIDATE PASSWORD plugin | **Yes** |
| Password validation policy | **2 (STRONG)** |
| Set root password | Đặt password mạnh, ghi lại cẩn thận |
| Remove anonymous users | **Yes** |
| Disallow root login remotely | **Yes** (sẽ tạo user riêng) |
| Remove test database | **Yes** |
| Reload privilege tables | **Yes** |

### 1.3. Tạo Database & User cho dự án

```bash
# Đăng nhập MySQL với root
sudo mysql -u root -p
```

Chạy các lệnh SQL sau trong MySQL shell:

```sql
-- ============================================
-- Tạo database cho Crystallized Iron
-- ============================================
CREATE DATABASE IF NOT EXISTS crystallized_iron
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- ============================================
-- Tạo user chuyên dụng (KHÔNG dùng root cho app)
-- ============================================
CREATE USER 'ci_server'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';

-- Cấp quyền chỉ trên database dự án
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER
    ON crystallized_iron.*
    TO 'ci_server'@'localhost';

-- Nếu backend chạy trên máy khác (thay IP tương ứng):
-- CREATE USER 'ci_server'@'10.0.0.%' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';
-- GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER
--     ON crystallized_iron.* TO 'ci_server'@'10.0.0.%';

FLUSH PRIVILEGES;

-- Kiểm tra user đã tạo
SELECT User, Host FROM mysql.user WHERE User = 'ci_server';
```

> ⚠️ **QUAN TRỌNG:** Thay `YOUR_STRONG_PASSWORD_HERE` bằng mật khẩu thật. Password phải chứa ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.

### 1.4. Import Schema

```bash
# Import schema từ file schema.sql
mysql -u ci_server -p crystallized_iron < /path/to/Crystallized-Iron/database/mysql/schema.sql
```

Hoặc nếu đã đăng nhập MySQL shell:

```sql
USE crystallized_iron;
SOURCE /path/to/Crystallized-Iron/database/mysql/schema.sql;

-- Kiểm tra các bảng đã tạo
SHOW TABLES;
```

**Kết quả mong đợi - 6 bảng:**

```
+-------------------------------+
| Tables_in_crystallized_iron   |
+-------------------------------+
| accounts                      |
| characters                    |
| currencies                    |
| gacha_history                 |
| inventory                     |
| transactions                  |
+-------------------------------+
```

### 1.5. Cấu hình MySQL cho Production

Chỉnh file cấu hình MySQL:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Thêm/sửa các dòng sau vào section `[mysqld]`:

```ini
[mysqld]
# ============================================
# Crystallized Iron - MySQL Production Config
# ============================================

# Charset mặc định (hỗ trợ tiếng Việt + emoji)
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB Buffer Pool (đặt ~50-70% RAM khả dụng)
# Ví dụ: Server 4GB RAM → đặt 2GB
innodb_buffer_pool_size = 2G

# Log slow queries (threshold > 200ms theo RULES.md)
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 0.2

# Connection limit (tối đa 50 cho game server nhỏ)
max_connections = 50

# Bind address (chỉ cho localhost nếu DB cùng máy backend)
bind-address = 127.0.0.1

# Binary log (cần cho backup point-in-time recovery)
log_bin = /var/log/mysql/mysql-bin
expire_logs_days = 7
```

Restart MySQL sau khi sửa config:

```bash
sudo systemctl restart mysql

# Kiểm tra lại trạng thái
sudo systemctl status mysql
```

### 1.6. Test kết nối

```bash
# Test kết nối với user mới
mysql -u ci_server -p -e "SELECT 1 AS test; SHOW DATABASES;"
```

---

## Phần 2: Cài đặt MongoDB

### 2.1. Cài đặt MongoDB Server

```bash
# Import GPG key của MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Thêm MongoDB repository (Ubuntu 22.04)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Cập nhật và cài đặt
sudo apt update
sudo apt install -y mongodb-org

# Kiểm tra phiên bản
mongod --version

# Khởi động và enable auto-start
sudo systemctl start mongod
sudo systemctl enable mongod

# Kiểm tra trạng thái
sudo systemctl status mongod
```

> 📝 **Ghi chú:** Nếu dùng Ubuntu 20.04 (Focal), thay `jammy` bằng `focal` trong dòng repository.

### 2.2. Bảo mật MongoDB (BẮT BUỘC)

#### Bước 1: Tạo Admin user

```bash
# Kết nối vào MongoDB shell
mongosh
```

```javascript
// Chuyển sang database admin
use admin

// Tạo admin user
db.createUser({
    user: "adminUser",
    pwd: "YOUR_ADMIN_PASSWORD_HERE",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" }
    ]
})
```

#### Bước 2: Tạo User cho dự án

```javascript
// Chuyển sang database dự án
use crystallized_iron

// Tạo user chuyên dụng cho app
db.createUser({
    user: "ci_server",
    pwd: "YOUR_MONGO_PASSWORD_HERE",
    roles: [
        { role: "readWrite", db: "crystallized_iron" }
    ]
})

// Thoát
exit
```

#### Bước 3: Bật Authentication

```bash
sudo nano /etc/mongod.conf
```

Tìm và sửa/thêm section `security`:

```yaml
security:
  authorization: enabled
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

#### Bước 4: Test đăng nhập

```bash
# Test kết nối với authentication
mongosh -u ci_server -p --authenticationDatabase crystallized_iron
```

### 2.3. Tạo Collections & Indexes

Kết nối vào MongoDB với user đã tạo:

```bash
mongosh -u ci_server -p --authenticationDatabase crystallized_iron crystallized_iron
```

Chạy script tạo collections và indexes:

```javascript
// ============================================
// Tạo các Collections
// ============================================
db.createCollection("item_templates")
db.createCollection("battle_logs")
db.createCollection("chat_logs")
db.createCollection("mob_configs")
db.createCollection("exploration_logs")
db.createCollection("set_definitions")

// ============================================
// Tạo Indexes cho item_templates
// ============================================
db.item_templates.createIndex({ category: 1 })
db.item_templates.createIndex({ "dropInfo.mapIds": 1 })
db.item_templates.createIndex({ setId: 1 })

// ============================================
// Tạo Indexes cho battle_logs (+ TTL 90 ngày)
// ============================================
db.battle_logs.createIndex({ characterId: 1, createdAt: -1 })
db.battle_logs.createIndex({ mapId: 1 })
db.battle_logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 7776000 }   // 90 ngày
)

// ============================================
// Tạo Indexes cho chat_logs (+ TTL 30 ngày)
// ============================================
db.chat_logs.createIndex({ channel: 1, createdAt: -1 })
db.chat_logs.createIndex({ senderId: 1 })
db.chat_logs.createIndex({ recipientId: 1 })
db.chat_logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 2592000 }   // 30 ngày
)

// ============================================
// Tạo Indexes cho mob_configs
// ============================================
db.mob_configs.createIndex({ spawnMaps: 1 })
db.mob_configs.createIndex({ isBoss: 1 })

// ============================================
// Tạo Indexes cho exploration_logs
// ============================================
db.exploration_logs.createIndex({ characterId: 1, createdAt: -1 })
db.exploration_logs.createIndex({ mapId: 1 })

// ============================================
// Kiểm tra kết quả
// ============================================
print("=== Collections ===")
db.getCollectionNames().forEach(c => print("  ✅ " + c))

print("\n=== Indexes ===")
db.getCollectionNames().forEach(c => {
    print("\n📂 " + c + ":")
    db[c].getIndexes().forEach(idx => print("  🔑 " + JSON.stringify(idx.key)))
})
```

**Kết quả mong đợi - 6 collections:**

```
=== Collections ===
  ✅ battle_logs
  ✅ chat_logs
  ✅ exploration_logs
  ✅ item_templates
  ✅ mob_configs
  ✅ set_definitions
```

### 2.4. Cấu hình MongoDB cho Production

```bash
sudo nano /etc/mongod.conf
```

Đảm bảo file config có các thiết lập sau:

```yaml
# Crystallized Iron - MongoDB Production Config

storage:
  dbPath: /var/lib/mongodb
  engine: wiredTiger
  wiredTiger:
    engineConfig:
      # Cache ~50% RAM khả dụng (Server 4GB → 1.5GB)
      cacheSizeGB: 1.5

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  # Chỉ bind localhost (bảo mật)
  bindIp: 127.0.0.1

security:
  authorization: enabled

operationProfiling:
  # Log slow queries > 200ms
  slowOpThresholdMs: 200
  mode: slowOp
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

---

## Phần 3: Cấu hình kết nối Backend

### 3.1. File `.env`

Tạo file `.env` trong thư mục `backend/`:

```bash
nano /path/to/Crystallized-Iron/backend/.env
```

```env
# ============================================
# Crystallized Iron - Server Environment
# ============================================

# MySQL Connection
MYSQL_HOST=localhost
MYSQL_USER=ci_server
MYSQL_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
MYSQL_DB=crystallized_iron
MYSQL_PORT=3306

# MongoDB Connection
MONGODB_URI=mongodb://ci_server:YOUR_MONGO_PASSWORD_HERE@localhost:27017/crystallized_iron
MONGODB_DB=crystallized_iron

# Server
PORT=3000
WS_PORT=3001
NODE_ENV=production
```

> ⚠️ **BẢO MẬT:** File `.env` **KHÔNG ĐƯỢC** commit lên Git. Đảm bảo `.env` đã có trong `.gitignore`.

### 3.2. Kiểm tra kết nối từ Backend

```bash
cd /path/to/Crystallized-Iron/backend

# Cài dependency
npm install

# Test chạy server (sẽ log kết nối DB)
npx ts-node src/index.ts
```

Kết quả mong đợi:

```
[MySQL] Database Connected.
[MongoDB] Connected to crystallized_iron.
[Server] HTTP listening on port 3000
[Server] WebSocket listening on port 3001
```

---

## Phần 4: Backup & Bảo trì

### 4.1. Script Backup tự động

Tạo script backup:

```bash
sudo nano /opt/crystallized-iron/backup.sh
```

```bash
#!/bin/bash
# ============================================
# Crystallized Iron - Daily Backup Script
# Chạy bằng cron lúc 3:00 AM hàng ngày
# ============================================

BACKUP_DIR="/opt/crystallized-iron/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Tạo thư mục backup
mkdir -p "$BACKUP_DIR/$DATE"

echo "[$(date)] Bắt đầu backup..."

# ============================================
# 1. Backup MySQL (lúc 4:00 AM - theo RULES)
# ============================================
echo "[MySQL] Đang backup..."
mysqldump -u ci_server -p'YOUR_MYSQL_PASSWORD' \
    --single-transaction \
    --routines \
    --triggers \
    --databases crystallized_iron \
    | gzip > "$BACKUP_DIR/$DATE/mysql_crystallized_iron.sql.gz"

if [ $? -eq 0 ]; then
    echo "[MySQL] ✅ Backup thành công!"
else
    echo "[MySQL] ❌ Backup thất bại!"
fi

# ============================================
# 2. Backup MongoDB (lúc 3:00 AM - theo README)
# ============================================
echo "[MongoDB] Đang backup..."
mongodump \
    --uri="mongodb://ci_server:YOUR_MONGO_PASSWORD@localhost:27017/crystallized_iron" \
    --out="$BACKUP_DIR/$DATE/mongodb/" \
    --gzip

if [ $? -eq 0 ]; then
    echo "[MongoDB] ✅ Backup thành công!"
else
    echo "[MongoDB] ❌ Backup thất bại!"
fi

# ============================================
# 3. Xóa backup cũ hơn 30 ngày
# ============================================
echo "[Cleanup] Xóa backup cũ hơn ${RETENTION_DAYS} ngày..."
find "$BACKUP_DIR" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null

echo "[$(date)] Hoàn tất backup!"
```

Cấp quyền và thiết lập cron:

```bash
# Cấp quyền chạy
sudo chmod +x /opt/crystallized-iron/backup.sh

# Thiết lập cron job (chạy 3:00 AM mỗi ngày)
sudo crontab -e
```

Thêm dòng:

```cron
0 3 * * * /opt/crystallized-iron/backup.sh >> /var/log/ci-backup.log 2>&1
```

### 4.2. Khôi phục từ Backup

#### Khôi phục MySQL:

```bash
# Giải nén và import
gunzip < /opt/crystallized-iron/backups/YYYYMMDD/mysql_crystallized_iron.sql.gz \
    | mysql -u ci_server -p crystallized_iron
```

#### Khôi phục MongoDB:

```bash
mongorestore \
    --uri="mongodb://ci_server:PASSWORD@localhost:27017/crystallized_iron" \
    --gzip \
    --drop \
    /opt/crystallized-iron/backups/YYYYMMDD/mongodb/crystallized_iron/
```

### 4.3. Monitoring cơ bản

#### Kiểm tra MySQL:

```bash
# Xem slow queries
sudo tail -f /var/log/mysql/slow-query.log

# Xem trạng thái connections
mysql -u ci_server -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Xem kích thước database
mysql -u ci_server -p -e "
    SELECT table_name, 
           ROUND(data_length / 1024 / 1024, 2) AS 'Size (MB)'
    FROM information_schema.tables 
    WHERE table_schema = 'crystallized_iron'
    ORDER BY data_length DESC;"
```

#### Kiểm tra MongoDB:

```bash
# Xem trạng thái server
mongosh -u ci_server -p --authenticationDatabase crystallized_iron \
    --eval "db.serverStatus().connections"

# Xem kích thước collections
mongosh -u ci_server -p --authenticationDatabase crystallized_iron \
    crystallized_iron --eval "
    db.getCollectionNames().forEach(function(c) {
        var stats = db[c].stats();
        print(c + ': ' + (stats.size / 1024 / 1024).toFixed(2) + ' MB');
    });"
```

---

## Xử lý Sự cố

### ❌ MySQL không khởi động

```bash
# Xem log lỗi
sudo journalctl -u mysql -n 50

# Kiểm tra port đã bị chiếm chưa
sudo lsof -i :3306

# Kiểm tra disk space
df -h
```

### ❌ MongoDB không khởi động

```bash
# Xem log lỗi
sudo journalctl -u mongod -n 50

# Kiểm tra quyền thư mục data
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb

# Kiểm tra lock file
sudo rm -f /var/lib/mongodb/mongod.lock
sudo systemctl start mongod
```

### ❌ Không kết nối được từ Backend

```bash
# Kiểm tra MySQL listening
sudo ss -tlnp | grep 3306

# Kiểm tra MongoDB listening
sudo ss -tlnp | grep 27017

# Kiểm tra firewall
sudo ufw status

# Test kết nối manual
mysql -u ci_server -p -h 127.0.0.1 crystallized_iron
mongosh "mongodb://ci_server:PASSWORD@127.0.0.1:27017/crystallized_iron"
```

### ❌ Performance chậm

```bash
# MySQL - Kiểm tra slow queries
mysql -u ci_server -p -e "SHOW VARIABLES LIKE 'slow_query%';"
mysql -u ci_server -p -e "SHOW VARIABLES LIKE 'long_query_time';"

# MongoDB - Kiểm tra profiling
mongosh crystallized_iron --eval "db.setProfilingLevel(1, { slowms: 200 })"
mongosh crystallized_iron --eval "db.system.profile.find().sort({ts:-1}).limit(5).pretty()"
```

---

## Checklist cài đặt

Sử dụng checklist này để đảm bảo không bỏ sót bước nào:

- [ ] Cập nhật OS (`apt update && apt upgrade`)
- [ ] **MySQL**
  - [ ] Cài đặt MySQL Server 8.0+
  - [ ] Chạy `mysql_secure_installation`
  - [ ] Tạo database `crystallized_iron`
  - [ ] Tạo user `ci_server` với quyền hạn chế
  - [ ] Import `schema.sql` (6 bảng)
  - [ ] Cấu hình `mysqld.cnf` cho production
  - [ ] Test kết nối thành công
- [ ] **MongoDB**
  - [ ] Cài đặt MongoDB 7.0+
  - [ ] Tạo admin user
  - [ ] Tạo user `ci_server` cho database `crystallized_iron`
  - [ ] Bật authentication trong `mongod.conf`
  - [ ] Tạo 6 collections + indexes
  - [ ] Cấu hình `mongod.conf` cho production
  - [ ] Test kết nối thành công
- [ ] **Backend**
  - [ ] Tạo file `.env` với credentials đúng
  - [ ] Đảm bảo `.env` nằm trong `.gitignore`
  - [ ] Test chạy backend, log hiện "Connected" cho cả 2 DB
- [ ] **Backup**
  - [ ] Tạo script backup
  - [ ] Thiết lập cron job chạy 3:00 AM hàng ngày
  - [ ] Test thử backup & restore 1 lần
