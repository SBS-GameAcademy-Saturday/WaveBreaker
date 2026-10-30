using UnityEngine;

// 날아가는 것. 맞으면 피해를 주고 사라진다.
public class Projectile : MonoBehaviour
{
    [SerializeField] private float life = 3f;

    private int damage;
    private Rigidbody2D rb;

    public void Setup(int dmg, Vector2 dir, float speed)
    {
        damage = dmg;
        rb = GetComponent<Rigidbody2D>();
        if (rb != null) rb.linearVelocity = dir * speed;
        Destroy(gameObject, life);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Enemy")) return;

        if (other.TryGetComponent(out IDamageable t)) t.TakeDamage(damage);

        Destroy(gameObject);
    }
}
