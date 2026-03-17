using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Crafting
{
    [System.Serializable]
    public class CraftingIngredient
    {
        public Inventory.ItemData item;
        public int requiredAmount;
    }

    [CreateAssetMenu(fileName = "New Recipe", menuName = "Crystallized Iron/Crafting Recipe")]
    public class RecipeData : ScriptableObject
    {
        public Inventory.ItemData outputItem; // Sản phẩm đầu ra (Ví dụ: Súng lục)
        public int outputAmount = 1;

        public List<CraftingIngredient> ingredients; // Nguyên liệu đầu vào (VD: 5 Sắt, 2 Gỗ)
        
        public float craftTime = 5.0f; // Tốn 5 giây chờ đập búa
        public bool requiresWorkbench = false; // Một số món cao cấp bắt buộc đứng kế Bàn chế tạo
    }
}
