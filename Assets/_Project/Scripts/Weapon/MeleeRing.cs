using UnityEngine;

// 076·077회차 · 플레이어 주위를 도는 칼.
// 이 스크립트는 Player 의 자식 "Blades" 에 붙는다.
// 부모(이 오브젝트)가 제자리에서 돌면 자식(칼)이 공전한다 — 033회차 로봇팔과 같은 원리다.
public class MeleeRing : MonoBehaviour
{
    [SerializeField] private GameObject bladePrefab;
    [SerializeField] private int bladeCount = 3;
    [SerializeField] private float radius = 2f;
    [SerializeField] private float rotateSpeed = 180f;   // 초당 각도

    private void Start()
    {
        Build();
    }

    private void Update()
    {
        transform.Rotate(0f, 0f, rotateSpeed * Time.deltaTime);
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
        }
    }
}
