using System.Collections.Generic;
using UnityEngine;

// 유도 화살 — 표적에게 곧장 날아가 맞히고, 가까운 다른 적에게 두 번 더 튕긴다.
//
// 🔑 화염구와 겹치지 않게 성격을 갈랐다.
//    화염구 : 쏜 방향 그대로, 맞으면 크게 터진다 — 한 방이 세다.
//    유도 화살 : 놓치지 않고 여러 놈을 꿰지만 — 한 대는 약하다.
//
// 🔑 화살이 여러 발이면 **서로 다른 적**을 하나씩 맡는다.
public class GunWeapon : Weapon
{
    [SerializeField] private float bounceRange = 6f;   // 다음 적을 찾는 반경

    private readonly List<Transform> targets = new List<Transform>();

    protected override void Tick()
    {
        if (Time.time < nextFire) return;

        targets.Clear();
        targets.AddRange(VisibleEnemies(Stat.range));
        if (targets.Count == 0) return;

        nextFire = Time.time + Stat.interval;

        for (int i = 0; i < Stat.count; i++)
        {
            Transform t = targets[i % targets.Count];
            Vector2 dir = ((Vector2)t.position - (Vector2)transform.position).normalized;

            // 적보다 화살이 많으면 남는 화살은 같은 적을 맡되 조금 비껴 나간다
            int again = i / targets.Count;
            if (again > 0)
                dir = Quaternion.Euler(0f, 0f, 20f * again * (i % 2 == 0 ? 1f : -1f)) * dir;

            Fire(dir, t);
        }
    }

    private void Fire(Vector2 dir, Transform target)
    {
        // 🚨 화살 그림은 오른쪽을 향해 그려져 있다.
        float ang = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;

        var go = Instantiate(data.projectilePrefab, transform.position, Quaternion.Euler(0f, 0f, ang));
        if (!go.TryGetComponent(out Projectile p)) return;

        p.Setup(Stat.damage, dir, Stat.speed, data.blastRadius, data.hitFxPrefab);   // 폭염 화살이면 맞을 때마다 터진다
        p.Homing(target, data.bounces, bounceRange);
    }
}
