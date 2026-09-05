using UnityEngine;

// 076·077회차 · 플레이어 주위를 도는 칼.
// 이 스크립트는 Player 의 자식 "Blades" 에 붙는다.
// 부모(이 오브젝트)가 제자리에서 돌면 자식(칼)이 공전한다 — 033회차 로봇팔과 같은 원리다.
//
// 086회차 · 회전 속도·피해도 업그레이드된다.
// 088회차 · 시작 수치를 WeaponData(SO)에서 읽는다. 그 뒤 변하는 값은 여기 런타임 필드다.
public class MeleeRing : MonoBehaviour
{
    [SerializeField] private WeaponData data;
    [SerializeField] private GameObject bladePrefab;

    // 🔑 132회차 · 처음엔 0 이다. 칼은 레벨업으로 "얻는" 무기다.
    //    가지고 있는지 아닌지를 따로 bool 로 두지 않는다 — 칼 개수가 곧 답이다.
    private int bladeCount;
    private float radius = 2f;
    private float rotateSpeed = 180f;
    private int bladeDamage = 3;
    private float hitInterval = 0.3f;

    public int BladeCount => bladeCount;
    public float RotateSpeed => rotateSpeed;
    public int BladeDamage => bladeDamage;
    public bool Owned => bladeCount > 0;

    private void Start()
    {
        // SO 는 "시작값" 만 준다. 여기서 런타임 필드로 복사한 뒤로는 SO 를 건드리지 않는다.
        //   ⚠️ bladeCount 는 안 읽는다. 그건 "얻었을 때 몇 자루로 시작하나" 라서 Acquire 에서 쓴다.
        if (data != null)
        {
            radius = data.bladeRadius;
            rotateSpeed = data.bladeRotateSpeed;
            bladeDamage = data.bladeDamage;
            hitInterval = data.bladeHitInterval;
        }

        Build();   // 0 자루니까 아무것도 안 만든다
    }

    // ---- 132회차 · 무기 획득 ----
    public void Acquire()
    {
        if (Owned) return;                                  // 두 번 얻을 수 없다
        bladeCount = data != null ? Mathf.Max(1, data.bladeCount) : 1;
        Build();
        Debug.Log($"무기 획득 — 회전하는 칼 {bladeCount}자루");
    }

    private void Update()
    {
        transform.Rotate(0f, 0f, rotateSpeed * Time.deltaTime);
    }

    // ---- 086회차 · 업그레이드 ----
    public void AddBlade(int count)
    {
        bladeCount += count;
        Build();
    }

    public void AddRotateSpeed(float step)
    {
        rotateSpeed += step;
        Debug.Log($"칼 회전 상승 — 초당 {rotateSpeed:F0}도");
    }

    public void AddBladeDamage(int step)
    {
        bladeDamage += step;
        Build();   // 이미 달린 칼에도 적용되게 다시 만든다
        Debug.Log($"칼 피해 상승 — {bladeDamage}");
    }

    [ContextMenu("칼 다시 배치")]
    public void Build()
    {
        // 이미 달려 있는 칼을 전부 치운다. 안 그러면 부를 때마다 쌓인다.
        // 🚨 Destroy 는 이 프레임 끝에 처리된다. 한 프레임에 Build 를 두 번 부르면
        //    아직 안 지워진 옛 칼 위에 새 칼이 얹혀 개수가 어긋난다 (실제로 3자루인데 4개가 됐다).
        //    부모에서 먼저 떼어 내면 그 자리에서 목록에서 빠진다.
        for (int i = transform.childCount - 1; i >= 0; i--)
        {
            Transform old = transform.GetChild(i);
            old.SetParent(null);
            Destroy(old.gameObject);
        }

        if (bladePrefab == null || bladeCount <= 0) return;

        for (int i = 0; i < bladeCount; i++)
        {
            // 360도를 개수로 나눠 고르게 배치한다. 069의 원형 배치와 같은 계산이다.
            float angle = 360f / bladeCount * i;
            float rad = angle * Mathf.Deg2Rad;

            GameObject blade = Instantiate(bladePrefab, transform);

            blade.transform.localPosition =
                new Vector3(Mathf.Cos(rad) * radius, Mathf.Sin(rad) * radius, 0f);

            // 칼끝이 바깥을 보게 돌린다. 스프라이트는 위쪽(+y)이 칼끝이라 90도를 뺀다.
            blade.transform.localRotation = Quaternion.Euler(0f, 0f, angle - 90f);

            if (blade.TryGetComponent(out Blade b))
            {
                b.Setup(bladeDamage, hitInterval);
            }
        }
    }
}
