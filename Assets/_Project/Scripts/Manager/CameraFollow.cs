using UnityEngine;

// 068회차 · 플레이어를 부드럽게 따라간다.
// Update 에 쓰면 플레이어가 움직이기 전 위치를 보게 돼 화면이 떤다. 그래서 LateUpdate.
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;
    [SerializeField] private float smoothTime = 0.15f;

    private Vector3 velocity;

    void LateUpdate()
    {
        Vector3 goal = new Vector3(target.position.x, target.position.y, -10f);

        transform.position = Vector3.SmoothDamp(transform.position, goal, ref velocity, smoothTime);
    }
}
