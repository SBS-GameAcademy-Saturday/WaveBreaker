# 115회차 · `NetworkVariable` — 값을 담는 상자

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 114회차 (`IsOwner`), 107회차 (권한) |
| **오늘 배우는 것** | `NetworkVariable<T>`, 읽기/쓰기 권한, `OnValueChanged` |
| **씬** | `Practice/109_Network_Test.unity` |
| **준비물(강사)** | `Snapshot_P9_step2`, **23주차 회고 슬라이드** |

## 🎯 오늘의 목표

1. **`NetworkVariable`** 로 체력을 맞춘다
2. **값을 바꾸는 건 서버만** 이라는 규칙을 안다
3. `OnValueChanged` 로 변화에 반응한다

> ⚠️ **오늘 안 하는 것**: 클라이언트가 값을 바꾸는 방법(`Rpc`). 그건 116회차다.
> 오늘은 **"서버만 바꿀 수 있다"** 는 벽에 부딪히는 것까지가 목표다.
>
> 🔑 **설계 의도**: 107회차에서 말로 배운 "진짜 값은 서버에만 있다" 가
> 오늘 **`NetworkVariableWritePermission.Server`** 라는 코드로 나타난다.
> 개념 → 코드의 연결을 반드시 짚는다.

## 📦 오늘의 제출물

**양쪽 Console 에 체력 변화 로그가 찍힌 스크린샷** → `#제출`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 |
| 00:10–00:50 | 같이 하기 — 상자 → 권한 → 반응 |
| 00:50–01:00 | 휴식 |
| 01:00–01:30 | 개인 미션 |
| 01:30–01:50 | **23주차 회고** |
| 01:50–02:00 | 체크리스트 + `Snapshot_P9_step2` |

---

## 00:00–00:10 · 복습 퀴즈

1. 어제 넣은 한 줄은? → **`if (!IsOwner) return;`** (114)
2. 왜 한 줄로 끝났나? → **입력을 읽는 곳이 한 군데** (067·114)
3. 진짜 값은 어디에 있나? → **서버** (107)

---

## 00:10–00:50 · 같이 하기 ★

### ① 위치 말고 다른 값은? (8분)

> 💬 "위치는 `NetworkTransform` 이 맞춰줬죠. **체력은요?**"

| 무엇 | 무엇으로 |
|---|---|
| 위치 · 회전 · 크기 | `NetworkTransform` (112) |
| **숫자 · 문자 · bool** | **`NetworkVariable<T>`** ← 오늘 |
| 한 번만 알리는 일 | `Rpc` (116) |

> 💬 "체력, 레벨, 점수, 살아 있는지 — **계속 유지되는 값**은 전부 `NetworkVariable` 입니다."

### ② 상자를 만든다 (12분)

```csharp
using Unity.Netcode;
using UnityEngine;

public class NetworkHealthDemo : NetworkBehaviour
{
    [SerializeField] private int maxHealth = 20;

    // <int> 안의 값이 자동으로 동기화된다.
    // 뒤의 두 인자가 "누가 읽을 수 있나 / 누가 쓸 수 있나" 다.
    public NetworkVariable<int> Health = new NetworkVariable<int>(
        20,
        NetworkVariableReadPermission.Everyone,
        NetworkVariableWritePermission.Server);
}
```

| 조각 | 뜻 |
|---|---|
| `NetworkVariable<int>` | **int 를 담는 동기화 상자** |
| 첫 인자 `20` | 처음 값 |
| `ReadPermission.Everyone` | 모두가 읽을 수 있다 |
| **`WritePermission.Server`** | **서버만 쓸 수 있다** ← 오늘의 핵심 |

> 🔑 💬 "107회차에서 **'진짜 값은 서버에만 있다'** 고 했죠."
> 💬 "그게 이 한 줄입니다. **`WritePermission.Server`.**"

**읽고 쓰는 법**

```csharp
int now = Health.Value;      // 읽기 — 누구나
Health.Value = 13;           // 쓰기 — 서버만
```

> 🚨 **`.Value` 를 빼먹는 실수가 잦다.** `Health` 는 상자고, `Health.Value` 가 값이다.

### ③ 처음 값은 서버가 정한다 (8분)

```csharp
public override void OnNetworkSpawn()
{
    // 처음 값은 서버가 정한다.
    if (IsServer) Health.Value = maxHealth;
}
```

> 💬 "왜 `IsServer` 검사가 필요할까요?"
> 💬 "**클라이언트에서도 `OnNetworkSpawn` 이 돌거든요.** 거기서 쓰면 에러가 납니다."

> 💡 109회차에서 `OnNetworkSpawn` 이 **양쪽에서 다 돈다**는 걸 로그로 봤다. 그 얘기다.

