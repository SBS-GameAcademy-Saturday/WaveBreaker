using UnityEngine;

// 072회차 · 러너. 빠르고 약하다. **떼로 몰려온다.**
//
// 🔑 움직이는 법은 오크와 같다 — 플레이어를 향해 직진.
//    다른 건 **수치**(빠르고 약하다)와 **나오는 방법**(WaveManager 가 떼로 뿌린다)뿐이다.
//    뱀서류가 적 종류를 늘리는 방식이 이렇다. 한 마리씩 보면 다 비슷하고,
//    **어떻게 쏟아지느냐**가 체감을 만든다.
public class RunnerEnemy : Enemy
{
    protected override void Start()
    {
        base.Start();   // 🚨 빼면 체력이 0 이고 player 도 못 찾는다
        Debug.Log($"{name} : 러너 등장 (체력 {maxHealth}, 속도 {moveSpeed})");
    }
}
