# 실습 씬 (031–045)

주차별로 아래에 이어 붙인다. 회차마다 **시작 / 완성** 쌍으로 세팅돼 있다. 강사 시연이 필요한 회차는 **Demo** 씬이 따로 있다.

| 회차 | 시작 (학생) | 완성 (정답) | 시연 (강사) |
|---|---|---|---|
| 031 | `031_Inspector_Start` | `031_Inspector_Done` | `031_Inspector_Demo` |
| 032 | `032_Position_Start` | `032_Position_Done` | `032_WorldLocal_Demo` ★ |
| 033 | `033_Transform_Start` | `033_Transform_Done` | `032_WorldLocal_Demo` 재사용 |
| 034 | `034_Component_Start` | `034_Component_Done` | `034_Component_Demo` |
| 035 | `035_Playground_Start` | `035_Playground_Done` | — |

---

## 7주차 (031–035) — 왜 시작 씬을 미리 주는가

**`File → New Scene` 을 시키면 3D 기본 카메라(원근 + 스카이박스)가 나온다.**
2D 프로젝트인데 화면이 이상해지고, 노베이스는 첫 회차부터 "왜 이렇게 보이죠"에 걸린다.

시작 씬은 전부 **Orthographic 카메라 + 단색 배경**으로 맞춰 두었다. 학생은 열고 바로 만들면 된다.

| 회차 | orthographicSize | 시작 씬에 미리 있는 것 |
|---|---|---|
| 031 | 5 | 카메라만 |
| 032 | 6 | 카메라만 |
| 033 | 5 | 카메라 + **흰 Square 4개** (계층·크기·색 전부 비어 있음) |
| 034 | 7 | 카메라만 |
| 035 | 7 | 카메라만 |

> 033만 Square 4개를 미리 놓아 둔다. 그 회차의 학습 대상은 **계층과 좌표**이지
> 오브젝트를 만드는 일이 아니다. 만드는 데 시간을 쓰면 정작 부모자식을 못 한다.
>
> 다만 **색과 Scale은 넣지 않는다.** 넷 다 똑같은 흰 1×1 사각형이다.
> 033은 Scale을 배우는 회차이고, 색을 고르는 것도 실습 항목이다. 미리 넣으면 학생이 할 일이 사라진다.

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

## 8주차 (036–040) — 스크립트가 붙는 씬

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 036 | `036_Script_Start` | `036_Script_Done` | `HelloUnity` |
| 037 | `037_SerializeField_Start` | `037_SerializeField_Done` | `Spinner` · `Bouncer` |
| 038 | `038_Move_Start` | `038_Move_Done` | `Mover` |
| 039 | `039_DeltaTime` (하나) | — | 위 셋 전부 |
| 040 | `040_Input_Start` | `040_Input_Done` | `PlayerMove` |

> **039는 씬을 나누지 않는다.** 그 회차는 씬이 아니라 **스크립트를 고치는** 회차다.
> 진행 전후는 git 커밋 경계로 본다 — `[036-038]` 커밋이 고치기 전, `[039]` 커밋이 고친 뒤다.

### ⚠️ 040은 자동 검증이 안 된다

`PlayerMove`는 수업 방침대로 **구 Input Manager**(`Input.GetAxisRaw`)를 쓴다.
그런데 `uloop simulate-keyboard`는 **Input System에만** 키를 주입한다. 실측:

```
D 키를 눌러둔 상태에서
  legacy  Input.GetKey(D) = False     GetAxisRaw("Horizontal") = 0.0
  new     Keyboard.current.dKey.isPressed = True
```

**시뮬레이션으로는 캐릭터가 움직이지 않는다.** 040의 이동은 사람이 직접 키를 눌러 확인해야 한다.
입력을 뺀 나머지(참조 연결 · `SetActive` 토글 · `[ContextMenu]`)는 자동 검증된다.

> ✅ **수동 확인 완료 (2026-09-02).** `040_Input_Done` 을 Play 하고 직접 WASD 를 눌러
> 캐릭터가 움직이는 것을 확인했다. 도구로는 못 재지만 실제 동작에는 문제가 없다.
> **042 이후의 `PlayerPhysicsMove` · `PlayerShooter` 도 같은 방식으로 확인했다.**
>
> 씬을 고치거나 `PlayerMove` 를 수정한 뒤에는 **이 확인을 다시 해야 한다.** 자동 검증이 안 되므로
> CI 나 스크립트가 잡아주지 않는다.

