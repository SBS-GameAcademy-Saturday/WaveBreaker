using System.Collections;
using Unity.Netcode;
using Unity.Netcode.Components;
using UnityEngine;

// 117·119회차 · 네트워크 몬스터.
//
// 🔑 규칙
//    ① 만드는 것도 없애는 것도 서버만 한다
//    ② 움직이는 것도 서버가 한다 → NetworkTransform 이 모두에게 보낸다
//    ③ 체력 판정도 서버가 한다 (107회차 "진짜 값은 서버에")
//
//    클라이언트는 받아서 보여주기만 한다. 그래서 코드가 짧다.
public class NetworkEnemy : NetworkBehaviour
{
    [SerializeField] private float moveSpeed = 2f;
    [SerializeField] private int maxHealth = 6;
    [SerializeField] private int contactDamage = 2;
    [SerializeField] private GameObject gemPrefab;
    [SerializeField] private SpriteRenderer sprite;
    [SerializeField] private Color bodyColor = Color.white;   // 🔑 진짜 그림에는 색을 안 씌운다. 씌우면 붉게 물든다
    [SerializeField] private float deathAnimTime = 0.5f;      // 쓰러지는 그림 길이. 이만큼 기다렸다 지운다

    private readonly NetworkVariable<int> health = new NetworkVariable<int>(
        6, NetworkVariableReadPermission.Everyone, NetworkVariableWritePermission.Server);

    private Rigidbody2D rb;
    private Animator anim;
    private NetworkAnimator netAnim;
    private bool dying;
    private float nextHitTime;

