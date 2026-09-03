using UnityEngine;

// 099회차 · 죽은 자리에서 조각이 사방으로 튄다.
//
// 🔑 ParticleSystem 을 안 쓴 이유 (실제로 겪고 내린 판단)
//    이 프로젝트는 URP 2D 에 정렬 레이어(Background/Ground/Enemy/Player/Effect)를 정해 두고 쓴다.
//    파티클을 붙였더니 입자는 분명히 살아 있는데(24개) 화면에 안 나왔다.
//    정렬 레이어·머티리얼·크기를 차례로 고쳐봐도 안 나와서, 이미 잘 보이는 것 —
//    즉 스프라이트 — 로 갈아탔다. 스프라이트는 이 게임의 모든 것이 쓰는 방식이라 예측이 된다.
//
//    "안 되는 걸 붙잡고 있기보다, 되는 걸로 만든다." 40분짜리 회차에서 이게 맞는 선택이다.
//    파티클로 다시 해보는 건 ⭐도전 과제로 남겼다.
public class DeathEffect : MonoBehaviour
{
    [SerializeField] private Sprite shape;
    [SerializeField] private int count = 8;
    [SerializeField] private float speed = 4.5f;
    [SerializeField] private float life = 0.35f;
    [SerializeField] private float size = 0.22f;
    [SerializeField] private Color color = new Color(1f, 0.72f, 0.35f);

    private SpriteRenderer[] shards;
    private Vector2[] dirs;
    private float elapsed;

    // 102회차 · 조각을 만드는 건 처음 한 번만(Awake), 위치를 되돌리는 건 매번(OnEnable).
    private void Awake()
    {
        shards = new SpriteRenderer[count];
        dirs = new Vector2[count];

        for (int i = 0; i < count; i++)
        {
            // 077회차의 칼 각도 분배와 같은 계산이다. 360도를 개수로 나눈다.
            float angle = 360f / count * i + Random.Range(-14f, 14f);
            dirs[i] = new Vector2(Mathf.Cos(angle * Mathf.Deg2Rad), Mathf.Sin(angle * Mathf.Deg2Rad));

            GameObject go = new GameObject("Shard");
            go.transform.SetParent(transform, false);

            SpriteRenderer sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = shape;
            sr.color = color;
            sr.sortingLayerName = "Effect";   // 이걸 빼면 바닥 타일 뒤에 그려져서 안 보인다
            go.transform.localScale = Vector3.one * size;

            shards[i] = sr;
        }
    }

    private void OnEnable()
    {
        elapsed = 0f;   // 이걸 안 하면 두 번째부터 꺼내자마자 사라진다

        if (shards == null) return;

        for (int i = 0; i < shards.Length; i++)
        {
            shards[i].transform.localPosition = Vector3.zero;
            shards[i].color = color;
        }
    }

    private void Update()
    {
        elapsed += Time.deltaTime;

        float k = elapsed / life;   // 0 에서 1 로 간다

        if (k >= 1f)
        {
            PoolManager.Despawn(gameObject);
            return;
        }

        for (int i = 0; i < shards.Length; i++)
        {
            shards[i].transform.localPosition = (Vector3)(dirs[i] * speed * elapsed);

            Color c = color;
            c.a = 1f - k;             // 점점 투명해진다
            shards[i].color = c;

            shards[i].transform.localScale = Vector3.one * size * (1f - k * 0.6f);   // 점점 작아진다
        }
    }
}
