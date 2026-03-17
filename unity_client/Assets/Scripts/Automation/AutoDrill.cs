using UnityEngine;

namespace CrystallizedIron.Automation
{
    public class AutoDrill : MonoBehaviour
    {
        [Header("Drill Settings")]
        public string resourceIdToMine = "item_iron_ore";
        public float miningInterval = 3.0f; // Số giây mỗi mẻ quặng
        public int amountPerCycle = 1;
        
        [Header("Power/Fuel Requirements")]
        public bool requiresPower = false;
        public bool hasFuel = true; // Mặc định giả vờ có xăng để test

        private float timer = 0f;

        // Điểm đầu ra để nếu có Băng chuyền nối vào thì đẩy quặng ra ngoài thay vì tự động cất vào rương nội bộ
        public Transform outputHole; 

        private void Update()
        {
            if (!hasFuel) return; // Nếu mất điện hoặc hết than, máy tắt

            timer += Time.deltaTime;
            if (timer >= miningInterval)
            {
                MineCycle();
                timer = 0f;
            }
        }

        private void MineCycle()
        {
            // TODO: Hiển thị hoạt ảnh pittong nghiến đất
            Debug.Log($"[Máy Khoan] Bụp! Khai thác được {amountPerCycle} {resourceIdToMine}.");

            // TODO: Nếu có Conveyor Belt gắn sát vào OutputHole, Spawn cục vật liệu 3D đặt lên đầu dây chuyền.
            // Nếu không, đẩy thẳng vào Rương chứa của chính cái máy Khoan này.
        }
    }
}
