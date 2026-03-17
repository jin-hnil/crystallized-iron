using UnityEngine;

namespace CrystallizedIron.Combat
{
    public class ReconDrone : MonoBehaviour
    {
        [Header("Drone Params")]
        public float flightSpeed = 10f;
        public float flyHeight = 25f; // Bay cách mặt đất 25m an toàn
        public bool isKamikaze = false;
        public float kamikazeDamageAoE = 300f; // Bơm 300 Dame nổ to
        
        [Header("Targeting")]
        private Transform kamikazeTarget;

        [Header("Components")]
        public Camera droneCamera; // Camera nhìn từ góc nhìn Drone màn hình PC của nhân vật
        public GameObject explosionEffect;

        private void Update()
        {
            if (isKamikaze && kamikazeTarget != null)
            {
                DiveBomb();
            }
            else if (!isKamikaze)
            {
                ManualFlight();
            }
        }

        // Tự do dạo chơi thám thính qua Cụm WASD
        private void ManualFlight()
        {
            float moveX = Input.GetAxis("Horizontal");
            float moveZ = Input.GetAxis("Vertical");
            float moveY = 0f;
            
            if (Input.GetKey(KeyCode.Space)) moveY = 1f;    // Nâng độ cao
            if (Input.GetKey(KeyCode.LeftControl)) moveY = -1f; // Hạ độ cao
            
            Vector3 movement = new Vector3(moveX, moveY, moveZ).normalized;
            transform.Translate(movement * flightSpeed * Time.deltaTime);
        }

        // Đối với Drone Tự Sát chứa C4
        public void AssignTarget(Transform enemyBase)
        {
            kamikazeTarget = enemyBase;
            isKamikaze = true;
        }

        private void DiveBomb()
        {
            // Trượt tên lửa xuống đầu Quái
            Vector3 dir = (kamikazeTarget.position - transform.position).normalized;
            transform.position += dir * (flightSpeed * 3f) * Time.deltaTime; // Lao dốc gấp 3 tốc độ

            if (Vector3.Distance(transform.position, kamikazeTarget.position) < 2f)
            {
                Explode();
            }
        }

        private void Explode()
        {
            Debug.Log($"[Drone] BÙM! Drone tự sát phát nổ tại tọa độ gieo rắc hỏa lực {kamikazeDamageAoE} DMG C4.");
            // Instantiate(explosionEffect, transform.position, Quaternion.identity);
            
            // Tìm vòng vụ nổ 10 mét quét đám Mutant
            Collider[] hits = Physics.OverlapSphere(transform.position, 10f);
            foreach(var hit in hits)
            {
                if(hit.CompareTag("Mutant"))
                {
                    // Trừ máu
                }
            }

            Destroy(gameObject);
            // TODO: Trả lại màn hình FPS cho Player ngồi ở nhà.
        }
    }
}
