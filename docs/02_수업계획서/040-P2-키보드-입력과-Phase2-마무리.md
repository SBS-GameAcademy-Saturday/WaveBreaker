# 040회차 · 키보드 입력 — 움직이는 캐릭터 (Phase 2 마무리)

| | |
|---|---|
| **Phase** | 2 · 유니티 입문 **(마지막 회차)** |
| **소요** | 2시간 (비대면) |
| **선행** | 039회차 (`Time.deltaTime`) |
| **오늘 배우는 것** | `Input.GetAxisRaw`, `SetActive`, `[ContextMenu]` |
| **씬** | 시작 `040_Input_Start` · 완성 `040_Input_Done` |
| **준비물(강사)** | `PlayerMove.cs` 완성본, **Active Input Handling = Both 확인**, `Snapshot_P2` 배포본 |

## 🎯 오늘의 목표

1. **WASD로 캐릭터를 움직인다** ← Phase 2의 산출물
2. `SetActive`로 오브젝트를 코드에서 켜고 끈다
3. `[ContextMenu]`로 Play 없이 메서드를 실행한다

> 🚨 **강사 사전 확인 (필수)**: `Project Settings → Player → Other Settings → Active Input Handling`이
> **`Both`** 인지 확인한다. `Input System Package (New)` 상태면 `Input.GetAxisRaw`가
> **컴파일은 되는데 런타임에 `InvalidOperationException`** 을 던진다. 바꾸면 **에디터 재시작**이 필요하다.
> 이걸 놓치면 오늘 반 전체가 동시에 막힌다.
>
> 🔑 **설계 의도**: 8주를 기다린 "내가 조종하는 캐릭터"가 오늘 나온다.
> 새 개념은 `Input` 하나뿐이고 나머지는 038·039의 조립이다. **성취감에 시간을 쓴다.**

## 📦 오늘의 제출물