    private void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
        netAnim = GetComponent<NetworkAnimator>();
        if (sprite == null) sprite = GetComponent<SpriteRenderer>();
    }

    public override void OnNetworkSpawn()
    {
        health.OnValueChanged += OnHealthChanged;

        if (IsServer) health.Value = maxHealth;
    }

    public override void OnNetworkDespawn()
    {
        health.OnValueChanged -= OnHealthChanged;
    }

    // 양쪽 화면에서 다 불린다.
    //
    // 🔑 애니메이션은 여기서 안 건드린다. NetworkAnimator 가 서버 것을 그대로 옮겨 준다.
    //    여기서 하는 건 "그림 말고 나머지" — 맞은 표시, 시체 정리다.
    private void OnHealthChanged(int before, int after)
    {
        if (after >= before) return;

        if (after <= 0) { CleanUpCorpse(); return; }

        if (sprite == null) return;

        // 🚨 하얗게만 바꾸고 안 되돌리면 맞은 몬스터가 계속 하얀 채로 남는다.
        //    강사가 실제로 그렇게 만들어놓고 스크린샷에서 발견했다. 099의 Flash 와 같은 구조로 고쳤다.
        StopCoroutine(nameof(FlashRoutine));
        StartCoroutine(nameof(FlashRoutine));
    }

    // 서버에서도 클라이언트에서도 똑같이 돈다. 애니메이션 말고 뒷정리만 한다.
    private void CleanUpCorpse()
    {
        if (dying) return;
        dying = true;

        // 맞은 표시가 남아 있으면 흰 채로 굳는다
        StopCoroutine(nameof(FlashRoutine));
        if (sprite != null) sprite.color = bodyColor;

        if (rb != null) rb.linearVelocity = Vector2.zero;

        // 🔑 시체를 밀고 다니면 안 된다. 클라이언트 화면에서도 플레이어가 걸린다.
        //    콜라이더는 네트워크로 안 가는 값이라 각자 꺼야 한다.
        var col = GetComponent<Collider2D>();
        if (col != null) col.enabled = false;

    }

    private IEnumerator FlashRoutine()
    {
        sprite.color = Color.white;
        yield return new WaitForSeconds(0.08f);
        if (sprite != null) sprite.color = bodyColor;
    }

    private void FixedUpdate()
    {
        // 🔑 움직이는 것도 서버만. 클라이언트가 같이 움직이면 위치가 싸운다.
        if (!IsServer) return;

        // 쓰러지는 중에는 안 쫓아간다
        if (dying) { rb.linearVelocity = Vector2.zero; return; }

        // 123회차 · 레벨업 카드를 고르는 동안 멈춘다.
        if (NetworkTeam.IsPaused) { rb.linearVelocity = Vector2.zero; return; }

        Transform target = FindNearestPlayer();

        if (target == null)
        {
            rb.linearVelocity = Vector2.zero;
            return;
        }

        Vector2 dir = ((Vector2)target.position - rb.position).normalized;
        rb.linearVelocity = dir * moveSpeed;

        // 🔑 서버에서만 넣는다. 모두의 화면에는 NetworkAnimator 가 옮겨 준다.
        //    Float 은 NetworkAnimator 가 알아서 지켜보다가 바뀌면 보낸다.
        if (anim != null) anim.SetFloat("Speed", rb.linearVelocity.magnitude);
    }

    // 가장 가까운 플레이어를 찾는다. 078의 FindNearest 와 같은 구조다.
    private Transform FindNearestPlayer()
    {
        if (NetworkManager.Singleton == null) return null;

        float min = float.MaxValue;
        Transform nearest = null;

        foreach (var client in NetworkManager.Singleton.ConnectedClientsList)
        {
            var obj = client.PlayerObject;
            if (obj == null) continue;

            float d = Vector2.Distance(transform.position, obj.transform.position);
            if (d >= min) continue;

            min = d;
            nearest = obj.transform;
        }

        return nearest;
    }

    // 서버만 부른다.
    public void TakeDamage(int amount)
    {
        if (!IsServer) return;
        if (health.Value <= 0) return;   // 090의 그 검사. 한 프레임에 여러 번 맞을 수 있다
        if (dying) return;

        health.Value -= amount;

        // 🔑 Trigger 만은 Animator 가 아니라 NetworkAnimator 로 넣어야 한다.
        //    한 프레임 켜졌다 꺼지는 값이라, 주기적으로 훔쳐보는 방식으로는 놓친다.
        if (health.Value > 0 && netAnim != null) netAnim.SetTrigger("Hurt");

        if (health.Value <= 0) Die();
    }

    private void Die()
    {
        Debug.Log($"[호스트] 몬스터 처치 — 젬을 떨군다");

        if (gemPrefab != null)
        {
            GameObject gem = Instantiate(gemPrefab, transform.position, Quaternion.identity);
            gem.GetComponent<NetworkObject>().Spawn();   // 🔑 Instantiate 만으로는 상대에게 안 보인다
        }

        // Death 상태는 나가는 전이가 없다. 한 번 들어가면 끝까지 재생된다.
        if (netAnim != null) netAnim.SetTrigger("Die");

        // 🚨 여기서 바로 Despawn 하면 클라이언트에서 쓰러지는 그림이 안 보인다.
        //    체력 0 은 다음 네트워크 틱에 실려 가는데, 지우라는 말이 같은 틱에 같이 가면
        //    클라이언트는 "죽었다" 를 처리하기 전에 오브젝트를 잃는다. 그냥 사라져 버린다.
        //    쓰러지는 그림만큼 기다렸다 지운다. 그 사이에 체력 0 이 먼저 도착한다.
        StartCoroutine(DespawnAfter(deathAnimTime));
    }

    private IEnumerator DespawnAfter(float delay)
    {
        yield return new WaitForSeconds(delay);

        // 서버가 없애면 모두에게서 사라진다.
        if (NetworkObject != null && NetworkObject.IsSpawned) NetworkObject.Despawn();
    }

    private void OnCollisionStay2D(Collision2D collision)
    {
        if (!IsServer) return;
        if (Time.time < nextHitTime) return;

        if (!collision.gameObject.TryGetComponent(out NetworkHealthDemo hp)) return;

        nextHitTime = Time.time + 0.5f;
        hp.TakeDamage(contactDamage);
    }
}
