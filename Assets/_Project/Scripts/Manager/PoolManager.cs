using System.Collections.Generic;
using UnityEngine;

// 102회차 · 쓰레기통 대신 서랍.
//
// 지금까지는 몬스터를 만들 때 Instantiate, 죽을 때 Destroy 했다.
// 만들고 버리고를 반복하는 대신, 다 쓴 것을 서랍에 넣어 두고 다음에 꺼내 쓴다.
//
// 서랍에 넣기 = SetActive(false)   꺼내기 = SetActive(true)
//
// 🔑 재활용이라 "이전 판의 상태" 가 그대로 남아 있다.
//    체력·속도 같은 건 꺼낼 때마다 다시 채워야 한다.
//    그 자리가 각 스크립트의 OnEnable 이다. (Start 는 처음 한 번만 돈다)
public class PoolManager : MonoBehaviour
{
    public static PoolManager Instance { get; private set; }

    // 프리팹마다 서랍이 하나씩 있다.
    private readonly Dictionary<GameObject, Queue<GameObject>> drawers
        = new Dictionary<GameObject, Queue<GameObject>>();

    // 이 복사본이 어느 프리팹에서 나왔는지. 반납할 때 어느 서랍에 넣을지 알아야 한다.
    private readonly Dictionary<GameObject, GameObject> madeFrom
        = new Dictionary<GameObject, GameObject>();

    public int Created { get; private set; }   // 실제로 Instantiate 한 횟수
    public int Reused { get; private set; }    // 서랍에서 꺼내 쓴 횟수

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
    }

    // 매니저가 없어도 게임은 돌아가야 한다. 없으면 예전 방식(Instantiate)으로 간다.
    public static GameObject Spawn(GameObject prefab, Vector3 position, Quaternion rotation)
    {
        if (prefab == null) return null;

        if (Instance == null) return Instantiate(prefab, position, rotation);

        return Instance.Take(prefab, position, rotation);
    }

    public static void Despawn(GameObject instance)
    {
        if (instance == null) return;

        if (Instance == null) { Destroy(instance); return; }

        Instance.Put(instance);
    }

    private GameObject Take(GameObject prefab, Vector3 position, Quaternion rotation)
    {
        if (!drawers.TryGetValue(prefab, out Queue<GameObject> drawer))
        {
            drawer = new Queue<GameObject>();
            drawers[prefab] = drawer;
        }

        GameObject go = null;

        // 씬을 다시 열면 서랍 속 물건이 없어져 있을 수 있다. 빈 칸은 건너뛴다.
        while (drawer.Count > 0 && go == null) go = drawer.Dequeue();

        if (go == null)
        {
            go = Instantiate(prefab, position, rotation);
            madeFrom[go] = prefab;
            Created++;
        }
        else
        {
            go.transform.SetPositionAndRotation(position, rotation);
            Reused++;
        }

        // 🚨 이 줄을 빼면 아무것도 안 나온다. 풀링 최다 사고다.
        go.SetActive(true);

        return go;
    }

    private void Put(GameObject go)
    {
        // 풀에서 나온 게 아니면 그냥 없앤다.
        if (!madeFrom.TryGetValue(go, out GameObject prefab))
        {
            Destroy(go);
            return;
        }

        if (!go.activeSelf) return;   // 두 번 반납하면 서랍에 같은 게 두 개 들어간다

        go.SetActive(false);

        drawers[prefab].Enqueue(go);
    }

    // 실측·디버깅용
    public int CountInDrawers()
    {
        int total = 0;
        foreach (var d in drawers.Values) total += d.Count;
        return total;
    }
}
