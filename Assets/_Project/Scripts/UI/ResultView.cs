using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;

// 097회차 · 결과 화면. GameManager 가 아니라 RunResult 에서 읽는다.
// GameManager 는 Game 씬과 함께 이미 사라졌기 때문이다.
public class ResultView : MonoBehaviour
{
    [SerializeField] private TMP_Text titleLabel;
    [SerializeField] private TMP_Text timeLabel;
    [SerializeField] private TMP_Text killLabel;
    [SerializeField] private TMP_Text levelLabel;

    private void Start()
    {
        // 결과 화면은 멈춰 있으면 안 된다. 앞 씬에서 0 으로 두고 넘어왔다.
        Time.timeScale = 1f;

        if (titleLabel != null)
            titleLabel.text = RunResult.Cleared ? "클리어!" : "게임 오버";

        if (timeLabel != null)
        {
            int total = Mathf.FloorToInt(RunResult.Time);
            timeLabel.text = $"생존 시간   {total / 60:00}:{total % 60:00}";
        }

        if (killLabel != null) killLabel.text = $"처치 수   {RunResult.Kills}";
        if (levelLabel != null) levelLabel.text = $"최종 레벨   {RunResult.Level}";
    }

    public void Retry()
    {
        SceneManager.LoadScene("Game");
    }

    public void GoTitle()
    {
        SceneManager.LoadScene("Title");
    }
}
