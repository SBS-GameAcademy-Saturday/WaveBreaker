using Unity.Netcode;
using UnityEngine;

// 118회차 · 경험치 젬. 기획서 11장 — 누가 먹어도 팀 경험치다.
//
// 🚨 여기가 네트워크에서 제일 헷갈리는 자리다.
//    "둘이 동시에 같은 젬을 먹으면?"
//
//    각자 판정하면 둘 다 먹는다 → 경험치가 두 배로 들어간다.
//    그래서 판정은 서버 한 곳에서만 한다.
public class NetworkGem : NetworkBehaviour
{
    [SerializeField] private int exp = 1;
    [SerializeField] private float magnetRange = 2.5f;
    [SerializeField] private float moveSpeed = 6f;

    private bool taken;   // 서버에서만 쓴다. 한 프레임에 두 번 먹히는 걸 막는다

    private void Update()
    {
        // 자석도 서버가 움직인다. 위치는 NetworkTransform 이 보낸다.
        if (!IsServer) return;
        if (NetworkManager.Singleton == null) return;

        Transform nearest = null;
        float min = magnetRange;

        foreach (var client in NetworkManager.Singleton.ConnectedClientsList)
        {
            var obj = client.PlayerObject;
            if (obj == null) continue;

            float d = Vector2.Distance(transform.position, obj.transform.position);
            if (d > min) continue;

            min = d;
            nearest = obj.transform;
        }

        if (nearest == null) return;

        transform.position = Vector3.MoveTowards(
            transform.position, nearest.position, moveSpeed * Time.deltaTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        // 🔑 판정은 서버만. 이 한 줄이 "둘 다 먹는" 사고를 막는다.
        if (!IsServer) return;
        if (taken) return;

        if (!other.TryGetComponent(out NetworkPlayerTag _)) return;

        taken = true;

        if (NetworkTeam.Instance != null) NetworkTeam.Instance.AddExp(exp);

        NetworkObject.Despawn();
    }
}
