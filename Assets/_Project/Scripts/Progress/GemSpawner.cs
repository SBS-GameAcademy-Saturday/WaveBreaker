using UnityEngine;

// 젬을 만드는 곳. **만드는 통로를 하나로** 모아 둔다 (규칙 ①과 같은 이유).
public class GemSpawner : MonoBehaviour
{
    public static GemSpawner Instance { get; private set; }

    [SerializeField] private GameObject gemPrefab;

    private void Awake() => Instance = this;

    public static void Drop(Vector3 at, int exp)
    {
        if (Instance == null || Instance.gemPrefab == null) return;

        var go = Instantiate(Instance.gemPrefab, at, Quaternion.identity);
        if (go.TryGetComponent(out ExpGem gem)) gem.Setup(exp);
    }
}
