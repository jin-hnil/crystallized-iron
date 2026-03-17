using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class PlayerController : MonoBehaviour
{
    [Header("Movement Options")]
    public float walkSpeed = 4f;
    public float sprintSpeed = 7f;
    public float jumpHeight = 1.5f;
    public float gravity = -9.81f * 2f;

    [Header("Camera Constraints")]
    public Transform cameraTransform;
    public float mouseSensitivity = 2f;

    private CharacterController controller;
    private PlayerSurvival survival;
    private Vector3 velocity;
    private float cameraPitch = 0f;

    private void Start()
    {
        controller = GetComponent<CharacterController>();
        survival = GetComponent<PlayerSurvival>();

        // Khóa chuột vào màn hình (Dành cho FPS)
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    private void Update()
    {
        // Chết thì không cho di chuyển hay xoay góc nhìn
        if (survival != null && survival.IsDead) return;

        HandleLook();
        HandleMovement();
    }

    private void HandleLook()
    {
        float mouseX = Input.GetAxisRaw("Mouse X") * mouseSensitivity;
        float mouseY = Input.GetAxisRaw("Mouse Y") * mouseSensitivity;

        cameraPitch -= mouseY;
        cameraPitch = Mathf.Clamp(cameraPitch, -90f, 90f); // Giới hạn xoay màn hình lên/xuống

        // Camera xoay theo trục X, Nhân vật xoay theo trục Y
        cameraTransform.localEulerAngles = Vector3.right * cameraPitch;
        transform.Rotate(Vector3.up * mouseX);
    }

    private void HandleMovement()
    {
        bool isGrounded = controller.isGrounded;

        if (isGrounded && velocity.y < 0)
        {
            velocity.y = -2f; // Ép nhân vật bám sát mặt đất
        }

        float moveX = Input.GetAxisRaw("Horizontal");
        float moveZ = Input.GetAxisRaw("Vertical");
        Vector3 move = transform.right * moveX + transform.forward * moveZ;

        // Cơ chế theo tài liệu GDD: Nếu hết Khát (Thirst = 0) thì nhân vật không được phép chạy nước rút.
        bool canSprint = (survival == null || survival.currentThirst > 0);
        bool isSprinting = Input.GetKey(KeyCode.LeftShift) && canSprint && move.magnitude > 0;
        
        float currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

        if (isSprinting && survival != null)
        {
            // Chạy nước rút (Sprinting) đốt năng lượng và thanh Khát nhanh hơn.
            survival.currentThirst -= 1.0f * Time.deltaTime; 
            survival.currentHunger -= 0.5f * Time.deltaTime;
        }

        controller.Move(move.normalized * currentSpeed * Time.deltaTime);

        // Nhảy
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity); // Vật lý tự do rơi
        }

        // Tác dụng trọng lực
        velocity.y += gravity * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}
