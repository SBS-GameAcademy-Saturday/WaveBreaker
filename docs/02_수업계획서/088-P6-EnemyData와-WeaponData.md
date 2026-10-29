# 088회차 · 수치를 전부 폴더 하나로

| | |
|---|---|
| **Phase** | 6 · 성장 시스템 |
| **소요** | 2시간 (비대면) |
| **선행** | 087회차 (`EnemyData`), 072회차 (몬스터 3종), 076~079회차 (무기) |
| **오늘 배우는 것** | 무엇을 데이터로 빼고 무엇을 남길지 정하기, **클래스를 지우는 판단** |
| **씬** | `Game.unity` |
| **준비물(강사)** | SO 전면 적용 완성본, `Data` 폴더 화면 |

## 🎯 오늘의 목표

1. 몬스터 **3종 전부** SO 로 뺀다
2. **무기 수치**도 SO 로 뺀다
3. **어디까지 뺄지** 스스로 판단한다 — 그러다 **클래스 세 개가 사라진다**

> ⚠️ **오늘 안 하는 것**: 업그레이드 SO(089), 보스(090).
>
> 🔑 **설계 의도**: 087은 "SO 가 뭔지" 였다. 오늘은 **"어디까지 뺄지"** 다.
> 끝까지 빼면 `ChargerEnemy`·`RunnerEnemy`·`TankEnemy` 가 **전부 없어지고 프리팹도 하나가 된다.**
> 그게 오늘의 결말이고, **학생이 직접 그 결론에 도달하게** 한다.

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
| `Enemy_Charger` | 20 | 2 | 2.0 | 흰색 | 1.0 |
| `Enemy_Runner` | 4 | 1 | 5.5 | 흰색 | 0.85 |
| `Enemy_Tank` | 45 | 4 | 1.1 | 흰색 | 1.3 |

▶ Play → 세 종류가 **전부 SO 값**으로 동작한다.

> 💬 "코드는 **한 줄도 안 고쳤습니다.** 087에서 `Enemy` 부모에 넣어놨으니까요."
> 💬 "070에서 상속을 쓴 게 여기서 또 값을 합니다. **부모에 한 번**이면 자식 전부."

### ② 어디까지 뺄까 (14분) — 오늘의 핵심

> 💬 "탱커의 **피해 감소 50%** 도 SO 에 넣을까요?"

학생 답을 기다린다. 보통 "쓰지도 않는 칸이 생기니까 안 된다" 가 나온다. **좋은 반론이다.**

**칠판 — 반론을 먼저 적는다**

```
EnemyData 에 damageReduction 을 넣으면
┌──────────────────────────────┐
│ Enemy_Charger   감소 ?        │  ← 안 쓰는데?
│ Enemy_Runner    감소 ?        │  ← 안 쓰는데?
│ Enemy_Tank      감소 0.5      │
└──────────────────────────────┘
```

> 💬 "맞아요, 칸이 생깁니다. 그런데 **거기 뭘 적죠?**"

학생 답을 기다린다. **"0"** 이 나온다.

> 🔑 💬 "`0` 은 **빈 칸이 아닙니다.** '감소 없음' 이라는 **뜻이 있는 값**이에요."
> 💬 "`damageReduction = 0` 인 몬스터는 그냥 **감소를 안 하는 몬스터**입니다. 말이 되죠?"

**판단 기준을 정한다.**

| 질문 | 데이터로 뺀다 | 코드에 남긴다 |
|---|---|---|
| **기본값으로 의미가 성립하나?** | `damageReduction = 0` → "감소 없음" ✅ | — |
| **값이 아니라 공식인가?** | — | `(1 − 감소율)` 을 곱하고 **최소 1 보장** |
| **죽을 때 하는 일이 다른가?** | — | `Die()` 를 override 한다 (090 보스) |

> 💬 "**값은 데이터, 판단은 코드**입니다. 오늘 이 한 줄만 가져가세요."

#### 그래서 어디까지 가나 — 직접 세어 본다

> 💬 "이 기준으로 세 클래스를 다시 봅시다. **뭐가 남나요?**"

**칠판**

```
TankEnemy
  damageReduction = 0.5   →  값.    EnemyData 로
  (1-감소)곱하고 최소 1   →  공식.  Enemy.TakeDamage 로 올린다
  ─────────────────────────────────────────────
  남는 것: 없음                              ← 클래스가 빈다

ChargerEnemy
  chargeDamage = 3        →  값.    EnemyData.damage 와 같은 것
  OnCollisionEnter2D      →  모든 적이 똑같이 한다. 부모로 올린다
  ─────────────────────────────────────────────
  남는 것: 없음                              ← 클래스가 빈다

RunnerEnemy
  (072에서 이미 수치만 달랐다)
  ─────────────────────────────────────────────
  남는 것: 없음                              ← 클래스가 빈다
```

> 💬 "**세 개가 다 비었습니다.** 빈 클래스를 남겨둘까요?"

