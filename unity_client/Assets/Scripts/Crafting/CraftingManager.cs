using UnityEngine;
using CrystallizedIron.Inventory;
using System.Collections.Generic;

namespace CrystallizedIron.Crafting
{
    public class CraftingManager : MonoBehaviour
    {
        public static CraftingManager Instance;
        private InventoryManager inventory;

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
        }

        private void Start()
        {
            inventory = InventoryManager.Instance;
        }

        public bool CanCraft(RecipeData recipe)
        {
            if (inventory == null) return false;

            // Kiểm tra từng món nguyên liệu xem trong Balo có dư lượng không
            foreach (var ingredient in recipe.ingredients)
            {
                int playerHas = CountItemsInBag(ingredient.item);
                if (playerHas < ingredient.requiredAmount)
                {
                    Debug.Log($"[Chế Tạo] Bạn bị Tôn Thiếu {ingredient.requiredAmount - playerHas} {ingredient.item.displayName} nữa.");
                    return false;
                }
            }
            return true;
        }

        public void CraftItem(RecipeData recipe)
        {
            if (!CanCraft(recipe)) return;

            // Mở quá trình chờ Wait 5 giây ở đây (Dùng Coroutine hoặc Progress Bar)
            // Trong bản test, chúng ta cho Craft ăn luôn lập tức.

            // Bước 1: Thu hồi nguyên liệu trong túi
            foreach (var ingredient in recipe.ingredients)
            {
                RemoveItemFromBag(ingredient.item, ingredient.requiredAmount);
            }

            // Bước 2: Ép ra thành phẩm (Súng / Tường) đẩy xuống Balo
            bool added = inventory.AddItem(recipe.outputItem, recipe.outputAmount);
            
            if (added)
            {
                Debug.Log($"[Bàn Chế Tạo] Dùng tay trần đúc thành công {recipe.outputAmount}x {recipe.outputItem.displayName}.");
            }
            else
            {
                // Nếu balo đầy phải spawn rớt ra đất
                Debug.Log("[Bàn Chế Tạo] Không có chỗ chứa, Rớt đồ thẳng ra nền nhà.");
            }
        }

        // Helper: Duyệt qua lưới 24 ô vuông đếm dồn (Tổng) tài nguyên 
        private int CountItemsInBag(ItemData itemToFind)
        {
            int count = 0;
            foreach (var slot in inventory.bagSlots)
            {
                if (slot.item == itemToFind) count += slot.amount;
            }
            return count;
        }

        // Helper: Khấu trừ / Hủy xé nguyên liệu để trả tiền phí
        private void RemoveItemFromBag(ItemData itemToRemove, int amountNeeded)
        {
            foreach (var slot in inventory.bagSlots)
            {
                if (slot.item == itemToRemove)
                {
                    if (slot.amount >= amountNeeded)
                    {
                        slot.RemoveAmount(amountNeeded);
                        break; // Đã rút đủ lượng cần tốn, ngắt vòng lặp
                    }
                    else
                    {
                        // Nếu rương có 10, mà cần 15. Rút 10, chạy qua ô gộp tiếp theo rút 5.
                        amountNeeded -= slot.amount;
                        slot.ClearSlot();
                    }
                }
            }
            inventory.onInventoryChangedCallback?.Invoke(); // Load hình lại
        }
    }
}
