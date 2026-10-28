# Chapter 1 · 12주차 — 미니게임 ① ②

> **이 브랜치(`Chapter_1/Week6`)에는 12주차(056–060회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 4 · 미니게임 |
| 회차 | 056–060 (5회차 · 10시간) |
| 실습 씬 | 10개 |
| 스크립트 | 9개 |
| 프리팹 | 3개 |

---

## 이번 주 5회차

### 056 · 미니게임 ① 완성 ① — 점수를 화면에 띄운다

**배우는 것** — `Canvas`, `TextMeshPro - Text (UI)`, `Time.time`, 점수 갱신

- **`Canvas` 위에 글자를 띄운다**
- 살아남은 시간을 **점수로 화면에 갱신**한다
- Phase 4가 **새 기술이 아니라 완성**의 구간인 걸 안다

씬: `056_Score_Done` · `056_Score_Start`

→ [강의안](./docs/02_수업계획서/056-P4-점수와-화면표시.md)

### 057 · 미니게임 ① 완성 ② — 게임오버 · 재시작 · 개조

**배우는 것** — `Time.timeScale`, `SceneManager.LoadScene`, **Build Settings에 씬 등록**

- 플레이어가 죽으면 **게임을 멈추고 알린다**
- `R`로 **다시 시작**한다
- 각자 **하나 이상 개조**하고 시연한다 ← 이게 오늘의 진짜 목표

씬: `057_GameOver_Done` · `057_GameOver_Start`

→ [강의안](./docs/02_수업계획서/057-P4-게임오버와-재시작.md)

### 058 · 미니게임 ② 벽돌깨기 ① — 배열로 블록을 깐다

**배우는 것** — **2중 `for`** 로 격자 배치, 위치 계산, 색 배열

- **2중 `for`** 로 블록을 격자로 깐다
- 인덱스를 **좌표로 바꾸는 계산**을 이해한다
- 행마다 **색을 다르게** 준다 (배열)

씬: `058_Bricks_Done` · `058_Bricks_Start`

→ [강의안](./docs/02_수업계획서/058-P4-벽돌깨기-블록배치.md)

### 059 · 미니게임 ② 벽돌깨기 ② — 튀는 공

**배우는 것** — **Physics Material 2D**, `Bounciness`, 속도 유지, `.normalized`

- **Physics Material 2D** 로 튀는 공을 만든다
- 공의 **속도를 일정하게 유지**한다 (`.normalized`)
- 공이 블록을 맞히면 **블록이 깨진다**

씬: `059_Ball_Done` · `059_Ball_Start`

→ [강의안](./docs/02_수업계획서/059-P4-벽돌깨기-공과-반사.md)

### 060 · 미니게임 ② 벽돌깨기 ③ — 패들 · 클리어 · 게임오버 (12주차 정리)

**배우는 것** — `Mathf.Clamp` 로 이동 제한, `FindGameObjectsWithTag`, 클리어 판정

- **패들**로 공을 받아친다
- 공을 놓치면 **게임오버**, 블록을 다 깨면 **클리어**
- **057과 구조가 똑같다**는 걸 본다 ← 오늘의 진짜 목표

씬: `060_Breakout_Done` · `060_Breakout_Start`

→ [강의안](./docs/02_수업계획서/060-P4-벽돌깨기-패들과-클리어.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 056 | `056_Score_Done` · `056_Score_Start` |
| 057 | `057_GameOver_Done` · `057_GameOver_Start` |
| 058 | `058_Bricks_Done` · `058_Bricks_Start` |
| 059 | `059_Ball_Done` · `059_Ball_Start` |
| 060 | `060_Breakout_Done` · `060_Breakout_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Enemy/EnemySpawner.cs`
- `Enemy/Health.cs`
- `MiniGame/Ball.cs`
- `MiniGame/BreakoutManager.cs`
- `MiniGame/BrickSpawner.cs`
- `MiniGame/DodgeGameManager.cs`
- `MiniGame/Paddle.cs`
- `Player/PlayerPhysicsMove.cs`
- `Weapon/Bullet.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

### 프리팹 — `Assets/_Project/Prefabs/`

- `Enemy/Brick.prefab`
- `Enemy/Obstacle.prefab`
- `Projectile/Ball.prefab`

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 12주차 수업 슬라이드 |
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
| `Chapter_1/Week6` | 12주차 (056–060) ← 지금 여기 |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
