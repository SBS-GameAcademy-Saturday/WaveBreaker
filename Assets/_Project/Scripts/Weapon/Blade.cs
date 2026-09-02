using UnityEngine;

// 076회차 · 회전하는 칼 한 자루. 닿아 있는 동안 일정 간격으로 피해를 준다.
//
// 왜 OnTriggerEnter2D 가 아니라 Stay 인가
//   Enter 는 "닿는 순간 한 번" 이다 (044). 칼 궤도 안에 적이 갇히면 한 대만 맞고 만다.
//   Stay 는 닿아 있는 동안 계속 불린다. 그래서 쿨다운으로 간격을 만든다 (075의 Time.time).
public class Blade : MonoBehaviour
{
    [SerializeField] private int damage = 3;
    [SerializeField] private float hitInterval = 0.3f;

    private float nextHitTime;

    private void OnTriggerStay2D(Collider2D other)
    {
        if (Time.time < nextHitTime) return;
        if (!other.CompareTag("Enemy")) return;
        if (!other.TryGetComponent(out IDamageable target)) return;

        nextHitTime = Time.time + hitInterval;
        target.TakeDamage(damage);
    }
}
