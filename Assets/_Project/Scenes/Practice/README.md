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

---

## 15주차 (071–075) — 몬스터와 스폰

`Game.unity` 하나가 계속 자란다. 연습 씬은 없다.

### `Game.unity` 075회차 시점 구성 (14주차에서 추가된 것)

| 오브젝트 | 부품 |
|---|---|
| `Main Camera / SpawnPoints` | 빈 오브젝트 8개 (반지름 14 원형) — **카메라 자식** |
| `WaveManager` | `WaveManager` (프리팹 3종 · 포인트 8개 · 간격 2→0.4 · 웨이브 15초) |
| `Player` | `PlayerAttack` 추가 (반경 3 · 피해 4 · 쿨다운 0.4) |
| `HUD` | Canvas + TMP + `HUDView` (웨이브 / 처치) |
| ~~`Enemy`~~ | **제거.** 이제 `WaveManager` 가 만든다 |

### 몬스터 프리팹 3종 — `Assets/_Project/Prefabs/Enemy/`

| 프리팹 | 스크립트 | override | 체력 | 속도 | 색 | 크기 |
|---|---|---|---|---|---|---|
| `Enemy_Charger` | `ChargerEnemy` | `Attack()` | 10 | 2.0 | 빨강 | 1.0 |
| `Enemy_Runner` | `RunnerEnemy` | `Move()` | 4 | 5.5 | 노랑 | 0.85 |
| `Enemy_Tank` | `TankEnemy` | `TakeDamage()` | 30 | 1.1 | 보라 | 1.5 |

셋 다 같은 그림(`Enemy_Base.png`, 회색)을 쓰고 **`Sprite Renderer` 의 `Color` 와 `Scale` 만** 다르다.

### 프로젝트 설정 변경

| 항목 | 값 | 이유 |
|---|---|---|
| Layer 10 | **`Enemy`** 추가 | 몬스터끼리 편 가르기 |
| Physics 2D → Layer Collision Matrix | **`Enemy` × `Enemy` 해제** | 몬스터끼리 서로 때리는 것을 막는다 |

> `ProjectSettings/Physics2DSettings.asset` 의 `m_LayerCollisionMatrix` 에서 레이어 10 마스크가
> `...fbff...` 로 저장돼 있다.

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 몬스터 추적 (071) | 스폰 직후 3마리 속도 `(-2.00, 0.00)` `(0.00, 2.00)` `(1.41, 1.41)` — 크기 2.0 = `moveSpeed` |
> | 러너가 안 꺾는다 (072) | 플레이어를 `(40, 0)` 으로 옮겨도 속도 `(0.00, 5.50)` 그대로 |
> | 돌진형은 꺾는다 (072) | 같은 순간 `(1.76, 0.95)` 로 방향 전환 (크기 2.00) |
> | 탱커 피해 감소 (072) | `Enemy_Tank : 단단하다!  4 → 2` → `남은 체력 28` |
> | 스폰 포인트 (073) | `Main Camera` 자식 8개, 반지름 14 |
> | 웨이브 진행 (074) | 2 → `1.70초` · 3 → `1.40` · 4 → `1.10` · 5 → `0.80` · 6 → `0.50` · 7 → `0.40`(하한) |
> | 종류 증가 (074) | 웨이브 1 = 1가지 · 2 = 2가지 · 3 이상 = 3가지 |
> | 90초 방치 | 적 88마리, **처치 0** — 몬스터끼리 안 싸운다 |
> | 다형성 한 방 (075) | 한 번 `Swing()` → `Charger -4(6)` / `Runner -4(0) 사망` / `Tank 4→2, -2(28)` |
> | 처치 수 (075) | 8회 휘두르기 → `kills 0 → 38`, HUD `웨이브 8   처치 38` |
> | `TryGetComponent<IDamageable>` | 세 종류 전부 True |
>
> ⚠️ **Space · WASD 키 입력은 미실측.** 레거시 Input Manager 라 에디터에서 키를 흉내낼 수 없어
> `PlayerAttack.Swing()` 을 직접 호출해 검증했다. `Update` 안의 키 검사와 쿨다운 분기 자체는 미실측이다.

### ★ 발견해서 고친 것 — 아무도 안 때렸는데 몬스터가 죽었다

74회차 상태로 90초를 돌리자 **처치 수가 38** 이었다. 플레이어는 아무것도 하지 않았다.

원인은 070에서 자랑했던 설계 그대로다.

```csharp
// ChargerEnemy.OnCollisionEnter2D
if (collision.gameObject.TryGetComponent(out IDamageable target))
    Attack(target);        // 몬스터도 IDamageable 이다
```

돌진형이 다른 몬스터를 때리고 있었다. 고치는 방법은 두 가지였다.

| 방법 | 문제 |
|---|---|
| `if (상대가 Enemy면 return)` | 몬스터가 열 종류가 되면 조건을 열 군데 관리해야 한다 |
| **`Enemy` 레이어 + Collision Matrix** | 한 곳. 코드는 한 줄도 안 고친다 |

레이어를 골랐다. 재측정: 같은 조건 90초에 **처치 0**.

> ⚠️ **부작용**: 몬스터끼리 겹쳐서 지나간다. 뱀서라이크에서는 흔한 처리라 그대로 둔다.
> 073 강의안에 이 부작용까지 적어두었다.

### ★ 발견해서 고친 것 — 몬스터 3종이 색으로 구분이 안 됐다

