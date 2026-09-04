using UnityEngine;

// 협동 씬 전용 · 애니메이터에 Speed 를 넣어 준다.
//
// 🔑 싱글에서 쓰던 방법(rb.linearVelocity)을 그대로 쓰면 상대 캐릭터가 안 움직인다.
//    상대는 내 화면에서 물리로 움직이는 게 아니라 NetworkTransform 이 위치를 옮겨 준다.
//    그래서 속도는 0 인데 자리는 바뀐다. 위치가 얼마나 변했는지를 직접 잰다.
[RequireComponent(typeof(Animator))]
public class NetworkAnim : MonoBehaviour
{
    private Animator anim;
    private Vector3 last;

    private void OnEnable()
    {
        anim = GetComponent<Animator>();
        last = transform.position;
    }

    private void Update()
    {
        float speed = (transform.position - last).magnitude / Mathf.Max(Time.deltaTime, 0.0001f);
        last = transform.position;
        anim.SetFloat("Speed", speed);
    }
}
