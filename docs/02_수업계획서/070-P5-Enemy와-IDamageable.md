# 070회차 · Enemy 와 IDamageable — 8주 전 코드를 꺼낸다

| | |
|---|---|
| **Phase** | 5 · 본 프로젝트 코어 |
| **소요** | 2시간 (비대면) |
| **선행** | 6주차 026–030회차 (상속·virtual·인터페이스), 069회차 |
| **오늘 배우는 것** | `abstract class`, `virtual/override`, `interface` **를 유니티에서** |
| **씬** | `Game.unity` |
| **준비물(강사)** | **6주차 콘솔 프로젝트를 열어둔다** (`Snapshot_P1`), 화면 공유 준비 |

## 🎯 오늘의 목표

1. **6주차에 콘솔로 짠 `Enemy` 를 그대로 꺼낸다**
2. `MonoBehaviour` 를 붙여 **화면 위 오브젝트**로 만든다
3. `IDamageable` 로 **플레이어와 몬스터를 같은 방식으로** 때린다

> ⚠️ **오늘 안 하는 것**: 몬스터가 움직이는 것(071), 몬스터 3종(072), 스폰(073).
> 오늘은 **구조만** 만든다. 몬스터는 가만히 서 있고, 부딪히면 아프다.
>
> 🔑 **설계 의도**: **이 과정의 투자 회수 지점이다.**
> 5·6주차에 학생 절반이 "이거 왜 배우죠" 했다. **오늘 그 답을 준다.**
> 콘솔 코드를 옆에 띄워놓고 **거의 그대로 복사**되는 걸 눈으로 보게 한다.
> 이 회차를 건너뛰면 상속을 **처음부터 다시** 가르쳐야 한다.

## 📦 오늘의 제출물

**몬스터에 부딪혀 플레이어 체력이 깎이는 Console 로그 스크린샷** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:15 | **6주차 콘솔 코드 다시 보기** ★ |
| 00:15–00:50 | 같이 하기 — `IDamageable` → `Enemy` → `ChargerEnemy` → `PlayerHealth` |
| 00:50–01:00 | 휴식 |
| 01:00–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + 정리 + **Phase 회고** |
| 01:50–02:00 | 체크리스트 + 제출 + `Snapshot_P5_Map` |

---

## 00:00–00:15 · 6주차 콘솔 코드 다시 보기 ★

> 🚨 **이 15분을 절대 줄이지 않는다.** 8주 전 내용이다. 다 잊었다고 가정한다.

### 그때 만든 것을 화면에 띄운다

`Snapshot_P1` 콘솔 프로젝트를 열고 **실행해서 보여준다.**

```
돌진형 몬스터 등장 (체력 10)
돌진형이 돌진했다! 3 피해
플레이어 : -3  (남은 체력 17)
```

> 💬 "이거 6주차에 여러분이 짠 겁니다. 기억나세요?"
> 💬 "오늘 이걸 **화면 위로 옮깁니다.** 새로 짜는 게 아니라 **옮기는** 거예요."

### 세 가지를 짚는다 (각 3분)

**① `abstract class` — 혼자서는 못 쓰는 부모**

```csharp
public abstract class Enemy
{
    protected int maxHealth;
    public virtual void Attack() { ... }
}
```

> 💬 "`Enemy` 자체는 못 만듭니다. **'몬스터'라는 몬스터는 없으니까요.**"
> 💬 "돌진형·원거리형·탱커형만 실제로 존재합니다."

**② `virtual` / `override` — 같은 이름, 다른 동작**

> 💬 "부모가 `Attack` 을 정해두고, 자식이 **자기 방식으로 바꿔 씁니다.**"

**③ `interface` — 부모가 달라도 되는 약속**

> 💬 "몬스터랑 플레이어는 **부모가 다릅니다.** 그런데 **둘 다 맞아야 해요.**"
> 💬 "그래서 '맞을 수 있다' 는 약속만 따로 뺐습니다. 그게 `IDamageable` 입니다."

**칠판**

```
        IDamageable  (맞을 수 있다)
         /        \
      Enemy    PlayerHealth      ← 부모가 서로 다르다
      /   \
  돌진형  탱커형
```

---

## 00:15–00:50 · 같이 하기 ★

### ① `IDamageable` 을 만든다 (5분)

`Scripts/IDamageable.cs`

```csharp
public interface IDamageable
{
    void TakeDamage(int amount);
}
```

> ⚠️ **`using UnityEngine;` 도 `MonoBehaviour` 도 없다.** 그냥 C# 이다.
> 💬 "6주차랑 **똑같죠.** 유니티랑 아무 상관 없는 순수 C# 입니다."

