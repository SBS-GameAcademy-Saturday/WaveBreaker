# 실습 씬 (061–065 · 13주차)

주차별로 아래에 이어 붙인다. 회차마다 **시작 / 완성** 쌍으로 세팅돼 있다. 강사 시연이 필요한 회차는 **Demo** 씬이 따로 있다.

| 회차 | 시작 (학생) | 완성 (정답) | 시연 (강사) |
|---|---|---|---|
| 031 | `031_Inspector_Start` | `031_Inspector_Done` | `031_Inspector_Demo` |
| 032 | `032_Position_Start` | `032_Position_Done` | `032_WorldLocal_Demo` ★ |
| 033 | `033_Transform_Start` | `033_Transform_Done` | `032_WorldLocal_Demo` 재사용 |
| 034 | `034_Component_Start` | `034_Component_Done` | `034_Component_Demo` |
| 035 | `035_Playground_Start` | `035_Playground_Done` | — |

---

## ★ `032_WorldLocal_Demo` — 032·033의 핵심 시연

**설명 없이 이 씬부터 연다.** 사각형 두 개가 화면상 같은 자리에 겹쳐 있다.

```
--- WorldOrigin (0,0) ---   월드 원점 표식 (회색 원)
A_NoParent                  Position (3, 2)   ← 부모 없음
B_Parent                    Position (3, 2)
└── B_Child                 Position (0, 0)   ← 부모 있음. 그런데 실제 자리는 (3,2)
```

| 클릭하면 | Inspector Position |
|---|---|
| `A_NoParent` | **`(3, 2)`** |
| `B_Child` | **`(0, 0)`** |

**같은 자리인데 숫자가 다르다.** 이걸 먼저 보여주고 이름을 붙인다.

> 💬 "차이는 하나예요. **부모가 있느냐 없느냐.**"
> 💬 "**Inspector의 Position은 부모가 있으면 부모 기준, 없으면 월드 기준입니다.**"

`B_Parent`의 Position X를 `6`으로 바꿔 보면 자식이 따라가는데 **자식 숫자는 그대로 `(0,0)`** 이다.

> 🔑 038회차에 `transform.position` 과 `transform.localPosition` 이 나온다.
> 그때 처음 들으면 늦다. 여기서 이름을 붙여두면 그건 **오늘 배운 것의 코드 버전**이 된다.

---

## 씬 규격 (새로 만들 때)

| 항목 | 값 |
|---|---|
| 카메라 | Orthographic, Clear Flags = Solid Color |
| 배경색 | `RGB(0.13, 0.14, 0.18)` |
| 카메라 위치 | `(0, 0, -10)` |
| 조명 | **넣지 않는다** |

> ⚠️ **Directional Light 를 넣지 않는다.** 이 프로젝트의 스프라이트는
> `Universal Render Pipeline/2D/Sprite-Unlit-Default` 셰이더를 쓰므로 조명의 영향을 전혀 받지 않는다.
> `NewSceneSetup.DefaultGameObjects` 로 씬을 만들면 3D 카메라와 함께 딸려 오는데,
> Hierarchy에 정체불명 오브젝트만 하나 늘고 학생이 혼란스러워한다.

## 슬라이드 이미지와의 관계

`docs/04_배포자료/슬라이드/` 의 PPT 는 **`_Done` 씬을 1920×1080 으로 렌더한 이미지**를 쓴다.
씬을 고쳤으면 이미지도 다시 뽑아야 한다 — 절차는 슬라이드 폴더의 README 참고.

---

## 13주차 (061–065) — 미니게임 ②③ 완주 (Phase 4)

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 061 | `061_Lives_Start` | `061_Lives_Done` | `BreakoutManager` (수정) |
| 062 | `062_Polish_Start` | `062_Polish_Done` | — (개조·시연) |
| 063 | `063_Survival_Start` | `063_Survival_Done` | `EnemyChaser` |
| 064 | `064_AutoFire_Start` | `064_AutoFire_Done` | `AutoShooter` · `SurvivalManager` |
| 065 | `065_Survival_Start` | `065_Survival_Done` | — (완성·시연) |

카메라 규격은 위와 같다. **13주차도 전부 `orthographicSize = 6`.**

### 새로 생긴 것

