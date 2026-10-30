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
            field.color = new Color(1f, 1f, 1f, 0.25f);
            field.sortingOrder = -1;
        }
        if (field != null) field.transform.localScale = Vector3.one * Stat.range;
    }

    protected override void Tick()
    {
        if (Time.time < nextFire) return;
        nextFire = Time.time + Stat.interval;

        foreach (Collider2D h in Physics2D.OverlapCircleAll(transform.position, Stat.range))
        {
            if (!h.CompareTag("Enemy")) continue;
            if (h.TryGetComponent(out IDamageable t)) t.TakeDamage(Stat.damage);
        }
    }
}
