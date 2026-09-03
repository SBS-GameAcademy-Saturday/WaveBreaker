using Unity.Netcode;
using UnityEngine;

// 112·114회차 · 067회차의 PlayerInput 을 네트워크판으로 옮긴 것.
//
// 067에서 "입력을 읽는 곳" 과 "움직이는 곳" 을 나눠뒀다.
// 그때는 이유가 와닿지 않았을 것이다. 오늘 그 이유가 나온다.
//
// 🔑 114회차 · 아래 한 줄이 전부다.
//        if (!IsOwner) return;
//
//    입력을 읽는 곳이 여기 한 군데뿐이라 한 줄이면 끝난다.
//    만약 이동 코드 안에서 Input 을 직접 읽었다면 그 파일들을 전부 고쳐야 했다.
public class NetworkPlayerInput : NetworkBehaviour
{
    public Vector2 MoveInput { get; private set; }

    void Update()
    {
        // 🔑 내 것이 아니면 입력을 안 읽는다.
        //    이게 없으면 한 키를 눌렀을 때 화면의 모든 캐릭터가 같이 움직인다.
        if (!IsOwner)
        {
            MoveInput = Vector2.zero;
            return;
        }

        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        MoveInput = new Vector2(h, v).normalized;
    }
}
