using UnityEngine;

// 날아가는 것. 맞으면 피해를 주고 사라진다.
public class Projectile : MonoBehaviour
{
    [SerializeField] private float life = 3f;

    private int damage;
    private float blastRadius;      // 0 이면 맞은 한 놈만, 크면 주변까지 터진다
    private GameObject blastFx;
    private bool spent;
    private Rigidbody2D rb;

    public void Setup(int dmg, Vector2 dir, float speed, float radius = 0f, GameObject fx = null)
    {
        damage = dmg;
        blastRadius = radius;
        blastFx = fx;
        rb = GetComponent<Rigidbody2D>();
        if (rb != null) rb.linearVelocity = dir * speed;
        Destroy(gameObject, life);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (spent || !other.CompareTag("Enemy")) return;

        // 🚨 한 프레임에 여러 적과 겹치면 Enter 가 여러 번 온다. 한 번만 터진다.
        spent = true;

        if (blastRadius <= 0f)
        {
            if (other.TryGetComponent(out IDamageable t)) t.TakeDamage(damage);
        }
        else
        {
            Area.Hit(transform.position, blastRadius, damage);
            Area.SpawnFx(blastFx, transform.position, blastRadius);
        }

        Destroy(gameObject);
    }
}
