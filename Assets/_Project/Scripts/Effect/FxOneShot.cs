using UnityEngine;

// 131회차(예정) · 한 번만 재생하고 사라지는 이펙트.
//
// SpriteAnimator 와 나눈 이유 — 저건 "상태에 따라 계속 도는 것"(서기·걷기)이고
// 이건 "한 번 터지고 끝나는 것"(폭발·타격)이다. 끝나면 스스로 풀에 반납한다.
//
// 🔑 102회차 풀링. Awake 가 아니라 OnEnable 에서 처음으로 되돌린다.
//    서랍에서 꺼낼 때마다 0번 프레임부터 다시 시작해야 한다.
[RequireComponent(typeof(SpriteRenderer))]
public class FxOneShot : MonoBehaviour
{
    [SerializeField] private Sprite[] frames;
    [SerializeField] private float fps = 20f;
    [SerializeField] private bool randomFlip = true;    // 같은 이펙트가 반복돼 보이지 않게

    private SpriteRenderer sprite;
    private int frame;
    private float timer;

    public float Length => frames == null ? 0f : frames.Length / Mathf.Max(fps, 0.01f);

    private void Awake()
    {
        sprite = GetComponent<SpriteRenderer>();
    }

    private void OnEnable()
    {
        frame = 0;
        timer = 0f;

        if (frames != null && frames.Length > 0) sprite.sprite = frames[0];
        if (randomFlip) sprite.flipX = Random.value < 0.5f;
    }

    private void Update()
    {
        if (frames == null || frames.Length == 0)
        {
            PoolManager.Despawn(gameObject);
            return;
        }

        timer += Time.deltaTime;

        float step = 1f / Mathf.Max(fps, 0.01f);

        while (timer >= step)
        {
            timer -= step;
            frame++;

            // 마지막 장까지 보여줬으면 서랍에 반납한다
            if (frame >= frames.Length)
            {
                PoolManager.Despawn(gameObject);
                return;
            }

            sprite.sprite = frames[frame];
        }
    }
}
