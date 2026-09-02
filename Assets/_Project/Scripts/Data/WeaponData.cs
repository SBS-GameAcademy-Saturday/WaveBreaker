using UnityEngine;

// 088회차 · 무기 두 종의 시작 수치. 플레이어가 가진 무기라 한 에셋에 같이 둔다.
//
// ⚠️ 여기 값은 "시작값" 이다. 게임 중 업그레이드로 변하는 건 각 컴포넌트의 런타임 값이고,
//    이 에셋은 건드리지 않는다. SO 값을 게임 중에 바꾸면 에디터에 그대로 저장되기 때문이다.
[CreateAssetMenu(fileName = "WeaponData", menuName = "WaveBreaker/Weapon Data")]
public class WeaponData : ScriptableObject
{
    [Header("회전 칼")]
    public int bladeCount = 3;
    public float bladeRadius = 2f;
    public float bladeRotateSpeed = 180f;
    public int bladeDamage = 3;
    public float bladeHitInterval = 0.3f;

    [Header("자동 총")]
    public float gunRange = 8f;
    public float gunFireInterval = 0.5f;
    public int gunDamage = 3;
    public int gunPierce = 2;
}
