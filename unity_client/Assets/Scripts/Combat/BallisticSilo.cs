using UnityEngine;

namespace CrystallizedIron.Combat
{
    public class BallisticSilo : MonoBehaviour
    {
        [Header("Missile Specs")]
        public GameObject missilePrefab;
        public float launchFuelCost = 100f; // Tốn dầu phóng
        public float reloadTime = 30f;      // Đợi nửa phút để lắp Quả mới
        
        [Header("State")]
        private bool isReady = true;
        private float cooldownTimer = 0f;

        private void Update()
        {
            if (!isReady)
            {
                cooldownTimer += Time.deltaTime;
                if (cooldownTimer >= reloadTime)
                {
                    isReady = true;
                    cooldownTimer = 0f;
                    Debug.Log("[Ballistic] Tên Lửa Mới Đã Chui Vào Ống. Sẵn sàng nhận Mật Lệnh!");
                }
            }
        }

        // Tương tác bằng Bản Đồ (Map UI) đặt tọa độ ném bom
        public void LaunchMissile(Vector3 targetGPSCoordinate)
        {
            if (!isReady) 
            {
                Debug.LogWarning("[Ballistic] Hầm chứa đang nạp tên lửa, chưa thể bắn.");
                return;
            }

            // Gọi trừ Xăng
            // if(Generator.currentFuel < launchFuelCost) return;

            isReady = false;
            Debug.Log($"[Ballistic] 🚀 RA MẬT LỆNH: Đã Phóng Tên Lửa Đạn Đạo (ICBM) bay tới vĩ độ {targetGPSCoordinate}.");

            // Tạo Tên Lửa bốc thẳng lên trời
            // Nửa phút sau nó sẽ rơi chóp xuống đầu Target phá hủy cả một ổ nhền nhện
            // GameObject missile = Instantiate(missilePrefab, transform.position, Quaternion.identity);
            // missile.GetComponent<MissileLogic>().SetTarget(targetGPSCoordinate);
        }
    }
}
