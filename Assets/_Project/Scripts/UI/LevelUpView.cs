using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 084·085회차 · 레벨업하면 시간이 멈추고 카드 3장이 뜬다.
//
// 084 — Time.timeScale = 0 으로 멈추고, 아무 키나 누르면 다시 흐르게 한다.
// 085 — 서로 다른 업그레이드 3개를 뽑아 카드에 올리고, 고르면 적용한다.
public class LevelUpView : MonoBehaviour
{
    [SerializeField] private GameObject panel;
    [SerializeField] private Button[] buttons = new Button[3];
    [SerializeField] private TMP_Text[] labels = new TMP_Text[3];

    [SerializeField] private MeleeRing meleeRing;
    [SerializeField] private AutoGun autoGun;
    [SerializeField] private PlayerController playerController;

    public bool IsOpen => panel != null && panel.activeSelf;

    private void Start()
    {
        if (panel != null) panel.SetActive(false);
    }

    public void Open()
    {
        // 시간이 멈춘다. Update 는 계속 돌지만 Time.deltaTime 이 0 이라 아무것도 안 움직인다.
        Time.timeScale = 0f;

        if (panel != null) panel.SetActive(true);

        List<UpgradeType> picked = PickThree();

        for (int i = 0; i < buttons.Length; i++)
        {
            UpgradeType type = picked[i];   // 반복문 변수를 그대로 쓰면 전부 마지막 값이 된다

            if (labels[i] != null) labels[i].text = Describe(type);

            if (buttons[i] == null) continue;

            buttons[i].onClick.RemoveAllListeners();
            buttons[i].onClick.AddListener(() => Choose(type));
        }
    }

    public void Choose(UpgradeType type)
    {
        Apply(type);

        if (panel != null) panel.SetActive(false);

        Time.timeScale = 1f;   // 이걸 빼면 게임이 영영 멈춰 있다
    }

    // 서로 다른 3개를 뽑는다. 종류가 3개뿐이라 지금은 전부 나온다.
    private List<UpgradeType> PickThree()
    {
        List<UpgradeType> all = new List<UpgradeType>
        {
            UpgradeType.BladeCount,
            UpgradeType.FireRate,
            UpgradeType.MoveSpeed
        };

        List<UpgradeType> result = new List<UpgradeType>();

        while (result.Count < 3 && all.Count > 0)
        {
            int index = Random.Range(0, all.Count);
            result.Add(all[index]);
            all.RemoveAt(index);
        }

        return result;
    }

    private string Describe(UpgradeType type)
    {
        switch (type)
        {
            case UpgradeType.BladeCount: return "칼 +1\n<size=60%>주위를 도는 칼이 늘어난다";
            case UpgradeType.FireRate: return "연사 +\n<size=60%>총이 더 자주 나간다";
            case UpgradeType.MoveSpeed: return "이동 +\n<size=60%>더 빨리 움직인다";
        }
        return "";
    }

    private void Apply(UpgradeType type)
    {
        switch (type)
        {
            case UpgradeType.BladeCount:
                if (meleeRing != null) meleeRing.AddBlade();
                break;

            case UpgradeType.FireRate:
                if (autoGun != null) autoGun.SpeedUp(0.06f, 0.12f);
                break;

            case UpgradeType.MoveSpeed:
                if (playerController != null) playerController.SpeedUp(0.6f);
                break;
        }

        Debug.Log($"업그레이드 선택: {type}");
    }
}
