using System.Collections.Generic;
using UnityEngine;

// 몬스터를 **다시 쓴다.** 만들고 부수기를 반복하지 않는다.
//
// 🔑 후반에는 1초에 수십 마리가 나오고 죽는다. 그때마다 Instantiate / Destroy 를
//    하면 메모리가 계속 늘었다 줄었다 하고, 가비지 수집이 돌 때 화면이 끊긴다.
//    꺼내 쓰고 돌려받으면 그 일이 아예 없다.
//
// 🚨 다시 쓰는 물건은 **지난 판의 상태가 남아 있다.** 체력·색·콜라이더·속도를
//    꺼낼 때마다 되돌려야 한다. 그 일은 Enemy.Setup 이 맡는다.
public class EnemyPool : MonoBehaviour
{
    public static EnemyPool Instance { get; private set; }

    [SerializeField] private GameObject normalPrefab;
    [SerializeField] private GameObject bossPrefab;
    [SerializeField] private int prewarm = 48;

    private readonly Queue<GameObject> idleNormal = new Queue<GameObject>();
    private readonly Queue<GameObject> idleBoss = new Queue<GameObject>();

    public int IdleCount => idleNormal.Count;
    public int LiveCount { get; private set; }

    private void Awake()
    {
        Instance = this;

        // 판이 시작하자마자 몰려나와도 끊기지 않게 미리 만들어 둔다.
        for (int i = 0; i < prewarm; i++)
            idleNormal.Enqueue(Create(normalPrefab));
    }

    private GameObject Create(GameObject prefab)
    {
        GameObject go = Instantiate(prefab, transform);
        go.SetActive(false);
        return go;
    }

    public GameObject Get(bool boss, Vector3 pos)
    {
        Queue<GameObject> q = boss ? idleBoss : idleNormal;
        GameObject prefab = boss ? bossPrefab : normalPrefab;
        if (prefab == null) return null;

        GameObject go = q.Count > 0 ? q.Dequeue() : Create(prefab);

        go.transform.SetPositionAndRotation(pos, Quaternion.identity);
        go.SetActive(true);
        LiveCount++;
        return go;
    }

    public void Release(GameObject go)
    {
        if (go == null) return;

        go.SetActive(false);
        LiveCount = Mathf.Max(0, LiveCount - 1);

        var e = go.GetComponent<Enemy>();
        (e != null && e.IsBoss ? idleBoss : idleNormal).Enqueue(go);
    }

    // 판이 끝나거나 보스가 나올 때 화면을 비운다.
    public void ReleaseAll()
    {
        foreach (var e in FindObjectsByType<Enemy>(FindObjectsSortMode.None))
            if (e.gameObject.activeSelf) Release(e.gameObject);
    }
}
