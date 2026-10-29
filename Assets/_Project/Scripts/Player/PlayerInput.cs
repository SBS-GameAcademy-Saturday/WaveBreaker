using UnityEngine;

// 067회차 · 입력만 읽는다. 움직이지는 않는다. ← 설계 규칙 ②
//
// 🔑 왜 나누나
//    "누가 눌렀나" 와 "어떻게 움직이나" 는 다른 일이다.
//    22주차에 협동을 붙이면 **입력은 각자 자기 것만 읽고, 움직임은 서버가 정한다.**
//    지금 나눠 두면 그때 이 파일만 갈아 끼우면 된다. 붙여 두면 둘 다 다시 짠다.
public class PlayerInput : MonoBehaviour
{
    // 밖에서는 읽기만 된다. 값을 정하는 건 이 스크립트뿐이다.
    public Vector2 MoveInput { get; private set; }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        // 🚨 .normalized 가 없으면 대각선이 빠르다 (059회차에서 겪은 그것).
        MoveInput = new Vector2(h, v).normalized;
    }
}
