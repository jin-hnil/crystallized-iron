using UnityEngine;
using System.Collections.Generic;
using CrystallizedIron.Inventory; // Trích xuất Hệ thống Túi đồ lõi (Inventory Slot)

namespace CrystallizedIron.Building
{
    public class StorageBox : MonoBehaviour
    {
        [Header("Capacity Indicator")]
        public string boxName = "Large Industrial Silo";
        public int maxSlots = 30; // 30 Ô trống trong hộp rương khổng lồ

        // Loại bỏ Array giả lập tự chế (Cũ). Nhập Cảng 100% Core chuẩn đồng hóa với Balo Người Chơi
        public List<InventorySlot> inventorySpaces = new List<InventorySlot>();

        private void Start()
        {
            for (int i = 0; i < maxSlots; i++)
            {
                inventorySpaces.Add(new InventorySlot());
            }
        }

        // Module nạp hàng tự động từ Băng Chuyền Máy móc đổ thẳng vào Rương chứa:
        public bool TryStoreItem(ItemData incomingItem, int incomingAmount)
        {
            if (incomingItem.isStackable)
            {
                foreach (InventorySlot slot in inventorySpaces)
                {
                    if (slot.item == incomingItem && slot.amount < incomingItem.maxStackSize)
                    {
                        int spaceLeft = incomingItem.maxStackSize - slot.amount;
                        if (incomingAmount <= spaceLeft)
                        {
                            slot.AddAmount(incomingAmount);
                            return true;
                        }
                        else
                        {
                            slot.AddAmount(spaceLeft);
                            incomingAmount -= spaceLeft; // Lượng dư tràn tiếp qua ngăn sau
                        }
                    }
                }
            }

            foreach (InventorySlot slot in inventorySpaces)
            {
                if (slot.IsEmpty())
                {
                    slot.item = incomingItem;
                    slot.amount = incomingAmount >= incomingItem.maxStackSize ? incomingItem.maxStackSize : incomingAmount;
                    incomingAmount -= slot.amount;
                    if (incomingAmount <= 0) return true;
                }
            }

            Debug.LogWarning($"[Rương {boxName}] Quá tải sức chứa! Cánh tay Gắp Inserter phun rớt Quặng lả chả ra nền nhà xưởng.");
            return false;
        }

        // Tương tác UI: Khi bấm Cờ-Lê, người chơi chọn 1 trong 5 nút Sort (Type, Name, Số lượng,..)
        public void SortStorageBox(SortType sortMethod)
        {
            // SỬ DỤNG LẠI HOÀN TOÀN TÍNH NĂNG CỦA INVENTORY THỰC SỰ
            InventoryUtility.SortSlots(inventorySpaces, sortMethod);
            
            Debug.Log($"[Storage Box] Đã sắp xếp lại Rương '{boxName}' Gọn Gàng theo phương diện: {sortMethod}.");
            // Có thể update UI Canvas ở đây...
        }

        public void OpenStorageUI()
        {
            Debug.Log($"[Interact] Nhấc nắp {boxName} lên xem.");
        }
    }
}
