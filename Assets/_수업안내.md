# Chapter 2 · 싱글 플레이 완성본

> **이 브랜치(`Chapter_2/Full`)에는 싱글 게임 한 벌이 전부 들어 있습니다.**
> 로비에서 스테이지를 고르고, 버티고, 결과를 보고 돌아옵니다.
> Chapter 1 기초는 `Chapter_1/Week1`~`Week7` 에 있습니다.

| | |
|---|---|
| 만든 순서 | 아래 **15단계** 그대로 |
| 씬 | `Lobby` → `Game` → `Result` |
| 스크립트 | 28개 |
| 데이터 에셋 | `ScriptableObject` **7종** |
| 스테이지 | 3개 (들판 5분 · 폐허 8분 · 심연 10분) |

---

## 어떻게 만들었나 — 15단계

### 1. 캐릭터 이동
`PlayerInput` 과 `PlayerController` 를 **나눈다.** 입력을 읽는 일과 움직이는 일은 다른 일이다.
나중에 협동을 붙이면 입력은 각자, 움직임은 서버가 정한다.

> 🚨 `Rigidbody2D` 의 **`Interpolate`** 를 켠다. 안 켜면 물리(50Hz)와 화면(수백 fps)의
> 박자가 안 맞아 덜덜 떤다. 실측으로 120프레임 중 100프레임이 제자리였다.

`Scripts/Player/PlayerInput.cs` · `PlayerController.cs`

### 2. 무한 맵
바닥 타일 **3×3** 을 깔고, 멀어진 타일을 반대편으로 옮긴다. 맵을 넓게 만들지 않는다.
카메라는 **시네머신**이 몬다 (`CinemachineBrain` + `CinemachineCamera`).

`Scripts/Map/InfiniteGround.cs` · `Manager/CameraFollow.cs`

### 3. 몬스터 Prefab 만들기
`Enemy` 하나로 끝낸다. **종류마다 클래스를 만들지 않는다.**
플레이어를 향해 직진하고, 닿으면 때린다.

> 🚨 `CompareTag("Enemy")` 로 **같은 편은 거른다.** 이 한 줄이 없으면 몬스터끼리 서로 죽인다.
> 충돌을 끄는 것으로 막으면 서로 안 밀어내서 **한 점에 포개진다** (실측 거리 0.000).

`Scripts/Enemy/Enemy.cs` · `Prefabs/Enemy/Enemy_Base.prefab`

### 4. 캐릭터 기본 공격 — 무기 1개 · Prefab · SO
**첫 `ScriptableObject` 가 여기서 나온다.** 무기를 만들자마자 "수치를 어디 둘까" 가 나오기 때문이다.

```
WeaponData
  레벨 1~7 배열 — 피해 · 간격 · 사거리 · 개수 · 속도
```

무기는 공격 **방식**이 달라서 클래스를 나눈다 — `OrbitWeapon`(회전 칼) · `GunWeapon`(자동 총) · `AuraWeapon`(성역).

> 🚨 회전 칼은 배치만 하고 **회전을 안 주면** 칼끝이 전부 같은 쪽을 본다.
> 왼쪽 칼이 플레이어를 향해 꽂힌 모양이 된다. 배치 각도만큼 돌려 바깥을 보게 한다.

`Scripts/Weapon/` · `Data/Weapon/`

### 5. 몬스터 공격 — 닿으면 체력 감소
`OnCollisionEnter2D` 로 플레이어를 때린다. 플레이어도 **`IDamageable`** 이다.

> 🚨 **무적 시간**이 없으면 떼에 닿는 순간 한 프레임에 죽는다. 0.7초를 준다.
> 🚨 플레이어 `Rigidbody2D` 를 **`Kinematic`** 으로. 안 그러면 몬스터에게 밀려난다.
> 실측으로 6마리가 붙어도 위치가 (0.00, 0.00) 에서 안 움직이고, 피해는 그대로 들어온다.

`Scripts/Player/PlayerHealth.cs`

### 6. 데미지 처리 — 피격 효과(Flicker)
맞으면 잠깐 빨갛게 깜빡인다. **몬스터와 플레이어가 같은 스크립트를 쓴다.**

