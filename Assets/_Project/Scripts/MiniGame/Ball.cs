using UnityEngine;

/// <summary>
/// 059~060회차 — 벽돌깨기의 공.
///
/// 왜 Is Trigger 가 꺼져 있나
///   동전은 통과해야 해서 Trigger 였고(043), 공은 튕겨야 해서 Trigger 가 아니다.
///   튕기는 것 자체는 Physics Material 2D 의 Bounciness 가 한다.
///
/// 왜 FixedUpdate 에서 속도를 다시 넣나
///   Bounciness = 1 이어도 물리 계산 오차가 쌓여 공이 느려지거나 빨라진다.
///   .normalized 로 방향만 남기고 speed 를 곱하면 방향은 유지, 속도는 고정된다.
///   040·042 에서 두 번 미뤄둔 .normalized 가 여기서는 없으면 게임이 망가진다.
///
/// 한 스크립트에 Collision 과 Trigger 가 같이 있다
///   블록은 튕기면서 맞혀야 하니 OnCollisionEnter2D,
///   DeadZone 은 통과하면서 알아채기만 하면 되니 OnTriggerEnter2D.
/// </summary>
public class Ball : MonoBehaviour
{
    [SerializeField] private float speed = 8f;
    [SerializeField] private int damage = 10;

    private Rigidbody2D rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Start()
    {
        rb.linearVelocity = new Vector2(1f, 1f).normalized * speed;
    }

    private void FixedUpdate()
    {
        rb.linearVelocity = rb.linearVelocity.normalized * speed;
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Brick"))
        {
            // 050 에서 총알이 하던 것과 같다. 다른 건 Trigger 가 아니라 Collision 이라는 것뿐.
            Health health = collision.gameObject.GetComponent<Health>();

            if (health != null)
            {
                health.TakeDamage(damage);
            }
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("DeadZone"))
        {
            // 공이 없어지면 BreakoutManager 가 null 로 알아챈다 (057 과 같은 구조).
            Destroy(gameObject);
        }
    }
}
