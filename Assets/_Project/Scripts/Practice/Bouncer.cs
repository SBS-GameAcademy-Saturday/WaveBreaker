using UnityEngine;

/// <summary>
/// 034회차 개인 미션 정답본 — 돌면서 커지는 스크립트.
///
/// 여기서 확인할 것
///   1. [SerializeField] 를 두 개 붙이면 Inspector 에 두 칸이 생긴다
///   2. transform.localScale 도 transform.Rotate 처럼 코드로 건드릴 수 있다
///
/// 🚩 Spinner 와 마찬가지로 Time.deltaTime 을 쓰지 않았다.
///    커지는 속도도 컴퓨터마다 다르다. 037회차에서 함께 고친다.
///
/// ※ 계속 커지기만 하고 되돌아오지 않는 것이 정상이다.
///    "왕복하게 만들기"는 Mathf.Sin 이 필요하므로 여기서 다루지 않는다.
/// </summary>
public class Bouncer : MonoBehaviour
{
    // 한 프레임에 얼마나 커질지
    [SerializeField] private float scaleStep = 0.01f;

    // 한 프레임에 몇 도 돌지
    [SerializeField] private float rotateStep = 2f;

    private void Update()
    {
        transform.Rotate(0f, 0f, rotateStep);

        // Vector3.one 은 (1, 1, 1) 이다.
        // 여기에 scaleStep 을 곱해서 더하면 가로·세로가 같은 비율로 커진다.
        transform.localScale = transform.localScale + Vector3.one * scaleStep;
    }
}
