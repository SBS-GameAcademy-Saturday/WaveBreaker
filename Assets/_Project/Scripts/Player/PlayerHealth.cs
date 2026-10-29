using UnityEngine;

// 070회차 · 플레이어도 IDamageable 이다.
// 075회차 · 체력바가 읽을 수 있게 밖으로 연다.
//
// 🔑 몬스터와 **같은 인터페이스**를 단다. 그래서 ChargerEnemy 는
//    자기가 때리는 게 플레이어인지 다른 몬스터인지 신경 쓰지 않는다.
public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;

    private int currentHealth;

    // 🔑 읽기만 열어 둔다. 값을 바꾸는 건 TakeDamage 뿐이다 (067의 MoveInput 과 같은 모양).
    public int Max => maxHealth;
    public int Current => currentHealth;
    public float Ratio => maxHealth > 0 ? (float)currentHealth / maxHealth : 0f;

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
