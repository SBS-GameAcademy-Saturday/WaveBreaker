using UnityEngine;

/// <summary>
/// 060회차 — 055 에서 학생이 직접 고친 "좌우로만 움직이는 이동" 을 컴포넌트로 만든 것.
/// 042 의 PlayerPhysicsMove 에서 세로 입력(v)을 빼고 Mathf.Clamp 를 더했다.
///
/// ⚠️ 패들의 Rigidbody 2D 는 Kinematic 이어야 한다.
///    Dynamic 이면 공에 맞아서 패들이 밀려난다 — 041 의 Body Type 그대로다.
///    물리가 안 밀어주니 transform.position 을 직접 옮긴다.
///    정석은 rb.MovePosition 이지만 이 규모에서는 이걸로 충분하다.
/// </summary>
public class Paddle : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 10f;

    // 화면 밖으로 못 나가게 하는 경계. 050 의 체력에서 쓴 Mathf.Clamp 와 같은 도구다.
    [SerializeField] private float limitX = 7f;

    private void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");

        Vector3 pos = transform.position;

        pos.x += h * moveSpeed * Time.deltaTime;
        pos.x = Mathf.Clamp(pos.x, -limitX, limitX);

        transform.position = pos;
    }
}
