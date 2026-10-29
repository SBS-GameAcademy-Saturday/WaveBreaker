using UnityEngine;

// 070회차 · 플레이어도 IDamageable 이다.
//
// 🔑 몬스터와 **같은 인터페이스**를 단다. 그래서 ChargerEnemy 는
//    자기가 때리는 게 플레이어인지 다른 몬스터인지 신경 쓰지 않는다.
public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;

    private int currentHealth;

    void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth = Mathf.Max(currentHealth - amount, 0);
        Debug.Log($"플레이어 : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth == 0)
        {
            Debug.Log("플레이어 사망");
        }
    }
}
