using System.Collections.Generic;
using UnityEngine;

// 068회차 · 플레이어를 부드럽게 따라간다.
// Update 에 쓰면 플레이어가 움직이기 전 위치를 보게 돼 화면이 떤다. 그래서 LateUpdate.
//
// 095회차 · "하나를 따라간다" 를 "목록의 중심을 따라간다" 로 바꿨다.
//   목록에 하나만 넣으면 동작이 068과 완전히 같다. 지금은 실제로 하나만 넣는다.
//   Phase 9 에서 협동을 붙일 때 이 파일은 안 고치고 목록에 하나 더 넣기만 하면 된다.
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private List<Transform> targets = new List<Transform>();
    [SerializeField] private float smoothTime = 0.15f;

    private Vector3 velocity;

    void LateUpdate()
    {
        if (targets.Count == 0) return;

        Vector3 center = Center();

        Vector3 goal = new Vector3(center.x, center.y, -10f);

        transform.position = Vector3.SmoothDamp(transform.position, goal, ref velocity, smoothTime);
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
}
