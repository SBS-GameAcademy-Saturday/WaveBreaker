using UnityEngine;

// 072회차 · 러너. 빠르지만 **처음 본 방향으로만** 간다.
//
// 🔑 Move() 하나만 덮어쓴다. 체력·피해·죽는 법은 부모 것을 그대로 쓴다.
//    이게 상속이 일하는 모습이다.
public class RunnerEnemy : Enemy
{
    private Vector2 chargeDir;
    private bool aimed;

    protected override void Start()
    {
        base.Start();   // 🚨 빼면 체력이 0 이고 player 도 못 찾는다
        Debug.Log($"{name} : 러너 등장 (체력 {maxHealth}, 속도 {moveSpeed})");
    }

    protected override void Move()
    {
        // 처음 한 번만 플레이어를 본다. 그 뒤로는 안 꺾는다.
        if (!aimed)
        {
            chargeDir = ((Vector2)player.position - rb.position).normalized;
            sprite.flipX = chargeDir.x < 0f;
            aimed = true;
        }

        rb.linearVelocity = chargeDir * moveSpeed;
    }
}