**WASD로 캐릭터를 움직이는 GIF (5초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 3문제 |
| 00:10–00:45 | 같이 치기 — 입력 읽기 → 이동 연결 → SetActive → ContextMenu |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + **Phase 2 종료 조건 점검** |
| 01:50–02:00 | 체크리스트 + 제출 + Phase 3 예고 |

---

## 00:00–00:10 · 복습 퀴즈 (채팅 동시 답변)

1. 움직이는 코드에 곱하는 것은? → **`Time.deltaTime`**
2. 곱한 뒤 `moveSpeed = 3`의 뜻은? → **1초에 3만큼**
3. `Vector3.up`의 값은? → **`(0, 1, 0)`**

---

## 00:10–00:45 · 같이 치기 ★

### ① 입력을 숫자로 읽기 (8분)

```csharp
void Update()
{
    float h = Input.GetAxisRaw("Horizontal");
    float v = Input.GetAxisRaw("Vertical");

    Debug.Log("h: " + h + " / v: " + v);
}
```

▶ Play → **키를 누르며 Console을 본다.**

| 누르는 키 | `h` | `v` |
|---|---|---|
| 아무것도 | `0` | `0` |
| `D` 또는 → | **`1`** | `0` |
| `A` 또는 ← | **`-1`** | `0` |
| `W` 또는 ↑ | `0` | **`1`** |
| `S` 또는 ↓ | `0` | **`-1`** |

> 💬 "키를 누르면 **숫자가 나옵니다.** 오른쪽이 `1`, 왼쪽이 `-1`."
> 💬 "032회차에 배운 거랑 똑같죠? **양수면 오른쪽, 음수면 왼쪽.**"

> 💬 "`Horizontal`, `Vertical`은 유니티가 미리 만들어 둔 이름입니다. WASD랑 방향키가 **둘 다** 연결돼 있어요."
>
> ⚠️ `GetAxis`와 `GetAxisRaw`의 차이를 묻는 학생이 있다.
> **"`Raw`는 딱 -1, 0, 1만 나오고, 그냥 `GetAxis`는 부드럽게 올라갑니다. 지금은 `Raw`가 이해하기 쉬워요."** 까지만.

### ② 이동과 연결 (13분) — 오늘의 핵심

**038·039에서 만든 것에 방향만 갈아 끼운다.**

```csharp
using UnityEngine;

public class PlayerMove : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        Vector3 dir = new Vector3(h, v, 0f);

        transform.position = transform.position + dir * moveSpeed * Time.deltaTime;
    }
}
```

**한 줄씩 짚는다.**

| 줄 | 뜻 |
|---|---|
| `float h = ...` | 좌우 키를 숫자로 읽는다 |
| `new Vector3(h, v, 0f)` | 읽은 두 숫자를 **방향으로 묶는다** |
| `+ dir * moveSpeed * Time.deltaTime` | **038·039에서 한 그대로** |

> 💬 "새로 배운 건 **첫 두 줄뿐**이에요. 나머지는 지난 두 시간에 한 겁니다."
> 💬 "키를 안 누르면 `dir`이 `(0,0,0)`이라 **안 움직입니다.** 조건문이 필요 없어요."

▶ Play → **WASD로 움직인다.** 여기서 시간을 준다. 다들 한참 논다.

> 🎉 **이 순간이 Phase 2의 목표다.** 서두르지 않는다. 3분쯤 그냥 놀게 둔다.

> 💡 **대각선이 빠른 것** — `(1,1,0)`은 길이가 약 1.41이라 대각선이 빠르다.
> 눈치채는 학생이 있으면 **`dir.normalized`** 를 개별로 알려준다. 반 전체에는 안 꺼낸다. (Phase 5에서 정식으로)

### ③ `SetActive` — 코드로 껐다 켜기 (8분)

> 💬 "031회차에 Inspector 체크박스로 물체를 껐죠. 그걸 **코드로** 합니다."

```csharp
[SerializeField] private GameObject target;

void Update()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        target.SetActive(!target.activeSelf);
    }
}
```

| 조각 | 뜻 |
|---|---|
| `[SerializeField] private GameObject target` | **다른 오브젝트를** Inspector에서 끌어다 넣는 칸 |
| `Input.GetKeyDown(KeyCode.Space)` | 스페이스를 **누른 순간** 한 번 |
| `target.activeSelf` | 지금 켜져 있나 (`true`/`false`) |
| `!` | **반대로** (3주차 논리 연산자) |

> 💬 "`!`는 3주차에 배운 '아니다'예요. 켜져 있으면 끄고, 꺼져 있으면 켭니다."
>
> ⚠️ **Inspector에 오브젝트를 끌어다 넣는 것**이 오늘 두 번째로 어려운 부분이다.
> Hierarchy에서 Inspector의 `Target` 칸으로 드래그하는 걸 화면 공유로 천천히 보여준다.
> 안 넣으면 `NullReferenceException`이 난다.

> 💬 "`GetKeyDown`은 **누른 순간 한 번**, `GetKey`는 **누르고 있는 동안 계속**입니다."

### ④ `[ContextMenu]` — Play 없이 실행 (6분)

```csharp
[ContextMenu("원점으로 보내기")]
private void ResetPosition()
{
    transform.position = Vector3.zero;
    Debug.Log("원점으로 보냈습니다");
}
```

Inspector에서 스크립트 이름 우측 `⋮` → **"원점으로 보내기"** 가 나온다. 클릭하면 실행된다.

> 💬 "**Play를 안 눌러도** 메서드를 실행할 수 있습니다. 물체가 어디론가 사라졌을 때 특히 편해요."
> 💬 "앞으로 테스트할 때 자주 씁니다. '몬스터 10마리 소환' 같은 걸 버튼 하나로 하게 돼요."

---

## 00:55–01:35 · 개인 미션

### 필수 미션 — `PlayerMove` 완성

```csharp
using UnityEngine;

public class PlayerMove : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private GameObject item;    // Inspector 에서 끌어다 넣기

    void Update()
    {
        // TODO ①: 좌우 / 상하 입력을 각각 h, v 로 읽으세요


        // TODO ②: h, v 로 Vector3 방향을 만드세요


        // TODO ③: 그 방향으로 moveSpeed 만큼, Time.deltaTime 을 곱해 움직이세요


        // TODO ④: 스페이스를 누르면 item 을 껐다 켰다 하세요
    }

    // TODO ⑤: [ContextMenu] 를 붙여 원점으로 돌아가는 메서드를 만드세요
}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
using UnityEngine;

public class PlayerMove : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private GameObject item;

    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");

        Vector3 dir = new Vector3(h, v, 0f);

        transform.position = transform.position + dir * moveSpeed * Time.deltaTime;

        if (Input.GetKeyDown(KeyCode.Space))
        {
            item.SetActive(!item.activeSelf);
        }
    }

    [ContextMenu("원점으로 보내기")]
    private void ResetPosition()
    {
        transform.position = Vector3.zero;
    }
}
```

`item` 칸이 비어 있으면 스페이스를 누르는 순간 `NullReferenceException`이 난다.
**Hierarchy에서 오브젝트를 Inspector의 `Item` 칸으로 드래그**해서 넣는다.
</details>

**확인 조건**: WASD로 움직이고, 스페이스로 다른 물체가 껐다 켜지고, 우클릭 메뉴로 원점 복귀가 된다.

### ⭐ 도전 미션

- [ ] `Shift`를 누르고 있으면 빨라지게 한다 (`Input.GetKey(KeyCode.LeftShift)`)
- [ ] 화면 밖으로 못 나가게 X, Y를 `-8 ~ 8`로 제한한다 (`Mathf.Clamp`)
- [ ] `GetAxis`(Raw 없이)로 바꿔보고 **움직임이 어떻게 다른지** 한 줄로 쓴다
- [ ] 대각선이 더 빠른 걸 확인하고 `dir.normalized`로 고친다
- [ ] 왼쪽으로 갈 때 캐릭터가 **뒤집히게** 한다 (033회차 Scale 음수)
- [ ] `[ContextMenu]`로 "랜덤 위치로 보내기"를 만든다 (`Random.Range`)

---

## 01:35–01:50 · 데모 + Phase 2 종료 조건 점검

**전원 30초씩 데모.** WASD로 움직이는 걸 보여준다.

### ✅ Phase 2 종료 조건 (한 명씩 확인)

- [ ] 에디터 6개 창의 역할을 말한다
- [ ] `F` 키로 오브젝트를 찾는다
- [ ] Component를 추가·제거한다
- [ ] 스크립트를 만들어 GameObject에 붙인다
- [ ] `Start`/`Update` 차이를 한 문장으로 말한다
- [ ] `[SerializeField]` 변수를 Inspector에서 조절한다
- [ ] **WASD로 캐릭터를 움직인다**
- [ ] Play 중 변경은 저장되지 않음을 안다

> 하나라도 안 되는 학생이 있으면 **이번 주 안에 개별 시간**을 잡는다.
> Phase 3(물리·충돌)는 오늘 것 위에 그대로 쌓인다.

### 📦 스냅샷 배포

`Snapshot_P2.zip` — **이동하는 캐릭터 씬**. 전원에게 배포한다.

> 💬 "다음 주부터는 이 상태에서 시작합니다. 못 따라온 분은 이걸 여세요."

---

## ✅ 체크리스트 (학생)

- [ ] `Input.GetAxisRaw`로 키 입력을 숫자로 읽는다
- [ ] 읽은 값으로 `Vector3` 방향을 만든다
- [ ] WASD로 캐릭터를 움직인다
- [ ] `GetKeyDown`과 `GetKey`의 차이를 안다
- [ ] `SetActive`로 오브젝트를 껐다 켠다
- [ ] Inspector 칸에 오브젝트를 드래그해 넣을 수 있다
- [ ] `[ContextMenu]`로 메서드를 실행한다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`InvalidOperationException` (Input)** | **Active Input Handling이 New 전용** | **강사가 미리 `Both`로.** 수업 중 발견 시 전원 에디터 재시작 |
| `NullReferenceException` | Inspector `Item` 칸이 비어 있음 | **오늘 1등.** Hierarchy에서 드래그해 넣는다 |
| 안 움직임 | Game 창에 포커스가 없음 | **Game 창을 한 번 클릭**하고 키를 누른다 |
| 안 움직임 (2) | 한/영 키가 한글 | 영문 상태로 |
| 너무 빠름 | `moveSpeed`가 큼 | `5` 정도. Inspector에서 조절 |
| 대각선이 빠름 | 정상 (길이 1.41) | 눈치챈 학생만 `normalized`. **반 전체엔 안 꺼냄** |
| `Horizontal` 오타 | 대소문자·철자 | 문자열이라 컴파일 에러가 안 난다. **Console에 0만 찍힌다** |
| `KeyCode.space` | 대소문자 | `KeyCode.Space` |
| 스페이스가 계속 토글됨 | `GetKey`를 씀 | `GetKeyDown`으로 |
| `[ContextMenu]`가 안 보임 | 메서드가 아니라 필드에 붙임 | 메서드 바로 위에 |
| Play 중 코드 고치고 날림 | 037 그대로 | "Stop하고 고치세요" |
| 다 하고 계속 노는 학생 | **좋은 신호** | 놀게 둔다. Phase 2의 목적이 이거다 |

## 📮 다음 시간 예고 (Phase 3)

> "이제 캐릭터가 움직이죠. 그런데 **벽을 뚫고 지나갑니다.**"
>
> "다음 주부터는 **부딪히게** 만듭니다. 총알이 몬스터를 맞히고 체력이 깎이는 것까지 3주 안에 갑니다."
>
> "그리고 9주차 첫날, 034회차에 맛만 봤던 **물리를 제대로** 합니다."
