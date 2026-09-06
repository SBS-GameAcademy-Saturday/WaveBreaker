using UnityEngine;
using UnityEngine.SceneManagement;

#if UNITY_EDITOR
using Unity.Multiplayer.PlayMode;
#endif

// 097회차 · 타이틀 화면. 하는 일이 두 개뿐이라 스크립트도 두 줄이다.
// 125회차 · [같이 하기] 가 붙었다. 기획서 3장의 모드 구조가 여기서 완성된다.
public class TitleView : MonoBehaviour
{
#if UNITY_EDITOR
    // 132회차 · Multiplayer Play Mode 로 시험할 때만 도는 코드.
    //   가상 플레이어도 재생을 시작하면 Title 부터 뜬다. 사람이면 [같이 하기] 를 누르지만
    //   자동 시험에는 누를 손이 없다. 태그가 Client 면 알아서 협동 씬으로 넘어간다.
    private void Start()
    {
        foreach (string tag in CurrentPlayer.Tags)
        {
            if (tag != "Client") continue;
            Debug.Log("태그 Client — 협동 씬으로 자동 이동");
            StartCoop();
            return;
        }
    }
#endif

    // 혼자 하기 — 21주차에 완성한 그 게임. 네트워크가 전혀 안 끼어든다.
    public void StartGame()
    {
        SceneManager.LoadScene("Game");
    }

    // 같이 하기 — 협동 씬. 호스트/클라이언트 또는 Relay 코드로 붙는다.
    public void StartCoop()
    {
        SceneManager.LoadScene("Coop");
    }

    public void QuitGame()
    {
        // 에디터에서는 아무 일도 안 일어난다. 빌드한 게임에서만 꺼진다.
        Debug.Log("게임 종료");
        Application.Quit();
    }
}
