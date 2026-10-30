using System.Collections;
using UnityEngine;

// Game 씬에서 "고른 스테이지" 를 실제로 적용한다.
public class StageRunner : MonoBehaviour
{
    [SerializeField] private StageData fallback;   // 직접 Game 씬을 열었을 때 쓸 것
    [SerializeField] private WaveManager waves;
    [SerializeField] private InfiniteTilemapGround ground;

    private StageData stage;
    private bool ended;

    private void Start()
    {
        stage = GameSession.Instance != null && GameSession.Instance.Stage != null
              ? GameSession.Instance.Stage
              : fallback;

        if (stage == null) return;

        // 바닥과 장식은 타일맵 쪽이 전부 맡는다.
        if (ground != null) ground.Setup(stage);

        if (waves != null && stage.waves != null) waves.Begin(stage.waves, stage.surviveSeconds);

        Debug.Log($"스테이지 시작 — {stage.title} ({stage.surviveSeconds:F0}초)");
    }

    private void Update()
    {
        if (ended || stage == null || GameManager.Instance == null) return;

        GameState s = GameManager.Instance.State;

        // 🔑 시계가 아니라 보스가 끝을 정한다.
        //    10분을 버티면 보스가 나오고, 그 보스를 잡아야 클리어다.
        //
        // 🚨 Playing 일 때만 보면 안 된다. 보스를 잡는 순간 경험치가 들어와
        //    **레벨업 창이 떠 있는** 경우가 흔한데(Upgrading), 그러면 그 판은
        //    영영 안 끝난다. 실제로 겪은 버그다.
        if (s != GameState.GameOver && s != GameState.Clear
            && waves != null && waves.BossDefeated)
        {
            GameManager.Instance.ChangeState(GameState.Clear);
            return;
        }

        if (s != GameState.GameOver && s != GameState.Clear) return;

        ended = true;
        Finish(s == GameState.Clear);
    }

    private void Finish(bool cleared)
    {
        var p = GameObject.FindWithTag("Player");
        int level = p != null && p.TryGetComponent(out PlayerLevel pl) ? pl.Level : 1;

        GameSession.Ensure().Record(
            cleared,
            GameManager.Instance.Kills,
            waves != null ? waves.Elapsed : 0f,
            level);

        StartCoroutine(ShowResultAfter(1.2f, cleared));   // 잠깐 보여주고 띄운다
    }

    // 🚨 Invoke 도 WaitForSeconds 도 timeScale 을 탄다.
    //    게임오버는 timeScale 을 0 으로 만들어서 **영원히 안 불린다.**
    //    실제로 겪은 버그다. Realtime 을 써야 한다.
    private IEnumerator ShowResultAfter(float seconds, bool cleared)
    {
        yield return new WaitForSecondsRealtime(seconds);

        if (ResultView.Instance != null) ResultView.Instance.Show(cleared);
        else SceneFlow.GoLobby();   // 결과 패널이 없는 씬에서도 멈추지는 않게
    }
}
