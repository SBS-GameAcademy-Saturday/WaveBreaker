using Unity.Netcode;
using UnityEngine;

// 115회차 · 값을 자동으로 맞춰주는 상자, NetworkVariable.
// 116회차 · 클라이언트가 값을 바꾸고 싶으면 Rpc 로 서버에 부탁한다.
//
// 위치는 NetworkTransform 이 맞춰줬다(112). 체력 같은 숫자는 이걸로 맞춘다.
//
// 🔑 규칙 두 가지
//    ① 값을 바꾸는 건 서버만 할 수 있다 (기본 설정)
//    ② 값이 바뀌면 모두에게 자동으로 전달된다
//
//    107회차의 "진짜 값은 서버에만 있다" 가 코드로 나타난 것이다.
public class NetworkHealthDemo : NetworkBehaviour
{
    [SerializeField] private int maxHealth = 20;

    // <int> 안의 값이 자동으로 동기화된다.
    // 뒤의 두 인자가 "누가 읽을 수 있나 / 누가 쓸 수 있나" 다.
    public NetworkVariable<int> Health = new NetworkVariable<int>(
        20,
        NetworkVariableReadPermission.Everyone,
        NetworkVariableWritePermission.Server);

    public override void OnNetworkSpawn()
    {
        // 값이 바뀔 때마다 불린다. 모두의 화면에서 불린다.
        Health.OnValueChanged += OnHealthChanged;

        // 처음 값은 서버가 정한다.
        if (IsServer) Health.Value = maxHealth;
    }

    public override void OnNetworkDespawn()
    {
        // 구독했으면 반드시 해제한다. 안 하면 사라진 오브젝트를 계속 부른다.
        Health.OnValueChanged -= OnHealthChanged;
    }

    private void OnHealthChanged(int before, int after)
    {
        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 소유자 {OwnerClientId} 체력 {before} → {after}");
    }

    // 🚨 서버에서만 부를 수 있다. 115회차에 여기서 벽에 부딪혔다.
    public void TakeDamage(int amount)
    {
        if (!IsServer)
        {
            Debug.LogWarning("체력은 서버만 바꿀 수 있다. RequestDamageRpc 를 쓴다.");
            return;
        }

        Health.Value = Mathf.Max(Health.Value - amount, 0);
    }

    // 132회차 · 상한이 오르고 그만큼 회복된다. 088회차 PlayerHealth 와 같은 규칙이다.
    public void AddMaxHealth(int step)
    {
        if (!IsServer) return;

        maxHealth += step;
        Health.Value = Mathf.Min(Health.Value + step, maxHealth);
    }

    // 122회차 · 부활할 때 쓴다. 서버만 부른다.
    public void SetHealth(int value)
    {
        if (!IsServer) return;

        Health.Value = Mathf.Max(value, 0);   // 부활 체력은 부르는 쪽이 정한다
    }

    // 116회차 · 클라이언트가 부르면 서버로 전달돼 서버에서 실행된다.
    //   같은 함수를 호스트가 불러도 잘 돈다 — 호스트는 이미 서버라서 바로 실행된다.
    [Rpc(SendTo.Server)]
    public void RequestDamageRpc(int amount)
    {
        // 여기부터는 서버다.
        TakeDamage(amount);
    }
}
