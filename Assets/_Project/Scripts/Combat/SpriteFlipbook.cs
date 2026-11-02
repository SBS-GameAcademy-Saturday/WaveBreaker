using UnityEngine;

// 스프라이트 몇 장을 차례로 넘긴다. 번개·폭발 같은 **한 번 터지고 끝나는** 그림용.
//
// 🔑 이펙트마다 Animator Controller 를 만들면 파일만 늘어난다.
//    "몇 장을 몇 fps 로 넘기고, 끝나면 지울까 되풀이할까" 면 충분하다.
[RequireComponent(typeof(SpriteRenderer))]
public class SpriteFlipbook : MonoBehaviour
{
    [SerializeField] private Sprite[] frames;
    [SerializeField] private float fps = 14f;
    [SerializeField] private bool loop;

    private SpriteRenderer sr;
    private float t;

    private void Awake() => sr = GetComponent<SpriteRenderer>();

    private void OnEnable()
    {
        t = 0f;
        if (sr != null && frames != null && frames.Length > 0) sr.sprite = frames[0];
    }

    private void Update()
    {
        if (frames == null || frames.Length == 0) return;

        t += Time.deltaTime;
        int i = Mathf.FloorToInt(t * fps);

        if (i >= frames.Length)
        {
            if (!loop) { Destroy(gameObject); return; }
            i %= frames.Length;
        }
        sr.sprite = frames[i];
    }
}
