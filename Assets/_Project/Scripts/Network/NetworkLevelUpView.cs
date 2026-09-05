using System.Collections.Generic;
using TMPro;
using Unity.Netcode;
using UnityEngine;
using UnityEngine.UI;

// 123회차 · 레벨업하면 둘 다 멈추고, 각자 카드를 고른다.
// 132회차 · 카드가 진짜로 일을 한다. 그리고 무기를 "얻는" 카드가 생겼다.
//
// 🚨 084·098회차와 결정적으로 다른 점
//    싱글에서는 Time.timeScale = 0 으로 멈췄다. 협동에서는 그게 안 통한다.
//    내 화면에서만 멈추면 상대 화면에서는 몬스터가 계속 온다.
//    그래서 "멈춤" 을 서버가 들고 있는다 — NetworkTeam.Paused.
//
// 🔑 132회차 · 협동에서 카드가 까다로운 이유
//    ① 후보를 고르는 건 **내 화면**에서 한다 — 내가 뭘 가졌는지는 내 화면에도 다 있다.
//    ② 적용하는 건 **서버**가 한다 — 진짜 값은 서버 것이다(107).
//    그래서 "무엇을 골랐는지" 만 Rpc 로 보낸다. 고르는 일과 적용하는 일이 갈라져 있다.
public class NetworkLevelUpView : NetworkBehaviour
{
    [SerializeField] private GameObject panel;
    [SerializeField] private TMP_Text titleLabel;
    [SerializeField] private Button[] cards = new Button[3];
    [SerializeField] private TMP_Text[] cardLabels = new TMP_Text[3];

    // 싱글(089회차)과 **같은 에셋**을 쓴다. 카드 내용을 두 벌 관리하지 않는다.
    [SerializeField] private UpgradeData[] upgrades;

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
        if (IsServer)
        {
            chosenCount = 0;
            NetworkTeam.Instance.SetPaused(true);
        }

