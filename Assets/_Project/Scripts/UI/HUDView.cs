using TMPro;
using UnityEngine;

// 075회차 · 화면 위 표시. 056회차에서 배운 그대로다.
// 080회차 · 체력과 게임오버 문구가 붙었다.
// 083회차 · 레벨과 경험치가 붙었다.
// 090회차 · 경과 시간과 승리 문구가 붙었다.
// 097회차 · 화면 가운데 게임오버 문구를 없앴다. 이제 결과 씬이 그 일을 한다.
// 094·095회차 · 긴 한 줄(statusLabel)을 없앴다.
//   체력·경험치는 바(StatBar)로, 레벨·시간·처치 수는 화면 모서리에 따로 붙인다.
//   HUDView 가 하는 일은 그대로다 — "게임 상태를 읽어서 화면에 옮긴다".
public class HUDView : MonoBehaviour
{
    [Header("바 (094)")]
    [SerializeField] private StatBar healthBar;
    [SerializeField] private StatBar expBar;

    [Header("글자 (095)")]
    [SerializeField] private TMP_Text levelLabel;
    [SerializeField] private TMP_Text timeLabel;
    [SerializeField] private TMP_Text killLabel;

    [Header("읽어올 곳")]
    [SerializeField] private WaveManager waveManager;
    [SerializeField] private PlayerHealth playerHealth;
    [SerializeField] private PlayerLevel playerLevel;

    private void Update()
    {
        if (GameManager.Instance == null) return;

        if (healthBar != null && playerHealth != null)
        {
            healthBar.Set(playerHealth.Current, playerHealth.Max);
        }

        if (expBar != null && playerLevel != null)
        {
            expBar.Set(playerLevel.Exp, playerLevel.NeedExp);
        }

        if (levelLabel != null && playerLevel != null)
        {
            levelLabel.text = $"Lv.{playerLevel.Level}";
        }

        if (timeLabel != null && waveManager != null)
        {
            // 초를 분:초로 바꾼다. 00 은 "두 자리로, 빈 자리는 0으로" 라는 뜻이다.
            int total = Mathf.FloorToInt(waveManager.Elapsed);
            timeLabel.text = $"{total / 60:00}:{total % 60:00}";
        }

        if (killLabel != null)
        {
            killLabel.text = $"처치 {GameManager.Instance.Kills}";
        }
    }
}
