# 087회차 · 코드를 안 고치고 밸런싱한다

| | |
|---|---|
| **Phase** | 6 · 성장 시스템 |
| **소요** | 2시간 (비대면) |
| **선행** | 086회차 (8종), 046회차 (프리팹), 037회차 (`[SerializeField]`) |
| **오늘 배우는 것** | `ScriptableObject`, `[CreateAssetMenu]` |
| **씬** | `Game.unity` |
| **준비물(강사)** | **밸런싱 지시문(칠판에 미리 적어둔다)**, SO 완성본 |

## 🎯 오늘의 목표

1. **불편을 먼저 겪는다** — 수치 여덟 군데를 손으로 고친다
2. `ScriptableObject` 가 **왜** 필요한지 안다
3. 첫 SO 로 **`EnemyData`** 를 만든다

> ⚠️ **오늘 안 하는 것**: 전면 적용(088), 업그레이드 SO(089).
> 오늘은 **돌진형 하나**만 SO 로 바꾼다. "되네?" 까지다.
>
> 🔑 **설계 의도**: 🔴 **순서를 절대 바꾸지 않는다.**
> SO 를 먼저 설명하면 "왜 굳이 파일을 따로 만들죠?" 가 나오고 학생은 **코드만 베낀다.**
> 15분간 직접 고생시킨 뒤에 꺼내야 한다. 그 15분이 이 회차의 절반이다.

## 📦 오늘의 제출물

**`Enemy_Charger.asset` 을 만들고 Inspector 에서 체력만 바꿔 반영되는 GIF (10초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:15 | 🔴 **밸런싱 지옥** (직접 고치기) ★ |
| 00:15–00:25 | 뭐가 문제였나 |
| 00:25–00:55 | 같이 하기 — SO 만들기 → 읽기 → 확인 |
| 00:55–01:05 | 휴식 |
| 01:05–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + 정리 |
| 01:50–02:00 | 체크리스트 + 제출 |

---

## 00:00–00:15 · 밸런싱 지옥 ★ — 반드시 시킨다

> 💬 "밸런싱을 하겠습니다. **제가 부르는 대로 고치세요.** 15분 드립니다."

**칠판에 미리 적어둔다.**

```
칼 회전 +        45  →  60
이동 +          0.6 →  0.4
최대 체력 +       5  →  8
연사 하한       0.12 → 0.15
돌진형 체력      10  →  12
러너 속도       5.5  →  6.5
탱커 피해 감소   50% →  40%
```

학생들은 이렇게 한다.

1. `LevelUpView.cs` 를 열어 `switch` 의 숫자를 고친다
2. 저장 → 유니티로 전환 → **컴파일 대기**
3. `Enemy_Charger` 프리팹을 열어 체력을 고친다
4. `Enemy_Runner` 프리팹을 열어 속도를 고친다
5. `TankEnemy.cs` 를 열어 감소율을 고친다
6. 저장 → **컴파일 대기**
7. Play → 확인 → 마음에 안 듦 → **1번부터 다시**

> 🚨 **강사는 도와주지 않는다.** 순회만 한다. 15분을 꽉 채운다.
> 중간에 "몇 개 파일 열었어요?" 를 한 번 묻는다.

---

## 00:15–00:25 · 뭐가 문제였나

> 💬 "몇 개 파일을 열었나요?" (보통 4~5개 + 프리팹 2~3개)
> 💬 "몇 번 컴파일을 기다렸나요?"

**칠판에 정리한다.**

| 문제 | 왜 아픈가 |
|---|---|
| 파일을 여러 개 연다 | 어디에 뭐가 있는지 외워야 한다 |
| 고칠 때마다 **컴파일** | 숫자 하나 바꾸는 데 몇 초씩 |
| 코드를 못 짜면 밸런싱도 못 한다 | **기획자·디자이너가 손을 못 댄다** |
| 값이 코드에 섞여 있다 | 실수로 로직을 건드린다 |

> 💬 "게임 회사에서 밸런싱은 **기획자**가 합니다. 그 사람들이 코드를 열어야 할까요?"
> 💬 "**수치를 코드 밖으로 빼야 합니다.** 그게 오늘 배울 겁니다."

**그럼 왜 `[SerializeField]` 로는 부족한가** — 반드시 나온다.

> 💬 "037에서 `[SerializeField]` 배웠죠. 그걸로 Inspector 에서 고칠 수 있잖아요?"
>
> | | `[SerializeField]` | ScriptableObject |
> |---|---|---|
> | 어디에 저장되나 | **그 오브젝트 하나에** | **에셋 파일 하나에** |
> | 프리팹 3종의 값 | 프리팹 3개를 각각 | **에셋 3개**, 관리가 같다 |
> | 같은 값을 여럿이 공유 | 못 한다 | **한 파일을 여럿이 본다** |
> | 씬 없이 열어보기 | 프리팹을 열어야 | **Project 창에서 바로** |
>
> 💬 "결정적인 건 마지막입니다. **에셋 파일 하나만 클릭하면 수치가 보입니다.**"

---

## 00:25–00:55 · 같이 하기 ★

### ① 첫 ScriptableObject 를 만든다 (12분)

`Scripts/Data/EnemyData.cs`

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "Enemy_", menuName = "WaveBreaker/Enemy Data")]
public class EnemyData : ScriptableObject
{
    [Header("이름")]
    public string title = "몬스터";

