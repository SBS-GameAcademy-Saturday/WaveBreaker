using UnityEngine;

// 경험치와 레벨. 레벨이 오르면 시간을 멈추고 보상 창을 연다.
public class PlayerLevel : MonoBehaviour
{
    [SerializeField] private LevelData curve;
    [SerializeField] private float pickupRange = 2.5f;

    public int Level { get; private set; } = 1;
    public int Exp { get; private set; }
    public int Need => curve != null ? curve.Need(Level) : 5 + 3 * (Level - 1);
    public float Ratio => Need > 0 ? (float)Exp / Need : 0f;
    public float PickupRange => pickupRange;

    public void AddPickupRange(float v) => pickupRange += v;

    public void AddExp(int amount)
    {
        Exp += amount;

        // 🔑 while 이다. 한 번에 여러 레벨이 오를 수 있다.
        while (Exp >= Need)
        {
            Exp -= Need;
            Level++;
            Debug.Log($"레벨 업 — Lv.{Level}");

            if (RewardView.Instance != null) RewardView.Instance.Open();
        }
    }
}
