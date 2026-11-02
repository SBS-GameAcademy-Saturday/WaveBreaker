using UnityEngine;

// 범위 공격 도우미. 번개·화염구 폭발이 같이 쓴다.
public static class Area
{
    private static readonly Collider2D[] hits = new Collider2D[64];

    // 반경 안의 적을 모두 때린다. 한 적에 콜라이더가 여럿이어도 한 번만.
    public static int Hit(Vector2 center, float radius, int damage)
    {
        int n = Physics2D.OverlapCircleNonAlloc(center, radius, hits);
        int count = 0;
        for (int i = 0; i < n; i++)
        {
            if (!hits[i].CompareTag("Enemy")) continue;
            if (!hits[i].TryGetComponent(out IDamageable t)) continue;
            t.TakeDamage(damage);
            count++;
        }
        return count;
    }

    // 🔑 그림 크기를 **실제 피해 범위에 맞춘다.** 그림만 크고 피해가 작으면
    //    맞은 것 같은데 안 죽는 적이 생긴다.
    public static void SpawnFx(GameObject prefab, Vector2 at, float radius)
    {
        if (prefab == null) return;
        GameObject go = Object.Instantiate(prefab, at, Quaternion.identity);

        var sr = go.GetComponent<SpriteRenderer>();
        if (sr != null && sr.sprite != null)
        {
            float unit = Mathf.Max(0.01f, sr.sprite.bounds.size.x);
            go.transform.localScale = Vector3.one * (radius * 2f / unit);
        }
    }
}
