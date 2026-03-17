using UnityEngine;

namespace CrystallizedIron.Building
{
    public class BuildingManager : MonoBehaviour
    {
        [Header("References")]
        public Camera playerCamera;
        public Material previewMaterial;
        public LayerMask groundLayer;
        public LayerMask buildingLayer;

        [Header("Build Settings")]
        public float maxBuildDistance = 10f;
        public BuildableObject currentPrefab;

        private BuildableObject currentPreview;
        private bool isBuildModeActive = false;
        private bool canPlace = true;

        private void Update()
        {
            // Phím B rảnh tay bật/tắt chế độ búa xây dựng
            if (Input.GetKeyDown(KeyCode.B))
            {
                ToggleBuildMode();
            }

            if (isBuildModeActive && currentPreview != null)
            {
                HandlePlacement();
                
                if (Input.GetMouseButtonDown(0) && canPlace)
                {
                    PlaceBuilding();
                }

                // Xoay nhà (Rotate) với lưới 90 độ
                if (Input.GetKeyDown(KeyCode.R))
                {
                    currentPreview.transform.Rotate(0, 90f, 0);
                }
            }
        }

        public void ToggleBuildMode()
        {
            isBuildModeActive = !isBuildModeActive;
            if (isBuildModeActive)
            {
                // TODO: Gọi hàm UI mở Menu Balo chọn công trình. Hiện tại test mặc định dùng Prefab đã cấp.
                if (currentPrefab != null && currentPreview == null)
                {
                    currentPreview = Instantiate(currentPrefab);
                }
            }
            else
            {
                if (currentPreview != null)
                {
                    Destroy(currentPreview.gameObject);
                }
            }
        }

        private void HandlePlacement()
        {
            Ray ray = new Ray(playerCamera.transform.position, playerCamera.transform.forward);
            
            // Xử lý cơ chế bắt dính (Snapping)
            if (Physics.Raycast(ray, out RaycastHit hitInfo, maxBuildDistance, groundLayer | buildingLayer))
            {
                bool snapped = false;

                // Thử tìm xem chỗ nhắm có SnapPoint nào chìa ra không
                SnapPoint targetedNode = hitInfo.collider.GetComponent<SnapPoint>();
                
                if (targetedNode != null && currentPreview.requiresSnapPoint && targetedNode.type == currentPreview.acceptedSnapType)
                {
                    // Hít (Snap) hologram vào vị trí Snap Node
                    currentPreview.transform.position = targetedNode.transform.position;
                    // TODO: Xoay dựa theo normal góc bám dính
                    snapped = true;
                }
                
                // Nếu không Snap, đặt tự do (Free placement) trên mặt đất
                if (!snapped && !currentPreview.requiresSnapPoint)
                {
                    if (hitInfo.collider.gameObject.layer == LayerMask.NameToLayer("Ground"))
                    {
                        currentPreview.transform.position = hitInfo.point;
                    }
                }

                // Kiểm tra hộp chống va chạm (Anti-clipping check) để đổi màu Đỏ/Xanh Hologram
                Collider[] overlaps = Physics.OverlapBox(currentPreview.transform.position, currentPreview.buildingCollider.bounds.extents / 1.5f, currentPreview.transform.rotation, buildingLayer);
                canPlace = (overlaps.Length == 0) && (!currentPreview.requiresSnapPoint || snapped);
                
                currentPreview.SetPreviewMode(previewMaterial, canPlace);
            }
            else
            {
                canPlace = false;
                currentPreview.SetPreviewMode(previewMaterial, false);
            }
        }

        private void PlaceBuilding()
        {
            // Trừ chi phí thiết kế trong Balo tại đây
            
            // Chốt đặt nhà thực thụ, khôi phục Material và Collider góc
            currentPreview.SetPlacedMode();
            currentPreview = null;
            
            // Tạo tức thời Hologram mới để búa tiếp móng thứ hai
            currentPreview = Instantiate(currentPrefab);
        }
    }
}
