using UnityEngine;

// 070회차 · 6주차에 콘솔로 짠 Enemy 를 유니티로 옮긴 것.
// abstract 이므로 이 스크립트 자체는 오브젝트에 붙지 않는다. 자식(ChargerEnemy 등)만 붙는다.
//
// 071회차 · 플레이어를 향해 걸어오게 만들었다. Move() 를 virtual 로 둬서 072에서 자식마다 바꾼다.
// 072회차 · TakeDamage 를 virtual 로 바꿨다. TankEnemy 가 받는 피해를 줄이기 위해서다.
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

        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
