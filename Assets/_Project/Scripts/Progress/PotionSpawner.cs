using UnityEngine;

public class PotionSpawner : MonoBehaviour
{
    public static PotionSpawner Instance { get; private set; }
    [SerializeField] private GameObject potionPrefab;
    private void Awake()
    {
        Instance = this;
    }
    
    public static void Drop(Vector3 at, int hpRestore = 10)
    {
        if (Instance == null || Instance.potionPrefab == null) return;

        var go = Instantiate(Instance.potionPrefab, at, Quaternion.identity);
        if (go.TryGetComponent(out HpPotion potion)) potion.Setup(hpRestore);
    }
}