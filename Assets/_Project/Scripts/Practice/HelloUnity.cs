using UnityEngine;

/// <summary>
/// 033회차 — 첫 스크립트.
///
/// 여기서 확인할 것 3가지
///   1. 스크립트도 결국 "클래스"다 (5~6주차에 콘솔에서 만들던 그것)
///   2. Start 는 딱 한 번, Update 는 매 프레임 실행된다
///   3. Debug.Log 는 Console 창에 찍힌다 (콘솔의 Console.WriteLine 자리)
///
/// ⚠️ 파일 이름과 클래스 이름이 다르면 컴포넌트로 붙지 않는다.
///    "Can't add script" 가 뜨면 99% 이 문제다.
/// </summary>
public class HelloUnity : MonoBehaviour
{
    // [SerializeField] 를 붙이면 private 인데도 Inspector 에 보인다.
    // 6주차 property 이야기와 이어진다 — "밖에 열어주되, 아무나 못 바꾸게".
    [SerializeField] private string greeting = "안녕하세요, 유니티";

    // [SerializeField] 가 없으면 Inspector 에 나오지 않는다. 직접 비교해볼 것.
    private int updateCount;

    /// <summary>게임이 시작될 때 딱 한 번 실행된다.</summary>
    private void Start()
    {
        Debug.Log(greeting + " / Start 는 한 번만 실행됩니다.");
    }

    /// <summary>매 프레임 실행된다. 1초에 수십~수백 번이다.</summary>
    private void Update()
    {
        updateCount++;

        // 매 프레임 찍으면 Console 이 순식간에 잠긴다.
        // 60번에 한 번만 찍어서 "얼마나 자주 도는지"를 눈으로 확인한다.
        if (updateCount % 60 == 0)
        {
            Debug.Log("Update 가 " + updateCount + "번 실행됐습니다.");
        }
    }
}