처음에는 기존 `Enemy_Walk.png`(빨간 몬스터)에 `Color` 를 곱해 3종을 만들려 했다.
**빨간 그림에 노란색을 곱해도 빨간색**이라 러너와 돌진형이 화면에서 구분되지 않았다.

`Enemy_Walk.png` 의 첫 프레임을 **회색조로 변환한 `Enemy_Base.png`** 를 새로 만들어
Phase 5 몬스터 전용 그림으로 삼았다. 회색에 색을 곱하니 빨강·노랑·보라가 제대로 나온다.
(054의 애니메이션은 기존 `Enemy_Walk.png` 를 계속 쓴다. 건드리지 않았다.)

---

## 16주차 (076–080) — 무기와 코어 루프 · Phase 5 종료

`Game.unity` 하나가 계속 자란다. 연습 씬은 없다.

### `Game.unity` 080회차 시점 구성 (15주차에서 바뀐 것)

| 오브젝트 | 부품 |
|---|---|
| `Player` | `PlayerAttack` **제거** (076에서 뗀다) · `AutoGun` 추가 |
| `Player/Blades` | 빈 오브젝트 + `MeleeRing` (칼 3자루 · 반지름 2 · 초당 180도) |
| `Player` `PlayerHealth` | 무적시간 `0.6`, `sprite` 연결 (무적 동안 반투명) |
| `HUD/CenterText` | 게임오버 문구 (평소엔 비활성) |
| `GameManager` | `Update` 에서 `R` 재시작 · `ChangeState` 가 `Time.timeScale` 제어 |
| `ChargerEnemy` | `OnCollisionEnter2D` → **`OnCollisionStay2D`** |

### 무기 프리팹 — `Assets/_Project/Prefabs/Weapon/`

| 프리팹 | 스크립트 | 값 |
|---|---|---|
| `Blade` | `Blade` | 피해 3 · 타격 간격 0.3초 · Trigger Box `0.55 × 1.05` |
| `Projectile` | `Projectile` | 속도 12 · 피해 3 · 관통 2 · 수명 2초 |

> `Blade` 에는 **`Rigidbody 2D` 를 붙이지 않는다.** 부모 `Player` 의 바디에 붙어
> 컴파운드 콜라이더가 되므로 Trigger 가 정상 동작한다.

> ⚠️ **`ChargerEnemy.Attack` 의 `돌진! N 피해` 로그를 뺐다.** `Stay` 로 바꾸면서
> 매 물리 프레임 찍히기 때문이다. 070·073 강의안의 그 로그는 **Enter 시점의 것**이며,
> 회차별 중간 상태는 강의안 코드 블록이 정본이다 (`Bullet.cs` 와 같은 처리).

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 칼 배치 (077) | `bladeCount 3` → localPosition `(2,0)` `(-1,1.73)` `(-1,-1.73)` — 정확히 120도 |
> | 칼 배치 6개 | `(2,0) (1,1.73) (-1,1.73) (-2,0) (-1,-1.73) (1,-1.73)` — 정확히 60도 |
> | 회전 (076) | `Blades` 의 z 회전이 계속 증가 (표본 `50.9°`) |
> | 자동 조준 (078) | `CurrentTarget = Enemy_Charger(Clone)` |
> | 발사 (079) | 동시 비행 총알 3~4발 유지 |
> | 조작 없이 전투 | 약 100초에 `처치 51` (Space 를 한 번도 안 눌렀다) |
> | 무적시간 (080) | `-3` 이 7번, 그 사이 간격이 무적시간에 맞춰 일정 |
> | 사망 → 게임오버 | `플레이어 사망` → `state=GameOver` · `timeScale=0` |
> | HUD | `웨이브 6   처치 51   체력 0/20` + `게임 오버 / 51마리 처치 / R 키로 다시` |
> | 재시작 | `Restart()` 후 `Wave=1` · `hp=20/20` · `state=Playing` · `timeScale=1` |
>
> ⚠️ **`R` 키 입력 자체는 미실측.** 레거시 Input Manager 라 에디터에서 키를 흉내낼 수 없어
> `GameManager.Restart()` 를 직접 호출해 재시작 경로를 검증했다.
> `Update` 안의 `Input.GetKeyDown(KeyCode.R)` 분기는 미실측이다.
> (`Time.timeScale = 0` 에서도 `Update` 는 도는 것이 057에서 확인된 동작이다.)

### ★ 설계 판단 — `WeaponBase` 추상 클래스를 만들지 않았다

`docs/05_Unity프로젝트/스크립트-설계.md` 초안에는 `WeaponBase` (abstract) 아래
`StraightWeapon` / `PierceWeapon` 을 두는 구조가 있었다. **만들지 않았다.**

| | 회전 칼 | 자동 총 |
|---|---|---|
| 공격 방식 | 상시 회전, 닿으면 벤다 | 쿨다운마다 발사 |
| 필요한 것 | 각도 배치 · Trigger | 타겟 탐색 · 프리팹 생성 |
| 공통 코드 | **없다** | |

부모로 뽑을 코드가 한 줄도 없어서, 껍데기만 있는 추상 클래스가 됐을 것이다.
무기가 셋 이상 늘고 공통 코드가 실제로 생기면 그때 뽑는다.
(070의 `Enemy` 는 반대다 — 체력·사망·플레이어 탐색이 전부 공통이라 부모가 값을 한다.)

### ★ Phase 5 종료 — 코어 루프 한 바퀴

조작 없이 방치했을 때의 전체 흐름이 실측으로 확인됐다.

