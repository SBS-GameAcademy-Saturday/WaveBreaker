using UnityEngine;

// 070회차 · 6주차에 콘솔로 짠 Enemy 를 유니티로 옮긴 것.
// abstract 이므로 이 스크립트 자체는 오브젝트에 붙지 않는다. 자식(ChargerEnemy 등)만 붙는다.
//
// 071회차 · 플레이어를 향해 걸어오게 만들었다. Move() 를 virtual 로 둬서 072에서 자식마다 바꾼다.
// 072회차 · TakeDamage 를 virtual 로 바꿨다. TankEnemy 가 받는 피해를 줄이기 위해서다.
// 081회차 · 죽으면 경험치 젬을 떨군다.
// 087·088회차 · 수치를 EnemyData(SO)에서 읽는다. 코드를 안 고치고 밸런싱할 수 있다.
public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected EnemyData data;
    [SerializeField] protected GameObject expGemPrefab;

    protected int maxHealth = 10;
    protected int damage = 1;
    protected float moveSpeed = 2f;

    protected int currentHealth;
    protected Rigidbody2D rb;
    protected SpriteRenderer sprite;
    protected Transform player;

    protected virtual void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        sprite = GetComponent<SpriteRenderer>();

        ApplyData();
    }

    // 088회차 · SO 의 값을 런타임 필드로 옮긴다. 그 뒤로는 SO 를 건드리지 않는다.
    protected virtual void ApplyData()
    {
        if (data == null) return;

        maxHealth = data.maxHealth;
        damage = data.damage;
        moveSpeed = data.moveSpeed;

        if (sprite != null) sprite.color = data.color;

        transform.localScale = Vector3.one * data.scale;
    }

    // private 으로 두면 자식이 override 할 수 없다.
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
        // 플레이어가 없으면 쫓을 대상이 없다. 063 의 target == null 과 같은 상황이다.
        if (player == null) return;

        Move();
    }

    // 072에서 자식마다 다르게 바꾼다.
    protected virtual void Move()
    {
        Vector2 dir = ((Vector2)player.position - rb.position).normalized;

        rb.linearVelocity = dir * moveSpeed;
        sprite.flipX = dir.x < 0f;
    }

    public virtual void TakeDamage(int amount)
    {
        // 090회차 · 한 프레임에 칼 여러 자루와 총알이 동시에 맞으면 Die() 가 여러 번 불린다.
        // Destroy 는 프레임 끝에 처리되기 때문이다. 080에서 플레이어에 넣은 검사와 같다.
        if (currentHealth <= 0) return;

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

        if (GameManager.Instance != null)
        {
            GameManager.Instance.AddKill();
        }

        // 081회차 · 죽은 자리에 경험치 젬을 떨군다.
        if (expGemPrefab != null)
        {
            Instantiate(expGemPrefab, transform.position, Quaternion.identity);
        }

        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
