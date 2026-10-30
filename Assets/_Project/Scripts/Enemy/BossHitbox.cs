using UnityEngine;

// 보스가 **휘두르는 순간에만** 켜지는 타격 범위.
//
// 🔑 몸에 닿는 피해(ContactDamage)와 다른 것이다. 저쪽은 "붙어 있으면 아픈"
//    것이고, 이쪽은 "때리는 동작에 맞으면 아픈" 것이다. 피하면 안 맞는다.
[RequireComponent(typeof(Collider2D))]
public class BossHitbox : MonoBehaviour
{
    private Collider2D col;
    private int damage;

    private void Awake()
    {
        col = GetComponent<Collider2D>();
        col.isTrigger = true;
        col.enabled = false;          // 평소에는 꺼 둔다
    }

    public void Open(int dmg, Vector2 offset)
    {
        damage = dmg;
        transform.localPosition = offset;
        col.enabled = true;
    }

    public void Close() => col.enabled = false;

    // 🚨 Enter 만 쓰면 **켜는 순간 이미 안에 있던** 플레이어를 놓친다.
    //    Stay 로 받아도 PlayerHealth 의 무적 시간이 연타를 막아 준다.
    private void OnTriggerStay2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;
        if (other.TryGetComponent(out IDamageable t)) t.TakeDamage(damage);
    }
}
