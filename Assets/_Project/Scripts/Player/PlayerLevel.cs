using UnityEngine;

// 083회차 · 경험치를 모으고 레벨을 올린다.
// 레벨업 곡선: 다음 레벨까지 필요한 경험치 = baseExp + (Level - 1) * expStep
public class PlayerLevel : MonoBehaviour
{
    [SerializeField] private int baseExp = 5;
    [SerializeField] private int expStep = 3;
    [SerializeField] private LevelUpView levelUpView;

    public int Level { get; private set; } = 1;
    public int Exp { get; private set; }
    public int NeedExp => baseExp + (Level - 1) * expStep;

    public void AddExp(int amount)
    {
        Exp += amount;

        bool leveled = false;

        // 한 번에 두 레벨이 오를 수도 있다. while 로 돌린다.
        while (Exp >= NeedExp)
        {
            Exp -= NeedExp;
            Level++;
            leveled = true;

            Debug.Log($"레벨 업!  Lv.{Level}  (다음까지 {NeedExp})");
        }

        // 두 레벨이 한 번에 올라도 카드는 한 번만 띄운다. 지금은 그걸로 충분하다.
        if (leveled && levelUpView != null)
        {
            levelUpView.Open();
        }
    }
}
