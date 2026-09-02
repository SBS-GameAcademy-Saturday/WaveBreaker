using System.Collections;
using UnityEngine;

// 078·079회차 · 가장 가까운 적을 스스로 찾아 쏜다.
// 064회차 AutoShooter 와 같은 일을 하지만, 씬 전체를 뒤지지 않고 사거리 안만 본다.
//
// 086회차 · 피해·관통도 업그레이드된다.
// 088회차 · 시작 수치를 WeaponData(SO)에서 읽는다.
public class AutoGun : MonoBehaviour
{
    [SerializeField] private WeaponData data;
    [SerializeField] private GameObject projectilePrefab;

    private float range = 8f;
    private float fireInterval = 0.5f;
    private int damage = 3;
    private int pierce = 2;

    public Transform CurrentTarget { get; private set; }
    public float FireInterval => fireInterval;
    public int Damage => damage;
    public int Pierce => pierce;

    private void Start()
    {
        if (data != null)
        {
            range = data.gunRange;
            fireInterval = data.gunFireInterval;
            damage = data.gunDamage;
            pierce = data.gunPierce;
        }

        StartCoroutine(FireRoutine());
    }

    private IEnumerator FireRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(fireInterval);

            CurrentTarget = FindNearest();

            // 사거리 안에 아무도 없으면 아낀다.
            if (CurrentTarget == null) continue;

            Vector2 dir = ((Vector2)CurrentTarget.position - (Vector2)transform.position).normalized;

            GameObject shot = Instantiate(projectilePrefab, transform.position, Quaternion.identity);
            shot.transform.up = dir;   // 방향 벡터를 넣으면 유니티가 회전을 만들어 준다 (064)

            if (shot.TryGetComponent(out Projectile p))
            {
                p.Setup(damage, pierce);
            }
        }
    }

    // ---- 086회차 · 업그레이드 ----
    public void SpeedUp(float step, float min)
    {
        fireInterval = Mathf.Max(fireInterval - step, min);
        Debug.Log($"연사 상승 — 발사 간격 {fireInterval:F2}초");
    }

    public void AddDamage(int step)
    {
        damage += step;
        Debug.Log($"총알 피해 상승 — {damage}");
    }

    public void AddPierce(int step)
    {
        pierce += step;
        Debug.Log($"관통 상승 — {pierce}마리");
    }

    // 4주차 "배열에서 최솟값 찾기" 와 같은 구조다. 비교 대상이 숫자가 아니라 거리일 뿐이다.
    private Transform FindNearest()
    {
        Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, range);

        float minDistance = float.MaxValue;
        Transform nearest = null;

        foreach (Collider2D hit in hits)
        {
            if (!hit.CompareTag("Enemy")) continue;

            float distance = Vector2.Distance(transform.position, hit.transform.position);

            if (distance < minDistance)
            {
                minDistance = distance;
                nearest = hit.transform;
            }
        }

        return nearest;
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.cyan;
        Gizmos.DrawWireSphere(transform.position, range);

        if (CurrentTarget != null)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawLine(transform.position, CurrentTarget.position);
        }
    }
}
