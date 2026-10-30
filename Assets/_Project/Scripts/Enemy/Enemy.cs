using UnityEngine;

// 몬스터 하나. **종류는 EnemyData 가 정한다.**
//
// 🔑 클래스를 종류마다 나누지 않는다. 숫자와 그림이 다를 뿐이면 에셋이면 된다.
//    행동이 다른 것(보스)만 자식으로 만든다.
public class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected EnemyData data;

    // 🚨 data 가 없을 때를 위한 기본값. 씬에 손으로 놓아도 돌아간다.
    [Header("data 가 없을 때 쓰는 값")]
    [SerializeField] protected int maxHealth = 20;
    [SerializeField] protected int contactDamage = 2;
    [SerializeField] protected float moveSpeed = 2f;

    protected int currentHealth;
    protected float damageReduction;
    protected Rigidbody2D rb;
    protected SpriteRenderer sprite;
    protected Transform player;
    protected Flicker flicker;

    private float healthScale = 1f;
    private bool dead;

    public EnemyData Data => data;
    public bool IsBoss => data != null && data.isBoss;

    // 🔑 WaveManager 가 스폰 직후 부른다. Start() 보다 먼저 들어간다.
    public void Setup(EnemyData d, float scale = 1f)
    {
        data = d;
        healthScale = scale;
        ApplyData();
    }

    protected virtual void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        sprite = GetComponent<SpriteRenderer>();
        flicker = GetComponent<Flicker>();
    }

    protected void ApplyData()
    {
        if (data == null) return;

        maxHealth = data.maxHealth;
        contactDamage = data.contactDamage;
        moveSpeed = data.moveSpeed;
        damageReduction = data.damageReduction;

        if (sprite != null)
        {
            if (data.sprite != null) sprite.sprite = data.sprite;
            sprite.color = data.tint;
        }
        if (flicker != null) flicker.SetBaseColor(data.tint);

        var anim = GetComponent<Animator>();
        if (anim != null && data.animator != null) anim.runtimeAnimatorController = data.animator;

        transform.localScale = Vector3.one * data.scale;
    }

    protected virtual void Start()
    {
        ApplyData();
        currentHealth = Mathf.Max(Mathf.RoundToInt(maxHealth * healthScale), 1);

        GameObject found = GameObject.FindWithTag("Player");
        if (found != null) player = found.transform;
    }

    protected virtual void FixedUpdate()
    {
        if (player == null || dead) return;
        Move();
    }

    protected virtual void Move()
    {
        Vector2 dir = ((Vector2)player.position - rb.position).normalized;

        rb.linearVelocity = dir * moveSpeed;
        sprite.flipX = dir.x < 0f;
    }

    public virtual void TakeDamage(int amount)
    {
        if (dead) return;

        // 🔑 감소율이 0 이면 그대로 들어간다. 최소 1 은 보장한다.
        int real = damageReduction > 0f
            ? Mathf.Max(Mathf.RoundToInt(amount * (1f - damageReduction)), 1)
            : amount;

        currentHealth -= real;

        if (flicker != null) flicker.Play();

        if (currentHealth <= 0) Die();
    }

    protected virtual void Die()
    {
        if (dead) return;
        dead = true;

        if (GameManager.Instance != null) GameManager.Instance.AddKill();

        int exp = data != null ? data.gemExp : 1;
        GemSpawner.Drop(transform.position, exp);

        Destroy(gameObject);
    }

    // 🚨 같은 편은 안 때린다. 이 한 줄이 없으면 몬스터끼리 서로 죽인다.
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Enemy")) return;

        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            target.TakeDamage(contactDamage);
        }
    }

    private void OnCollisionStay2D(Collision2D collision) => OnCollisionEnter2D(collision);
}
