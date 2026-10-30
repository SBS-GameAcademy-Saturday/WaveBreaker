using UnityEngine;

public enum SpawnPattern { Trickle, Cluster }

// 한 판의 스폰 계획. 에셋 하나가 스테이지 하나의 난이도 곡선이다.
[CreateAssetMenu(fileName = "Wave_", menuName = "WaveBreaker/Wave Data")]
public class WaveData : ScriptableObject
{
    public SpawnStep[] steps;

    [Header("보스")]
    public BossStep[] bosses;
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

    [Header("Cluster 전용")]
    public int count = 8;
    public int burst = 1;
    public float burstGap = 1.5f;
    public float radius = 2.5f;
}

[System.Serializable]
public class BossStep
{
    public float time = 180f;
    public EnemyData boss;
}
