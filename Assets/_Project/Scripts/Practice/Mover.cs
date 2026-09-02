using UnityEngine;

/// <summary>
/// 038회차 — 코드로 물체를 움직인다.
///
/// 여기서 확인할 것
///   1. Inspector 의 Position 이 코드에서는 transform.position 이다
///   2. Vector3 는 숫자 세 개(x, y, z)를 묶은 것이다
///   3. "지금 위치 + 조금" 을 매 프레임 반복하면 움직여 보인다
///
/// 🚩 Spinner, Bouncer 와 마찬가지로 Time.deltaTime 을 쓰지 않았다.
///    컴퓨터마다 이동 속도가 다르다. 037(회전) 에 이어 두 번째 불편이고,
///    039회차에서 셋을 한꺼번에 고친다.
/// </summary>
public class Mover : MonoBehaviour
{
    // 한 프레임에 얼마나 갈지
    [SerializeField] private float moveStep = 0.05f;

    // 어느 쪽으로 갈지. Inspector 에 X, Y, Z 세 칸으로 나온다.
    // (1,0,0)이면 오른쪽, (0,1,0)이면 위, (1,1,0)이면 대각선.
    [SerializeField] private Vector3 moveDir = Vector3.right;

    private void Start()
    {
        // 032회차의 월드 좌표가 코드에서는 이렇게 읽힌다.
        Debug.Log("시작 위치(월드): " + transform.position);
        Debug.Log("시작 위치(로컬): " + transform.localPosition);
    }

    private void Update()
    {
        // = 는 "같다" 가 아니라 "넣는다". 4회차에 했다.
        // 지금 위치에서 moveDir 방향으로 moveStep 만큼 더한 자리로 옮긴다.
        transform.position = transform.position + moveDir * moveStep;
    }
}
