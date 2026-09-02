using TMPro;
using UnityEngine;

// 075회차 · 화면 위 표시. 056회차에서 배운 그대로다.
// 080회차 · 체력과 게임오버 문구가 붙었다.
public class HUDView : MonoBehaviour
{
    [SerializeField] private TMP_Text statusLabel;
    [SerializeField] private TMP_Text centerLabel;
    [SerializeField] private WaveManager waveManager;
    [SerializeField] private PlayerHealth playerHealth;

    private void Update()
    {
        if (GameManager.Instance == null) return;

        if (statusLabel != null)
        {
            string hp = playerHealth != null
                ? $"     체력 {playerHealth.Current}/{playerHealth.Max}" : "";
            int wave = waveManager != null ? waveManager.Wave : 1;

            statusLabel.text = $"웨이브 {wave}     처치 {GameManager.Instance.Kills}{hp}";
        }

        if (centerLabel == null) return;

        bool over = GameManager.Instance.State == GameState.GameOver;

        centerLabel.gameObject.SetActive(over);

        if (over)
        {
            centerLabel.text = $"게임 오버\n{GameManager.Instance.Kills}마리 처치\n\nR 키로 다시";
        }
    }
}
