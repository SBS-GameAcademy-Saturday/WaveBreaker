using UnityEngine;

public enum SpawnPattern { Trickle, Cluster }

// 한 판의 스폰 계획. 에셋 하나가 스테이지 하나의 난이도 곡선이다.
[CreateAssetMenu(fileName = "Wave_", menuName = "WaveBreaker/Wave Data")]
public class WaveData : ScriptableObject
{
    public SpawnStep[] steps;

    // 🔑 보스는 **맨 마지막 하나**다. 이 녀석을 잡아야 판이 끝난다.
    //    언제 나오는지는 여기 적지 않는다 — StageData.surviveSeconds 가 정한다.
    //    같은 숫자를 두 군데 적으면 반드시 어긋난다.
    [Header("최종 보스")]
    public EnemyData finalBoss;
}

[System.Serializable]
public class SpawnStep
{
    [Header("언제")]
    public float startTime;
    public float endTime = 9999f;

    [Header("무엇을")]
    public EnemyData enemy;
    public float healthScale = 1f;

    [Header("어떻게")]
    public SpawnPattern pattern = SpawnPattern.Trickle;

    [Header("Trickle 전용")]
    public float interval = 2f;

    // 🔑 시간이 갈수록 거세진다. 안 두면 중반부터 심심하고 레벨도 안 오른다.
    //    판이 시작하고 흐른 **분** 에 비례해 적용된다.
    [Header("시간이 갈수록 (1분당)")]
    public float intervalMulPerMinute = 1f;   // 간격에 매분 곱한다. 0.85 면 점점 빨라진다
    public float countAddPerMinute = 0f;      // 한 번에 몇 마리씩 더 나오는가
    public float healthAddPerMinute = 0f;     // 체력 배수가 매분 얼마씩 오르는가

    [Header("Cluster 전용")]
    // 🔑 켜면 떼가 플레이어를 **쫓지 않고 스쳐 지나간다.**
    //    방향은 나올 때 한 번 정하고, 화면을 벗어나면 알아서 사라진다.
    public bool straight = true;
    public int count = 8;
    public int burst = 1;
    public float burstGap = 1.5f;
    public float radius = 2.5f;
}
