using System;
using UnityEngine;

// 132회차 · 빌드 두 개를 자동으로 붙여 시험하기 위한 실행 인자.
//
// 🔑 왜 필요한가
//    에디터 안에서는 가상 플레이어에게 코드를 파일로 넘길 수 있다(25.4).
//    하지만 **빌드한 게임**은 그럴 수 없다 — 사람이 눈으로 보고 타자를 치는 물건이다.
//    시험할 때마다 손으로 여섯 글자를 치는 대신, 실행할 때 인자로 넘긴다.
//
//    WaveBreaker.exe -wb-host              → 켜자마자 방을 만든다
//    WaveBreaker.exe -wb-join ABC123       → 켜자마자 그 코드로 들어간다
//
// 🚨 인자를 안 주면 아무 일도 안 한다. 학생이 실행하면 평소처럼 타이틀이 뜬다.
public static class RelayLaunchArgs
{
    public const string HostFlag = "-wb-host";
    public const string JoinFlag = "-wb-join";

    public static bool WantsHost { get; private set; }
    public static string JoinCode { get; private set; }

    // 인자가 하나라도 있으면 타이틀을 건너뛰고 협동 씬으로 간다.
    public static bool Any => WantsHost || !string.IsNullOrEmpty(JoinCode);

    static RelayLaunchArgs()
    {
        string[] args;
        try { args = Environment.GetCommandLineArgs(); }
        catch { return; }

        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == HostFlag) WantsHost = true;

            // -wb-join 다음 칸이 코드다. 마지막 인자면 코드가 없는 것이다.
            if (args[i] == JoinFlag && i + 1 < args.Length) JoinCode = args[i + 1];
        }

        if (Any) Debug.Log($"[실행 인자] 호스트={WantsHost} 입장코드={JoinCode ?? "(없음)"}");
    }
}
