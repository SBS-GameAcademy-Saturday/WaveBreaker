using UnityEngine;

// 게임의 상태를 한 곳에서 들고 있는다.
//
// 🔑 bool 을 늘리면 "일시정지이면서 게임오버" 같은 있을 수 없는 조합이 생긴다.
//    상태는 언제나 하나다. 그걸 타입으로 못박는 게 enum 이다.
public enum GameState { Title, Playing, Upgrading, Paused, GameOver, Clear }

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    public GameState State { get; private set; } = GameState.Playing;
    public int Kills { get; private set; }

    public System.Action<GameState> OnStateChanged;

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
    }

    public void AddKill() => Kills++;

    public void ChangeState(GameState next)
    {
        if (State == next) return;

        State = next;
        Debug.Log("게임 상태: " + next);

        // 🚨 멈추는 상태는 timeScale 을 0 으로. 다시 돌 때 반드시 1 로 되돌린다.
        Time.timeScale = (next == GameState.GameOver || next == GameState.Clear) ? 0f : Time.timeScale;

        OnStateChanged?.Invoke(next);
    }
}
