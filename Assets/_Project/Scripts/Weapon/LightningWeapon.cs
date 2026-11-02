using System.Collections.Generic;
using UnityEngine;

// 번개 — 화면에 보이는 적 몇 곳에 **하늘에서** 떨어진다.
//
// 🔑 총은 가까운 적부터 노리지만 번개는 **아무 데나** 떨어진다.
//    가까운 적만 치면 몸 주변이 이미 정리돼 있어 번개다운 맛이 없다.
//    range 는 사거리가 아니라 **떨어진 자리의 폭발 반경**이다.
public class LightningWeapon : Weapon
{
    private readonly List<Transform> pool = new List<Transform>();

    protected override void Tick()
    {
        if (Time.time < nextFire) return;

        pool.Clear();
        pool.AddRange(VisibleEnemies());
        if (pool.Count == 0) return;

        nextFire = Time.time + Stat.interval;

        // 겹치지 않게 뽑는다. 적이 번개 수보다 적으면 있는 만큼만.
        int strikes = Mathf.Min(Stat.count, pool.Count);
        for (int i = 0; i < strikes; i++)
        {
            int pick = Random.Range(i, pool.Count);
            (pool[i], pool[pick]) = (pool[pick], pool[i]);
            Strike(pool[i].position);
        }
    }

    private void Strike(Vector2 at)
    {
        // 번개 줄기 — 그림의 발끝이 맞는 자리에 오도록 pivot 을 아래에 둔다.
        if (data.projectilePrefab != null)
            Instantiate(data.projectilePrefab, at, Quaternion.identity);

        Area.Hit(at, Stat.range, Stat.damage);
        Area.SpawnFx(data.hitFxPrefab, at, Stat.range);
    }
}