```
시작 → 무기가 자동으로 51마리 처치 → 몬스터에 둘러싸여 7대 피격 → 사망
     → timeScale 0 · 게임오버 문구 → Restart() → Wave 1 · hp 20/20 로 복귀
```

Phase 5 종료 조건 9개를 모두 만족한다 (`docs/01_Phase개요/Phase5-본프로젝트코어.md`).

---

## 17주차 (081–085) — 경험치와 레벨업 (Phase 6 착수)

`Game.unity` 하나가 계속 자란다. 연습 씬은 없다.

### `Game.unity` 085회차 시점 구성 (16주차에서 추가된 것)

| 오브젝트 | 부품 |
|---|---|
| `EventSystem` | **새로 추가.** 없으면 UI 버튼이 아예 안 눌린다 |
| `Player` | `PlayerLevel` 추가 (baseExp 5 · expStep 3 · `levelUpView` 연결) |
| `HUD` | `LevelUpView` 추가 |
| `HUD/LevelUpPanel` | 반투명 배경 + `Title` + `Card_0/1/2` (각 `Image` + `Button` + `Label`) |
| `HUD/CenterText` | **패널보다 뒤로 옮김** (게임오버 문구가 가려지지 않게) |
| `Enemy_*` 프리팹 3종 | `Exp Gem Prefab` 연결 |

### 젬 프리팹 — `Assets/_Project/Prefabs/Item/ExpGem.prefab`

| 항목 | 값 |
|---|---|
| `Rigidbody 2D` | **Kinematic** · Gravity 0 |
| `Circle Collider 2D` | `Is Trigger` · Radius 0.28 |
| `ExpGem` | exp 1 · 자석 범위 2.5 · 끌리는 속도 8 |

> `Kinematic` 인 이유: 082에서 `transform.position` 으로 직접 움직인다. `Dynamic` 이면
> 물리에 밀리고, Rigidbody 가 아예 없으면 정적 콜라이더로 취급돼 움직일 때마다 재계산된다.

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 젬 드롭 (081) | 몬스터 사망 자리에 생성. 조작 없이 방치 시 9개까지 누적 확인 |
> | 자석 — 범위 안 (082) | 거리 `2.00` 젬 → 끌려와 소멸, 경험치 증가 |
> | 자석 — 범위 밖 (082) | 거리 `4.00` 젬 → 3회 샘플 모두 `4.00` 그대로 |
> | 레벨업 곡선 (083) | 필요 경험치 `5 → 8 → 11 → 14` (`baseExp 5 + (Lv-1)*3`) |
> | HUD (083) | `웨이브 4     처치 34     체력 5/20     Lv.4  0/14` |
> | 시간 정지 (084) | 레벨업 순간 `timeScale = 0`, 패널 열림 `True` |
> | 멈춤 중 젬 (084) | `Time.deltaTime = 0` 이라 자석이 동작하지 않음 — **의도된 동작** |
> | 카드 3장 (085) | `칼 +1` / `이동 +` / `연사 +` — 매번 서로 다름 |
> | 카드 클릭 (085) | `Button.onClick.Invoke()` → `업그레이드 선택: BladeCount`, 칼 **3 → 4** |
> | 재배치 (085) | 칼 4자루 localPosition `(2,0) (0,2) (-2,0) (0,-2)` — 정확히 90도 |
> | 연사 업그레이드 | `연사 상승 — 발사 간격 0.44초` (0.50 − 0.06) |
> | 이동 업그레이드 | `이동 속도 상승 — 5.6` (5.0 + 0.6) |
> | 창 닫힘 | 클릭 직후 `timeScale = 1`, 패널 닫힘 |
>
> ⚠️ **마우스 클릭 자체는 미실측.** 에디터에서 실제 클릭을 흉내낼 수 없어
> `Button.onClick.Invoke()` 로 **배선(리스너 연결)** 을 검증했다.
> `EventSystem` 을 통한 실제 클릭 경로는 미실측이다.
> ⚠️ **`Input.anyKeyDown` (084 중간 상태) 도 미실측.** 최종본은 버튼 방식이다.

### ★ 검증 중에 겪은 것 — 젬이 안 끌려온다고 착각했다

범위 `2.0` 에 둔 젬이 3회 샘플 내내 `2.00` 그대로였다. 자석 코드가 안 도는 줄 알았다.

리플렉션으로 젬 내부를 찍어보니 원인이 나왔다.

```
enabled=True activeInHierarchy=True timeScale=0
exp=1  magnetRange=2.5  moveSpeed=8  player=Player (UnityEngine.Transform)
```

`timeScale = 0` — **레벨업 창이 떠 있었다.** `Time.deltaTime` 이 0이라
`MoveTowards` 의 이동량이 0이었던 것이다. 버그가 아니라 **084에서 가르치는 동작 그대로**다.

카드를 골라 `timeScale = 1` 로 되돌린 뒤 재측정: 범위 안 젬은 즉시 흡수, 범위 밖 젬은 `4.00` 유지.

> 🔑 084 강의안의 "멈춘 상태에서 뭐가 멈추는가" 표에 **젬 자석**을 넣어둔 근거가 이것이다.

### ★ 설계 판단 — `UpgradeManager` 를 따로 만들지 않았다

`docs/05_Unity프로젝트/스크립트-설계.md` 초안에는 `UpgradeManager` 가 따로 있었다.
지금은 업그레이드가 **3종**이고 추첨·표시·적용이 전부 `LevelUpView` 한 파일에 들어간다.
파일을 나누면 서로를 참조하는 배선만 늘어난다.

