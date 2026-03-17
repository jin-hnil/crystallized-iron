using UnityEngine;
using UnityEngine.EventSystems;

namespace CrystallizedIron.Inventory
{
    public class DropSlotUI : MonoBehaviour, IDropHandler
    {
        public int slotIndex;
        public bool isHotbarSlot = false;

        public void OnDrop(PointerEventData eventData)
        {
            if (eventData.pointerDrag != null)
            {
                DragDropItem draggedObject = eventData.pointerDrag.GetComponent<DragDropItem>();
                
                if (draggedObject != null)
                {
                    // Hành vi hoán đổi (Swap) hoặc chèn dữ liệu gầm bên dưới InventoryManager
                    int sourceIndex = draggedObject.sourceSlotIndex;
                    int targetIndex = this.slotIndex;

                    SwapSlotsInternal(sourceIndex, targetIndex);

                    // Gắn vào nôi UI mới và chui trở lại giữa khung hình
                    draggedObject.transform.SetParent(transform);
                    draggedObject.transform.localPosition = Vector3.zero;
                    
                    // Cập nhật UpdateUI() để nó tự Refresh đồng bộ dữ liệu toàn màn hình
                    InventoryManager.Instance.onInventoryChangedCallback?.Invoke();
                }
            }
        }

        private void SwapSlotsInternal(int sourceIndex, int targetIndex)
        {
            // Lấy trực tiếp rương đồ Manager ra xử lý
            if(InventoryManager.Instance == null) return;
            
            // TODO: Thiết kế thêm mảng isHotbar cho DragDrop nếu kéo từ Balo xuống thanh công cụ
            var sourceSlot = InventoryManager.Instance.bagSlots[sourceIndex];
            var targetSlot = InventoryManager.Instance.bagSlots[targetIndex];

            // Tạm nhớ cấu hình thằng bị đè
            var tempItem = targetSlot.item;
            var tempAmount = targetSlot.amount;

            // Chuyển đồ đang cầm vô ô Mới
            targetSlot.item = sourceSlot.item;
            targetSlot.amount = sourceSlot.amount;

            // Lấy đồ Mới thế vào ô Cũ (Hoán vị 2 vị trí)
            sourceSlot.item = tempItem;
            sourceSlot.amount = tempAmount;
            
            Debug.Log($"[UI] Hoán đổi vị trí Túi đồ từ ô {sourceIndex} sang {targetIndex}.");
        }
    }
}
