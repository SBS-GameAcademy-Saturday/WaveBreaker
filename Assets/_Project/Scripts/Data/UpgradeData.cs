using UnityEngine;

public enum StatKind { MaxHealth, MoveSpeed, PickupRange }

// 몸 강화 카드. 무기 카드는 런타임에 만든다 (무기 보유 상태에 따라 달라지므로).
[CreateAssetMenu(fileName = "Upgrade_", menuName = "WaveBreaker/Upgrade Data")]
public class UpgradeData : ScriptableObject
{
    public string title = "강화";
    [TextArea] public string description = "";
    public Sprite icon;

    public StatKind stat;
    public float value = 1f;
}
