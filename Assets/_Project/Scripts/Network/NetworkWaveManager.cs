using System.Collections;
using Unity.Netcode;
using UnityEngine;

// 117회차 · Phase 5 규칙 ①의 회수 지점.
//
// 073회차에 "몬스터를 만드는 곳은 매니저 한 곳뿐" 이라는 규칙을 세웠다.
// 그 덕분에 오늘 고칠 곳이 여기 한 군데다.
//
// 🔑 필요한 건 이 한 줄이다.
//        if (!IsServer) return;
//
//    여기저기서 Instantiate 했다면 그 파일을 전부 찾아 고쳐야 했고,
//    하나만 빠뜨려도 몬스터가 두 배로 나온다.
public class NetworkWaveManager : NetworkBehaviour
{
    [SerializeField] private GameObject enemyPrefab;
    [SerializeField] private float spawnInterval = 2f;
    [SerializeField] private float spawnRadius = 9f;
    [SerializeField] private int maxAlive = 30;

    public override void OnNetworkSpawn()
    {
        // 🔑 클라이언트는 몬스터를 안 만든다. 받아서 보기만 한다.
        if (!IsServer) return;

        StartCoroutine(SpawnRoutine());
    }

    private IEnumerator SpawnRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(spawnInterval);

            SpawnOne();
        }
    }

    public void SpawnOne()
    {
        if (!IsServer) return;
        if (enemyPrefab == null) return;
        if (NetworkTeam.IsPaused) return;   // 123회차 · 멈춰 있으면 안 만든다

        // 103회차의 개수 상한. 네트워크에서는 더 중요하다 — 오브젝트마다 데이터가 오간다.
        if (Object.FindObjectsByType<NetworkEnemy>().Length >= maxAlive) return;

        // 화면 밖 원 위에서 나온다 (073과 같은 생각).
        float angle = Random.Range(0f, 360f) * Mathf.Deg2Rad;
        Vector3 pos = new Vector3(Mathf.Cos(angle), Mathf.Sin(angle), 0f) * spawnRadius;

        GameObject go = Instantiate(enemyPrefab, pos, Quaternion.identity);

        // 🚨 Instantiate 만으로는 내 화면에만 생긴다.
        //    Spawn() 을 불러야 네트워크에 등록돼 모두에게 보인다.
        go.GetComponent<NetworkObject>().Spawn();
    }
}
