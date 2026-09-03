using Unity.Netcode;
using UnityEngine;

#if UNITY_EDITOR
using Unity.Multiplayer.PlayMode;
#endif

// 111회차 · 가상 플레이어마다 버튼을 손으로 누르는 게 귀찮아지면 이걸 쓴다.
//
// MPPM 은 가상 플레이어마다 "태그" 를 붙일 수 있다.
// 태그에 Client 가 있으면 클라이언트로, 없으면 호스트로 자동 접속한다.
//
// ⚠️ 태그는 에디터에만 있는 기능이다. 그래서 #if UNITY_EDITOR 로 감싼다.
//    빌드한 게임에서는 이 스크립트가 아무것도 안 한다 (버튼으로 접속한다).
public class NetworkAutoConnect : MonoBehaviour
{
    [SerializeField] private bool enableAutoConnect = true;
    [SerializeField] private GameObject buttonRoot;

    private void Start()
    {
        if (!enableAutoConnect) return;

#if UNITY_EDITOR
        // Tags 는 이 가상 플레이어에 붙은 태그 목록이다. 메인 에디터는 비어 있다.
        bool isClient = false;
        foreach (string tag in CurrentPlayer.Tags)
        {
            if (tag == "Client") { isClient = true; break; }
        }

        if (isClient)
        {
            Debug.Log("태그 Client — 클라이언트로 자동 접속");
            NetworkManager.Singleton.StartClient();
        }
        else
        {
            Debug.Log("태그 없음 — 호스트로 자동 시작");
            NetworkManager.Singleton.StartHost();
        }

        if (buttonRoot != null) buttonRoot.SetActive(false);
#endif
    }
}
