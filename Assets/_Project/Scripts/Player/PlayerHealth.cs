using UnityEngine;

// 070회차 · 플레이어는 Enemy 를 상속하지 않는다. 그래도 IDamageable 이라 같은 방식으로 맞는다.
// 080회차 · 무적시간과 사망 처리가 붙었다.
public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;
    [SerializeField] private float invincibleTime = 0.6f;
    [SerializeField] private SpriteRenderer sprite;

    public int Current => currentHealth;
    public int Max => maxHealth;
    public bool IsInvincible => Time.time < invincibleUntil;

    private int currentHealth;
    private float invincibleUntil;

    private void Start()
    {
        currentHealth = maxHealth;
    }

    private void Update()
    {
        // 무적 동안 반투명하게. 맞았다는 걸 눈으로 알려주는 게 숫자보다 빠르다.
        if (sprite == null) return;

        sprite.color = IsInvincible ? new Color(1f, 1f, 1f, 0.35f) : Color.white;
    }

    public void TakeDamage(int amount)
    {
        if (IsInvincible) return;
        if (currentHealth <= 0) return;

        invincibleUntil = Time.time + invincibleTime;

        currentHealth = Mathf.Max(currentHealth - amount, 0);
        Debug.Log($"플레이어 : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth == 0)
        {
            Die();
        }
    }

    private void Die()
    {
        Debug.Log("플레이어 사망");

        if (GameManager.Instance != null)
        {
            GameManager.Instance.ChangeState(GameState.GameOver);
        }
    }
}
