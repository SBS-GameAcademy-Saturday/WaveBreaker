using UnityEngine;

// 씬이 바뀌어도 남아야 하는 것. 고른 스테이지와 지난 판의 결과.
//
// 🔑 씬을 넘길 때 값을 들고 가는 방법이 몇 가지 있는데, 가장 단순한 건
//    **안 지워지는 오브젝트 하나**를 두는 것이다.
public class GameSession : MonoBehaviour
{
    public static GameSession Instance { get; private set; }

    public StageData Stage { get; private set; }

    // 지난 판 결과
    public bool Cleared { get; private set; }
    public int Kills { get; private set; }
    public float Survived { get; private set; }
    public int Level { get; private set; }

    private void Awake()
    {
        // 🚨 로비로 돌아올 때마다 새로 생기면 안 된다.
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }

        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void Select(StageData s) => Stage = s;

    public void Record(bool cleared, int kills, float survived, int level)
    {
        Cleared = cleared; Kills = kills; Survived = survived; Level = level;
    }

    // 세션이 없을 때도 게임이 돌게 한다 (Game 씬을 직접 열어 테스트할 때)
    public static GameSession Ensure()
    {
        if (Instance == null) new GameObject("GameSession").AddComponent<GameSession>();
        return Instance;
    }
}
