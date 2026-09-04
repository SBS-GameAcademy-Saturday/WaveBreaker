using UnityEngine;

// 067회차 · PlayerInput 이 읽은 값으로 움직이고, 가는 방향으로 그림을 뒤집는다.
public class PlayerController : MonoBehaviour
{
    private Animator anim;

    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private PlayerInput input;
    [SerializeField] private Rigidbody2D rb;
    [SerializeField] private SpriteRenderer sprite;

    // 085회차 · 레벨업으로 이동 속도가 오른다.
    public void SpeedUp(float step)
    {
        moveSpeed += step;
        Debug.Log($"이동 속도 상승 — {moveSpeed:F1}");
    }

    void FixedUpdate()
    {
        Vector2 move = input.MoveInput;

        rb.linearVelocity = move * moveSpeed;

        // 131회차 · Animator 가 Speed 를 보고 Idle / Walk 를 고른다.
        if (anim == null) anim = GetComponent<Animator>();
        if (anim != null) anim.SetFloat("Speed", rb.linearVelocity.magnitude);

        if (move.x != 0f)
        {
            sprite.flipX = move.x < 0f;
        }
    }
}
