
# 112회차 · NetworkTransform — 위치가 저절로 맞춰진다

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 111회차 (2인 접속), 067회차 (입력/이동 분리) |
| **오늘 배우는 것** | `NetworkTransform`, 권한 모드, `Rigidbody2D` 와 네트워크 |
| **씬** | `Practice/109_Network_Test.unity` |
| **준비물(강사)** | ⚠️ **오늘 일부러 버그를 남긴다.** 114회차까지 안 고친다 |

## 🎯 오늘의 목표

1. **`NetworkTransform`** 을 붙여 위치를 맞춘다
2. 067회차의 **입력/이동 분리**를 그대로 옮긴다
3. 🚨 **버그를 하나 만난다** — 한 키를 누르면 둘 다 움직인다

> ⚠️ **오늘 그 버그를 안 고친다.** 113회차에 관찰하고, 114회차에 고친다.
> 고치는 건 한 줄이라 지금 알려주면 **왜 그렇게 짰는지가 안 남는다.**
>
> 🔑 **설계 의도**: 위치 동기화를 코드로 짜면 몇십 줄이 나온다.
> `NetworkTransform` 은 컴포넌트 하나다. **"직접 짜지 않아도 되는 것"** 을 먼저 보여준다.

## 📦 오늘의 제출물

**네모 두 개가 움직이는 GIF (10초) + 무슨 문제가 있는지 한 줄** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 |
| 00:10–00:50 | 같이 하기 — 이동 코드 → NetworkTransform → 실행 |
| 00:50–01:00 | 휴식 |
| 01:00–01:35 | 개인 미션 |
| 01:35–01:50 | 🚨 버그 발견 · 정리 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈

1. 태그가 없는 창은 뭐가 되나? → **호스트** (111)
2. 같은 오브젝트인데 양쪽에서 다른 값은? → **`IsOwner`** (111)
3. 067회차에 입력과 이동을 왜 나눴나? → **입력원을 바꿔도 이동 코드를 안 고치려고**

---

## 00:10–00:50 · 같이 하기 ★

### ① 067을 그대로 옮긴다 (12분)

**놀랍게도 코드가 거의 같다.**

`Scripts/Network/NetworkPlayerInput.cs`

```csharp
using Unity.Netcode;
using UnityEngine;

public class NetworkPlayerInput : NetworkBehaviour
{
    public Vector2 MoveInput { get; private set; }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        MoveInput = new Vector2(h, v).normalized;
    }
}
```

`Scripts/Network/NetworkPlayerMove.cs`

```csharp
using Unity.Netcode;
using UnityEngine;

public class NetworkPlayerMove : NetworkBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private NetworkPlayerInput input;
    [SerializeField] private Rigidbody2D rb;

    void FixedUpdate()
    {
        if (input == null || rb == null) return;

        rb.linearVelocity = input.MoveInput * moveSpeed;
    }
}
```

> 💬 "067에서 쓴 것과 **거의 똑같죠.** 바뀐 건 부모가 `NetworkBehaviour` 가 된 것뿐이에요."
> 🔑 💬 "**네트워크라고 이동 코드가 달라지지 않습니다.** 그게 오늘의 첫 번째 배움입니다."

### ② 프리팹에 물리를 붙인다 (8분)

`NetworkPlayer` 프리팹에 추가한다.

| 컴포넌트 | 값 | 왜 |
|---|---|---|
| `Rigidbody2D` | Gravity Scale **0** · Freeze Rotation **켬** | 041·042 회수 |
| | Interpolation **Interpolate** | 부드럽게 |
| `Box Collider 2D` | Size `1, 1` | |

> 💬 "041~042에서 배운 그대로예요. **2D 탑다운은 중력 0.**"

### ③ `NetworkTransform` (14분) — 오늘의 주인공

프리팹에 `Network Transform` 을 추가한다. **코드는 한 줄도 안 쓴다.**

