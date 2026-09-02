# 047회차 · Instantiate — 총알 발사

| | |
|---|---|
| **Phase** | 3 · 유니티 2D 핵심 |
| **소요** | 2시간 (비대면) |
| **선행** | 046회차 (프리팹), 042회차 (`linearVelocity`) |
| **오늘 배우는 것** | `Instantiate`, 프리팹 참조, `firePoint`(Transform 참조) |
| **씬** | 시작 `047_Instantiate_Start` · 완성 `047_Instantiate_Done` |
| **준비물(강사)** | `Bullet.prefab`, `Bullet.cs` · `PlayerShooter.cs` 완성본 |

## 🎯 오늘의 목표

1. **`Instantiate`로 프리팹을 코드에서 찍어낸다**
2. **어디에** 만들지를 `firePoint`로 정한다
3. 만들어진 총알이 **스스로 날아가게** 한다

> ⚠️ **오늘 안 하는 것**: `Destroy`. **총알은 안 사라진다.**
> Hierarchy가 `Bullet(Clone)`으로 가득 차는 걸 **일부러 보여주고** 048로 넘긴다.
> `GetComponent`도 안 한다. 총알의 `Rigidbody 2D`는 **프리팹 안에서 드래그**로 연결한다.
>
> 🔑 **설계 의도**: 046에서 만든 프리팹이 오늘 쓰인다. **"원본이 있어야 찍어낼 수 있다"**
> 는 순서를 학생이 몸으로 알게 된다. 그리고 오늘 만든 문제(총알이 안 사라짐)가
> 048의 도입이 된다. **이번 주는 세 회차가 한 줄로 이어진다.**

## 📦 오늘의 제출물

