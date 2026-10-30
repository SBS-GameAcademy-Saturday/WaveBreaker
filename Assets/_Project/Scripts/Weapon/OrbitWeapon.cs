using UnityEngine;

// 회전 칼 — 몸 주위를 돈다. 닿으면 피해.
public class OrbitWeapon : Weapon
{
    private Transform ring;

    protected override void OnLevelChanged()
    {
        if (ring == null)
        {
            ring = new GameObject("Ring").transform;
            ring.SetParent(transform, false);
        }
        Build();
    }

    protected override void Tick()
    {
        if (ring != null) ring.Rotate(0f, 0f, Stat.speed * Time.deltaTime);
    }

    private void Build()
    {
        // 🚨 SetParent(null) 로 먼저 떼어 낸다. Destroy 는 프레임 끝에 처리돼서
        //    바로 다시 만들면 옛 칼 위에 새 칼이 얹힌다.
        for (int i = ring.childCount - 1; i >= 0; i--)
        {
            Transform old = ring.GetChild(i);
            old.SetParent(null);
            Destroy(old.gameObject);
        }

        if (data.projectilePrefab == null) return;

        for (int i = 0; i < Stat.count; i++)
        {
            float rad = 360f / Stat.count * i * Mathf.Deg2Rad;

            var blade = Instantiate(data.projectilePrefab, ring);
            blade.transform.localPosition =
                new Vector3(Mathf.Cos(rad) * Stat.range, Mathf.Sin(rad) * Stat.range, 0f);

            if (blade.TryGetComponent(out ContactDamage c)) c.Setup(Stat.damage, Stat.interval);
        }
    }
}
