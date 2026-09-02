# 088회차 · 수치를 전부 폴더 하나로

| | |
|---|---|
| **Phase** | 6 · 성장 시스템 |
| **소요** | 2시간 (비대면) |
| **선행** | 087회차 (`EnemyData`), 072회차 (몬스터 3종), 076~079회차 (무기) |
| **오늘 배우는 것** | 무엇을 데이터로 빼고 무엇을 남길지 정하기 |
| **씬** | `Game.unity` |
| **준비물(강사)** | SO 전면 적용 완성본, `Data` 폴더 화면 |

## 🎯 오늘의 목표

1. 몬스터 **3종 전부** SO 로 뺀다
2. **무기 수치**도 SO 로 뺀다
3. **무엇을 남길지** 스스로 판단한다

> ⚠️ **오늘 안 하는 것**: 업그레이드 SO(089), 보스(090).
>
> 🔑 **설계 의도**: 087은 "SO 가 뭔지" 였다. 오늘은 **"어디까지 뺄지"** 다.
> 전부 빼는 게 정답이 아니다. **탱커의 피해 감소, 돌진형의 돌진 피해**는 남긴다.
> 그 판단 기준을 오늘 세운다.

## 📦 오늘의 제출물

**`Data` 폴더 스크린샷 + 코드를 안 고치고 밸런싱한 GIF (10초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 |
| 00:10–00:50 | 같이 하기 — 몬스터 3종 → 무기 → 판단 기준 |
| 00:50–01:00 | 휴식 |
| 01:00–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + 정리 |
| 01:50–02:00 | 체크리스트 + 제출 |

---

## 00:00–00:10 · 복습 퀴즈

1. SO 를 Create 메뉴에 띄우는 애트리뷰트는? → **`[CreateAssetMenu]`** (087)
2. SO 값을 Play 중에 바꾸면? → **저장된다** (087)
3. 그래서 우리는 어떻게 쓰나? → **`Awake` 에서 런타임 필드로 복사** (087)

---

## 00:10–00:50 · 같이 하기 ★

### ① 몬스터 3종 (10분)

`Enemy_Runner` · `Enemy_Tank` 에셋을 만들고 프리팹에 연결한다.

| 에셋 | 체력 | 피해 | 속도 | 색 | 크기 |
|---|---|---|---|---|---|
| `Enemy_Charger` | 10 | 1 | 2.0 | 빨강 | 1.0 |
| `Enemy_Runner` | 4 | 1 | 5.5 | 노랑 | 0.85 |
| `Enemy_Tank` | 30 | 2 | 1.1 | 보라 | 1.5 |

▶ Play → 세 종류가 **전부 SO 값**으로 동작한다.

> 💬 "코드는 **한 줄도 안 고쳤습니다.** 087에서 `Enemy` 부모에 넣어놨으니까요."
> 💬 "070에서 상속을 쓴 게 여기서 또 값을 합니다. **부모에 한 번**이면 자식 전부."

### ② 무엇을 남길까 (12분) — 오늘의 핵심

> 💬 "탱커의 **피해 감소 50%** 도 SO 에 넣을까요?"

학생 답을 기다린다. 보통 "넣어야죠" 가 나온다.

> 💬 "넣으면 어떻게 될까요? **돌진형·러너 에셋에도 그 칸이 생깁니다.** 쓰지도 않는데요."

**칠판**

```
EnemyData 에 전부 넣으면
┌────────────────────────────┐
│ 체력 · 피해 · 속도 · 색 · 크기   │  ← 셋 다 쓴다
│ 피해 감소       (탱커만)       │  ← 둘은 안 쓴다
│ 돌진 피해       (돌진형만)     │  ← 둘은 안 쓴다
│ 최종 보스인가    (보스만)      │  ← 셋 다 안 쓴다
└────────────────────────────┘
       빈 칸투성이 에셋
```

**판단 기준을 정한다.**

| | 어디에 두나 |
|---|---|
| **모든 종류가 쓰는 값** | `EnemyData` (SO) |
| **그 종류만 쓰는 값** | 그 컴포넌트의 `[SerializeField]` |

> 💬 "탱커의 `damageReduction` 은 `TankEnemy.cs` 에 남깁니다. **탱커 프리팹에서 고치면 돼요.**"
> 💬 "종류가 하나뿐인 값은 **찾아갈 곳이 명확**하니까 괜찮습니다."

> 💡 이 판단이 실무의 대부분이다. "**빼는 게 좋은가**" 가 아니라
> "**여럿이 공유하는가**" 를 묻는다.

### ③ 무기 수치 (12분)

무기는 **두 개뿐**이고 **둘 다 플레이어 것**이다. 그래서 **에셋 하나**에 같이 둔다.

`Scripts/Data/WeaponData.cs`

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "WeaponData", menuName = "WaveBreaker/Weapon Data")]
public class WeaponData : ScriptableObject
{
    [Header("회전 칼")]
    public int bladeCount = 3;
    public float bladeRadius = 2f;
    public float bladeRotateSpeed = 180f;
    public int bladeDamage = 3;
    public float bladeHitInterval = 0.3f;

