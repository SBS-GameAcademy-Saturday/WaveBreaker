using System.Collections;
using UnityEngine;

// 073회차 · 몬스터를 만드는 곳은 여기 하나뿐이다. ← 설계 규칙 ①
// 074회차 · 코루틴 둘을 동시에 돌려 시간이 갈수록 몰려오게 만든다.
//
// 🔑 왜 한 곳인가
//    22주차에 협동을 붙이면 **몬스터는 서버만 만든다.** 각자 만들면 사람마다
//    다른 몬스터가 보인다. 지금 한 곳이면 그때 이 파일만 고치면 된다.
public class WaveManager : MonoBehaviour
{
    [SerializeField] private GameObject[] enemyPrefabs;   // 0 돌진 · 1 러너 · 2 탱커
    [SerializeField] private Transform[] spawnPoints;

    [Header("웨이브")]
    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private float minInterval = 0.4f;
    [SerializeField] private float intervalStep = 0.3f;
    [SerializeField] private float waveDuration = 15f;

    public int Wave { get; private set; } = 1;

    private void Start()
    {
        // 🔑 074회차 · 두 개를 동시에 돌린다.
        //    "소환" 과 "난이도 올리기" 는 주기가 다른 별개의 일이다.
        //    하나로 합치면 if 문으로 뒤엉킨다.
        StartCoroutine(SpawnRoutine());
        StartCoroutine(WaveRoutine());
    }

    private IEnumerator SpawnRoutine()
    {
        while (true)
        {
            SpawnOne();
            yield return new WaitForSeconds(spawnInterval);
        }
    }

    private IEnumerator WaveRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(waveDuration);

            Wave++;
            spawnInterval = Mathf.Max(spawnInterval - intervalStep, minInterval);

            Debug.Log($"웨이브 {Wave}  (간격 {spawnInterval:F2}초)");
        }
    }

    // 웨이브가 오를수록 나오는 종류가 늘어난다. 1웨이브엔 돌진형만 나온다.
    private int KindCount()
    {
        return Mathf.Min(Wave, enemyPrefabs.Length);
    }

    public void SpawnOne()
    {
        if (enemyPrefabs.Length == 0 || spawnPoints.Length == 0) return;

        GameObject prefab = enemyPrefabs[Random.Range(0, KindCount())];
        Transform point = spawnPoints[Random.Range(0, spawnPoints.Length)];

        Instantiate(prefab, point.position, Quaternion.identity);
    }

    // 073회차 · 코루틴 전에 손으로 한 마리씩 불러 본다.
    // Inspector 의 톱니 메뉴 → "한 마리 소환"
    [ContextMenu("한 마리 소환")]
    private void SpawnFromMenu() => SpawnOne();
}
