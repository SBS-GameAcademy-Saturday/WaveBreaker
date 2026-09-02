using UnityEngine;

// 067회차 · PlayerInput 이 읽은 값으로 움직이고, 가는 방향으로 그림을 뒤집는다.
public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private PlayerInput input;
    [SerializeField] private Rigidbody2D rb;
    [SerializeField] private SpriteRenderer sprite;

    void FixedUpdate()
    {
        Vector2 move = input.MoveInput;

        rb.linearVelocity = move * moveSpeed;

        if (move.x != 0f)
        {
            sprite.flipX = move.x < 0f;
        }
    }
}
