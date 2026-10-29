using UnityEngine;

// 069회차 · 바닥이 끝나지 않는다.
//
// 🔑 맵을 넓게 만드는 게 아니다. **타일 9장을 돌려쓴다.**
//    플레이어에게서 멀어진 타일을 반대편으로 순간이동시킨다.
//    플레이어는 늘 3×3 한가운데에 있으므로 끝을 볼 수 없다.
public class InfiniteGround : MonoBehaviour
{
    [SerializeField] private float tileSize = 20f;
    [SerializeField] private int gridCount = 3;

    private Transform player;

    void Awake()
    {
        player = GameObject.FindWithTag("Player").transform;
    }

    void LateUpdate()
    {
        float span = tileSize * gridCount;   // 60 — 맵 한 판의 폭
        float half = span / 2f;              // 30 — 이만큼 멀어지면 옮긴다

        // 자식 Transform 을 그냥 foreach 로 돌 수 있다. 목록을 따로 안 만든다.
        foreach (Transform tile in transform)
        {
            Vector3 diff = tile.position - player.position;

            if (diff.x > half) tile.position += Vector3.left * span;
            if (diff.x < -half) tile.position += Vector3.right * span;
            if (diff.y > half) tile.position += Vector3.down * span;
            if (diff.y < -half) tile.position += Vector3.up * span;
        }
    }
}
