# 109회차 · NetworkObject + 첫 접속 — 캐릭터가 하나 더 생긴다

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 108회차 (패키지 · `NetworkManager`) |
| **오늘 배우는 것** | `NetworkObject`, `NetworkBehaviour`, `OnNetworkSpawn`, `OwnerClientId` |
| **씬** | `Practice/109_Network_Test.unity` |
| **준비물(강사)** | 접속 성공 화면 캡처 |

## 🎯 오늘의 목표

1. **`NetworkObject`** 를 붙여 "네트워크 물건" 으로 등록한다
2. [호스트] 버튼으로 **첫 접속**을 한다
3. **접속한 사람 수만큼 캐릭터가 생기는** 걸 본다

> ⚠️ **아직 안 움직인다.** 이동 동기화는 112회차, "내 것만 내가 조종" 은 114회차다.
> 오늘은 **딱 하나만** 확인한다 — 접속하면 오브젝트가 생기는가.
>
> 🔑 **설계 의도**: 네트워크는 성공 경험이 늦게 온다. 그래서 오늘 **작지만 확실한 성공**을 만든다.
> 화면에 네모 하나가 생기는 것뿐이지만, **네트워크가 도는 걸 처음 보는 순간**이다.

## 📦 오늘의 제출물

**[호스트] 를 누른 뒤 상태 줄(`호스트 내 번호 0 접속자 1명`)이 보이는 스크린샷** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 |
| 00:10–00:50 | 같이 하기 — 프리팹 → 등록 → 버튼 → 접속 |
| 00:50–01:00 | 휴식 |
| 01:00–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 · 정리 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈

1. `NetworkManager` 는 씬에 몇 개? → **하나** (108)
2. `127.0.0.1` 은 무슨 뜻? → **내 컴퓨터** (108)
3. 호스트의 번호는? → **0** (107)

---

## 00:10–00:50 · 같이 하기 ★

### ① `NetworkPlayer` 프리팹 (10분)

빈 오브젝트를 만들고 이름을 `NetworkPlayer` 로.

| 컴포넌트 | 값 |
|---|---|
| `Sprite Renderer` | Sprite = `UI_Bar` · Sorting Layer = `Player` |
| Transform Scale | `0.8` |
| **`Network Object`** | ← 오늘의 주인공 |

> 🔑 💬 "**`NetworkObject` 는 이름표입니다.** '이건 네트워크가 관리할 물건이다' 라는 표시요."
> 💬 "이게 없으면 유니티가 그냥 평범한 오브젝트로 취급합니다."

**인스펙터에 뭐가 보이나**

| 항목 | 뜻 |
|---|---|
| Global Object Id Hash | 이 프리팹의 고유 번호. **자동이다** |
| Always Replicate As Root | 부모 관계를 안 따라간다 |
| Synchronize Transform | 처음 생길 때 위치를 맞춘다 |
| Spawn With Observers | 모두에게 보인다 |

`Assets/_Project/Prefabs/Network/` 에 프리팹으로 저장한다.

### ② `NetworkManager` 에 등록한다 (8분)

`NetworkManager` → **`Player Prefab`** 칸에 `NetworkPlayer` 를 넣는다.

> 🔑 💬 "**Player Prefab 은 특별합니다.**"
> 💬 "누가 접속하면 **유니티가 알아서 이걸 하나 만들어 줍니다.** 우리가 코드로 안 만들어요."

> 🚨 **여기가 비어 있으면 접속은 되는데 캐릭터가 안 생긴다.** 오늘 1등 사고다.

> 💡 플레이어 말고 다른 네트워크 물건(몬스터·젬)은 `Network Prefabs List` 에 따로 등록한다.
> 그건 117회차에서 한다.

### ③ `NetworkBehaviour` — 새로운 부모 (12분)

`Scripts/Network/NetworkPlayerTag.cs`

