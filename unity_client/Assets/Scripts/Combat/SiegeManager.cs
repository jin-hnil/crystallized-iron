using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Combat
{
    public class SiegeManager : MonoBehaviour
    {
        public static SiegeManager Instance;

        [Header("Siege Settings")]
        public float timeBetweenWaves = 15f * 60f; // Mỗi 15 phút là một Bầy ùa tới (Trong game có thể làm 3-4 ngày in-game)
        public int currentWaveNumber = 1;
        public Transform[] enemySpawnPoints; 

        [Header("Mutant Prefabs")]
        public GameObject groundMutantPrefab;
        public GameObject flyingMutantPrefab; // Quái vật bay (Mồi cho Tên Lửa Phòng Không)

        private float waveTimer = 0f;
        public bool isSiegeActive = false;
        
        // Quản lý Mức Độ Tiếng Bồn/Ô Nhiễm từ các Lò nung và Máy khoan của người chơi (Pollution)
        public float colonyThreatLevel = 0f; 

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
        }

        private void Update()
        {
            if (!isSiegeActive)
            {
                waveTimer += Time.deltaTime;
                
                // Gia tốc kéo bầy quái tới nhanh hơn nếu nhà máy phát ra ô nhiễm khủng khiếp (Khói/Sóng điện từ)
                waveTimer += (colonyThreatLevel * 0.1f) * Time.deltaTime;

                if (waveTimer >= timeBetweenWaves)
                {
                    StartSiegeWave();
                }
            }
        }

        public void StartSiegeWave()
        {
            isSiegeActive = true;
            waveTimer = 0f;
            Debug.Log($"[Siege] ⚠️ BÁO ĐỘNG ĐỎ! Đợt Tấn Công số {currentWaveNumber} đã bắt đầu ⚠️");

            // Kích hoạt còi hú báo động Căn Cứ (Từ xa)
            // AudioManager.Instance.PlayMusic(siegeSirenClip);

            int enemyCount = Random.Range(5 + currentWaveNumber * 3, 10 + currentWaveNumber * 5);

            for (int i = 0; i < enemyCount; i++)
            {
                Transform point = enemySpawnPoints[Random.Range(0, enemySpawnPoints.Length)];
                
                // Càng ngày càng có tỷ lệ ra Quái vật BAY để thách thức Tên Lửa Phòng Không
                GameObject prefabChoice = (currentWaveNumber > 2 && Random.value > 0.7f) ? flyingMutantPrefab : groundMutantPrefab;

                // Spawn quái vật
                // Instantiate(prefabChoice, point.position, Quaternion.identity);
            }
        }

        public void EndSiegeWave()
        {
            isSiegeActive = false;
            currentWaveNumber++;
            Debug.Log("[Siege] Căn cứ đã an toàn. Bắt đầu khôi phục và dọn dẹp.");
        }
    }
}
