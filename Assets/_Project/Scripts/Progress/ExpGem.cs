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

        // 🚨 줍기와 끌어오기는 다른 일이다. 둘을 한 조건에 묶어 두면
        //    자석이 없을 때 **밟아도 안 먹히는** 젬이 된다.
        if (d < 0.5f)
        {
            level.AddExp(exp);
            Destroy(gameObject);
            return;
        }

        // 자석을 먹은 만큼만 멀리서 끌려온다. 기본값은 0 이라 끌려오지 않는다.
        if (!pulling && d <= level.PickupRange) pulling = true;
        if (!pulling) return;

        transform.position = Vector3.MoveTowards(
            transform.position, player.position, pullSpeed * Time.deltaTime);
    }
}
