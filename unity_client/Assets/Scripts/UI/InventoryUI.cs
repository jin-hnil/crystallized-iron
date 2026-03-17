using UnityEngine;

namespace CrystallizedIron.Inventory
{
    public class InventoryUI : MonoBehaviour
    {
        [Header("Canvas References")]
        public GameObject inventoryCanvasPanel; // Panel phủ toàn màn hình (Background xám mờ mờ)
        // public Transform itemsParent;       // GameObject gắn Script lưới GridLayoutGroup
        
        private InventoryManager inventory;
        private bool isShowing = false;

        private void Start()
        {
            inventory = InventoryManager.Instance;
            
            // Xoắn chặt vào Callback sự thay đổi Balo để Vẽ lại hình (Refresh Draw)
            if (inventory != null)
                inventory.onInventoryChangedCallback += UpdateUI;

            // Tắt UI khi mới mở Game
            inventoryCanvasPanel.SetActive(false);
        }

        private void Update()
        {
            // Bấm Phím Tab rảnh tay bật/tắt cái balo (Giống hệt cấu hình game Rust / Tarkov)
            if (Input.GetKeyDown(KeyCode.Tab))
            {
                ToggleInventory();
            }
        }

        public void ToggleInventory()
        {
            isShowing = !isShowing;
            inventoryCanvasPanel.SetActive(isShowing);

            // Có thể thả con trỏ Chuột rảnh rang để kéo thả Rìu vào tay hoặc thả ra đất
            if (isShowing)
            {
                Cursor.lockState = CursorLockMode.None;
                Cursor.visible = true;
                UpdateUI();
            }
            else
            {
                // Biến mất và kẹt luôn lại vô tâm ngắm cho chế độ FPS
                Cursor.lockState = CursorLockMode.Locked;
                Cursor.visible = false;
            }
        }

        public void UpdateUI()
        {
            Debug.Log("[Canvas UI] Quét qua các danh sách dữ liệu Inventory và Cập nhật lại biểu tượng Ảnh, Số đếm (Count)...");
            // Vòng lặp lấy mảng InventorySlotUI đẻ gán .icon.sprite = slot.item.icon; và .countText.text = slot.amount;
        }

        private void OnDestroy()
        {
            if (inventory != null)
            {
                inventory.onInventoryChangedCallback -= UpdateUI;
            }
        }
    }
}
