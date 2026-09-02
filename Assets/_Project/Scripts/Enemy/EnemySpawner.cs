using UnityEngine;

/// <summary>
/// 048회차 — 몬스터도 Instantiate 로 만든다. 총알 코드에서 프리팹만 바뀐 것이다.
///
/// 새로 배우는 게 하나도 없는 스크립트다. 그걸 수업에서 짚는다.
///   Instantiate    047회차
///   Random.Range   040회차 도전 미션
///   for            3주차 반복문
///   [ContextMenu]  040회차 — "몬스터 10마리 소환을 버튼 하나로" 라던 그 예고
///
/// ⚠️ 오늘 스폰은 키를 눌러서 한다. 2초마다 저절로 나오게 하는 코루틴은 051회차다.
/// </summary>
public class EnemySpawner : MonoBehaviour
{
    [SerializeField] private GameObject enemyPrefab;

    [SerializeField] private float spawnRangeX = 7f;
    [SerializeField] private float spawnY = 4f;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            SpawnOne();
        }
    }

    [ContextMenu("몬스터 10마리 소환")]
    private void SpawnTen()
    {
        for (int i = 0; i < 10; i++)
        {
            SpawnOne();
        }
    }

    private void SpawnOne()
    {
        // float 을 넣으면 끝값을 포함하고, int 를 넣으면 포함하지 않는다.
        float x = Random.Range(-spawnRangeX, spawnRangeX);

        Instantiate(enemyPrefab, new Vector3(x, spawnY, 0f), Quaternion.identity);
    }
}
