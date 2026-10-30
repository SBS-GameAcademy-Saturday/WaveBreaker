using UnityEngine;

// 플레이어 체력. 몬스터와 **같은 인터페이스**를 단다.
public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;
    [SerializeField] private float invincible = 0.5f;

    private int currentHealth;
    private float nextHit;
    private Flicker flicker;

    public int Max => maxHealth;
    public int Current => currentHealth;
    public float Ratio => maxHealth > 0 ? (float)currentHealth / maxHealth : 0f;

    void Awake() => flicker = GetComponent<Flicker>();

    void Start() => currentHealth = maxHealth;

    // 레벨업 보상으로 최대 체력이 오르면 그만큼 회복도 된다.
    public void AddMax(int amount)
    {
        maxHealth += amount;
        currentHealth = Mathf.Min(currentHealth + amount, maxHealth);
    }

    public void TakeDamage(int amount)
    {
        // 🚨 무적 시간이 없으면 몬스터 떼에 닿는 순간 한 프레임에 다 죽는다.
        if (Time.time < nextHit) return;
        if (currentHealth <= 0) return;

        nextHit = Time.time + invincible;
        currentHealth = Mathf.Max(currentHealth - amount, 0);

        if (flicker != null) flicker.Play();

        if (currentHealth == 0 && GameManager.Instance != null)
        {
            GameManager.Instance.ChangeState(GameState.GameOver);
        }
    }
}
