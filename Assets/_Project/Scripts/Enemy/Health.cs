using UnityEngine;

/// <summary>
/// 050회차 — 5~6주차에 콘솔로 만든 Enemy 클래스가 게임에서 돌아간다.
///
///   콘솔                        유니티                        무엇이 바뀌었나
///   class Enemy                 class Health : MonoBehaviour  컴포넌트가 되려고 상속
///   Console.WriteLine           Debug.Log                     찍히는 곳만
///   private int hp              private int currentHealth     그대로
///   public void TakeDamage      public void TakeDamage        그대로
///
/// public / private 을 이유를 갖고 고른다
///   TakeDamage 는 총알이 부른다  → public
///   Die 는 아무도 안 부른다      → private
///
/// 왜 Awake 인가
///   Start 에 넣으면 총알이 첫 프레임에 때렸을 때 체력이 아직 0 일 수 있다.
///   내 값 챙기는 건 Awake, 남을 쓰는 건 Start.
///
/// 🔑 Phase 5 에서 이 클래스가 IDamageable 인터페이스가 된다.
///    "몬스터든 플레이어든 상자든 맞으면 아픈 건 다 같다" 는 이야기를 그때 한다.
/// </summary>
public class Health : MonoBehaviour
{
    // Inspector 에서 몬스터마다 다르게 준다. 프리팹 Override 로 잘 안 죽는 놈을 만들 수 있다.
    [SerializeField] private int maxHealth = 30;

    // 게임 중에 변하는 값이라 Inspector 에 열 이유가 없다.
    private int currentHealth;

    private void Awake()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int damage)
    {
        // Mathf.Clamp(값, 최소, 최대) — 범위 밖으로 못 나가게 자른다.
        // 음수 체력을 남겨두면 Phase 7 체력바가 뒤집힌다.
        currentHealth = Mathf.Clamp(currentHealth - damage, 0, maxHealth);

        Debug.Log(gameObject.name + " 남은 체력: " + currentHealth);

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    private void Die()
    {
        Debug.Log(gameObject.name + " 사망");

        Destroy(gameObject);
    }
}
