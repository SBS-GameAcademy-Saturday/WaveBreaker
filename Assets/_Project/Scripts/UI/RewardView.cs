using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

// 레벨업 보상 창. 3택 1.
//
// 🔑 카드는 **런타임에 만든다.** 무엇을 보여줄지가 지금 가진 무기에 따라 달라지기 때문이다.
//    없는 무기의 강화 카드나, 이미 가진 무기의 획득 카드가 나오면 안 된다.
public class RewardView : MonoBehaviour
{
    public static RewardView Instance { get; private set; }

    [Header("참조")]
    [SerializeField] private GameObject panel;
    [SerializeField] private Button[] cardButtons = new Button[3];
    [SerializeField] private TMP_Text[] cardTitles = new TMP_Text[3];
    [SerializeField] private TMP_Text[] cardDescs = new TMP_Text[3];
    [SerializeField] private Image[] cardIcons = new Image[3];

    [Header("풀")]
    [SerializeField] private WeaponData[] allWeapons;
    [SerializeField] private WeaponFusionData[] allFusions;
    [SerializeField] private UpgradeData[] allStats;

    private WeaponInventory inv;
    private PlayerHealth health;
    private PlayerController move;
    private PlayerLevel level;

    private readonly List<Option> shown = new List<Option>();

    private void Awake()
    {
        Instance = this;
        if (panel != null) panel.SetActive(false);
    }

    private void Start()
    {
        GameObject p = GameObject.FindWithTag("Player");
        if (p == null) return;

        inv = p.GetComponentInChildren<WeaponInventory>();
        health = p.GetComponent<PlayerHealth>();
        move = p.GetComponent<PlayerController>();
        level = p.GetComponent<PlayerLevel>();
    }

    private struct Option
    {
        public string title, desc;
        public Sprite icon;
        public System.Action apply;
    }

    public void Open()
    {
        if (panel == null || inv == null) return;

        shown.Clear();
        shown.AddRange(Build().OrderBy(_ => Random.value).Take(3));
        if (shown.Count == 0) return;

        for (int i = 0; i < cardButtons.Length; i++)
        {
            bool on = i < shown.Count;
            if (cardButtons[i] != null) cardButtons[i].gameObject.SetActive(on);
            if (!on) continue;

            int k = i;
            if (cardTitles[i] != null) cardTitles[i].text = shown[i].title;
            if (cardDescs[i] != null) cardDescs[i].text = shown[i].desc;
            if (cardIcons[i] != null && shown[i].icon != null) cardIcons[i].sprite = shown[i].icon;

            cardButtons[i].onClick.RemoveAllListeners();
            cardButtons[i].onClick.AddListener(() => Choose(k));
        }

        panel.SetActive(true);

        // 🔑 시간을 멈춘다. UI 버튼은 timeScale 과 무관하게 눌린다.
        Time.timeScale = 0f;
        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Upgrading);
    }

    private List<Option> Build()
    {
        var list = new List<Option>();

        // ① 조합 — 가능하면 최우선으로 섞는다
        foreach (var f in allFusions ?? new WeaponFusionData[0])
        {
            if (f == null || !f.CanMake(inv)) continue;
            var cap = f;
            list.Add(new Option {
                title = $"★ {cap.result.title}",
                desc  = cap.description,
                icon  = cap.result.icon,
                apply = () => inv.Fuse(cap) });
        }

        // ② 무기 — 없으면 획득, 있으면 강화 (MAX 면 안 보여준다)
        foreach (var w in allWeapons ?? new WeaponData[0])
        {
            if (w == null) continue;
            var cap = w;

            if (!inv.Has(cap))
            {
                if (inv.IsFull) continue;
                list.Add(new Option {
                    title = cap.title,
                    desc  = "새 무기를 얻는다",
                    icon  = cap.icon,
                    apply = () => inv.Acquire(cap) });
            }
            else if (!inv.IsMax(cap))
            {
                int next = inv.LevelOf(cap) + 1;
                list.Add(new Option {
                    title = $"{cap.title} Lv.{next}",
                    desc  = "무기를 강화한다",
                    icon  = cap.icon,
                    apply = () => inv.LevelUp(cap) });
            }
        }

        // ③ 몸 강화 — 언제나 가능
        foreach (var s in allStats ?? new UpgradeData[0])
        {
            if (s == null) continue;
            var cap = s;
            list.Add(new Option {
                title = cap.title,
                desc  = cap.description,
                icon  = cap.icon,
                apply = () => ApplyStat(cap) });
        }

        return list;
    }

    private void ApplyStat(UpgradeData s)
    {
        switch (s.stat)
        {
            case StatKind.MaxHealth:   if (health != null) health.AddMax((int)s.value); break;
            case StatKind.MoveSpeed:   if (move != null) move.AddSpeed(s.value); break;
            case StatKind.PickupRange: if (level != null) level.AddPickupRange(s.value); break;
        }
    }

    private void Choose(int index)
    {
        if (index < shown.Count) shown[index].apply?.Invoke();

        panel.SetActive(false);
        Time.timeScale = 1f;
        if (GameManager.Instance != null) GameManager.Instance.ChangeState(GameState.Playing);
    }
}
