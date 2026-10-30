using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 결과 화면. 지난 판 기록을 보여주고 로비로 돌려보낸다.
public class ResultView : MonoBehaviour
{
    [SerializeField] private TMP_Text headline;
    [SerializeField] private TMP_Text body;
    [SerializeField] private Button lobbyButton;
    [SerializeField] private Button retryButton;

    private void Start()
    {
        GameSession s = GameSession.Instance;

        if (headline != null)
            headline.text = s != null && s.Cleared ? "클리어!" : "쓰러졌다";

        if (body != null && s != null)
        {
            int sec = Mathf.FloorToInt(s.Survived);
            body.text =
                $"스테이지   {(s.Stage != null ? s.Stage.title : "-")}\n" +
                $"버틴 시간   {sec / 60:00}:{sec % 60:00}\n" +
                $"처치        {s.Kills}\n" +
                $"레벨        {s.Level}";
        }

        if (lobbyButton != null) lobbyButton.onClick.AddListener(SceneFlow.GoLobby);
        if (retryButton != null && s != null && s.Stage != null)
            retryButton.onClick.AddListener(() => SceneFlow.GoGame(s.Stage));
    }
}
