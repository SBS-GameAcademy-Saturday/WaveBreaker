using UnityEngine;

// 066회차 · 게임의 상태를 한 곳에서 들고 있는다.
//
// 🔑 왜 bool 이 아니라 enum 인가
//    isPaused, isGameOver, isUpgrading 처럼 bool 을 늘리면
//    "일시정지이면서 게임오버" 같은 **있을 수 없는 조합**이 만들어진다.
//    상태는 언제나 하나다. 그걸 타입으로 못박는 게 enum 이다.
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
        // 🚨 씬을 다시 열면 Instance 가 두 개가 된다. 늦게 온 쪽이 물러난다.
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
    }

    // 075회차 · 처치 수. 몬스터가 죽을 때 Enemy.Die() 가 올려 준다.
    public int Kills { get; private set; }

    public void AddKill()
    {
        Kills++;
    }

    public void ChangeState(GameState next)
    {
        State = next;

        Debug.Log("게임 상태: " + next);
    }
}
