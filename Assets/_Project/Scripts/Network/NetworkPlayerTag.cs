using Unity.Netcode;
using UnityEngine;

// 109회차 · 접속하면 캐릭터가 하나 더 생긴다 — 그걸 눈으로 보기 위한 최소 스크립트.
//
// 120회차 · 협동 카메라에 스스로 등록한다. 목록에 들어가면 카메라가 알아서 중심을 잡는다.
public class NetworkPlayerTag : NetworkBehaviour
{
    [SerializeField] private SpriteRenderer sprite;

    // 접속 순서대로 색을 준다. 0번은 호스트다.
    private static readonly Color[] colors =
    {
        new Color(0.30f, 0.60f, 1.00f),   // 파랑  — 0번 (호스트)
        new Color(1.00f, 0.55f, 0.25f),   // 주황  — 1번
        new Color(0.45f, 0.85f, 0.45f),   // 초록  — 2번
        new Color(0.90f, 0.45f, 0.85f),   // 자홍  — 3번
    };

    // 🔑 Start 가 아니라 OnNetworkSpawn 이다.
    //    네트워크 오브젝트는 "생성된 뒤" 가 아니라 "네트워크에 등록된 뒤" 부터 의미가 있다.
    //    그 전에는 OwnerClientId 같은 값이 아직 안 정해져 있다.
    public override void OnNetworkSpawn()
    {
        if (sprite == null) sprite = GetComponent<SpriteRenderer>();

        if (sprite != null) sprite.color = colors[OwnerClientId % (ulong)colors.Length];

        // 120회차 · 내 화면의 카메라 목록에 나를 넣는다.
        //   "내 것" 만 넣는 게 아니라 둘 다 넣는다 — 카메라는 둘의 중심을 봐야 하니까.
        CameraFollow cam = Camera.main != null ? Camera.main.GetComponent<CameraFollow>() : null;
        if (cam != null) cam.AddTarget(transform);

        // 접속한 사람마다 자기 화면에서 이 로그를 본다. 그래서 같은 줄이 여러 번 보인다.
        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 플레이어 등장 — " +
                  $"소유자 {OwnerClientId}  내 것인가 = {IsOwner}");
    }

    public override void OnNetworkDespawn()
    {
        CameraFollow cam = Camera.main != null ? Camera.main.GetComponent<CameraFollow>() : null;
        if (cam != null) cam.RemoveTarget(transform);

        Debug.Log($"플레이어 퇴장 — 소유자 {OwnerClientId}");
    }
}
