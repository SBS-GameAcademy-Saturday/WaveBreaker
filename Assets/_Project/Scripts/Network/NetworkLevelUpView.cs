using TMPro;
using Unity.Netcode;
using UnityEngine;
using UnityEngine.UI;

// 123회차 · 레벨업하면 둘 다 멈추고, 각자 카드를 고른다.
//
// 🚨 084·098회차와 결정적으로 다른 점
//    싱글에서는 Time.timeScale = 0 으로 멈췄다. 협동에서는 그게 안 통한다.
//
//    내 화면에서만 timeScale 을 0 으로 하면 **내 게임만** 멈춘다.
//    상대 화면에서는 몬스터가 계속 오고, 서버도 계속 돈다.
//    돌아왔을 땐 이미 죽어 있다.
//
// 🔑 그래서 "멈춤" 을 서버가 들고 있는다 — NetworkTeam.Paused.
//    몬스터·스폰·이동이 전부 그 값을 본다.
public class NetworkLevelUpView : NetworkBehaviour
{
    [SerializeField] private GameObject panel;
    [SerializeField] private TMP_Text titleLabel;
    [SerializeField] private Button[] cards = new Button[3];
    [SerializeField] private TMP_Text[] cardLabels = new TMP_Text[3];

    private static readonly string[] upgradeNames = { "이동 속도 +", "공격력 +", "최대 체력 +" };

    // 서버만 쓴다. 이번 레벨업에서 몇 명이 골랐나.
    private int chosenCount;

    public override void OnNetworkSpawn()
    {
        if (panel != null) panel.SetActive(false);

        if (NetworkTeam.Instance != null)
            NetworkTeam.Instance.Level.OnValueChanged += OnLevelChanged;
    }

    public override void OnNetworkDespawn()
    {
        if (NetworkTeam.Instance != null)
            NetworkTeam.Instance.Level.OnValueChanged -= OnLevelChanged;
    }

    // 🔑 양쪽 화면에서 다 불린다(115). 그래서 둘 다 카드가 뜬다.
    private void OnLevelChanged(int before, int after)
    {
        // 서버가 게임을 멈춘다. 클라이언트는 부탁할 필요가 없다 —
        // 어차피 서버에서도 이 함수가 불리기 때문이다.
        if (IsServer)
        {
            chosenCount = 0;
            NetworkTeam.Instance.SetPaused(true);
        }

        Open(after);
    }

    private void Open(int level)
    {
        if (panel == null) return;

        panel.SetActive(true);

        if (titleLabel != null) titleLabel.text = $"레벨 업!  Lv.{level}";

        for (int i = 0; i < cards.Length; i++)
        {
            if (cardLabels[i] != null) cardLabels[i].text = upgradeNames[i % upgradeNames.Length];

            if (cards[i] == null) continue;

            int index = i;   // 반복문 변수를 그대로 쓰면 전부 마지막 값이 된다 (085 회수)

            cards[i].onClick.RemoveAllListeners();
            cards[i].onClick.AddListener(() => Choose(index));
        }
    }

    public void Choose(int index)
    {
        if (panel != null) panel.SetActive(false);

        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 카드 선택 — {upgradeNames[index % upgradeNames.Length]}");

        // 내가 골랐다고 서버에 알린다 (116 회수).
        ChoiceRpc(index);
    }

    [Rpc(SendTo.Server)]
    private void ChoiceRpc(int index)
    {
        // 여기부터 서버다.
        chosenCount++;

        int total = NetworkManager.Singleton.ConnectedClientsIds.Count;

        Debug.Log($"[호스트] 선택 {chosenCount}/{total}");

        // 🔑 둘 다 골라야 다시 움직인다. 한 명만 고르고 기다리는 게 협동이다.
        if (chosenCount < total) return;

        NetworkTeam.Instance.SetPaused(false);
    }
}
