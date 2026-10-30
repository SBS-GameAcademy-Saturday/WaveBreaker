using UnityEngine;

// 조합 레시피 하나. 에셋 하나가 레시피 하나다.
//
// 🔑 재료 둘이 모두 MAX 레벨이면 결과 무기가 보상 창에 뜬다.
//    레시피를 추가하는 데 코드를 안 고친다.
[CreateAssetMenu(fileName = "Fusion_", menuName = "WaveBreaker/Weapon Fusion")]
public class WeaponFusionData : ScriptableObject
{
    public WeaponData materialA;
    public WeaponData materialB;
    public WeaponData result;

    [TextArea] public string description = "두 무기를 합친다";

    public bool CanMake(WeaponInventory inv)
    {
        if (materialA == null || materialB == null || result == null) return false;
        if (inv.Has(result)) return false;

        return inv.IsMax(materialA) && inv.IsMax(materialB);
    }
}