086에서 8종이 되고 `UpgradeData`(SO)가 들어오면 그때 분리한다.
설계 문서의 `UpgradeManager` 행도 그렇게 고쳐뒀다.

---

## 18주차 (086–090) — 데이터 분리와 보스 · Phase 6 종료

`Game.unity` 하나가 계속 자란다. 연습 씬은 없다.

### 새 폴더 — `Assets/_Project/Data/`

**이 게임의 수치가 전부 여기 있다.** 파일 15개.

| 종류 | 파일 | 담는 것 |
|---|---|---|
| `EnemyData` | `Enemy_Charger` `Enemy_Runner` `Enemy_Tank` | 이름·체력·피해·속도·색·크기 |
| `EnemyData` | `Boss_1` `Boss_2` `Boss_3` | 위와 같음 (체력 150/350/700, 크기 3.0/3.5/4.0) |
| `WeaponData` | `WeaponData` | 회전 칼 5개 값 + 자동 총 4개 값 |
| `UpgradeData` | `Upgrade_*` 8개 | 종류·제목·설명·수치·하한 |

> 🔑 **SO 는 "시작값" 만 준다.** 컴포넌트가 `Awake`/`Start` 에서 런타임 필드로 복사하고,
> 업그레이드는 그 런타임 필드만 바꾼다. SO 를 직접 바꾸면 **Play 중 변경이 파일에 저장**돼
> 다음 판에도 강해진 채로 시작한다.

> 🔑 **전부 빼지 않았다.** 탱커의 `damageReduction`, 돌진형의 `chargeDamage`,
> 보스의 `isFinal` 은 그 컴포넌트에 남겼다. **모든 종류가 쓰는 값만** SO 로 뺀다.

### `Game.unity` 090회차 시점 구성 (17주차에서 바뀐 것)

| 오브젝트 | 바뀐 것 |
|---|---|
| `Blades` / `Player` | `MeleeRing` · `AutoGun` 에 `WeaponData` 연결 |
| `HUD` | `LevelUpView` 의 `Upgrades` 배열에 `UpgradeData` 8개 |
| `HUD/StatusText` | 폭 700 → **1220**, 크기 34 → 30 (한 줄에 다 안 들어가서) |
| `WaveManager` | `Boss Prefabs` 3개 · `Boss Times` `180 / 360 / 600` |
| 몬스터 프리팹 3종 | `Data` 칸에 각자의 `EnemyData` |
| `Enemy_Boss1/2/3` | **신규.** `BossEnemy` · Mass 20 · `Boss3` 만 `Is Final` |

> ✅ **자동 검증 완료 (2026-09-02)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 업그레이드 8종 (086) | 전 `칼3 회전180 칼피해3 총간격0.50 총피해3 관통2 체력20/20` |
> | | 후 `칼4 회전225 칼피해4 총간격0.44 총피해4 관통3 체력25/25` |
> | 카드 추첨 (086) | 8개 풀에서 3장, 매번 서로 다름 |
> | SO 적용 (088) | 런타임 `칼=3 회전=180 칼피해=3 / 총 간격=0.5 피해=3 관통=2` — `WeaponData` 값 |
> | SO 적용 — 몬스터 | `Enemy_Charger(Clone) scale=1.00 color=RGBA(0.950,0.300,0.300,1)` |
> | 보스 스폰 (090) | 정해진 시각에 **한 번씩** — `nextBoss=3` 에서 멈춤 |
> | 보스 데이터 | `보스 I 150` / `보스 II 350` / `보스 III 700`, scale `3.0 / 3.5 / 4.0` |
> | 최종 보스 처치 | `state = Clear`, `timeScale = 0`, `kills 0 → 1` |
> | HUD | `00:08  웨이브 1  처치 1  체력 20/20  Lv.1 0/5` + `클리어! / 1마리 처치 / R 키로 다시` |
>
> ⚠️ **보스 스폰 시각은 테스트용으로 줄여 검증했다.** 리플렉션으로 `bossTimes` 를 `{3, 6, 9}` 로
> 바꿔 3마리가 순서대로 한 번씩 나오는 것을 확인했다. **씬 파일의 값은 `180/360/600` 그대로다.**
> ⚠️ **마우스 클릭·`R` 키는 미실측.** 이전 주차와 같은 이유다.

### ★ 발견해서 고친 것 — 보스 하나를 잡았는데 `Die()` 가 5번 불렸다

최종 보스를 잡아 클리어를 검증하다가 나왔다.

```
보스 처치! — 보스 III     ← 5번
게임 상태: Clear          ← 4번
kills = 5                 ← 1마리 잡았는데
```

**원인**: `Destroy(gameObject)` 는 **프레임 끝**에 처리된다. 같은 프레임에 여러 번
`TakeDamage` 가 불리면 체력이 이미 0 이하인데도 `Die()` 가 또 실행된다.

**고친 것** — `Enemy.TakeDamage` 첫 줄.

```csharp
public virtual void TakeDamage(int amount)
{
    if (currentHealth <= 0) return;   // 080에서 플레이어에 넣은 검사와 같다
    ...
}
```

**재측정**: `보스 처치!` 1번, `게임 상태: Clear` 1번, `kills = 1`.

> 🔑 이 버그는 **070부터 있었다.** 칼이 한 자루일 땐 한 프레임에 여러 번 맞을 일이 없어
> 드러나지 않았다. 076·077로 칼이 네 자루가 되고 079의 관통 총알이 붙자 드러났다.
> `PlayerHealth`(080)에는 같은 검사가 이미 있었는데 `Enemy` 에만 없었다.
> 090 강의안에 이 경위를 실측 로그와 함께 넣었다.

