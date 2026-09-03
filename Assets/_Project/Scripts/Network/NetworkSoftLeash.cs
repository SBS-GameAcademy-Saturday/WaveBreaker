using Unity.Netcode;
using UnityEngine;

// 121회차 · 소프트 리쉬 — 너무 멀어지면 살짝 당긴다.
//
// 🔑 왜 필요한가
//    줌아웃만으로는 부족하다. 둘이 계속 멀어지면 화면이 한없이 넓어지고,
//    캐릭터가 점처럼 작아져서 아무것도 안 보인다.
//    그래서 최대 거리를 정하고, 넘으면 **부드럽게** 당긴다.
//
// 🚨 "딱딱하게" 막으면 안 된다.
//    벽에 부딪힌 것처럼 멈추면 조작이 씹히는 느낌이 난다.
//    그래서 이름이 "소프트" 리쉬다 — 조금씩 당긴다.
public class NetworkSoftLeash : NetworkBehaviour
{
    [SerializeField] private float maxDistance = 7f;
    [SerializeField] private float pullStrength = 2.5f;

    private CameraFollow cam;

    private void Start()
    {
        cam = Camera.main != null ? Camera.main.GetComponent<CameraFollow>() : null;
    }

    private void LateUpdate()
    {
        // 내 캐릭터만 당긴다. 상대 캐릭터는 그쪽에서 당겨진 결과가 넘어온다.
        if (!IsOwner) return;
        if (cam == null) return;

        // 혼자면 당길 이유가 없다. 싱글에서도 이 검사로 걸러진다.
        if (cam.Span <= 0.01f) return;

        Vector2 toCenter = (Vector2)cam.CenterPoint - (Vector2)transform.position;
        float dist = toCenter.magnitude;

        if (dist <= maxDistance) return;

        // 넘은 만큼만 당긴다. 많이 넘을수록 세게.
        float over = dist - maxDistance;

        transform.position += (Vector3)(toCenter.normalized * over * pullStrength * Time.deltaTime);
    }
}
