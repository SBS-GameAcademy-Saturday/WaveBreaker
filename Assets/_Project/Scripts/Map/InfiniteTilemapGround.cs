using UnityEngine;
using UnityEngine.Tilemaps;

// 바닥을 **타일맵**으로 깐다. 맵은 여전히 끝이 없다.
//
// 🔑 전에는 커다란 스프라이트 9장을 반대편으로 순간이동시켰다.
//    이제는 플레이어 주변 사각형을 칸 단위로 칠한다. 플레이어가 한 칸
//    움직일 때마다 다시 칠하지만, SetTilesBlock 은 한 번에 처리해서 싸다.
//
// 🚨 같은 칸은 **늘 같은 타일**이어야 한다. 매번 Random 을 쓰면
//    갔다가 돌아올 때 바닥 무늬가 바뀌어 버린다. 그래서 좌표를 해시한다.
public class InfiniteTilemapGround : MonoBehaviour
{
    [SerializeField] private Tilemap ground;
    [SerializeField] private Tilemap decor;
    [SerializeField] private int radius = 22;      // 칸 단위 반경

    private TileBase[] groundTiles;
    private TileBase[] decorTiles = new TileBase[0];
    private int decorPercent;

    private Transform player;
    private Vector3Int last = new Vector3Int(int.MinValue, 0, 0);
    private TileBase[] groundBuf;
    private TileBase[] decorBuf;

    public void Setup(StageData stage)
    {
        if (stage == null || stage.groundTiles == null || stage.groundTiles.Length == 0) return;

        groundTiles = stage.groundTiles;
        decorPercent = stage.decorPercent;

        // 장식 스프라이트를 그때그때 Tile 로 감싼다.
        // 장식용 Tile 애셋을 따로 만들어 두지 않아도 되게 하려는 것이다.
        int n = stage.decorSprites != null ? stage.decorSprites.Length : 0;
        decorTiles = new TileBase[n];
        for (int i = 0; i < n; i++)
        {
            Tile t = ScriptableObject.CreateInstance<Tile>();
            t.sprite = stage.decorSprites[i];
            decorTiles[i] = t;
        }

        if (ground != null) ground.color = stage.groundTint;
        if (decor != null) decor.color = stage.decorTint;

        last = new Vector3Int(int.MinValue, 0, 0);   // 다음 LateUpdate 에서 반드시 다시 칠한다
    }

    private void Awake()
    {
        GameObject p = GameObject.FindWithTag("Player");
        if (p != null) player = p.transform;

        int size = radius * 2 + 1;
        groundBuf = new TileBase[size * size];
        decorBuf = new TileBase[size * size];
    }

    private void LateUpdate()
    {
        if (player == null || groundTiles == null) return;

        Vector3Int cell = ground.WorldToCell(player.position);
        if (cell.x == last.x && cell.y == last.y) return;

        last = cell;
        Paint(cell);
    }

    private void Paint(Vector3Int center)
    {
        int size = radius * 2 + 1;
        var area = new BoundsInt(center.x - radius, center.y - radius, 0, size, size, 1);

        for (int y = 0; y < size; y++)
            for (int x = 0; x < size; x++)
            {
                int cx = area.xMin + x;
                int cy = area.yMin + y;
                int i = y * size + x;

                groundBuf[i] = groundTiles[Hash(cx, cy, 1) % groundTiles.Length];

                bool put = decorTiles.Length > 0 && Hash(cx, cy, 2) % 100 < decorPercent;
                decorBuf[i] = put ? decorTiles[Hash(cx, cy, 3) % decorTiles.Length] : null;
            }

        ground.SetTilesBlock(area, groundBuf);
        if (decor != null) decor.SetTilesBlock(area, decorBuf);
    }

    // 좌표를 섞어 0 이상의 수를 만든다. 같은 좌표면 늘 같은 값이 나온다.
    private static int Hash(int x, int y, int salt)
    {
        int h = x * 73856093 ^ y * 19349663 ^ salt * 83492791;
        return h & 0x7fffffff;
    }
}
