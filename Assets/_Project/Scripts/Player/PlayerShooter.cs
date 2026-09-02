using UnityEngine;

/// <summary>
/// 047회차 — 코드가 프리팹을 찍어낸다.
///
/// ⚠️ Inspector 두 칸의 출처가 다르다. 이 회차 최다 사고다.
///    Bullet Prefab  →  Project 창의 Bullet.prefab   (원본이라 씬에 없다)
///    Fire Point     →  Hierarchy 의 FirePoint       (씬에 실제로 있는 자식)
///
/// ⚠️ GetKeyDown 은 Update 에 쓴다. FixedUpdate 에 쓰면 눌러도 씹힌다.
///    042회차에서 미리 경고해 둔 그 자리다.
/// </summary>
public class PlayerShooter : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;

    // 총구. Player 의 자식이라 플레이어를 따라다닌다 (033 부모자식).
    [SerializeField] private Transform firePoint;

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // Quaternion.identity 는 "안 돌린 상태" 라는 뜻이다.
            // 회전 계산은 Phase 5 에서 제대로 한다.
            Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);
        }
    }
}