> 🚨 유니티에서 `Create → C# Script` 로 만들면 `MonoBehaviour` 클래스가 딸려온다.
> **안을 통째로 지우고** 위 3줄만 남긴다. **파일 이름과 이름이 같아야 한다.**

### ② `Enemy` 부모를 만든다 (12분)

`Scripts/Enemy/Enemy.cs`

```csharp
using UnityEngine;

public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;

    protected int currentHealth;

    protected virtual void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        Debug.Log($"{name} : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    protected virtual void Die()
    {
        Debug.Log($"{name} 사망");
        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
```

**한 조각씩 짚는다.**

| 조각 | 뜻 |
|---|---|
| `abstract class` | **혼자서는 오브젝트에 못 붙는다** |
| `: MonoBehaviour, IDamageable` | 유니티 부품이면서 **동시에** 맞을 수 있다 |
| `protected` | 자식만 쓸 수 있다 (`private` 이면 자식도 못 본다) |
| `protected virtual void Start()` | 자식이 **덮어쓸 수 있는** `Start` |
| `virtual void Attack` | 자식이 **자기 방식으로** 바꿔 쓴다 |

> 🚨 **`private void Start()` 를 쓰면 자식이 못 덮어쓴다.**
> 유니티가 만들어주는 기본 코드가 `private` 이라 여기서 많이 걸린다. `protected virtual` 로 고친다.

> 💬 "**50회차의 `Health.cs` 는요?**" — 좋은 질문이다.
> "그건 미니게임용이었습니다. 본 프로젝트에선 **몬스터가 체력을 직접 갖습니다.**
> 부품을 따로 두는 방식도 맞지만, 오늘은 **6주차 설계를 그대로** 가져오는 게 목적이에요."

**여기서 한 번 시도해 보여준다.** `Enemy.cs` 를 오브젝트에 끌어다 놓으면 —

```
Can't add script behaviour 'Enemy'. The script class can't be abstract!
```

> 💬 "**이게 `abstract` 입니다.** '몬스터'라는 몬스터는 못 만들어요."

### ③ `ChargerEnemy` 자식을 만든다 (10분)

`Scripts/Enemy/ChargerEnemy.cs`

```csharp
using UnityEngine;

public class ChargerEnemy : Enemy
{
    [SerializeField] private int chargeDamage = 3;

    protected override void Start()
    {
        base.Start();
        Debug.Log($"{name} : 돌진형 등장 (체력 {maxHealth})");
    }

    public override void Attack(IDamageable target)
    {
        target.TakeDamage(chargeDamage);
        Debug.Log($"{name} : 돌진! {chargeDamage} 피해");
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            Attack(target);
        }
    }
}
```

| 조각 | 뜻 |
|---|---|
| `: Enemy` | `MonoBehaviour` 를 **또 안 쓴다.** 부모가 이미 갖고 있다 |
| `override` | 부모의 `virtual` 을 **덮어쓴다** |
| `base.Start()` | **부모 것도 실행한다** (체력 채우기) |
| `TryGetComponent(out IDamageable ...)` | 049의 `GetComponent` 인데, **인터페이스로 찾는다** |

> 🚨 **`base.Start()` 를 빼먹으면 체력이 `0` 이다.** 첫 대미지에 바로 죽는다.
> 이번 Phase 사고 상위권이다. 일부러 빼고 실행해 보여준다.

**씬 설정**

| 오브젝트 | 부품 |
|---|---|
| `Enemy` (빈 오브젝트) | `Sprite Renderer` · `Rigidbody 2D` (Gravity Scale `0`) · `Circle Collider 2D` · `ChargerEnemy` |

### ④ `PlayerHealth` — 인터페이스의 진짜 이유 (8분)

`Scripts/Player/PlayerHealth.cs`

```csharp
using UnityEngine;

public class PlayerHealth : MonoBehaviour, IDamageable
{
    [SerializeField] private int maxHealth = 20;

    private int currentHealth;

    void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth = Mathf.Max(currentHealth - amount, 0);
        Debug.Log($"플레이어 : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth == 0)
        {
            Debug.Log("플레이어 사망");
        }
    }
}
```

▶ Play → 플레이어를 몬스터에 부딪힌다.

```
Enemy : 돌진형 등장 (체력 10)
Enemy : 돌진! 3 피해
플레이어 : -3  (남은 체력 17)
```

> 🎉 **여기가 오늘의 정점이다.**
>
> 💬 "`ChargerEnemy` 는 **플레이어를 모릅니다.** `PlayerHealth` 라는 이름도 몰라요."
> 💬 "아는 건 딱 하나 — **'맞을 수 있는 무언가'** 입니다. 그게 `IDamageable` 이에요."
> 💬 "그래서 나중에 **부술 수 있는 상자**를 만들어도, 몬스터 코드는 **한 줄도 안 바꿉니다.**"