| 항목 | 우리 값 | 뜻 |
|---|---|---|
| **Authority Mode** | **Owner** | 누가 위치를 정하나 |
| **Interpolate** | **켬** | 받은 위치로 부드럽게 이동 |
| Sync Position X / Y | 켬 | |
| Sync Position **Z** | **끔** | 2D 라 Z 는 안 쓴다 |
| Sync Rotation X/Y/Z | 끔 | 안 돈다 |
| Sync Scale | 끔 | 안 변한다 |

> 🔑 💬 "**안 쓰는 건 끕니다.** 켜두면 그만큼 인터넷으로 보내요. 106회차에서 말한 '비싸다' 가 이겁니다."

**Authority Mode 두 가지**

| 모드 | 누가 위치를 정하나 | 우리 선택 |
|---|---|---|
| **Owner** | 소유자가 정하고 나머지가 받는다 | ✅ **반응이 빠르다** |
| Server | 서버가 정한다 | 안전하지만 느리다 |

> 💬 "107회차에서 **소유자 권한**을 쓰기로 했죠. 그 설정이 여기입니다."

### ④ ▶ 실행 (10분)

Play → 양쪽에서 WASD 를 눌러본다.

> 💬 "**움직입니다.** 그리고 상대 화면에도 보여요."
> 💬 "우리가 위치를 보내는 코드를 썼나요? **한 줄도 안 썼습니다.**"

**강사가 확인한 것 — 동기화가 진짜로 흐르는가**

호스트에서 **상대 캐릭터를 억지로 (99, 99) 로 옮겨봤다.**

```
[전]     내 것 (-0.75, 0.00)   상대 것 (0.40, 0.00)
[강제 이동]  상대 것 → (99, 99)
[3초 뒤]  내 것 (-0.65, 0.00)   상대 것 (0.40, 0.00)   ← 돌아왔다
```

> 🔑 💬 "**상대 캐릭터가 제자리로 돌아왔습니다.**"
> 💬 "클라이언트가 자기 위치를 **계속 보내고 있고**, 제 화면은 그걸 받아 덮어쓰거든요."
> 💬 "**내가 남의 캐릭터를 마음대로 못 옮깁니다.** 그게 소유자 권한이에요."

---

## 01:00–01:35 · 개인 미션

### 필수 미션

```csharp
// NetworkPlayerInput.cs
// TODO ①: NetworkBehaviour 를 상속하고 MoveInput 프로퍼티를 만드세요 (067과 같게)

// NetworkPlayerMove.cs
// TODO ②: input.MoveInput 으로 rb.linearVelocity 를 정하세요 (067과 같게)

// 프리팹 작업
// TODO ③: Rigidbody2D (중력 0, 회전 고정, Interpolate) 와 BoxCollider2D 를 붙이세요
// TODO ④: NetworkTransform 을 붙이고 Authority Mode 를 Owner 로
// TODO ⑤: 안 쓰는 축(Z, 회전, 스케일)을 전부 끄세요
// TODO ⑥: 스크립트 두 개를 붙이고 Inspector 를 연결하세요

// TODO ⑦: 2인 접속해서 양쪽에서 WASD 를 눌러보세요
// TODO ⑧: 무슨 문제가 있는지 한 줄로 적으세요  ← 오늘 안 고칩니다
```

<details>
<summary>막히면 열기 (정답)</summary>

코드는 위 ① 블록 그대로다.

**증상별 원인표**

| 증상 | 원인 |
|---|---|
| 안 움직임 | `Rigidbody2D` 없음 / `input` `rb` 미연결 |
| 아래로 떨어짐 | Gravity Scale 이 1 | 
| 빙글빙글 돎 | Freeze Rotation 꺼짐 |
| 상대 화면에 안 보임 | `NetworkTransform` 없음 |
| 움직임이 뚝뚝 끊김 | Interpolate 꺼짐 → **113회차** |
| 내 캐릭터가 자꾸 되돌아감 | Authority Mode 가 Server | 
| **한 키에 둘 다 움직임** | **오늘의 버그.** 안 고친다 |

**`NetworkTransform` 을 붙였는데 안 맞으면**
프리팹에 붙였는지 확인한다. 씬의 인스턴스에만 붙이면 접속으로 생긴 오브젝트엔 없다.

