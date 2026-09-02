using TMPro;
using UnityEngine;

// 075회차 · 화면 위 표시. 056회차에서 배운 그대로다.
public class HUDView : MonoBehaviour
{
    [SerializeField] private TMP_Text label;
    [SerializeField] private WaveManager waveManager;

    private void Update()
    {
        if (GameManager.Instance == null || waveManager == null) return;

        label.text = $"웨이브 {waveManager.Wave}     처치 {GameManager.Instance.Kills}";
    }
}
