# Chapter 2 · 15주차 — 몬스터 3종과 웨이브

> **이 브랜치(`Chapter_2/Week2`)는 14주차 위에 15주차(071–075회차)를 쌓은 것입니다.**
> Chapter 2 는 `Game.unity` **하나가 계속 자랍니다.** 그래서 주차마다 갈아엎지 않고 이어붙입니다.
> 14주차만 보려면 `Chapter_2/Week1`, Chapter 1 기초는 `Chapter_1/Week1`~`Week7` 에 있습니다.

| | |
|---|---|
| Phase | 5 · 본 프로젝트 코어 |
| 회차 | 071–075 (5회차 · 10시간) |
| 씬 | `Game.unity` (14주차에서 이어서) |
| 스크립트 | 14개 (이번 주 신규 4개 · 수정 2개) |
| 결과물 | 사방에서 몰려오는 몬스터 3종을 Space 로 쓸어 담는다 |

## 이번 주 5회차

### 071 · 몬스터가 쫓아온다
**배우는 것** — `virtual` 을 **미리 열어두는** 설계, 방향 = 빼기(063 복습)
- `Enemy` 에 `rb` · `sprite` · `player` 를 넣고 `FixedUpdate` 에서 쫓아간다
- **`Move()` 를 따로 뗀다.** 지금은 아무도 안 덮어쓰는데도 `virtual` 로 연다
- 왜? 072에서 러너가 덮어쓸 자리다. 안 떼어 두면 그때 `FixedUpdate` 를 통째로 뜯는다

`Scripts/Enemy/Enemy.cs`
→ [강의안](./docs/02_수업계획서/071-P5-몬스터-추적-이동.md)

### 072 · 몬스터 3종 ⭐
**배우는 것** — 다형성. **자식마다 다른 메서드를 바꾼다**
- `RunnerEnemy` 는 **`Move()`** 를 덮어쓴다 — 처음 본 방향으로만 직진, 안 꺾는다
- `TankEnemy` 는 **`TakeDamage()`** 를 덮어쓴다 — 피해를 절반으로 깎는다
- **둘이 바꾸는 메서드가 다르다.** 그게 요점이다. 나머지는 부모 것을 그대로 쓴다
- `Enemy.TakeDamage` 를 `public void` → `public virtual void` 로 **한 줄만** 고친다

| | 스프라이트 | 체력 | 피해 | 속도 | 특징 |
|---|---|---|---|---|---|
| `Enemy_Charger` | Orc | 10 | 1 | 2.0 | 부딪히면 3 피해 (070) |
| `Enemy_Runner` | Demon_A | 4 | 1 | 5.0 | 빠르지만 안 꺾는다 |
| `Enemy_Tank` | Blood Monster_A | 30 | 2 | 1.2 | 받는 피해 50% 감소 |

`Scripts/Enemy/RunnerEnemy.cs` · `TankEnemy.cs`
→ [강의안](./docs/02_수업계획서/072-P5-몬스터-3종.md)

### 073 · 화면 밖에서 나타난다
**배우는 것** — 스폰 포인트, **Layer Collision Matrix 로 편 가르기**
- **몬스터를 만드는 곳은 `WaveManager` 한 곳뿐이다** ← 설계 규칙 ①
- 스폰 포인트 8개를 반지름 14 원형으로. **`Main Camera` 의 자식**으로 붙인다
  (무한 맵에서는 "화면 밖" 이 계속 바뀐다 — 033 로봇팔과 같은 원리)
- 몬스터끼리 서로 때려 죽는 걸 **코드 한 줄 안 고치고** `Enemy × Enemy` 체크 해제로 해결

`Scripts/Manager/WaveManager.cs`
→ [강의안](./docs/02_수업계획서/073-P5-스폰-포인트.md)

### 074 · 웨이브
**배우는 것** — 코루틴 **두 개를 동시에** 돌리기
- `SpawnRoutine` 과 `WaveRoutine` 을 따로 돌린다. 주기가 다른 별개의 일이라서
- 15초마다 웨이브 +1, 소환 간격 −0.3초 (최소 0.4초)
- `KindCount()` — 웨이브가 오를수록 나오는 종류가 는다. 1웨이브엔 돌진형만

→ [강의안](./docs/02_수업계획서/074-P5-웨이브-매니저.md)

### 075 · 드디어 때린다 ⭐
**배우는 것** — `Physics2D.OverlapCircleAll`, 쿨다운, 처치 수
- **Space** 로 반경 3 안을 전부 때린다 (`damage` 4, 쿨다운 0.4초)
- **`IDamageable` 만 보고 때린다.** 상대가 뭔지 안 본다 — 070에서 만든 게 여기서 값을 한다
- 내 몸도 목록에 들어오니 걸러낸다. 안 그러면 내가 나를 때린다
- `GameManager.Kills` 를 HUD에 띄운다

`Scripts/Player/PlayerAttack.cs` · `Scripts/UI/HUDView.cs`
→ [강의안](./docs/02_수업계획서/075-P5-피격과-처치.md)

## 이 브랜치에 있는 것

```
Assets/_Project/
├── Scenes/Game.unity
├── Scripts/
│   ├── IDamageable.cs ··············· 070
│   ├── Enemy/   Enemy · ChargerEnemy · RunnerEnemy · TankEnemy
│   ├── Manager/ GameManager · CameraFollow · WaveManager
│   ├── Map/     InfiniteGround
│   ├── Player/  PlayerInput · PlayerController · PlayerHealth · PlayerAttack
│   └── UI/      HUDView
├── Prefabs/Enemy/ ··················· Charger · Runner · Tank
└── Animation/ ······················· Orc · Demon_A · Blood 클립 + 컨트롤러
```

## 씬 구성

| 오브젝트 | 붙은 것 |
|---|---|
| `Main Camera` | `CinemachineBrain` · 자식 `SpawnPoints`(8개, 반지름 14) |
| `CM_PlayerCamera` | `CinemachineCamera`(Follow=Player) · `CinemachinePositionComposer` |
| `GameManager` | `GameManager` (상태 + 처치 수) |
| `Player` | `PlayerInput` · `PlayerController` · `PlayerHealth` · **`PlayerAttack`** |
| `Ground` | `InfiniteGround` + 타일 9장 |
| **`WaveManager`** | 프리팹 3개 · 스폰 포인트 8개 |
| **`HUD`** | `Canvas` + `HUDView` (웨이브 / 처치) |

프로젝트 설정도 하나 바뀐다 — `Physics 2D → Layer Collision Matrix` 에서 **`Enemy` × `Enemy` 해제**.

## 조작

| | |
|---|---|
| `WASD` | 이동 |
| `Space` | 휘두르기 (반경 3, 피해 4, 쿨다운 0.4초) |

## 브랜치

| | |
|---|---|
| `Chapter_1/Week1`~`Week7` | 유니티 기초 (031–065) |
| `Chapter_2/Week1` | 착수 · 무한 맵 (066–070) |
| **`Chapter_2/Week2`** | **← 지금 여기** (071–075) |
| `main` | 전체 과정 문서 + Chapter 1 |
