using UnityEngine;
using UnityEngine.SceneManagement;

// 097회차 · 타이틀 화면. 하는 일이 두 개뿐이라 스크립트도 두 줄이다.
public class TitleView : MonoBehaviour
{
    public void StartGame()
    {
        SceneManager.LoadScene("Game");
    }

    public void QuitGame()
    {
        // 에디터에서는 아무 일도 안 일어난다. 빌드한 게임에서만 꺼진다.
        Debug.Log("게임 종료");
        Application.Quit();
    }
}
