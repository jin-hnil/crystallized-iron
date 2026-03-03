using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class PlayerMovement : MonoBehaviour
{
    [Header("Chỉ số di chuyển")]
    public float moveSpeed = 5f;
    public float jumpForce = 7f;

    private Rigidbody2D rb;
    private float moveInput;
    private SpriteRenderer spriteRenderer;

    // Kiểm tra chạm đất (dành cho nhảy)
    private bool isGrounded = false;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        // Khóa xoay trục Z để nhân vật không bị lăn tròn khi va chạm
        rb.constraints = RigidbodyConstraints2D.FreezeRotation;

        spriteRenderer = GetComponent<SpriteRenderer>();
        if (spriteRenderer == null) 
        {
            spriteRenderer = GetComponentInChildren<SpriteRenderer>();
        }
    }

    void Update()
    {
        // 1. Lấy input từ phím A/D hoặc Mũi tên Trái/Phải
        moveInput = Input.GetAxisRaw("Horizontal");

        // 2. Quay mặt nhân vật (Flip) dựa vào hướng đi
        if (moveInput > 0)
        {
            spriteRenderer.flipX = false; // Nhìn sang phải
        }
        else if (moveInput < 0)
        {
            spriteRenderer.flipX = true;  // Nhìn sang trái
        }

        // 3. Xử lý kĩ năng Nhảy (Nút Space)
        // Lưu ý: Ở bản thô này, nhân vật có thể nhảy liên tục nếu chưa kiểm tra mặt đất (Grounded) chặt chẽ.
        // Bạn có thể test nhảy thoái mái như "bay" để thử di chuyển 2D cơ bản trước.
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }

    void FixedUpdate()
    {
        // 4. Áp dụng lực di chuyển vào con vật lý (Rigidbody2D)
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);
    }
}
