# 실습 씬 (056–060 · 12주차)

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

