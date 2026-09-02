using UnityEngine;

// 067회차 · 입력을 "읽기만" 한다. 움직이는 일은 PlayerController 가 한다.
// 읽는 곳과 움직이는 곳을 나눠두면 나중에 입력원을 바꿔도 이동 코드를 안 고친다.
public class PlayerInput : MonoBehaviour
{
    public Vector2 MoveInput { get; private set; }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        MoveInput = new Vector2(h, v).normalized;
    }
}