    [Header("수치")]
    public int maxHealth = 10;
    public int damage = 1;
    public float moveSpeed = 2f;

    [Header("겉모습")]
    public Color color = Color.white;
    public float scale = 1f;
}
```

**한 조각씩 짚는다.**

| 조각 | 뜻 |
|---|---|
| `: ScriptableObject` | **`MonoBehaviour` 가 아니다.** 오브젝트에 못 붙인다 |
| `[CreateAssetMenu]` | Project 창 **Create 메뉴**에 항목이 생긴다 |
| `menuName` | 메뉴에 보일 경로 |
| `fileName` | 새로 만들 때 기본 파일 이름 |
| `public` 필드 | SO 는 보통 `public` 으로 둔다 (데이터 덩어리라서) |
| `[Header]` | Inspector 에 구분선이 생긴다 |

> 🚨 **`[CreateAssetMenu]` 를 빼면 에셋을 만들 방법이 없다.**
> 일부러 빼고 Create 메뉴를 열어 보여준다. 항목이 없다.

### ② 에셋을 만든다 (6분)

`Assets/_Project/Data/` 폴더를 만들고,
**Project 창 우클릭 → Create → WaveBreaker → Enemy Data** → 이름 `Enemy_Charger`

| 값 | |
|---|---|
| Title | 돌진형 |
| Max Health | 10 |
| Damage | 1 |
| Move Speed | 2 |
| Color | 빨강 `(0.95, 0.30, 0.30)` |
| Scale | 1 |

> 🎉 💬 "**이게 파일입니다.** 코드가 아니에요. Project 창에서 클릭하면 수치가 보입니다."
> 💬 "이 파일을 기획자한테 주면 **혼자 밸런싱할 수 있어요.**"

### ③ 읽어서 쓴다 (14분) — 오늘의 핵심

`Enemy.cs` 를 고친다.

```csharp
[SerializeField] protected EnemyData data;

protected int maxHealth = 10;
protected int damage = 1;
protected float moveSpeed = 2f;

protected virtual void Awake()
{
    rb = GetComponent<Rigidbody2D>();
    sprite = GetComponent<SpriteRenderer>();

    ApplyData();
}

