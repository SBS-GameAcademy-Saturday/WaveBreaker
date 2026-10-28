# Chapter 1 · 13주차 — 미니게임 ② ③ 완주

> **이 브랜치(`Chapter_1/Week7`)에는 13주차(061–065회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 4 · 미니게임 |
| 회차 | 061–065 (5회차 · 10시간) |
| 실습 씬 | 10개 |
| 스크립트 | 11개 |
| 프리팹 | 4개 |

---

## 이번 주 5회차

### 061 · 미니게임 ② 완성 ① — 목숨과 점수

**배우는 것** — 목숨 관리, 공 재생성, 점수 누적, `Invoke`

- **목숨 3개**를 주고, 공을 놓치면 하나씩 깎는다
- 블록을 깰 때마다 **점수**를 올린다
- `Invoke`로 **잠깐 뒤에** 공을 다시 놓는다

씬: `061_Lives_Done` · `061_Lives_Start`

→ [강의안](./docs/02_수업계획서/061-P4-벽돌깨기-목숨과-점수.md)

### 062 · 미니게임 ② 개조와 시연 — 두 번째 완주

**배우는 것** — **없다.** 각자 개조하고 시연한다

- 벽돌깨기를 **하나 이상 개조**한다
- **뭘 왜 바꿨는지** 말로 설명한다
- 두 번째 게임을 **끝낸다**

씬: `062_Polish_Done` · `062_Polish_Start`

→ [강의안](./docs/02_수업계획서/062-P4-벽돌깨기-개조와-시연.md)

### 063 · 미니게임 ③ 생존 슈팅 ① — 쫓아오는 적

**배우는 것** — `FindWithTag`, 방향 벡터 만들기, 화면 밖 원형 스폰

- 적이 **플레이어를 향해 온다**
- 스폰된 적이 **코드로 플레이어를 찾는다** (`FindWithTag`)
- 적이 **화면 밖 사방에서** 계속 나온다

씬: `063_Survival_Done` · `063_Survival_Start`

→ [강의안](./docs/02_수업계획서/063-P4-생존슈팅-쫓아오는-적.md)

### 064 · 미니게임 ③ 생존 슈팅 ② — 자동 발사와 웨이브

**배우는 것** — 가장 가까운 적 찾기, `transform.up` 대입, **웨이브**

- **가장 가까운 적**을 찾아 자동으로 쏜다
- 총알을 **그 방향으로** 날린다
- 시간이 지날수록 적이 강해지는 **웨이브**를 만든다

씬: `064_AutoFire_Done` · `064_AutoFire_Start`

→ [강의안](./docs/02_수업계획서/064-P4-생존슈팅-자동발사와-웨이브.md)

### 065 · 미니게임 3종 시연 — Phase 4 마무리

**배우는 것** — **없다.** 완성하고, 보여주고, 넘긴다

- 생존 슈팅에 **점수와 게임오버**를 붙여 완성한다
- **미니게임 3종을 전부** 시연한다
- **"끝까지 만들어봤다"** 를 세 번 채운다 ← Phase 4의 전부

씬: `065_Survival_Done` · `065_Survival_Start`

→ [강의안](./docs/02_수업계획서/065-P4-미니게임-3종-시연.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 061 | `061_Lives_Done` · `061_Lives_Start` |
| 062 | `062_Polish_Done` · `062_Polish_Start` |
| 063 | `063_Survival_Done` · `063_Survival_Start` |
| 064 | `064_AutoFire_Done` · `064_AutoFire_Start` |
| 065 | `065_Survival_Done` · `065_Survival_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Enemy/EnemySpawner.cs`
- `Enemy/Health.cs`
- `MiniGame/AutoShooter.cs`
- `MiniGame/Ball.cs`
- `MiniGame/BreakoutManager.cs`
- `MiniGame/BrickSpawner.cs`
- `MiniGame/EnemyChaser.cs`
- `MiniGame/Paddle.cs`
- `MiniGame/SurvivalManager.cs`
- `Player/PlayerPhysicsMove.cs`
- `Weapon/Bullet.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

### 프리팹 — `Assets/_Project/Prefabs/`

- `Enemy/Brick.prefab`
- `Enemy/Chaser.prefab`
- `Projectile/Ball.prefab`
- `Projectile/Bullet.prefab`

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 13주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) |
| `Chapter_1/Week2` | 8주차 (036–040) |
| `Chapter_1/Week3` | 9주차 (041–045) |
| `Chapter_1/Week4` | 10주차 (046–050) |
| `Chapter_1/Week5` | 11주차 (051–055) |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) ← 지금 여기 |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
