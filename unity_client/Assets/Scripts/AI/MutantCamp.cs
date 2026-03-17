using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.AI
{
    // Căn cư / Hang Ổ quái vật sinh ra nhiều Mutant rải xung quanh
    public class MutantCamp : MonoBehaviour
    {
        [Header("Camp Settings")]
        public string campName = "Hang Ổ Đột Biến";
        public float spawnRadius = 15f;
        public int maxMutantsInCamp = 10;
        public float respawnDelay = 60f; // Nếu quái chết, đợi 60s để sinh con mới

        [Header("Linked Prefabs")]
        public GameObject defaultMutantPrefab;
        public GameObject rareLootChestPrefab; // Phần thưởng nếu đập nát cái Camp này

        [Header("State")]
        private List<GameObject> activeMutants = new List<GameObject>();
        public bool isDestroyed = false;

        private void Start()
        {
            InitialSpawn();
        }

        private void InitialSpawn()
        {
            for (int i = 0; i < maxMutantsInCamp; i++)
            {
                SpawnSingleMutant();
            }
        }

        private void SpawnSingleMutant()
        {
            if (isDestroyed) return;

            Vector3 randomOffset = Random.insideUnitSphere * spawnRadius;
            randomOffset.y = 0; // Đừng văng lên trời
            Vector3 spawnPos = transform.position + randomOffset;

            // TODO: Bắn Physics.Raycast xuống đất để lấy độ cao Y chính xác trên Terrain

            GameObject mutantObj = Instantiate(defaultMutantPrefab, spawnPos, Quaternion.identity, transform);
            activeMutants.Add(mutantObj);

            // Gắn Camp mẹ cho Quái để Quái biết nó chết báo lại cho Camp
            var wanderLogic = mutantObj.GetComponent<MutantWanderer>();
            if (wanderLogic != null)
            {
                wanderLogic.homeCamp = this;
                wanderLogic.isLoneWolf = false; 
            }
        }

        public void ReportMutantDeath(GameObject deadMutant)
        {
            if (activeMutants.Contains(deadMutant))
            {
                activeMutants.Remove(deadMutant);
            }

            // Gọi đẻ lại bù số lượng bị hụt
            if (!isDestroyed)
            {
                Invoke(nameof(SpawnSingleMutant), respawnDelay);
            }
        }

        // Tương tác khi người chơi ném thuốc nổ tiêu diệt nòng cốt của Tụ Điểm này
        public void DestroyCampBase()
        {
            if (isDestroyed) return;
            isDestroyed = true;

            Debug.Log($"[Mutant Camp] Trái tim ổ Quái {campName} đã bị huỷ diệt! An toàn thiết lập.");

            if (rareLootChestPrefab != null)
            {
                Instantiate(rareLootChestPrefab, transform.position, Quaternion.identity);
            }

            CancelInvoke(nameof(SpawnSingleMutant));
        }

        private void OnDrawGizmos()
        {
            Gizmos.color = new Color(1, 0, 0, 0.3f); // Đỏ mờ
            Gizmos.DrawWireSphere(transform.position, spawnRadius);
        }
    }
}
