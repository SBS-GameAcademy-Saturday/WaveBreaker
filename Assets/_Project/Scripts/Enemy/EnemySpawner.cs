using UnityEngine;
using System.Collections;

/// <summary>
/// 048회차에 만들고 052회차에 코루틴으로 바꾼 스포너.
/// 저장소에는 052 완성본만 있다 — 048 상태(E 키 스폰)는 그 회차 강의안의 코드 블록이 정본이다.
///
///   048  E 키를 누를 때마다 한 마리 + [ContextMenu] 로 10마리
///   052  코루틴으로 spawnInterval 초마다 저절로. E 키는 할 일이 없어져 지웠다
///
/// ⚠️ while 안에 yield 가 없으면 유니티가 통째로 멈춘다.
///    한 프레임 안에서 무한히 돌면서 몬스터를 수십만 마리 만들려 들기 때문이다.
///    이 회차부터 Play 전에 Ctrl+S 를 습관으로 만든다.
///
/// 🔑 이 SpawnRoutine 이 Phase 5~6 웨이브 매니저의 원형이다.
///    while (true) 가 조건 있는 while 로 바뀌면 그게 웨이브다.
/// </summary>
public class EnemySpawner : MonoBehaviour
{
    [SerializeField] private GameObject enemyPrefab;

    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private float spawnRangeX = 7f;
    [SerializeField] private float spawnY = 4f;

    // 063회차 — 미니게임 ③ 은 사방에서 나온다. 체크하면 원 위에서 뽑는다.
    [SerializeField] private bool spawnAroundCircle;
    [SerializeField] private float spawnRadius = 12f;

    // StartCoroutine 이 돌려주는 손잡이. 안 받아두면 나중에 못 멈춘다.
    private Coroutine spawnRoutine;

    private void Start()
    {
        spawnRoutine = StartCoroutine(SpawnRoutine());
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.P))
        {
            // 049 의 null 확인이 "지금 돌고 있나" 를 판단하는 데 그대로 쓰인다.
            if (spawnRoutine != null)
            {
                StopCoroutine(spawnRoutine);
                spawnRoutine = null;
                Debug.Log("스폰 정지");
            }
            else
            {
                spawnRoutine = StartCoroutine(SpawnRoutine());
                Debug.Log("스폰 시작");
            }
        }
    }

    private IEnumerator SpawnRoutine()
    {
        while (true)
        {
            SpawnOne();

            // 이 한 줄이 없으면 유니티가 멈춘다.
            yield return new WaitForSeconds(spawnInterval);
        }
    }

    /// <summary>
    /// 064회차 — 웨이브. 시간이 지날수록 스폰 간격을 줄인다.
    ///
    /// SurvivalManager 가 밖에서 부르므로 public 이다 — 050 의 TakeDamage 와 같은 판단이다.
    /// Mathf.Max 로 하한을 두지 않으면 간격이 0이나 음수가 되어 게임이 터진다.
    /// </summary>
    public void SpeedUp(float step, float min)
    {
        spawnInterval = Mathf.Max(spawnInterval - step, min);
    }

    /// <summary>
    /// 자동 스폰이 생긴 뒤에도 남겨둔다. Play 를 누르지 않고 테스트할 때 여전히 편하다.
    /// </summary>
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
        Instantiate(enemyPrefab, spawnAroundCircle ? RandomEdgePosition() : RandomTopPosition(),
                    Quaternion.identity);
    }

    // 048~052: 위쪽에서 랜덤하게
    private Vector3 RandomTopPosition()
    {
        float x = Random.Range(-spawnRangeX, spawnRangeX);

        return new Vector3(x, spawnY, 0f);
    }

    /// <summary>
    /// 063회차 — 화면 밖 원 위의 한 점.
    ///
    /// 각도를 랜덤으로 뽑고 그 각도의 원 위 한 점을 구한다.
    /// Cos·Sin 은 "각도를 x, y 로 바꿔주는 함수" 까지만 설명한다. 삼각함수를 파고들지 않는다.
    /// spawnRadius 를 화면보다 크게 두어야 화면 밖에서 걸어 들어온다.
    /// </summary>
    private Vector3 RandomEdgePosition()
    {
        float angle = Random.Range(0f, Mathf.PI * 2f);

        return new Vector3(Mathf.Cos(angle), Mathf.Sin(angle), 0f) * spawnRadius;
    }
}
