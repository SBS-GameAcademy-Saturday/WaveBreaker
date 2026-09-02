using UnityEngine;

// 070회차 · 플레이어는 Enemy 를 상속하지 않는다. 그래도 IDamageable 이라 같은 방식으로 맞는다.
// 인터페이스를 쓰는 이유가 이 한 줄에 다 있다.
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
