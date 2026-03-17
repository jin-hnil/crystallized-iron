using UnityEngine;

namespace CrystallizedIron.Building
{
    public class AutoTurret : MonoBehaviour
    {
        [Header("Defense Setup")]
        public float detectionRadius = 15f; // Tầm quét hồng ngoại
        public float fireRate = 0.2f; // Tốc độ xả đạn (5 viên một giây)
        public float damagePerBullet = 15f;
        public int currentAmmoCount = 200; // Số lượng đạn trong hộp tiếp đạn

        [Header("Power Status")]
        public bool isPowered = true; // Cần điện nối vào để trụ có thể chĩa súng

        [Header("Turret Head")]
        public Transform gunHead; // Bộ xoay nòng ngắm
        public Transform firePoint; // Mũi xả đạn

        private Transform currentTarget;
        private float fireTimer = 0f;

        private void Update()
        {
            if (!isPowered) return;

            FindTarget();

            if (currentTarget != null)
            {
                AimAtTarget();

                fireTimer += Time.deltaTime;
                if (fireTimer >= fireRate && currentAmmoCount > 0)
                {
                    Fire();
                    fireTimer = 0f;
                }
            }
        }

        private void FindTarget()
        {
            // Trục vớt mục tiêu qua mặt nạ lớp "Enemy"
            // Tối ưu hóa: Chỉ quét 1 giây 1 lần thay vì mỗi frame, nhưng mô phỏng nhanh bằng OverlapSphere
            Collider[] colliders = Physics.OverlapSphere(transform.position, detectionRadius);
            float shortestDistance = Mathf.Infinity;
            Transform nearestEnemy = null;

            foreach (Collider col in colliders)
            {
                if (col.CompareTag("Mutant") || col.CompareTag("Enemy"))
                {
                    float distanceToEnemy = Vector3.Distance(transform.position, col.transform.position);
                    if (distanceToEnemy < shortestDistance)
                    {
                        shortestDistance = distanceToEnemy;
                        nearestEnemy = col.transform;
                    }
                }
            }

            currentTarget = nearestEnemy;
        }

        private void AimAtTarget()
        {
            // Turret ngước súng và nòng bám sát gáy kẻ thù. Trực tiếp xoay, có thể làm mượt (Lerp) sau.
            Vector3 direction = currentTarget.position - gunHead.position;
            Quaternion lookRotation = Quaternion.LookRotation(direction);
            Vector3 rotation = lookRotation.eulerAngles;
            gunHead.rotation = Quaternion.Euler(rotation.x, rotation.y, 0f); // Không cho vặn nòng sai lệch
        }

        private void Fire()
        {
            currentAmmoCount--;
            Debug.Log($"[Phòng Thủ Tháp] Bắn! Còn {currentAmmoCount} đạn. Địch nhận sát thương {damagePerBullet} HP.");

            // Trong không gian lưới mạng/vật lý, có thể sinh ra tia đạn (Bullet Prefab).
            // Có thể quăng Raycast thẳng vào "Enemy" xử lí máu bên đó.
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, detectionRadius);
        }
    }
}
