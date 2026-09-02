using UnityEngine;
using UnityEngine.SceneManagement;

// 066회차 · 게임 전체 상태를 한 곳에서 들고 있는다.
// 이 프로젝트에서 싱글톤은 이것 하나만 허용한다.
// 075회차 · 처치 수를 여기서 센다.
// 080회차 · 게임오버에서 멈추고, R 로 다시 시작한다.
// 090회차 · 최종 보스를 잡으면 Clear 상태가 된다. 멈추는 건 게임오버와 같다.
public enum GameState
{
    Title,
    Playing,
    Upgrading,
    Paused,
    GameOver,
    Clear
}

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public GameState State { get; private set; } = GameState.Playing;

    public int Kills { get; private set; }

    public bool IsFinished => State == GameState.GameOver || State == GameState.Clear;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;

        // 게임오버로 멈춘 채 씬을 다시 열면 화면이 얼어 있다 (057).
        Time.timeScale = 1f;
    }

    void Update()
    {
        if (!IsFinished) return;

        if (Input.GetKeyDown(KeyCode.R))
        {
            Restart();
        }
    }

    public void ChangeState(GameState next)
    {
        State = next;

        Debug.Log("게임 상태: " + next);

        Time.timeScale = IsFinished ? 0f : 1f;
    }

    public void AddKill()
    {
        Kills++;
    }

    public void Restart()
    {
        Time.timeScale = 1f;   // 이걸 빼면 다시 열어도 멈춰 있다
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}
