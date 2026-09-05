// 085회차 · 업그레이드 종류. 086회차에서 8종으로 늘렸다.
// 132회차 · 무기를 "획득" 하는 카드가 생겼다. 뱀파이어 서바이벌과 같은 구조다.
public enum UpgradeType
{
    // 🚨 순서를 바꾸거나 중간에 끼워 넣지 마라.
    //    에셋 파일에는 이름이 아니라 **번호**가 저장된다. 앞에 하나 끼우면
    //    이미 만든 카드 8장의 뜻이 전부 한 칸씩 밀린다 (실제로 132회차에 그렇게 만들고 되돌렸다).
    //    새 종류는 반드시 **맨 뒤에** 붙인다.
    BladeCount,     // 0 · 칼 한 자루 추가
    BladeSpeed,     // 1 · 칼 회전 속도 상승
    BladeDamage,    // 2 · 칼 피해 상승
    FireRate,       // 3 · 총 연사 상승
    GunDamage,      // 4 · 총알 피해 상승
    Pierce,         // 5 · 총알 관통 +1
    MoveSpeed,      // 6 · 이동 속도 상승
    MaxHealth,      // 7 · 최대 체력 상승 (그만큼 회복도 된다)

    // ── 132회차에 새로 붙인 것. 무기를 "얻는" 카드와 새 무기 강화다.
    WeaponBlade,    // 8 · 회전하는 칼을 얻는다
    WeaponSlash,    // 9 · 검기(휘두르기)를 얻는다
    SlashDamage,    // 10 · 검기 피해 상승
    SlashRate,      // 11 · 검기를 더 자주 휘두른다
    WeaponGun       // 12 · 자동 총을 얻는다
}

// 어떤 무기에 딸린 카드인가.
public enum WeaponKind
{
    None,     // 무기와 상관없는 카드 (이동 속도·체력)
    Gun,      // 자동 총
    Blade,    // 회전 칼
    Slash     // 검기 (휘두르기)
}

// 🔑 132회차 · "이 카드를 지금 보여줘도 되나" 를 판단하는 규칙을 한 곳에 모았다.
//
//    없는 무기의 강화 카드가 나오면 안 된다 — 칼도 없는데 "칼 피해 +" 를 고르면 아무 일도 안 일어난다.
//    이미 가진 무기의 획득 카드가 나와도 안 된다 — 두 번 얻을 수 없다.
public static class UpgradeRule
{
    // 이 카드가 어느 무기에 속하나
    public static WeaponKind Weapon(UpgradeType type)
    {
        switch (type)
        {
            case UpgradeType.WeaponBlade:
            case UpgradeType.BladeCount:
            case UpgradeType.BladeSpeed:
            case UpgradeType.BladeDamage:
                return WeaponKind.Blade;

            case UpgradeType.WeaponSlash:
            case UpgradeType.SlashDamage:
            case UpgradeType.SlashRate:
                return WeaponKind.Slash;

            case UpgradeType.WeaponGun:
            case UpgradeType.FireRate:
            case UpgradeType.GunDamage:
            case UpgradeType.Pierce:
                return WeaponKind.Gun;

            default:
                return WeaponKind.None;
        }
    }

    // 무기를 새로 얻는 카드인가
    public static bool IsAcquire(UpgradeType type)
    {
        return type == UpgradeType.WeaponBlade
            || type == UpgradeType.WeaponSlash
            || type == UpgradeType.WeaponGun;
    }

    // 🚨 처음엔 bool 하나만 받게 만들었다가 총 카드까지 막혔다.
    //    "가지고 있나" 는 무기마다 따로 물어봐야 한다. 무기가 늘어나도 이 함수는 안 고친다.
    public static bool CanShow(UpgradeType type, System.Func<WeaponKind, bool> owns)
    {
        WeaponKind kind = Weapon(type);

        if (kind == WeaponKind.None) return true;      // 몸 강화는 언제나
        if (IsAcquire(type)) return !owns(kind);       // 획득 카드는 없을 때만
        return owns(kind);                             // 강화 카드는 있을 때만
    }
}
