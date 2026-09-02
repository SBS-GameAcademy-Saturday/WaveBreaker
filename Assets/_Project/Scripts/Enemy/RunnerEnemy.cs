using UnityEngine;

// 072회차 · 러너. 빠르지만 방향을 한 번만 정하고 그대로 직진한다.
// Enemy 세 종류 중 Move() 를 바꾼 쪽이다.
public class RunnerEnemy : Enemy
{
    private Vector2 chargeDir;
    private bool aimed;

    protected override void Start()
    {
        base.Start();   // 이걸 빼면 체력이 0 인 채로 시작한다.
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
