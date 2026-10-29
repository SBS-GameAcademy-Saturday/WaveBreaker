using UnityEngine;

// 070회차 · 6주차 콘솔의 Enemy 를 유니티로 옮긴 것. 상속 구조는 그대로다.
//
// 🔑 abstract 라서 이 자체로는 씬에 못 붙인다. 반드시 자식을 만들어야 한다.
//    "몬스터 일반" 이라는 건 세상에 없다. 돌진형이거나 추격형이거나 탱커다.
public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;

    protected int currentHealth;

    // 🚨 virtual 을 안 붙이면 자식이 Start 를 쓰는 순간 이쪽이 안 불린다.
    //    체력이 0 인 채로 태어난다.
    protected virtual void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        Debug.Log($"{name} : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    protected virtual void Die()
    {
        Debug.Log($"{name} 사망");
        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
