using UnityEngine;

// 090회차 · 보스. Enemy 를 상속한 네 번째 몬스터다.
// 새 코드는 거의 없다 — 수치가 큰 EnemyData 와 "마지막이냐" 표시 하나가 전부다.
public class BossEnemy : Enemy
{
    [SerializeField] private int contactDamage = 8;
    [SerializeField] private bool isFinal;

    protected override void Start()
    {
        base.Start();

        string title = data != null ? data.title : name;
        Debug.Log($"보스 등장 — {title} (체력 {maxHealth})");
    }

    public override void Attack(IDamageable target)
    {
        target.TakeDamage(contactDamage);
    }

    private void OnCollisionStay2D(Collision2D collision)
    {
        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            Attack(target);
        }
    }

    protected override void Die()
    {
        string title = data != null ? data.title : name;
        Debug.Log($"보스 처치! — {title}");

        base.Die();   // 처치 수 · 젬 드롭 · 제거는 부모가 한다

        if (isFinal && GameManager.Instance != null)
        {
            GameManager.Instance.ChangeState(GameState.Clear);
        }
    }
}
