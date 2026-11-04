using System.Collections.Generic;
using UnityEngine;

// 날아가는 것. 맞으면 피해를 주고 사라진다.
//
// 🔑 세 가지 성격을 하나로 다룬다 — 무기가 Setup 에서 골라 켠다.
//    · 그냥 날아가 한 놈 맞히기          (기본)
//    · 맞은 자리에서 터지기              (화염구 — radius)
//    · 쫓아가서 맞히고 다음 놈에게 튕기기 (유도 화살 — Homing)
public class Projectile : MonoBehaviour
{
    [SerializeField] private float life = 3f;

    private int damage;
    private float speed;
    private float blastRadius;      // 0 이면 맞은 한 놈만, 크면 주변까지 터진다
    private GameObject blastFx;
    private bool spent;
    private Rigidbody2D rb;

    // 유도 · 튕김
    private bool homing;
    private Transform target;
    private int bouncesLeft;
    private float bounceRange;
    private readonly HashSet<Transform> hit = new HashSet<Transform>();

    public void Setup(int dmg, Vector2 dir, float spd, float radius = 0f, GameObject fx = null)
    {
        damage = dmg;
        speed = spd;
        blastRadius = radius;
        blastFx = fx;
        rb = GetComponent<Rigidbody2D>();
        if (rb != null) rb.linearVelocity = dir * speed;
        Destroy(gameObject, life);
    }

    // 표적에게 곧장 간다. 맞힌 뒤 bounces 번까지 가까운 다른 적에게 곧장 튕겨 간다.
    public void Homing(Transform first, int bounces, float range)
    {
        homing = true;
        target = first;
        bouncesLeft = bounces;
        bounceRange = range;
    }

    private void FixedUpdate()
    {
        if (!homing || rb == null) return;

        // 노리던 적이 죽거나 풀로 돌아갔으면 가까운 다른 놈으로 갈아탄다
        if (!Alive(target)) target = Nearest(transform.position, bounceRange);
        if (target == null) return;

        // 🔑 곡선으로 휘어 들어가지 않는다. 매 순간 표적을 **곧장** 본다.
        //    튕길 때도 다음 표적 쪽으로 그 자리에서 꺾여 직선으로 간다.
        Vector2 dir = ((Vector2)target.position - rb.position).normalized;
        rb.linearVelocity = dir * speed;
        rb.rotation = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;   // 그림은 오른쪽을 향해 그려져 있다
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (spent || !other.CompareTag("Enemy")) return;
        if (hit.Contains(other.transform)) return;          // 튕겨 나오며 같은 놈을 또 긁지 않게

        if (blastRadius > 0f)
        {
            // 터질 때는 맞은 놈 하나가 아니라 반경 안을 전부 때린다
            Area.Hit(transform.position, blastRadius, damage);
            Area.SpawnFx(blastFx, transform.position, blastRadius);
        }
        else if (other.TryGetComponent(out IDamageable t))
        {
            t.TakeDamage(damage);
        }
        hit.Add(other.transform);

        // 튕길 힘이 남았으면 아직 안 맞은 가까운 적에게 간다
        if (bouncesLeft > 0)
        {
            Transform next = Nearest(transform.position, bounceRange);
            if (next != null)
            {
                bouncesLeft--;
                target = next;
                return;
            }
        }

        spent = true;
        Destroy(gameObject);
    }

    private static bool Alive(Transform t)
    {
        if (t == null || !t.gameObject.activeInHierarchy) return false;
        return !t.TryGetComponent(out Enemy e) || e.IsAlive;
    }

    // 아직 안 맞은 살아 있는 적 가운데 가장 가까운 놈
    private Transform Nearest(Vector2 from, float range)
    {
        Transform best = null;
        float bestD = range * range;
        foreach (Enemy e in FindObjectsByType<Enemy>(FindObjectsSortMode.None))
        {
            if (!e.gameObject.activeInHierarchy || !e.IsAlive || hit.Contains(e.transform)) continue;
            float d = ((Vector2)e.transform.position - from).sqrMagnitude;
            if (d < bestD) { bestD = d; best = e.transform; }
        }
        return best;
    }
}
