using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Building
{
    public class BuildableObject : MonoBehaviour
    {
        [Header("Building Rules")]
        public string objectName = "Foundation";
        public bool requiresSnapPoint = false;
        public SnapPoint.SnapType acceptedSnapType;

        [Header("Components")]
        public List<SnapPoint> ownSnapPoints;
        public Collider buildingCollider;
        public Renderer[] renderers;

        private Material[] originalMaterials;

        private void Awake()
        {
            if (buildingCollider == null) buildingCollider = GetComponent<Collider>();
            if (renderers == null || renderers.Length == 0) renderers = GetComponentsInChildren<Renderer>();
            
            originalMaterials = new Material[renderers.Length];
            for (int i = 0; i < renderers.Length; i++)
            {
                originalMaterials[i] = renderers[i].material;
            }
        }

        public void SetPreviewMode(Material previewMaterial, bool isValid)
        {
            // Trong chế độ đặt (Preview Hologram), gỡ bỏ Collider tạm thời
            if (buildingCollider != null)
                buildingCollider.enabled = false;

            // Đổi màu sang xanh (đặt được) hoặc đỏ (bị vướng)
            Color tint = isValid ? new Color(0, 1, 0, 0.4f) : new Color(1, 0, 0, 0.4f);
            previewMaterial.color = tint;

            foreach (var rend in renderers)
            {
                rend.material = previewMaterial;
            }
        }

        public void SetPlacedMode()
        {
            // Trả lại material gốc và bật Collider cản bước nhảy
            if (buildingCollider != null)
                buildingCollider.enabled = true;

            for (int i = 0; i < renderers.Length; i++)
            {
                renderers[i].material = originalMaterials[i];
            }
        }
    }
}
