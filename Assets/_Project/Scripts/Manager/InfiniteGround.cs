using UnityEngine;

// 069회차 · 무한 맵. 바닥 타일 9장을 돌려쓴다. Ground(부모)에 하나만 붙인다.
// 규칙 한 줄: 타일이 플레이어에게서 30보다 멀어지면 반대편으로 60 옮긴다.
// 60 = 타일 크기(20) x 격자 수(3). 40 을 쓰면 이미 타일이 있는 자리로 가서 겹치고 구멍이 생긴다.
public class InfiniteGround : MonoBehaviour
{
    [SerializeField] private float tileSize = 20f;
    [SerializeField] private int gridCount = 3;

    // 🔑 플레이어가 아니라 카메라를 따라간다.
    //    싱글에서는 카메라가 플레이어를 따라가니 결과가 같고,
    //    협동에서는 플레이어가 접속한 뒤에 생기기 때문에 Awake 에서 찾으면 없다.
    //    (실제로 협동 씬에 이 맵을 깔자마자 NullReferenceException 이 났다.)
    void LateUpdate()
    {
        Camera cam = Camera.main;
        if (cam == null) return;

        float span = tileSize * gridCount;   // 60 — 맵 한 판의 폭
        float half = span / 2f;              // 30 — 이만큼 멀어지면 옮긴다

        foreach (Transform tile in transform)
        {
            Vector3 diff = tile.position - cam.transform.position;
            diff.z = 0f;                     // 카메라는 z 가 -10 이다. 높이는 안 본다

            if (diff.x > half) tile.position += Vector3.left * span;
            if (diff.x < -half) tile.position += Vector3.right * span;
            if (diff.y > half) tile.position += Vector3.down * span;
            if (diff.y < -half) tile.position += Vector3.up * span;
        }
    }
}
