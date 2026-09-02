using UnityEngine;

// 070회차 · 6주차에 콘솔로 짠 Enemy 를 유니티로 옮긴 것.
// abstract 이므로 이 스크립트 자체는 오브젝트에 붙지 않는다. 자식(ChargerEnemy 등)만 붙는다.
public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;

    protected int currentHealth;

    // private 으로 두면 자식이 override 할 수 없다.
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
