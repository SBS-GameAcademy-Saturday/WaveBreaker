using UnityEngine;

// 070회차 · 플레이어는 Enemy 를 상속하지 않는다. 그래도 IDamageable 이라 같은 방식으로 맞는다.
// 080회차 · 무적시간과 사망 처리가 붙었다.
// 086회차 · 최대 체력 업그레이드가 붙었다.
// 099·100회차 · 맞으면 화면이 흔들리고, 아주 잠깐 멈추고, 소리가 난다.
public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;
    [SerializeField] private float invincibleTime = 0.6f;
    [SerializeField] private SpriteRenderer sprite;

    [Header("연출 (099·100회차)")]
    [SerializeField] private CameraFollow cam;
    [SerializeField] private float shakePower = 0.12f;
    [SerializeField] private float shakeTime = 0.15f;
    [SerializeField] private float hitStopTime = 0.06f;
    [SerializeField] private AudioClip hurtSfx;

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

        // 연출은 플레이어가 맞을 때만 크게 준다. 몬스터가 맞을 때마다 화면을 흔들면 못 본다.
        if (cam != null) cam.Shake(shakePower, shakeTime);
        if (GameManager.Instance != null) GameManager.Instance.HitStop(hitStopTime);
        if (AudioManager.Instance != null) AudioManager.Instance.Play(hurtSfx);

        if (currentHealth == 0)
        {
            Die();
        }
    }

    // 086회차 · 최대 체력이 오르면 그만큼 회복도 된다. 안 그러면 체감이 없다.
    public void AddMaxHealth(int step)
    {
        maxHealth += step;
        currentHealth = Mathf.Min(currentHealth + step, maxHealth);

        Debug.Log($"최대 체력 상승 — {currentHealth}/{maxHealth}");
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
