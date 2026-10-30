using UnityEngine;

// 레벨업 곡선. 표 하나다.
[CreateAssetMenu(fileName = "LevelCurve", menuName = "WaveBreaker/Level Data")]
public class LevelData : ScriptableObject
{
    [Header("필요 경험치 = base + step * (레벨-1)")]
    public int baseExp = 5;
    public int step = 3;

    public int Need(int level) => baseExp + step * Mathf.Max(level - 1, 0);
}
