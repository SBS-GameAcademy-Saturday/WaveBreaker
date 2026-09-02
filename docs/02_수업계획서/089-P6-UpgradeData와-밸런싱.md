# 089회차 · 코드를 안 고치고 카드를 늘린다

| | |
|---|---|
| **Phase** | 6 · 성장 시스템 |
| **소요** | 2시간 (비대면) |
| **선행** | 088회차 (SO 전면 적용), 085·086회차 (3택 1 · 8종) |
| **오늘 배우는 것** | 데이터로 분기 줄이기, **밸런싱 실습** |
| **씬** | `Game.unity` |
| **준비물(강사)** | `Upgrade_*` 에셋 8개, **밸런싱 목표표** |

## 🎯 오늘의 목표

1. 업그레이드 8종을 **에셋 8개**로 뺀다
2. 카드를 추가할 때 **코드를 안 고친다**
3. **직접 밸런싱**해서 자기 게임을 만든다

> ⚠️ **오늘 안 하는 것**: 보스(090).
>
> 🔑 **설계 의도**: 087·088이 "왜/어디까지" 였다면 오늘은 **"그래서 뭐가 좋아지나"** 다.
> 후반 40분을 통째로 **밸런싱 실습**에 쓴다. 코드를 한 줄도 안 치는 시간이다.
> **그게 오늘의 목적이다.** 학생이 처음으로 "기획자" 를 해본다.

## 📦 오늘의 제출물

**내가 만든 9번째 업그레이드 카드 + 밸런싱한 게임 영상 (30초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 |
| 00:10–00:50 | 같이 하기 — `UpgradeData` → 배열 → 9번째 카드 |
| 00:50–01:00 | 휴식 |
| 01:00–01:40 | 🎯 **밸런싱 실습** ★ |
| 01:40–01:50 | 데모 |
| 01:50–02:00 | 체크리스트 + 제출 |

---

## 00:00–00:10 · 복습 퀴즈

1. 여럿이 공유하는 값은 어디에? → **SO 로 뺀다** (088)
2. 그 종류만 쓰는 값은? → 컴포넌트에 남긴다 (088)
3. 게임 중 변하는 값은 어떻게? → **런타임 필드로 복사** (087)

---

## 00:10–00:50 · 같이 하기 ★

### ① 업그레이드도 데이터다 (10분)

**지금 코드를 띄운다.**

```csharp
case UpgradeType.BladeSpeed:  meleeRing.AddRotateSpeed(45f);    break;
case UpgradeType.MoveSpeed:   playerController.SpeedUp(0.6f);   break;
case UpgradeType.MaxHealth:   playerHealth.AddMaxHealth(5);     break;
```

> 💬 "`45f`, `0.6f`, `5`. **또 코드에 박혀 있죠.**"
> 💬 "그리고 `Describe()` 에 카드 글자도 박혀 있습니다."

`Scripts/Data/UpgradeData.cs`

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "Upgrade_", menuName = "WaveBreaker/Upgrade Data")]
public class UpgradeData : ScriptableObject
{
    public UpgradeType type;

    [Header("카드에 표시할 것")]
    public string title = "이름";
    [TextArea] public string description = "설명";

    [Header("얼마나 강해지나")]
    public float value = 1f;      // 종류마다 뜻이 다르다 (칼 개수 / 초당 각도 / 피해 …)
    public float minLimit = 0f;   // 간격처럼 "작을수록 좋은" 값의 하한
}
```

> 💬 "`value` 하나가 **종류마다 다른 뜻**입니다. 칼이면 개수, 회전이면 각도, 체력이면 회복량."
> 💬 "종류를 나누면 파일이 8종류가 됩니다. **하나로 두고 뜻만 다르게** 하는 게 낫습니다."

> 🚨 **`minLimit` 이 왜 필요한가**
> 연사만 "작을수록 좋은" 값이다. 하한이 없으면 간격이 음수가 된다(074·085·086).
> 다른 종류는 `0` 으로 두고 안 쓴다.

### ② 에셋 8개를 만든다 (10분)

| 파일 | type | title | value | minLimit |
|---|---|---|---|---|
| `Upgrade_BladeCount` | BladeCount | 칼 +1 | 1 | 0 |
| `Upgrade_BladeSpeed` | BladeSpeed | 칼 회전 + | 45 | 0 |
| `Upgrade_BladeDamage` | BladeDamage | 칼 피해 +1 | 1 | 0 |
| `Upgrade_FireRate` | FireRate | 연사 + | 0.06 | **0.12** |
| `Upgrade_GunDamage` | GunDamage | 총알 피해 +1 | 1 | 0 |
| `Upgrade_Pierce` | Pierce | 관통 +1 | 1 | 0 |
| `Upgrade_MoveSpeed` | MoveSpeed | 이동 + | 0.6 | 0 |
| `Upgrade_MaxHealth` | MaxHealth | 최대 체력 +5 | 5 | 0 |

### ③ 배열에서 뽑는다 (14분) — 오늘의 핵심

```csharp
[SerializeField] private UpgradeData[] upgrades;

