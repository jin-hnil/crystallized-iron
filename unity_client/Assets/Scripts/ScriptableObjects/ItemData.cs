using UnityEngine;

namespace CrystallizedIron.Inventory
{
    [CreateAssetMenu(fileName = "New Item", menuName = "Crystallized Iron/Item")]
    public class ItemData : ScriptableObject
    {
        public string itemID;
        public string displayName;
        [TextArea]
        public string description;

        public Sprite icon; // Hình ảnh Hiển thị trên ô lưới UI
        public GameObject dropPrefab; // Mô hình 3D rơi xuống rớt trên mặt đất
        public GameObject equipPrefab; // Vũ khí 3D để tay nắm ở góc nhìn FPS (Nếu là loại có thể cầm tay)

        [Header("Tích Tính")]
        public bool isStackable = true;
        public int maxStackSize = 100; // Số lượng gỗ tối đa xếp trong 1 ô chẳng hạn

        public enum ItemType
        {
            Resource,  // Tài nguyên: Gỗ, Đá, Thiết Tinh
            Consumable,// Thức ăn, Nước uống, Medkit
            Weapon,    // Vũ khí: Rìu, Súng M4
            Armor,     // Quần áo bảo vệ
            Blueprint  // Sách công nghệ xây nhà
        }

        public ItemType type;

        [Header("Survival / Combat (Tuỳ loại Item)")]
        public float healthRestore = 0f;
        public float hungerRestore = 0f;
        public float thirstRestore = 0f;
        public float weaponDamage = 0f;
    }
}
