using UnityEngine;

public class PlayerInteraction : MonoBehaviour
{
    public Transform cameraTransform;
    public float interactionDistance = 3.5f; // Chiều dài sải tay cầm cuốc/rìu
    public float resourceDamage = 25f; // Sức phá hoại gốc cây (Tương đương 4 nhát rìu là sập một thân cây)
    public float hitCooldown = 0.6f; // Tốc độ vung tay đập tài nguyên

    private float nextHitTime = 0f;
    private PlayerSurvival survival;

    private void Start()
    {
        survival = GetComponent<PlayerSurvival>();
    }

    private void Update()
    {
        if (survival != null && survival.IsDead) return;

        // Bấm chuột trái để chém rìu vào hitbox cây cối
        if (Input.GetMouseButton(0) && Time.time >= nextHitTime)
        {
            nextHitTime = Time.time + hitCooldown;
            PerformMiningHit();
        }
    }

    private void PerformMiningHit()
    {
        // Gửi một tia sáng Raycast vô hình từ tâm ngắm Camera thẳng lên trước
        Ray ray = new Ray(cameraTransform.position, cameraTransform.forward);
        
        // Cần tạo LayerMask riêng cho Environment để tránh chém nhầm thứ khác nếu cần thiết.
        if (Physics.Raycast(ray, out RaycastHit hitInfo, interactionDistance))
        {
            // Kiểm tra xem tia Raycast có va trúng Cây Gỗ, Mỏ Đá (ResourceNode) không
            ResourceNode resource = hitInfo.collider.GetComponent<ResourceNode>();
            if (resource != null)
            {
                resource.TakeHit(resourceDamage);

                // Thêm phạt Đói / Khát nhỏ mỗi lần ra sức đập đá
                if (survival != null)
                {
                    survival.currentHunger -= 0.1f;
                    survival.currentThirst -= 0.15f;
                }
            }
        }
    }
}
