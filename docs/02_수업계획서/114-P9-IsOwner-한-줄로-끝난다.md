# 114회차 · `IsOwner` — 14주차에 나눠둔 것이 값을 한다

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 113회차 (진단), **067회차 (입력/이동 분리)** |
| **오늘 배우는 것** | `IsOwner`, 설계가 값을 하는 순간 |
| **씬** | `Practice/109_Network_Test.unity` |
| **준비물(강사)** | ⚠️ **067회차 코드를 화면에 띄울 준비** |

## 🎯 오늘의 목표

1. **한 줄**로 문제를 고친다
2. **왜 한 줄로 끝나는지** 이해한다
3. 설계가 나중에 값을 한다는 걸 몸으로 안다

> 🔑 **오늘은 Phase 5 규칙 ②의 회수 지점이다.**
> 067회차에 "입력 읽는 곳과 움직이는 곳을 분리하라" 고 했다. 그때 이유를 다 못 줬다.
> **오늘이 그 이유다.** 이 연결을 못 짚으면 오늘 회차의 절반이 날아간다.
>
> ⚠️ **오늘 새로 배우는 문법은 `IsOwner` 하나뿐이다.** 나머지 시간은 **설계 이야기**다.

## 📦 오늘의 제출물

**고치기 전 / 후 GIF 2개 (각 5초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 + 오늘의 문제 |
| 00:10–00:35 | 같이 하기 ① 한 줄로 고치기 |
| 00:35–00:50 | 같이 하기 ② **왜 한 줄인가** ← 오늘의 본체 |
| 00:50–01:00 | 휴식 |
| 01:00–01:30 | 개인 미션 |
| 01:30–01:50 | 반례 실습 — 안 나눴으면 어땠을까 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 + 오늘의 문제

### 복습 퀴즈 (4분)

1. 증상 3분류는? → **둘 다 움직임 / 늦음 / 끊김** (113)
2. 못 고치는 건? → **늦음** (물리 법칙) (113)
3. 같은 오브젝트인데 양쪽에서 다른 값은? → **`IsOwner`** (109·111)

### 오늘의 문제 (6분)

▶ 2인 접속 → D 키를 누른다 → **네모 두 개가 같이 오른쪽으로 간다.**

> 💬 "오늘 이걸 고칩니다. **몇 줄이 필요할까요?**" — 학생에게 추측하게 한다.
> 💬 "정답은 **한 줄**입니다."

---

## 00:10–00:35 · 같이 하기 ① 한 줄로 고치기

### ① 어디에 넣을까 (10분)

> 💬 "고칠 파일이 두 개 있습니다. `NetworkPlayerInput` 과 `NetworkPlayerMove`."
> 💬 "**어디에 넣어야 할까요?**"

| 후보 | 넣으면 |
|---|---|
| `NetworkPlayerMove` | 움직이진 않지만 **입력은 계속 읽는다** (낭비) |
| **`NetworkPlayerInput`** | ✅ **입력을 아예 안 읽는다** |

> 🔑 💬 "**입력을 읽는 곳에 넣는 게 맞습니다.** 안 쓸 값을 읽을 이유가 없죠."
> 💬 "그리고 입력을 읽는 곳이 **한 군데뿐**입니다. 그래서 한 줄이면 됩니다."

### ② 한 줄 (8분)

```csharp
void Update()
{
    // 🔑 내 것이 아니면 입력을 안 읽는다.
    //    이게 없으면 한 키를 눌렀을 때 화면의 모든 캐릭터가 같이 움직인다.
    if (!IsOwner)
    {
        MoveInput = Vector2.zero;
        return;
    }

    float h = Input.GetAxisRaw("Horizontal");
    float v = Input.GetAxisRaw("Vertical");

    MoveInput = new Vector2(h, v).normalized;
}
```

> 💬 "`MoveInput = Vector2.zero` 는 왜 넣을까요?"
> 💬 "안 넣으면 **마지막에 읽은 값이 남아** 상대 캐릭터가 계속 그 방향으로 밀립니다."

**이동 쪽에도 한 줄을 넣는다.**

```csharp
void FixedUpdate()
{
    // 내 것이 아니면 움직이지 않는다. 상대 캐릭터는 NetworkTransform 이 옮겨 준다.
    // 여기서 속도를 건드리면 받은 위치와 싸운다.
    if (!IsOwner)
    {
        rb.linearVelocity = Vector2.zero;
        return;
    }

    rb.linearVelocity = input.MoveInput * moveSpeed;
}
```

> 💬 "물리가 있으면 이쪽도 막아야 합니다. **`Rigidbody2D` 가 관성으로 밀거든요.**"
> 💬 "받은 위치와 물리가 싸우면 캐릭터가 부들부들 떱니다."

▶ 실행 → **각자 자기 것만 움직인다.**

### ③ 확인 (7분)

```
[호스트]     소유자 0  IsOwner=True   ← 내가 조종
             소유자 1  IsOwner=False  ← 받기만 한다

[클라이언트] 소유자 0  IsOwner=False
             소유자 1  IsOwner=True
```

> 💬 "**같은 오브젝트인데 양쪽에서 값이 다릅니다.** 106회차의 '게임이 두 개' 예요."

---

## 00:35–00:50 · 같이 하기 ② 왜 한 줄인가 ★

### 067회차 코드를 띄운다 (15분)

**14주차에 이렇게 짰다.**

```csharp
// PlayerInput.cs — 067회차
public class PlayerInput : MonoBehaviour
{
    public Vector2 MoveInput { get; private set; }

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        MoveInput = new Vector2(h, v).normalized;
    }
}

// PlayerController.cs — 067회차
void FixedUpdate()
{
    Vector2 move = input.MoveInput;
    rb.linearVelocity = move * moveSpeed;
}
```

> 💬 "그때 제가 뭐라고 했죠?"
> 💬 "**'읽는 곳과 움직이는 곳을 나눠두면 나중에 입력원을 바꿔도 이동 코드를 안 고친다.'**"
> 💬 "그때는 이유가 안 와닿았을 겁니다. **오늘이 그 이유예요.**"

### 만약 안 나눴다면 (10분)

**흔히 짜는 방식**을 칠판에 쓴다.

```csharp
// 만약 이렇게 짰다면
public class PlayerController : MonoBehaviour
{
    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");     // 입력을 여기서 읽고
        rb.linearVelocity = new Vector2(h, v) * speed; // 바로 움직인다
    }
}

public class PlayerAttack : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space)) Fire();   // 여기서도 읽고
    }
}

public class PlayerDash : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.LeftShift)) Dash();  // 여기서도
    }
}
```

> 💬 "이러면 오늘 **`if (!IsOwner) return;` 을 몇 군데 넣어야 할까요?**" → **전부**
> 💬 "그리고 **하나라도 빠뜨리면** 그 기능만 상대 캐릭터에서 같이 실행됩니다."
> 💬 "찾기도 어려워요. '왜 스페이스를 누르면 상대도 쏘지?'"

**우리 프로젝트**

```
입력을 읽는 곳 = NetworkPlayerInput 한 곳
   → if (!IsOwner) return;  한 줄
```

> 🔑 💬 "**설계는 이런 데서 값을 합니다.**"
> 💬 "14주차에 번거롭게 나눈 대가를 **오늘 받는 겁니다.** 25주 뒤에요."
>
> 💬 "여러분이 앞으로 코드를 짤 때 이걸 기억하세요.
> **'나중에 이 규칙을 바꾸려면 몇 군데를 고쳐야 하나?'**"

---

## 01:00–01:30 · 개인 미션

### 필수 미션

```csharp
// NetworkPlayerInput.cs
// TODO ①: Update 맨 위에 if (!IsOwner) 를 넣고 MoveInput 을 0 으로 만든 뒤 return

// NetworkPlayerMove.cs
// TODO ②: FixedUpdate 맨 위에 if (!IsOwner) 를 넣고 속도를 0 으로 만든 뒤 return

// TODO ③: 2인 접속해서 각자 자기 것만 움직이는지 확인하세요
// TODO ④: 고치기 전/후 GIF 를 찍으세요
```

<details>
<summary>막히면 열기 (정답)</summary>

코드는 위 ② 블록 그대로다.

**증상별 원인표**

| 증상 | 원인 |
|---|---|
| 여전히 둘 다 움직임 | `IsOwner` 를 `IsServer` 로 썼다 |
| 상대가 계속 한 방향으로 밀림 | `MoveInput = Vector2.zero` 를 안 넣었다 |
| 상대 캐릭터가 부들부들 떤다 | `NetworkPlayerMove` 에 안 넣었다 (물리와 싸운다) |
| 내 것도 안 움직임 | `IsOwner` 를 `!IsOwner` 로 안 썼다 (부호 반대) |
| `IsOwner` 를 못 찾음 | `MonoBehaviour` 를 상속했다 → `NetworkBehaviour` |

**`IsOwner` 와 헷갈리는 것들**

| 값 | 뜻 |
|---|---|
| `IsOwner` | **이 오브젝트가 내 것인가** |
| `IsLocalPlayer` | 내 플레이어 오브젝트인가 (거의 같다) |
| `IsServer` | 내가 서버인가 (오브젝트와 무관) |
| `IsClient` | 내가 클라이언트인가 |

> 🚨 **`IsServer` 를 쓰면 호스트 화면에서 둘 다 움직인다.** 호스트는 두 오브젝트 다 서버니까.

</details>

**확인 조건**: 각자 자기 것만 움직이고, 상대 캐릭터가 **안 떨린다.**

### ⭐ 도전 미션

- [ ] `IsOwner` 를 `IsServer` 로 바꿔보고 무슨 일이 나는지 쓴다 (그리고 되돌린다)
- [ ] `MoveInput = Vector2.zero` 를 빼고 실행해 본다 (그리고 되돌린다)
- [ ] `NetworkPlayerMove` 의 검사를 빼고 실행해 본다 (떨리는 걸 본다)
- [ ] 067회차 `PlayerInput` 에 `if (!IsOwner) return;` 을 넣으면 되는지 생각해 본다
- [ ] 스페이스로 색이 바뀌는 기능을 넣고, **소유자만** 바뀌게 한다
- [ ] `IsOwner` 대신 `OwnerClientId == NetworkManager.Singleton.LocalClientId` 로 써본다

> 💡 앞의 세 개는 **전원이** 한다. 오늘 넣은 세 줄이 각각 뭘 막는지 몸으로 안다.
> 💡 네 번째가 24주차 예고다. 본 게임 `PlayerInput` 도 **같은 한 줄**로 끝난다.

---

## 01:30–01:50 · 반례 실습

**짝을 지어 서로에게 설명한다.**

```
질문 : "만약 067에서 입력과 이동을 안 나눴다면
        오늘 몇 군데를 고쳐야 했을까?"

우리 프로젝트의 입력 사용처를 세어본다:
   PlayerInput          이동
   PlayerAttack (075)   공격
   GameManager (080)    R 키 재시작
   PauseView (098)      ESC
```

> 💬 "본 게임에도 입력을 읽는 곳이 네 군데 있습니다."
> 💬 "그런데 **플레이어 조작은 `PlayerInput` 한 곳**이에요. 나머지는 플레이어 것이 아니고요."
>
> 🔑 💬 "24주차에 본 게임을 네트워크로 옮길 때, **`PlayerInput` 한 줄**만 고치면 됩니다."

---

## ✅ 체크리스트 (학생)

- [ ] `NetworkPlayerInput` 에 `if (!IsOwner)` 가 있다
- [ ] `MoveInput` 을 0 으로 만들고 `return` 한다
- [ ] `NetworkPlayerMove` 에도 검사가 있다
- [ ] 각자 자기 캐릭터만 움직인다
- [ ] 상대 캐릭터가 **안 떨린다**
- [ ] `IsOwner` 와 `IsServer` 의 차이를 안다
- [ ] **왜 한 줄로 끝났는지** 설명할 수 있다
- [ ] 🔴 `Game.unity` 를 안 건드렸다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **여전히 둘 다 움직임** | `IsServer` 로 썼다 | **오늘 1등.** 호스트는 둘 다 서버다 |
| 상대가 한 방향으로 밀림 | `MoveInput` 초기화 누락 | 마지막 값이 남는다 |
| **상대가 부들부들 떤다** | 이동 쪽 검사 누락 | 물리와 받은 위치가 싸운다 |
| 내 것도 안 움직임 | 부호 반대 | `!IsOwner` |
| `IsOwner` 가 없다는 에러 | `MonoBehaviour` 상속 | `NetworkBehaviour` |
| 왜 한 줄인지 설명 못 함 | 067 연결을 못 짚음 | **오늘의 절반이다.** 다시 짚는다 |
| 067 코드를 기억 못 함 | 25주 전 | **화면에 띄운다** |

## 📮 다음 시간 예고

> "위치는 맞춰졌습니다. 그런데 **체력이나 레벨 같은 숫자**는요?"
>
> "`NetworkTransform` 은 위치 전용이에요. 숫자는 다른 걸 씁니다."
>
> "**`NetworkVariable`.** 상자에 값을 넣어두면 자동으로 모두에게 전달됩니다."
>
> 🔑 "그리고 규칙이 하나 붙어요. **값을 바꾸는 건 서버만 할 수 있습니다.**
> 107회차의 '진짜 값은 서버에만 있다' 가 코드로 나타납니다."
