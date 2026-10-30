using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 보스전 동안만 뜨는 체력바.
//
// 🔑 매 프레임 적을 뒤지지 않는다. WaveManager 가 지금 보스를 들고 있으니
//    그것만 본다. 후반에 적이 백 마리씩 깔려도 비용이 그대로다.
public class BossHealthBar : MonoBehaviour
{
    [SerializeField] private GameObject root;
    [SerializeField] private Slider bar;
    [SerializeField] private TMP_Text label;

    private void Start()
    {
        if (root != null) root.SetActive(false);
    }

    private void Update()
    {
        Enemy boss = WaveManager.Instance != null ? WaveManager.Instance.CurrentBoss : null;
        bool show = boss != null && boss.gameObject.activeSelf;

        if (root != null && root.activeSelf != show) root.SetActive(show);
        if (!show) return;

        if (bar != null) bar.value = boss.HealthRatio;
        if (label != null) label.text = $"{boss.Data.title}   {Mathf.CeilToInt(boss.HealthRatio * 100f)}%";
    }
}
