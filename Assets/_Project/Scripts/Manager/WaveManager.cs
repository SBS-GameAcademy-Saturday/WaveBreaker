using System.Collections;
using UnityEngine;

// 몬스터를 만드는 곳은 여기 하나뿐이다. ← 설계 규칙 ①
//
// 🔑 "언제 무엇이 어떻게 나오는가" 는 전부 WaveData 에셋에 있다.
//    이 스크립트는 그 표를 읽어 돌릴 뿐이다.
public class WaveManager : MonoBehaviour
{
    public static WaveManager Instance { get; private set; }

    [SerializeField] private WaveData waves;
    [SerializeField] private GameObject enemyPrefab;      // 일반 적 — 하나면 된다
    [SerializeField] private GameObject bossPrefab;       // 보스 — 행동이 달라 따로
    [SerializeField] private Transform[] spawnPoints;

    public float Elapsed { get; private set; }
    public bool BossActive { get; private set; }

    // 표시 전용. 스폰 판단에는 안 쓴다.
    public int Wave => Mathf.FloorToInt(Elapsed / 15f) + 1;

    private void Awake() => Instance = this;

    public void Begin(WaveData table)
    {
        waves = table;
        StartAll();
    }

    private void Start()
    {
        if (waves != null) StartAll();
    }

    private void StartAll()
    {
        StopAllCoroutines();
        Elapsed = 0f;

        foreach (SpawnStep s in waves.steps) StartCoroutine(RunStep(s));
        StartCoroutine(RunBosses());
    }

    private void Update()
    {
        if (GameManager.Instance != null && GameManager.Instance.State != GameState.Playing) return;
        Elapsed += Time.deltaTime;
    }

    private bool Paused => GameManager.Instance != null
                        && GameManager.Instance.State != GameState.Playing;

    private IEnumerator RunStep(SpawnStep s)
    {
        while (Elapsed < s.startTime) yield return null;

        while (Elapsed < s.endTime)
        {
            // 🚨 보스가 나와 있으면 잡졸을 멈춘다. 안 그러면 화면이 감당이 안 된다.
            if (Paused || BossActive) { yield return null; continue; }

            if (s.pattern == SpawnPattern.Trickle)
            {
                SpawnAt(s.enemy, s.healthScale, PickPoint());
                yield return new WaitForSeconds(s.interval);
            }
            else
            {
                for (int b = 0; b < Mathf.Max(s.burst, 1); b++)
                {
                    SpawnCluster(s);
                    yield return new WaitForSeconds(s.burstGap);
                }
                yield return new WaitForSeconds(s.interval);
            }
        }
    }

    private IEnumerator RunBosses()
    {
        if (waves.bosses == null) yield break;

        foreach (BossStep b in waves.bosses)
        {
            while (Elapsed < b.time) yield return null;

            BossActive = true;
            GameObject go = SpawnAt(b.boss, 1f, PickPoint(), true);

            // 보스가 죽을 때까지 기다린다
            while (go != null) yield return null;

            BossActive = false;
        }
    }

    private Vector3 PickPoint() =>
        spawnPoints.Length == 0 ? transform.position
                                : spawnPoints[Random.Range(0, spawnPoints.Length)].position;

    private void SpawnCluster(SpawnStep s)
    {
        Vector3 center = PickPoint();

        // 🔑 떼는 한 지점에서 나온다. 사방에서 나오면 떼로 안 보인다.
        for (int i = 0; i < s.count; i++)
        {
            Vector2 off = Random.insideUnitCircle * s.radius;
            SpawnAt(s.enemy, s.healthScale, center + (Vector3)off);
        }
    }

    // 🔑 만드는 통로는 이 메서드 하나다.
    public GameObject SpawnAt(EnemyData d, float healthScale, Vector3 pos, bool boss = false)
    {
        GameObject prefab = boss ? bossPrefab : enemyPrefab;
        if (prefab == null || d == null) return null;

        GameObject go = Instantiate(prefab, pos, Quaternion.identity);
        go.GetComponent<Enemy>().Setup(d, healthScale);
        return go;
    }
}
