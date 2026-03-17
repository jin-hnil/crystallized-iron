using UnityEngine;
using CrystallizedIron.Inventory;

namespace CrystallizedIron.Automation
{
    // Phân loại mục đích của Cổng gắn trên Máy móc (Chỉ cho phép 1 chiều)
    public enum PortDirection
    {
        Input,  // Cổng Nhận (Chỗ cắm Ống vào để nhét nguyên liệu)
        Output  // Cổng Xả (Chỗ cắm Ống hoặc Bơm để nhổ đồ ra)
    }

    // Gắn 컴 Component này lên các ngàm/lỗ trên Mô hình 3D của Lò nung, Rương, Máy khoan
    // Ví dụ: 1 Cái Rương To có thể gắn 2 cổng Input (Ngàm nạp) + 1 Cổng Output (Ngàm xuất)
    public class MachinePort : MonoBehaviour
    {
        [Header("Port Settings")]
        public PortDirection direction;

        [Header("Linked Machine Core")]
        // Bắt buộc phải link về Bộ não trung tâm của cỗ máy đó 
        // (Hiện tại dùng StorageBox làm chuẩn mực tạm thời cho mọi kho chứa/Lò nung)
        public Building.StorageBox linkedStorage;

        // ============================================
        // Hành vi Dành riêng cho CỔNG NHẬN (INPUT)
        // ============================================
        public bool ReceiveItem(ItemData item, int amount)
        {
            if (direction != PortDirection.Input)
            {
                Debug.LogWarning($"[Port] LỖI CẮM NHẦM! Đang cố nhét đồ vào Cổng Xả (Output) tại {gameObject.name}.");
                return false;
            }

            if (linkedStorage != null)
            {
                return linkedStorage.TryStoreItem(item, amount);
            }

            return false; // Lỗi mất kết nối Cáp nội bộ
        }

        // ============================================
        // Hành vi Dành riêng cho CỔNG XẢ (OUTPUT)
        // ============================================
        // Dùng cho Các máy Bơm (ItemPump) thò tay vào quét lục lọi
        public System.Collections.Generic.List<InventorySlot> GetExtractableSlots()
        {
            if (direction != PortDirection.Output)
            {
                Debug.LogWarning($"[Port] LỖI CẮM NHẦM BƠM! Máy bơm đang ghim vào Cổng Nhận (Input) tại {gameObject.name}. Nó không hút được gì!");
                return null;
            }

            if (linkedStorage != null)
            {
                return linkedStorage.inventorySpaces;
            }

            return null;
        }
    }
}
