# 실습 씬 (051–055 · 11주차)

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

