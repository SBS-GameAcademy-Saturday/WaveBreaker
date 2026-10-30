using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 결과 화면. **씬이 아니라 Game 씬 안의 패널**이다.
//
// 🔑 씬을 넘기지 않으니 방금 죽은 전장이 뒤에 그대로 깔린다.
//    StageRunner 가 Show() 를 부를 때까지 꺼져 있다.
public class ResultView : MonoBehaviour
{
    public static ResultView Instance { get; private set; }

    [SerializeField] private GameObject panel;     // 켜고 끌 대상
    [SerializeField] private GameObject confetti;  // 이겼을 때만
    [SerializeField] private TMP_Text headline;    // 클리어! / 쓰러졌다
    [SerializeField] private TMP_Text stageLabel;
    [SerializeField] private TMP_Text timeValue;
    [SerializeField] private TMP_Text killValue;
    [SerializeField] private TMP_Text levelValue;
    [SerializeField] private Button retryButton;
    [SerializeField] private Button lobbyButton;
    [SerializeField] private GameObject hud;       // 결과창이 뜨면 가린다

    private void Awake()
    {
        Instance = this;
        if (panel != null) panel.SetActive(false);

        if (lobbyButton != null) lobbyButton.onClick.AddListener(SceneFlow.GoLobby);
        if (retryButton != null) retryButton.onClick.AddListener(Retry);
    }

    private void OnDestroy()
    {
        if (Instance == this) Instance = null;
    }

    public void Show(bool cleared)
    {
        // 🚨 레벨업 창이 열린 채로 죽으면 두 창이 포개진다.
        if (RewardView.Instance != null) RewardView.Instance.Close();

        GameSession s = GameSession.Instance;

        if (headline != null) headline.text = cleared ? "클리어!" : "쓰러졌다";
        if (confetti != null) confetti.SetActive(cleared);

        if (s != null)
        {
            int sec = Mathf.FloorToInt(s.Survived);
            if (stageLabel != null) stageLabel.text = s.Stage != null ? s.Stage.title : "-";
            if (timeValue != null) timeValue.text = $"{sec / 60:00}:{sec % 60:00}";
            if (killValue != null) killValue.text = s.Kills.ToString();
            if (levelValue != null) levelValue.text = s.Level.ToString();
        }

        if (hud != null) hud.SetActive(false);
        if (panel != null) panel.SetActive(true);
    }

    private void Retry()
    {
        // 🚨 Stage 가 비어 있으면 Game 씬이 fallback 으로 돌아 엉뚱한 판이 뜬다.
        StageData stage = GameSession.Instance != null ? GameSession.Instance.Stage : null;
        if (stage != null) SceneFlow.GoGame(stage);
        else SceneFlow.GoLobby();
    }
}
