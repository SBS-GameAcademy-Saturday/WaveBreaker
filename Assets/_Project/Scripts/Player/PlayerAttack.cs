using UnityEngine;

// 075회차 · 드디어 때린다. IDamageable 이 일하는 날.
//
// 🔑 때리는 쪽은 상대가 뭔지 모른다. IDamageable 만 보고 때린다.
//    070에서 만든 그 인터페이스가 여기서 값을 한다.
public class PlayerAttack : MonoBehaviour
{
    [SerializeField] private float attackRadius = 3f;
    [SerializeField] private int damage = 4;
    [SerializeField] private float cooldown = 0.4f;

    private float nextAttackTime;

    private void Update()
    {
        if (!Input.GetKey(KeyCode.Space)) return;

        // 🚨 쿨다운이 없으면 매 프레임 때린다. 초당 300번이다.
        if (Time.time < nextAttackTime) return;

        nextAttackTime = Time.time + cooldown;
        Swing();
    }

    public void Swing()
    {
        Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, attackRadius);

        int count = 0;

        foreach (Collider2D hit in hits)
        {
            // 🚨 내 몸도 목록에 들어온다. 안 걸러내면 내가 나를 때린다.
            if (hit.gameObject == gameObject) continue;

            if (hit.TryGetComponent(out IDamageable target))
            {
                target.TakeDamage(damage);
                count++;
            }
        }

        Debug.Log($"휘두르기 — {count}마리 명중");
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, attackRadius);
    }
}
