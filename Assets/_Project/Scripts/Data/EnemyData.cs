using UnityEngine;

// 087·088회차 · 몬스터 한 종류의 수치. 코드가 아니라 에셋 파일이다.
//
// 공통 수치만 여기 둔다. 그 종류만의 값(탱커의 피해 감소, 돌진형의 돌진 피해)은
// 여전히 컴포넌트에 있다. 전부 몰아넣으면 안 쓰는 칸이 잔뜩 생긴다.
[CreateAssetMenu(fileName = "Enemy_", menuName = "WaveBreaker/Enemy Data")]
public class EnemyData : ScriptableObject
{
    [Header("이름")]
    public string title = "몬스터";

    [Header("수치")]
    public int maxHealth = 10;
    public int damage = 1;
    public float moveSpeed = 2f;

    [Header("겉모습")]
    public Color color = Color.white;
    public float scale = 1f;
}
