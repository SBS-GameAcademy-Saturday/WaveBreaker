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

    [Header("바닥")]
    public Sprite groundTile;
    public Color groundTint = Color.white;

    // 🔑 바닥 타일 위에 흩뿌릴 것들. 타일의 자식으로 붙어서
    //    무한 맵이 타일을 옮길 때 같이 따라간다.
    [Header("장식")]
    public Sprite[] decorSprites;
    public int decorPerTile = 14;
    public Color decorTint = Color.white;

    [Header("클리어 조건")]
    public float surviveSeconds = 600f;
}
