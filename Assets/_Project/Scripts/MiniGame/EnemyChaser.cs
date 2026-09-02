using UnityEngine;

/// <summary>
/// 063회차 — 미니게임 ③ 생존 슈팅의 적. 플레이어를 향해 온다.
///
/// 왜 Inspector 드래그가 아니라 FindWithTag 인가
///   042 에서는 Inspector 에 끌어다 넣었다. 그런데 적은 게임 중에 생긴다 — 드래그할 수가 없다.
///   044 에서 Tag 로 "골라냈다면" 여기서는 Tag 로 "찾는다".
///
/// ⚠️ FindWithTag 는 무거운 함수다. Start 에서 한 번만 부른다.
///    049 에서 GetComponent 를 Awake 에 넣은 것과 같은 이유다.
///
/// 오늘의 한 문장: 방향은 빼기로 만든다.
///     목표 위치 - 내 위치  =  나에서 목표로 가는 화살표
///             .normalized  =  그 방향만 (길이 1)
///               * speed    =  그 방향으로 그 속도
///   순서를 바꾸면 도망간다. 헷갈리면 한 번 뒤집어 보면 된다.
///
/// 왜 부딪히면 적도 사라지나
///   안 사라지면 닿아 있는 동안 매 프레임 데미지가 들어가 플레이어가 순식간에 죽는다.
///   본 프로젝트에서는 "초당 데미지" 로 제대로 만든다. 여기서는 자폭형으로 단순하게 간다.
/// </summary>
public class EnemyChaser : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 2f;
    [SerializeField] private int damage = 10;

    private Rigidbody2D rb;
    private Transform target;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Start()
    {
        GameObject player = GameObject.FindWithTag("Player");

        if (player != null)
        {
            target = player.transform;
        }
    }

    private void FixedUpdate()
    {
        // 플레이어가 죽으면 쫓을 대상이 없다. 057 의 player == null 과 같은 상황이다.
        if (target == null) return;

        Vector2 dir = ((Vector2)target.position - rb.position).normalized;

        rb.linearVelocity = dir * moveSpeed;
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            // 050 에서 총알이 하던 것과 같다. 대상만 반대다.
            Health health = other.GetComponent<Health>();

            if (health != null)
            {
                health.TakeDamage(damage);
            }

            Destroy(gameObject);
        }
    }
}
