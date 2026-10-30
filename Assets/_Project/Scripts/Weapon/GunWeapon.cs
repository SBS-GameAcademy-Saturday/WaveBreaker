using UnityEngine;

// 자동 총 — 가장 가까운 적에게 쏜다.
public class GunWeapon : Weapon
{
    protected override void Tick()
    {
        if (Time.time < nextFire) return;

        Transform target = Nearest(Stat.range);
        if (target == null) return;

        nextFire = Time.time + Stat.interval;

        Vector2 dir = ((Vector2)target.position - (Vector2)transform.position).normalized;

        // count 만큼 부채꼴로 뿌린다
        float spread = 12f;
        float start = -spread * (Stat.count - 1) / 2f;

        for (int i = 0; i < Stat.count; i++)
        {
            Vector2 d = Quaternion.Euler(0f, 0f, start + spread * i) * dir;
            var go = Instantiate(data.projectilePrefab, transform.position,
                                 Quaternion.FromToRotation(Vector3.up, d));
            if (go.TryGetComponent(out Projectile p)) p.Setup(Stat.damage, d, Stat.speed);
        }
    }
}
