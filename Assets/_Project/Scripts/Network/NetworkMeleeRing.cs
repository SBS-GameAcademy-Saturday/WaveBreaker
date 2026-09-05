using Unity.Netcode;
using UnityEngine;

// 132회차 · 협동판 "회전하는 칼". 076회차 MeleeRing 의 네트워크판이다.
//
// 🔑 칼을 NetworkObject 로 만들지 않는다.
//    칼은 플레이어를 따라 도는 장식이다. 자루마다 네트워크 오브젝트를 만들면
//    한 사람이 칼 6자루를 들면 오브젝트가 6개 늘고, 그게 매 프레임 위치를 보낸다.
//    보낼 값은 **"몇 자루인가" 하나면 충분하다.** 그리는 건 각자 한다.
//
// 🚨 그래서 회전 각도는 사람마다 조금씩 다르다. 눈으로는 안 보이지만
//    피해 판정을 각자 하면 결과가 갈린다. 그래서 **때리는 건 서버만** 한다(117 규칙).
public class NetworkMeleeRing : NetworkBehaviour
{
    [SerializeField] private GameObject bladePrefab;      // 그림용. 네트워크 오브젝트가 아니다
    [SerializeField] private float radius = 1.6f;
    [SerializeField] private float rotateSpeed = 180f;
    [SerializeField] private float hitInterval = 0.3f;
    [SerializeField] private float bladeHitRadius = 0.45f;

    // 보내는 값은 이 둘뿐이다.
    public NetworkVariable<int> BladeCount = new NetworkVariable<int>(
        0, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public NetworkVariable<int> BladeDamage = new NetworkVariable<int>(
        3, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    public bool Owned => BladeCount.Value > 0;

    private Transform ring;          // 제자리에서 도는 빈 오브젝트. 칼은 이 자식이다
    private float nextHitTime;

    public override void OnNetworkSpawn()
    {
        ring = new GameObject("BladeRing").transform;
        ring.SetParent(transform, false);

        BladeCount.OnValueChanged += OnCountChanged;
        Build();
    }

    public override void OnNetworkDespawn()
    {
        BladeCount.OnValueChanged -= OnCountChanged;
    }

    private void OnCountChanged(int before, int after) => Build();

    // 모두의 화면에서 각자 만든다.
    private void Build()
    {
        if (ring == null) return;

        // 🚨 Destroy 는 이 프레임 끝에 처리된다. 한 프레임에 Build 를 두 번 부르면
        //    아직 안 지워진 옛 칼 위에 새 칼이 얹혀 개수가 어긋난다 (실제로 3자루인데 4개가 됐다).
        //    부모에서 먼저 떼어 내면 그 자리에서 목록에서 빠진다.
        for (int i = ring.childCount - 1; i >= 0; i--)
        {
            Transform old = ring.GetChild(i);
            old.SetParent(null);
            Destroy(old.gameObject);
        }

        int n = BladeCount.Value;
        if (bladePrefab == null || n <= 0) return;

        for (int i = 0; i < n; i++)
        {
            float angle = 360f / n * i;
            float rad = angle * Mathf.Deg2Rad;

            GameObject blade = Instantiate(bladePrefab, ring);
            blade.transform.localPosition = new Vector3(Mathf.Cos(rad) * radius, Mathf.Sin(rad) * radius, 0f);
            blade.transform.localRotation = Quaternion.Euler(0f, 0f, angle - 90f);

            // 싱글용 Blade 는 IDamageable 을 찾는다. 협동 몬스터는 그걸 안 쓴다.
            // 여기서는 그림만 필요하니 판정 부품을 떼어 낸다.
            if (blade.TryGetComponent(out Blade b)) Destroy(b);
            foreach (var col in blade.GetComponentsInChildren<Collider2D>()) Destroy(col);
        }
    }

    private void Update()
    {
        if (ring == null) return;
        if (NetworkTeam.IsPaused) return;

        ring.Rotate(0f, 0f, rotateSpeed * Time.deltaTime);

        // 🔑 때리는 건 서버만. 클라이언트가 같이 때리면 두 번 맞는다.
        if (!IsServer) return;
        if (BladeCount.Value <= 0) return;
        if (Time.time < nextHitTime) return;

        nextHitTime = Time.time + hitInterval;

        for (int i = 0; i < ring.childCount; i++)
        {
            Collider2D[] hits = Physics2D.OverlapCircleAll(ring.GetChild(i).position, bladeHitRadius);

            foreach (var hit in hits)
            {
                if (hit.TryGetComponent(out NetworkEnemy enemy)) enemy.TakeDamage(BladeDamage.Value);
            }
        }
    }

    // ---- 서버만 부른다 ----
    public void Acquire()
    {
        if (!IsServer || Owned) return;
        BladeCount.Value = 1;
    }

    public void AddBlade(int count)
    {
        if (!IsServer) return;
        BladeCount.Value += count;
    }

    public void AddDamage(int step)
    {
        if (!IsServer) return;
        BladeDamage.Value += step;
    }
}
