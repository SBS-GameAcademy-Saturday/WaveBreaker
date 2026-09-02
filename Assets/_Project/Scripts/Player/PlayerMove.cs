using UnityEngine;

/// <summary>
/// 040회차 — WASD 로 움직이는 캐릭터. Phase 2 의 산출물이다.
///
/// 새로 배우는 건 입력을 읽는 첫 두 줄뿐이고, 나머지는 038·039 에서 한 그대로다.
///
/// ⚠️ 강사 사전 확인
///    Project Settings > Player > Other Settings > Active Input Handling 이
///    "Both" 여야 한다. "Input System Package (New)" 상태면 Input.GetAxisRaw 가
///    컴파일은 되는데 런타임에 InvalidOperationException 을 던진다.
///    바꾸면 에디터 재시작이 필요하다.
///
/// 이 스크립트는 Practice 가 아니라 Scripts/Player 에 둔다.
/// 연습용이 아니라 본 프로젝트로 이어지는 첫 코드이기 때문이다.
/// </summary>
public class PlayerMove : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;

    // 스페이스로 껐다 켤 대상. Hierarchy 에서 Inspector 의 이 칸으로 드래그해 넣는다.
    // 비워 두면 스페이스를 누르는 순간 NullReferenceException 이 난다.
    [SerializeField] private GameObject item;

    private void Update()
    {
        // 좌우 -1 / 0 / 1,  상하 -1 / 0 / 1
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        // 읽은 두 숫자를 방향으로 묶는다.
        // 아무 키도 안 누르면 (0,0,0) 이라 안 움직인다 — 조건문이 필요 없다.
        Vector3 dir = new Vector3(h, v, 0f);

        // 038(더해서 움직이기) + 039(deltaTime) 를 그대로 쓴다.
        transform.position = transform.position + dir * moveSpeed * Time.deltaTime;

        // GetKeyDown 은 누른 순간 한 번. GetKey 는 누르고 있는 동안 계속.
        if (Input.GetKeyDown(KeyCode.Space))
        {
            item.SetActive(!item.activeSelf);
        }
    }

    /// <summary>
    /// Play 를 누르지 않고도 Inspector 의 스크립트 우측 ⋮ 메뉴에서 실행할 수 있다.
    /// 물체가 화면 밖으로 사라졌을 때 특히 편하다.
    /// </summary>
    [ContextMenu("원점으로 보내기")]
    private void ResetPosition()
    {
        transform.position = Vector3.zero;
        Debug.Log("원점으로 보냈습니다");
    }
}
