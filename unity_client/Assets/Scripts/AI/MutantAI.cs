using UnityEngine;
using UnityEngine.AI;
using CrystallizedIron.Player;

namespace CrystallizedIron.AI
{
    [RequireComponent(typeof(NavMeshAgent))]
    public class MutantAI : MonoBehaviour
    {
        public float chaseRadius = 25f;  // Quãng cách nghe mùi
        public float attackRadius = 2.5f; // Sải tay vấu
        public float attackDamage = 15f; 
        public float attackCooldown = 1.2f; // Tốc độ trảo vuốt

        private NavMeshAgent agent;
        private Transform playerTarget;
        private PlayerSurvival playerSurvival;
        private Animator aiAnimator;

        private float nextAttackTime = 0f;
        public bool isDead = false;

        private void Start()
        {
            agent = GetComponent<NavMeshAgent>();
            aiAnimator = GetComponent<Animator>();

            // Hệ thống đơn giản, tự tìm thấy GameObject gắn Tag "Player" lúc bắt đầu.
            // Trong game lớn sẽ dùng OverlapSphere dò quét (Sensory).
            GameObject pObj = GameObject.FindGameObjectWithTag("Player");
            if (pObj != null)
            {
                playerTarget = pObj.transform;
                playerSurvival = pObj.GetComponent<PlayerSurvival>();
            }
        }

        private void Update()
        {
            if (isDead || playerTarget == null || (playerSurvival != null && playerSurvival.IsDead)) 
            {
                agent.isStopped = true;
                return;
            }

            float distanceToPlayer = Vector3.Distance(transform.position, playerTarget.position);

            if (distanceToPlayer <= chaseRadius)
            {
                // Thấy Player, rống lên rượt theo tọa độ
                agent.SetDestination(playerTarget.position);

                if (distanceToPlayer <= attackRadius)
                {
                    // Chạm tay vào nhau, ngừng chạy chồm mỏ cắn
                    agent.isStopped = true;
                    if (Time.time >= nextAttackTime)
                    {
                        AttackPlayer();
                        nextAttackTime = Time.time + attackCooldown;
                    }
                }
                else
                {
                    // Lại tiếp tục rượt chạy nước rút (Sprint)
                    agent.isStopped = false;
                    
                    if(aiAnimator != null)
                        aiAnimator.SetBool("isRunning", true);
                }
            }
            else
            {
                // Ra khỏi tầm nhìn, đi lảng vảng (Wander) hoặc đứng im.
                if(aiAnimator != null)
                    aiAnimator.SetBool("isRunning", false);
            }
        }

        private void AttackPlayer()
        {
            // Trượt vô hướng của người chơi
            transform.LookAt(new Vector3(playerTarget.position.x, transform.position.y, playerTarget.position.z));

            if (aiAnimator != null)
            {
                aiAnimator.SetTrigger("Attack"); // Quăng hoạt ảnh tát
            }

            // Truớc khi xé máu, Quái vật cào qua lớp Giáp bằng hàm TakeDamage bên kia
            if (playerSurvival != null)
            {
                playerSurvival.TakeDamage(attackDamage, false);
                Debug.Log($"[Mutant AI] Gầm gừ!!! Đã cắn lén Player {attackDamage} Damage.");
            }
        }

        // Tương tác dính đạn của Player bắn vào Mutants
        public void TakeDamage(float amount)
        {
            if (isDead) return;
            
            // Tạm làm Máu quái ở đây
            // currentHp -= amount;
            // if (currentHp <= 0) Die();
            
            Debug.Log("[Mutant AI] Aaagrh! Nhận sát thương đạn.");
            
            // Bị bắn trúng nó sẽ tức giận chĩa ánh nhìn quay qua rượt lại người bắn (Aggro)
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, chaseRadius);
            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(transform.position, attackRadius);
        }
    }
}
