using System.Collections;
using UnityEngine;

// 132회차 · 검기. **시작 무기**다.
//
// 🔑 "칼을 휘두르는 그림" 과 "검기가 날아가는 것" 은 **한 무기**다.
//    그래서 Attack 애니메이션을 켜는 것도 여기다. 총이 켜면 칼을 안 들었는데 휘두른다.
//
// 🔑 방향은 **바라보는 쪽(왼쪽 아니면 오른쪽)** 이다. 몬스터를 쫓아가지 않는다.
//    조준을 하면 플레이어가 아무 데도 안 보고 있는데 검기만 돌아간다 — 그림과 판정이 어긋난다.
//    "내가 보는 쪽을 벤다" 가 규칙이라 플레이어가 몸을 돌려서 조준한다.
//
// 판정은 **고정된 네모**다 (부채꼴이 아니다).
//   앞쪽으로 width 만큼, 위아래로 height 만큼. 어디를 봐도 넓이가 같다.
public class SwordSlash : MonoBehaviour
{
    [SerializeField] private GameObject slashEffect;
    [SerializeField] private SpriteRenderer bodySprite;      // 뒤집힘(flipX)을 보고 방향을 정한다
    [SerializeField] private float width = 2.4f;             // 앞으로 뻗는 길이 (초승달의 가로)
    [SerializeField] private float height = 2.8f;            // 위아래 폭 (초승달은 세로로 길다)
    [SerializeField] private float interval = 1.2f;
    [SerializeField] private int damage = 6;

    public bool Owned { get; private set; }
    public int Damage => damage;
    public float Interval => interval;
    public Vector2 Facing => (bodySprite != null && bodySprite.flipX) ? Vector2.left : Vector2.right;

    private Animator anim;

    private void Start()
    {
        anim = GetComponentInParent<Animator>();
        if (bodySprite == null) bodySprite = GetComponent<SpriteRenderer>();

        // 🔑 시작 무기는 이것 하나다. 나머지(총·회전 칼)는 레벨업으로 얻는다.
        Acquire();
    }

    public void Acquire()
    {
        if (Owned) return;
        Owned = true;
        StartCoroutine(SwingRoutine());
        Debug.Log($"검기 시작 — {width}x{height} 네모, {interval:F2}초마다");
    }

    public void AddDamage(int step)
    {
        damage += step;
        Debug.Log($"검기 피해 상승 — {damage}");
    }

    public void SpeedUp(float step, float min)
    {
        interval = Mathf.Max(interval - step, Mathf.Max(min, 0.2f));
        Debug.Log($"검기 속도 상승 — {interval:F2}초마다");
    }

    private IEnumerator SwingRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(interval);

            // 적이 있든 없든 휘두른다. 보는 쪽을 베는 무기라 조준할 게 없다.
            Swing(Facing);
        }
    }

    // 판정 네모의 한가운데. 몸에서 앞으로 절반만큼 나간 자리다.
    public Vector2 AreaCenter(Vector2 dir) => (Vector2)transform.position + dir * (width * 0.5f);

    public void Swing(Vector2 dir)
    {
        // ── 사람이 칼을 휘두르는 그림
        if (anim != null) anim.SetTrigger("Attack");

        // ── 검기 그림. 왼쪽을 보면 그림도 뒤집는다.
        if (slashEffect != null)
        {
            GameObject fx = PoolManager.Spawn(slashEffect, AreaCenter(dir), Quaternion.identity);

            if (fx != null && fx.TryGetComponent(out SpriteRenderer sr)) sr.flipX = dir.x < 0f;
        }

        // ── 판정. 네모 안이면 다 맞는다.
        int hitCount = 0;

        foreach (Collider2D hit in Physics2D.OverlapBoxAll(AreaCenter(dir), new Vector2(width, height), 0f))
        {
            if (!hit.CompareTag("Enemy")) continue;
            if (!hit.TryGetComponent(out IDamageable target)) continue;

            target.TakeDamage(damage);
            hitCount++;
        }

        if (hitCount > 0) Debug.Log($"검기 — {hitCount}마리를 한 번에 벴다");
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = new Color(1f, 1f, 1f, 0.35f);
        Gizmos.DrawWireCube(AreaCenter(Facing), new Vector3(width, height, 0.1f));
    }
}