---

## 9주차 (041–045) — 물리와 충돌 (Phase 3)

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 041 | `041_Rigidbody_Start` | `041_Rigidbody_Done` | — (전부 Inspector) |
| 042 | `042_PhysicsMove_Start` | `042_PhysicsMove_Done` | `PlayerPhysicsMove` |
| 043 | `043_Collider_Start` | `043_Collider_Done` | — (전부 Inspector) |
| 044 | `044_Trigger_Start` | `044_Trigger_Done` | `Collector` |
| 045 | `045_Layer_Start` | `045_Layer_Done` | — (전부 Inspector) |

카메라 규격은 위와 같다. **9주차는 전부 `orthographicSize = 6`.**

### 시작 씬에 미리 넣어둔 것 (그리고 왜)

| 회차 | 미리 있는 것 | 이유 |
|---|---|---|
| 041 | 흰 Square 1개 | `Rigidbody 2D` 붙이는 게 학습 대상이다 |
| 042 | `Player`(040 `PlayerMove` + `Box Collider 2D`), 벽, `Item` | **"충돌 부품이 있는데도 통과한다"** 를 보여주는 게 도입이다 |
| 043 | `Player`(042 완성), **Collider 없는** 회색 Square | Collider 를 붙이는 게 학습 대상이라 일부러 비웠다 |
| 044 | `Player`, 코인 3개(`Is Trigger` 켬, **Tag 없음**), 벽 | **Tag 를 만들고 붙이는 것**이 그 회차의 핵심이라 비웠다 |
| 045 | 배경, `Player`, 벽, 겹쳐 있는 총알 20개 | Layer 를 만들고 붙이는 게 학습 대상이다 |

### ⚠️ Tag · Layer · Sorting Layer 는 씬이 아니라 프로젝트 설정이다

아래는 `ProjectSettings/TagManager.asset` 에 **이미 등록돼 있다.** 완성 씬이 동작하려면 필요하기 때문이다.

| | 등록된 것 |
|---|---|
| Tag | `Coin`, `Wall` |
| Layer | `Bullet`, `Wall` |
| Sorting Layer | `Background`, `Ground`, `Enemy`, `Player`, `Effect` |

**학생의 `Snapshot_P2` 에는 없다.** 그래서 044·045 수업에서 **만드는 과정은 반드시 같이 한다.**

### ⚠️ Layer Collision Matrix 는 저장하지 않았다

`Physics 2D → Layer Collision Matrix` 도 프로젝트 설정이라 **씬마다 다르게 가질 수 없다.**
끈 상태로 저장하면 `045_Layer_Start`(총알끼리 부딪히는 걸 보여주는 씬)가 망가진다.

**그래서 저장소는 전부 켜진 기본 상태다.** `045_Layer_Done` 을 시연하려면
수업 중에 `Bullet × Bullet` 과 `Bullet × Player` 를 **직접 끄고**, 끝나면 되돌린다.

### ⚠️ 042 이후 이동은 자동 검증이 안 된다

`PlayerPhysicsMove` 도 040 과 같이 **구 Input Manager**(`Input.GetAxisRaw`)를 쓴다.
`uloop simulate-keyboard` 는 Input System 에만 키를 주입하므로 **시뮬레이션으로는 안 움직인다.**

검증은 `PlayerPhysicsMove` 를 잠시 끄고 `rb.linearVelocity` 를 직접 넣어 밀어서 했다.

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 씬 | 확인한 것 | 실측 |
> |---|---|---|
> | `041_Rigidbody_Done` | Gravity Scale 0 / 1 / 3 의 낙하 차이 | 6.4초 후 `y = 3.000` / `-201.06` / `-609.18` (**약 3배**) |
> | `044_Trigger_Done` | 코인 3개 획득 + 벽 충돌 | Console 에 `1개째`·`2개째`·`3개째 먹었다` + `부딪혔다: Wall`, 코인 3개 전부 비활성 |
> | `044_Trigger_Done` | 벽에서 멈춤 | 벽(x=6, 반폭 0.5) 앞 `player.x = 4.99`, `v = 0.00` |
> | `045_Layer_Start` | 총알끼리 서로 밀어냄 | 중심 반경 `0.35` → `0.76` 로 벌어짐 |
>
> ✅ **WASD 실제 입력은 사용자가 직접 눌러 확인 완료 (2026-09-02).** 도구로는 못 재지만 실제 동작에는 문제가 없다.
> 씬이나 `PlayerPhysicsMove` 를 고치면 이 확인을 다시 한다.

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

