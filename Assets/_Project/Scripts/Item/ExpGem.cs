using UnityEngine;

// 081·082회차 · 몬스터가 죽으면 떨어지는 경험치 젬.
// 081 — 떨어지기만 한다. 밟아야 먹는다.
// 082 — 자석 범위 안에 들어오면 플레이어 쪽으로 끌려온다.
// 103회차 · 먹으면 버리지 않고 서랍에 반납한다.
public class ExpGem : MonoBehaviour
{
    [SerializeField] private int exp = 1;
    [SerializeField] private float magnetRange = 2.5f;
    [SerializeField] private float moveSpeed = 8f;

    private Transform player;

    private void Start()
    {
        GameObject found = GameObject.FindWithTag("Player");

        if (found != null)
        {
            player = found.transform;
        }
    }

    private void Update()
    {
        if (player == null) return;

        // 자석 범위 밖이면 가만히 있는다.
        if (Vector2.Distance(transform.position, player.position) > magnetRange) return;

        transform.position = Vector3.MoveTowards(
            transform.position, player.position, moveSpeed * Time.deltaTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (!other.CompareTag("Player")) return;

        if (other.TryGetComponent(out PlayerLevel level))
        {
            level.AddExp(exp);
        }

        PoolManager.Despawn(gameObject);
    }

    private void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, magnetRange);
    }
}