> 🔑 "누가 맞았나" 를 안 본다. `SpriteRenderer` 만 있으면 된다. 그래서 한 번 만들어 두 군데에 붙인다.
> 🚨 이미 깜빡이는 중이면 멈추고 다시 시작한다. 안 그러면 두 코루틴이 색을 덮어써서 원래 색으로 안 돌아온다.

`Scripts/Combat/Flicker.cs`

### 7. Wave 시스템 · SO
**두 번째 SO.** 언제 무엇이 어떻게 나오는지를 표 하나로 만든다.

```
WaveData
  SpawnStep[]   시점 · 종료 · 적 · 패턴(Trickle/Cluster) · 간격 · 마릿수 · 체력 배수
  BossStep[]    시점 · 보스
```

몬스터를 만드는 곳은 **`WaveManager.SpawnAt()` 하나뿐이다.**

> 🚨 보스가 나와 있는 동안 잡졸을 멈춘다(`BossActive`). 안 그러면 화면이 감당이 안 된다.

`Scripts/Manager/WaveManager.cs` · `Data/Wave/`

### 8. LevelUp 기능 + 레벨업 보상 창 · SO · UI Prefab
몬스터가 젬을 떨구고, 가까이 가면 끌려오고, 모이면 레벨이 오른다.
레벨이 오르면 **시간을 멈추고** 카드 3장을 띄운다.

> 🔑 `AddExp` 안은 `if` 가 아니라 **`while`** 이다. 한 번에 여러 레벨이 오를 수 있다.

`Scripts/Progress/` · `Scripts/UI/RewardView.cs` · `Data/LevelCurve.asset`

### 9. 보상으로 무기 추가 장착 · 강화
카드는 **런타임에 만든다.** 지금 가진 무기에 따라 보여줄 게 달라지기 때문이다.

| 상황 | 나오는 카드 |
|---|---|
| 그 무기가 없다 | **획득** (슬롯이 남아 있을 때만) |
| 있고 MAX 가 아니다 | **강화** (Lv.n → Lv.n+1) |
| MAX 다 | 안 나온다 |

`Scripts/Weapon/WeaponInventory.cs`

### 10. 7레벨(MAX) 두 개를 합쳐 새 무기
**레시피 하나가 에셋 하나다.** 코드를 안 고치고 조합을 늘린다.

```
WeaponFusionData
  재료 A : 회전 칼 (MAX)
  재료 B : 자동 총 (MAX)
  결과   : 칼날 폭풍
```

둘 다 MAX 가 되면 보상 창에 **★ 조합 카드**가 뜬다. 고르면 재료 둘이 사라지고 결과가 들어온다.

`Scripts/Data/WeaponFusionData.cs` · `Data/Weapon/Fusion_Storm.asset`

### 11. 몬스터 종류 추가 — 군집 등
**스크립트를 한 줄도 안 짜고** 종류를 늘린다. `EnemyData` 에셋을 만들면 된다.

| 에셋 | 그림 | 체력 | 속도 | 피해 | 특징 |
|---|---|---|---|---|---|
| `Enemy_Orc` | Orc | 20 | 2.0 | 4 | 기본 |
| `Enemy_Demon` | Demon_A | 6 | 5.0 | 3 | 빠르고 약하다. **떼로 온다** |
| `Enemy_Blood` | Blood Monster_A | 45 | 1.1 | 8 | 느리고 단단. 피해 **50% 감소** |

> 🔑 `damageReduction = 0` 은 빈 칸이 아니라 **"감소 없음"** 이다. 그래서 값이고, 데이터로 둔다.
>
> 🔑 군집은 적 코드가 아니라 **스폰 패턴**이다. 같은 데몬인데 한 마리씩 올 때와
> 8마리가 한 덩어리로 밀려올 때가 완전히 다르다.

`Data/Enemy/`

### 12. 보스 몬스터
보스는 **죽을 때 하는 일이 다르다.** 그래서 여기서만 클래스를 나눈다.

> 🔑 **숫자가 다르면 데이터, 행동이 다르면 클래스.** 11번과 12번의 차이가 그 기준이다.

크기와 색조도 `EnemyData` 에 있어서 보스 3종이 에셋 3개다.

