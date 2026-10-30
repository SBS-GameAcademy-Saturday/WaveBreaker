using UnityEngine;

// 몬스터 한 종류. 에셋 하나가 몬스터 하나다.
// 🔑 스크립트를 안 짜고 종류를 늘리려고 만든다.
[CreateAssetMenu(fileName = "Enemy_", menuName = "WaveBreaker/Enemy Data")]
public class EnemyData : ScriptableObject
{
    [Header("정체")]
    public string title = "몬스터";

    [Header("겉모습")]
    public RuntimeAnimatorController animator;
    public Sprite sprite;
    public float scale = 1f;
    public Color tint = Color.white;

    [Header("수치")]
    public int maxHealth = 20;
    public int contactDamage = 2;
    public float moveSpeed = 2f;

    // 🔑 0 은 빈 칸이 아니라 "감소 없음" 이다. 그래서 값이고, 데이터로 둔다.
    [Range(0f, 0.9f)] public float damageReduction = 0f;

    [Header("보상")]
    public int gemExp = 1;

    [Header("보스")]
    public bool isBoss;
    public bool isFinalBoss;
}
