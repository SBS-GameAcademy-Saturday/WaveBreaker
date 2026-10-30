using System.Collections;
using UnityEngine;

// 보스. **행동이 다르다** — 그래서 클래스를 나눈다.
//
// 🔑 숫자가 다르면 데이터, 행동이 다르면 클래스. 그 기준의 예시다.
//    잡졸은 쫓아가 몸으로 부딪칠 뿐이지만, 보스는 멈춰 서서 휘두른다.
public class BossEnemy : Enemy
{
    [Header("보스 공격")]
    [SerializeField] private BossHitbox hitbox;
    [SerializeField] private float attackRange = 2.4f;
    [SerializeField] private float attackCooldown = 2.2f;
    [SerializeField] private float windup = 0.25f;        // 모션 시작 → 맞는 순간
    [SerializeField] private float hitDuration = 0.2f;    // 때리는 범위가 열려 있는 시간
    [SerializeField] private float hitOffset = 1.1f;      // 보스 앞쪽으로 얼마나
    [SerializeField] private int attackDamage = 0;        // 0 이면 접촉 피해의 2배

    private float nextAttack;
    private bool swinging;

    public bool Swinging => swinging;

    protected override void Start()
    {
        base.Start();
        Debug.Log($"보스 등장 — {(data != null ? data.title : name)}");
    }

    protected override void Move()
    {
        // 휘두르는 중에는 제자리에 선다. 때리면서 미끄러지면 어색하다.
        if (swinging)
        {
            rb.linearVelocity = Vector2.zero;
            return;
        }

        if (player != null && Time.time >= nextAttack
            && Vector2.Distance(transform.position, player.position) <= attackRange)
        {
            StartCoroutine(Swing());
            return;
        }

        base.Move();
    }

    private IEnumerator Swing()
    {
        swinging = true;
        nextAttack = Time.time + attackCooldown;
        rb.linearVelocity = Vector2.zero;

        if (anim != null) anim.SetTrigger("Attack");

        // 🔑 그림이 팔을 휘두르는 **그 순간**에만 범위를 연다.
        //    모션 내내 열어 두면 스쳐도 맞아서, 피할 방법이 없어진다.
        yield return new WaitForSeconds(windup);

        if (hitbox != null)
        {
            int dmg = attackDamage > 0 ? attackDamage : contactDamage * 2;
            float dir = sprite != null && sprite.flipX ? -1f : 1f;
            hitbox.Open(dmg, new Vector2(hitOffset * dir, 0f));
            Debug.Log($"보스 공격 — {data.title} 가 {dmg} 피해 범위를 열었다");
        }

        yield return new WaitForSeconds(hitDuration);
        if (hitbox != null) hitbox.Close();

        swinging = false;
    }

    protected override void Die()
    {
        if (hitbox != null) hitbox.Close();
        base.Die();
    }
}
