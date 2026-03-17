using UnityEngine;
using CrystallizedIron.Inventory;

namespace CrystallizedIron.Automation
{
    // Cục Cảm Biến Giao Lộ (Nối 1 đoạn Ống vào nhiều đoạn ống ra)
    public class SmartFilter : MonoBehaviour
    {
        [Header("Input")]
        public Transform intakePort; // Không quan trọng, Dùng để nối cáp đồ họa
        
        [Header("Outputs")]
        // Danh sách các ngõ ra và Luật định Cấm/Nhận
        public EnclosedTube leftOutput;
        public EnclosedTube rightOutput;
        public EnclosedTube forwardOutput;

        [Header("Filter Rules (Mở giao diện UI Tùy chỉnh)")]
        // Ví dụ: Người chơi cấu hình Gỗ đi bên trái, Cục Sắt đi Bên Phải
        public ItemData targetLeftItem;
        public ItemData targetRightItem;

        // Bất cứ cái Ống Ngõ Vào (Input Tube) nào cũng sẽ gọi Hàm này để Xả hàng vào Giao Lộ
        public bool RouteItem(ItemData incomingItem, int amount)
        {
            // Kiểm tra quy tắc Bộ Lọc:

            // 1. Phù hợp Cổng Trái (Giả sử Lọc Gỗ nguyên liệu)
            if (leftOutput != null && incomingItem == targetLeftItem)
            {
                return leftOutput.InsertItemIntoTube(incomingItem, amount);
            }

            // 2. Phù hợp Cổng Phải (Lọc Sắt)
            if (rightOutput != null && incomingItem == targetRightItem)
            {
                return rightOutput.InsertItemIntoTube(incomingItem, amount);
            }

            // 3. Không trúng Lọc Trái/Phải ➡ Cho Đẩy Thẳng ra Mặc định (Tạp nham)
            if (forwardOutput != null)
            {
                return forwardOutput.InsertItemIntoTube(incomingItem, amount);
            }

            // Nếu cả 3 cổng đều kẹt hoặc Không cắm Ống ngõ ra
            Debug.LogWarning("[Ngã Ba Lọc] Mọi ngõ ra bị Bít Kín. Rác ùn ứ văng tung tóe tại Giao lộ!");
            return false;
        }
    }
}