### ★ HUD 가 두 줄로 넘쳤다

`00:30  웨이브 3  처치 16  체력 0/25  Lv.2 0/8` 이 폭 700 에 안 들어가 줄바꿈됐다.
`StatusText` 를 **1220 폭 · 30pt** 로 바꿔 한 줄에 담았다.
Phase 7에서 HUD 를 제대로 만들 때 다시 손볼 자리다.

---

## 19주차 (091–095) — 안 깨지는 화면 · Phase 7 착수

`Game.unity` 하나가 계속 자란다. 연습 씬은 없다. **게임 기능은 하나도 안 늘었다.**

### 새 파일

| 파일 | 하는 일 |
|---|---|
| `Scripts/UI/StatBar.cs` | `Image.fillAmount` 를 `current/max` 로 채운다. **체력바·경험치바가 같이 쓴다** |
| `_GameAssets/Sprites/UI_Bar.png` | 8×8 흰 사각형. 바의 배경과 Fill |

### `Game.unity` 095회차 시점 구성 (18주차에서 바뀐 것)

| 오브젝트 | 바뀐 것 |
|---|---|
| `HUD` (Canvas Scaler) | Match `0` → **`0.5`** |
| `HUD/StatusText` | **삭제.** 긴 한 줄이 사라졌다 |
| `HUD/ExpBar` | **신규.** 위쪽 가로 Stretch · Height 20 · Fill 하늘색 |
| `HUD/HealthBar` | **신규.** 아래 가운데 440×30 · Fill 빨강 + Label |
| `HUD/LevelLabel` | **신규.** 왼쪽 위 · Pivot (0,1) · 32pt |
| `HUD/TimeLabel` | **신규.** 위 가운데 · Pivot (0.5,1) · **40pt** |
| `HUD/KillLabel` | **신규.** 오른쪽 위 · Pivot (1,1) · 32pt |
| `Main Camera` | `CameraFollow` 가 `target` → **`targets` (List)**. 배선을 다시 함 |

> 🔑 **바 하나는 두 겹이다.** 배경 `Image` + 자식 `Fill`(Filled, 사방 Stretch 안쪽 2px).
> 배경이 없으면 줄어든 만큼이 그냥 사라져서 얼마나 남았는지 안 보인다.

> 🔑 **카메라를 지금 목록으로 바꾼 이유**는 Phase 9 협동 때 이 파일을 안 고치려는 것이다.
> 원소가 1개면 068과 동작이 완전히 같다.

> ✅ **자동 검증 완료 (2026-09-03)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 바 (094) | 체력 13/20 → `fill 0.650` · 라벨 `13 / 20` |
> | | 경험치 3/5 → `fill 0.600` · 체력 0/20 → `fill 0.000` |
> | 해상도 대응 (091) | 체력바 폭 — Constant `68.8% / 34.4% / 22.9%` |
> | | Scale With·0.5 `39.7% / 34.4% / 34.4%` (640·1280·1920) |
> | `scaleFactor` | `0.577 / 1.000 / 1.500` |
> | 배치 (092·095) | 세 해상도 전부 다섯 요소 **화면 안** |
> | 앵커 사고 재현 (092) | 640×480 에서 앵커 가운데 `x 539~678` (화면 640) → **38px 잘림** |
> | | 같은 조건 앵커 오른쪽위 `x 490~628` → 멀쩡 |
> | 폰트 (093) | `Pretendard SDF` Dynamic · 담긴 글자 96 · 아틀라스 1024² · fallback 0 |
> | | `LiberationSans SDF` 는 `게임 오버 처치 레벨` 중 **8자가 없음** (Static, 250자) |
> | 카메라 (095) | `camera (0.00, 0.00, -10.00)` · `player (0.00, 0.00, 0.00)` · 거리 `0.00` |
> | 게임오버 | `CenterText` 한글 정상 · 체력바 `0 / 20` |
>
> ⚠️ **마우스 클릭·`R` 키는 미실측.** 이전 주차와 같은 이유(레거시 Input 시뮬레이션 불가).
> ⚠️ **실제 창 리사이즈는 미실측.** Game 뷰의 렌더 해상도를 바꿔 검증했다.

### ★ 발견해서 고친 것 — 기본 스프라이트로 만든 바가 뾰족해졌다

처음엔 Unity 기본 `UISprite` 로 바를 만들었다. 체력바 **왼쪽 끝이 둥글게 늘어나 뾰족한 모양**이 됐다.

**원인**: `UISprite` 는 모서리가 둥근 그림이다. `Sliced` 로 쓰면 모서리를 안 늘려 괜찮은데,
**`Filled` 는 Sliced 를 무시하고 통째로 늘린다.** 둥근 모서리가 그대로 늘어난 것이다.

**고친 것**: 8×8 **흰 사각형** `UI_Bar.png` 를 만들어 배경과 Fill 둘 다에 썼다.
흰색이라 `Image` 의 Color 로 아무 색이나 곱할 수 있다 — 빨강 바·파랑 바에 그림 두 장이 필요 없다.

> 🔑 094 강의안에 이 경위를 넣었다. 학생도 똑같이 겪는다.

### ★ 재보고 알게 된 것 — Canvas Scaler 는 위치를 안 고친다

