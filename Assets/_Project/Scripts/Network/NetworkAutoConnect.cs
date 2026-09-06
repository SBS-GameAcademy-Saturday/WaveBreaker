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
    [SerializeField] private RelayConnector relay;

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

        // 🔑 132회차 · 메인 에디터는 **자동으로 시작하지 않는다.**
        //    자동으로 호스트가 되면 로비가 바로 감춰져서 [방 만들기](Relay) 를 누를 수가 없다.
        //    124회차에 Relay 를 붙이면서 이 자리가 막혔다.
        //    가상 플레이어(태그 Client)만 알아서 붙고, 메인 에디터는 사람이 고른다.
        if (!isClient)
        {
            Debug.Log("메인 에디터 — 로비에서 고른다 ([호스트] 또는 [방 만들기])");
            return;
        }

        Debug.Log("태그 Client — 호스트가 만든 방으로 자동 입장");
        StartCoroutine(JoinHostRoom());

        if (buttonRoot != null) buttonRoot.SetActive(false);
#endif
    }

#if UNITY_EDITOR
    // 🚨 가상 플레이어와 메인 에디터는 Play 를 동시에 시작한다.
    //    클라이언트가 호스트보다 먼저 붙으려 하면 "아직 아무도 안 듣고 있다" 라서 그냥 실패하고,
    //    Start 는 한 번뿐이라 영영 안 붙는다. 화면에는 "접속 안 됨" 만 남는다.
    //    → 붙을 때까지 몇 번 다시 시도한다. 사람이 버튼을 누를 땐 순서가 보장되니 이건 에디터 문제다.
    // 🔑 132회차 · 방(Relay) 구조로 바뀌면서 하는 일이 달라졌다.
    //    예전에는 127.0.0.1 로 바로 StartClient 했다. 이제는 **코드가 있어야** 들어간다.
    //    호스트(메인 에디터)가 [방 만들기] 를 누르면 코드를 파일로 남긴다. 그걸 기다린다.
    private IEnumerator JoinHostRoom()
    {
        if (relay == null) relay = Object.FindAnyObjectByType<RelayConnector>();
        if (relay == null)
        {
            Debug.LogWarning("RelayConnector 가 없다 — 자동 입장을 건너뛴다");
            yield break;
        }

        var nm = NetworkManager.Singleton;

        // 호스트가 방을 만들 때까지 기다린다 (사람이 버튼을 누르는 시간)
        string code = null;
        float waitedForCode = 0f;
        while (code == null && waitedForCode < 60f)
        {
            code = RelayConnector.ReadCodeFromHost();
            if (code != null) break;
            waitedForCode += Time.deltaTime;
            yield return null;
        }

        if (string.IsNullOrEmpty(code))
        {
            Debug.LogWarning("접속 코드를 못 받았다 — 호스트가 [방 만들기] 를 눌렀는지 확인한다");
            yield break;
        }

        Debug.Log($"호스트 코드 {code} 를 받았다 — 입장 시도");

        // 🚨 여기서 재시도를 돌리면 안 된다.
        //    JoinWithCode 는 async 다 — 아직 붙는 중인데 Shutdown 을 부르면 그걸 끊어 버린다.
        //    (처음에 5번 재시도로 만들었다가 매번 스스로 끊고 있었다.)
        //    코드가 있다는 건 방이 이미 있다는 뜻이라 순서 경쟁도 없다. 한 번만 부르고 기다린다.
        relay.JoinWithCode(code);

        float waited = 0f;
        while (waited < 20f && !nm.IsConnectedClient)
        {
            waited += Time.deltaTime;
            yield return null;
        }

        if (nm.IsConnectedClient) Debug.Log($"클라이언트 입장 성공 — {waited:F1}초 걸림");
        else Debug.LogWarning($"입장 실패 — {waited:F1}초 기다렸다. 코드가 만료됐거나 길이 막혔다");
    }
#endif
}
