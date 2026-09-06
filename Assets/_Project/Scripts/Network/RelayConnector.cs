using System;
using System.Linq;
using System.Threading.Tasks;
using TMPro;
using Unity.Netcode;
using Unity.Netcode.Transports.UTP;
using Unity.Services.Authentication;
using Unity.Services.Core;
using Unity.Services.Relay;
using Unity.Services.Relay.Models;
using UnityEngine;

// 124회차 · Relay — 진짜 인터넷으로 친구와 접속한다.
//
// 지금까지는 127.0.0.1(내 컴퓨터) 이었다. 친구 컴퓨터에 붙으려면
// 원래는 공유기 포트포워딩 같은 걸 해야 하는데, 그건 수업에서 못 시킨다.
//
// 🔑 Relay 는 유니티가 빌려주는 중계 서버다.
//    호스트가 방을 만들면 **접속 코드**(6자리)가 나오고,
//    친구가 그 코드를 넣으면 유니티 서버를 거쳐 연결된다.
//
// 🚨 준비물 (강사가 미리 해둘 것)
//    ① Unity Cloud 프로젝트 연결 (Project Settings → Services)
//    ② 대시보드에서 Relay 서비스 **켜기**
//    ③ 에디터에 유니티 계정 로그인
//    셋 중 하나라도 빠지면 아래 코드가 예외를 던진다.
public class RelayConnector : MonoBehaviour
{
    [SerializeField] private TMP_Text statusLabel;
    [SerializeField] private TMP_InputField codeInput;
    [SerializeField] private GameObject lobbyRoot;   // 붙고 나면 감출 것 (20.5 회수)
    // 🚨 접속 코드를 statusLabel 에 쓰면 NetworkTestUI 가 매 프레임 덮어쓴다.
    //    친구에게 불러 줘야 하는 값이라 **안 지워지는 자리**가 따로 있어야 한다.
    [SerializeField] private TMP_Text codeLabel;
    [SerializeField] private int maxPlayers = 2;     // 기획서 3장 — 정확히 2인

    // 🔑 Relay 는 세 가지 길을 준다 — dtls(암호화 UDP) · udp · wss(웹소켓).
    //    할당(방 만들기)은 HTTPS 라 어디서나 되지만, **실제 데이터가 다니는 길은 막힐 수 있다.**
    //    학교·회사망에서 UDP 가 막히면 wss 로 넘어가야 붙는다.
    [SerializeField] private string connectionType = "dtls";

    // 로그인은 한 번만 하면 된다.
    private static bool signedIn;

#if UNITY_EDITOR
    // 🔑 132회차 · Multiplayer Play Mode 로 시험할 때 쓰는 통로다.
    //    가상 플레이어는 **다른 프로세스**라 화면의 코드를 읽을 수가 없다.
    //    사람이면 눈으로 보고 타자를 치지만, 자동 시험에는 그럴 손이 없다.
    //    그래서 호스트가 코드를 파일 한 줄로 남기고, 가상 플레이어가 그걸 읽는다.
    //
    //    🚨 에디터 전용이다. 빌드한 게임에는 이 코드가 아예 안 들어간다 —
    //       같은 컴퓨터가 아니면 파일을 공유할 수 없으니 의미도 없다.
    public static string CodeFilePath =>
        System.IO.Path.Combine(System.IO.Path.GetTempPath(), "wavebreaker_relay_code.txt");

    public static void WriteCodeForVirtualPlayers(string code)
    {
        try { System.IO.File.WriteAllText(CodeFilePath, code); } catch { }
    }

    public static string ReadCodeFromHost()
    {
        try { return System.IO.File.Exists(CodeFilePath) ? System.IO.File.ReadAllText(CodeFilePath).Trim() : null; }
        catch { return null; }
    }
#endif

    private void Start()
    {
        // 132회차 · 실행 인자로 켰으면 사람이 안 눌러도 알아서 한다 (빌드 두 개 자동 시험)
        if (RelayLaunchArgs.WantsHost) CreateRoom();
        else if (!string.IsNullOrEmpty(RelayLaunchArgs.JoinCode)) JoinWithCode(RelayLaunchArgs.JoinCode);
    }

