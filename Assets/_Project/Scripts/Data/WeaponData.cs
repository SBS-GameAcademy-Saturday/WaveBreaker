using UnityEngine;

public enum WeaponKind { Orbit, Gun, Aura }

// 무기 한 종류.
//
// 🔑 레벨마다 **무엇이 오르는지 정해져 있다.** 고르는 게 아니다.
//    1→2 는 자루가 늘고, 2→3 은 아파지고, 3→4 는 또 늘고… 하는 식이다.
//    그 순서가 곧 그 무기의 성격이라, 코드가 아니라 데이터에 적는다.
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

    // 🔑 장판처럼 계속 움직여야 하는 그림은 컨트롤러를 끼운다.
    public RuntimeAnimatorController bodyAnimator;
    public Sprite bodyFillSprite;

    [Header("Lv.1 수치")]
    public WeaponLevel baseStat = new WeaponLevel();

    // 🔑 steps[0] 은 1→2, steps[1] 은 2→3 … 배열 길이 + 1 이 최대 레벨이다.
    [Header("레벨이 오를 때마다 (1→2, 2→3, …)")]
    public WeaponStep[] steps = new WeaponStep[0];

    public int MaxLevel => steps.Length + 1;
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

// 레벨 하나가 오를 때 **더해지는** 값.
[System.Serializable]
public class WeaponStep
{
    public string title = "칼 +1";     // 보상 카드에 뜰 한 줄

    [Header("더할 값")]
    public int damage;
    public int count;
    public float range;
    public float interval;             // 🔑 음수를 넣으면 빨라진다
    public float speed;
}