`640x480` 에서 Scaler 4가지 설정을 전부 재봤는데 **네 경우 모두 화면 밖으로 안 나갔다.**

```
[A] Constant Pixel Size            모두 화면안 = True
[B] Scale With Screen Size · 0     모두 화면안 = True
[C] Scale With Screen Size · 1     모두 화면안 = True
[D] Scale With Screen Size · 0.5   모두 화면안 = True
```

Anchor 가 이미 제대로 잡혀 있었기 때문이다. **Scaler 는 "크기", Anchor 는 "위치"** 다.
091 강의안을 이 실측에 맞춰 고쳐 썼다 — Scaler 만으로 다 된 것처럼 가르치면
092 에서 학생이 왜 또 하는지 이해를 못 한다.

### ★ 설계 판단 — 바 스크립트를 하나만 만들었다

`HealthBar` / `ExpBar` 를 따로 만들지 않았다. 둘이 하는 일이 **"현재값/최대값 만큼 채워라"** 로
완전히 같기 때문이다. 보스 머리 위 체력바가 필요해져도 같은 것을 붙이면 된다.

---

## 20주차 (096–100) — 화면을 잇는다 · Phase 7 종료

**씬이 세 개가 됐다.** `Title.unity` → `Game.unity` → `Result.unity`.

### 새 파일

| 파일 | 하는 일 |
|---|---|
| `Scenes/Title.unity` | 타이틀. 오브젝트 4개 (Camera / EventSystem / AudioManager / UI) |
| `Scenes/Result.unity` | 결과. 라벨 4개 + 버튼 2개 |
| `Scripts/Manager/RunResult.cs` | **static.** 씬을 넘겨도 안 사라지는 성적 보관소 |
| `Scripts/Manager/AudioManager.cs` | 효과음 한 곳. 같은 소리는 `minGap` 0.05초 간격 |
| `Scripts/UI/TitleView.cs` · `ResultView.cs` · `PauseView.cs` | 화면 세 개 |
| `Scripts/Effect/DeathEffect.cs` | 스프라이트 조각 8개. 정렬 레이어 `Effect` |
| `_GameAssets/Audio/Sfx_*.wav` | 효과음 4종 (PowerShell 생성) |
| `Prefabs/Effect/DeathEffect.prefab` | 위 스크립트 + `UI_Bar` 스프라이트 |

### Build Settings

| 번호 | 씬 |
|---|---|
| 0 | `Title` ← 게임을 켜면 여기부터 |
| 1 | `Game` |
| 2 | `Result` |

### `Game.unity` 100회차 시점 구성 (19주차에서 바뀐 것)

| 오브젝트 | 바뀐 것 |
|---|---|
| `HUD/LevelUpPanel` | 사방 Stretch · 알파 0.86 · Raycast 켬. 카드 300×250, Pos X `-334/0/+334` |
| `HUD/CenterText` | **삭제.** 결과 씬이 그 일을 한다 |
| `HUD/PausePanel` | **신규.** 계속하기 / 타이틀로 |
| `HUD` | `PauseView` 추가 |
| `AudioManager` | **신규** (세 씬 모두) |
| `GameManager` | `Wave Manager` · `Player Level` 연결 (결과에 적을 값) |
| `Player` | `PlayerHealth` 에 `Cam` · `Hurt Sfx` 연결 |
| 몬스터 프리팹 6종 | `Death Effect` · `Hit Sfx` · `Die Sfx` |

> 🔑 **`timeScale` 을 대입하는 곳은 `GameManager` 안에만 있다.**
> `LevelUpView` · `PauseView` 는 `ChangeState(Upgrading / Paused / Playing)` 만 부른다.
> 066에서 만든 `GameState` 의 `Paused` · `Upgrading` 이 34주 만에 쓰였다.

> ✅ **자동 검증 완료 (2026-09-03)**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 씬 전환 (097) | Title → [시작] → `씬=Game` · Result → [타이틀] → `씬=Title` |
> | 데이터 유지 | 죽기 전 `시간 8.7초 처치 2 Lv.4` → 결과 화면 `00:08 / 2 / 4` |
> | 레벨업 창 (096) | 실제 클릭 `Card_1` → `panel=False timeScale=1 state=Playing` |
> | 일시정지 (098) | `Open()` → `state=Paused timeScale=0` · [계속하기] 클릭 → `Playing / 1` |
> | **timeScale 충돌** | 레벨업 중 `HitStop` 호출 → `timeScale=0` 유지 (1초 뒤에도 `Upgrading`) |
> | 셰이크 (099) | `shakeLeft=0.150 shakePower=0.120` |
> | 히트스톱 | 피격 직후 `timeScale=0` → 끝난 뒤 `1` |
> | 조각 (099) | 3개 생성 → 조각 24개 · `layer=Effect` · 화면에 보임 |
> | 사운드 (100) | `AudioSource isPlaying=True` · `playOnAwake=False` · `spatialBlend=0` |
> | 컴파일 | 에러 0 · 경고 0 |
>
> 🔑 **이번 주차부터 마우스 클릭이 실측이다.** `uloop simulate-mouse-ui` 로
> `EventSystem` 을 통한 진짜 클릭 경로를 검증했다 (`Btn_Start` · `Card_1` · `Btn_Resume` · `Btn_Title`).
> 14주차부터 19주차까지 미실측으로 남겨뒀던 항목이다.
>
> ⚠️ **`ESC` 키는 여전히 미실측.** 레거시 Input Manager 라 키 입력을 흉내낼 수 없어
> `PauseView.Open()` 을 직접 불러 검증했다.
> ⚠️ **소리가 실제로 들리는지는 미실측.** `AudioSource.isPlaying = True` 까지만 확인했다.

