using System.Collections;
using UnityEngine;

// Game 씬에서 "고른 스테이지" 를 실제로 적용한다.
public class StageRunner : MonoBehaviour
{
    [SerializeField] private StageData fallback;   // 직접 Game 씬을 열었을 때 쓸 것
    [SerializeField] private WaveManager waves;
    [SerializeField] private SpriteRenderer[] groundTiles;

    private StageData stage;
    private bool ended;

    private void Start()
    {
        stage = GameSession.Instance != null && GameSession.Instance.Stage != null
              ? GameSession.Instance.Stage
              : fallback;

        if (stage == null) return;

        if (stage.groundTile != null)
            foreach (var t in groundTiles)
            {
                if (t == null) continue;
                t.sprite = stage.groundTile;
                t.color = stage.groundTint;
            }

        Decorate();

        if (waves != null && stage.waves != null) waves.Begin(stage.waves);

        Debug.Log($"스테이지 시작 — {stage.title} ({stage.surviveSeconds:F0}초)");
    }

    // 🔑 장식을 **타일의 자식**으로 붙인다. 무한 맵이 타일을 반대편으로 옮길 때
    //    장식도 같이 따라가서, 돌아다녀도 늘 뭔가 깔려 있는 것처럼 보인다.
    private void Decorate()
    {
        if (stage.decorSprites == null || stage.decorSprites.Length == 0) return;

        foreach (var tile in groundTiles)
        {
            if (tile == null) continue;

            float half = tile.size.x * 0.5f;

            for (int i = 0; i < stage.decorPerTile; i++)
            {
                var go = new GameObject("Decor");
                go.transform.SetParent(tile.transform, false);
                go.transform.localPosition = new Vector3(
                    Random.Range(-half, half), Random.Range(-half, half), 0f);

                var sr = go.AddComponent<SpriteRenderer>();
                sr.sprite = stage.decorSprites[Random.Range(0, stage.decorSprites.Length)];
                sr.color = stage.decorTint;
                sr.sortingOrder = -5;        // 바닥(-10) 위, 캐릭터(9) 아래
            }
        }
    }

    private void Update()
    {
        if (ended || stage == null || GameManager.Instance == null) return;

        GameState s = GameManager.Instance.State;

        // 시간을 다 버티면 클리어
        if (s == GameState.Playing && waves != null && waves.Elapsed >= stage.surviveSeconds)
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

        StartCoroutine(GoAfter(1.2f));   // 잠깐 보여주고 넘긴다
    }

    // 🚨 Invoke 도 WaitForSeconds 도 timeScale 을 탄다.
    //    게임오버는 timeScale 을 0 으로 만들어서 **영원히 안 넘어간다.**
    //    실제로 겪은 버그다. Realtime 을 써야 한다.
    private System.Collections.IEnumerator GoAfter(float seconds)
    {
        yield return new WaitForSecondsRealtime(seconds);
        SceneFlow.GoResult();
    }
}