`Scripts/Enemy/BossEnemy.cs` · `Data/Enemy/Boss_1~3.asset`

### 13. 타일 · 로비 화면
로비에서 스테이지를 고른다. UI 는 Layer Lab `Theme_Dark` 를 쓴다.

`Scenes/Lobby.unity` · `Scripts/UI/StageSelectView.cs`

### 14. `SceneManager` 로 게임 플로우
```
Lobby  →  Game  →  Result  →  Lobby
            ↑                    │
            └────── 다시 하기 ────┘
```

씬 이름은 **`SceneFlow` 한 곳에만** 적는다. 여기저기 문자열로 쓰면 오타 하나에 빌드가 깨진다.
`GameSession` 이 `DontDestroyOnLoad` 로 고른 스테이지와 결과를 들고 다닌다.

> 🚨 게임오버는 `timeScale` 을 0 으로 만든다. 그 상태에서 `Invoke` 나 `WaitForSeconds` 는
> **영원히 안 불린다.** `WaitForSecondsRealtime` 을 써야 결과 화면으로 넘어간다.

`Scripts/Flow/`

### 15. 로비에서 스테이지 선택
**`StageData` 에셋 하나가 스테이지 하나다.**

```
StageData
  제목 · 설명 · 썸네일
  WaveData       그 판의 난이도 곡선
  바닥 타일 · 색조
  버틸 시간      이 시간을 넘기면 클리어
```

| 스테이지 | 시간 | 보스 |
|---|---|---|
| 들판 | 5분 | 대장 오크 |
| 폐허 | 8분 | 대장 오크 · 대악마 |
| 심연 | 10분 | 셋 모두 + **군체왕(최종)** |

`Data/Stage/` · `Scripts/Flow/StageRunner.cs`

---

## ScriptableObject 7종 — 이 게임의 전부

`Assets/_Project/Data/` 폴더를 열면 게임의 내용이 다 보인다. 코드는 그걸 읽을 뿐이다.

| 에셋 | 담는 것 | 늘리려면 |
|---|---|---|
| `EnemyData` | 체력·속도·피해·감소율·그림·배율·색조·젬·보스여부 | 에셋 1개 |
| `WeaponData` | 레벨 1~7 수치 배열 | 에셋 1개 + 공격 방식 클래스 |
| `WeaponFusionData` | 재료 2 → 결과 1 | 에셋 1개 |
| `WaveData` | 스폰 계획 + 보스 시점 | 에셋 1개 |
| `LevelData` | 레벨업 곡선 | 값만 바꾼다 |
| `UpgradeData` | 몸 강화 카드 | 에셋 1개 |
| `StageData` | 스테이지 한 판 | 에셋 1개 |

---

## 조작

| | |
|---|---|
| `WASD` | 이동 |
| 공격 | **자동.** 무기가 알아서 한다 |
| 레벨업 | 카드 3장 중 하나를 **클릭** |

---

## 폴더

```
Assets/_Project/
├── Scenes/      Lobby · Game · Result
├── Scripts/
│   ├── Data/      SO 7종
│   ├── Enemy/     Enemy · BossEnemy
│   ├── Weapon/    Weapon · Orbit · Gun · Aura · Projectile · ContactDamage · Inventory
│   ├── Player/    Input · Controller · Health
│   ├── Progress/  ExpGem · GemSpawner · PlayerLevel
│   ├── Combat/    Flicker
│   ├── Manager/   GameManager · WaveManager · CameraFollow
│   ├── Map/       InfiniteGround
│   ├── Flow/      GameSession · SceneFlow · StageRunner
│   └── UI/        HUDView · RewardView · StageSelectView · ResultView
├── Prefabs/     Enemy_Base · Enemy_Boss · Gem · Shot · Blade
├── Data/        Enemy · Weapon · Wave · Upgrade · Stage
└── Animation/   Orc · Demon_A · Blood 클립 + 컨트롤러
```

## 브랜치

| | |
|---|---|
| `Chapter_1/Week1`~`Week7` | 유니티 기초 (031–065) |
| **`Chapter_2/Full`** | **← 지금 여기** — 싱글 완성본 |
| `main` | 전체 과정 문서 |