### ★ 발견해서 고친 것 — 창은 떠 있는데 게임이 돌았다

```
레벨업 창 열림   →  창 = True   timeScale = 0     ← 정상
(그 사이 플레이어가 맞아 히트스톱 발생)
1초 뒤          →  창 = True   timeScale = 1     ← 게임이 돈다
```

**원인**: `timeScale` 을 세 곳에서 만지고 있었다 — `LevelUpView`, `PauseView`,
`GameManager.HitStop`. 히트스톱이 **끝나면서 `1f` 로 되돌리는데**, 그때 레벨업 창이
떠 있는지 알 방법이 없었다.

**고친 것**: `GameManager` 를 유일한 주인으로 만들었다.

```csharp
private bool ShouldFreeze => IsFinished || State == GameState.Paused || State == GameState.Upgrading;

// HitStop 이 끝날 때
if (!ShouldFreeze) Time.timeScale = 1f;
```

`LevelUpView`·`PauseView` 는 `ChangeState` 만 부른다. **재측정**: 레벨업 중 `HitStop` 을
호출해도 `timeScale = 0` 이 유지된다.

> 🔑 098 강의안의 핵심 블록이 이 경위다. 학생도 같은 구조로 만들면 같은 버그를 만난다.

### ★ 포기한 것 — URP 2D 에서 파티클이 안 나왔다

`ParticleSystem` 으로 죽음 이펙트를 만들었는데 **화면에 아무것도 안 나왔다.**
입자는 분명히 살아 있었다.

```
입자 24개 · isVisible = True · 머티리얼 있음 · bounds 가 화면 안
```

순서대로 고쳐봤다.

| 시도 | 결과 |
|---|---|
| 머티리얼이 `NULL` 이었다 (런타임 생성 머티리얼은 프리팹에 저장 안 됨) | 내장 `Sprites-Default` 로 교체 → 그대로 |
| 머티리얼에 텍스처가 없었다 | `UI_Bar` 를 물림 + URP 2D 셰이더로 → 그대로 |
| 크기가 0.023 · 알파 0.18 이었다 (수명 끝에서 측정) | 크기 0.28~0.48 · 수명 0.45 로 → 그대로 |
| 정렬 레이어가 `Default`(값 0) 라 `Background` 보다 아래였다 | `Effect` 로 → **그대로** |

**판단**: 스프라이트로 갈아탔다. `DeathEffect.cs` 가 `SpriteRenderer` 조각 8개를
직접 만들어 날린다. 이 게임의 모든 것이 스프라이트라 확실히 나온다.

> 🔑 마지막 정렬 레이어 문제는 **진짜 결함**이었으므로 고쳐서 스프라이트 쪽에 반영했다.
> 파티클이 안 나온 진짜 원인은 **끝내 못 찾았다.** 099 강의안에 이 판단 자체를 넣었다 —
> "안 되는 걸 붙잡기보다 되는 걸로 만든다" 는 것도 가르칠 내용이다.

### ★ 겪은 것 — 버튼에 글자가 없었다

일시정지 버튼 두 개가 **네모만 떠 있었다.** 버튼 배경(`Image`)은 만들었는데
자식 `Label` 의 `text` 를 안 채운 것이었다. 098 강의안의 "오늘 1등 사고" 로 넣었다.

### ★ 겪은 것 — 레벨업 제목이 시계와 겹쳤다

`Title` 을 `Pos Y = -80` 에 뒀더니 위 가운데 `TimeLabel`(00:15) 과 겹쳤다.
`-150` 으로 내렸다. 096 강의안에 넣었다.

---

## 21주차 (101–105) — 분기점 · Phase 8 종료

**빌드가 나오는 주차다.** `Builds/` 는 `.gitignore` 대상이라 저장소에 안 들어간다.

### 새 파일

| 파일 | 하는 일 |
|---|---|
| `Scripts/Manager/PoolManager.cs` | 프리팹별 서랍(`Queue`). `Spawn` / `Despawn` 정적 메서드 |

### 바뀐 것

| 파일 | 무엇 |
|---|---|
| `Enemy.cs` | `Start` → **`OnEnable`** (재활용마다 체력 리셋) · `static AliveCount` · `Despawn` |
| `ChargerEnemy` `RunnerEnemy` `TankEnemy` `BossEnemy` | `override Start` → `override OnEnable` |
| `WaveManager.cs` | `Instantiate` → `Spawn` · **`maxAlive = 250`** 상한 |
| `GameManager.cs` | `Awake` 에서 `Enemy.ResetAliveCount()` |
| `Projectile.cs` | `Destroy(go, 초)` 예약 제거 → `lifeLeft` 를 직접 셈 · `OnEnable` |
| `AutoGun.cs` | 회전을 `Spawn` 인자로 넘김 (`Quaternion.FromToRotation`) |
| `ExpGem.cs` `DeathEffect.cs` | `Destroy` → `Despawn`, 조각 생성은 `Awake` 로 |
| `EditorBuildSettings` | 연습 씬 12개를 **체크 해제** (목록에는 남김) |
| `ProjectSettings` | Product Name · 1280×720 · Windowed · Resizable · **Mono** |

> 🔑 **`Destroy(go, 초)` 예약은 풀링과 같이 못 쓴다.** 서랍 속 물건까지 없앤다.
> 프로젝트 전체에서 `Projectile` 한 곳뿐이었다.

