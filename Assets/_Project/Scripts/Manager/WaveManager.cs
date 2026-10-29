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
    public static WaveManager Instance { get; private set; }

    [SerializeField] private GameObject[] enemyPrefabs;   // 0 오크 · 1 러너 · 2 탱커
    [SerializeField] private Transform[] spawnPoints;

    [Header("웨이브")]
    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private float minInterval = 0.4f;
    [SerializeField] private float intervalStep = 0.3f;
    [SerializeField] private float waveDuration = 15f;

    [Header("러너 군집")]
    [SerializeField] private GameObject runnerPrefab;
    [SerializeField] private float clusterInterval = 20f;   // 군집이 오는 주기
    [SerializeField] private int clusterBurst = 3;          // 한 주기에 연달아 몇 번
    [SerializeField] private float burstGap = 1.5f;         // 연달아 나올 때의 간격
    [SerializeField] private int runnersPerCluster = 8;     // 한 떼의 마릿수
    [SerializeField] private float clusterRadius = 2.5f;    // 떼가 퍼진 반지름

    public int Wave { get; private set; } = 1;

    private void Awake()
    {
        Instance = this;
    }

    private void Start()
    {
        // 🔑 074회차 · 여러 개를 동시에 돌린다.
        //    "한 마리씩 꾸준히" 와 "가끔 떼로" 와 "난이도 올리기" 는 주기가 다른 별개의 일이다.
        //    하나로 합치면 if 문으로 뒤엉킨다.
        StartCoroutine(SpawnRoutine());
        StartCoroutine(WaveRoutine());
        StartCoroutine(ClusterRoutine());
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

    // ── 러너 군집 ──
    // 🔑 한 마리씩 오는 것과 **떼로 오는 것**은 체감이 전혀 다르다.
    //    몬스터 코드는 그대로 두고 **스폰하는 방법만** 바꿔서 종류를 늘린 셈이다.
    private IEnumerator ClusterRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(clusterInterval);

            for (int i = 0; i < clusterBurst; i++)
            {
                SpawnCluster();
                yield return new WaitForSeconds(burstGap);
            }
        }
    }

    [ContextMenu("러너 군집 소환")]
    public void SpawnCluster()
    {
        if (runnerPrefab == null || spawnPoints.Length == 0) return;

        // 떼는 **한 지점**에서 나온다. 사방에서 나오면 떼로 안 보인다.
        Vector3 center = spawnPoints[Random.Range(0, spawnPoints.Length)].position;

        for (int i = 0; i < runnersPerCluster; i++)
        {
            // 원 안에 고루 흩뿌린다. 069의 원형 배치와 같은 계산이다.
            Vector2 offset = Random.insideUnitCircle * clusterRadius;

            SpawnAt(runnerPrefab, center + (Vector3)offset);
        }

        Debug.Log($"러너 군집 {runnersPerCluster}마리 — {center}");
    }

    // 웨이브가 오를수록 나오는 종류가 늘어난다. 1웨이브엔 오크만 나온다.
    private int KindCount()
    {
        return Mathf.Min(Wave, enemyPrefabs.Length);
    }

    public void SpawnOne()
    {
        if (enemyPrefabs.Length == 0 || spawnPoints.Length == 0) return;

        GameObject prefab = enemyPrefabs[Random.Range(0, KindCount())];
        Transform point = spawnPoints[Random.Range(0, spawnPoints.Length)];

        SpawnAt(prefab, point.position);
    }

    // 🔑 만드는 통로는 이 메서드 하나다. 분열·군집·웨이브가 전부 여기를 거친다.
    public GameObject SpawnAt(GameObject prefab, Vector3 position)
    {
        if (prefab == null) return null;

        return Instantiate(prefab, position, Quaternion.identity);
    }

    // 073회차 · 코루틴 전에 손으로 한 마리씩 불러 본다.
    // Inspector 의 톱니 메뉴 → "한 마리 소환"
    [ContextMenu("한 마리 소환")]
    private void SpawnFromMenu() => SpawnOne();
}