```csharp
using Unity.Netcode;
using UnityEngine;

public class NetworkPlayerTag : NetworkBehaviour
{
    [SerializeField] private SpriteRenderer sprite;

    // 접속 순서대로 색을 준다. 0번은 호스트다.
    private static readonly Color[] colors =
    {
        new Color(0.30f, 0.60f, 1.00f),   // 파랑  — 0번 (호스트)
        new Color(1.00f, 0.55f, 0.25f),   // 주황  — 1번
        new Color(0.45f, 0.85f, 0.45f),   // 초록  — 2번
        new Color(0.90f, 0.45f, 0.85f),   // 자홍  — 3번
    };

    // 🔑 Start 가 아니라 OnNetworkSpawn 이다.
    public override void OnNetworkSpawn()
    {
        if (sprite == null) sprite = GetComponent<SpriteRenderer>();

        if (sprite != null) sprite.color = colors[OwnerClientId % (ulong)colors.Length];

        Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 플레이어 등장 — " +
                  $"소유자 {OwnerClientId}  내 것인가 = {IsOwner}");
    }
}
```

| 조각 | 뜻 |
|---|---|
| `: NetworkBehaviour` | **`MonoBehaviour` 대신** 이걸 상속한다 |
| `OnNetworkSpawn()` | **네트워크에 등록된 뒤** 불린다 |
| `OwnerClientId` | 이 오브젝트의 주인 번호 |
| `IsOwner` | 내 것인가 |
| `IsServer` | 나는 서버인가 |

> 🔑 💬 "**왜 `Start` 가 아니라 `OnNetworkSpawn` 일까요?**"
> 💬 "`Start` 는 오브젝트가 생기면 바로 돕니다. 그런데 그때는 **아직 주인이 안 정해져 있어요.**"
> 💬 "`OwnerClientId` 를 읽으면 엉뚱한 값이 나옵니다."

> 💡 102회차에서 `Start` → `OnEnable` 로 옮긴 것과 **같은 종류의 문제**다.
> "언제 도는 함수인가" 를 따지는 습관이 여기서도 쓰인다.

| 함수 | 언제 |
|---|---|
| `Awake` · `Start` | 오브젝트가 생길 때 |
| **`OnNetworkSpawn`** | **네트워크에 등록될 때** ← 네트워크 값은 여기서부터 유효 |
| `OnNetworkDespawn` | 네트워크에서 빠질 때 |

### ④ 접속 버튼 (10분)

`Scripts/Network/NetworkTestUI.cs`

```csharp
public void StartHost()
{
    bool ok = NetworkManager.Singleton.StartHost();
    Debug.Log("호스트 시작 = " + ok);
    if (buttonRoot != null) buttonRoot.SetActive(!ok);
}

public void StartClient()  { NetworkManager.Singleton.StartClient(); ... }
public void StartServer()  { NetworkManager.Singleton.StartServer(); ... }
```

| 버튼 | 하는 일 |
|---|---|
| **호스트** | 서버 + 플레이어를 겸한다 ← **우리가 쓸 것** |
| 클라이언트 | 남의 서버에 붙는다 |
| 서버 | 서버만 한다. **내 캐릭터가 없다** |

상태 표시도 만든다.

```csharp
private void Update()
{
    NetworkManager nm = NetworkManager.Singleton;

    if (nm == null || !nm.IsListening)
    {
        statusLabel.text = "접속 안 됨 — 버튼을 누르세요";
        return;
    }

    string role = nm.IsHost ? "호스트" : nm.IsServer ? "서버" : "클라이언트";

    // 접속자 수는 서버만 정확히 안다. 클라이언트는 자기만 센다.
    int count = nm.IsServer ? nm.ConnectedClientsIds.Count : 1;

    statusLabel.text = $"{role}   내 번호 {nm.LocalClientId}   접속자 {count}명";
}
```

> 💬 "`ConnectedClientsIds` 는 **서버만** 정확합니다. 클라이언트는 남이 몇 명인지 몰라요."
> 💬 "필요하면 서버가 알려줘야 합니다. 그게 116회차 `Rpc` 예요."

