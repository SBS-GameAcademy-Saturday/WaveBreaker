using UnityEngine;

// 닿아 있는 동안 일정 간격으로 때린다. 회전 칼이 쓴다.
//
// 🔑 Enter 가 아니라 Stay 다. 칼 궤도 안에 적이 갇히면 Enter 는 한 번뿐이다.
public class ContactDamage : MonoBehaviour
{
    private int damage = 3;
    private float interval = 0.3f;
    private float nextHit;

    public void Setup(int dmg, float gap)
    {
        damage = dmg;
        interval = gap;
    }

    private void OnTriggerStay2D(Collider2D other)
    {
        if (Time.time < nextHit) return;
        if (!other.CompareTag("Enemy")) return;
        if (!other.TryGetComponent(out IDamageable t)) return;

        nextHit = Time.time + interval;
        t.TakeDamage(damage);
    }
}
