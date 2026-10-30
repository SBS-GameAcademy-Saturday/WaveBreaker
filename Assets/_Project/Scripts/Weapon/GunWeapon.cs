using System.Collections.Generic;
using UnityEngine;

// 자동 총 — 탄이 늘면 **서로 다른 적**을 하나씩 맡는다.
//
// 🔑 탄 수만큼 같은 적에게 몰아 쏘면, 이미 죽은 적에게 남은 탄이 낭비된다.
//    탄이 늘어난 보람을 느끼려면 한 발씩 다른 적을 맡아야 한다.
public class GunWeapon : Weapon
{
    private readonly List<Transform> targets = new List<Transform>();

    protected override void Tick()
    {
        if (Time.time < nextFire) return;

        CollectTargets();
        if (targets.Count == 0) return;

        nextFire = Time.time + Stat.interval;

        for (int i = 0; i < Stat.count; i++)
        {
            Transform t = targets[i % targets.Count];
            Vector2 dir = ((Vector2)t.position - (Vector2)transform.position).normalized;

            // 적보다 탄이 많으면 남는 탄은 같은 적을 다시 맡는다.
            // 겹쳐 날아가면 한 발처럼 보이니 조금씩 비껴 쏜다.
            int again = i / targets.Count;
            if (again > 0)
            {
                float off = 9f * again * (i % 2 == 0 ? 1f : -1f);
                dir = Quaternion.Euler(0f, 0f, off) * dir;
            }

            Fire(dir);
        }
    }

    // 🔑 화면 밖 적은 고르지 않는다. 보이지도 않는 쪽으로 총알이 날아가면
    //    플레이어는 총이 헛방을 쏜다고 느낀다.
    private void CollectTargets()
    {
        targets.Clear();

        Camera cam = Camera.main;
        Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, Stat.range);

        foreach (Collider2D h in hits)
        {
            if (!h.CompareTag("Enemy")) continue;

            if (cam != null)
            {
                Vector3 v = cam.WorldToViewportPoint(h.transform.position);
                if (v.z < 0f || v.x < 0f || v.x > 1f || v.y < 0f || v.y > 1f) continue;
            }

            targets.Add(h.transform);
        }

        // 가까운 쪽부터 맡는다
        Vector2 me = transform.position;
        targets.Sort((a, b) =>
            ((Vector2)a.position - me).sqrMagnitude.CompareTo(((Vector2)b.position - me).sqrMagnitude));
    }

    private void Fire(Vector2 dir)
    {
        // 🚨 화살 그림은 오른쪽을 향해 그려져 있다.
        //    위쪽 기준으로 돌리면 날아가는 방향과 90도 어긋난다.
        float ang = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;

        var go = Instantiate(data.projectilePrefab, transform.position, Quaternion.Euler(0f, 0f, ang));
        if (go.TryGetComponent(out Projectile p)) p.Setup(Stat.damage, dir, Stat.speed);
    }
}