## 11주차 (051–055) — 코루틴 · 그림 · 미니게임 ① (Phase 3 마무리)

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 051 | `051_Coroutine_Start` | `051_Coroutine_Done` | `CoroutineDemo` |
| 052 | `052_Spawn_Start` | `052_Spawn_Done` | `EnemySpawner` (코루틴으로 수정) |
| 053 | `053_Sprite_Start` | `053_Sprite_Done` | — (전부 임포트 설정) |
| 054 | `054_Animator_Start` | `054_Animator_Done` | — (Animator 컴포넌트) |
| 055 | `055_Dodge_Start` | `055_Dodge_Done` | — (있는 것만 조합) |

카메라 규격은 위와 같다. **11주차도 전부 `orthographicSize = 6`.**

### 시작 / 완성이 실제로 다른 곳

| 회차 | Start | Done |
|---|---|---|
| 051 | 빈 `CoroutineDemo` 오브젝트만 | `CoroutineDemo` 스크립트가 붙어 있다 |
| 052 | 몬스터 5마리를 **손으로 놓아 둠** | **미리 놓은 몬스터가 없다.** 전부 코루틴이 만든다 |
| 053 | 플레이어가 **흰 네모** | 플레이어가 **그림** |
| 054 | 그림만 (서 있다) | **`Animator`** 가 붙어 걷는다 |
| 055 | 플레이어 + `Health` | **`ObstacleSpawner`** 추가 — 피하기 게임이 돌아간다 |

### 이번 주에 늘어난 에셋

| 무엇 | 경로 |
|---|---|
| 스프라이트 3종 | `Assets/_GameAssets/Sprites/` (아래 ⚠️ 참고) |
| 애니메이션 클립 2종 | `_GameAssets/Animations/Player_Walk.anim` (10fps) · `Enemy_Walk.anim` (6fps) |
| 컨트롤러 2종 | `Player.controller` · `Enemy.controller` — **상태 하나뿐**. 전환은 Phase 7 |
| `Obstacle` 프리팹 | `Assets/_Project/Prefabs/Enemy/Obstacle.prefab` |

### ★ `Obstacle` 프리팹 — 새 스크립트 없이 만든 장애물

055의 설계 의도가 이 프리팹 하나에 들어 있다. **총알에 쓰던 `Bullet` 을 그대로 쓴다.**

| 항목 | 값 | 어느 회차 것 |
|---|---|---|
| `Rigidbody 2D → Gravity Scale` | **`1`** — 중력이 떨어뜨린다 | **041** |
| `Circle Collider 2D → Is Trigger` | 켬 | 043 |
| `Bullet → Speed` | **`0`** — 스스로 안 움직인다 | 047 |
| `Bullet → Life Time` | `5` | 048 |
| `Bullet → Damage` | `10` | 050 |
| `Bullet → Target Tag` | **`Player`** | 055에 추가한 칸 |

`Bullet.cs` 에 `targetTag` 를 열어둔 것이 이번 주의 유일한 코드 변경이다. 기본값이 `"Enemy"` 라
047~050 수업 코드와 동작이 같다.

> 💬 수업에서 이 표를 그대로 띄운다. **"떨어지는 장애물 = 부딪히면 상대 체력을 깎고 사라지는 것.
> 그거 우리 총알이랑 똑같지 않나요?"**

### ⚠️ 스프라이트는 강사용 임시 플레이스홀더다

**Kenney 팩은 아직 저장소에 없다.** 11주차를 진행할 수 있도록 코드로 생성한 자리 표시 그림이다.
자세한 내용과 교체 절차는 [에셋-리소스.md](../../../../docs/00_기획/에셋-리소스.md) 의
"현재 저장소 상태" 절 참고.

임포트 설정은 053에서 가르치는 값 그대로다 — **PPU 32 · Filter Mode Point · Compression None**.

### ⚠️ 052 도 스크립트 하나가 회차마다 자라난다

`EnemySpawner.cs` 는 048(E 키)에서 052(코루틴)로 **같은 파일이 고쳐진다.** 저장소에는 052 완성본만
있으므로 **10주차의 `048_Destroy_Done` 을 열어도 자동 스폰이 돈다.** 회차별 중간 상태는
각 회차 강의안의 코드 블록이 정본이다 — `Bullet.cs` 와 같은 처리다.

