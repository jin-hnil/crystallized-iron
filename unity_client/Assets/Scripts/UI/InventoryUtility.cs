using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Inventory
{
    // Cung cấp 5 tuỳ chọn Phân Phối Trật Tự để cắm vào bất kỳ UI Button nào
    public enum SortType
    {
        ByNameAtoZ,           // Tên chữ cái từ A -> Z (Vd: Áo Giáp -> Súng -> Thịt)
        ByNameZtoA,           // Ngược lại từ Z -> A
        ByQuantityAscending,  // Ưu tiên Rác số lượng rải rác ít nhất trồi lên đầu (1 -> 100)
        ByQuantityDescending, // Khối lượng Đồ nhiều nén lên chóp đầu Balo (100 -> 1)
        ByType                // Nhóm đồ: Tất cả Súng ống ở một xó, sau đó tới Thức ăn một xó...
    }

    // Helper tĩnh (Static Manager) dùng ĐƯỢC CHO CHUNG TẤT CẢ các loại Rương / Lò nung / Balo
    public static class InventoryUtility
    {
        public static void SortSlots(List<InventorySlot> slots, SortType sortType)
        {
            if (slots == null || slots.Count == 0) return;

            // Bước 1: Gom dồn tất cả Đồ móp mép 2/100, 5/100 lại thành 1 cục (Merge Stacks)
            MergeStacks(slots);

            // Bước 2: Bốc những Ô tồn tại Đồ Thật Sự ra 1 tay để phân bổ
            List<InventorySlot> validItems = new List<InventorySlot>();
            foreach (var slot in slots)
            {
                if (!slot.IsEmpty())
                {
                    validItems.Add(slot);
                }
            }

            // Bước 3: So sánh bằng Thuật toán linh động (Switch-Case theo ý thích)
            switch (sortType)
            {
                case SortType.ByNameAtoZ:
                    validItems.Sort((a, b) => a.item.displayName.CompareTo(b.item.displayName));
                    break;
                case SortType.ByNameZtoA:
                    validItems.Sort((a, b) => b.item.displayName.CompareTo(a.item.displayName));
                    break;
                case SortType.ByQuantityAscending:
                    validItems.Sort((a, b) => a.amount.CompareTo(b.amount));
                    break;
                case SortType.ByQuantityDescending:
                    validItems.Sort((a, b) => b.amount.CompareTo(a.amount));
                    break;
                case SortType.ByType:
                    validItems.Sort((a, b) =>
                    {
                        int typeCmp = a.item.type.CompareTo(b.item.type);
                        if (typeCmp != 0) return typeCmp;
                        return a.item.displayName.CompareTo(b.item.displayName); // Ngang Type thì So theo tên
                    });
                    break;
            }

            // Bước 4: Xoá bụi sạch sẽ dàn Balo Gốc ban đầu
            foreach (var slot in slots)
            {
                slot.ClearSlot();
            }

            // Bước 5: Thảy lại đống hàng vào Cốp theo trật tự đẹp đẽ
            for (int i = 0; i < validItems.Count; i++)
            {
                slots[i].item = validItems[i].item;
                slots[i].amount = validItems[i].amount;
            }
        }

        private static void MergeStacks(List<InventorySlot> slots)
        {
            for (int i = 0; i < slots.Count; i++)
            {
                if (slots[i].IsEmpty() || !slots[i].item.isStackable) continue;

                for (int j = i + 1; j < slots.Count; j++)
                {
                    if (slots[j].IsEmpty()) continue;

                    // Nếu lôi ra Mã ID Vật phẩm y hệt nhau thì nhồi 2 ô vào thành 1
                    if (slots[i].item == slots[j].item)
                    {
                        int spaceLeft = slots[i].item.maxStackSize - slots[i].amount;
                        if (spaceLeft > 0)
                        {
                            int amountToTransfer = Mathf.Min(spaceLeft, slots[j].amount);
                            slots[i].AddAmount(amountToTransfer);
                            slots[j].RemoveAmount(amountToTransfer);
                        }
                    }
                }
            }
        }
    }
}