| 무엇 | 경로 |
|---|---|
| `EnemyChaser` · `AutoShooter` · `SurvivalManager` | `Scripts/MiniGame/` |
| `Chaser` 프리팹 | `Prefabs/Enemy/Chaser.prefab` — Tag `Enemy` · Trigger · `Health 20` |
| `EnemySpawner.SpeedUp()` | 웨이브. `SurvivalManager` 가 밖에서 부르므로 `public` |
| `EnemySpawner` 원형 스폰 | `spawnAroundCircle` 체크 + `spawnRadius` |
| `Health.Current` / `Health.Max` | 읽기 전용. 체력바(Phase 7)와 064 도전 미션용 |

### 시작 / 완성이 실제로 다른 곳

| 회차 | Start | Done |
|---|---|---|
| 061 | 060 상태 — 공이 씬에 놓여 있고 **매니저 없음** | `BreakoutManager` + HUD + 목숨 3 |
| 062 | 061_Done 과 같음 | 같음 (개조 회차) |
| 063 | 플레이어 + 스포너 — **적이 안 쫓아온다** | 같음 (`EnemyChaser` 는 프리팹에) |
| 064 | 063_Done 과 같음 — **총이 없다** | `AutoShooter` + `SurvivalManager` + HUD |
| 065 | 064_Done 과 같음 | 같음 (완성·시연 회차) |

> `BreakoutManager.cs` · `EnemySpawner.cs` 도 회차마다 자라나는 파일이라 저장소에는 최종본만 있다.
> 회차별 중간 상태는 강의안 코드 블록이 정본 — `Bullet.cs` 와 같은 처리다.

### ★ 발견해서 고친 것 — 첫 블록 하나가 점수에 안 잡혔다

처음 구현은 `CheckClearRoutine` 의 `while` 안에서 첫 블록 개수를 기록했다.
그런데 **0.5초를 기다리는 사이에 깨진 블록이 점수에 안 잡혔다.**

```
수정 전: 블록 11개 파괴 → 점수 100 (10개분)
수정 후: 블록 1개 파괴  → 점수 10  (정확)
```

고친 방법은 코루틴 첫 줄의 **`yield return null;`** 이다.

- 코루틴 시작 즉시 세면 `BrickSpawner.Start` 가 아직 안 돌았을 수 있다 → 블록 0개로 세어진다
- **한 프레임만 기다리면** 그 프레임의 `Start` 가 전부 끝나 있다

> 🔑 051에서 "이런 것도 있다" 로 배운 `yield return null` 이 **없으면 값이 틀리는 첫 자리**다.
> 061회차 강의안에 이 경위를 실측값과 함께 넣어 두었다.

### Build Settings 에 추가로 등록한 씬

```
061_Lives_Done  062_Polish_Start  062_Polish_Done
064_AutoFire_Done  065_Survival_Start  065_Survival_Done
```

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 씬 | 확인한 것 | 실측 |
> |---|---|---|
> | `061_Lives_Done` | 목숨이 **한 번만** 깎인다 | 공 소멸 후 `목숨 2` (3→2), `isRespawning` 동작 |
> | `061_Lives_Done` | 1초 뒤 공 재생성 | `t=1.67` 공 0개 → `t=6.74` 공 1개 |
> | `061_Lives_Done` | 점수 정확도 | 수정 후 블록 50→49 에 `점수 10` (1개당 10점) |
> | `061_Lives_Done` | 목숨 0 → 게임오버 | `게임 오버 — R 키로 다시`, `목숨 0`, `timeScale=0` |
> | `065_Survival_Done` | 적이 쫓아온다 | 플레이어와의 거리 `9.80 → 9.60 → 9.44` 로 감소 |
> | `065_Survival_Done` | 자동 발사 | 조작 없이 총알 2~4발이 상시 비행 |
> | `065_Survival_Done` | 적 사망 | Console `사망` 로그 4건, 적 수가 1→0 반복 |
> | `065_Survival_Done` | **웨이브** | `t=14.89` 에 `웨이브 2`, `spawnInterval = 1.85` (2.00−0.15) |
> | `065_Survival_Done` | 게임오버 | `26초 버텼습니다 / 웨이브 3 도달 / R 키로 다시`, `timeScale=0` |
> | 전 씬 | 한글 폰트 | Pretendard 적용, 폰트 경고 0건 |
>
> ✅ **키 입력(WASD · R)은 사용자가 직접 눌러 확인 완료.**

---