        Open(after);
    }

    // 내 캐릭터. 내가 뭘 가졌는지를 여기서 본다.
    private GameObject MyPlayer()
    {
        var nm = NetworkManager.Singleton;
        if (nm == null || nm.LocalClient.PlayerObject == null) return null;
        return nm.LocalClient.PlayerObject.gameObject;
    }

    private void Open(int level)
    {
        if (panel == null) return;

        panel.SetActive(true);

        if (titleLabel != null) titleLabel.text = $"레벨 업!  Lv.{level}";

        List<UpgradeData> picked = PickThree(MyPlayer());

        for (int i = 0; i < cards.Length; i++)
        {
            if (i >= picked.Count)
            {
                if (cards[i] != null) cards[i].gameObject.SetActive(false);
                continue;
            }

            UpgradeData data = picked[i];   // 반복문 변수를 그대로 쓰면 전부 마지막 값이 된다 (085 회수)

            if (cards[i] != null) cards[i].gameObject.SetActive(true);

            string head = UpgradeRule.IsAcquire(data.type)
                ? $"<color=#FFD35C>새 무기</color>\n{data.title}"
                : data.title;

            if (cardLabels[i] != null) cardLabels[i].text = $"{head}\n<size=60%>{data.description}";

            if (cards[i] == null) continue;

            cards[i].onClick.RemoveAllListeners();
            cards[i].onClick.AddListener(() => Choose(data));
        }
    }

    // 지금 보여줘도 되는 카드 중 서로 다른 3장.
    private List<UpgradeData> PickThree(GameObject player)
    {
        var ring = player != null ? player.GetComponent<NetworkMeleeRing>() : null;
        var slash = player != null ? player.GetComponent<NetworkSwordSlash>() : null;
        var gun = player != null ? player.GetComponent<NetworkPlayerAttack>() : null;

        System.Func<WeaponKind, bool> owns = kind =>
        {
            if (kind == WeaponKind.Gun) return gun != null && gun.Owned;
            if (kind == WeaponKind.Blade) return ring != null && ring.Owned;
            if (kind == WeaponKind.Slash) return slash != null && slash.Owned;
            return true;
        };

        List<UpgradeData> pool = new List<UpgradeData>();

        foreach (UpgradeData u in upgrades)
        {
            if (u == null) continue;
            if (!UpgradeRule.CanShow(u.type, owns)) continue;
            pool.Add(u);
        }

        List<UpgradeData> result = new List<UpgradeData>();

        while (result.Count < 3 && pool.Count > 0)
        {
            int index = Random.Range(0, pool.Count);
            result.Add(pool[index]);
            pool.RemoveAt(index);
        }

        return result;
    }

    public void Choose(UpgradeData data)
    {
        if (panel != null) panel.SetActive(false);

        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 카드 선택 — {data.title}");

        // 내가 골랐다고 서버에 알린다 (116 회수). 종류 번호만 보내면 된다.
        ChoiceRpc((int)data.type);
    }

    [Rpc(SendTo.Server)]
    private void ChoiceRpc(int typeValue, RpcParams rpcParams = default)
    {
        // 여기부터 서버다.
        ulong sender = rpcParams.Receive.SenderClientId;

        // 🔑 "누가 골랐나" 를 서버가 안다. 그 사람 캐릭터에만 적용한다.
        //    이걸 안 보고 아무에게나 적용하면 한 사람이 고른 게 둘 다에게 붙는다.
        if (NetworkManager.ConnectedClients.TryGetValue(sender, out var client)
            && client.PlayerObject != null)
        {
            Apply(client.PlayerObject.gameObject, (UpgradeType)typeValue);
        }

        chosenCount++;

        int total = NetworkManager.Singleton.ConnectedClientsIds.Count;

        Debug.Log($"[호스트] 선택 {chosenCount}/{total}");

        // 🔑 둘 다 골라야 다시 움직인다. 한 명만 고르고 기다리는 게 협동이다.
        if (chosenCount < total) return;

        NetworkTeam.Instance.SetPaused(false);
    }

    // 서버에서만 돈다.
    private void Apply(GameObject player, UpgradeType type)
    {
        UpgradeData data = Find(type);
        if (data == null) return;

        switch (type)
        {
            case UpgradeType.WeaponGun:
                player.GetComponent<NetworkPlayerAttack>()?.Acquire();
                break;

            case UpgradeType.WeaponBlade:
                player.GetComponent<NetworkMeleeRing>()?.Acquire();
                break;

            case UpgradeType.BladeCount:
                player.GetComponent<NetworkMeleeRing>()?.AddBlade((int)data.value);
                break;

            case UpgradeType.BladeDamage:
                player.GetComponent<NetworkMeleeRing>()?.AddDamage((int)data.value);
                break;

            case UpgradeType.WeaponSlash:
                player.GetComponent<NetworkSwordSlash>()?.Acquire();
                break;

            case UpgradeType.SlashDamage:
                player.GetComponent<NetworkSwordSlash>()?.AddDamage((int)data.value);
                break;

            case UpgradeType.SlashRate:
                player.GetComponent<NetworkSwordSlash>()?.SpeedUp(data.value, data.minLimit);
                break;

            case UpgradeType.GunDamage:
                player.GetComponent<NetworkPlayerAttack>()?.AddDamage((int)data.value);
                break;

            case UpgradeType.FireRate:
                player.GetComponent<NetworkPlayerAttack>()?.SpeedUp(data.value, data.minLimit);
                break;

            case UpgradeType.MoveSpeed:
                player.GetComponent<NetworkPlayerMove>()?.SpeedUp(data.value);
                break;

            case UpgradeType.MaxHealth:
                player.GetComponent<NetworkHealthDemo>()?.AddMaxHealth((int)data.value);
                break;
        }

        Debug.Log($"[호스트] 소유자 {player.GetComponent<NetworkObject>().OwnerClientId} — {data.title} 적용");
    }

    private UpgradeData Find(UpgradeType type)
    {
        foreach (UpgradeData u in upgrades)
            if (u != null && u.type == type) return u;

        return null;
    }
}
