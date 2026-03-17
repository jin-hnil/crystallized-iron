using UnityEngine;

namespace CrystallizedIron.Automation
{
    public class Inserter : MonoBehaviour
    {
        [Header("Arm Mechanics")]
        public Transform pickupPoint;  // Điểm đầu lấy hàng (VD: Mặt trên của Băng chuyền)
        public Transform dropoffPoint; // Điểm thả hàng (VD: Đỉnh lò nung)
        public float delayBetweenGrabs = 2.0f; // Tốc độ gắp hàng (2 giây/lần)

        [Header("Filter")]
        public string filterItemId = ""; // Nếu để trống là gắp mọi thứ, nếu ghi tên thì chỉ gắp loại quặng đó

        private float grabTimer = 0f;

        private void Update()
        {
            grabTimer += Time.deltaTime;

            if (grabTimer >= delayBetweenGrabs)
            {
                TryGrabItem();
            }
        }

        private void TryGrabItem()
        {
            // Dùng Physics OverlapSphere kiểm tra điểm Pickup xem có vật phẩm rớt (DroppedItem) hay không
            Collider[] itemsToGrab = Physics.OverlapSphere(pickupPoint.position, 0.5f);

            foreach (var col in itemsToGrab)
            {
                if (col.CompareTag("DroppedItem"))
                {
                    // Lấy ItemComponent giả định
                    // ItemComponent item = col.GetComponent<ItemComponent>();
                    // if (filterItemId != "" && item.itemId != filterItemId) continue;

                    // Thực hiện di chuyển vật thể dời tới bệ Hạ cánh (Drop-off point)
                    col.transform.position = dropoffPoint.position;

                    // Nếu Drop-off là máy móc (Lò nung), nhét vô bụng
                    Furnace targetFurnace = dropoffPoint.GetComponentInParent<Furnace>();
                    if (targetFurnace != null)
                    {
                        targetFurnace.InsertItem("item_iron_ore", 1); // Cứng hóa test logic
                        Destroy(col.gameObject); // Biến mất hạt quặng vì lò đã nuốt
                    }

                    grabTimer = 0f; // Reset đếm giờ
                    return; // Gắp 1 cục mỗi chu kỳ
                }
            }
        }

        // Gizmo lập trình để chỉnh vị trí chóp tay gắp trong Editor
        private void OnDrawGizmos()
        {
            if (pickupPoint != null && dropoffPoint != null)
            {
                Gizmos.color = Color.yellow;
                Gizmos.DrawWireSphere(pickupPoint.position, 0.5f);
                Gizmos.color = Color.blue;
                Gizmos.DrawWireSphere(dropoffPoint.position, 0.5f);
                Gizmos.DrawLine(pickupPoint.position, dropoffPoint.position);
            }
        }
    }
}
