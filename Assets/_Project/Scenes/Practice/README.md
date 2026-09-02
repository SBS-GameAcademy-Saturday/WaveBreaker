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
> **WASD 실제 입력은 사람이 직접 눌러 확인해야 한다.** 씬이나 스크립트를 고치면 다시 확인한다.
