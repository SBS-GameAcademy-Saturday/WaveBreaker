using Unity.Netcode;
using Unity.Netcode.Components;
using UnityEngine;

// 116·119회차 · 클라이언트는 몬스터를 직접 못 때린다. 서버에 부탁한다.
//
// 🔑 왜 직접 때리면 안 되나
//    몬스터 체력은 서버 것이다(107·115). 클라이언트가 자기 화면에서 깎아봐야
//    그건 사본일 뿐이고, 서버는 모른다. 두 사람의 화면이 갈라진다.
//
//    그래서 "때렸다" 고 **알리고**, 판정은 서버가 한다.
//    알리는 방법이 Rpc 다.
public class NetworkPlayerAttack : NetworkBehaviour
{
    [SerializeField] private float range = 3f;
    [SerializeField] private int damage = 3;
    [SerializeField] private float interval = 0.6f;
    [SerializeField] private NetworkAnimator netAnim;

    private float nextFire;

    // 132회차 · 총도 얻는 무기다. 시작 무기는 검기 하나.
    public NetworkVariable<bool> HasGun = new NetworkVariable<bool>(
        false, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public bool Owned => HasGun.Value;

    public void Acquire()
    {
        if (!IsServer || HasGun.Value) return;
        HasGun.Value = true;
    }

    // 132회차 · 레벨업으로 세진다. 서버만 바꾼다 — 진짜 값은 서버 것이다(107).
    public void AddDamage(int step)
    {
        if (!IsServer) return;
        damage += step;
    }

    public void SpeedUp(float step, float min)
    {
        if (!IsServer) return;
        interval = Mathf.Max(interval - step, Mathf.Max(min, 0.1f));
    }

    private void Update()
    {
        // 공격을 시도하는 건 내 캐릭터만 (114 회수).
        if (!IsOwner) return;

        if (!HasGun.Value) return;      // 아직 총이 없다

        if (Time.time < nextFire) return;

        NetworkEnemy target = FindNearest();
        if (target == null) return;

        nextFire = Time.time + interval;

        // 132회차 · 공격 자세는 검기(NetworkSwordSlash)가 켠다. 한 무기이기 때문이다.

        // 🔑 여기가 오늘의 핵심.
        //    내가 직접 target.TakeDamage(damage) 를 부르지 않는다.
        //    "저 몬스터를 때렸다" 고 서버에 알린다.
        AttackServerRpc(target.NetworkObjectId, damage);
    }

    // [Rpc(SendTo.Server)] = "이 함수를 서버에서 실행해 달라"
    // 클라이언트가 부르면 서버로 전달되고, 서버에서 몸통이 실행된다.
    [Rpc(SendTo.Server)]
    private void AttackServerRpc(ulong targetId, int amount, RpcParams rpcParams = default)
    {
        // 여기부터는 서버다. 아래 코드는 호스트 컴퓨터에서만 돈다.
        if (!NetworkManager.SpawnManager.SpawnedObjects.TryGetValue(targetId, out NetworkObject obj)) return;

        if (!obj.TryGetComponent(out NetworkEnemy enemy)) return;

        // 🚨 실제 게임이라면 여기서 검사를 해야 한다.
        //    "정말 사거리 안인가?", "쿨타임을 지켰나?"
        //    클라이언트 말을 그대로 믿으면 치트가 된다.
        enemy.TakeDamage(amount);
    }

    private NetworkEnemy FindNearest()
    {
        NetworkEnemy nearest = null;
        float min = range;

        foreach (var e in Object.FindObjectsByType<NetworkEnemy>())
        {
            float d = Vector2.Distance(transform.position, e.transform.position);
            if (d > min) continue;

            min = d;
            nearest = e;
        }

        return nearest;
    }
}
