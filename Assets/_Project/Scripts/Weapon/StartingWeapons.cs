using UnityEngine;

// 시작할 때 가질 무기를 **Inspector 에서 고른다.**
//
// 🚨 전에는 무기 스크립트가 제 Start() 안에서 스스로 Acquire() 를 불렀다.
//    그래서 시작 무기를 바꾸려면 두 파일을 고쳐야 했다 —
//    빼는 쪽에서 한 줄 지우고, 넣는 쪽에 한 줄 쓰고. 무기가 늘면 더 늘어난다.
//    이제 무기는 "얻으면 작동한다" 만 알고, **누가 언제 주는지는 여기가 정한다.**
public class StartingWeapons : MonoBehaviour
{
    // 🔑 인터페이스는 Inspector 칸에 못 나온다. 유니티가 모르는 타입이기 때문이다.
    //    그래서 MonoBehaviour 로 받고, 꺼낼 때 "무기가 맞나" 를 확인한다.
    [SerializeField] private MonoBehaviour[] weapons;

    private void Start()
    {
        Give();
    }

    public void Give()
    {
        foreach (MonoBehaviour item in weapons)
        {
            if (item == null) continue;

            if (item is IWeapon weapon)
            {
                weapon.Acquire();
                continue;
            }

            // 엉뚱한 걸 끌어다 놨을 때 조용히 넘어가면 "왜 무기가 없지" 로 한참 헤맨다.
            Debug.LogWarning($"{item.GetType().Name} 은 무기가 아니다 — IWeapon 이 없다", item);
        }
    }
}
