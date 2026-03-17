using UnityEngine;

namespace CrystallizedIron.Automation.Power
{
    // Cục Máy Phát (Lò Rèn Than, Tấm Pin, Cối Xay Gió)
    // Liên tục bơm Năng lượng vào Lưới mạng đang nối vào.
    public class PowerGenerator : MonoBehaviour
    {
        [Header("Connection Grid")]
        public PowerNetwork connectedGrid;

        [Header("Generation (Watts)")]
        public float baseOutputWattage = 100f; // Watt điện sinh ra mỗi giây

        // Dùng Cáp Kéo Thắp lên Cột Điện -> Máy phát này móc vào Lưới điện
        public void ConnectToGrid(PowerNetwork newGrid)
        {
            connectedGrid = newGrid;
            if (newGrid != null && !newGrid.generators.Contains(this))
            {
                newGrid.generators.Add(this);
            }
        }

        // Nếu máy hết củi/than thì Máy Tắt. Cột điện lúc đó bỗng nhiên hụt điện!
        public bool IsActive { get; set; } = true;

        public float OutputWattage
        {
            get { return IsActive ? baseOutputWattage : 0f; }
        }

        private void OnDestroy()
        {
            if (connectedGrid != null)
                connectedGrid.generators.Remove(this);
        }
    }
}