### ④ 값이 바뀌면 반응한다 (12분)

```csharp
public override void OnNetworkSpawn()
{
    // 값이 바뀔 때마다 불린다. 모두의 화면에서 불린다.
    Health.OnValueChanged += OnHealthChanged;

    if (IsServer) Health.Value = maxHealth;
}

public override void OnNetworkDespawn()
{
    // 구독했으면 반드시 해제한다. 안 하면 사라진 오브젝트를 계속 부른다.
    Health.OnValueChanged -= OnHealthChanged;
}

private void OnHealthChanged(int before, int after)
{
    Debug.Log($"[{(IsServer ? "호스트" : "클라이언트")}] 소유자 {OwnerClientId} 체력 {before} → {after}");
}
```

| 조각 | 뜻 |
|---|---|
| `+= OnHealthChanged` | 값이 바뀔 때 불러달라고 등록 |
| `(int before, int after)` | 바뀌기 전 값과 후 값 |
| `-=` (Despawn) | **등록했으면 반드시 해제** |

> 🚨 **해제를 빼먹으면** 사라진 오브젝트를 계속 부르려다 에러가 난다.
> 💬 "085회차에서 `Button.onClick.RemoveAllListeners()` 를 왜 불렀는지 기억나세요? **같은 이유**입니다."

> 🔑 💬 "이 함수는 **양쪽 화면에서 다 불립니다.** 그래서 체력바를 여기서 갱신하면 돼요."

### ⑤ 서버만 쓸 수 있다 — 벽에 부딪힌다 (10분)

```csharp
// 🚨 서버에서만 불러야 한다. 클라이언트가 부르면 에러가 난다.
public void TakeDamage(int amount)
{
    if (!IsServer)
    {
        Debug.LogWarning("체력은 서버만 바꿀 수 있다. 116회차의 Rpc 가 필요하다.");
        return;
    }

    Health.Value = Mathf.Max(Health.Value - amount, 0);
}
```

▶ 호스트에서 상대 체력을 깎아본다.

**실측**

```
상대 체력 → 13
[호스트] 소유자 1 체력 20 → 13
```

> 💬 "**호스트에서 바꿨더니 양쪽에 전달됐습니다.**"

▶ 이번엔 **클라이언트에서** 깎아본다.

```
체력은 서버만 바꿀 수 있다. 116회차의 Rpc 가 필요하다.
```

> 🔑 💬 "**벽에 부딪혔죠.** 이게 오늘의 마지막 배움입니다."
> 💬 "클라이언트가 '내 체력 깎아줘' 하려면 **서버에 부탁**해야 합니다."
> 💬 "그 부탁하는 방법이 **`Rpc`**, 다음 시간이에요."

---

## 01:00–01:30 · 개인 미션

### 필수 미션

```csharp
// NetworkHealthDemo.cs
// TODO ①: NetworkVariable<int> Health 를 만드세요 (읽기 Everyone / 쓰기 Server)
// TODO ②: OnNetworkSpawn 에서 OnValueChanged 를 등록하세요
// TODO ③: 서버면 처음 값을 maxHealth 로 정하세요
// TODO ④: OnNetworkDespawn 에서 등록을 해제하세요
// TODO ⑤: OnHealthChanged 에서 before → after 를 로그로 찍으세요
// TODO ⑥: TakeDamage 를 만들되, 서버가 아니면 경고만 찍고 return 하세요

// TODO ⑦: 2인 접속해서 호스트가 체력을 깎고, 양쪽 Console 을 확인하세요
// TODO ⑧: 클라이언트에서 깎아보고 경고가 뜨는지 확인하세요
```

<details>
<summary>막히면 열기 (정답)</summary>

코드는 위 ②·④ 블록 그대로다.

**증상별 원인표**

| 증상 | 원인 |
|---|---|
| `Health` 에 값을 못 넣음 | `.Value` 를 빼먹었다 |
| 클라이언트에서 에러 | **정상.** 서버만 쓸 수 있다 |
| 로그가 한쪽만 뜸 | 다른 쪽에서 등록을 안 했다 |
| Despawn 후 에러 | `-=` 해제 누락 |
| 처음 값이 0 | `OnNetworkSpawn` 에서 안 정했다 |
| 값이 안 맞춰짐 | 필드를 `readonly` 로 만들었다 |

**테스트하는 법 (버튼 없이)**
`NetworkHealthDemo` 인스펙터 우클릭 → `TakeDamage` 를 `[ContextMenu]` 로 만들면 편하다.

```csharp
[ContextMenu("체력 7 깎기")]
private void DebugDamage() => TakeDamage(7);
```