**지운다.** `Enemy` 의 `abstract` 도 뗀다 — 이제 혼자 쓸 수 있는 클래스다.

```csharp
// 전
public abstract class Enemy : MonoBehaviour, IDamageable
// 후
public class Enemy : MonoBehaviour, IDamageable
```

#### 프리팹도 하나가 된다

| | 전 | 후 |
|---|---|---|
| 스크립트 | `Enemy` + 자식 3개 | **`Enemy` 하나** |
| 프리팹 | `Enemy_Charger`·`Enemy_Runner`·`Enemy_Tank` | **`Enemy_Base` 하나** |
| 적 종류를 늘리려면 | 스크립트 + 프리팹 | **에셋 1개** |

> 🎉 💬 "이제 몬스터를 **열 종류** 만들어도 스크립트가 하나입니다."
> 💬 "그림과 숫자만 다르면 **에셋만 만들면 돼요.**"

#### 🚨 그럼 072에서 배운 상속은 헛거였나

**반드시 짚는다.** 안 짚으면 학생이 혼란스러워한다.

> 💬 "072에서 `override` 를 배웠는데, 오늘 그걸 다 지웠어요. **헛수고였을까요?**"

> 🔑 💬 "아니요. **지울 수 있는지 판단하려면 먼저 쓸 줄 알아야 합니다.**"
> 💬 "그리고 **지금은** 지울 수 있는 거예요. 090에서 보스가 나오면 다시 생깁니다 —
>    보스는 '죽으면 승리 화면' 이라는 **행동**이 다르거든요. 숫자가 아니라요."
> 💬 "상속은 **미리 까는 게 아니라, 필요해질 때 꺼내는** 도구입니다."

> 💡 실무에서 가장 흔한 실수가 **"나중에 쓸 것 같아서" 클래스를 미리 나누는 것**이다.
> 오늘 수업이 그 반대를 보여준다. **필요 없어지면 지운다.**

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
| `Enemy_Base` 프리팹 | 스크립트가 `Enemy` 하나. 자식 클래스가 안 붙어 있다 |
| `WaveManager` 의 `Enemy Prefabs` | **같은 프리팹 3개**가 아니라, 소환할 때 에셋을 끼운다 |
| `Blades` 의 `MeleeRing` | `Data` = `WeaponData` |
| `Player` 의 `AutoGun` | `Data` = `WeaponData` |

</details>

**확인 조건**: `Data` 폴더의 파일만 고쳐도 게임이 바뀐다.
업그레이드를 여러 번 받고 게임을 다시 시작하면 **원래 수치로 돌아온다**.

### ⭐ 도전 미션

- [ ] 러너 속도를 `8` 로 올려 **너무 빠른지** 확인하고 자기 값을 정한다
- [ ] `WeaponData` 에셋을 **두 개** 만들어 "쉬움/어려움" 으로 바꿔 끼워본다
- [ ] SO 를 `Start` 가 아니라 `Awake` 에서 읽게 바꿔본다 — 차이가 있는지 확인
- [ ] `EnemyData` 에셋을 **하나 더** 만들어 네 번째 몬스터를 추가한다 (스크립트 없이)
- [ ] `EnemyData` 에 스프라이트 칸을 추가한다
- [ ] `Data` 폴더에 `README.txt` 를 만들어 각 값의 뜻을 적는다
- [ ] SO 값을 게임 중에 직접 바꾸고 다음 판에 남는지 확인한다 (그리고 되돌린다)

> 💡 두 번째가 SO 의 진짜 힘이다. **에셋만 갈아끼우면 난이도가 통째로 바뀐다.**

---

## 01:35–01:50 · 데모 + 정리

**마무리 정리 (한 장)**

| 질문 | 답 |
|---|---|
| 기본값으로 의미가 성립하나? | **SO 로 뺀다** (`감소 0` = 감소 없음) |
| 값이 아니라 **공식**인가? | 코드에 남긴다 (최소 1 보장 같은 것) |
| 빼고 나니 클래스가 비었나? | **지운다.** 빈 클래스는 남기지 않는다 |
| 종류가 계속 늘어나는가? | 에셋을 **종류마다** 만든다 (몬스터) |
| 지금 두 개뿐인가? | 에셋 **하나**에 같이 둔다 (무기) |
| 게임 중에 변하는가? | **런타임 필드**로 복사해 쓴다 |

> 💬 "**전부 빼는 게 정답이 아닙니다.** 빼면 좋은 것만 뺍니다."

---

## ✅ 체크리스트 (학생)

- [ ] 몬스터 3종이 **프리팹 하나 + 에셋 3개**로 돈다
- [ ] `WeaponData` 를 만들고 무기 둘이 읽는다
- [ ] 원래 수치 필드에서 `[SerializeField]` 를 뗐다
- [ ] `Data` 폴더만 고쳐 밸런싱했다
- [ ] 업그레이드를 받아도 SO 는 안 바뀐다
- [ ] 자식 클래스 3개를 지웠고, **왜 지워도 되는지** 말할 수 있다
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