### ⚠️ 055 의 좌우 이동 제한은 넣지 않았다

미니게임 ①은 플레이어가 **좌우로만** 움직여야 하는데, 저장소의 `PlayerPhysicsMove` 는 042 그대로
상하좌우가 다 된다. **그 한 줄을 고치는 것이 055의 학생 미션**이라 일부러 두었다.

```csharp
rb.linearVelocity = new Vector2(h, 0f) * moveSpeed;   // v 를 빼면 된다
```

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 씬 | 확인한 것 | 실측 |
> |---|---|---|
> | `051_Coroutine_Done` | 카운트다운이 **간격을 두고** 찍힌다 | `t=0.99` 에 로그 2건 → `t=7.81` 에 4건 (`3` `2` `1` `발사!`). yield 가 빠졌다면 t≈0 에 4건이 몰린다 |
> | `052_Spawn_Done` | 2초 간격 자동 스폰 | `t=8.55` 에 몬스터 **5마리** (0·2·4·6·8초 = 5회, 공식대로) |
> | `054_Animator_Done` | 프레임이 실제로 넘어간다 | 플레이어 `Player_Walk_2 → _3 → _0`, 스폰된 `Enemy(Clone)` `_0 → _1` |
> | `055_Dodge_Done` | 장애물이 중력으로 떨어진다 | 스폰 y=6 → `t=1.62` 에 y=4.18 |
> | `055_Dodge_Done` | 맞으면 체력이 깎이고 죽는다 | Console `Player 남은 체력: 20` → `10` → `0` → `Player 사망`, 플레이어가 씬에서 사라짐 |
>
> ✅ **WASD·스페이스 입력은 사용자가 직접 눌러 확인 완료 (2026-09-02).** 구 Input Manager 라
> `uloop simulate-keyboard` 로는 못 재지만 실제 동작에는 문제가 없다.

---

## 12주차 (056–060) — 미니게임 ①② (Phase 4)

| 회차 | 시작 (학생) | 완성 (정답) | 붙는 스크립트 |
|---|---|---|---|
| 056 | `056_Score_Start` | `056_Score_Done` | `DodgeGameManager` |
| 057 | `057_GameOver_Start` | `057_GameOver_Done` | `DodgeGameManager` (수정) |
| 058 | `058_Bricks_Start` | `058_Bricks_Done` | `BrickSpawner` |
| 059 | `059_Ball_Start` | `059_Ball_Done` | `Ball` |
| 060 | `060_Breakout_Start` | `060_Breakout_Done` | `Paddle` · `BreakoutManager` |

카메라 규격은 위와 같다. **12주차도 전부 `orthographicSize = 6`.**

### 새로 생긴 것

| 무엇 | 경로 |
|---|---|
| 미니게임 스크립트 5종 | `Assets/_Project/Scripts/MiniGame/` |
| `Brick` · `Ball` 프리팹 | `Prefabs/Enemy/Brick.prefab` · `Prefabs/Projectile/Ball.prefab` |
| `BouncyBall` (Physics Material 2D) | `Assets/_Project/Materials/` — `Friction 0` · `Bounciness 1` |
| **Pretendard 폰트 + TMP 폰트 에셋** | `Assets/_GameAssets/Fonts/` (아래 ⚠️ 참고) |
| TMP Essentials | `Assets/TextMesh Pro/` |

> **`Scripts/MiniGame/` 을 새로 만들었다.** 미니게임 전용 코드라 본 프로젝트 폴더(`Player`,
> `Enemy`, `Weapon`, `Manager`)와 섞지 않는다. Phase 5 에서 본 프로젝트를 시작할 때
> 이 폴더는 건드리지 않고 그대로 둔다.

### ⚠️ 한글 폰트를 넣어야 했다

TextMeshPro 기본 폰트(LiberationSans)에는 **한글 글리프가 없다.** `점수 0` 을 띄우는 순간
`The character with Unicode value 시 was not found in the font asset` 경고가 쏟아지고
글자가 빈칸으로 나온다.

**Pretendard(SIL OFL 1.1)** 를 넣고 TMP 폰트 에셋(`Pretendard SDF`, **Atlas Population Mode
= Dynamic**)을 만들어 **TMP 기본 폰트로 지정**했다. 자세한 내용은
[Fonts/README.md](../../_GameAssets/Fonts/README.md).

> 💬 수업에서는 **056회차 준비물**로 다룬다. 학생 프로젝트에도 같은 작업이 필요하다.

