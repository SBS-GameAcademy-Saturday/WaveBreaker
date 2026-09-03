using UnityEngine;

// 072회차 · 탱커. 느리고 단단하다. 받는 피해를 절반으로 줄인다.
// Enemy 세 종류 중 TakeDamage() 를 바꾼 쪽이다.
public class TankEnemy : Enemy
{
    [SerializeField, Range(0f, 0.9f)] private float damageReduction = 0.5f;

    protected override void OnEnable()
    {
        base.OnEnable();
        Debug.Log($"{name} : 탱커 등장 (체력 {maxHealth}, 피해 감소 {damageReduction:P0})");
    }

    public override void TakeDamage(int amount)
    {
        // 아무리 단단해도 최소 1 은 들어간다. 안 그러면 절대 안 죽는다.
        int reduced = Mathf.Max(Mathf.RoundToInt(amount * (1f - damageReduction)), 1);

        Debug.Log($"{name} : 단단하다!  {amount} → {reduced}");

        base.TakeDamage(reduced);   // 나머지 처리는 부모에게 맡긴다
    }
}
