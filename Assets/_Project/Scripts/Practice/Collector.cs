using UnityEngine;

/// <summary>
/// 044회차 — 부딪힌 것을 코드로 받는다.
///
/// 여기서 확인할 것
///   1. OnTriggerEnter2D 는 내가 부르지 않는다. 유니티가 "닿는 순간" 불러준다.
///      036 의 Start / Update 와 같은 구조다. 다만 매 프레임이 아니라 닿을 때다.
///   2. 괄호 안의 other 가 "닿은 상대" 다. 5주차의 매개변수와 같고, 넣어주는 사람이 유니티다.
///   3. Tag 로 골라내야 벽·바닥에 반응하지 않는다.
///
/// ⚠️ Trigger 와 Collision 은 매개변수 타입이 다르다. 글자 한 개 차이다.
///      OnTriggerEnter2D(Collider2D  other)      Is Trigger 켜짐 — 통과
///      OnCollisionEnter2D(Collision2D collision) Is Trigger 꺼짐 — 막힘
///    손으로 치지 말고 자동완성으로 넣는다. 이름을 틀리면 컴파일 에러도 안 나고
///    그냥 조용히 아무 일도 안 일어난다 — 이 회차 최다 사고다.
///
/// 💡 먹은 동전을 SetActive(false) 로 끄는 것은 040 에서 한 그대로다.
///    진짜로 없애는 Destroy 는 046회차, 상대 체력을 깎는 GetComponent 는 047회차다.
/// </summary>
public class Collector : MonoBehaviour
{
    private int coinCount;

    private void OnTriggerEnter2D(Collider2D other)
    {
        // tag == "Coin" 도 되지만 CompareTag 를 쓴다.
        // 더 빠르고, 없는 Tag 를 쓰면 에러로 알려준다. == 는 오타를 조용히 넘긴다.
        if (other.CompareTag("Coin"))
        {
            coinCount++;
            Debug.Log(coinCount + "개째 먹었다");

            other.gameObject.SetActive(false);
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        // Collision2D 자체에는 이름이 없다. gameObject 를 거쳐야 한다.
        Debug.Log("부딪혔다: " + collision.gameObject.name);
    }
}