private List<UpgradeData> PickThree()
{
    List<UpgradeData> pool = new List<UpgradeData>();

    foreach (UpgradeData u in upgrades)
    {
        if (u != null) pool.Add(u);
    }

    List<UpgradeData> result = new List<UpgradeData>();

    while (result.Count < 3 && pool.Count > 0)
    {
        int index = Random.Range(0, pool.Count);
        result.Add(pool[index]);
        pool.RemoveAt(index);   // 뽑은 건 빼야 중복이 안 나온다
    }

    return result;
}
```

카드 글자와 적용도 데이터에서 온다.

```csharp
UpgradeData data = picked[i];

labels[i].text = $"{data.title}\n<size=60%>{data.description}";

buttons[i].onClick.RemoveAllListeners();
buttons[i].onClick.AddListener(() => Choose(data));
```

```csharp
private void Apply(UpgradeData data)
{
    switch (data.type)
    {
        case UpgradeType.BladeCount:  meleeRing.AddBlade((int)data.value);        break;
        case UpgradeType.BladeSpeed:  meleeRing.AddRotateSpeed(data.value);       break;
        case UpgradeType.BladeDamage: meleeRing.AddBladeDamage((int)data.value);  break;
        case UpgradeType.FireRate:    autoGun.SpeedUp(data.value, data.minLimit); break;
        case UpgradeType.GunDamage:   autoGun.AddDamage((int)data.value);         break;
        case UpgradeType.Pierce:      autoGun.AddPierce((int)data.value);         break;
        case UpgradeType.MoveSpeed:   playerController.SpeedUp(data.value);       break;
        case UpgradeType.MaxHealth:   playerHealth.AddMaxHealth((int)data.value); break;
    }

    Debug.Log($"업그레이드 선택: {data.title} ({data.type})");
}
```

> 💬 "`switch` 는 남았죠. **'어떻게 적용하나' 는 코드가 맞습니다.**"
> 💬 "빠진 건 **'얼마나' 와 '뭐라고 쓸까'** 입니다. 그게 데이터예요."
>
> 🔑 **코드와 데이터를 나누는 기준**
> | | 어디에 |
> |---|---|
> | **어떻게** 동작하나 (로직) | 코드 |
> | **얼마나** · **뭐라고** (수치·글자) | 데이터 |

`LevelUpView` 의 `Upgrades` 배열에 에셋 8개를 넣는다.

▶ Play → 그대로 동작한다. **`Describe()` 는 통째로 지운다.**

### ④ 9번째 카드를 코드 없이 만든다 (6분)

> 💬 "**칼 피해 +3** 짜리 강한 카드를 하나 더 만들어봅시다. 코드를 열까요?"

1. `Upgrade_BladeDamage` 를 복사 (`Ctrl+D`) → 이름 `Upgrade_BladeDamageBig`
2. `title` = `칼 피해 +3`, `value` = `3`
3. `LevelUpView` 의 `Upgrades` 배열 크기를 `9` 로 늘리고 넣는다

▶ Play → **새 카드가 나온다.**

> 🎉 💬 "**코드를 한 줄도 안 고쳤습니다.**"
> 💬 "이게 SO 를 쓰는 이유예요. 콘텐츠가 늘어도 코드는 그대로입니다."

---

## 01:00–01:40 · 🎯 밸런싱 실습 ★

> 💬 "지금부터 **40분간 코드를 열지 않습니다.** `Data` 폴더만 고치세요."

### 목표를 준다 (칠판)

```
① 5분을 버틸 수 있게 만들어라
② 레벨을 10 이상 올릴 수 있게 만들어라
③ 그런데 너무 쉬우면 안 된다 — 한 번은 죽을 뻔해야 한다
```

### 만질 수 있는 것

| 파일 | 바꿀 수 있는 값 |
|---|---|
| `Enemy_Charger/Runner/Tank` | 체력 · 피해 · 속도 · 크기 |
| `WeaponData` | 칼 개수·반지름·회전·피해·간격 / 총 사거리·간격·피해·관통 |
| `Upgrade_*` (8~9개) | 얼마나 강해지나 |
| `PlayerLevel` (Inspector) | `baseExp` · `expStep` |
| `WaveManager` (Inspector) | 스폰 간격 · 웨이브 길이 |

### 진행 방식

1. **한 번에 하나만** 바꾼다
2. Play 해서 **실제로 해본다**
3. 어땠는지 한 줄 적는다
4. 다시 1번으로

> 🚨 **한 번에 여러 개를 바꾸면 뭐 때문에 달라졌는지 모른다.**
> 이건 밸런싱의 기본 규칙이다. 반드시 못 박는다.

**강사는 순회하며 이것만 묻는다.**

> 💬 "지금 뭘 바꿨어요? 그래서 어떻게 됐어요?"

### 기록지 (학생에게 나눠준다)

```
바꾼 것            전 → 후        결과
──────────────────────────────────────────────
러너 속도          5.5 → 6.5      피하기 어려워짐. 좋다
칼 개수            3 → 4          초반이 너무 쉬워짐. 되돌림
baseExp            5 → 4          레벨업이 잦아져 재밌다
...
```

---

## 01:40–01:50 · 데모

학생 4~5명. **바꾼 것 하나와 그 결과**를 말하게 한다.

> 💬 "**정답은 없습니다.** 여러분이 재밌다고 느낀 게 정답이에요."
> 💬 "오늘 40분 동안 한 게 게임 회사에서 **기획자가 하는 일**입니다."

---

## ✅ 체크리스트 (학생)

- [ ] `UpgradeData` 를 만들었다
- [ ] 에셋 8개를 만들고 배열에 넣었다
- [ ] `Describe()` 를 지웠다 (글자가 데이터에서 온다)
- [ ] `Apply` 가 `data.value` 를 쓴다
- [ ] **코드 없이** 9번째 카드를 추가했다
- [ ] 40분간 밸런싱하며 기록지를 채웠다
- [ ] 5분 버티기 / 10레벨을 시도해봤다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **카드가 안 나옴** | `Upgrades` 배열이 비었다 | **오늘 1등.** Inspector |
| 카드가 3장 미만 | 에셋을 3개 미만 넣음 | 8개를 다 넣는다 |
| `NullReferenceException` | 배열에 빈 칸 | `if (u != null)` |
| 연사가 음수 | `minLimit` 을 0으로 둠 | `0.12` |
| 칼이 3개씩 늘어남 | `value` 를 잘못 넣음 | `1` |
| 카드 글자가 그대로 | `Describe()` 를 아직 씀 | 데이터에서 읽는다 |
| 같은 카드가 두 장 | `RemoveAt` 누락 | 085 확인 |
| **한 번에 여러 개 바꿔서 원인 모름** | 밸런싱 규칙 위반 | **하나씩** |
| 값이 안 바뀜 | Play 를 안 껐다 켬 | `Start` 에서 읽는다 |
| 게임이 너무 쉬워짐 | 정상. 되돌리면 된다 | 기록지에 적게 한다 |
| 밸런싱을 안 하고 코드를 봄 | 습관 | 40분은 코드 금지 |

## 📮 다음 시간 예고

> "게임이 굴러가고, 강해지고, 밸런싱도 됩니다. 그런데 **끝이 없어요.**"
>
> "10분을 버텨도, 20분을 버텨도 똑같이 몬스터만 나옵니다. **이길 수가 없죠.**"
>
> "다음 시간에 **보스**가 나옵니다. 3분·6분·10분에 하나씩.
> 마지막 보스를 잡으면 **클리어**입니다. 처음으로 **이기는 게임**이 돼요.
> 그리고 그게 **Phase 6의 마지막**입니다."
