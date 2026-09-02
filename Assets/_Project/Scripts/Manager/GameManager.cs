using UnityEngine;

// 066회차 · 게임 전체 상태를 한 곳에서 들고 있는다.
// 이 프로젝트에서 싱글톤은 이것 하나만 허용한다.
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

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
    }

    public void ChangeState(GameState next)
    {
        State = next;

        Debug.Log("게임 상태: " + next);
    }
}
