using UnityEngine;

// 072회차 · 탱커. 느리지만 받는 피해를 깎는다.
//
// 🔑 이번엔 TakeDamage 를 덮어쓴다. Move() 는 건드리지 않는다 —
//    부모처럼 플레이어를 쫓아간다. **바꿀 것만 바꾼다.**
public class TankEnemy : Enemy
{
    [SerializeField, Range(0f, 0.9f)] private float damageReduction = 0.5f;

    protected override void Start()
    {
        base.Start();
        Debug.Log($"{name} : 탱커 등장 (체력 {maxHealth}, 피해 감소 {damageReduction:P0})");
    }

    public override void TakeDamage(int amount)
    {
        // 🚨 최소 1 을 보장한다. 안 그러면 감소율이 높을 때 영원히 안 죽는다.
        int reduced = Mathf.Max(Mathf.RoundToInt(amount * (1f - damageReduction)), 1);

        Debug.Log($"{name} : 단단하다!  {amount} → {reduced}");

        base.TakeDamage(reduced);   // 깎은 값으로 부모에게 넘긴다
    }
}
