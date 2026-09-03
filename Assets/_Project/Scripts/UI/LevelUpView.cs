using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 084·085회차 · 레벨업하면 시간이 멈추고 카드 3장이 뜬다.
// 086회차 · 업그레이드가 8종이 됐다.
// 096회차 · 창을 제대로 만들었다. 어둡게 깔고, 카드 3장을 가운데 놓는다.
// 098회차 · timeScale 을 직접 안 만진다. GameManager 에게 상태만 알린다.
// 089회차 · 종류와 수치를 코드에서 빼서 UpgradeData(SO) 배열로 옮겼다.
//           이제 카드를 추가하려면 에셋을 하나 더 만들어 배열에 넣으면 된다. 코드는 안 고친다.
public class LevelUpView : MonoBehaviour
{
    [SerializeField] private GameObject panel;
    [SerializeField] private Button[] buttons = new Button[3];
    [SerializeField] private TMP_Text[] labels = new TMP_Text[3];

    [SerializeField] private UpgradeData[] upgrades;

    [SerializeField] private MeleeRing meleeRing;
    [SerializeField] private AutoGun autoGun;
    [SerializeField] private PlayerController playerController;
    [SerializeField] private PlayerHealth playerHealth;

    public bool IsOpen => panel != null && panel.activeSelf;

    private void Start()
    {
        if (panel != null) panel.SetActive(false);
    }

    public void Open()
    {
        // 시간이 멈춘다. Update 는 계속 돌지만 Time.deltaTime 이 0 이라 아무것도 안 움직인다.
        // 098회차 · 멈추는 일 자체는 GameManager 가 한다. 여기선 "고르는 중" 이라고만 알린다.
        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Upgrading);
        else Time.timeScale = 0f;

        if (panel != null) panel.SetActive(true);

        List<UpgradeData> picked = PickThree();

        for (int i = 0; i < buttons.Length; i++)
        {
            if (i >= picked.Count)
            {
                if (buttons[i] != null) buttons[i].gameObject.SetActive(false);
                continue;
            }

            UpgradeData data = picked[i];   // 반복문 변수를 그대로 쓰면 전부 마지막 값이 된다

            if (buttons[i] != null) buttons[i].gameObject.SetActive(true);
            if (labels[i] != null) labels[i].text = $"{data.title}\n<size=60%>{data.description}";

            if (buttons[i] == null) continue;

            buttons[i].onClick.RemoveAllListeners();
            buttons[i].onClick.AddListener(() => Choose(data));
        }
    }

    public void Choose(UpgradeData data)
    {
        Apply(data);

        if (panel != null) panel.SetActive(false);

        // 이걸 빼면 게임이 영영 멈춰 있다
        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Playing);
        else Time.timeScale = 1f;
    }

    // 서로 다른 3개를 뽑는다.
    private List<UpgradeData> PickThree()
    {
        List<UpgradeData> pool = new List<UpgradeData>();

        foreach (UpgradeData u in upgrades)
        {
            if (u != null) pool.Add(u);
        }

        List<UpgradeData> result = new List<UpgradeData>();

        while (result.Count < 3 && pool.Count > 0)
        {
            int index = Random.Range(0, pool.Count);
            result.Add(pool[index]);
            pool.RemoveAt(index);   // 뽑은 건 빼야 중복이 안 나온다
        }

        return result;
    }

    private void Apply(UpgradeData data)
    {
        switch (data.type)
        {
            case UpgradeType.BladeCount:
                if (meleeRing != null) meleeRing.AddBlade((int)data.value);
                break;

            case UpgradeType.BladeSpeed:
                if (meleeRing != null) meleeRing.AddRotateSpeed(data.value);
                break;

            case UpgradeType.BladeDamage:
                if (meleeRing != null) meleeRing.AddBladeDamage((int)data.value);
                break;

            case UpgradeType.FireRate:
                if (autoGun != null) autoGun.SpeedUp(data.value, data.minLimit);
                break;

            case UpgradeType.GunDamage:
                if (autoGun != null) autoGun.AddDamage((int)data.value);
                break;

            case UpgradeType.Pierce:
                if (autoGun != null) autoGun.AddPierce((int)data.value);
                break;

            case UpgradeType.MoveSpeed:
                if (playerController != null) playerController.SpeedUp(data.value);
                break;

            case UpgradeType.MaxHealth:
                if (playerHealth != null) playerHealth.AddMaxHealth((int)data.value);
                break;
        }

        Debug.Log($"업그레이드 선택: {data.title} ({data.type})");
    }
}