### 시작 / 완성이 실제로 다른 곳

| 회차 | Start | Done |
|---|---|---|
| 056 | 055 구성 그대로 (**Canvas 없음**) | Canvas + `ScoreText` + `DodgeGameManager` |
| 057 | **056_Done 과 같은 구성** | 같음 + **Build Settings 등록** |
| 058 | 빈 `BrickSpawner` 오브젝트만 | 블록 5행 10열 · 5색 |
| 059 | 058_Done 그대로 (블록만) | **벽 3개 + 튀는 공** |
| 060 | 059_Done 그대로 | **패들 + DeadZone + 결과 UI + 매니저** |

> **056·057 의 Start/Done 이 겹치는 이유**: `DodgeGameManager.cs` 도 회차마다 자라나는
> 한 파일이라 저장소에는 057 완성본만 있다. 그래서 `056_Score_Done` 을 열어도 게임오버가 동작한다.
> `Bullet.cs` · `EnemySpawner.cs` 와 같은 처리다 — **회차별 중간 상태는 강의안 코드 블록이 정본**이다.

### Build Settings 에 등록한 씬

`SceneManager.LoadScene` 은 **빌드 목록에 있는 씬만** 열 수 있다. 아래 5개를 등록해 두었다.

```
056_Score_Done  057_GameOver_Start  057_GameOver_Done  060_Breakout_Start  060_Breakout_Done
```

> 057회차에서 **이 에러를 일부러 재현**하고 다 같이 읽는다. Phase 0 의 "에러 읽는 습관" 자리다.
> ```
> Scene 'xxx' couldn't be loaded because it has not been added to the Build Settings
> ```

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 씬 | 확인한 것 | 실측 |
> |---|---|---|
> | `058_Bricks_Done` | 격자 배치 · 가운데 정렬 · 행별 색 | 블록 **50개**, x 범위 `-5.40 ~ 5.40`, **중심 0.00**, 서로 다른 색 **5개** |
> | `057_GameOver_Done` | 점수 갱신 | `t=0.99` 에 `점수 1`, `t=9.51` 에 `점수 9` |
> | `057_GameOver_Done` | 죽으면 멈춤 | 장애물 3대 후 `GameOverText(on)` · `player=죽음` · `timeScale=0`, 점수 10에서 정지 |
> | `060_Breakout_Done` | 공 속도 유지 | `t=1.06`·`t=1.16` 모두 **속도 8.000** (`.normalized * speed`) |
> | `060_Breakout_Done` | 블록 파괴 | `t=1.06` 에 남은 블록 **49** (한 개 깨짐) |
> | `060_Breakout_Done` | 게임오버 | 공이 DeadZone 통과 → `ResultText = "게임 오버 — R 키로 다시"`, `timeScale=0` |
> | `060_Breakout_Done` | 클리어 | 블록 0 → 0.5초 코루틴이 감지 → `ResultText = "클리어! — R 키로 다시"`, `timeScale=0` |
> | 전 씬 | 한글 폰트 | Pretendard 적용 후 **폰트 경고 0건** |
>
> 클리어 검증은 `DeadZone` 을 **플레이 세션에서만** 끄고 했다(디스크의 씬은 그대로다).
> 공이 1.4초면 바닥에 닿아 게임오버가 먼저 나기 때문이다.
>
> ✅ **키 입력(WASD · 스페이스 · R)은 사용자가 직접 눌러 확인 완료.**

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

## 14주차 (066–070) — Phase 5부터는 연습 씬을 만들지 않는다

**Phase 5 이후 실습은 `Assets/_Project/Scenes/Game.unity` 하나에서만 진행한다.**
회차마다 Start / Done 씬을 만들지 않는다. 씬 하나가 65회차 동안 자란다.

| 항목 | Phase 4까지 | Phase 5부터 |
|---|---|---|
| 씬 | 회차마다 새로 | `Game.unity` 하나 |
| 회차 경계 | Start / Done 씬 쌍 | git 커밋 + 강의안 코드 블록 |
| 완성본 배포 | Done 씬 | 스냅샷 5회차마다 (`Snapshot_P5_Map` 등) |

### `Game.unity` 070회차 시점 구성

