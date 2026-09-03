using UnityEngine;
using UnityEngine.SceneManagement;

// 098회차 · ESC 로 멈추고 다시 ESC 로 푼다.
// 084회차의 레벨업 창과 하는 일이 같다 — timeScale 을 0 으로 만들었다가 되돌린다.
public class PauseView : MonoBehaviour
{
    [SerializeField] private GameObject panel;
    [SerializeField] private LevelUpView levelUpView;

    public bool IsOpen => panel != null && panel.activeSelf;

    private void Start()
    {
        if (panel != null) panel.SetActive(false);
    }

    private void Update()
    {
        if (!Input.GetKeyDown(KeyCode.Escape)) return;

        // 게임이 끝난 뒤엔 안 먹는다.
        if (GameManager.Instance != null && GameManager.Instance.IsFinished) return;

        // 레벨업 창이 떠 있는데 ESC 를 누르면 둘 다 timeScale 을 만지며 싸운다.
        // 먼저 뜬 쪽이 이긴다.
        if (levelUpView != null && levelUpView.IsOpen) return;

        if (IsOpen) Resume();
        else Open();
    }

    public void Open()
    {
        if (panel != null) panel.SetActive(true);

        // 멈추는 일은 GameManager 가 한다. timeScale 주인은 하나여야 한다.
        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Paused);
    }

    public void Resume()
    {
        if (panel != null) panel.SetActive(false);

        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Playing);
    }

    public void GoTitle()
    {
        // 이걸 빼면 타이틀 화면이 멈춘 채로 뜬다. 084에서 배운 그 사고다.
        Time.timeScale = 1f;

        SceneManager.LoadScene("Title");
    }
}
