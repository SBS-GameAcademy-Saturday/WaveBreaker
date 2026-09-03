using TMPro;
using Unity.Netcode;
using UnityEngine;

// 109회차 · 접속 버튼 세 개. 네트워크를 시작하는 방법이 세 가지라는 걸 보여준다.
//
// | 버튼      | 하는 일                              |
// |-----------|--------------------------------------|
// | 호스트    | 서버 + 플레이어를 겸한다  ← 우리가 쓸 것 |
// | 클라이언트 | 남의 서버에 붙는다                    |
// | 서버      | 서버만 한다 (화면에 내 캐릭터가 없다)   |
public class NetworkTestUI : MonoBehaviour
{
    [SerializeField] private TMP_Text statusLabel;
    [SerializeField] private GameObject buttonRoot;

    public void StartHost()
    {
        bool ok = NetworkManager.Singleton.StartHost();
        Debug.Log("호스트 시작 = " + ok);
        if (buttonRoot != null) buttonRoot.SetActive(!ok);
    }

    public void StartClient()
    {
        bool ok = NetworkManager.Singleton.StartClient();
        Debug.Log("클라이언트 시작 = " + ok);
        if (buttonRoot != null) buttonRoot.SetActive(!ok);
    }

    public void StartServer()
    {
        bool ok = NetworkManager.Singleton.StartServer();
        Debug.Log("서버 시작 = " + ok);
        if (buttonRoot != null) buttonRoot.SetActive(!ok);
    }

    private void Update()
    {
        if (statusLabel == null) return;

        NetworkManager nm = NetworkManager.Singleton;

        if (nm == null || !nm.IsListening)
        {
            statusLabel.text = "접속 안 됨 — 버튼을 누르세요";
            return;
        }

        string role = nm.IsHost ? "호스트" : nm.IsServer ? "서버" : "클라이언트";

        // 접속자 수는 서버만 정확히 안다. 클라이언트는 자기만 센다.
        int count = nm.IsServer ? nm.ConnectedClientsIds.Count : 1;

        statusLabel.text = $"{role}   내 번호 {nm.LocalClientId}   접속자 {count}명";
    }
}