    [Header("자동 총")]
    public float gunRange = 8f;
    public float gunFireInterval = 0.5f;
    public int gunDamage = 3;
    public int gunPierce = 2;
}
```

> 💬 "몬스터는 종류마다 에셋을 따로 만들었죠. 무기는 **하나**에 넣었습니다. 왜일까요?"
> 💬 "몬스터는 **종류가 계속 늘어납니다.** 무기는 지금 두 개고, 둘 다 플레이어 거예요."
> 💬 "**나중에 무기가 다섯 개가 되면** 그때 나눕니다. 지금 나누면 파일만 늘어요."

`MeleeRing` 과 `AutoGun` 이 읽는다.

```csharp
// MeleeRing.cs
[SerializeField] private WeaponData data;

private int bladeCount = 3;
private float radius = 2f;
private float rotateSpeed = 180f;
private int bladeDamage = 3;
private float hitInterval = 0.3f;

private void Start()
{
    // SO 는 "시작값" 만 준다. 여기서 런타임 필드로 복사한 뒤로는 SO 를 건드리지 않는다.
    if (data != null)
    {
        bladeCount = data.bladeCount;
        radius = data.bladeRadius;
        rotateSpeed = data.bladeRotateSpeed;
        bladeDamage = data.bladeDamage;
        hitInterval = data.bladeHitInterval;
    }

    Build();
}
```

```csharp
// AutoGun.cs — Start 첫 부분
if (data != null)
{
    range = data.gunRange;
    fireInterval = data.gunFireInterval;
    damage = data.gunDamage;
    pierce = data.gunPierce;
}
```

> 🚨 **여기가 087에서 배운 함정이 실제로 걸리는 자리다.**
> 업그레이드는 **런타임 필드**를 올린다. SO 는 그대로다.
> 만약 SO 를 직접 올렸다면 **다음 판에도 칼이 8개**인 채로 시작한다.
>
> 💬 "한 판 하고 나면 영구히 세지는 게임, 재밌을까요? **아니죠.**"

### ④ 폴더 하나를 연다 (6분)

`Assets/_Project/Data/` 를 열어 보여준다.

```
Enemy_Charger    Enemy_Runner    Enemy_Tank    WeaponData
```

> 🎉 💬 "**이 게임의 수치가 전부 여기 있습니다.** 파일 네 개예요."
> 💬 "코드를 한 줄도 안 열고 밸런싱할 수 있습니다."

**즉석 밸런싱을 해본다.** (087에서 15분 걸린 걸 30초에)

- 러너 속도 `5.5 → 8` → Play → **너무 빠르다** → `6.5` → Play
- 칼 개수 `3 → 6` → Play → **너무 세다** → `4` → Play

> 💬 "컴파일이 없죠. **Play 를 껐다 켜기만** 하면 됩니다."

---

## 01:00–01:35 · 개인 미션

### 필수 미션 — 전면 적용

1. `Enemy_Runner` · `Enemy_Tank` 에셋을 만들고 프리팹에 연결한다
2. `WeaponData` 스크립트와 에셋을 만든다
3. `MeleeRing` · `AutoGun` 이 `Start` 에서 읽게 고친다
4. 원래 `[SerializeField]` 였던 수치 필드에서 애트리뷰트를 뗀다

```csharp
// MeleeRing.cs
[SerializeField] private WeaponData data;
[SerializeField] private GameObject bladePrefab;

// TODO ①: 아래 필드들에서 [SerializeField] 를 떼세요 (이제 SO 에서 온다)
private int bladeCount = 3;
private float radius = 2f;
private float rotateSpeed = 180f;
private int bladeDamage = 3;
private float hitInterval = 0.3f;