> 💡 048회차의 `[ContextMenu]` 와 같다.

</details>

**확인 조건**: 호스트가 깎으면 **양쪽 Console 에** 로그가 뜬다. 클라이언트가 깎으면 경고가 뜬다.

### ⭐ 도전 미션

- [ ] `WritePermission` 을 `Owner` 로 바꿔보고 뭐가 달라지는지 쓴다 (그리고 되돌린다)
- [ ] `NetworkVariable<bool> IsAlive` 를 추가한다
- [ ] 체력이 0이 되면 색이 회색으로 변하게 한다 (`OnValueChanged` 에서)
- [ ] `NetworkVariable<FixedString32Bytes>` 로 이름을 동기화해 본다
- [ ] `OnValueChanged` 해제를 빼고 접속을 끊어본다 (그리고 되돌린다)
- [ ] 체력을 화면 위에 바로 표시한다 (094회차 `StatBar` 재사용)

> 💡 네 번째에서 **`string` 은 못 쓴다**는 걸 알게 된다. 크기가 정해진 타입만 된다.
> 💡 여섯 번째가 24주차에 실제로 필요해진다.

---

## 01:30–01:50 · 23주차 회고

| 회차 | 한 것 | 새로 배운 것 |
|---|---|---|
| 111 | 2인 접속 | MPPM 태그 · `CurrentPlayer.Tags` |
| 112 | 이동 동기화 | **`NetworkTransform`** |
| 113 | 문제 진단 | Tick Rate · Interpolate · Simulator |
| 114 | 내 것만 조종 | **`IsOwner`** |
| 115 | 체력 동기화 | **`NetworkVariable`** |

**이번 주에 쓴 코드의 양**

```
NetworkPlayerInput   약 25줄  (067과 거의 같다 + IsOwner 한 줄)
NetworkPlayerMove    약 25줄  (067과 거의 같다 + IsOwner 한 줄)
NetworkAutoConnect   약 30줄  (테스트 편의용)
NetworkHealthDemo    약 40줄
NetworkTransform     0줄      ← 컴포넌트
```

> 💬 "**위치 동기화는 코드 0줄**이었습니다. 컴포넌트 하나였죠."
> 💬 "그리고 제일 어려워 보이던 '내 것만 조종' 은 **한 줄**이었고요."
>
> 🔑 💬 "**14주차에 나눠둔 덕분입니다.** 설계는 이렇게 나중에 값을 합니다."

### 📦 `Snapshot_P9_step2` 배포

**2인 접속 + 이동 동기화 + `IsOwner` + `NetworkVariable`.**

---

## ✅ 체크리스트 (학생)

- [ ] `NetworkVariable<int> Health` 가 있다
- [ ] 쓰기 권한이 `Server` 다
- [ ] `OnNetworkSpawn` 에서 등록하고 `OnNetworkDespawn` 에서 해제한다
- [ ] 호스트가 깎으면 **양쪽 Console** 에 로그가 뜬다
- [ ] 클라이언트가 깎으면 경고가 뜬다
- [ ] `.Value` 를 안 빼먹는다
- [ ] 🔴 `Game.unity` 를 안 건드렸다
- [ ] `Snapshot_P9_step2` 를 받았다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`.Value` 누락** | 상자와 값을 혼동 | **오늘 1등** |
| 클라이언트에서 쓰기 에러 | **정상이다** | 116회차 예고 |
| 로그가 한쪽만 | 등록 누락 | `OnNetworkSpawn` |
| Despawn 후 에러 | 해제 누락 | `-=` (085 회수) |
| 처음 값이 0 | 서버가 안 정했다 | `if (IsServer)` |
| `string` 이 안 됨 | 크기가 안 정해진 타입 | `FixedString32Bytes` |
| 값이 안 맞춰짐 | 필드가 아니라 지역변수 | 클래스 필드여야 한다 |
| 인스펙터에 안 보임 | `NetworkVariable` 은 기본으로 안 보인다 | 로그로 확인 |

## 📮 다음 주 예고 — 24주차 (116–120)

> "이번 주에 **두 명이 같이 움직이는 것**까지 됐습니다."
>
> "다음 주엔 **몬스터**를 넣습니다. 그런데 문제가 하나 있어요 —
> 양쪽이 각자 몬스터를 만들면 **두 배로 나옵니다.** 106회차에서 얘기했던 그거요."
>
> 🔑 "고치는 방법은 **한 줄**입니다. `if (!IsServer) return;`
> **073회차에 스폰을 매니저 한 곳으로 모아둔 덕분**이에요. 이번엔 규칙 ①의 회수입니다."
>
> "그리고 드디어 **본 게임에 네트워크를 얹기 시작합니다.**"