**스페이스로 총알이 발사되는 GIF (5초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 3문제 |
| 00:10–00:45 | 같이 치기 — Bullet 프리팹 → Instantiate → firePoint → 날아가게 |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + Hierarchy 폭발 시연 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 (채팅 동시 답변)

1. 프리팹 원본은 어디 있나? → **Project 창**
2. Hierarchy의 파란 이름은 뭔가? → **인스턴스(복사본)**
3. 누른 순간 한 번만 반응하는 입력은? → **`Input.GetKeyDown`**

---

## 00:10–00:45 · 같이 치기 ★

### ① 총알 프리팹을 만든다 (7분)

`047_Instantiate_Start` 를 연다. `Player`(042 완성)와 몬스터 몇 마리가 있다.

씬에 흰 Square를 하나 놓고 다음을 붙인 뒤 **프리팹으로 만든다.**

| 항목 | 값 |
|---|---|
| 이름 | **`Bullet`** |
| Scale | `0.3` |
| `Circle Collider 2D` | **`Is Trigger` 켬** |
| `Rigidbody 2D` | **`Gravity Scale = 0`** |
| Layer | **`Bullet`** (045에서 만든 것) |

프로젝트 창의 `Assets/_Project/Prefabs/Projectile/` 로 드래그. **씬에 남은 것은 지운다.**

> 💬 "총알은 **부딪혀 멈추면 안 되죠.** 통과하면서 맞았다는 걸 알아야 합니다. 그래서 `Is Trigger`예요."
> 💬 "043에서 동전 얘기할 때 미리 말했던 그겁니다."

### ② `Instantiate` — 한 줄 (9분) — 오늘의 핵심

`Player`에 새 스크립트 **`PlayerShooter`** 를 만든다.

```csharp
using UnityEngine;

public class PlayerShooter : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Instantiate(bulletPrefab, transform.position, Quaternion.identity);
        }
    }
}
```

**Inspector의 `Bullet Prefab` 칸에 `Project 창의 Bullet.prefab`을 드래그한다.**

> 🚨 **여기가 오늘 최다 사고다.** 학생 절반이 **Hierarchy에서** 뭔가를 끌어다 넣으려 한다.
> 💬 "**Project 창에서 끕니다.** 씬에 없어요. 씬에 있으면 그건 이미 복사본이죠."
> 화면 공유로 Project → Inspector 드래그를 **천천히 두 번** 보여준다.

▶ Play → 스페이스 → **Hierarchy에 `Bullet(Clone)`이 생긴다.**

**한 줄씩 짚는다.**

| 조각 | 뜻 |
|---|---|
| `Instantiate(...)` | **원본을 하나 찍어낸다** |
| `bulletPrefab` | **무엇을** 찍을지 |
| `transform.position` | **어디에** 놓을지 (지금은 플레이어 자리) |
| `Quaternion.identity` | **회전 없이** (`Quaternion`은 회전을 담는 타입) |

> 💬 "`Quaternion.identity`는 **'안 돌린 상태'** 라는 뜻입니다. **지금은 그냥 외우세요.**
> 회전 계산은 Phase 5에서 제대로 합니다."
>
> ⚠️ 여기서 쿼터니언을 설명하면 오늘이 끝난다. **"안 돌림"** 이면 충분하다.

> 💬 "이름 뒤에 **`(Clone)`** 이 붙죠. 유니티가 **'이건 복사본이야'** 하고 알려주는 겁니다."

### ③ `firePoint` — 총구를 만든다 (8분)

지금은 총알이 **플레이어 몸 한가운데**서 나온다. 총구를 만든다.

Hierarchy에서 `Player` 우클릭 → **Create Empty** → 이름 **`FirePoint`** → Position `(0, 0.7, 0)`

> 💬 "033회차 **부모자식** 기억나죠. 자식으로 넣으면 **플레이어를 따라다닙니다.**"
> 💬 "`(0, 0.7)`은 **부모 기준**이에요. 플레이어 몸에서 위로 0.7."

```csharp
[SerializeField] private GameObject bulletPrefab;
[SerializeField] private Transform firePoint;

void Update()
{
    if (Input.GetKeyDown(KeyCode.Space))
    {
        Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
    }
}
```

`FirePoint`를 Inspector의 `Fire Point` 칸에 드래그한다. **이건 Hierarchy에서 끈다.**

> 💬 "아까는 Project에서 끌었고 지금은 Hierarchy에서 끕니다. **왜 다를까요?**"
> 💬 "**프리팹은 원본이라 Project에, FirePoint는 씬에 실제로 있는 물건**이라 Hierarchy에 있습니다."

> ⚠️ **`GameObject`가 아니라 `Transform` 칸**이다. 042에서 `Rigidbody2D` 칸에 오브젝트를
> 끌어다 넣었던 것과 같다. 유니티가 알아서 그 오브젝트의 `Transform`을 찾아 넣는다.

### ④ 총알이 날아가게 (9분)

`Bullet` 스크립트를 만들어 **프리팹에 붙인다.** (씬이 아니라 **프리팹 모드에서**)

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private Rigidbody2D rb;

    void Start()
    {
        rb.linearVelocity = transform.up * speed;
    }
}
```

프리팹 모드 안에서 `Rb` 칸에 **자기 자신**을 드래그한다.

▶ Play → 스페이스 → **총알이 위로 날아간다.**

> 🎉 여기서 시간을 준다. 다들 스페이스를 연타한다.

**두 가지를 짚는다.**

| 짚을 것 | 설명 |
|---|---|
| `Start`에 썼다 | 총알은 **태어날 때 한 번** 속도를 받으면 그대로 간다 |
| `transform.up` | **자기 기준 위쪽**. 나중에 총알을 돌리면 그 방향으로 간다 |

> 💬 "042에서 `FixedUpdate`에 쓰라고 했는데 왜 `Start`일까요?"
> 💬 "**계속 바꿀 필요가 없어서**입니다. 한 번 준 속도는 유지돼요. 매 프레임 넣을 이유가 없죠."
> 💬 "플레이어는 키 입력이 계속 바뀌니까 `FixedUpdate`가 맞고, 총알은 한 번이면 됩니다."

> 💡 **`rb` 를 드래그하는 게 곧 없어진다**고 예고한다. 049회차의 `GetComponent`가 그걸 대신한다.

### ⑤ 문제를 만든다 (2분) — 048의 도입

스페이스를 **30번 연타**하고 Hierarchy를 본다. **`Bullet(Clone)`이 산더미다.**

> 💬 "총알이 화면 밖으로 나갔는데도 **계속 살아 있습니다.** 이대로 10분 하면요?"
> 💬 "**다음 시간에 없앱니다.**"

---

## 00:55–01:35 · 개인 미션

### 필수 미션 — `PlayerShooter` 와 `Bullet`

```csharp
using UnityEngine;

