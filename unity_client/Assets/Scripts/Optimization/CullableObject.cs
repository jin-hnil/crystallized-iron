using UnityEngine;

namespace CrystallizedIron.Optimization
{
    public class CullableObject : MonoBehaviour
    {
        [Header("Culling Behaviour")]
        [Tooltip("Nếu tích chọn, khi sau lưng người chơi sẽ tắt ngay để nhẹ CPU (Cho AI và Máy Móc)")]
        public bool hideWhenOutOfCameraView = false;
        
        // Liên kết đồ họa và vật lý
        public Collider objectCollider;
        private Renderer[] renderers;
        
        // Các logic tốn kém cũng sẽ được ngắt (Ví dụ AI Quái vật, Băng chuyền)
        private MonoBehaviour[] expensiveScripts;

        private bool m_isVisible = true;

        private void Start()
        {
            if (objectCollider == null) objectCollider = GetComponent<Collider>();
            
            renderers = GetComponentsInChildren<Renderer>();
            expensiveScripts = GetComponents<MonoBehaviour>(); 

            // Đăng ký khai báo hộ chiếu với Bộ Máy Quản Lý trung tâm
            if (OptimizationManager.Instance != null)
            {
                OptimizationManager.Instance.RegisterObject(this);
            }
        }

        private void OnDestroy()
        {
            // Chặt rụng, Khai tử rút tên khỏi Sổ quản lý (VD Máy khoan bị phá nát mớ)
            if (OptimizationManager.Instance != null)
            {
                OptimizationManager.Instance.UnregisterObject(this);
            }
        }

        // Module công tắc đóng ngắt
        public void SetVisibility(bool state)
        {
            if (m_isVisible == state) return; // Không vẽ rắn lên nữa nếu đang chung trạng thái

            m_isVisible = state;

            // 1. Tắt bóng hình vẽ bằng Card Màn Hình Graphic
            foreach (var rend in renderers)
            {
                if(rend != null) rend.enabled = state;
            }

            // 2. Tắt hộp logic chạy nền bằng CPU 
            // (Nhưng đừng khóa Script CullableObject này không thì nó Ngủ vĩnh viễn không tự gọi mở lên được nữa)
            foreach (var script in expensiveScripts)
            {
                if (script != this) 
                {
                    script.enabled = state; 
                }
            }
            
            // Tùy chọn: Có thể tắt luôn toàn bộ GameObject (.SetActive(state)) cho sạch.
            // Tuy nhiên tắt .SetActive tốn chớp bộ nhớ nhiều hơn nếu lặp nhịp chớp nháy (Flickering).
            // Nên giới hạn ngắt Tắt Component Logic và Renderer là quá mượt.
        }
    }
}
