using System.Collections;
using UnityEngine;

// 070회차 · 6주차에 콘솔로 짠 Enemy 를 유니티로 옮긴 것.
// abstract 이므로 이 스크립트 자체는 오브젝트에 붙지 않는다. 자식(ChargerEnemy 등)만 붙는다.
//
// 071회차 · 플레이어를 향해 걸어오게 만들었다. Move() 를 virtual 로 둬서 072에서 자식마다 바꾼다.
// 072회차 · TakeDamage 를 virtual 로 바꿨다. TankEnemy 가 받는 피해를 줄이기 위해서다.
// 081회차 · 죽으면 경험치 젬을 떨군다.
// 087·088회차 · 수치를 EnemyData(SO)에서 읽는다. 코드를 안 고치고 밸런싱할 수 있다.
// 099·100회차 · 맞으면 하얗게 번쩍이고, 죽으면 조각과 소리가 난다.
// 102회차 · 풀링. Destroy 대신 서랍에 반납한다.
//   Start 는 처음 한 번만 돈다. 재활용될 때마다 다시 채워야 하는 건 OnEnable 로 옮겼다.
public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected EnemyData data;
    [SerializeField] protected GameObject expGemPrefab;

    [Header("연출 (099·100회차)")]
    [SerializeField] protected GameObject deathEffect;
    [SerializeField] protected AudioClip hitSfx;
    [SerializeField] protected AudioClip dieSfx;

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
    // 살아 있는 몬스터 수. 웨이브 매니저가 상한을 걸 때 쓴다 (103회차).
    public static int AliveCount { get; private set; }

    public static void ResetAliveCount() => AliveCount = 0;

    // 🔑 102회차 · Start 가 아니라 OnEnable 이다.
    //    서랍에서 꺼낼 때(SetActive(true)) 여기가 다시 돈다.
    protected virtual void OnEnable()
    {
        AliveCount++;

        currentHealth = maxHealth;   // 이걸 안 하면 지난 판의 체력 0 을 그대로 갖고 나온다

        GameObject found = GameObject.FindWithTag("Player");

        if (found != null)
        {
            player = found.transform;
        }
    }

    protected virtual void OnDisable()
    {
        AliveCount--;
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

        Flash();

        if (AudioManager.Instance != null) AudioManager.Instance.Play(hitSfx, 0.5f);

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    // 099회차 · 맞은 걸 눈으로 알려준다. 숫자를 읽는 것보다 빠르다.
    protected void Flash()
    {
        if (sprite == null || !gameObject.activeInHierarchy) return;

        StopCoroutine(nameof(FlashRoutine));
        StartCoroutine(nameof(FlashRoutine));
    }

    private IEnumerator FlashRoutine()
    {
        Color original = data != null ? data.color : Color.white;

        sprite.color = Color.white;

        // 히트스톱 중에도 번쩍여야 한다. timeScale 을 안 타는 대기를 쓴다.
        yield return new WaitForSecondsRealtime(0.06f);

        if (sprite != null) sprite.color = original;
    }

    protected virtual void Die()
    {
        Debug.Log($"{name} 사망");

        if (deathEffect != null) PoolManager.Spawn(deathEffect, transform.position, Quaternion.identity);

        if (AudioManager.Instance != null) AudioManager.Instance.Play(dieSfx, 0.6f);

        if (GameManager.Instance != null)
        {
            GameManager.Instance.AddKill();
        }

        // 081회차 · 죽은 자리에 경험치 젬을 떨군다.
        if (expGemPrefab != null)
        {
            PoolManager.Spawn(expGemPrefab, transform.position, Quaternion.identity);
        }

        // 102회차 · 버리지 않고 서랍에 반납한다.
        PoolManager.Despawn(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