// SO 의 값을 런타임 필드로 옮긴다. 그 뒤로는 SO 를 건드리지 않는다.
protected virtual void ApplyData()
{
    if (data == null) return;

    maxHealth = data.maxHealth;
    damage = data.damage;
    moveSpeed = data.moveSpeed;

    if (sprite != null) sprite.color = data.color;

    transform.localScale = Vector3.one * data.scale;
}
```

> ⚠️ **`[SerializeField]` 였던 `maxHealth` 들에서 애트리뷰트를 뗀다.**
> 이제 Inspector 가 아니라 **SO 에서** 값이 온다. 두 군데에 있으면 헷갈린다.

`Enemy_Charger` 프리팹의 `Data` 칸에 방금 만든 에셋을 넣는다.

▶ Play → 돌진형이 **그대로 동작한다.** 색도 크기도 SO 값이다.

### ④ 🚨 SO 의 함정 (8분) — 반드시 짚는다

> 💬 "**Play 중에 SO 값을 바꿔보세요.** 체력을 100으로."

▶ Play 중 `Enemy_Charger.asset` 을 클릭하고 Max Health 를 `100` 으로 → **Stop** → 다시 보면?

```
Max Health = 100   ← 그대로 남아 있다!
```

> 🔑 💬 "**일반 컴포넌트는 Play 중 바꾼 게 되돌아갑니다.** 037에서 배웠죠."
> 💬 "**SO 는 안 되돌아갑니다.** 파일이니까요. 저장된 겁니다."
>
> 💬 "이건 **장점이자 함정**입니다. 밸런싱할 땐 편하고, 실수로 바꾸면 그대로 남아요."

**그래서 우리 코드는 이렇게 한다.**

```
SO  →  (Awake 에서 한 번 복사)  →  런타임 필드  →  게임 중엔 이것만 바뀐다
```

> 💬 "업그레이드로 값이 올라도 **SO 파일은 그대로**입니다. 다음 판은 다시 원래 값으로 시작해요."
> 💬 "만약 SO 를 직접 고쳤다면? **한 판 할 때마다 영구히 세지는** 게임이 됩니다."

---

## 01:05–01:35 · 개인 미션

### 필수 미션 — EnemyData

```csharp
// Scripts/Data/EnemyData.cs
using UnityEngine;

// TODO ①: Project 창 Create 메뉴에 나오게 만드세요
//   메뉴 이름: WaveBreaker/Enemy Data, 기본 파일명: Enemy_
public class EnemyData
{
    // TODO ②: title · maxHealth · damage · moveSpeed · color · scale 을 public 으로
    //   [Header] 로 묶으면 보기 좋습니다
}
```

```csharp
// Enemy.cs
// TODO ③: EnemyData 를 Inspector 에 노출하세요

// TODO ④: Awake 에서 ApplyData() 를 부르세요

// TODO ⑤: ApplyData() — data 가 null 이면 나가고, 아니면 값을 복사하세요
//   체력 · 피해 · 속도 · 색 · 크기
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "Enemy_", menuName = "WaveBreaker/Enemy Data")]
public class EnemyData : ScriptableObject
{
    [Header("이름")]
    public string title = "몬스터";

    [Header("수치")]
    public int maxHealth = 10;
    public int damage = 1;
    public float moveSpeed = 2f;

    [Header("겉모습")]
    public Color color = Color.white;
    public float scale = 1f;
}
```

```csharp
// Enemy.cs
[SerializeField] protected EnemyData data;

protected virtual void Awake()
{
    rb = GetComponent<Rigidbody2D>();
    sprite = GetComponent<SpriteRenderer>();

    ApplyData();
}

