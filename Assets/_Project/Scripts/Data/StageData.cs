using UnityEngine;
using UnityEngine.Tilemaps;

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

    // 🔑 여러 장을 넣으면 칸마다 섞어 깐다. 한 장만 넣어도 된다.
    [Header("바닥")]
    public TileBase[] groundTiles;
    public Color groundTint = Color.white;

    // 🔑 장식은 Sprite 로 둔다. 타일맵에 깔 때 코드가 Tile 로 감싼다.
    //    장식용 Tile 애셋을 따로 만들지 않아도 되게 하려는 것이다.
    [Header("장식")]
    public Sprite[] decorSprites;
    [Range(0, 30)] public int decorPercent = 7;
    public Color decorTint = Color.white;

    [Header("클리어 조건")]
    public float surviveSeconds = 600f;
}
