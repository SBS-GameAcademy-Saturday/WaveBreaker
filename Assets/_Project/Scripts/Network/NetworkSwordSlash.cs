using Unity.Netcode;
using UnityEngine;

// 132회차 · 협동판 검기. SwordSlash 의 네트워크판이다. **시작 무기**다.
//
// 🔑 세 가지를 나눠서 보낸다
//    ① "얼마나 센가"        → NetworkVariable (오래 남는 값 · 서버가 쓴다)
//    ② "어느 쪽을 보는가"    → NetworkVariable (오래 남는 값 · 그 사람이 쓴다 → NetworkPlayerMove)
//    ③ "지금 휘둘렀다"      → Rpc (한순간의 사건이라 값으로 둘 수 없다)
//
//    115회차에서 배운 구분이다. **남아 있는 값은 NetworkVariable, 순간의 사건은 Rpc.**
public class NetworkSwordSlash : NetworkBehaviour
{
    [SerializeField] private GameObject slashEffect;
    [SerializeField] private SpriteRenderer bodySprite;
    [SerializeField] private NetworkPlayerMove move;
    [SerializeField] private float width = 3.2f;
    [SerializeField] private float height = 2.0f;
    [SerializeField] private float baseInterval = 1.2f;

    public NetworkVariable<bool> HasSlash = new NetworkVariable<bool>(
        false, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public NetworkVariable<int> Damage = new NetworkVariable<int>(
        6, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public NetworkVariable<float> Interval = new NetworkVariable<float>(
        1.2f, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public bool Owned => HasSlash.Value;

    private float nextSwing;

    public override void OnNetworkSpawn()
    {
        if (move == null) move = GetComponent<NetworkPlayerMove>();

        if (!IsServer) return;

        Interval.Value = baseInterval;

        // 🔑 시작 무기는 이것 하나다. 총·회전 칼은 레벨업으로 얻는다.
        HasSlash.Value = true;
    }

    // 바라보는 쪽. 그 사람이 정한 값을 서버도 그대로 읽는다.
    private Vector2 Facing => (move != null && move.FacingLeft.Value) ? Vector2.left : Vector2.right;

    private Vector2 AreaCenter(Vector2 dir) => (Vector2)transform.position + dir * (width * 0.5f);

    private void Update()
    {
        // 🔑 휘두를 때를 정하는 것도 판정도 서버가 한다 (117 규칙).
        //    방향만 그 사람 것을 읽어 온다.
        if (!IsServer) return;
        if (!HasSlash.Value) return;
        if (NetworkTeam.IsPaused) return;
        if (Time.time < nextSwing) return;

        nextSwing = Time.time + Interval.Value;

        Vector2 dir = Facing;
        int hitCount = 0;

        foreach (Collider2D hit in Physics2D.OverlapBoxAll(AreaCenter(dir), new Vector2(width, height), 0f))
        {
            if (!hit.TryGetComponent(out NetworkEnemy enemy)) continue;

            enemy.TakeDamage(Damage.Value);
            hitCount++;
        }

        // 그림은 모두의 화면에서 나와야 한다. 방향을 같이 보낸다.
        SwingRpc(dir.x < 0f);

        if (hitCount > 0) Debug.Log($"[호스트] 검기 — {hitCount}마리를 한 번에 벴다");
    }

    // 🔑 한 번의 방송으로 "사람이 휘두르는 그림" 과 "검기 그림" 을 같이 켠다.
    //    둘은 한 무기라 따로 보내면 어긋난다.
    //    Attack 트리거를 NetworkAnimator 로 안 보내는 이유 —
    //    플레이어 애니메이터는 Owner 권한이라 서버가 민 트리거가 안 간다(22.2).
    [Rpc(SendTo.Everyone)]
    private void SwingRpc(bool left)
    {
        var anim = GetComponent<Animator>();
        if (anim != null) anim.SetTrigger("Attack");

        if (slashEffect == null) return;

        Vector2 dir = left ? Vector2.left : Vector2.right;
        GameObject fx = PoolManager.Spawn(slashEffect, AreaCenter(dir), Quaternion.identity);

        if (fx != null && fx.TryGetComponent(out SpriteRenderer sr)) sr.flipX = left;
    }

    // ---- 서버만 부른다 ----
    public void Acquire()
    {
        if (!IsServer || HasSlash.Value) return;
        HasSlash.Value = true;
    }

    public void AddDamage(int step)
    {
        if (!IsServer) return;
        Damage.Value += step;
    }

    public void SpeedUp(float step, float min)
    {
        if (!IsServer) return;
        Interval.Value = Mathf.Max(Interval.Value - step, Mathf.Max(min, 0.2f));
    }
}
