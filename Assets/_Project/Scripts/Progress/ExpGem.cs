using UnityEngine;

// 몬스터가 떨구는 경험치 젬. 가까이 가면 끌려온다.
public class ExpGem : MonoBehaviour
{
    [SerializeField] private float pullSpeed = 12f;

    private int exp = 1;
    private Transform player;
    private PlayerLevel level;
    private bool pulling;

    public void Setup(int value) => exp = value;

    private void Start()
    {
        GameObject p = GameObject.FindWithTag("Player");
        if (p == null) return;

        player = p.transform;
        level = p.GetComponent<PlayerLevel>();
    }

    private void Update()
    {
        if (player == null || level == null) return;

        float d = Vector2.Distance(transform.position, player.position);

        if (!pulling && d <= level.PickupRange) pulling = true;
        if (!pulling) return;

        transform.position = Vector3.MoveTowards(
            transform.position, player.position, pullSpeed * Time.deltaTime);

        if (d < 0.4f)
        {
            level.AddExp(exp);
            Destroy(gameObject);
        }
    }
}
