using UnityEngine;

// 068회차 · 플레이어를 부드럽게 따라간다.
//
// 🚨 Update 에 쓰면 카메라가 덜덜 떤다.
//    플레이어는 FixedUpdate 에서 움직인다. Update 순서는 정해져 있지 않아서
//    "아직 안 움직인 플레이어" 를 따라가는 프레임이 섞인다.
//    LateUpdate 는 그 프레임의 모든 이동이 끝난 뒤에 불린다. 그래서 여기다.
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float smoothTime = 0.15f;

    private Vector3 velocity;

    void LateUpdate()
    {
        // z = -10. 2D 카메라는 뒤에서 앞을 본다. 0 으로 두면 아무것도 안 보인다.
        Vector3 goal = new Vector3(target.position.x, target.position.y, -10f);

        transform.position = Vector3.SmoothDamp(transform.position, goal, ref velocity, smoothTime);
    }
}
