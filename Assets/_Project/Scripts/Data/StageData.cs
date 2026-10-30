using UnityEngine;

// 스테이지 하나. 에셋을 하나 더 만들면 스테이지가 하나 는다.
[CreateAssetMenu(fileName = "Stage_", menuName = "WaveBreaker/Stage Data")]
public class StageData : ScriptableObject
{
    [Header("표시")]
    public string title = "들판";
    public Sprite thumbnail;
    [TextArea] public string description = "";

    [Header("내용")]
    public WaveData waves;
    public Sprite groundTile;
    public Color groundTint = Color.white;

    [Header("클리어 조건")]
    public float surviveSeconds = 600f;
}
