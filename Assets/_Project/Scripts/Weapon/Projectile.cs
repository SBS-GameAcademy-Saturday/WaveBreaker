using UnityEngine;

// 079회차 · 자동 조준 총알. 047의 Bullet 과 뼈대가 같고 "관통" 이 붙었다.
// 086회차 · 피해와 관통 수를 AutoGun 이 정해준다.
// 103회차 · 풀링. Destroy 대신 반납하고, 수명은 직접 센다.
//   Destroy(gameObject, 2f) 같은 예약은 풀링과 같이 못 쓴다 — 서랍 속 물건까지 없애 버린다.
public class Projectile : MonoBehaviour
{
    [SerializeField] private float speed = 12f;
    [SerializeField] private int damage = 3;
    [SerializeField] private int pierce = 2;      // 몇 마리까지 뚫는가
    [SerializeField] private float lifeTime = 2f;

    private Rigidbody2D rb;
    private float lifeLeft;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    public void Setup(int newDamage, int newPierce)
    {
        damage = newDamage;
        pierce = newPierce;
    }

    // 🔑 재활용될 때마다 다시 돈다. Start 였으면 두 번째부터 안 날아간다.
    private void OnEnable()
    {
        rb.linearVelocity = transform.up * speed;
        lifeLeft = lifeTime;
    }

    private void Update()
    {
        lifeLeft -= Time.deltaTime;

        // 안 없애면 계속 쌓인다 (048). 이제는 없애는 대신 반납한다.
        if (lifeLeft <= 0f) PoolManager.Despawn(gameObject);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Enemy")) return;
        if (!other.TryGetComponent(out IDamageable target)) return;

        target.TakeDamage(damage);

        pierce--;

        if (pierce <= 0)
        {
            PoolManager.Despawn(gameObject);
        }
    }
}
