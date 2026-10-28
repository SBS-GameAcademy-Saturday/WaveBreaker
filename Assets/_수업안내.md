# Chapter 1 · 11주차 — 코루틴 · 스프라이트 · 미니게임 ①

> **이 브랜치(`Chapter_1/Week5`)에는 11주차(051–055회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 3 · 유니티 2D 핵심 |
| 회차 | 051–055 (5회차 · 10시간) |
| 실습 씬 | 10개 |
| 스크립트 | 6개 |
| 프리팹 | 3개 |

---

## 이번 주 5회차

### 051 · 코루틴 ① — 시간을 다루는 메서드

**배우는 것** — `IEnumerator`, `yield return`, `WaitForSeconds`, `StartCoroutine`

- `Update` + 타이머 변수로 "3초 뒤에"를 만들어 보고 **불편을 겪는다**
- **코루틴**으로 같은 걸 훨씬 짧게 쓴다
- `yield return new WaitForSeconds(3f)` 가 **"여기서 3초 쉬었다 이어서"** 인 걸 안다

씬: `051_Coroutine_Done` · `051_Coroutine_Start`

→ [강의안](./docs/02_수업계획서/051-P3-코루틴-기초.md)

### 052 · 코루틴 ② — 2초마다 저절로 나오는 몬스터

**배우는 것** — 코루틴 안의 `while`, `StopCoroutine`, `Coroutine` 핸들

- 코루틴 안에 `while`을 넣어 **일정 간격으로 반복**한다
- `E` 키 스폰을 **자동 스폰**으로 바꾼다 ← Phase 3 종료 조건
- 시작한 코루틴을 **멈춘다**

씬: `052_Spawn_Done` · `052_Spawn_Start`

→ [강의안](./docs/02_수업계획서/052-P3-코루틴-스폰.md)

### 053 · 스프라이트 — 흰 네모를 그림으로

**배우는 것** — Texture Type, **Pixels Per Unit**, **Filter Mode**, Sprite Mode Multiple, Sprite Editor

- 이미지를 넣고 **`Sprite Renderer`에 끼운다**
- **`Pixels Per Unit`** 이 크기를 정한다는 걸 안다
- **`Filter Mode`** 를 바꿔 흐릿한 걸 또렷하게 만든다

씬: `053_Sprite_Done` · `053_Sprite_Start`

→ [강의안](./docs/02_수업계획서/053-P3-스프라이트.md)

### 054 · Animator 기초 — 걷기 하나면 충분하다

**배우는 것** — Animation 창, 애니메이션 클립, Animator Controller, `Samples`, `Loop Time`

- 잘라둔 그림으로 **애니메이션 클립을 만든다**
- `Samples`로 **빠르기를 조절**한다
- 파일 **세 개가 한 번에 생기는 구조**를 안다 (클립 · 컨트롤러 · 컴포넌트)

씬: `054_Animator_Done` · `054_Animator_Start`

→ [강의안](./docs/02_수업계획서/054-P3-Animator-기초.md)

### 055 · 미니게임 ① 피하기 — 새로 배우는 것 없이 게임 하나 (Phase 3 마무리)

**배우는 것** — **없다.** 5주간 배운 것을 다시 조합한다

- 배운 것만 조합해 **피하기 게임**을 만든다
- 프리팹 하나를 **Inspector 설정만 바꿔** 다른 용도로 쓴다
- **Phase 3 종료 조건**을 전원이 통과한다

씬: `055_Dodge_Done` · `055_Dodge_Start`

→ [강의안](./docs/02_수업계획서/055-P3-미니게임1-착수.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 051 | `051_Coroutine_Done` · `051_Coroutine_Start` |
| 052 | `052_Spawn_Done` · `052_Spawn_Start` |
| 053 | `053_Sprite_Done` · `053_Sprite_Start` |
| 054 | `054_Animator_Done` · `054_Animator_Start` |
| 055 | `055_Dodge_Done` · `055_Dodge_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Enemy/EnemySpawner.cs`
- `Enemy/Health.cs`
- `Player/PlayerPhysicsMove.cs`
- `Player/PlayerShooter.cs`
- `Practice/CoroutineDemo.cs`
- `Weapon/Bullet.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

### 프리팹 — `Assets/_Project/Prefabs/`

- `Enemy/Enemy.prefab`
- `Enemy/Obstacle.prefab`
- `Projectile/Bullet.prefab`

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 11주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) |
| `Chapter_1/Week2` | 8주차 (036–040) |
| `Chapter_1/Week3` | 9주차 (041–045) |
| `Chapter_1/Week4` | 10주차 (046–050) |
| `Chapter_1/Week5` | 11주차 (051–055) ← 지금 여기 |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
