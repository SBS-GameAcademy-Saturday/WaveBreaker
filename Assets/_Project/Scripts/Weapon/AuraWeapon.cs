using UnityEngine;

// 장판 — 주위 전부를 일정 간격으로 때린다.
public class AuraWeapon : Weapon
{
    private SpriteRenderer field;
    private SpriteRenderer fill;

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

            if (data.bodyAnimator != null)
            {
                var ac = go.AddComponent<Animator>();
                ac.runtimeAnimatorController = data.bodyAnimator;
                // 🚨 레벨업 창이 뜨면 timeScale 이 0 이 된다. 그때도 장판은 돌아야 한다.
                ac.updateMode = AnimatorUpdateMode.UnscaledTime;
                ac.cullingMode = AnimatorCullingMode.AlwaysAnimate;
            }
        }
        // 고리 안쪽을 옅게 채운다. 고리와 달리 돌지도 깜빡이지도 않는다.
        if (fill == null && data.bodyFillSprite != null)
        {
            var fo = new GameObject("Fill");
            fo.transform.SetParent(transform, false);
            fill = fo.AddComponent<SpriteRenderer>();
            fill.sprite = data.bodyFillSprite;
            fill.color = new Color(1f, 0.86f, 0.45f, 0.17f);
            fill.sortingOrder = -2;          // 고리보다 뒤
        }

        if (fill != null && fill.sprite != null)
        {
            // 🚨 고리 **안쪽**에 들어가야 한다. 같은 지름으로 깔면 고리를 덮는다.
            float u = Mathf.Max(0.01f, fill.sprite.bounds.size.x);
            fill.transform.localScale = Vector3.one * (Stat.range * 2f * 0.88f / u);
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
