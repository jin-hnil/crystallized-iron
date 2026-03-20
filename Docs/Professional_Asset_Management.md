# 📊 CẤU TRÚC QUẢN LÝ TÀI SẢN CHUYÊN NGHIỆP (PROFESSIONAL ASSET PIPELINE)

Để file Excel của bạn đạt chuẩn "AAA Studio", nó không chỉ là một danh sách model, mà phải là **Xương sống Dữ liệu** nối từ Ý tưởng -> Blender -> Unity -> Gameplay.

---

## 1. Cấu trúc các Cột (The "Master List" Sheet)

Mỗi hàng phải có **Unique SQL ID** (Slug) - đây là cái mà code C# sẽ dùng để gọi tên vật phẩm.

| Cột | Mục đích | Ví dụ |
| :--- | :--- | :--- |
| **Asset ID** | Mã định danh duy nhất (Slug) | `SM_Env_Ore_Iron_01` |
| **Display Name** | Tên tiếng Việt hiển thị trong game | `Mỏ Quặng Sắt` |
| **Tech Tier** | Cấp độ công nghệ | `Tier 1`, `Tier 2`, `Tier 3` |
| **Modeling Status** | Trạng thái dựng hình | `Concept`, `Draft`, `HighPoly`, `LowPoly`, `Done` |
| **Texture Status** | Trạng thái vẽ màu | `UV Unwrapped`, `Baking`, `Texturing`, `Done` |
| **Implementation**| Trạng thái đưa vào Unity | `No`, `Prefab Created`, `Scripted`, `Balanced` |
| **Tri Count (V1)** | Số lượng đa diện tối ưu | `~100` |
| **Prefab Path** | Đường dẫn file trong Unity | `Assets/Prefabs/Environment/Ore_Iron.prefab` |
| **Collider Type** | Loại va chạm vật lý | `Box`, `Capsule`, `MeshCollider`, `Convex` |

---

## 2. Hệ thống Sheet Phân tách (Separated Sheets Strategy)

Đừng để tất cả vào một chỗ. Hãy chia thành 3 nhóm Sheet lớn:

### 🟢 Sheet A: Asset Catalog (Danh mục 3D)
- Chia theo Category: `Environment`, `Architecture`, `Characters`, `Weapons`, `VFX`.
- Tập trung vào: Progress (Tiến độ hoàn thành) và Technical Specs.

### 🔵 Sheet B: Gameplay Stats (Chỉ số Game)
- Cột: `ID`, `Weight`, `StackLimit`, `HP_Mod`, `Hunger_Mod`, `Armor_Value`.
- Đây là nơi Designer dùng để Balance độ khó của game.

### 🔴 Sheet C: Crafting Recipes (Công thức Chế tạo)
| Result ID | Requirement 1 | Qty 1 | Requirement 2 | Qty 2 | Time (s) | Station |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `gun_pistol_01` | `mat_iron_ingot` | 10 | `mat_tape` | 2 | 15.0 | `workbench_t1` |

---

## 3. Quản lý trạng thái bằng Màu sắc (Conditional Formatting)

Sử dụng màu sắc để biết ngay dự án đang kẹt ở đâu:
- 🟥 **Màu đỏ:** `Waiting` (Chưa ai làm)
- 🟨 **Màu vàng:** `In Progress` (Đang Blender/ZBrush)
- 🟦 **Màu xanh dương:** `Ready for Import` (Xong model nhưng chưa vào Unity)
- 🟩 **Màu xanh lá:** `Implemented` (Đã xong, đang test gameplay)

---

## 4. Gợi ý cập nhật lại cho file Excel (`3D_Models_List_MultiSheet.xlsx`)

Tôi đề xuất bạn nên thêm cột **Asset ID (Slug)** ngay lập tức. Nếu bạn muốn, tôi sẽ viết một script Python hoàn chỉnh để:
1.  **Tự động tạo Slug** từ tên tiếng Việt (ví dụ: "Cây Gỗ Khô" -> `env_tree_dry_01`).
2.  **Tự động thêm các cột Technical** còn thiếu.
3.  **Tạo Data Validation** (Menu thả xuống) cho các cột Status để bạn không phải gõ tay.

**Bạn có muốn tôi viết script này không?** (Tôi sẽ tối ưu code để bạn có thể copy vào bất kỳ máy nào có cài Python + openpyxl để chạy).
