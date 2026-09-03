using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

// 066회차 · 게임 전체 상태를 한 곳에서 들고 있는다.
// 이 프로젝트에서 싱글톤은 이것 하나만 허용한다.
// 075회차 · 처치 수를 여기서 센다.
// 080회차 · 게임오버에서 멈추고, R 로 다시 시작한다.
// 090회차 · 최종 보스를 잡으면 Clear 상태가 된다. 멈추는 건 게임오버와 같다.
// 097회차 · 끝나면 결과 씬으로 넘어간다. R 키와 화면 가운데 문구는 없앴다.
// 098회차 · Paused 도 멈춘다. timeScale 을 만지는 곳을 여기 하나로 모았다.
// 099회차 · 히트스톱.
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

    [SerializeField] private WaveManager waveManager;
    [SerializeField] private PlayerLevel playerLevel;

    public GameState State { get; private set; } = GameState.Playing;

    public int Kills { get; private set; }

    public bool IsFinished => State == GameState.GameOver || State == GameState.Clear;

    // 멈춰야 하는 상태인가. 끝났거나, 일시정지거나, 업그레이드 고르는 중이거나.
    //
    // 🔑 098회차 · timeScale 을 만지는 곳은 이 클래스 하나뿐이다.
    //    레벨업 창·일시정지·히트스톱이 각자 timeScale 을 만지면 서로를 덮어쓴다.
    //    실제로 그 버그를 겪었다 — 히트스톱이 끝나면서 레벨업 창의 멈춤을 풀어버렸다.
    private bool ShouldFreeze => IsFinished || State == GameState.Paused || State == GameState.Upgrading;

    private bool inHitStop;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;

        // 멈춘 채 씬을 다시 열면 화면이 얼어 있다 (057).
        Time.timeScale = 1f;

        // 103회차 · static 은 씬을 다시 열어도 안 사라진다 (097). 여기서 0 으로 되돌린다.
        Enemy.ResetAliveCount();
    }

    public void ChangeState(GameState next)
    {
        State = next;

        Debug.Log("게임 상태: " + next);

        Time.timeScale = ShouldFreeze ? 0f : 1f;

        if (IsFinished) GoResult();
    }

    public void AddKill()
    {
        Kills++;
    }

    // 097회차 · 이 판의 성적을 static 자리에 옮겨 적고 씬을 넘긴다.
    // 옮겨 적지 않으면 이 오브젝트와 함께 사라진다.
    private void GoResult()
    {
        RunResult.Record(
            waveManager != null ? waveManager.Elapsed : 0f,
            Kills,
            playerLevel != null ? playerLevel.Level : 1,
            State == GameState.Clear);

        Time.timeScale = 1f;   // 멈춘 채로 넘기면 결과 화면도 멈춰 있다

        SceneManager.LoadScene("Result");
    }

    // 099회차 · 때린 순간 아주 잠깐 멈춘다. 이게 "맞았다" 는 느낌의 8할이다.
    public void HitStop(float seconds)
    {
        if (ShouldFreeze) return;
        if (inHitStop) return;   // 겹치면 게임이 영영 멈춘다

        StartCoroutine(HitStopRoutine(seconds));
    }

    private IEnumerator HitStopRoutine(float seconds)
    {
        inHitStop = true;

        Time.timeScale = 0f;

        // WaitForSeconds 는 timeScale 이 0 이면 영원히 안 끝난다. Realtime 을 쓴다.
        yield return new WaitForSecondsRealtime(seconds);

        if (!ShouldFreeze) Time.timeScale = 1f;

        inHitStop = false;
    }
}
