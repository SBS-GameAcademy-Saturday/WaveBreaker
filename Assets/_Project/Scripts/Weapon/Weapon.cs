using System.Collections.Generic;
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

        // 한 단계에 둘이 함께 오를 수도 있다 (피해 + 범위). 오르는 것을 다 적는다.
        var parts = new List<string>();
        if (s.count != 0) parts.Add($"개수 {stat.count} → {stat.count + s.count}");
        if (s.damage != 0) parts.Add($"피해 {stat.damage} → {stat.damage + s.damage}");
        if (s.range != 0f) parts.Add($"범위 {stat.range:0.0} → {stat.range + s.range:0.0}");
        if (s.interval != 0f) parts.Add($"간격 {stat.interval:0.00} → {Mathf.Max(0.05f, stat.interval + s.interval):0.00}");
        return string.Join(" · ", parts);
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

    private static readonly List<Transform> visible = new List<Transform>();

    // 🔑 **화면에 보이는** 적만, 가까운 순으로. 총·화염구·번개가 같이 쓴다.
    //    보이지도 않는 쪽을 노리면 플레이어는 무기가 헛방을 친다고 느낀다.
    //    목록은 하나를 돌려쓴다 — 매 발사마다 새로 만들면 쓰레기가 쌓인다.
    protected List<Transform> VisibleEnemies(float maxRange = float.MaxValue)
    {
        visible.Clear();
        Camera cam = Camera.main;
        Vector2 me = transform.position;

        foreach (Enemy e in Object.FindObjectsByType<Enemy>(FindObjectsSortMode.None))
        {
            if (!e.gameObject.activeInHierarchy || !e.IsAlive) continue;

            Vector2 pos = e.transform.position;
            if ((pos - me).sqrMagnitude > maxRange * maxRange) continue;

            if (cam != null)
            {
                Vector3 v = cam.WorldToViewportPoint(pos);
                if (v.z < 0f || v.x < 0f || v.x > 1f || v.y < 0f || v.y > 1f) continue;
            }
            visible.Add(e.transform);
        }

        visible.Sort((a, b) =>
            ((Vector2)a.position - me).sqrMagnitude.CompareTo(((Vector2)b.position - me).sqrMagnitude));
        return visible;
    }

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
