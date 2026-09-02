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

    private int bladeCount = 3;
    private float radius = 2f;
    private float rotateSpeed = 180f;
    private int bladeDamage = 3;
    private float hitInterval = 0.3f;

    public int BladeCount => bladeCount;
    public float RotateSpeed => rotateSpeed;
    public int BladeDamage => bladeDamage;

    private void Start()
    {
        // SO 는 "시작값" 만 준다. 여기서 런타임 필드로 복사한 뒤로는 SO 를 건드리지 않는다.
        if (data != null)
        {
            bladeCount = data.bladeCount;
            radius = data.bladeRadius;
            rotateSpeed = data.bladeRotateSpeed;
            bladeDamage = data.bladeDamage;
            hitInterval = data.bladeHitInterval;
        }

        Build();
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
        for (int i = transform.childCount - 1; i >= 0; i--)
        {
            Destroy(transform.GetChild(i).gameObject);
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
