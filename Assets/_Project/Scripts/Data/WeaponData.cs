using UnityEngine;

public enum WeaponKind { Orbit, Gun, Aura }

// 무기 한 종류. 레벨마다 수치가 다르므로 배열로 둔다.
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

    // 🔑 레벨 1~7. 배열 길이가 곧 최대 레벨이다.
    //    7레벨까지 올리면 조합 재료가 된다 (WeaponFusionData).
    [Header("레벨별 수치 (1~7)")]
    public WeaponLevel[] levels = new WeaponLevel[7];

    public int MaxLevel => levels.Length;
    public WeaponLevel At(int level) => levels[Mathf.Clamp(level - 1, 0, levels.Length - 1)];
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
