using UnityEngine;

// 070회차 · 첫 자식. 부딪히면 세게 때린다.
public class ChargerEnemy : Enemy
{
    [SerializeField] private int chargeDamage = 3;

    protected override void Start()
    {
        base.Start();   // 🚨 이 줄을 빼면 부모의 체력 설정이 날아간다
        Debug.Log($"{name} : 돌진형 등장 (체력 {maxHealth})");
    }

    public override void Attack(IDamageable target)
    {
        target.TakeDamage(chargeDamage);
        Debug.Log($"{name} : 돌진! {chargeDamage} 피해");
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        // 상대가 뭔지 모른다. IDamageable 이 있으면 때린다.
        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            Attack(target);
        }
    }
}
