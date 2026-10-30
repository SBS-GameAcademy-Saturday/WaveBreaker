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

    [Header("서로 비켜서기")]
    [SerializeField] private float separationRadius = 1.4f;
    [SerializeField] private float separationWeight = 2.0f;

    protected int currentHealth;
    protected float damageReduction;
    protected Rigidbody2D rb;
    protected SpriteRenderer sprite;
    protected Transform player;
    protected Flicker flicker;
    protected Animator anim;

    // 🔑 컨트롤러마다 가진 파라미터가 다르다. 없는 것을 건드리면 경고가 쏟아진다.
    private bool hasSpeed, hasHurt, hasDie;

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
        anim = GetComponent<Animator>();
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

        if (anim == null) anim = GetComponent<Animator>();
        if (anim != null && data.animator != null)
        {
            anim.runtimeAnimatorController = data.animator;

            // 컨트롤러를 갈아 끼운 **뒤** 다시 센다. 끼우기 전 파라미터는 옛 것이다.
            hasSpeed = hasHurt = hasDie = false;
            foreach (var pm in anim.parameters)
            {
                if (pm.name == "Speed") hasSpeed = true;
                else if (pm.name == "Hurt") hasHurt = true;
                else if (pm.name == "Die") hasDie = true;
            }
        }

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

        // 🔑 쫓아가는 방향 + 서로 비켜서는 방향.
        //    비켜서는 쪽에 가중치를 작게 줘야 플레이어를 계속 쫓는다.
        Vector2 move = (dir + separation * separationWeight).normalized;

        rb.linearVelocity = move * moveSpeed;
        sprite.flipX = move.x < 0f;

        // 🚨 Orc 컨트롤러는 Speed 로 Idle ↔ Walk 를 가른다. 안 넣어 주면
        //    아무리 달려도 **선 채로 미끄러진다.** 실제로 그렇게 보였다.
        if (anim != null && hasSpeed) anim.SetFloat("Speed", rb.linearVelocity.magnitude);

        separation = Vector2.zero;   // 매 프레임 다시 모은다
    }

    public virtual void TakeDamage(int amount)
    {
        if (dead) return;
        if (anim != null && hasHurt) anim.SetTrigger("Hurt");

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

        // 죽는 그림이 있으면 그것만 잠깐 보여 주고 치운다.
        // 🚨 그 사이 다시 맞거나 플레이어를 때리면 안 되니 몸을 먼저 끈다.
        if (anim != null && hasDie)
        {
            anim.SetTrigger("Die");
            rb.linearVelocity = Vector2.zero;
            foreach (var c in GetComponents<Collider2D>()) c.enabled = false;
            Destroy(gameObject, 0.45f);
            return;
        }

        Destroy(gameObject);
    }

    // 🔑 콜라이더가 Trigger 라 서로 **밀어내지 않는다.**
    //    물리로 안 미는 대신, 겹치면 코드로 조금씩 벌린다.
    private Vector2 separation;

    private void OnTriggerStay2D(Collider2D other)
    {
        if (other.CompareTag("Enemy"))
        {
            // 같은 편이면 안 때리고, 대신 서로 비켜선다
            Vector2 away = (Vector2)transform.position - (Vector2)other.transform.position;
            float d = away.magnitude;

            if (d > 0.001f && d < separationRadius)
            {
                // 가까울수록 세게 민다
                separation += away.normalized * (1f - d / separationRadius);
            }
            return;
        }

        if (other.TryGetComponent(out IDamageable target))
        {
            target.TakeDamage(contactDamage);
        }
    }
}
