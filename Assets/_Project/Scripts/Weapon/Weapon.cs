using UnityEngine;

// 무기 하나. 수치는 전부 WeaponData 에서 온다.
//
// 🔑 무기 종류마다 **공격하는 방식**이 다르다. 그래서 여기는 클래스를 나눈다.
//    (몬스터는 숫자만 달라서 안 나눴다 — 기준이 같다)
//
// 🔑 강화는 갈래별로 쌓인다. 레벨은 쌓은 횟수의 합 + 1 이다.
public abstract class Weapon : MonoBehaviour
{
    [SerializeField] protected WeaponData data;

    private int[] stacks = new int[0];
    private WeaponLevel stat = new WeaponLevel();

    public WeaponData Data => data;
    public int Level { get; private set; } = 1;
    public bool IsMax => Level >= MaxLevel;
    protected WeaponLevel Stat => stat;

    protected float nextFire;
    protected Transform owner;

    // 갈래들을 끝까지 올렸을 때의 레벨과, 데이터에 적은 한계 중 작은 쪽
    private int MaxLevel
    {
        get
        {
            int sum = 1;
            foreach (var u in data.upgrades) sum += u.maxStack;
            return Mathf.Min(sum, data.maxLevel);
        }
    }

    public void Setup(WeaponData d, Transform who)
    {
        data = d;
        owner = who;
        stacks = new int[d.upgrades != null ? d.upgrades.Length : 0];
        Recalc();
    }

    public int StackOf(int path) => path >= 0 && path < stacks.Length ? stacks[path] : 0;

    public bool CanTake(int path)
    {
        if (IsMax || path < 0 || path >= stacks.Length) return false;

        WeaponUpgrade u = data.upgrades[path];
        if (stacks[path] >= u.maxStack) return false;
        if (Level < u.requireLevel) return false;

        // 다른 갈래를 먼저 올려야 열리는 갈래도 있다
        if (u.requireOtherPath >= 0 && u.requireOtherPath < stacks.Length
            && stacks[u.requireOtherPath] < u.requireOtherStack) return false;

        return true;
    }

    // 지금 이 갈래를 고르면 숫자가 어떻게 변하는지. 보상 카드가 쓴다.
    public string Preview(int path)
    {
        if (path < 0 || path >= stacks.Length) return "";

        WeaponUpgrade u = data.upgrades[path];
        if (u.damage != 0) return $"피해 {stat.damage} → {stat.damage + u.damage}";
        if (u.count != 0) return $"개수 {stat.count} → {stat.count + u.count}";
        if (u.range != 0f) return $"범위 {stat.range:0.0} → {stat.range + u.range:0.0}";
        if (u.interval != 0f) return $"간격 {stat.interval:0.00} → {Mathf.Max(0.05f, stat.interval + u.interval):0.00}";
        return "";
    }

    public void Take(int path)
    {
        if (!CanTake(path)) return;
        stacks[path]++;
        Recalc();
    }

    // 🚨 매 프레임 계산하면 쓰레기가 쌓인다. 바뀔 때만 다시 센다.
    private void Recalc()
    {
        WeaponLevel b = data.baseStat;
        stat.damage = b.damage;
        stat.interval = b.interval;
        stat.range = b.range;
        stat.count = b.count;
        stat.speed = b.speed;

        int level = 1;
        for (int i = 0; i < stacks.Length; i++)
        {
            WeaponUpgrade u = data.upgrades[i];
            stat.damage += u.damage * stacks[i];
            stat.count += u.count * stacks[i];
            stat.range += u.range * stacks[i];
            stat.interval += u.interval * stacks[i];
            stat.speed += u.speed * stacks[i];
            level += stacks[i];
        }

        stat.interval = Mathf.Max(0.05f, stat.interval);   // 0 이 되면 한 프레임에 무한 발사
        stat.count = Mathf.Max(1, stat.count);
        Level = level;

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
