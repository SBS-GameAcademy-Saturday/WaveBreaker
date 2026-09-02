using UnityEngine;

/// <summary>
/// 042회차 — 물리 엔진에게 이동을 맡긴다.
///
/// 040 의 PlayerMove 와 무엇이 다른가
///   PlayerMove        transform.position 에 좌표를 직접 대입한다 → 벽을 뚫는다
///   PlayerPhysicsMove rb.linearVelocity 에 속도를 넣는다        → 벽에서 멈춘다
///
/// 왜 FixedUpdate 인가
///   Update 는 화면 한 장마다라서 컴퓨터마다 횟수가 다르다.
///   FixedUpdate 는 누구 컴퓨터에서든 1초에 50번이다. 물리는 이쪽에 쓴다.
///   규칙: rb. 으로 시작하는 줄은 FixedUpdate 에.
///
/// 왜 Time.deltaTime 을 안 곱하나
///   linearVelocity 는 위치가 아니라 "1초에 얼마나 갈지" 다. 이미 "1초에" 가 들어 있다.
///   위치를 넣으면 곱하고(038·039·040), 속도를 넣으면 안 곱한다(오늘).
///
/// ⚠️ Inspector 에서 같이 해야 하는 것
///    Rigidbody 2D > Gravity Scale = 0        (안 하면 아래로 떨어진다)
///    Rigidbody 2D > Constraints > Freeze Rotation Z 체크
///                                            (안 하면 벽에 비빌 때 빙글빙글 돈다)
///    Player Physics Move > Rb 칸에 Player 자신을 드래그
///
/// 💡 GetComponent 로 rb 를 코드에서 찾는 방법은 046회차다.
///    지금은 040 에서 GameObject item 을 드래그해 넣던 것과 똑같이 연결한다.
/// </summary>
public class PlayerPhysicsMove : MonoBehaviour
{
    // 1초에 얼마나 갈지.
    [SerializeField] private float moveSpeed = 5f;

    // Hierarchy 의 Player 자신을 Inspector 의 이 칸으로 드래그해 넣는다.
    // 칸의 타입이 Rigidbody2D 라서, 오브젝트를 놓으면 유니티가 그 오브젝트에 붙은
    // Rigidbody 2D 를 알아서 찾아 넣는다.
    [SerializeField] private Rigidbody2D rb;

    private void FixedUpdate()
    {
        // 040 그대로. 좌우 -1 / 0 / 1, 상하 -1 / 0 / 1
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        // Vector3 가 아니라 Vector2 다. 2D 물리는 z 를 쓰지 않는다.
        // 아무 키도 안 누르면 (0,0) 이 들어가서 멈춘다 — 조건문이 필요 없다.
        rb.linearVelocity = new Vector2(h, v) * moveSpeed;
    }
}
