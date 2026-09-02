using UnityEngine;

/// <summary>
/// 047~050회차에 걸쳐 자라난 총알. 저장소에는 050 완성본만 있다.
/// 회차별 중간 상태는 각 회차 강의안의 코드 블록을 그대로 쓴다.
///
///   047  Start 에서 linearVelocity 로 날아간다
///   048  Destroy(gameObject, lifeTime) 로 수명을 준다 + 맞으면 둘 다 삭제
///   049  [SerializeField] rb 드래그를 GetComponent 로 대체 + null 대비
///   050  색을 바꾸는 대신 Health.TakeDamage 를 부른다
///   055  맞힐 대상을 Inspector 에서 정하도록 targetTag 를 열었다
///
/// 왜 targetTag 를 열었나 (055)
///   "부딪히면 상대 체력을 깎고 사라지는 것" 은 총알만이 아니다.
///   위에서 떨어지는 장애물도 같은 물건이다. 코드는 하나, 용도는 둘.
///     총알   targetTag = "Enemy",  Gravity Scale 0, Speed 10
///     장애물 targetTag = "Player", Gravity Scale 1, Speed 0  (중력이 떨어뜨린다)
///
/// 왜 Start 인가 (042 와 다른 점)
///   플레이어는 키 입력이 매 순간 바뀌니 FixedUpdate 가 맞다.
///   총알은 태어날 때 한 번 받은 속도를 그대로 유지하면 되니 Start 로 충분하다.
///
/// 왜 Awake 에서 부품을 찾나
///   내 부품 챙기는 건 Awake, 그걸 쓰는 건 Start. 남이 나를 먼저 쓸 수 있기 때문이다.
/// </summary>
public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;

    // 몇 초 뒤에 저절로 사라질지. 사거리 역할도 한다.
    [SerializeField] private float lifeTime = 2f;

    [SerializeField] private int damage = 10;

    // 누구를 맞힐지. 기본값은 총알 기준이라 047~050 수업 코드와 동작이 같다.
    [SerializeField] private string targetTag = "Enemy";

    private Rigidbody2D rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Start()
    {
        // transform.up 은 "자기 기준 위쪽" 이다. 총알을 돌리면 그 방향으로 간다.
        rb.linearVelocity = transform.up * speed;

        // "lifeTime 초 뒤에 없애라" 고 예약해 둔다.
        // this 가 아니라 gameObject 다. this 로 쓰면 스크립트만 빠지고 총알은 남는다.
        Destroy(gameObject, lifeTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag(targetTag))
        {
            // 점 앞에 있는 게 주인이다. other. 이 붙었으니 상대의 부품을 찾는다.
            // Health 는 내가 만든 클래스지만 컴포넌트라서 똑같이 찾힌다.
            Health health = other.GetComponent<Health>();

            // 못 찾으면 null 이 온다. 에러를 던지지 않으니 여기서 확인해야 한다.
            if (health != null)
            {
                health.TakeDamage(damage);
            }

            Destroy(gameObject);
        }
    }
}
