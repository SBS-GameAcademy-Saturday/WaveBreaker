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

    [SerializeField] private float bossTime = 600f;   // 몇 초를 버티면 보스가 나오는가

    public float Elapsed { get; private set; }
    public bool BossActive { get; private set; }

    // 🔑 최종 보스를 잡았는가. 이게 곧 클리어 조건이다.
    public bool BossDefeated { get; private set; }

    // 표시 전용. 스폰 판단에는 안 쓴다.
    public int Wave => Mathf.FloorToInt(Elapsed / 15f) + 1;

    private Transform player;

    private void Awake()
    {
        Instance = this;
        GameObject p = GameObject.FindWithTag("Player");
        if (p != null) player = p.transform;
    }

    public void Begin(WaveData table, float bossAt)
    {
        waves = table;
        bossTime = bossAt;
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
        BossActive = false;
        BossDefeated = false;

        foreach (SpawnStep s in waves.steps) StartCoroutine(RunStep(s));
        StartCoroutine(RunFinalBoss());
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

            float minutes = Elapsed / 60f;
            float interval = Mathf.Max(0.15f, s.interval * Mathf.Pow(s.intervalMulPerMinute, minutes));
            int extra = Mathf.FloorToInt(s.countAddPerMinute * minutes);
            float hp = s.healthScale + s.healthAddPerMinute * minutes;

            if (s.pattern == SpawnPattern.Trickle)
            {
                // 한 번에 1 마리로 시작해 시간이 갈수록 여럿이 같이 나온다
                for (int i = 0; i < 1 + extra; i++)
                    SpawnAt(s.enemy, hp, PickPoint());

                yield return new WaitForSeconds(interval);
            }
            else
            {
                for (int b = 0; b < Mathf.Max(s.burst, 1); b++)
                {
                    SpawnCluster(s, s.count + extra, hp);
                    yield return new WaitForSeconds(s.burstGap);
                }
                yield return new WaitForSeconds(interval);
            }
        }
    }

    private IEnumerator RunFinalBoss()
    {
        if (waves.finalBoss == null) yield break;

        while (Elapsed < bossTime) yield return null;

        // 🔑 보스가 나오면 잡졸은 멈춘다. 보스전에는 제한 시간이 없다.
        //    여기서부터는 시계가 아니라 **보스의 체력**이 끝을 정한다.
        BossActive = true;
        GameObject go = SpawnAt(waves.finalBoss, 1f, PickPoint(), true);

        while (go != null) yield return null;

        BossActive = false;
        BossDefeated = true;
    }

    private Vector3 PickPoint() =>
        spawnPoints.Length == 0 ? transform.position
                                : spawnPoints[Random.Range(0, spawnPoints.Length)].position;

    private void SpawnCluster(SpawnStep s, int count, float healthScale)
    {
        Vector3 center = PickPoint();

        // 🔑 방향은 **떼 전체가 한 번만** 정한다. 한 마리씩 정하면 부채처럼 퍼져
        //    떼로 안 보인다. 플레이어가 선 쪽을 향해 다 같이 밀고 간다.
        Vector2 dir = Vector2.right;
        if (player != null) dir = ((Vector2)player.position - (Vector2)center).normalized;

        // 떼는 한 지점에서 나온다. 사방에서 나오면 떼로 안 보인다.
        for (int i = 0; i < count; i++)
        {
            Vector2 off = Random.insideUnitCircle * s.radius;
            GameObject go = SpawnAt(s.enemy, healthScale, center + (Vector3)off);

            if (s.straight && go != null && go.TryGetComponent(out Enemy e))
                e.SetStraight(dir);
        }
    }

    // 🔑 만드는 통로는 이 메서드 하나다.
    public GameObject SpawnAt(EnemyData d, float healthScale, Vector3 pos, bool boss = false)
    {
        if (d == null) return null;

        // 🔑 만들지 않고 **빌려 쓴다.** 후반에 초당 수십 마리가 나고 죽는데
        //    그때마다 Instantiate / Destroy 를 하면 가비지 수집에 화면이 끊긴다.
        GameObject go;
        if (EnemyPool.Instance != null)
        {
            go = EnemyPool.Instance.Get(boss, pos);
        }
        else
        {
            GameObject prefab = boss ? bossPrefab : enemyPrefab;
            if (prefab == null) return null;
            go = Instantiate(prefab, pos, Quaternion.identity);
        }

        if (go == null) return null;
        go.GetComponent<Enemy>().Setup(d, healthScale);
        return go;
    }
}
