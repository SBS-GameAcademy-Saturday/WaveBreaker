# Chapter 1 · 9주차 — 2D 물리와 충돌

> **이 브랜치(`Chapter_1/Week3`)에는 9주차(041–045회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 3 · 유니티 2D 핵심 |
| 회차 | 041–045 (5회차 · 10시간) |
| 실습 씬 | 10개 |
| 스크립트 | 3개 |
| 프리팹 | 없음 |

---

## 이번 주 5회차

### 041 · Rigidbody2D — 물리가 붙는다

**배우는 것** — `Rigidbody 2D`, Body Type, Gravity Scale, Mass, Linear Damping

- `Rigidbody 2D`를 붙이면 **물체가 떨어진다**는 걸 본다
- **Body Type 3종**(Dynamic / Kinematic / Static)의 차이를 말한다
- Gravity Scale · Mass · Linear Damping을 **숫자로 바꿔가며** 확인한다

씬: `041_Rigidbody_Done` · `041_Rigidbody_Start`

→ [강의안](./docs/02_수업계획서/041-P3-Rigidbody2D.md)

### 042 · 물리 기반 이동 — FixedUpdate와 linearVelocity

**배우는 것** — `FixedUpdate`, `Rigidbody2D.linearVelocity`, `[SerializeField] Rigidbody2D`

- **물리 엔진에게 이동을 맡긴다** — `linearVelocity`에 방향과 속도를 넣는다
- `Update`와 `FixedUpdate`가 **왜 둘 다 있는지** 안다
- 다른 컴포넌트를 `[SerializeField]`로 **Inspector에서 끌어다 연결**한다

씬: `042_PhysicsMove_Done` · `042_PhysicsMove_Start`

→ [강의안](./docs/02_수업계획서/042-P3-물리-기반-이동.md)

### 043 · Collider 2D와 isTrigger — 부딪히는 것과 지나가는 것

**배우는 것** — `Box Collider 2D`, `Circle Collider 2D`, Edit Collider, **`Is Trigger`**

- `Collider 2D`를 붙여 **벽을 만든다**
- 충돌이 성립하는 **조건 2가지**를 안다 (둘 다 Collider / 하나는 Dynamic Rigidbody)
- **`Is Trigger`** 를 켜면 **통과하지만 알아챈다**는 걸 안다

씬: `043_Collider_Done` · `043_Collider_Start`

→ [강의안](./docs/02_수업계획서/043-P3-Collider2D와-isTrigger.md)

### 044 · 충돌 이벤트와 Tag — 부딪힌 걸 코드로 받는다

**배우는 것** — `OnTriggerEnter2D`, `OnCollisionEnter2D`, `Tag`, `CompareTag`

- **`OnTriggerEnter2D`** 로 닿은 순간을 코드에서 받는다
- **`Tag`** 로 "몬스터만" 골라 반응한다
- `OnCollisionEnter2D`와 `OnTriggerEnter2D`의 **차이**를 안다

씬: `044_Trigger_Done` · `044_Trigger_Start`

→ [강의안](./docs/02_수업계획서/044-P3-충돌-이벤트와-Tag.md)

### 045 · Layer와 Sorting Layer — 안 부딪히게, 앞에 보이게 (9주차 정리)

**배우는 것** — `Layer`, **Layer Collision Matrix**, `Sorting Layer`, `Order in Layer`

- **Layer Collision Matrix**로 "아예 안 부딪히는" 관계를 만든다
- `Tag`와 `Layer`가 **무엇이 다른지** 말한다
- `Sorting Layer` · `Order in Layer`로 **누가 앞에 보일지** 정한다

씬: `045_Layer_Done` · `045_Layer_Start`

→ [강의안](./docs/02_수업계획서/045-P3-Layer와-Sorting-Layer.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 041 | `041_Rigidbody_Done` · `041_Rigidbody_Start` |
| 042 | `042_PhysicsMove_Done` · `042_PhysicsMove_Start` |
| 043 | `043_Collider_Done` · `043_Collider_Start` |
| 044 | `044_Trigger_Done` · `044_Trigger_Start` |
| 045 | `045_Layer_Done` · `045_Layer_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Player/PlayerMove.cs`
- `Player/PlayerPhysicsMove.cs`
- `Practice/Collector.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 9주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) |
| `Chapter_1/Week2` | 8주차 (036–040) |
| `Chapter_1/Week3` | 9주차 (041–045) ← 지금 여기 |
| `Chapter_1/Week4` | 10주차 (046–050) |
| `Chapter_1/Week5` | 11주차 (051–055) |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
