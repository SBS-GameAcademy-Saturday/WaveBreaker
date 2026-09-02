using UnityEngine;

// 079회차 · 자동 조준 총알. 047의 Bullet 과 뼈대가 같고 "관통" 이 붙었다.
// 086회차 · 피해와 관통 수를 AutoGun 이 정해준다.
public class Projectile : MonoBehaviour
{
    [SerializeField] private float speed = 12f;
    [SerializeField] private int damage = 3;
    [SerializeField] private int pierce = 2;      // 몇 마리까지 뚫는가
    [SerializeField] private float lifeTime = 2f;

    private Rigidbody2D rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    public void Setup(int newDamage, int newPierce)
    {
        damage = newDamage;
        pierce = newPierce;
    }

    private void Start()
    {
        rb.linearVelocity = transform.up * speed;
        Destroy(gameObject, lifeTime);   // 안 없애면 계속 쌓인다 (048)
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Enemy")) return;
        if (!other.TryGetComponent(out IDamageable target)) return;

        target.TakeDamage(damage);

        pierce--;

        if (pierce <= 0)
        {
            Destroy(gameObject);
        }
    }
}
