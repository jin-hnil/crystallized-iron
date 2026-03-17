using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Inventory
{
    [System.Serializable]
    public class InventorySlot
    {
        public ItemData item;
        public int amount;

        public void AddAmount(int value) { amount += value; }
        public void RemoveAmount(int value) { amount -= value; if (amount <= 0) ClearSlot(); }
        public void ClearSlot() { item = null; amount = 0; }
        public bool IsEmpty() { return item == null; }
    }

    public class InventoryManager : MonoBehaviour
    {
        public static InventoryManager Instance;

        public int inventorySize = 24; // Số lượng ô hành trang mặc định
        public int hotbarSize = 6;     // Số ô dưới góc màn hình trang phục nhanh

        public List<InventorySlot> bagSlots = new List<InventorySlot>();
        public List<InventorySlot> hotbarSlots = new List<InventorySlot>();

        public delegate void OnInventoryChanged();
        public OnInventoryChanged onInventoryChangedCallback; // Sự kiện báo cho UI biết phải Load lại hình

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;

            // Khởi tạo List rỗng
            for (int i = 0; i < inventorySize; i++) bagSlots.Add(new InventorySlot());
            for (int i = 0; i < hotbarSize; i++) hotbarSlots.Add(new InventorySlot());
        }

        public bool AddItem(ItemData itemToAdd, int amountToAdd)
        {
            if (itemToAdd.isStackable)
            {
                // Thử tìm ô nào đang dang dở cùng loại đồ để dồn (Stack) vào trước
                foreach (InventorySlot slot in bagSlots)
                {
                    if (slot.item == itemToAdd && slot.amount < itemToAdd.maxStackSize)
                    {
                        int spaceLeft = itemToAdd.maxStackSize - slot.amount;
                        if (amountToAdd <= spaceLeft)
                        {
                            slot.AddAmount(amountToAdd);
                            onInventoryChangedCallback?.Invoke();
                            return true;
                        }
                        else
                        {
                            slot.AddAmount(spaceLeft);
                            amountToAdd -= spaceLeft; // Đổ tràn sang ô tiếp theo
                        }
                    }
                }
            }

            // Nếu không dồn được hoặc là Đồ không cộng dồn (Súng, Rìu), tìm Đại môt ô Rỗng
            foreach (InventorySlot slot in bagSlots)
            {
                if (slot.IsEmpty())
                {
                    slot.item = itemToAdd;
                    slot.amount = amountToAdd >= itemToAdd.maxStackSize ? itemToAdd.maxStackSize : amountToAdd;
                    amountToAdd -= slot.amount;
                    
                    if (amountToAdd <= 0)
                    {
                        onInventoryChangedCallback?.Invoke();
                        return true;
                    }
                }
            }

            Debug.LogWarning("[Inventory] Hành lý của bạn đã ĐẦY. Không thể nhặt thêm nữa!");
            return false; // Vứt phần thừa rớt lại ra đất nếu muốn...
        }

        public void DropItemFromSlot(int index)
        {
            if (index < 0 || index >= bagSlots.Count) return;

            InventorySlot slot = bagSlots[index];
            if (!slot.IsEmpty())
            {
                // Spawn Mesh Cục đồ 3D rụng tự do trước mũi nhân vật
                Vector3 dropPos = transform.position + transform.forward * 1.5f + Vector3.up * 1.5f;
                // Instantiate(slot.item.dropPrefab, dropPos, Quaternion.identity);

                Debug.Log($"[Balo] Bạn đã thả RƠI một cục {slot.item.displayName} xuống đất.");
            }
            slot.ClearSlot();
            onInventoryChangedCallback?.Invoke();
        }
        }

        // Menu Bấm Nút: Áp dụng chung Bộ máy Utility đa năng.
        // Gắn nút thả xuống trên UI Của balo chọn SortType mà Game thủ muốn (Quantity, ABC, v.v...)
        public void SortInventory(SortType sortMethod = SortType.ByNameAtoZ)
        {
            InventoryUtility.SortSlots(bagSlots, sortMethod);
            onInventoryChangedCallback?.Invoke();
            
            Debug.Log($"[Inventory] Pặc Pặc! Đã xóc lại Balo theo trình tự: {sortMethod}");
        }
    }
}
