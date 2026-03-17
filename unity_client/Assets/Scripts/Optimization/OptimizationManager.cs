using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Optimization
{
    public class OptimizationManager : MonoBehaviour
    {
        public static OptimizationManager Instance;

        [Header("Settings")]
        public Transform playerCamera;
        
        // Khoảng cách tối đa (mét). Qua vạch này, vật thể sẽ tàng hình hoặc bị ngắt tải (Disable)
        public float cullDistance = 150f; 
        
        // Cứ mỗi 0.5 giây mới quét khoảng cách một lần (Thay vì ép CPU phải tính toán ở hàm Update siêu tốc 60 FPS)
        public float checkInterval = 0.5f;

        [Header("Trạng thái (Status)")]
        public int activeObjectsCount = 0;
        public int culledObjectsCount = 0;

        // Danh sách quản lý các vật thể nhạy cảm cần bật/tắt
        private List<CullableObject> allObjects = new List<CullableObject>();

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
        }

        private void Start()
        {
            // Bắt đầu nhịp tim quét định kỳ (Timer Loop tốn cực ít Ram)
            InvokeRepeating(nameof(CheckAndCullDistances), 0.5f, checkInterval);
        }

        public void RegisterObject(CullableObject obj)
        {
            if (!allObjects.Contains(obj))
                allObjects.Add(obj);
        }

        public void UnregisterObject(CullableObject obj)
        {
            if (allObjects.Contains(obj))
                allObjects.Remove(obj);
        }

        private void CheckAndCullDistances()
        {
            if (playerCamera == null) return;

            activeObjectsCount = 0;
            culledObjectsCount = 0;

            Vector3 camPosition = playerCamera.position;
            // Thuật toán kiểm tra giới hạn của Góc nhìn hình chóp Camera (Frustum Culling Nâng Cao do mình tự bắt)
            Plane[] frustumPlanes = GeometryUtility.CalculateFrustumPlanes(playerCamera.GetComponent<Camera>());

            for (int i = 0; i < allObjects.Count; i++)
            {
                CullableObject target = allObjects[i];
                if (target == null) continue;

                float sqrDistance = (target.transform.position - camPosition).sqrMagnitude;

                // Nếu xa hơn CullDistance thì TẮT GẤP (Không thiết diện)
                if (sqrDistance > cullDistance * cullDistance)
                {
                    target.SetVisibility(false);
                    culledObjectsCount++;
                    continue;
                }

                // Kết hợp Culling Rìa Màn Hình (Chỉ giữ phần mặt trước tầm nhìn)
                // Cảnh báo: Unity đã TỰ ĐỘNG KHÔNG RENDER các Mesh sau lưng bạn ở tầng C++. 
                // NẾU BẠN TẮT CẢ GAMEOBJECT SẼ GIẢM TẢI ĐƯỢC CẢ (ANIMATION, LOGIC AI, SCRIPT C#).
                
                if (target.hideWhenOutOfCameraView && target.objectCollider != null)
                {
                    bool isVisible = GeometryUtility.TestPlanesAABB(frustumPlanes, target.objectCollider.bounds);
                    target.SetVisibility(isVisible);
                    
                    if(isVisible) activeObjectsCount++;
                    else culledObjectsCount++;
                }
                else
                {
                    // Lọt vào vùng 150m mà không cần quét Góc Nhìn thì Bật cờ hiện
                    target.SetVisibility(true);
                    activeObjectsCount++;
                }
            }
        }
    }
}
