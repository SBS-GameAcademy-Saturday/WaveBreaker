using UnityEngine;

// 075회차 · 임시 근접 공격. Space 를 누르면 주변에 있는 "맞을 수 있는 것" 전부를 때린다.
// 076회차부터 진짜 무기(회전 칼 · 자동 발사)로 바뀐다. 지금은 IDamageable 을 써보는 게 목적이다.
public class PlayerAttack : MonoBehaviour
{
    [SerializeField] private float attackRadius = 3f;
    [SerializeField] private int damage = 4;
    [SerializeField] private float cooldown = 0.4f;

    private float nextAttackTime;

    private void Update()
    {
        if (!Input.GetKey(KeyCode.Space)) return;
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
            // 내 몸도 목록에 들어온다. 안 걸러내면 내가 나를 때린다.
            if (hit.gameObject == gameObject) continue;

            if (hit.TryGetComponent(out IDamageable target))
            {
                target.TakeDamage(damage);
                count++;
            }
        }

        Debug.Log($"휘두르기 — {count}마리 명중");
    }

    // Scene 뷰에서 공격 범위를 눈으로 본다.
    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, attackRadius);
    }
}
