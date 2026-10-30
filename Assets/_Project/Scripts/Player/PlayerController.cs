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
    [SerializeField] private Animator anim;

    // 레벨업 보상으로 빨라진다
    public void AddSpeed(float v) => moveSpeed += v;

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

        // 🔑 몬스터와 같은 방식이다. 컨트롤러가 Speed 를 보고 Idle ⇄ Walk 를 가른다.
        //    여기서 안 넘기면 아무리 달려도 선 채로 미끄러진다.
        if (anim != null) anim.SetFloat("Speed", rb.linearVelocity.magnitude);
    }
}
