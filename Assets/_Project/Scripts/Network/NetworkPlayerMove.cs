using Unity.Netcode;
using UnityEngine;

// 112회차 · 067회차의 PlayerController 를 네트워크판으로 옮긴 것.
//
// 움직이는 코드 자체는 067과 **똑같다.** 네트워크라고 달라지는 게 없다.
// 달라지는 건 "누가 이 코드를 돌리는가" 뿐이고, 그건 NetworkPlayerInput 이 정한다.
//
// 🔑 위치를 상대에게 보내는 일은 이 스크립트가 안 한다. NetworkTransform 이 한다.
//    우리는 그냥 평소대로 움직이면 된다.
public class NetworkPlayerMove : NetworkBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private NetworkPlayerInput input;
    [SerializeField] private Rigidbody2D rb;

    void FixedUpdate()
    {
        if (input == null || rb == null) return;

        // 내 것이 아니면 움직이지 않는다. 상대 캐릭터는 NetworkTransform 이 옮겨 준다.
        // 여기서 속도를 건드리면 받은 위치와 싸운다.
        if (!IsOwner)
        {
            rb.linearVelocity = Vector2.zero;
            return;
        }

        rb.linearVelocity = input.MoveInput * moveSpeed;
    }
}
