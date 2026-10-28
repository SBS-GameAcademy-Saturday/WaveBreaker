# Chapter 1 · 8주차 — 스크립트와 이동

> **이 브랜치(`Chapter_1/Week2`)에는 8주차(036–040회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 2 · 유니티 입문 |
| 회차 | 036–040 (5회차 · 10시간) |
| 실습 씬 | 9개 |
| 스크립트 | 5개 |
| 프리팹 | 없음 |

---

## 이번 주 5회차

### 036 · 첫 스크립트 — Start와 Update

**배우는 것** — `MonoBehaviour`, `Start`, `Update`, `Debug.Log`

- C# 스크립트를 만들어 **컴포넌트로 붙인다**
- `Start`는 한 번, `Update`는 매 프레임인 걸 안다
- `Debug.Log`로 Console에 찍는다

씬: `036_Script_Done` · `036_Script_Start`

→ [강의안](./docs/02_수업계획서/036-P2-첫-스크립트.md)

### 037 · `[SerializeField]`와 Play 모드 함정

**배우는 것** — `[SerializeField]`, `transform.Rotate`, Play 모드 함정

- `[SerializeField]`로 **코드를 안 고치고** 값을 바꾼다
- `transform`을 코드에서 건드린다
- **Play 중 바꾼 값은 사라진다**는 걸 몸으로 안다

씬: `037_SerializeField_Done` · `037_SerializeField_Start`

→ [강의안](./docs/02_수업계획서/037-P2-SerializeField와-인스펙터.md)

### 038 · 코드로 이동하기 — `transform.position`과 Vector

**배우는 것** — `transform.position` / `localPosition`, `Vector2` / `Vector3`, `Translate`

- 코드로 **물체를 움직인다**
- `Vector3`가 **좌표 세 개를 묶은 것**임을 안다
- 032회차 좌표 감각을 **코드로 연결한다**

씬: `038_Move_Done` · `038_Move_Start`

→ [강의안](./docs/02_수업계획서/038-P2-코드로-이동하기.md)

### 039 · `Time.deltaTime` — 이동거리를 공평하게

**배우는 것** — 프레임, `Time.deltaTime`, "초당" 단위로 생각하기

- **프레임**이 뭔지 안다
- **`deltaTime`을 1초 동안 더하면 1**이라는 걸 안다 ← 곱하는 이유
- `deltaTime`이 **`1 / FPS`(초/프레임)** 이고 **매 프레임 달라진다**는 걸 안다
- 속도 값을 **"초당 몇"** 으로 생각한다

씬: `039_DeltaTime`

→ [강의안](./docs/02_수업계획서/039-P2-Time-deltaTime.md)

### 040 · 키보드 입력 — 움직이는 캐릭터 (Phase 2 마무리)

**배우는 것** — `Input.GetAxisRaw`, `SetActive`, `[ContextMenu]`

- **WASD로 캐릭터를 움직인다** ← Phase 2의 산출물
- `SetActive`로 오브젝트를 코드에서 켜고 끈다
- `[ContextMenu]`로 Play 없이 메서드를 실행한다

씬: `040_Input_Done` · `040_Input_Start`

→ [강의안](./docs/02_수업계획서/040-P2-키보드-입력과-Phase2-마무리.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 036 | `036_Script_Done` · `036_Script_Start` |
| 037 | `037_SerializeField_Done` · `037_SerializeField_Start` |
| 038 | `038_Move_Done` · `038_Move_Start` |
| 039 | `039_DeltaTime` |
| 040 | `040_Input_Done` · `040_Input_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Player/PlayerMove.cs`
- `Practice/Bouncer.cs`
- `Practice/HelloUnity.cs`
- `Practice/Mover.cs`
- `Practice/Spinner.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 8주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) |
| `Chapter_1/Week2` | 8주차 (036–040) ← 지금 여기 |
| `Chapter_1/Week3` | 9주차 (041–045) |
| `Chapter_1/Week4` | 10주차 (046–050) |
| `Chapter_1/Week5` | 11주차 (051–055) |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
