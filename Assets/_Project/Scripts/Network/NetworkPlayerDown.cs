using Unity.Netcode;
using UnityEngine;

// 122회차 · 다운과 부활. 기획서 11장 —
//   "쓰러진 상태(다운). 즉시 게임오버 아님. 동료가 3초간 곁에 있으면 체력 30으로 부활.
//    둘 다 다운되면 게임 오버."
//
// 🔑 이게 협동의 진짜 재미다. "혼자면 죽는데 둘이면 산다" 가 체감돼야 한다.
//
// 판정은 전부 서버가 한다(107). 클라이언트는 결과를 받아 보여주기만 한다.
public class NetworkPlayerDown : NetworkBehaviour
{
    [SerializeField] private int reviveHealth = 30;
    [SerializeField] private float reviveRange = 2f;
    [SerializeField] private float reviveTime = 3f;
    [SerializeField] private SpriteRenderer sprite;

    // 다운 상태는 모두가 알아야 한다.
    public NetworkVariable<bool> IsDown = new NetworkVariable<bool>(
        false, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    // 부활까지 남은 시간. 화면에 게이지로 보여주려고 동기화한다.
    public NetworkVariable<float> ReviveProgress = new NetworkVariable<float>(
        0f, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    private NetworkHealthDemo health;
    private Color aliveColor;

    private void Awake()
    {
        health = GetComponent<NetworkHealthDemo>();
        if (sprite == null) sprite = GetComponent<SpriteRenderer>();
    }

    public override void OnNetworkSpawn()
    {
        aliveColor = sprite != null ? sprite.color : Color.white;

        IsDown.OnValueChanged += OnDownChanged;

        if (IsServer) health.Health.OnValueChanged += OnHealthChanged;
    }

    public override void OnNetworkDespawn()
    {
        IsDown.OnValueChanged -= OnDownChanged;

        if (IsServer) health.Health.OnValueChanged -= OnHealthChanged;
    }

    // 양쪽 화면에서 불린다. 보여주는 일은 각자 한다.
    private void OnDownChanged(bool before, bool after)
    {
        if (sprite != null) sprite.color = after ? new Color(0.35f, 0.35f, 0.4f) : aliveColor;

        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 소유자 {OwnerClientId} " + (after ? "다운" : "부활"));
    }

    // 서버에서만 구독한다.
    private void OnHealthChanged(int before, int after)
    {
        if (after > 0 || IsDown.Value) return;

        IsDown.Value = true;
        ReviveProgress.Value = 0f;

        CheckAllDown();
    }

    private void Update()
    {
        // 🔑 판정은 서버만. 클라이언트는 IsDown 색만 보고 있으면 된다.
        if (!IsServer) return;
        if (!IsDown.Value) return;

        // 곁에 살아 있는 동료가 있나?
        bool helperNear = false;

        foreach (var client in NetworkManager.Singleton.ConnectedClientsList)
        {
            var obj = client.PlayerObject;
            if (obj == null || obj == NetworkObject) continue;

            if (!obj.TryGetComponent(out NetworkPlayerDown other)) continue;
            if (other.IsDown.Value) continue;   // 같이 쓰러진 사람은 못 살린다

            if (Vector2.Distance(transform.position, obj.transform.position) > reviveRange) continue;

            helperNear = true;
            break;
        }

        if (!helperNear)
        {
            // 떨어지면 처음부터. 그래야 "곁에 있어야 한다" 가 성립한다.
            ReviveProgress.Value = 0f;
            return;
        }

        ReviveProgress.Value += Time.deltaTime;

        if (ReviveProgress.Value < reviveTime) return;

        Revive();
    }

    private void Revive()
    {
        IsDown.Value = false;
        ReviveProgress.Value = 0f;

        health.SetHealth(reviveHealth);

        Debug.Log($"[호스트] 소유자 {OwnerClientId} 부활 — 체력 {reviveHealth}");
    }

    // 둘 다 다운이면 게임 오버.
    private void CheckAllDown()
    {
        foreach (var client in NetworkManager.Singleton.ConnectedClientsList)
        {
            var obj = client.PlayerObject;
            if (obj == null) continue;

            if (!obj.TryGetComponent(out NetworkPlayerDown d)) continue;
            if (!d.IsDown.Value) return;   // 한 명이라도 서 있으면 계속한다
        }

        Debug.Log("[호스트] 전멸 — 게임 오버");
    }
}
