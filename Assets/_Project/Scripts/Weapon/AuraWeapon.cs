using UnityEngine;

// 장판 — 주위 전부를 일정 간격으로 때린다.
public class AuraWeapon : Weapon
{
    private SpriteRenderer field;

    protected override void OnLevelChanged()
    {
        if (field == null && data.bodySprite != null)
        {
            var go = new GameObject("Field");
            go.transform.SetParent(transform, false);
            field = go.AddComponent<SpriteRenderer>();
            field.sprite = data.bodySprite;
            field.color = new Color(1f, 0.93f, 0.62f, 0.55f);   // 금빛 반투명
            field.sortingOrder = -1;
        }
        // 🚨 scale 에 range 를 그냥 넣으면 안 된다. range 는 **반지름**이고
        //    스프라이트는 제 나름의 크기를 갖는다. 그려진 원과 실제로 맞는
        //    범위가 어긋나면 플레이어는 거리를 가늠할 수 없다.
        if (field != null && field.sprite != null)
        {
            float unit = Mathf.Max(0.01f, field.sprite.bounds.size.x);   // 스프라이트의 지름
            field.transform.localScale = Vector3.one * (Stat.range * 2f / unit);
        }
    }

    protected override void Tick()
    {
        // 🔑 가만히 있는 원은 그림처럼 보인다. 천천히 돌려야 살아 있는 장판이 된다.
        if (field != null) field.transform.Rotate(0f, 0f, 24f * Time.deltaTime);

        if (Time.time < nextFire) return;
        nextFire = Time.time + Stat.interval;

        foreach (Collider2D h in Physics2D.OverlapCircleAll(transform.position, Stat.range))
        {
            if (!h.CompareTag("Enemy")) continue;
            if (h.TryGetComponent(out IDamageable t)) t.TakeDamage(Stat.damage);
        }
    }
}