private void Start()
{
    // TODO ②: data 가 있으면 다섯 개 값을 복사하세요


    Build();
}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
private void Start()
{
    if (data != null)
    {
        bladeCount = data.bladeCount;
        radius = data.bladeRadius;
        rotateSpeed = data.bladeRotateSpeed;
        bladeDamage = data.bladeDamage;
        hitInterval = data.bladeHitInterval;
    }

    Build();
}
```

```csharp
// AutoGun.cs
private void Start()
{
    if (data != null)
    {
        range = data.gunRange;
        fireInterval = data.gunFireInterval;
        damage = data.gunDamage;
        pierce = data.gunPierce;
    }

    StartCoroutine(FireRoutine());
}
```

씬과 프리팹도 확인한다.

| 항목 | 확인할 것 |
|---|---|
| `Enemy_Charger/Runner/Tank` 프리팹 | `Data` 칸이 각각 다른 에셋 |
| `Blades` 의 `MeleeRing` | `Data` = `WeaponData` |
| `Player` 의 `AutoGun` | `Data` = `WeaponData` |

</details>

**확인 조건**: `Data` 폴더의 파일만 고쳐도 게임이 바뀐다.
업그레이드를 여러 번 받고 게임을 다시 시작하면 **원래 수치로 돌아온다**.

### ⭐ 도전 미션

- [ ] 러너 속도를 `8` 로 올려 **너무 빠른지** 확인하고 자기 값을 정한다
- [ ] `WeaponData` 에셋을 **두 개** 만들어 "쉬움/어려움" 으로 바꿔 끼워본다
- [ ] SO 를 `Start` 가 아니라 `Awake` 에서 읽게 바꿔본다 — 차이가 있는지 확인
- [ ] 탱커의 `damageReduction` 을 SO 로 옮겨보고 **왜 별로인지** 쓴다
- [ ] `EnemyData` 에 스프라이트 칸을 추가한다
- [ ] `Data` 폴더에 `README.txt` 를 만들어 각 값의 뜻을 적는다
- [ ] SO 값을 게임 중에 직접 바꾸고 다음 판에 남는지 확인한다 (그리고 되돌린다)

> 💡 두 번째가 SO 의 진짜 힘이다. **에셋만 갈아끼우면 난이도가 통째로 바뀐다.**

---

## 01:35–01:50 · 데모 + 정리

**마무리 정리 (한 장)**

| 질문 | 답 |
|---|---|
| 여럿이 공유하는 값인가? | **SO 로 뺀다** |
| 그 종류만 쓰는 값인가? | 컴포넌트에 남긴다 |
| 종류가 계속 늘어나는가? | 에셋을 **종류마다** 만든다 (몬스터) |
| 지금 두 개뿐인가? | 에셋 **하나**에 같이 둔다 (무기) |
| 게임 중에 변하는가? | **런타임 필드**로 복사해 쓴다 |

> 💬 "**전부 빼는 게 정답이 아닙니다.** 빼면 좋은 것만 뺍니다."

---

## ✅ 체크리스트 (학생)

- [ ] 몬스터 3종이 각자 SO 를 쓴다
- [ ] `WeaponData` 를 만들고 무기 둘이 읽는다
- [ ] 원래 수치 필드에서 `[SerializeField]` 를 뗐다
- [ ] `Data` 폴더만 고쳐 밸런싱했다
- [ ] 업그레이드를 받아도 SO 는 안 바뀐다
- [ ] 탱커 감소율을 **왜 안 뺐는지** 말할 수 있다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **한 종류만 SO 값** | 나머지 프리팹 `Data` 칸이 비었다 | **오늘 1등** |
| 세 종류가 다 같은 모습 | 세 프리팹에 **같은 에셋**을 연결 | 각각 다른 에셋 |
| 무기 값이 안 바뀜 | `Start` 에서 안 읽음 | `MeleeRing` / `AutoGun` |
| Inspector 에 값이 두 벌 | `[SerializeField]` 를 안 뗌 | 하나만 남긴다 |
| **다음 판에도 칼이 8개** | SO 를 직접 올렸다 | 런타임 필드로 (087) |
| 칼이 0개 | `bladeCount` 초기값이 0 | SO 값 확인 |
| 색이 안 바뀜 | `ApplyData` 순서 | `GetComponent` 뒤에 |
| `NullReferenceException` | `data` 가 `null` | `if (data != null)` |
| 에셋 이름이 헷갈림 | 규칙이 없다 | `Enemy_` / `Upgrade_` 접두사 |
| 실수로 값을 바꿔 저장됨 | SO 의 특성 | git 으로 되돌린다 |

## 📮 다음 시간 예고

> "몬스터와 무기는 뺐습니다. 그런데 **업그레이드 8종은 아직 코드에 있어요.**"
>
> "`switch` 안에 `45f`, `0.6f`, `5` 같은 숫자가 그대로 박혀 있죠."
>
> "다음 시간에 그것도 뺍니다. 그러고 나면
> **업그레이드를 하나 추가하는 데 코드를 한 줄도 안 고칩니다.**
> 에셋을 하나 만들어 배열에 넣기만 하면 돼요."
