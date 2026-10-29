using UnityEngine;

// 070회차 · 6주차 콘솔의 Enemy 를 유니티로 옮긴 것. 상속 구조는 그대로다.
// 071회차 · 플레이어를 쫓아온다. 쫓아오는 방법을 Move() 로 떼어 둔다.
// 072회차 · TakeDamage 를 virtual 로 연다 — 탱커가 덮어쓴다.
//
// 🔑 abstract 라서 이 자체로는 씬에 못 붙인다. 반드시 자식을 만들어야 한다.
//    "몬스터 일반" 이라는 건 세상에 없다. 돌진형이거나 러너거나 탱커다.
public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;
    [SerializeField] protected float moveSpeed = 2f;

    protected int currentHealth;
    protected Rigidbody2D rb;
    protected SpriteRenderer sprite;
    protected Transform player;

    protected virtual void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        sprite = GetComponent<SpriteRenderer>();
    }

    // 🚨 virtual 을 안 붙이면 자식이 Start 를 쓰는 순간 이쪽이 안 불린다.
    //    체력이 0 인 채로 태어난다.
    protected virtual void Start()
    {
        currentHealth = maxHealth;

        GameObject found = GameObject.FindWithTag("Player");

        if (found != null)
        {
            player = found.transform;
        }
    }

    protected virtual void FixedUpdate()
    {
        if (player == null) return;

        Move();
    }

    // 🔑 071회차 · 지금은 자식이 아무도 안 덮어쓴다. 그런데 virtual 로 열어 둔다.
    //    072회차에 러너가 "안 꺾고 직진" 으로 덮어쓸 자리다.
    //    나중에 열려면 그때 FixedUpdate 를 통째로 뜯어야 한다.
    protected virtual void Move()
    {
        // 방향 = 목표 − 나. 063회차에서 한 그대로다.
        Vector2 dir = ((Vector2)player.position - rb.position).normalized;

        rb.linearVelocity = dir * moveSpeed;
        sprite.flipX = dir.x < 0f;
    }

    // 🔑 072회차 · virtual 로 바꿨다. 탱커가 피해를 깎고 나서 부모를 부른다.
    public virtual void TakeDamage(int amount)
    {
        currentHealth -= amount;
        Debug.Log($"{name} : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    protected virtual void Die()
    {
        Debug.Log($"{name} 사망");

        // 075회차 · 처치 수는 GameManager 가 센다.
        if (GameManager.Instance != null)
        {
            GameManager.Instance.AddKill();
        }

        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