> 🔑 **`OnEnable` 은 `Spawn` 안에서 바로 돈다.** `Instantiate` 시절엔 `Start` 가 다음 프레임에
> 돌아서 "만들고 나서 방향 주기" 가 통했다. 풀링에서는 **회전을 꺼낼 때 같이 줘야** 한다.

> ✅ **자동 검증 완료 (2026-09-03)**
>
> **성능 — 몬스터 수와 FPS** (에디터 · 1280×720 · 플레이어 무적)
>
> | 살아 있는 몬스터 | 평균 FPS |
> |---|---|
> | 1 | 435.9 |
> | 236 | 421.7 |
> | 917 | 368.1 |
> | 1802 | 263.0 |
> | 3668 | **45.2** |
>
> **세 가지 상태 비교** (같은 소환 부하)
>
> | 상태 | 살아 있는 몬스터 | 평균 FPS |
> |---|---|---|
> | 풀링 ✗ · 상한 ✗ | 3668 | 45.2 |
> | 풀링 ✓ · 상한 ✗ | 2757 | **13.6** |
> | 풀링 ✓ · 상한 250 | 210 | **442.3** |
>
> **생성/파괴 비용** (500개씩, 몸풀기 후)
>
> ```
> Instantiate 500개 : 9.2 ms  (1개당 18 µs)
> Destroy     500개 : 2.0 ms  (1개당  4 µs)   관리 힙 +4 KB
> SetActive 껐다 켜기 : 2.6 ms  (1개당  5 µs)   힙 0 KB
> ```
>
> **재활용 정확성**
>
> | 확인한 것 | 실측 |
> |---|---|
> | 몬스터 | 죽인 뒤 `활성=False` → 다시 꺼내면 **체력 10** (리셋됨) |
> | 총알 | 속도 `(12.0, 0.0)` → 재활용 `(0.0, 12.0)` (방향이 바뀐다) |
> | 죽음 이펙트 | 조각 `8 → 8`개 (안 늘어남) · `elapsed=0` · 위치 `(0,0,0)` · 알파 `1.00` |
> | 12초 정상 플레이 | 만든 것 15 · 재사용 22 · **재사용 비율 59%** |
>
> **빌드**
>
> | 항목 | 값 |
> |---|---|
> | 결과 | `Succeeded` · 에러 0 · 경고 0 |
> | 걸린 시간 | 64.0초 (첫 빌드) / 7.0초 (두 번째) |
> | 크기 | 105.2 MB · 파일 203개 |
> | `WaveBreaker.exe` | 652 KB |
> | 실행 | 프로세스 8초 뒤 살아 있음 · 메모리 594 MB · `Player.log` 에러 없음 |
>
> ⚠️ **빌드된 게임의 화면은 미실측.** 캡처를 시도했으나 다른 창이 앞에 있어 실패했고, 재시도하지 않았다.
> 프로세스 생존과 `Player.log`(PhysX·입력 초기화 정상)까지만 확인했다.
> ⚠️ **10분 완주 미실측.** 한 판을 끝까지 돌려보지는 않았다.
> ⚠️ **에디터 측정값이다.** 빌드된 게임은 보통 더 빠르다.

### ★ 측정을 두 번 버렸다

**첫 번째** — 몬스터를 4764마리까지 늘렸는데 FPS 가 458 로 안 떨어졌다. 확인해 보니
`timeScale = 0`, `state = Upgrading` — **레벨업 창이 열려 게임이 멈춘 상태**였다.
멈춘 게임은 당연히 빠르다. (17주차 자석 검증 때와 **같은 함정**이다. 두 번째다.)

**두 번째** — 창을 닫고 다시 쟀더니 이번엔 `몬스터 0 · Transform 12` 가 나왔다.
**플레이어가 즉사해 결과 씬으로 넘어가 있었다.**

무적을 걸고 레벨업 창을 끊은 뒤에야 위의 곡선이 나왔다. 이 경위를 101 강의안의
"재기 전에 `timeScale` 을 확인하라" 블록에 그대로 넣었다.

### ★ Phase 8 문서의 전제를 정정했다

문서는 "렉을 겪고 **풀링으로 해결한다**" 였다. 재보니 **풀링만으로는 프레임이 안 살아났다**
(2757마리에서 13.6 FPS). 프레임을 살린 건 `maxAlive = 250` 상한이었다.

풀링이 준 것은 따로 있다 — 만드는 비용 `22 µs → 5 µs`, 쓰레기 `4 KB → 0 KB`.

그래서 회차 구성을 이렇게 바꿨다.

| 회차 | 원래 문서 | 바꾼 것 |
|---|---|---|
| 101 | 렉을 겪고 프로파일러로 원인 분석 | + **원인을 두 가지로 분리** |
| 103 | 풀링 ② 총알·젬 | + **개수 상한** (프레임을 살리는 쪽) |

`Phase8-싱글완성.md` 상단에도 이 정정을 실측 표와 함께 남겼다.

### ★ 설계 판단 — 풀 반납 인터페이스를 안 만들었다

`IPoolable { void OnSpawn(); }` 같은 인터페이스를 두는 방법도 있었다.
대신 **유니티가 이미 주는 `OnEnable`** 을 썼다. 새 개념이 하나 줄고,
"켜질 때 도는 함수" 라는 설명이 학생에게 훨씬 잘 붙는다.

풀에서 꺼내는 쪽(`PoolManager`)이 아무것도 호출하지 않아도 되는 것도 이점이다.
