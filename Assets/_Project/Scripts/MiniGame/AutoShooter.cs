using UnityEngine;
using System.Collections;

/// <summary>
/// 064회차 — 미니게임 ③ 의 자동 발사. 본 프로젝트 무기 시스템의 원형이다.
///
/// FindNearestEnemy 는 4주차 "배열에서 최솟값 찾기" 그대로다.
///
///     int min = scores[0];                    float minDistance = float.MaxValue;
///     for (i) if (scores[i] < min)            foreach (e) if (d < minDistance)
///                 min = scores[i];                            { minDistance = d; nearest = ...; }
///
///   다른 건 비교하는 게 숫자가 아니라 거리라는 것, 그리고 값뿐 아니라
///   "누구였는지" 도 함께 기록한다는 것뿐이다.
///
/// float.MaxValue 로 시작하는 이유
///   첫 적이 무조건 이기게 하려고. 콘솔에서 scores[0] 으로 시작한 것과 같은 이유다.
///
/// ⚠️ FindGameObjectsWithTag 는 씬 전체를 뒤진다. Update 가 아니라 코루틴에서 부른다.
///    060 의 클리어 판정, 063 의 FindWithTag 와 같은 이야기가 세 번째로 나온다.
///
/// 왜 transform.up 에 대입하나
///   047 의 Bullet 은 transform.up 방향으로 날아간다. 그 up 을 우리가 돌리는 것이다.
///   Quaternion 계산 없이 방향 벡터를 그냥 넣으면 유니티가 회전을 만들어 준다.
///
/// ⭐ 비교 기준만 바꾸면 조준 방식이 바뀐다.
///    Vector2.Distance 자리에 체력을 넣으면 "체력이 가장 낮은 적" 을 노린다.
/// </summary>
public class AutoShooter : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private Transform firePoint;
    [SerializeField] private float fireInterval = 0.4f;

    private void Start()
    {
        StartCoroutine(FireRoutine());
    }

    private IEnumerator FireRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(fireInterval);

            Transform target = FindNearestEnemy();

            // 적이 없으면 이번 바퀴는 건너뛴다 (3주차 continue).
            if (target == null) continue;

            Vector2 dir = ((Vector2)target.position - (Vector2)firePoint.position).normalized;

            GameObject bullet = Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);

            bullet.transform.up = dir;
        }
    }

    private Transform FindNearestEnemy()
    {
        GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");

        Transform nearest = null;
        float minDistance = float.MaxValue;

        foreach (GameObject e in enemies)
        {
            float d = Vector2.Distance(transform.position, e.transform.position);

            if (d < minDistance)
            {
                minDistance = d;
                nearest = e.transform;
            }
        }

        return nearest;
    }
}