> ⚠️ **`Rigidbody 2D` 가 없으면 `OnCollisionEnter2D` 가 안 불린다** (043).
> 둘 중 하나에는 반드시 있어야 한다.

---

## 01:00–01:35 · 개인 미션

### 필수 미션 — 상속 구조 옮기기

**`IDamageable.cs`**

```csharp
public interface IDamageable
{
    // TODO ①: 피해를 받는 메서드 하나. 몸통은 없다
}
```

**`Enemy.cs`**

```csharp
using UnityEngine;

// TODO ②: 혼자서는 못 붙는 클래스로 만들고, MonoBehaviour 와 IDamageable 을 둘 다 받으세요
public class Enemy : MonoBehaviour
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;

    protected int currentHealth;

    // TODO ③: 자식이 덮어쓸 수 있는 Start 로 만들고, 체력을 채우세요


    public void TakeDamage(int amount)
    {
        // TODO ④: 체력을 깎고 로그를 찍고, 0 이하면 Die()


    }

    // TODO ⑤: 자식이 덮어쓸 수 있는 Die. 오브젝트를 없앤다


    // TODO ⑥: 자식이 덮어쓸 수 있는 Attack(IDamageable target)

}
```

**`ChargerEnemy.cs`**

```csharp
using UnityEngine;

// TODO ⑦: Enemy 를 상속하세요
public class ChargerEnemy
{
    [SerializeField] private int chargeDamage = 3;

    // TODO ⑧: Start 를 덮어쓰되, 부모 Start 도 실행하세요


    // TODO ⑨: Attack 을 덮어써서 chargeDamage 만큼 주세요


    // TODO ⑩: 부딪힌 상대가 IDamageable 이면 Attack 하세요

}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
// IDamageable.cs
public interface IDamageable
{
    void TakeDamage(int amount);
}
```

```csharp
// Enemy.cs
using UnityEngine;

public abstract class Enemy : MonoBehaviour, IDamageable
{
    [SerializeField] protected int maxHealth = 10;
    [SerializeField] protected int damage = 1;

    protected int currentHealth;

    protected virtual void Start()
    {
        currentHealth = maxHealth;
    }

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        Debug.Log($"{name} : -{amount}  (남은 체력 {currentHealth})");

        if (currentHealth <= 0)
        {
            Die();
        }
    }

    protected virtual void Die()
    {
        Debug.Log($"{name} 사망");
        Destroy(gameObject);
    }

    public virtual void Attack(IDamageable target)
    {
        target.TakeDamage(damage);
    }
}
```

```csharp
// ChargerEnemy.cs
using UnityEngine;

public class ChargerEnemy : Enemy
{
    [SerializeField] private int chargeDamage = 3;

    protected override void Start()
    {
        base.Start();
        Debug.Log($"{name} : 돌진형 등장 (체력 {maxHealth})");
    }

    public override void Attack(IDamageable target)
    {
        target.TakeDamage(chargeDamage);
        Debug.Log($"{name} : 돌진! {chargeDamage} 피해");
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.TryGetComponent(out IDamageable target))
        {
            Attack(target);
        }
    }
}
```

씬도 확인한다.

| 오브젝트 | 확인할 것 |
|---|---|
| `Enemy` | `Rigidbody 2D` (Gravity Scale `0`) · Collider · `ChargerEnemy` |
| `Player` | `Rigidbody 2D` · Collider · `PlayerHealth` |

</details>

**확인 조건**: 플레이어를 몬스터에 부딪히면 Console 에
`돌진! 3 피해` → `플레이어 : -3 (남은 체력 17)` 두 줄이 순서대로 찍힌다.

### ⭐ 도전 미션

- [ ] `base.Start()` 를 지우고 실행 → **왜 바로 죽는지** 한 줄로 쓴다 (그리고 되돌린다)
- [ ] `Enemy.cs` 에서 `abstract` 를 지우고 오브젝트에 붙여본다 (그리고 되돌린다)
- [ ] `TankEnemy` 를 만든다 — 체력 `30`, 피해 `1` (072회차 예습)
- [ ] **부술 수 있는 상자** `Crate : MonoBehaviour, IDamageable` 을 만든다 — 3대 맞으면 `Destroy`
- [ ] `Enemy` 에 `protected abstract string Title { get; }` 를 넣고 자식마다 다른 이름을 붙인다
- [ ] `Die()` 를 `ChargerEnemy` 에서 `override` 해서 죽을 때 로그를 다르게 찍는다
- [ ] 몬스터를 프리팹으로 만들어 5마리 배치한다 (046)

