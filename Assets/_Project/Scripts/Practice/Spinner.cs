using UnityEngine;

/// <summary>
/// 034회차 — Inspector 에서 값을 바꿔보는 스크립트.
///
/// 여기서 확인할 것
///   1. [SerializeField] 값을 Play 중에 바꾸면 즉시 반영된다
///   2. 그런데 Play 를 멈추면 그 값은 사라진다 (Play 모드 함정)
///   3. transform 은 모든 GameObject 가 반드시 갖고 있는 부품이다
///
/// ✅ 039회차에서 Time.deltaTime 을 곱해 고쳤다.
///    이제 컴퓨터가 달라도 같은 속도로 돈다.
///    값의 의미가 "한 프레임에 몇 도" 에서 "1초에 몇 도" 로 바뀌었으므로
///    변수 이름도 rotateStep -> rotateSpeed 로 바꿨다.
/// </summary>
public class Spinner : MonoBehaviour
{
    // 1초에 몇 도 돌지. 90 이면 4초에 한 바퀴.
    [SerializeField] private float rotateSpeed = 90f;

    private void Update()
    {
        // 2D 라서 Z축으로 돈다.
        // Time.deltaTime = 직전 한 프레임을 그리는 데 걸린 시간(초).
        // 곱하면 프레임 수와 무관하게 "초당" 으로 움직인다.
        transform.Rotate(0f, 0f, rotateSpeed * Time.deltaTime);
    }
}