protected virtual void ApplyData()
{
    if (data == null) return;

    maxHealth = data.maxHealth;
    damage = data.damage;
    moveSpeed = data.moveSpeed;

    if (sprite != null) sprite.color = data.color;

    transform.localScale = Vector3.one * data.scale;
}
```

</details>

**확인 조건**: `Enemy_Charger.asset` 이 Project 창에 있다.
그 파일에서 체력·색·크기를 바꾸면 **코드를 안 고치고** 게임에 반영된다.

### ⭐ 도전 미션

- [ ] `[CreateAssetMenu]` 를 지우고 Create 메뉴를 열어본다 (그리고 되돌린다)
- [ ] Play 중에 SO 값을 바꾸고 Stop → **남아 있는 걸** 확인한다
- [ ] 같은 SO 를 **프리팹 두 개**에 연결하고 값 하나를 바꿔본다
- [ ] `[Range(0, 100)]` 을 붙여 Inspector 에 슬라이더를 만든다
- [ ] `[TextArea]` 로 설명 칸을 여러 줄로 만든다
- [ ] `ApplyData` 를 `Awake` 가 아니라 `Start` 에서 부르면 뭐가 달라지는지 확인한다
- [ ] SO 에 스프라이트 칸을 추가해 몬스터 그림도 데이터로 뺀다

> 💡 세 번째가 **SO 의 진짜 값어치**다. 파일 하나를 고치면 그걸 쓰는 모두가 바뀐다.

---

## 01:35–01:50 · 데모 + 정리

**마무리 정리 (한 장)**

| ScriptableObject | |
|---|---|
| 무엇인가 | **데이터만 담는 에셋 파일.** 오브젝트에 못 붙인다 |
| 왜 쓰나 | 코드를 안 고치고 수치를 바꾼다 |
| 필수 애트리뷰트 | `[CreateAssetMenu]` |
| 함정 | **Play 중 바꾼 값이 저장된다** |
| 우리 규칙 | `Awake` 에서 **런타임 필드로 복사**해 쓴다 |

> 💬 "오늘 앞에서 15분 고생한 게 **이걸 배우려고** 한 겁니다."
> 💬 "다음부터 '수치가 코드에 박혀 있네' 싶으면 **SO 를 떠올리세요.**"

---

## ✅ 체크리스트 (학생)

- [ ] 15분간 직접 고쳐봤다 (몇 파일인지 세어봤다)
- [ ] `EnemyData` 가 `ScriptableObject` 를 상속한다
- [ ] `[CreateAssetMenu]` 를 붙였다
- [ ] Create 메뉴에서 에셋을 만들었다
- [ ] `Enemy.Awake` 에서 SO 값을 복사한다
- [ ] 코드를 안 고치고 체력을 바꿔봤다
- [ ] **Play 중 바꾼 SO 값이 남는다**는 걸 확인했다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **Create 메뉴에 안 나옴** | `[CreateAssetMenu]` 누락 | **오늘 1등** |
| Create 메뉴에 안 나옴 (2) | 클래스명 ≠ 파일명 | 유니티 규칙 |
| `AddComponent` 가 안 됨 | SO 는 컴포넌트가 아니다 | **의도된 것** |
| **값이 반영 안 됨** | 프리팹 `Data` 칸이 비었다 | **오늘 2등.** Inspector |
| 값이 반영 안 됨 (2) | `ApplyData` 를 안 부름 | `Awake` 확인 |
| 색이 안 바뀜 | `sprite` 가 `null` | `GetComponent` 순서 |
| Inspector 에 값이 두 벌 | `[SerializeField]` 를 안 뗌 | 하나만 남긴다 |
| **Play 중 바꾼 게 남음** | SO 의 정상 동작 | **오늘의 수업 내용** |
| 업그레이드가 다음 판에도 남음 | SO 를 직접 고쳤다 | 런타임 필드로 복사한다 |
| 에셋을 지웠더니 에러 | 참조가 끊겼다 | 다시 연결 |
| SO 에 `Update` 를 썼는데 안 돎 | SO 는 씬에 없다 | 데이터만 담는다 |

## 📮 다음 시간 예고

> "돌진형 하나만 바꿨습니다. 나머지는 아직 코드에 있죠."
>
> "다음 시간엔 **러너·탱커까지 세 종류 전부**, 그리고 **무기 수치**도 뺍니다."
>
> "그러고 나면 `Assets/_Project/Data/` 폴더 하나만 열면
> **이 게임의 모든 수치가 한눈에** 보입니다."
