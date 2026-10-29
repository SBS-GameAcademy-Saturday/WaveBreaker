using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 075회차 · 화면에 상태를 띄운다. 056회차 점수 표시와 같은 구조다.
//
// 🔑 HUD 는 **아무것도 바꾸지 않는다.** 읽어서 보여 주기만 한다.
//    체력을 깎는 건 PlayerHealth, 웨이브를 올리는 건 WaveManager 다.
//    여기서 값을 바꾸기 시작하면 "누가 바꿨는지" 를 못 찾게 된다.
public class HUDView : MonoBehaviour
{
    [Header("참조")]
    [SerializeField] private PlayerHealth playerHealth;
    [SerializeField] private WaveManager waveManager;

    [Header("체력")]
    [SerializeField] private Slider healthBar;
    [SerializeField] private TMP_Text healthText;

    [Header("숫자")]
    [SerializeField] private TMP_Text waveText;
    [SerializeField] private TMP_Text killText;

    private void Update()
    {
        if (playerHealth != null)
        {
            if (healthBar != null) healthBar.value = playerHealth.Ratio;
            if (healthText != null) healthText.text = $"{playerHealth.Current} / {playerHealth.Max}";
        }

        if (waveText != null && waveManager != null)
        {
            waveText.text = waveManager.Wave.ToString();
        }

        if (killText != null && GameManager.Instance != null)
        {
            killText.text = GameManager.Instance.Kills.ToString();
        }
    }
}
