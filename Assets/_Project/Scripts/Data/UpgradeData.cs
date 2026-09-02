using UnityEngine;

// 089회차 · 업그레이드 하나의 데이터. 코드가 아니라 에셋 파일이다.
//
// [CreateAssetMenu] 를 붙이면 Project 창의 Create 메뉴에 항목이 생긴다.
// 이게 없으면 에셋을 만들 방법이 없다.
[CreateAssetMenu(fileName = "Upgrade_", menuName = "WaveBreaker/Upgrade Data")]
public class UpgradeData : ScriptableObject
{
    public UpgradeType type;

    [Header("카드에 표시할 것")]
    public string title = "이름";
    [TextArea] public string description = "설명";

    [Header("얼마나 강해지나")]
    public float value = 1f;      // 종류마다 뜻이 다르다 (칼 개수 / 초당 각도 / 피해 …)
    public float minLimit = 0f;   // 간격처럼 "작을수록 좋은" 값의 하한
}
