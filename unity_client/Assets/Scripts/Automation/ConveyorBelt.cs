using UnityEngine;

namespace CrystallizedIron.Automation
{
    public class ConveyorBelt : MonoBehaviour
    {
        [Header("Belt Settings")]
        public float speed = 2.0f; // Vận tốc truyền tải mét/giây
        public Transform startPoint;
        public Transform endPoint;
        
        // Quá trình sẽ sử dụng OnCollisionStay hoặc Trigger để đẩy RigidBody chạy dọc theo trục Forward của Belt
        private void OnCollisionStay(Collision collision)
        {
            // Nếu vật thể cọ xát với cái băng chuyền đang mang thẻ "Item thả rớt/Ore"
            if (collision.gameObject.CompareTag("DroppedItem"))
            {
                Rigidbody rb = collision.rigidbody;
                if (rb != null)
                {
                    // Cưỡng ép Vector đẩy vật thể lướt nhẹ đi về một phía (End point)
                    Vector3 moveDirection = (endPoint.position - startPoint.position).normalized;
                    rb.MovePosition(rb.position + moveDirection * speed * Time.fixedDeltaTime);
                }
            }
        }
    }
}