    private async Task<bool> SignIn()
    {
        if (signedIn) return true;

        try
        {
            await UnityServices.InitializeAsync();

            if (!AuthenticationService.Instance.IsSignedIn)
                await AuthenticationService.Instance.SignInAnonymouslyAsync();

            signedIn = true;
            return true;
        }
        catch (Exception e)
        {
            Report("로그인 실패 — " + e.Message);
            return false;
        }
    }

    // 방 만들기 → 접속 코드가 나온다
    public async void CreateRoom()
    {
        if (!await SignIn()) return;

        try
        {
            // maxPlayers - 1 : 호스트를 뺀 인원이다. 2인이면 1을 넣는다.
            Allocation allocation = await RelayService.Instance.CreateAllocationAsync(maxPlayers - 1);

            string code = await RelayService.Instance.GetJoinCodeAsync(allocation.AllocationId);

            var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();

            // 참고 — 예전 코드가 쓰던 자리. 여기는 **udp 포트**라 isSecure:true 를 주면 어긋난다.
            Debug.Log($"[Relay] allocation.RelayServer = {allocation.RelayServer.IpV4}:{allocation.RelayServer.Port}");

            var ep = PickEndpoint(allocation.ServerEndpoints);

            // 호스트는 hostConnectionData 가 없다 (자기가 호스트니까) → null
            transport.UseWebSockets = ep.ConnectionType == "wss";
            transport.SetRelayServerData(
                ep.Host,
                (ushort)ep.Port,
                allocation.AllocationIdBytes,
                allocation.Key,
                allocation.ConnectionData,
                null,
                ep.Secure);

            NetworkManager.Singleton.StartHost();

            // 붙었으면 버튼을 치운다. 안 그러면 게임 위에 로비가 계속 떠 있다.
            if (lobbyRoot != null) lobbyRoot.SetActive(false);
            ShowCode(code);

#if UNITY_EDITOR
            WriteCodeForVirtualPlayers(code);
#endif

            Report($"방 만듦 — 접속 코드 {code}");
        }
        catch (Exception e)
        {
            Report("방 만들기 실패 — " + e.Message);
        }
    }

    // 코드로 들어가기 — 버튼이 부른다
    public void JoinRoom()
    {
        string code = codeInput != null ? codeInput.text.Trim().ToUpper() : "";
        JoinWithCode(code);
    }

    // 코드를 이미 알고 있을 때 (가상 플레이어 자동 시험이 이걸 쓴다)
    public async void JoinWithCode(string rawCode)
    {
        if (!await SignIn()) return;

        string code = (rawCode ?? "").Trim().ToUpper();

        if (string.IsNullOrEmpty(code)) { Report("코드를 입력하세요"); return; }

        try
        {
            JoinAllocation join = await RelayService.Instance.JoinAllocationAsync(code);

            var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();

            var ep = PickEndpoint(join.ServerEndpoints);

            // 클라이언트는 호스트의 연결 정보(HostConnectionData)까지 받아야 한다
            transport.UseWebSockets = ep.ConnectionType == "wss";
            transport.SetRelayServerData(
                ep.Host,
                (ushort)ep.Port,
                join.AllocationIdBytes,
                join.Key,
                join.ConnectionData,
                join.HostConnectionData,
                ep.Secure);

            NetworkManager.Singleton.StartClient();

            if (lobbyRoot != null) lobbyRoot.SetActive(false);
            ShowCode(code);

            Report($"입장 — 코드 {code}");
        }
        catch (Exception e)
        {
            Report("입장 실패 — " + e.Message);
        }
    }

    // 원하는 길을 고른다. 없으면 첫 번째를 쓴다.
    private RelayServerEndpoint PickEndpoint(System.Collections.Generic.List<RelayServerEndpoint> endpoints)
    {
        Debug.Log("[Relay] 쓸 수 있는 길 — " + string.Join(", ",
            endpoints.Select(e => $"{e.ConnectionType}({e.Host}:{e.Port} secure={e.Secure})")));

        var picked = endpoints.FirstOrDefault(e => e.ConnectionType == connectionType) ?? endpoints[0];
        Debug.Log($"[Relay] 고른 길 = {picked.ConnectionType}");
        return picked;
    }

    private void ShowCode(string code)
    {
        if (codeLabel == null) return;
        codeLabel.text = $"접속 코드  {code}";
        codeLabel.gameObject.SetActive(true);
    }

    private void Report(string message)
    {
        Debug.Log("[Relay] " + message);

        if (statusLabel != null) statusLabel.text = message;
    }
}