| 오브젝트 | 부품 |
|---|---|
| `Main Camera` | Orthographic Size 5 · `CameraFollow` (target = Player, smoothTime 0.15) |
| `GameManager` | `GameManager` (`GameState` 싱글톤) |
| `Player` | SpriteRenderer · Rigidbody2D(중력 0, 회전 고정) · CircleCollider2D · `PlayerInput` · `PlayerController` · `PlayerHealth` |
| `Ground` | `InfiniteGround` (tileSize 20, gridCount 3) + 타일 9장 자식 |
| `Enemy` | SpriteRenderer · Rigidbody2D(중력 0) · CircleCollider2D · `ChargerEnemy` |

> Build Settings 에 `Assets/_Project/Scenes/Game.unity` 를 등록해 두었다.

> ⚠️ **바닥 타일 그림은 임시다.** `Assets/_GameAssets/Sprites/Environment/GroundTile.png`
> (64×64, PPU 32, Point, 무압축) 를 코드로 만들어 넣었다. 정식 리소스가 오면
> [리소스-교체-가이드](../../../../docs/00_기획/리소스-교체-가이드.md) 대로 같은 이름으로 덮어쓴다.

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 무한 맵 — 무작위 방향 15회 이동 | 카메라 시야 441점 중 **바닥 없는 지점 0** |
> | 무한 맵 — 대각선 이동 8회 연속 | 441점 중 **0** |
> | 격자 유지 | 타일 좌표 `% 20` 이 **전부 0**, 타일 수 9 유지 |
> | 좌표 (213, −147) 로 순간이동 | 타일이 즉시 3×3 격자로 재배치됨 |
> | 카메라 추적 | 플레이어 `x=9.75` 일 때 카메라 `x=9.39` (SmoothDamp 지연) |
> | `ChargerEnemy.Start` | `Enemy : 돌진형 등장 (체력 10)` — `base.Start()` 동작 |
> | 충돌 피해 | `Enemy : 돌진! 3 피해` → `플레이어 : -3  (남은 체력 17)` |
> | `IDamageable` 조회 | `TryGetComponent<IDamageable>` = True, 실제 형 `ChargerEnemy` |
> | `Enemy` 사망 | −4 3회 → `남은 체력 -2` → `Enemy 사망` → 오브젝트 제거 |
> | `abstract` 부착 거부 | `Can't add script behaviour 'Enemy'. The script class can't be abstract!` |
>
> ⚠️ **WASD 키 입력은 미실측.** 레거시 Input Manager 라 에디터에서 키를 흉내낼 수 없어,
> `PlayerController` 를 끄고 `linearVelocity` 를 직접 넣어 이동을 검증했다.
> `PlayerInput` 자체는 040·067과 같은 `Input.GetAxisRaw` 방식이며 사용자가 이미 동작을 확인했다.

### ★ 발견해서 고친 것 — 대각선으로 달리면 맵에 구멍이 났다

처음 구현은 골드메탈식으로 **타일마다 Trigger 를 달고**, 플레이어의 `Area` 가 타일에서
`OnTriggerExit2D` 로 벗어날 때 **더 많이 벌어진 축으로만** 60 옮기는 방식이었다.

```
대각선 이동 후: 카메라 시야 441점 중 273점에 바닥이 없음
타일 좌표     : (40,40) (120,100) (140,40) (100,60) (60,60) ...  ← 격자 이탈
```

원인은 **한 축만 옮기는 것**이다. 대각선으로 나가면 두 축이 거의 동시에 경계를 넘는데
한 축만 처리되고, 남은 축은 다시 `Exit` 가 걸리지 않아 영영 보정되지 않는다.

고친 방법은 **Trigger 를 버리고 `Ground` 부모에서 매 프레임 9장을 검사**하는 것이다.

```csharp
if (diff.x >  half) tile.position += Vector3.left  * span;
if (diff.x < -half) tile.position += Vector3.right * span;
if (diff.y >  half) tile.position += Vector3.down  * span;
if (diff.y < -half) tile.position += Vector3.up    * span;
```

- 가로·세로를 **따로** 보므로 대각선에서도 두 축이 다 처리된다
- 매 프레임 보므로 한 번 어긋나도 다음 프레임에 복구된다
- 타일은 항상 `span`(60)의 배수만큼만 움직여 20 격자가 깨지지 않는다
- 코드도 짧아졌고 `Area` 오브젝트와 `Area` 태그가 필요 없어졌다

> 🔑 069회차 강의안은 **고친 쪽**으로 쓰여 있다. `foreach (Transform tile in transform)` 로
> 자식을 도는 것이 이 회차의 새 문법이다.