### ⑤ ▶ 접속한다 (10분) — 오늘의 순간

▶ Play → **[호스트]** 클릭.

**나오는 것** (실측)

```
호스트 시작 = True
[호스트] 플레이어 등장 — 소유자 0  내 것인가 = True

화면 위    :  호스트   내 번호 0   접속자 1명
화면 가운데:  파란 네모 하나
```

> 💬 "**됐습니다.** 네트워크가 돌고 있어요."
> 💬 "네모 하나뿐이지만, 저건 **네트워크에 등록된 오브젝트**입니다. 아까랑 다른 물건이에요."

**확인해 볼 것**

| 확인 | 값 |
|---|---|
| `IsListening` | `True` |
| `IsHost` / `IsServer` / `IsClient` | 전부 `True` (호스트니까) |
| 플레이어 오브젝트 | **1개** |
| 소유자 | `0` · `IsSpawned = True` · `IsOwner = True` |
| 색 | 파랑 `(0.300, 0.600, 1.000)` |

> 🔑 💬 "**`IsServer` 도 `True` 고 `IsClient` 도 `True` 죠.** 호스트니까요. 107에서 배운 그거예요."

---

## 01:00–01:35 · 개인 미션

### 필수 미션

```
// 씬/프리팹 작업
// TODO ①: NetworkPlayer 프리팹을 만드세요 (SpriteRenderer + NetworkObject)
// TODO ②: NetworkManager 의 Player Prefab 칸에 넣으세요

// NetworkPlayerTag.cs
// TODO ③: NetworkBehaviour 를 상속하세요 (MonoBehaviour 아님!)
// TODO ④: OnNetworkSpawn 을 override 해서 OwnerClientId 로 색을 정하세요
// TODO ⑤: 로그로 소유자 번호와 IsOwner 를 찍으세요

// NetworkTestUI.cs
// TODO ⑥: StartHost / StartClient / StartServer 를 만드세요
// TODO ⑦: Update 에서 역할·내 번호·접속자 수를 표시하세요

// 씬 작업
// TODO ⑧: 버튼 3개를 만들어 연결하세요
// TODO ⑨: Play 해서 [호스트] 를 누르고 네모가 생기는지 확인하세요
```

<details>
<summary>막히면 열기 (정답)</summary>

코드는 위 ③·④ 블록 그대로다.

**증상별 원인표**

| 증상 | 원인 |
|---|---|
| **버튼을 눌러도 아무 일 없음** | `EventSystem` 이 없다 (085 회수) |
| 접속은 되는데 네모가 안 생김 | **Player Prefab 칸이 비었다** |
| `OwnerClientId` 가 이상함 | `Start` 에서 읽었다 → `OnNetworkSpawn` |
| `override` 에러 | `MonoBehaviour` 를 상속했다 → `NetworkBehaviour` |
| 네모가 안 보임 | Sorting Layer / 카메라 밖 / 스프라이트 없음 |
| `NullReferenceException` | `NetworkManager.Singleton` 이 null — 씬에 없다 |

**`NetworkBehaviour` 로 바꿀 때 주의**
`Start` `Update` 는 그대로 쓸 수 있다. 다만 네트워크 값을 읽으려면 `OnNetworkSpawn` 이후여야 한다.

**확인용 로그**

```csharp
Debug.Log($"IsHost={NetworkManager.Singleton.IsHost} " +
          $"IsServer={NetworkManager.Singleton.IsServer} " +
          $"IsClient={NetworkManager.Singleton.IsClient}");
```

</details>

**확인 조건**: [호스트] 를 누르면 **네모가 생기고** 상태 줄이 `호스트 내 번호 0 접속자 1명` 이 된다.

### ⭐ 도전 미션

