using UnityEngine;
using UnityEngine.AI;

namespace CrystallizedIron.AI
{
    [RequireComponent(typeof(NavMeshAgent))]
    public class MutantWanderer : MonoBehaviour
    {
        public bool isLoneWolf = true; // Lang thang đơn độc khắp thế giới
        public MutantCamp homeCamp; // Nếu là thuộc biên chế của Camp, sẽ chỉ rảo quanh Camp

        [Header("Wander Settings")]
        public float wanderRadius = 20f;
        public float wanderTimer = 5f; // Đứng nghỉ 5s rồi đi bộ tới ngọn cỏ khác

        private NavMeshAgent agent;
        private float timer;

        // Tích hợp với Class chiến đấu 
        private MutantAI fightLogic; 

        private void Start()
        {
            agent = GetComponent<NavMeshAgent>();
            fightLogic = GetComponent<MutantAI>();
            timer = wanderTimer;
        }

        private void Update()
        {
            // Trả lại tay lái cho lệnh Rượt Đuổi (Chase) nếu phát hiện Người (Player)
            // (Assumes MutantAI takes control of agent if in aggro mode)
            if (fightLogic != null && agent.isStopped == false && fightLogic.isDead == false)
            {
                // Nếu Fight logic đang nhắm vào mục tiêu, Wanderer tắt ngủ đông
                // Lái sang chỗ khác không lo việc đi lang thang nữa
                Vector3 currentDest = agent.destination;
                // Code đơn giản: chỉ lang thang khi đang thảnh thơi (Idle)
            }

            timer += Time.deltaTime;

            if (timer >= wanderTimer)
            {
                // Tìm vị trí cỏ mới
                Vector3 epicenter = isLoneWolf ? transform.position : (homeCamp ? homeCamp.transform.position : transform.position);
                Vector3 newPos = RandomNavSphere(epicenter, wanderRadius, -1);
                
                agent.SetDestination(newPos);
                timer = 0;
            }
        }

        public static Vector3 RandomNavSphere(Vector3 origin, float dist, int layermask) 
        {
            Vector3 randDirection = Random.insideUnitSphere * dist;
            randDirection += origin;
            
            NavMeshHit navHit;
            NavMesh.SamplePosition(randDirection, out navHit, dist, layermask);
            
            return navHit.position;
        }

        private void OnDestroy()
        {
            // Báo khai tử lên Doanh Trại Căn Cứ mẹ để nó nở thêm trứng quái vật đẻ ra
            if (homeCamp != null)
            {
                homeCamp.ReportMutantDeath(gameObject);
            }
        }
    }
}
