using UnityEngine;
using System.Collections;   // IEnumerator 를 쓰려면 필요하다

/// <summary>
/// 051회차 — 코루틴 첫 회차.
///
/// 이 회차의 도입은 "Update + 타이머 변수" 로 같은 걸 만들어 보는 것이다.
/// 아래가 그 버전이고, 수업에서는 이걸 먼저 쳐본 다음 코루틴으로 갈아끼운다.
///
///     private float timer;
///     private bool  done;
///
///     void Update()
///     {
///         if (done) return;
///         timer += Time.deltaTime;
///         if (timer >= 3f) { Debug.Log("발사!"); done = true; }
///     }
///
/// 한 번 하는 데 변수가 둘이다. 3초 → 2초 → 1초로 이어지면 변수가 여섯 개가 된다.
/// 코루틴은 그걸 위에서 아래로 읽히게 만든다.
///
/// ⚠️ IEnumerator 가 뭐냐는 질문에는 "이 메서드는 중간에 쉴 수 있다는 표시" 까지만 답한다.
///    컴파일러가 상태 머신을 만든다는 설명을 꺼내면 이 회차가 끝난다.
///
/// 🚨 이 회차 최다 사고 두 가지
///    아무것도 안 찍힘  → StartCoroutine 을 빼먹었다 (에러도 안 난다)
///    한 번에 다 찍힘   → yield return 을 빼먹었다
/// </summary>
public class CoroutineDemo : MonoBehaviour
{
    [SerializeField] private float step = 1f;

    private void Start()
    {
        // Countdown() 만 부르면 아무 일도 일어나지 않는다.
        StartCoroutine(Countdown());
    }

    private IEnumerator Countdown()
    {
        Debug.Log("3");
        yield return new WaitForSeconds(step);   // 여기서 쉬었다 이어서

        Debug.Log("2");
        yield return new WaitForSeconds(step);

        Debug.Log("1");
        yield return new WaitForSeconds(step);

        Debug.Log("발사!");
    }
}
