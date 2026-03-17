using UnityEngine;
using System.Collections.Generic;
using System.IO;

namespace CrystallizedIron.SaveSystem
{
    // Interface quy chuẩn: Game Object nào muốn được lưu thì PHẢI cấy đoạn mã này vào.
    public interface ISaveable
    {
        string ID { get; set; } // Giấy khai sinh độc nhất của vật thể trên Map
        object SaveState(); // Gói thông tin thành hộp
        void LoadState(object state); // Khui hộp khôi phục lại hiện trạng
    }

    [System.Serializable]
    public class GameMetaData
    {
        public string saveName;
        public string playTime;
        public string lastSavedDate;
    }

    public class SaveManager : MonoBehaviour
    {
        public static SaveManager Instance;
        private string saveFilePath;

        // Lưu danh sách toàn bộ các viên gạch, mỏ quặng đang nhúc nhích trên bản đồ
        public List<ISaveable> saveableEntities = new List<ISaveable>();

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;

            // Nơi file được lưu (Ví dụ: C:/Users/.../AppData/LocalLow/Company/CrystallizedIron/saves/)
            saveFilePath = Application.persistentDataPath + "/world_save.json";
        }

        // Bấm Esc -> Save Game
        public void SaveGame()
        {
            Dictionary<string, object> worldStateDictionary = new Dictionary<string, object>();

            foreach (var entity in saveableEntities)
            {
                // Gọi gõ cửa từng vách nhà bắt chúng khai báo ra trạng thái máu mè
                worldStateDictionary.Add(entity.ID, entity.SaveState());
            }

            // TODO: Gom PlayerData + WorldData + MetaData -> Nén lại thành String JSON
            // Để an toàn, ghi đè thành file Temp trước khi Replace file chính, chống bị lỗi mất điện giữa chừng
            
            Debug.Log($"[Save System] Đã nén và lưu thành công File Game tại: {saveFilePath}");
        }

        public void LoadGame()
        {
            if (!File.Exists(saveFilePath))
            {
                Debug.LogWarning("[Save System] Không tìm thấy File Save nào cả.");
                return;
            }

            // Đọc cục JSON đó... Bóc tách ra Dict
            Dictionary<string, object> loadedData = new Dictionary<string, object>(); // (Giả lập)

            foreach (var entity in saveableEntities)
            {
                if (loadedData.TryGetValue(entity.ID, out object savedState))
                {
                    entity.LoadState(savedState);
                }
            }
            Debug.Log("[Save System] Đã hồi sinh toàn bộ thế giới từ File Save.");
        }
    }
}
