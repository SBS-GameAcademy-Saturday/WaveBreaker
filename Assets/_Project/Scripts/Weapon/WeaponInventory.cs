using System.Collections.Generic;
using System.Linq;
using UnityEngine;

// 지금 들고 있는 무기들. 장착·강화·조합이 전부 여기를 거친다.
public class WeaponInventory : MonoBehaviour
{
    [SerializeField] private int maxSlots = 4;
    [SerializeField] private WeaponData starting;

    private readonly List<Weapon> owned = new List<Weapon>();

    public IReadOnlyList<Weapon> Owned => owned;
    public bool IsFull => owned.Count >= maxSlots;

    private void Start()
    {
        if (starting != null) Acquire(starting);
    }

    public bool Has(WeaponData d) => owned.Any(w => w.Data == d);

    public bool IsMax(WeaponData d)
    {
        Weapon w = owned.FirstOrDefault(x => x.Data == d);
        return w != null && w.IsMax;
    }

    public int LevelOf(WeaponData d)
    {
        Weapon w = owned.FirstOrDefault(x => x.Data == d);
        return w != null ? w.Level : 0;
    }

    public void Acquire(WeaponData d)
    {
        if (d == null || Has(d) || IsFull) return;

        var go = new GameObject("Weapon_" + d.title);
        go.transform.SetParent(transform, false);

        Weapon w = d.kind switch
        {
            WeaponKind.Orbit => go.AddComponent<OrbitWeapon>(),
            WeaponKind.Gun   => go.AddComponent<GunWeapon>(),
            _                => go.AddComponent<AuraWeapon>(),
        };

        w.Setup(d, transform);
        owned.Add(w);

        Debug.Log($"무기 획득 — {d.title}");
    }

    public void LevelUp(WeaponData d)
    {
        Weapon w = owned.FirstOrDefault(x => x.Data == d);
        if (w == null || w.IsMax) return;

        w.LevelUp();
        Debug.Log($"무기 강화 — {d.title} Lv.{w.Level}");
    }

    // 🔑 조합 — 재료 둘을 지우고 결과 하나를 준다.
    public void Fuse(WeaponFusionData recipe)
    {
        if (recipe == null || !recipe.CanMake(this)) return;

        Remove(recipe.materialA);
        Remove(recipe.materialB);
        Acquire(recipe.result);

        Debug.Log($"무기 조합 — {recipe.materialA.title} + {recipe.materialB.title} → {recipe.result.title}");
    }

    private void Remove(WeaponData d)
    {
        Weapon w = owned.FirstOrDefault(x => x.Data == d);
        if (w == null) return;

        owned.Remove(w);
        Destroy(w.gameObject);
    }
}
