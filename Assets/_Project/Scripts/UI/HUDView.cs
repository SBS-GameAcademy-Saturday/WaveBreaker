using TMPro;
using UnityEngine;

// 075회차 · 화면 위 표시. 056회차에서 배운 그대로다.
// 080회차 · 체력과 게임오버 문구가 붙었다.
// 083회차 · 레벨과 경험치가 붙었다.
// 090회차 · 경과 시간과 승리 문구가 붙었다.
public class HUDView : MonoBehaviour
{
    [SerializeField] private TMP_Text statusLabel;
    [SerializeField] private TMP_Text centerLabel;
    [SerializeField] private WaveManager waveManager;
    [SerializeField] private PlayerHealth playerHealth;
    [SerializeField] private PlayerLevel playerLevel;

    private void Update()
    {
        if (GameManager.Instance == null) return;

        if (statusLabel != null)
        {
            string time = "";
            string wave = "";

            if (waveManager != null)
            {
                int total = Mathf.FloorToInt(waveManager.Elapsed);
                time = $"{total / 60:00}:{total % 60:00}     ";
                wave = $"웨이브 {waveManager.Wave}     ";
            }

            string hp = playerHealth != null
                ? $"     체력 {playerHealth.Current}/{playerHealth.Max}" : "";

            string lv = playerLevel != null
                ? $"     Lv.{playerLevel.Level}  {playerLevel.Exp}/{playerLevel.NeedExp}" : "";

            statusLabel.text = $"{time}{wave}처치 {GameManager.Instance.Kills}{hp}{lv}";
        }

        if (centerLabel == null) return;

        bool finished = GameManager.Instance.IsFinished;

        centerLabel.gameObject.SetActive(finished);

        if (!finished) return;

        if (GameManager.Instance.State == GameState.Clear)
        {
            centerLabel.text = $"클리어!\n{GameManager.Instance.Kills}마리 처치\n\nR 키로 다시";
        }
        else
        {
            centerLabel.text = $"게임 오버\n{GameManager.Instance.Kills}마리 처치\n\nR 키로 다시";
        }
    }
}
