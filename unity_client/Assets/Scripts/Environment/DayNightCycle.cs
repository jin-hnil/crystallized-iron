using UnityEngine;

namespace CrystallizedIron.Environment
{
    public class DayNightCycle : MonoBehaviour
    {
        [Header("Time Settings")]
        [Tooltip("Số phút ngoài đời thực để hoàn thành 1 ngày trong game")]
        public float realMinutesPerDay = 24f; 
        
        [Tooltip("Giờ hiện tại trong Game (0-24)")]
        [Range(0, 24)] public float currentTimeOfDay = 8f; 

        [Header("Lighting & Sky")]
        public Light directionalLight; // Nguồn sáng Mặt trời (Sun)
        public float maxSunIntensity = 1.0f;
        public float minSunIntensity = 0.0f; // Bằng 0 là đen đặc, không có Trăng giả soi đường

        [Header("Atmosphere")]
        public Color dayAmbientColor;
        public Color nightAmbientColor;

        // Cho phép các Script khác check xem Trời có đang tối không (VD: Quái vật check để chui lên)
        public bool isNightTime => currentTimeOfDay >= 18.5f || currentTimeOfDay <= 6f; 

        private float timeMultiplier;

        private void Start()
        {
            // Tính toán gia tốc thời gian
            timeMultiplier = 24f / (realMinutesPerDay * 60f);
        }

        private void Update()
        {
            UpdateTime();
            UpdateLighting();
        }

        private void UpdateTime()
        {
            // Trôi thời gian
            currentTimeOfDay += Time.deltaTime * timeMultiplier;

            if (currentTimeOfDay >= 24f)
            {
                currentTimeOfDay -= 24f; // Reset sang ngày mới
                Debug.Log("[Thế Giới] Chúc mừng! Bạn đã sống sót thêm 1 ngày.");
            }
        }

        private void UpdateLighting()
        {
            if (directionalLight == null) return;

            // Tính tỷ lệ giờ ra % chu kỳ của Mặt trời quay quanh quả đất
            float timePercent = currentTimeOfDay / 24f;
            
            // Xoay nguồn sáng Directional Light theo trục X 360 độ (0 -> bình minh, 0.5 -> hoàng hôn, 1 -> bình minh hôm sau)
            // Lệch hướng -90 độ để 12h trưa ánh sáng rọi thẳng đứng hắt từ trên cao xuống
            directionalLight.transform.localRotation = Quaternion.Euler((timePercent * 360f) - 90f, 170f, 0);

            // Xử lý góc tối Cường độ ánh sáng (Intensity)
            float intensityMultiplier = 1;

            if (currentTimeOfDay <= 0.23f || currentTimeOfDay >= 0.75f) 
            {
                intensityMultiplier = 0; // Tắt nắng hoàn toàn vào ban đêm ròng (Đen thui)
            }
            else if (currentTimeOfDay <= 0.25f) 
            {
                intensityMultiplier = Mathf.Clamp01((currentTimeOfDay - 0.23f) * (1 / 0.02f)); // Rạng đông nhú lên dần (Sáng dần)
            }
            else if (currentTimeOfDay >= 0.73f) 
            {
                intensityMultiplier = Mathf.Clamp01(1 - ((currentTimeOfDay - 0.73f) * (1 / 0.02f))); // Hoàng hôn chìm tắt dần (Mờ dần)
            }

            directionalLight.intensity = minSunIntensity + (maxSunIntensity - minSunIntensity) * intensityMultiplier;

            // Chuyển đổi màu Môi trường rực màu sang xanh đen lạnh lẽo bằng Linear interpolation
            RenderSettings.ambientLight = Color.Lerp(nightAmbientColor, dayAmbientColor, intensityMultiplier);
        }
    }
}