> 💡 **네 번째 도전이 오늘의 핵심**이다. `Crate` 를 만들었는데 `ChargerEnemy` 를 한 줄도
> 안 고쳤다는 걸 확인시킨다. **인터페이스의 값어치가 여기서 보인다.** 한 명은 꼭 데모시킨다.

---

## 01:35–01:50 · 데모 + 정리

학생 2명 데모. **`Crate` 를 만든 학생**을 우선한다.

**마무리 정리 (한 장)**

| 문법 | 한 줄 뜻 | 오늘 쓴 곳 |
|---|---|---|
| `abstract class` | 혼자서는 못 쓰는 부모 | `Enemy` |
| `virtual` | 자식이 바꿔 써도 되는 메서드 | `Start` · `Die` · `Attack` |
| `override` | 실제로 바꿔 쓴다 | `ChargerEnemy` |
| `base.메서드()` | 부모 것도 실행한다 | `base.Start()` |
| `interface` | 부모가 달라도 되는 약속 | `IDamageable` |
| `protected` | 자식까지만 공개 | `maxHealth` |

### 🎓 Phase 회고 (5분) — 반드시 한다

> 💬 "6주차에 콘솔에서 이거 배울 때 **'이걸 왜 배우지' 했던 분** 계시죠."
> 💬 "**오늘이 그 답입니다.** 8주 전에 짠 설계가 오늘 화면에서 움직였어요."
> 💬 "여러분이 오늘 새로 배운 문법은 **하나도 없습니다.** 전부 6주차 거예요."
> 💬 "앞으로도 그렇습니다. 지금 이해 안 되는 게 있으면 **몇 주 뒤에 쓰입니다.**"

### 📦 `Snapshot_P5_Map` 배포

**무한 맵 + 이동 + 카메라 추적 + `Enemy`/`IDamageable` 구조.**

---

## ✅ 체크리스트 (학생)

- [ ] `IDamageable` 인터페이스를 만들었다
- [ ] `Enemy` 를 `abstract` 로 만들었다
- [ ] `Enemy` 가 `MonoBehaviour` 와 `IDamageable` 을 둘 다 받는다
- [ ] `ChargerEnemy` 가 `Enemy` 를 상속했다
- [ ] `override` 안에서 `base.Start()` 를 불렀다
- [ ] `PlayerHealth` 도 `IDamageable` 을 구현했다
- [ ] 부딪히면 Console 에 두 줄이 순서대로 찍힌다
- [ ] **`ChargerEnemy` 가 `PlayerHealth` 라는 이름을 모른다**는 걸 안다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| `The script class can't be abstract!` | `Enemy` 를 직접 붙임 | **의도된 에러다.** 자식을 붙인다 |
| **첫 대미지에 바로 죽음** | `base.Start()` 누락 | **오늘 1등.** 체력이 `0` 인 채 시작 |
| `no suitable method found to override` | 부모가 `virtual` 이 아님 / `private Start` | `protected virtual` 로 |
| `'Enemy' does not implement 'IDamageable'` | `TakeDamage` 가 `public` 이 아님 | 인터페이스 구현은 **반드시 `public`** |
| **`OnCollisionEnter2D` 가 안 불림** | `Rigidbody 2D` 없음 / Trigger 켜짐 | **오늘 2등.** 043 체크리스트 |
| `TryGetComponent` 가 항상 `false` | 상대에 `IDamageable` 구현체 없음 | `PlayerHealth` 붙였는지 확인 |
| 자식에서 `maxHealth` 가 안 보임 | `private` 으로 선언 | `protected` 로 |
| 로그가 두 번씩 찍힘 | Collider 가 두 개 | 하나만 남긴다 |
| 부딪혀도 아무 일 없음 | 스크립트를 안 붙임 | Inspector 확인 |
| 몬스터가 밀려남 | `Rigidbody 2D` 물리 (041) | 지금은 정상. 071에서 다룬다 |
| **6주차 내용을 통째로 잊음** | 8주 전이다. 정상 | **앞 15분을 줄이지 않는다.** 콘솔 코드를 띄운다 |
| `Health.cs` 랑 뭐가 다르냐 | 좋은 질문 | 미니게임용 vs 본 프로젝트 설계 |

## 📮 다음 시간 예고

> "몬스터가 생겼는데 **가만히 서 있습니다.** 우리가 가서 부딪혀야 아파요."
>
> "다음 시간엔 몬스터가 **플레이어를 향해 걸어옵니다.** 63회차에서 해봤죠?"
>
> "그리고 그 다음엔 몬스터가 **세 종류**가 됩니다. 오늘 만든 `Enemy` 를 세 번 상속해서요.
> **오늘 구조를 잘 만들어 놓으면 다음 두 회차가 아주 쉬워집니다.**"
