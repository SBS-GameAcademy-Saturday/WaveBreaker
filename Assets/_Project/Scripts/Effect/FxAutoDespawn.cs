using UnityEngine;

// 131회차 · 애니메이션이 끝나면 스스로 서랍에 반납한다.
//
// Animator 는 "재생" 만 하고 "끝나면 치우기" 는 안 해준다. 그 한 가지를 맡는다.
// 길이는 Animator 에 물어본다 — 클립을 고쳐도 이 값이 따라온다.
[RequireComponent(typeof(Animator))]
public class FxAutoDespawn : MonoBehaviour
{
    private Animator anim;
    private float left;

    private void Awake()
    {
        anim = GetComponent<Animator>();
    }

    // 🔑 102회차 풀링. 서랍에서 꺼낼 때마다 처음부터 다시 센다.
    private void OnEnable()
    {
        anim.Rebind();      // 0번 프레임으로 되감는다
        anim.Update(0f);

        left = Length();
    }

    private float Length()
    {
        var clips = anim.runtimeAnimatorController != null
            ? anim.runtimeAnimatorController.animationClips
            : null;

        return clips != null && clips.Length > 0 ? clips[0].length : 0.5f;
    }

    private void Update()
    {
        left -= Time.deltaTime;

        if (left <= 0f) PoolManager.Despawn(gameObject);
    }
}