- [ ] **[서버]** 버튼을 눌러보고 왜 네모가 안 생기는지 쓴다
- [ ] Player Prefab 칸을 비우고 접속해 본다 (그리고 되돌린다)
- [ ] `OnNetworkSpawn` 을 `Start` 로 바꿔 `OwnerClientId` 를 찍어본다 (그리고 되돌린다)
- [ ] `OnNetworkDespawn` 을 추가해 접속을 끊을 때 로그를 찍는다
- [ ] `NetworkManager.Singleton.Shutdown()` 을 부르는 [끊기] 버튼을 만든다
- [ ] 접속하면 **랜덤 위치**에 생기게 한다 (힌트: 서버가 정해야 한다)
- [ ] `IsHost` `IsServer` `IsClient` 를 화면에 전부 표시한다

> 💡 첫 번째가 107의 "서버는 심판만 한다" 를 눈으로 확인시킨다. **전원이** 한다.
> 💡 여섯 번째는 어렵다. 지금은 안 돼도 된다 — 117회차에서 다시 만난다.

---

## 01:35–01:50 · 데모 · 정리

학생 한 명이 화면 공유로 [호스트] 를 누른다.

> 💬 "네모 하나 생긴 게 전부죠. **그런데 이게 20회차의 시작입니다.**"
> 💬 "다음 주엔 저게 **두 개**가 되고, 그 다음엔 **움직입니다.**"

**칠판 요약**

```
NetworkObject      "이건 네트워크 물건이다" 는 이름표
NetworkBehaviour   MonoBehaviour 의 네트워크판
OnNetworkSpawn     네트워크에 등록된 뒤에 도는 함수
                   ← 네트워크 값(OwnerClientId, IsOwner)은 여기서부터 유효

Player Prefab      접속하면 유니티가 알아서 하나 만들어 준다
```

---

## ✅ 체크리스트 (학생)

- [ ] `NetworkPlayer` 프리팹에 `NetworkObject` 가 붙어 있다
- [ ] `NetworkManager` 의 Player Prefab 칸이 채워져 있다
- [ ] `NetworkPlayerTag` 가 **`NetworkBehaviour`** 를 상속한다
- [ ] `OnNetworkSpawn` 에서 색을 정한다
- [ ] [호스트] 를 누르면 네모가 생긴다
- [ ] 상태 줄에 `호스트 내 번호 0 접속자 1명` 이 나온다
- [ ] Console 에 `소유자 0  내 것인가 = True` 로그가 있다
- [ ] 🔴 **`Game.unity` 를 안 건드렸다**
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **접속은 되는데 네모가 없음** | Player Prefab 비었다 | **오늘 1등** |
| 버튼이 안 눌림 | `EventSystem` 없음 | 085 회수 |
| `override` 컴파일 에러 | `MonoBehaviour` 상속 | `NetworkBehaviour` 로 |
| `OwnerClientId` 가 항상 0 | 호스트라서 맞다 | 111회차에 2인으로 보면 안다 |
| `Start` 에서 읽어 값이 이상 | 타이밍 | `OnNetworkSpawn` |
| 네모가 안 보임 | Sorting Layer `Default` | 099와 같은 사고 |
| 두 번 누르면 에러 | 이미 시작됨 | 버튼을 숨긴다 |
| [서버] 를 눌렀더니 네모가 없음 | **정상이다** | 서버는 플레이어가 아니다 |
| 포트 사용 중 | 이전 Play 가 안 끝남 | Play 를 확실히 멈춘다 |

## 📮 다음 시간 예고

> "혼자서 호스트가 됐습니다. 그런데 **접속할 상대가 없죠.**"
>
> "친구를 부르려면 인터넷 설정이 필요한데, 그건 **124회차**입니다. 아직 멀었어요."
>
> "다음 시간엔 **가상 플레이어**를 씁니다.
> 유니티가 **에디터 안에 두 번째 플레이어를 띄워줍니다.** 혼자서 2인 테스트를 할 수 있어요."
>
> 🚨 "미리 말씀드립니다. **가상 플레이어는 유니티를 하나 더 켜는 것**입니다.
> 컴퓨터가 무거워집니다. 램 8GB 이하면 미리 알려주세요."
