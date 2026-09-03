using System;
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
    [SerializeField] private int maxPlayers = 2;   // 기획서 3장 — 정확히 2인

    // 로그인은 한 번만 하면 된다.
    private static bool signedIn;

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

            // 호스트는 hostConnectionData 가 없다 (자기가 호스트니까) → null
            transport.SetRelayServerData(
                allocation.RelayServer.IpV4,
                (ushort)allocation.RelayServer.Port,
                allocation.AllocationIdBytes,
                allocation.Key,
                allocation.ConnectionData,
                null,
                true);   // isSecure — dtls

            NetworkManager.Singleton.StartHost();

            Report($"방 만듦 — 접속 코드 {code}");
        }
        catch (Exception e)
        {
            Report("방 만들기 실패 — " + e.Message);
        }
    }

    // 코드로 들어가기
    public async void JoinRoom()
    {
        if (!await SignIn()) return;

        string code = codeInput != null ? codeInput.text.Trim().ToUpper() : "";

        if (string.IsNullOrEmpty(code)) { Report("코드를 입력하세요"); return; }

        try
        {
            JoinAllocation join = await RelayService.Instance.JoinAllocationAsync(code);

            var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();

            // 클라이언트는 호스트의 연결 정보(HostConnectionData)까지 받아야 한다
            transport.SetRelayServerData(
                join.RelayServer.IpV4,
                (ushort)join.RelayServer.Port,
                join.AllocationIdBytes,
                join.Key,
                join.ConnectionData,
                join.HostConnectionData,
                true);

            NetworkManager.Singleton.StartClient();

            Report($"입장 — 코드 {code}");
        }
        catch (Exception e)
        {
            Report("입장 실패 — " + e.Message);
        }
    }

    private void Report(string message)
    {
        Debug.Log("[Relay] " + message);

        if (statusLabel != null) statusLabel.text = message;
    }
}
