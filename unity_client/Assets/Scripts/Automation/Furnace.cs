using UnityEngine;

namespace CrystallizedIron.Automation
{
    public class Furnace : MonoBehaviour
    {
        [Header("Furnace Processing")]
        public string inputOreId = "item_iron_ore";
        public string outputIngotId = "item_iron_ingot";
        public float smeltTimePerItem = 5.0f; // Thời gian nung 1 cục quặng

        [Header("Internal Storage")]
        public int currentOreCount = 0;
        public int currentFuelCount = 0; // Than hoặc Củi
        public int currentIngotCount = 0;

        [Header("Status")]
        public bool isSmelting = false;

        private float smeltTimer = 0f;

        private void Update()
        {
            // Lò nung chỉ hoạt động khi có quặng và có than/củi
            if (currentOreCount > 0 && currentFuelCount > 0)
            {
                isSmelting = true;
                smeltTimer += Time.deltaTime;

                if (smeltTimer >= smeltTimePerItem)
                {
                    ProcessComplete();
                }
            }
            else
            {
                isSmelting = false;
                smeltTimer = 0f;
            }

            // TODO: Bật visual hiệu ứng lửa cháy, khói ống khói nếu isSmelting == true
        }

        private void ProcessComplete()
        {
            // Trừ 1 quặng, tiêu tốn nhiên liệu (có thể dùng tỷ lệ khác)
            currentOreCount--;
            // Đơn giản hóa: Mỗi mẻ đốt bay 1 cục than
            currentFuelCount--;

            currentIngotCount++;
            smeltTimer = 0f;

            Debug.Log($"[Lò Nung] Ra lò 1 {outputIngotId}! Còn {currentOreCount} quặng rác và {currentFuelCount} than.");

            // Tương lai: Thả ra output slot để Băng Chuyền/Tay Gắp lấy đi
        }

        // Nhận vật liệu từ Cánh tay máy (Inserter) thả vào
        public void InsertItem(string itemId, int amount)
        {
            if (itemId == inputOreId)
            {
                currentOreCount += amount;
            }
            else if (itemId == "item_coal" || itemId == "item_wood")
            {
                currentFuelCount += amount;
            }
        }
    }
}