</details>

**확인 조건**: 양쪽에서 움직이고, 상대 화면에도 보인다. **그리고 문제를 하나 발견했다.**

### ⭐ 도전 미션

- [ ] Authority Mode 를 `Server` 로 바꿔보고 뭐가 달라지는지 쓴다 (그리고 되돌린다)
- [ ] Sync Position Z 를 켜보고 프로파일러로 데이터가 늘어나는지 본다
- [ ] `NetworkTransform` 없이 위치를 직접 보내려면 몇 줄이 필요할지 생각해 본다
- [ ] `moveSpeed` 를 양쪽에서 다르게 해보고 무슨 일이 나는지 본다
- [ ] 상대 캐릭터를 억지로 옮겨보고 되돌아오는 걸 확인한다 (강사가 한 실험)
- [ ] Interpolate 를 끄고 움직여 본다 → **113회차 선행**

> 💡 다섯 번째를 **전원이** 한다. 소유자 권한이 뭔지 몸으로 아는 자리다.

---

## 01:35–01:50 · 🚨 버그 발견 · 정리

> 💬 "자, 문제를 발견하신 분?"

**증상**: 한 창에서 WASD 를 누르면 **화면의 네모 두 개가 같이 움직인다.**

> 💬 "왜 그럴까요?" — 답을 말하지 않고 생각하게 둔다.

**힌트만 준다.**

```csharp
void Update()
{
    float h = Input.GetAxisRaw("Horizontal");   // ← 이 코드는 누구 것에서 돌까?
    ...
}
```

> 💬 "이 스크립트는 **네모 두 개에 다 붙어 있습니다.**"
> 💬 "제 화면에서 키를 누르면, **제 화면의 네모 두 개가 다 이 코드를 돌립니다.**"

> 🔑 💬 "다음 시간에 이걸 **자세히 관찰**하고, 그 다음 시간에 **한 줄로** 고칩니다."

**칠판 요약**

```
NetworkTransform   위치를 자동으로 맞춰준다. 코드 0줄
  Authority Owner  소유자가 정하고 나머지가 받는다
  Interpolate      받은 위치로 부드럽게

이동 코드는 067과 똑같다. 네트워크라고 안 달라진다.

🚨 남은 문제 : 한 키에 둘 다 움직인다
```

---

## ✅ 체크리스트 (학생)

- [ ] `NetworkPlayer` 에 `Rigidbody2D` (중력 0) 가 있다
- [ ] `NetworkTransform` 이 붙어 있고 Authority 가 `Owner` 다
- [ ] 안 쓰는 축을 껐다
- [ ] 움직이면 상대 화면에도 보인다
- [ ] 위치를 보내는 코드를 **한 줄도 안 썼다**
- [ ] 🚨 **한 키에 둘 다 움직이는 문제를 발견했다**
- [ ] 🔴 `Game.unity` 를 안 건드렸다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **한 키에 둘 다 움직임** | `IsOwner` 없음 | **오늘은 안 고친다.** 114회차 |
| 안 움직임 | `rb` `input` 미연결 | Inspector |
| 아래로 떨어짐 | Gravity Scale | `0` (041 회수) |
| 상대 화면에 안 보임 | `NetworkTransform` 미부착 | **프리팹에** 붙였는지 |
| 뚝뚝 끊김 | Interpolate 꺼짐 | 113회차에서 다룬다 |
| 내 것이 되돌아감 | Authority 가 Server | `Owner` 로 |
| 씬 인스턴스에만 붙임 | 접속 오브젝트는 프리팹에서 생긴다 | 프리팹을 고친다 |
| 벽을 뚫음 | Collision Detection | Continuous |

## 📮 다음 시간 예고

> "다음 시간엔 **문제를 자세히 봅니다.**"
>
> "둘 다 움직이는 것 말고도 이상한 게 더 있어요.
> 움직임이 살짝 늦게 보이거나, 끊겨 보이거나."
>
> "**진단부터 합니다.** 고치는 건 그 다음이에요."