public class PlayerShooter : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;   // Project 창에서 드래그
    [SerializeField] private Transform firePoint;       // Hierarchy 에서 드래그

    void Update()
    {
        // TODO ①: 스페이스를 누른 순간에만 아래를 실행하세요
        //   힌트: GetKey 가 아니라 GetKeyDown


            // TODO ②: bulletPrefab 을 firePoint 자리에 만드세요
            //   힌트: Instantiate(무엇을, 어디에, Quaternion.identity)
    }
}
```

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private Rigidbody2D rb;

    // TODO ③: 태어날 때 한 번만 실행되는 메서드는?


        // TODO ④: 자기 기준 위쪽으로 speed 만큼의 속도를 주세요
        //   힌트: transform.up, rb.linearVelocity
}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
using UnityEngine;

public class PlayerShooter : MonoBehaviour
{
    [SerializeField] private GameObject bulletPrefab;
    [SerializeField] private Transform firePoint;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);
        }
    }
}
```

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private Rigidbody2D rb;

    void Start()
    {
        rb.linearVelocity = transform.up * speed;
    }
}
```

연결도 같이 확인한다.

| 어디 | 칸 | 무엇을 |
|---|---|---|
| `Player` (씬) | `Bullet Prefab` | **Project**의 `Bullet.prefab` |
| `Player` (씬) | `Fire Point` | **Hierarchy**의 `FirePoint` |
| `Bullet` (프리팹 모드) | `Rb` | **자기 자신** |

</details>

**확인 조건**: 스페이스를 누르면 플레이어 머리 위에서 총알이 나와 위로 날아간다.
WASD로 움직이면 총구도 따라온다.

### ⭐ 도전 미션

- [ ] `GetKeyDown`을 `GetKey`로 바꿔보고 어떻게 되는지 한 줄로 쓴다 (그리고 되돌린다)
- [ ] `firePoint`의 Y를 `-0.7`로 바꿔서 **아래로** 쏴 본다
- [ ] `Instantiate`를 `for` 문으로 감싸 **한 번에 3발**을 쏜다 (3주차 반복문)
- [ ] `speed`를 `-10`으로 하면 어떻게 되는지 확인한다
- [ ] `Quaternion.identity` 대신 `firePoint.rotation`을 넣고, `FirePoint`를 45도 돌려본다
- [ ] 마우스 왼쪽 버튼으로도 발사되게 한다 (`Input.GetMouseButtonDown(0)`)
- [ ] `Debug.Log`로 **지금까지 몇 발 쐈는지** 세어 찍는다

---

## 01:35–01:50 · 데모 + 정리

학생 2명 데모. **`GetKey`로 바꿔본 학생**이 있으면 반드시 보여주게 한다.
프레임마다 총알이 쏟아지는 걸 다 같이 보는 게 `GetKeyDown`의 의미를 굳힌다.

**마무리 정리 (한 장)**

| 무엇을 | 어디서 드래그 | 왜 |
|---|---|---|
| `bulletPrefab` | **Project 창** | 프리팹은 **원본**이고 씬에 없다 |
| `firePoint` | **Hierarchy** | 씬에 실제로 있는 자식 오브젝트 |
| `rb` (프리팹 안) | **자기 자신** | 프리팹 안에서는 자기 부품을 끈다 |

> 💬 "**Project에서 끄는 건 원본, Hierarchy에서 끄는 건 씬에 있는 것.** 046에서 한 말 그대로예요."

---

## ✅ 체크리스트 (학생)

- [ ] `Instantiate`로 프리팹을 코드에서 만든다
- [ ] 프리팹 칸에는 **Project 창에서** 드래그한다
- [ ] `Quaternion.identity`가 "안 돌림"인 걸 안다
- [ ] `firePoint`를 자식으로 만들어 총구 위치를 정한다
- [ ] `(Clone)`이 붙는 이유를 안다
- [ ] 총알 속도는 `Start`에 한 번만 주면 된다는 걸 안다
- [ ] `GetKeyDown`을 `Update`에 쓴다 (`FixedUpdate` 아님)
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`Bullet Prefab` 칸에 못 넣음** | **Hierarchy에서 끌고 있음** | **오늘 1등.** Project 창에서 끈다 |
| `NullReferenceException` (Shooter) | 프리팹/FirePoint 칸이 빔 | Inspector 두 칸 확인 |
| `NullReferenceException` (Bullet) | **프리팹의 `Rb` 칸이 빔** | **프리팹 모드**에서 자기 자신을 드래그 |
| 총알이 안 움직임 | `Bullet` 스크립트를 씬 오브젝트에만 붙임 | **프리팹에** 붙인다 |
| 총알이 안 움직임 (2) | 프리팹에 `Rigidbody 2D`가 없음 | 프리팹 모드에서 추가 |
| 총알이 아래로 떨어짐 | `Gravity Scale`이 `1` | `0`으로 |
| 스페이스 한 번에 수십 발 | `GetKey`를 씀 | `GetKeyDown` |
| 스페이스가 씹힘 | `FixedUpdate`에 씀 | **`Update`에.** 042에서 예고한 그대로 |
| 총알이 플레이어를 밀어냄 | Layer Matrix에서 Bullet×Player가 켜짐 | 045에서 배운 대로 끈다 |
| Hierarchy가 `Bullet(Clone)`으로 가득 | **정상** | "다음 시간에 없앱니다" |
| 총알이 화면에 안 보임 | Sorting Layer / 화면 밖 | Scene 뷰에서 확인 |
| 총알이 몬스터를 밀어냄 | `Is Trigger`가 꺼짐 | 프리팹에서 켠다 |
| Play 중에 프리팹을 고침 | 037 그대로 | Stop하고 |

## 📮 다음 시간 예고

> "지금 Hierarchy를 보세요. **총알이 몇 개죠?** 화면 밖으로 나간 것도 다 살아 있습니다."
>
> "다음 시간엔 **`Destroy`** 로 없앱니다. 시간이 지나면, 그리고 몬스터에 맞으면요."
>
> "그리고 **몬스터도 코드로 만듭니다.** 오늘 배운 `Instantiate` 그대로예요."
