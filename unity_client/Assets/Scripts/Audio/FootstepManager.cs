using UnityEngine;

namespace CrystallizedIron.Audio
{
    // Cắm Script này vào PlayerController hoặc bàn chân nhân vật để tạo tiếng xào xạc khi di chuyển
    public class FootstepManager : MonoBehaviour
    {
        [Header("Footstep Sounds")]
        public AudioClip[] dirtSteps;
        public AudioClip[] woodSteps;
        public AudioClip[] metalSteps;

        [Header("Settings")]
        public float walkStepInterval = 0.5f; // Đi bộ bước chậm
        public float sprintStepInterval = 0.3f; // Chạy nước rút nhịp nhanh hơn
        public float soundVolume = 0.6f;

        private CharacterController controller;
        private float stepTimer = 0f;

        private void Start()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            // Nếu chân không chạm đất hoặc chả di chuyển thì không phát tiếng bước chân
            if (controller == null || !controller.isGrounded || controller.velocity.sqrMagnitude < 0.1f)
            {
                stepTimer = 0f;
                return;
            }

            // Đo tính đang đi từ từ (Walk) hay đè phím chạy (Sprint) - Pseudo Code
            bool isSprinting = Input.GetKey(KeyCode.LeftShift); 
            float currentInterval = isSprinting ? sprintStepInterval : walkStepInterval;

            stepTimer += Time.deltaTime;

            if (stepTimer >= currentInterval)
            {
                PlayFootstepSound();
                stepTimer = 0f;
            }
        }

        private void PlayFootstepSound()
        {
            // 1. Phóng Raycast từ mũi chân cắm thẳng xuống lòng đất xem đang bước phải Cỏ hay Sàn Bê tông
            Ray ray = new Ray(transform.position + Vector3.up * 0.1f, Vector3.down);
            string surfaceTag = "Dirt"; // Cỏ mọc (Mặc Định)

            if (Physics.Raycast(ray, out RaycastHit hit, 1.5f))
            {
                // Thỏa mãn Material hoặc Tag của cái Tấm Móng Nhà (Ví dụ: "WoodFloor")
                if (hit.collider.CompareTag("Wood")) surfaceTag = "Wood";
                else if (hit.collider.CompareTag("Metal")) surfaceTag = "Metal";
            }

            // 2. Chuyển túi âm thanh tương ứng mảng Array
            AudioClip[] stepClips = dirtSteps;
            switch(surfaceTag)
            {
                case "Wood": stepClips = woodSteps; break;
                case "Metal": stepClips = metalSteps; break;
            }

            // Lấy ramdom 1 âm thanh từ 4 tiếng "Rột rột" để nghe không bị chán tai (Ear fatigue)
            if (stepClips == null || stepClips.Length == 0) return;
            AudioClip clipToPlay = stepClips[Random.Range(0, stepClips.Length)];

            // Làm xê dịch âm vực xí 0.9 -> 1.1 Pitch
            float randomPitch = Random.Range(0.9f, 1.1f);

            // 3. Gọi Loa Không gian 3D của Bộ máy Manager ra xử lý
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.Play3DSound(clipToPlay, transform.position, soundVolume, randomPitch);
            }
        }
    }
}
