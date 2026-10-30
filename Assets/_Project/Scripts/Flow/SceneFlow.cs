using UnityEngine;
using UnityEngine.SceneManagement;

// 씬을 넘기는 곳. 씬 이름을 **여기 한 곳에만** 적는다.
//
// 🚨 씬 이름을 여기저기 문자열로 쓰면 오타 하나에 빌드가 깨진다.
public static class SceneFlow
{
    public const string Lobby  = "Lobby";
    public const string Game   = "Game";
    public const string Result = "Result";

    public static void GoLobby()
    {
        Time.timeScale = 1f;      // 🚨 멈춘 채로 넘어가면 다음 씬도 멈춰 있다
        SceneManager.LoadScene(Lobby);
    }

    public static void GoGame(StageData stage)
    {
        GameSession.Ensure().Select(stage);
        Time.timeScale = 1f;
        SceneManager.LoadScene(Game);
    }

    public static void GoResult()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene(Result);
    }
}
