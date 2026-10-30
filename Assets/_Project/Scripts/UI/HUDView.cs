using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 화면에 상태를 띄운다. **읽기만 한다.**
public class HUDView : MonoBehaviour
{
    [Header("참조")]
    [SerializeField] private PlayerHealth playerHealth;
    [SerializeField] private PlayerLevel playerLevel;
    [SerializeField] private WaveManager waveManager;

    [Header("체력")]
    [SerializeField] private Slider healthBar;
    [SerializeField] private TMP_Text healthText;

    [Header("경험치")]
    [SerializeField] private Slider expBar;
    [SerializeField] private TMP_Text levelText;

    [Header("숫자")]
    [SerializeField] private TMP_Text timeText;
    [SerializeField] private TMP_Text killText;

    private void Update()
    {
        if (playerHealth != null)
        {
            if (healthBar != null) healthBar.value = playerHealth.Ratio;
            if (healthText != null) healthText.text = $"{playerHealth.Current} / {playerHealth.Max}";
        }

        if (playerLevel != null)
        {
            if (expBar != null) expBar.value = playerLevel.Ratio;
            if (levelText != null) levelText.text = $"Lv.{playerLevel.Level}";
        }

        if (timeText != null && waveManager != null)
        {
            int s = Mathf.FloorToInt(waveManager.Elapsed);
            timeText.text = $"{s / 60:00}:{s % 60:00}";
        }

        if (killText != null && GameManager.Instance != null)
        {
            killText.text = GameManager.Instance.Kills.ToString();
        }
    }
}
