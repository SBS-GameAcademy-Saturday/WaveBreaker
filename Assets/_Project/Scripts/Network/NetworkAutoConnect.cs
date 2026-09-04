using System.Collections;
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
            StartCoroutine(ConnectAsClient());
        }
        else
        {
            Debug.Log("태그 없음 — 호스트로 자동 시작");
            NetworkManager.Singleton.StartHost();
        }

        if (buttonRoot != null) buttonRoot.SetActive(false);
#endif
    }

#if UNITY_EDITOR
    // 🚨 가상 플레이어와 메인 에디터는 Play 를 동시에 시작한다.
    //    클라이언트가 호스트보다 먼저 붙으려 하면 "아직 아무도 안 듣고 있다" 라서 그냥 실패하고,
    //    Start 는 한 번뿐이라 영영 안 붙는다. 화면에는 "접속 안 됨" 만 남는다.
    //    → 붙을 때까지 몇 번 다시 시도한다. 사람이 버튼을 누를 땐 순서가 보장되니 이건 에디터 문제다.
    private IEnumerator ConnectAsClient()
    {
        var nm = NetworkManager.Singleton;

        for (int attempt = 1; attempt <= 10; attempt++)
        {
            nm.StartClient();

            float waited = 0f;
            while (waited < 1.5f && !nm.IsConnectedClient)
            {
                waited += Time.deltaTime;
                yield return null;
            }

            if (nm.IsConnectedClient)
            {
                Debug.Log($"클라이언트 접속 성공 — {attempt}번째 시도");
                yield break;
            }

            nm.Shutdown();
            yield return new WaitForSeconds(0.5f);
        }

        Debug.LogWarning("클라이언트 접속 실패 — 호스트가 안 켜져 있는지 확인한다");
    }
#endif
}
