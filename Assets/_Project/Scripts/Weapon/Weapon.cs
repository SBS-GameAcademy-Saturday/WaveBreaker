using UnityEngine;

// 무기 하나. 수치는 전부 WeaponData 에서 온다.
//
// 🔑 무기 종류마다 **공격하는 방식**이 다르다. 그래서 여기는 클래스를 나눈다.
//    (몬스터는 숫자만 달라서 안 나눴다 — 기준이 같다)
public abstract class Weapon : MonoBehaviour
{
    [SerializeField] protected WeaponData data;

    public WeaponData Data => data;
    public int Level { get; private set; } = 1;
    protected WeaponLevel Stat => data.At(Level);

    protected float nextFire;
    protected Transform owner;

    public void Setup(WeaponData d, Transform who)
    {
        data = d;
        owner = who;
        Level = 1;
        OnLevelChanged();
    }

    public void LevelUp()
    {
        Level = Mathf.Min(Level + 1, data.MaxLevel);
        OnLevelChanged();
    }

    public bool IsMax => Level >= data.MaxLevel;

    protected virtual void OnLevelChanged() { }

    protected virtual void Update()
    {
        if (data == null) return;
        if (GameManager.Instance != null && GameManager.Instance.State != GameState.Playing) return;

        Tick();
    }

    protected abstract void Tick();

    // 가장 가까운 적을 찾는다. 여러 무기가 쓴다.
    protected Transform Nearest(float range)
    {
        Collider2D[] hits = Physics2D.OverlapCircleAll(transform.position, range);

        float best = float.MaxValue;
        Transform found = null;

        foreach (Collider2D h in hits)
        {
            if (!h.CompareTag("Enemy")) continue;

            float d = Vector2.Distance(transform.position, h.transform.position);
            if (d < best) { best = d; found = h.transform; }
        }

        return found;
    }
}
