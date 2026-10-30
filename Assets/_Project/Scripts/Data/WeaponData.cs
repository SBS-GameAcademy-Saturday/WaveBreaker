using UnityEngine;

public enum WeaponKind { Orbit, Gun, Aura }

// 무기 한 종류.
//
// 🔑 레벨마다 수치를 통째로 적어두지 않는다. **기본값 하나 + 강화 갈래**다.
//    "피해를 올릴까, 칼을 늘릴까" 를 고르게 하려면 갈래가 데이터여야 한다.
//    갈래를 하나 더 만들고 싶으면 배열에 칸을 늘리면 된다. 코드는 그대로다.
[CreateAssetMenu(fileName = "Weapon_", menuName = "WaveBreaker/Weapon Data")]
public class WeaponData : ScriptableObject
{
    [Header("정체")]
    public string title = "무기";
    public Sprite icon;
    public WeaponKind kind;

    [Header("그림")]
    public GameObject projectilePrefab;   // 총알 · 칼날 등
    public Sprite bodySprite;

    // 🔑 장판처럼 **계속 움직여야 하는 그림**은 컨트롤러를 끼운다.
    //    비워 두면 bodySprite 한 장이 가만히 그려진다.
    public RuntimeAnimatorController bodyAnimator;

    // 🔑 고리만 있으면 가운데가 휑하다. 안쪽을 옅게 깔아 주면
    //    "여기까지가 내 땅" 이라는 게 한눈에 들어온다.
    public Sprite bodyFillSprite;

    [Header("기본 수치 (Lv.1)")]
    public WeaponLevel baseStat = new WeaponLevel();

    [Header("강화 갈래 (보통 둘 — 피해 / 개수)")]
    public WeaponUpgrade[] upgrades = new WeaponUpgrade[0];

    // 🔑 갈래들의 maxStack 합 + 1 이 실제 도달 가능한 최대 레벨이다.
    //    여기 적은 값이 더 작으면 그쪽이 먼저 막는다.
    [Header("한계")]
    public int maxLevel = 7;
}

[System.Serializable]
public class WeaponLevel
{
    public int damage = 3;
    public float interval = 1f;    // 발사·타격 간격
    public float range = 6f;       // 사거리 · 반지름
    public int count = 1;          // 칼 자루 수 · 탄 수
    public float speed = 8f;       // 투사체 속도 · 회전 속도
}

// 강화 한 갈래. 한 번 고를 때마다 아래 값이 **더해진다.**
[System.Serializable]
public class WeaponUpgrade
{
    public string title = "피해 +";
    [TextArea] public string desc = "한 대가 더 아프다";
    public Sprite icon;

    [Header("한 번에 더할 값")]
    public int damage;
    public int count;
    public float range;
    public float interval;         // 🔑 음수를 넣으면 빨라진다
    public float speed;

    [Header("몇 번까지")]
    public int maxStack = 3;

    // 🔑 열리는 조건. 무기 레벨이 여기 적은 값 이상이어야 보상에 뜬다.
    //    "칼을 늘리려면 먼저 한 번은 벼려야 한다" 같은 규칙을 데이터로 건다.
    [Header("열리는 조건")]
    public int requireLevel = 1;

    // 다른 갈래를 몇 번 이상 올렸어야 하는가. -1 이면 따지지 않는다.
    public int requireOtherPath = -1;
    public int requireOtherStack = 0;
}
