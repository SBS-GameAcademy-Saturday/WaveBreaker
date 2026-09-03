using UnityEngine;

// 070회차 · Enemy 를 상속한 첫 몬스터. 돌진형.
// 부딪힌 상대가 IDamageable 이기만 하면 때린다. 상대가 플레이어인지 상자인지는 모른다.
// 080회차 · Enter → Stay 로 바꿨다. 닿아 있는 동안 계속 때리고, 간격은 플레이어의 무적시간이 만든다.
public class ChargerEnemy : Enemy
{
    [SerializeField] private int chargeDamage = 3;

    protected override void OnEnable()
    {
        base.OnEnable();   // 이걸 빼면 체력이 0 인 채로 시작한다.
        Debug.Log($"{name} : 돌진형 등장 (체력 {maxHealth})");
    }

    public override void Attack(IDamageable target)
    {
        target.TakeDamage(chargeDamage);
    }

    private void OnCollisionStay2D(Collision2D collision)
    {
        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            Attack(target);
        }
    }
}
