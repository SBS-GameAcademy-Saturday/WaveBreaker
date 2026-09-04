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
    [SerializeField] private Animator anim;

    void FixedUpdate()
    {
        if (input == null || rb == null) return;

        // 내 것이 아니면 아무것도 안 한다.
        //   위치는 NetworkTransform 이, 애니메이션은 NetworkAnimator 가 받아서 맞춰 준다.
        //   여기서 손대면 받은 값과 싸운다.
        if (!IsOwner)
        {
            rb.linearVelocity = Vector2.zero;
            return;
        }

        // 123회차 · 멈춰 있으면 아무도 안 움직인다.
        rb.linearVelocity = NetworkTeam.IsPaused ? Vector2.zero : input.MoveInput * moveSpeed;

        // 🔑 067회차 PlayerController 와 **똑같은 한 줄**이다.
        //    내 화면에서 내 애니메이터에 넣기만 하면, 상대 화면에는 NetworkAnimator 가 옮겨 준다.
        if (anim != null) anim.SetFloat("Speed", rb.linearVelocity.magnitude);
    }
}
