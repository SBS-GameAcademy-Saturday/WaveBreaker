using Unity.Netcode;
using UnityEngine;

// 118회차 · 팀 경험치. 기획서 11장 — "경험치는 공유. 젬은 누가 먹어도 팀 경험치."
//
// 값을 바꾸는 건 서버만 한다(115). 젬을 누가 먹었든 판정은 서버가 하므로
// 여기 들어오는 건 언제나 서버다.
public class NetworkTeam : NetworkBehaviour
{
    public static NetworkTeam Instance { get; private set; }

    [SerializeField] private int baseExp = 5;
    [SerializeField] private int expStep = 3;

    public NetworkVariable<int> Exp = new NetworkVariable<int>(
        0, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public NetworkVariable<int> Level = new NetworkVariable<int>(
        1, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public int NeedExp => baseExp + (Level.Value - 1) * expStep;

    private void Awake()
    {
        Instance = this;
    }

    public override void OnNetworkSpawn()
    {
        Level.OnValueChanged += OnLevelChanged;
    }

    public override void OnNetworkDespawn()
    {
        Level.OnValueChanged -= OnLevelChanged;
    }

    private void OnLevelChanged(int before, int after)
    {
        // 양쪽 화면에서 다 불린다. 123회차에 여기서 레벨업 창을 띄운다.
        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 팀 레벨 {before} → {after}");
    }

    // 서버만 부른다.
    public void AddExp(int amount)
    {
        if (!IsServer) return;

        Exp.Value += amount;

        // 한 번에 두 레벨이 오를 수도 있다 (083 회수).
        while (Exp.Value >= NeedExp)
        {
            Exp.Value -= NeedExp;
            Level.Value++;
        }
    }
}
