using UnityEngine;

/// <summary>
/// 034회차 — Inspector 에서 값을 바꿔보는 스크립트.
///
/// 여기서 확인할 것
///   1. [SerializeField] 값을 Play 중에 바꾸면 즉시 반영된다
///   2. 그런데 Play 를 멈추면 그 값은 사라진다 (Play 모드 함정)
///   3. transform 은 모든 GameObject 가 반드시 갖고 있는 부품이다
///
/// 🚩 이 스크립트는 일부러 "덜 만든" 상태다.
///    회전 속도가 컴퓨터마다, 그리고 같은 컴퓨터에서도 순간마다 다르다.
///    왜 그런지는 8주차(036회차)에 Time.deltaTime 으로 해결한다.
///    ※ 먼저 불편을 겪게 하는 것이 목적이므로, 여기서 미리 고쳐주지 않는다.
/// </summary>
public class Spinner : MonoBehaviour
{
    // 한 프레임에 몇 도씩 돌릴지. Inspector 에서 조절해본다.
    [SerializeField] private float rotateStep = 1.5f;

    private void Update()
    {
        // 2D 라서 Z축으로 돈다. X, Y 로 바꾸면 어떻게 되는지도 해볼 것.
        transform.Rotate(0f, 0f, rotateStep);
    }
}
