using TMPro;
using UnityEngine;

// 075회차 · 웨이브와 처치 수를 화면에 띄운다. 056회차 점수 표시와 같은 구조다.
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
