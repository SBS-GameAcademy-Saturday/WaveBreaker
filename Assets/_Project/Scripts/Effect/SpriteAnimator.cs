using UnityEngine;

// 131회차(예정) · 스프라이트 애니메이션.
// Animator 컨트롤러를 쓰지 않고 배열을 순서대로 넘긴다. 이 과정에서 Animator 를 안 배웠기 때문이다.
//
// 하는 일은 한 줄이다 — "정해진 간격마다 sprite 를 다음 것으로 바꾼다".
//
// 🔑 색과 좌우 뒤집기는 건드리지 않는다.
//    색은 Enemy.Flash() 가, flipX 는 Enemy.Move() 가 이미 쓰고 있다. 서로 안 밟게 나눠 둔다.
[RequireComponent(typeof(SpriteRenderer))]
public class SpriteAnimator : MonoBehaviour
{
    [Header("프레임")]
    [SerializeField] private Sprite[] idle;
    [SerializeField] private Sprite[] walk;
    [SerializeField] private Sprite[] hurt;
    [SerializeField] private Sprite[] attack;
    [SerializeField] private Sprite[] death;

    [Header("설정")]
    [SerializeField] private float fps = 10f;
    [SerializeField] private float moveThreshold = 0.05f;   // 이보다 느리면 서 있는 것으로 본다

    private SpriteRenderer sprite;
    private Rigidbody2D body;

    private Sprite[] current;      // 지금 재생 중인 배열
    private int frame;
    private float timer;

    private Sprite[] once;         // 한 번만 재생할 것 (피격 · 공격 · 죽음)
    private float onceLeft;
    private bool holdLast;         // 죽음은 마지막 프레임에서 멈춘다
    private bool frozen;

    public bool HasDeath => death != null && death.Length > 0;
    public float DeathLength => HasDeath ? death.Length / Mathf.Max(fps, 0.01f) : 0f;

    private void Awake()
    {
        sprite = GetComponent<SpriteRenderer>();
        body = GetComponent<Rigidbody2D>();
    }

    // 🔑 102회차 풀링. 서랍에서 꺼낼 때마다 처음부터 다시 시작해야 한다.
    private void OnEnable()
    {
        once = null;
        onceLeft = 0f;
        holdLast = false;
        frozen = false;
        frame = 0;
        timer = 0f;
        current = null;
    }

    private void PlayOnce(Sprite[] clip, bool hold)
    {
        if (clip == null || clip.Length == 0) return;

        // 같은 걸 이미 재생 중이면 처음으로 되돌리지 않는다.
        // 몬스터가 닿아 있는 동안 Attack 이 매 프레임 불려서 0번 프레임에 멈추는 걸 막는다.
        if (once == clip) return;

        once = clip;
        onceLeft = clip.Length / Mathf.Max(fps, 0.01f);
        holdLast = hold;
        frozen = false;
        frame = 0;
        timer = 0f;
    }

    public void PlayHurt() => PlayOnce(hurt, false);
    public void PlayAttack() => PlayOnce(attack, false);
    public void PlayDeath() => PlayOnce(death, true);

    private void Update()
    {
        if (frozen) return;

        Sprite[] want = Pick();
        if (want == null || want.Length == 0) return;

        // 배열이 바뀌면 처음 프레임부터 시작한다
        if (want != current)
        {
            current = want;
            frame = 0;
            timer = 0f;
            sprite.sprite = current[0];
        }

        timer += Time.deltaTime;

        float step = 1f / Mathf.Max(fps, 0.01f);
        while (timer >= step)
        {
            timer -= step;

            // 마지막에서 멈춰야 하는 것(죽음)은 넘기지 않는다
            if (holdLast && once != null && frame >= current.Length - 1)
            {
                frozen = true;
                return;
            }

            frame = (frame + 1) % current.Length;
            sprite.sprite = current[frame];
        }
    }

    private Sprite[] Pick()
    {
        if (once != null)
        {
            onceLeft -= Time.deltaTime;

            if (onceLeft > 0f || holdLast) return once;

            once = null;
        }

        bool moving = body != null && body.linearVelocity.magnitude > moveThreshold;

        if (moving && walk != null && walk.Length > 0) return walk;
        if (idle != null && idle.Length > 0) return idle;
        return walk;
    }
}
