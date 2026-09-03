using Unity.Netcode;
using UnityEngine;

// 109회차 · 접속하면 캐릭터가 하나 더 생긴다 — 그걸 눈으로 보기 위한 최소 스크립트.
//
// 아직 움직이지 않는다. 이동 동기화는 112회차, "내 것만 내가 조종" 은 114회차다.
// 오늘은 딱 하나만 확인한다 — 접속한 사람 수만큼 오브젝트가 생기는가.
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

        // 접속한 사람마다 자기 화면에서 이 로그를 본다. 그래서 같은 줄이 여러 번 보인다.
        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 플레이어 등장 — " +
                  $"소유자 {OwnerClientId}  내 것인가 = {IsOwner}");
    }

    public override void OnNetworkDespawn()
    {
        Debug.Log($"플레이어 퇴장 — 소유자 {OwnerClientId}");
    }
}
