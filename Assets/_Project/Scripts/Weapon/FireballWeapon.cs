using System.Collections.Generic;
using UnityEngine;

// 화염구 — 쏘는 **순간의** 방향으로 날아가 맞으면 터진다.
//
// 🔑 유도하지 않는다. 쏜 뒤 적이 비켜 서면 빗나간다. 그게 총과 다른 맛이다.
//    여러 발이면 총처럼 서로 다른 적을 하나씩 맡는다.
//    range 는 사거리가 아니라 **터지는 반경**이다. 노리는 건 화면 안 전부다.
public class FireballWeapon : Weapon
{
    private readonly List<Transform> targets = new List<Transform>();

    protected override void Tick()
    {
        if (Time.time < nextFire) return;

        targets.Clear();
        targets.AddRange(VisibleEnemies());
        if (targets.Count == 0) return;

        nextFire = Time.time + Stat.interval;

        for (int i = 0; i < Stat.count; i++)
        {
            Transform t = targets[i % targets.Count];
            Vector2 dir = ((Vector2)t.position - (Vector2)transform.position).normalized;

            // 적보다 많이 쏘면 남는 화염구는 같은 적에게 조금 비껴 간다.
            int again = i / targets.Count;
            if (again > 0)
                dir = Quaternion.Euler(0f, 0f, 12f * again * (i % 2 == 0 ? 1f : -1f)) * dir;

            Launch(dir);
        }
    }

    private void Launch(Vector2 dir)
    {
        if (data.projectilePrefab == null) return;

        // 그림이 오른쪽을 향해 그려져 있다 (총알과 같다)
        float ang = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
        var go = Instantiate(data.projectilePrefab, transform.position, Quaternion.Euler(0f, 0f, ang));
        if (go.TryGetComponent(out Projectile p))
            p.Setup(Stat.damage, dir, Stat.speed, Stat.range, data.hitFxPrefab);
    }
}
