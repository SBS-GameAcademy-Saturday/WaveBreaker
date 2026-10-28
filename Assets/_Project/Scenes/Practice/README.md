# 실습 씬 (046–050 · 10주차)

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

## 10주차 (046–050) — 프리팹과 동적 생성 (Phase 3)

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 046 | `046_Prefab_Start` | `046_Prefab_Done` | — (전부 Inspector) |
| 047 | `047_Instantiate_Start` | `047_Instantiate_Done` | `PlayerShooter` · `Bullet` |
| 048 | `048_Destroy_Start` | `048_Destroy_Done` | `EnemySpawner` |
| 049 | `049_GetComponent_Start` | `049_GetComponent_Done` | `Bullet` (수정) |
| 050 | `050_Health_Start` | `050_Health_Done` | `Health` |

카메라 규격은 위와 같다. **10주차도 전부 `orthographicSize = 6`.**

### 프리팹 2종

| 프리팹 | 경로 | 구성 |
|---|---|---|
| `Bullet` | `Prefabs/Projectile/` | Scale 0.3 · `Circle Collider 2D`(**Is Trigger**) · `Rigidbody 2D`(Gravity 0) · Layer `Bullet` · Sorting `Effect` · `Bullet.cs` |
| `Enemy` | `Prefabs/Enemy/` | Scale 1 · `Circle Collider 2D` · Tag **`Enemy`** · Sorting `Enemy` · `Health.cs` |

> **`Enemy` 에는 `Rigidbody 2D` 가 없다.** 043의 규칙대로 **둘 중 하나만** 있으면 되고,
> 움직이는 쪽인 총알이 갖고 있다. 수업에서 이걸 짚으면 9주차 복습이 된다.

### ⚠️ 047~050 은 스크립트 하나가 회차마다 자라난다

`Bullet.cs` 는 047에서 만들어져 048(수명·삭제) · 049(`GetComponent`·`null`) · 050(`Health`)
까지 **같은 파일이 계속 고쳐진다.** 저장소에는 **050 완성본만** 들어 있다.

그래서 `047_Done` · `048_Done` · `049_Done` 을 열어 Play 하면 **그 회차보다 앞선 동작**을 한다
(예: 047_Done 에서도 총알이 2초 뒤 사라지고 몬스터 체력이 깎인다).

**회차별 중간 상태는 각 회차 강의안의 코드 블록이 정본이다.** 수업에서는 강의안 코드를 그대로
치면서 진행하고, `_Done` 씬은 **씬 구성(오브젝트 배치·참조 연결)의 정답**으로만 쓴다.

> 039회차와 같은 처리다. 씬을 쪼갤 수 없는 대상(스크립트 한 파일)은 **git 커밋과 강의안**이
> 회차 경계를 갖는다.

### 시작 씬에 미리 넣어둔 것

| 회차 | 미리 있는 것 | 이유 |
|---|---|---|
| 046 | **프리팹이 아닌** 몬스터 10개 | 프리팹으로 만드는 게 학습 대상이다 |
| 047 | `Player`(042 완성), `Enemy` 인스턴스 5개 | `FirePoint` 와 `PlayerShooter` 는 학생이 만든다 |
| 048 | 047 완성 상태 | 총알이 안 사라지는 문제를 겪는 게 도입이다 |
| 049 | 048 완성 상태 + `EnemySpawner` | 드래그를 없애는 게 학습 대상이다 |
| 050 | 049 완성 상태 + `Enemy_Empty_NoHealth` | `null` 대비가 실제로 필요한 대상 |

> **`Enemy_Empty_NoHealth`** — Tag 만 `Enemy` 이고 `SpriteRenderer` 도 `Health` 도 없는 오브젝트다.
> 049·050 에서 **`null` 체크를 빼면 여기서 바로 `NullReferenceException` 이 난다.**
> 화면에는 안 보이지만 `(4.5, 1.5)` 에 있다. 총구 정면(x=0)에서 비켜 놓았다 — 정면에 두면
> 총알이 전부 여기서 막혀 뒤쪽 몬스터를 못 맞힌다.

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 씬 | 확인한 것 | 실측 |
> |---|---|---|
> | `050_Health_Done` | 총알 3발 → 체력 30 소진 | Console `남은 체력: 20` → `10` → `0` → `Enemy 사망` |
> | `050_Health_Done` | 죽은 몬스터가 씬에서 사라짐 | Enemy 태그 오브젝트 6 → 5개, x=0 이 사라짐 |
> | `050_Health_Done` | 총알 수명 · 피격 삭제 | 발사 뒤 `살아있는 총알 = 0` |
> | `050_Health_Done` | `Health` 없는 Enemy 를 쏴도 안전 | 콘솔 로그 **0건** (예외 없음), 대상은 그대로 남음 |
> | `046_Prefab_Done` | 원본 수정 반영 + Override | 원본을 초록으로 바꾸니 **9개는 따라오고 1개(`Enemy_Override`)는 유지** |
>
> ✅ **스페이스 발사(`PlayerShooter`)도 사용자가 직접 눌러 확인 완료 (2026-09-02).**
> 자동 검증은 `Bullet.prefab` 을 `FirePoint` 자리에 직접 `Instantiate` 해서 했다 —
> `PlayerShooter` 가 하는 일과 같은 코드다. 키 입력 자체는 도구로 못 재서 수동으로 확인했다.

---

