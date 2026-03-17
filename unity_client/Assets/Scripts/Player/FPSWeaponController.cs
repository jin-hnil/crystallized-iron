using UnityEngine;

namespace CrystallizedIron.Player
{
    public class FPSWeaponController : MonoBehaviour
    {
        [Header("Arms & Animation")]
        public Transform rightHandGrip;     // Vị trí gắn vũ khí trên tay phải (hoặc cả 2 tay)
        public Animator armsAnimator;       // Hiệu ứng chuyển động của cánh tay 3D (Đấm, Chém, Thay đạn)

        [Header("Current Equipment")]
        public GameObject currentWeaponObject; // Vũ khí sinh ra từ Prefab đang được tay cầm
        public string currentWeaponId = "";

        [Header("Weapon Sway (Đung đưa tay)")]
        public float swayMultiplier = 2f;
        public float swaySmoothness = 6f;

        private Quaternion startRotation;
        private Vector3 startPosition;

        private void Start()
        {
            startRotation = rightHandGrip.localRotation;
            startPosition = rightHandGrip.localPosition;
        }

        private void Update()
        {
            HandleWeaponSway();
            HandleInput();
        }

        private void HandleInput()
        {
            if (currentWeaponObject == null) return;

            // Bấm chuột trái để Tấn công / Đóng đinh / Bắn súng
            if (Input.GetMouseButtonDown(0))
            {
                if (armsAnimator != null)
                {
                    armsAnimator.SetTrigger("Attack"); // Kích hoạt Animation tay đập xuống/giật cò
                }

                Debug.Log("[FPS] Đang sử dụng vũ khí: " + currentWeaponId);
                // Call Weapon Logic here (Raycast đạn, hoặc gọi hàm Interaction ở script khác)
            }

            // Bấm Phím 1, 2, 3 để thay vũ khí
            if (Input.GetKeyDown(KeyCode.Alpha1)) EquipWeapon("Rìu_Đá");
            if (Input.GetKeyDown(KeyCode.Alpha2)) EquipWeapon("Súng_Lục");
            if (Input.GetKeyDown(KeyCode.Alpha3)) EquipWeapon("Súng_Trường_M4");
            if (Input.GetKeyDown(KeyCode.Alpha4)) Unequip(); // Cất đồ đi, tay không
        }

        // Mô phỏng độ trễ của bàn tay khi xoay chuột (Weapon Sway) tạo cảm giác thực tế
        private void HandleWeaponSway()
        {
            float mouseX = Input.GetAxisRaw("Mouse X") * swayMultiplier;
            float mouseY = Input.GetAxisRaw("Mouse Y") * swayMultiplier;

            Quaternion rotationX = Quaternion.AngleAxis(-mouseY, Vector3.right);
            Quaternion rotationY = Quaternion.AngleAxis(mouseX, Vector3.up);

            Quaternion targetRotation = startRotation * rotationX * rotationY;

            rightHandGrip.localRotation = Quaternion.Slerp(rightHandGrip.localRotation, targetRotation, swaySmoothness * Time.deltaTime);
        }

        public void EquipWeapon(string weaponId)
        {
            // TODO: Load Prefab cánh tay/súng tương ứng từ Resources hoặc Inventory hệ thống
            currentWeaponId = weaponId;
            Debug.Log($"[FPS] Đã cầm {weaponId} lên tay.");

            if (armsAnimator != null)
            {
                armsAnimator.SetTrigger("Equip");
            }

            // Destroy súng cũ
            if (currentWeaponObject != null)
            {
                Destroy(currentWeaponObject);
            }

            // Pseudo Code Instantiation:
            /*
            GameObject prefabToHold = Resources.Load<GameObject>("Weapons/" + weaponId);
            currentWeaponObject = Instantiate(prefabToHold, rightHandGrip.position, rightHandGrip.rotation, rightHandGrip);
            */
        }

        public void Unequip()
        {
            if (currentWeaponObject != null)
            {
                Destroy(currentWeaponObject);
            }
            currentWeaponId = "";
            Debug.Log("[FPS] Cất vũ khí, trở về tay không (Unarmed).");
        }
    }
}
