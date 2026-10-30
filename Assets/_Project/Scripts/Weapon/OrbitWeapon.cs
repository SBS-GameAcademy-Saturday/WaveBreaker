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
            float deg = 360f / Stat.count * i;
            float rad = deg * Mathf.Deg2Rad;

            var blade = Instantiate(data.projectilePrefab, ring);
            blade.transform.localPosition =
                new Vector3(Mathf.Cos(rad) * Stat.range, Mathf.Sin(rad) * Stat.range, 0f);

            // 🚨 회전을 안 주면 칼끝이 전부 같은 쪽을 본다.
            //    왼쪽 칼이 **플레이어를 향해** 꽂혀 있는 모양이 된다.
            //    바깥을 보게 배치 각도만큼 돌린다. (스프라이트가 +x 를 향한다)
            blade.transform.localRotation = Quaternion.Euler(0f, 0f, deg);

            if (blade.TryGetComponent(out ContactDamage c)) c.Setup(Stat.damage, Stat.interval);
        }
    }
}
