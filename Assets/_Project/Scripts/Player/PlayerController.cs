using UnityEngine;

// 067회차 · 받은 입력대로 움직이고, 보는 쪽으로 그림을 뒤집는다.
//
// 🔑 Update 가 아니라 FixedUpdate 다. Rigidbody2D 를 건드리기 때문이다 (042회차).
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

        // 🚨 조건 없이 뒤집으면 손을 뗀 순간 move.x 가 0 이라 오른쪽으로 홱 돌아간다.
        //    "입력이 있을 때만" 이 핵심이다.
        if (move.x != 0f)
        {
            sprite.flipX = move.x < 0f;
        }
    }
}
