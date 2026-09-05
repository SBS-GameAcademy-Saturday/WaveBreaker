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
    [SerializeField] private SpriteRenderer sprite;

    // 132회차 · 바라보는 쪽. 검기가 이 값을 보고 어느 쪽을 벨지 정한다.
    //
    // 🔑 쓰기 권한이 Owner 다. 지금까지 본 NetworkVariable 은 전부 Server 였다.
    //    "누가 정하는 값인가" 로 고른다 — 어느 쪽을 보는지는 그 사람이 정한다.
    public NetworkVariable<bool> FacingLeft = new NetworkVariable<bool>(
        false, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Owner);

    // 132회차 · 레벨업으로 빨라진다. 서버가 바꾼다.
    public void SpeedUp(float step)
    {
        if (!IsServer) return;
        moveSpeed += step;
    }

    void FixedUpdate()
    {
        if (input == null || rb == null) return;

        // 내 것이 아니면 아무것도 안 한다.
        //   위치는 NetworkTransform 이, 애니메이션은 NetworkAnimator 가 받아서 맞춰 준다.
        //   여기서 손대면 받은 값과 싸운다.
        if (!IsOwner)
        {
            rb.linearVelocity = Vector2.zero;
            if (sprite != null) sprite.flipX = FacingLeft.Value;   // 받은 값으로 뒤집는다
            return;
        }

        // 123회차 · 멈춰 있으면 아무도 안 움직인다.
        rb.linearVelocity = NetworkTeam.IsPaused ? Vector2.zero : input.MoveInput * moveSpeed;

        // 🔑 067회차 PlayerController 와 **똑같은 한 줄**이다.
        //    내 화면에서 내 애니메이터에 넣기만 하면, 상대 화면에는 NetworkAnimator 가 옮겨 준다.
        if (anim != null) anim.SetFloat("Speed", rb.linearVelocity.magnitude);

        // 067회차와 같다. 가는 쪽으로 그림을 뒤집고, 그 사실을 값으로 남긴다.
        float x = input.MoveInput.x;
        if (x != 0f)
        {
            bool left = x < 0f;
            if (sprite != null) sprite.flipX = left;
            if (FacingLeft.Value != left) FacingLeft.Value = left;
        }
    }
}
