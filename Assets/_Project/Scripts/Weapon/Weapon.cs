using UnityEngine;

// 무기 하나. 수치는 전부 WeaponData 에서 온다.
//
// 🔑 무기 종류마다 **공격하는 방식**이 다르다. 그래서 여기는 클래스를 나눈다.
//    (몬스터는 숫자만 달라서 안 나눴다 — 기준이 같다)
//
// 🔑 레벨이 오르면 data.steps 를 **처음부터 레벨 직전까지** 다시 더한다.
//    누적값을 따로 들고 있지 않아서, 어느 레벨이든 같은 결과가 나온다.
public abstract class Weapon : MonoBehaviour
{
    [SerializeField] protected WeaponData data;

    private readonly WeaponLevel stat = new WeaponLevel();

    public WeaponData Data => data;
    public int Level { get; private set; } = 1;
    public bool IsMax => Level >= data.MaxLevel;
    protected WeaponLevel Stat => stat;

    protected float nextFire;
    protected Transform owner;

    public void Setup(WeaponData d, Transform who)
    {
        data = d;
        owner = who;
        Level = 1;
        Recalc();
    }

    public void LevelUp()
    {
        if (IsMax) return;
        Level++;
        Recalc();
    }

    // 다음 레벨에서 무엇이 오르는지. 보상 카드가 쓴다.
    public WeaponStep NextStep =>
        IsMax ? null : data.steps[Level - 1];

    public string Preview()
    {
        WeaponStep s = NextStep;
        if (s == null) return "";

        if (s.count != 0) return $"개수 {stat.count} → {stat.count + s.count}";
        if (s.damage != 0) return $"피해 {stat.damage} → {stat.damage + s.damage}";
        if (s.range != 0f) return $"범위 {stat.range:0.0} → {stat.range + s.range:0.0}";
        if (s.interval != 0f) return $"간격 {stat.interval:0.00} → {Mathf.Max(0.05f, stat.interval + s.interval):0.00}";
        return "";
    }

    // 🚨 매 프레임 계산하면 쓰레기가 쌓인다. 레벨이 바뀔 때만 다시 센다.
    private void Recalc()
    {
        WeaponLevel b = data.baseStat;
        stat.damage = b.damage;
        stat.interval = b.interval;
        stat.range = b.range;
        stat.count = b.count;
        stat.speed = b.speed;

        for (int i = 0; i < Level - 1 && i < data.steps.Length; i++)
        {
            WeaponStep s = data.steps[i];
            stat.damage += s.damage;
            stat.count += s.count;
            stat.range += s.range;
            stat.interval += s.interval;
            stat.speed += s.speed;
        }

        stat.interval = Mathf.Max(0.05f, stat.interval);   // 0 이 되면 한 프레임에 무한 발사
        stat.count = Mathf.Max(1, stat.count);

        OnLevelChanged();
    }

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
