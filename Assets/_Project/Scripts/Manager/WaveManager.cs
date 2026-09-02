using System.Collections;
using UnityEngine;

// 073·074회차 · 몬스터를 만드는 곳은 여기 하나뿐이다.
//
// 🔑 이 프로젝트의 규칙: 몬스터 스폰은 매니저 한 곳에서만 한다.
//    여기저기서 Instantiate 하면 나중에 누가 만들었는지 못 찾는다.
//
// 090회차 · 정해진 시각에 보스를 소환한다. 보스도 몬스터라 여기서 만든다.
public class WaveManager : MonoBehaviour
{
    [SerializeField] private GameObject[] enemyPrefabs;   // 0 돌진 · 1 러너 · 2 탱커
    [SerializeField] private Transform[] spawnPoints;
    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private float minInterval = 0.4f;
    [SerializeField] private float intervalStep = 0.3f;
    [SerializeField] private float waveDuration = 15f;

    [Header("보스 (090회차)")]
    [SerializeField] private GameObject[] bossPrefabs;
    [SerializeField] private float[] bossTimes = { 180f, 360f, 600f };

    public int Wave { get; private set; } = 1;
    public float Interval => spawnInterval;
    public float Elapsed { get; private set; }
    public int NextBossIndex => nextBoss;

    private int nextBoss;

    private void Start()
    {
        StartCoroutine(SpawnRoutine());
        StartCoroutine(WaveRoutine());
    }

    private void Update()
    {
        if (GameManager.Instance != null && GameManager.Instance.State != GameState.Playing) return;

        Elapsed += Time.deltaTime;

        if (nextBoss >= bossTimes.Length) return;
        if (Elapsed < bossTimes[nextBoss]) return;

        SpawnBoss(nextBoss);
        nextBoss++;
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

            Debug.Log($"웨이브 {Wave}  (간격 {spawnInterval:F2}초, 종류 {KindCount()}가지)");
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

    public void SpawnBoss(int index)
    {
        if (bossPrefabs == null || index >= bossPrefabs.Length) return;
        if (bossPrefabs[index] == null || spawnPoints.Length == 0) return;

        Transform point = spawnPoints[Random.Range(0, spawnPoints.Length)];

        Instantiate(bossPrefabs[index], point.position, Quaternion.identity);
    }

    [ContextMenu("한 마리 소환")]
    private void SpawnFromMenu() => SpawnOne();
}
