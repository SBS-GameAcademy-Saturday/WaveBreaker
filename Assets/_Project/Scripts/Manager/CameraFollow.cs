using System.Collections.Generic;
using UnityEngine;

// 068회차 · 플레이어를 부드럽게 따라간다.
// Update 에 쓰면 플레이어가 움직이기 전 위치를 보게 돼 화면이 떤다. 그래서 LateUpdate.
//
// 095회차 · "하나를 따라간다" 를 "목록의 중심을 따라간다" 로 바꿨다.
//   목록에 하나만 넣으면 동작이 068과 완전히 같다.
//
// 099회차 · 흔들기가 여기 들어왔다.
//   따로 스크립트를 만들면 "따라가기가 먼저냐 흔들기가 먼저냐" 를 매번 신경 써야 한다.
//   같은 LateUpdate 안에서 순서대로 하면 그 걱정이 아예 없어진다.
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private List<Transform> targets = new List<Transform>();
    [SerializeField] private float smoothTime = 0.15f;

    private Vector3 velocity;

    private float shakeLeft;
    private float shakePower;

    void LateUpdate()
    {
        if (targets.Count == 0) return;

        Vector3 center = Center();

        Vector3 goal = new Vector3(center.x, center.y, -10f);

        transform.position = Vector3.SmoothDamp(transform.position, goal, ref velocity, smoothTime);

        // 따라간 다음에 흔든다. 순서가 반대면 흔든 걸 따라가기가 지워버린다.
        transform.position += ShakeOffset();
    }

    // 목록의 평균 위치. 원소가 하나면 그 하나의 위치와 같은 값이 나온다.
    private Vector3 Center()
    {
        Vector3 sum = Vector3.zero;
        int count = 0;

        foreach (Transform t in targets)
        {
            if (t == null) continue;   // 죽어서 사라진 플레이어는 건너뛴다

            sum += t.position;
            count++;
        }

        if (count == 0) return transform.position;

        return sum / count;
    }

    public void Shake(float power, float duration)
    {
        // 약한 흔들림이 강한 흔들림을 덮어쓰면 안 된다.
        if (duration <= shakeLeft && power <= shakePower) return;

        shakeLeft = duration;
        shakePower = power;
    }

    private Vector3 ShakeOffset()
    {
        if (shakeLeft <= 0f) return Vector3.zero;

        // 히트스톱 중에도 흔들려야 한다. timeScale 을 안 타는 시간을 쓴다.
        shakeLeft -= Time.unscaledDeltaTime;

        if (shakeLeft <= 0f) return Vector3.zero;

        return (Vector3)Random.insideUnitCircle * shakePower;
    }
}
