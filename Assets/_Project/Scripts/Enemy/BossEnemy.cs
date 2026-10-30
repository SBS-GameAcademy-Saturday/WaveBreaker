using UnityEngine;

// 보스. **죽을 때 하는 일이 다르다** — 그래서 클래스를 나눈다.
//
// 🔑 숫자가 다르면 데이터, 행동이 다르면 클래스. 그 기준의 예시다.
public class BossEnemy : Enemy
{
    protected override void Start()
    {
        base.Start();
        Debug.Log($"보스 등장 — {(data != null ? data.title : name)}");
    }

    protected override void Die()
    {
        bool final = data != null && data.isFinalBoss;

        base.Die();

        if (final && GameManager.Instance != null)
        {
            GameManager.Instance.ChangeState(GameState.Clear);
        }
    }
}
