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

    // 🔑 이 시간을 버티면 **보스가 나온다**. 클리어는 그 보스를 잡아야 된다.
    //    보스전에는 제한 시간이 없다.
    [Header("보스가 나오기까지")]
    public float surviveSeconds = 600f;
}
