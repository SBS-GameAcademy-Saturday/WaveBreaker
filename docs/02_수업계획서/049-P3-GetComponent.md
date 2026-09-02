# 049회차 · GetComponent — 남의 부품을 만진다

| | |
|---|---|
| **Phase** | 3 · 유니티 2D 핵심 |
| **소요** | 2시간 (비대면) |
| **선행** | 048회차 (`Destroy`), 034회차 (GameObject와 Component) |
| **오늘 배우는 것** | `GetComponent<T>()`, `null`, `TryGetComponent`, `Awake` |
| **씬** | 시작 `049_GetComponent_Start` · 완성 `049_GetComponent_Done` |
| **준비물(강사)** | `NullReferenceException` 재현 시연, 034회차 부품표 화면 |

## 🎯 오늘의 목표

1. `GetComponent`로 **내 부품**을 코드에서 찾는다 (드래그를 없앤다)
2. `other.GetComponent`로 **남의 부품**을 만진다
3. **없는 부품을 찾으면 `null`** 이라는 걸 알고 대비한다

> ⚠️ **오늘 안 하는 것**: 체력 클래스. 오늘 만지는 건 **`SpriteRenderer`(색)** 뿐이다.
> 내가 만든 클래스를 `GetComponent`로 찾는 건 **050회차**다.
> 오늘 체력까지 가면 "`GetComponent`가 안 되는 것"과 "체력 계산이 틀린 것"이 섞인다.
>
> 🔑 **설계 의도**: 042부터 계속 **Inspector에 드래그**해 왔다. 학생은 그걸 당연하게 여긴다.
> 오늘 그 드래그를 **한 줄로 없애면서** "코드가 직접 찾을 수 있다"를 체감시킨다.
> 그리고 **`null`을 여기서 처음 정면으로 다룬다.** Phase 0의 "에러 읽는 법"과 이어진다.

## 📦 오늘의 제출물

**총알에 맞은 몬스터가 빨갛게 변하는 GIF (5초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 3문제 |
| 00:10–00:45 | 같이 치기 — 드래그 없애기 → 남의 부품 → null → TryGetComponent |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + null 정리 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 (채팅 동시 답변)

1. `gameObject`와 `this`의 차이는? → **몸통 전체 / 스크립트 하나**
2. GameObject와 Component의 관계는? → **그릇과 부품** (034)
3. `other`는 무엇인가? → **닿은 상대**

---

## 00:10–00:45 · 같이 치기 ★

### ① 드래그를 없앤다 (9분) — 오늘의 도입

`049_GetComponent_Start` 를 연다. 048 완성 상태다.

`Bullet` 프리팹의 Inspector를 연다. **`Rb` 칸에 드래그해 넣은 게 보인다.**

> 💬 "042부터 계속 이걸 했죠. **매번 끌어다 넣는 게 귀찮지 않았나요?**"
> 💬 "그리고 **까먹으면 `NullReferenceException`** 이 났습니다. 오늘 이걸 없앱니다."

```csharp
public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float lifeTime = 2f;

    private Rigidbody2D rb;        // [SerializeField] 를 뗐다

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Start()
    {
        rb.linearVelocity = transform.up * speed;
        Destroy(gameObject, lifeTime);
    }
}
```

**Inspector에서 `Rb` 칸이 사라진다.** ▶ Play → **똑같이 동작한다.**

**한 줄씩 짚는다.**

| 조각 | 뜻 |
|---|---|
| `GetComponent<...>()` | **내 오브젝트에 붙은 부품을 찾아줘** |
| `<Rigidbody2D>` | **어떤 부품**을 찾을지 (꺾쇠 안에 타입 이름) |
| `rb = ...` | 찾은 걸 변수에 담아둔다 |

> 💬 "034회차에 **GameObject는 그릇, Component는 부품**이라고 했죠."
> 💬 "`GetComponent`는 **'내 그릇에서 이 부품 좀 꺼내줘'** 입니다. 그게 전부예요."

> ⚠️ **`Awake`를 여기서 처음 정식으로 쓴다.** 036 ⭐도전에서 이름만 봤다.
> 💬 "`Awake`는 **`Start`보다 먼저** 실행됩니다. **내 부품 챙기는 건 `Awake`에서,
> 그걸 쓰는 건 `Start`에서.** 이 순서를 습관으로 만드세요."
> 이유(다른 스크립트가 나를 먼저 쓸 수 있다)는 **050에서 실제로 겪는다.** 오늘은 규칙만 준다.

> 🚨 **`Update`에서 `GetComponent`를 부르면 안 된다**는 걸 한 번 못 박는다.
> 💬 "매 프레임 찾으면 느립니다. **한 번 찾아서 변수에 담아두세요.**"

### ② 남의 부품을 만진다 (11분) — 오늘의 핵심

`Bullet`의 충돌 부분을 고친다.

```csharp
private void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Enemy"))
    {
        SpriteRenderer sr = other.GetComponent<SpriteRenderer>();
        sr.color = Color.red;

        Destroy(gameObject);
    }
}
```

▶ Play → 총알에 맞은 몬스터가 **빨갛게 변한다.** (아직 안 죽는다)

> 🎉 여기서 반응이 온다. **"남의 걸 만졌다"** 는 감각이 오늘의 목표다.

| 코드 | 누구 부품 |
|---|---|
| `GetComponent<...>()` | **내** 부품 |
| `other.GetComponent<...>()` | **상대** 부품 |

> 💬 "앞에 **`other.`** 이 붙었죠. 그게 전부입니다. **점 앞에 있는 게 주인**이에요."
> 💬 "이게 왜 중요하냐면 — **다음 시간에 몬스터의 체력을 깎을 때** 똑같이 씁니다."

> 💡 `Color.red` 말고 `new Color(1f, 0.4f, 0.4f)` 도 된다는 걸 한 줄. 031에서 색을 만졌던 그 값이다.

### ③ 없는 부품을 찾으면 (8분)

**일부러 에러를 낸다.** `Enemy` 태그가 붙은 **빈 GameObject**(SpriteRenderer 없음)를 씬에 놓고 쏜다.

```
NullReferenceException: Object reference not set to an instance of an object
```

> 💬 "이 에러 **오늘 처음 제대로 봅니다.** 그런데 사실 여러 번 봤어요.
> 042에서 `Rb` 칸을 안 채웠을 때, 040에서 `Item` 칸을 비웠을 때."
> 💬 "**`null`은 '아무것도 없다'** 는 뜻입니다. 없는 걸 만지려니까 에러가 나는 거예요."

```csharp
SpriteRenderer sr = other.GetComponent<SpriteRenderer>();

if (sr != null)
{
    sr.color = Color.red;
}
```

> 💬 "`GetComponent`는 **못 찾으면 `null`을 돌려줍니다.** 에러를 던지지 않아요."
> 💬 "그래서 **찾은 다음에 확인**해야 합니다. `if (sr != null)`."

### ④ `TryGetComponent` — 한 줄로 (7분)

```csharp
if (other.TryGetComponent(out SpriteRenderer sr))
{
    sr.color = Color.red;
}
```

> 💬 "**찾기와 확인을 한 줄로** 합니다. 있으면 `true`, 없으면 `false`."
> 💬 "`out`은 **'찾은 걸 이 변수에 담아줘'** 라는 뜻이에요. 지금은 여기까지."

| 방식 | 언제 |
|---|---|
| `GetComponent` + `if (x != null)` | **뭘 하는지 눈에 보인다.** 처음엔 이걸 쓴다 |
| `TryGetComponent` | 짧다. 익숙해지면 이쪽 |

> ⚠️ **둘 다 알려주되 강요하지 않는다.** 학생 절반은 `null` 체크가 더 편하다.
> 💬 "**둘 다 맞습니다.** 편한 걸 쓰세요. 다만 **확인 없이 쓰지는 마세요.**"

---

## 00:55–01:35 · 개인 미션

### 필수 미션 — 맞으면 빨개지는 몬스터

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float lifeTime = 2f;

    // TODO ①: [SerializeField] 를 떼고 private 변수만 남기세요
    [SerializeField] private Rigidbody2D rb;

    // TODO ②: Awake 에서 자기 Rigidbody2D 를 찾아 rb 에 담으세요
    //   힌트: GetComponent<타입>()

    void Start()
    {
        rb.linearVelocity = transform.up * speed;
        Destroy(gameObject, lifeTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Enemy"))
        {
            // TODO ③: 상대의 SpriteRenderer 를 찾으세요
            //   힌트: other.GetComponent<...>()


            // TODO ④: null 이 아닐 때만 색을 빨갛게 바꾸세요


            Destroy(gameObject);
        }
    }
}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float lifeTime = 2f;

    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Start()
    {
        rb.linearVelocity = transform.up * speed;
        Destroy(gameObject, lifeTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Enemy"))
        {
            SpriteRenderer sr = other.GetComponent<SpriteRenderer>();

            if (sr != null)
            {
                sr.color = Color.red;
            }

            Destroy(gameObject);
        }
    }
}
```

</details>

**확인 조건**: Inspector에 `Rb` 칸이 **없고**, 총알은 똑같이 날아간다.
맞은 몬스터가 빨개진다. `SpriteRenderer` 없는 `Enemy`를 쏴도 **에러가 안 난다.**

### ⭐ 도전 미션

- [ ] `TryGetComponent` 버전으로 바꿔 쓴다
- [ ] `null` 체크를 **일부러 빼고** 빈 `Enemy`를 쏴서 에러 메시지를 읽는다 (그리고 되돌린다)
- [ ] 맞을 때마다 몬스터가 **점점 더 빨개지게** 한다 (현재 색에서 조금씩)
- [ ] 몬스터를 맞히면 **크기가 커지게** 한다 (`other.transform.localScale`)
- [ ] `GetComponentInChildren`을 검색해서 무엇이 다른지 한 줄로 쓴다
- [ ] `Awake`와 `Start`에 `Debug.Log`를 넣고 **어느 쪽이 먼저** 찍히는지 확인한다
- [ ] `Update`에서 `GetComponent`를 부르고 `Stats` 창의 FPS가 달라지는지 본다

---

## 01:35–01:50 · 데모 + 정리

학생 2명 데모. **`null` 체크를 빼고 에러를 본 학생**이 있으면 반드시 보여주게 한다.
에러 메시지를 **다 같이 읽는 시간**을 30초 갖는다. 이게 Phase 0에서 하려던 그 습관이다.

**마무리 정리 (한 장)**

| 코드 | 누구 부품 | 못 찾으면 |
|---|---|---|
| `GetComponent<T>()` | **내** 것 | **`null`** |
| `other.GetComponent<T>()` | **상대** 것 | **`null`** |
| `other.TryGetComponent(out T x)` | 상대 것 | **`false`** |

> 💬 "**점 앞에 있는 게 주인**입니다. 아무것도 없으면 나."
> 💬 "그리고 **못 찾으면 `null`.** 에러가 나는 게 아니라 **아무것도 안 돌려줍니다.**"

---

## ✅ 체크리스트 (학생)

- [ ] `GetComponent<T>()`로 내 부품을 찾는다
- [ ] `other.GetComponent<T>()`로 상대 부품을 만진다
- [ ] **점 앞이 주인**인 걸 안다
- [ ] 못 찾으면 `null`이 온다는 걸 안다
- [ ] `null` 체크 또는 `TryGetComponent`를 쓴다
- [ ] 부품 찾기는 `Awake`, 쓰는 건 `Start` 순서를 안다
- [ ] `Update`에서 `GetComponent`를 부르지 않는다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`NullReferenceException`** | 없는 부품을 만짐 | **오늘 1등이자 오늘의 주제.** `null` 체크를 넣는다 |
| `NullReferenceException` (2) | `rb`를 `Awake`에서 안 담음 | `Awake`가 있는지 확인 |
| `<>` 안에 이름을 틀림 | `Rigidbody2D` / `SpriteRenderer` 대소문자 | 자동완성으로 |
| `Rigidbody` (2D 아님)을 찾음 | 3D 타입 | 못 찾아서 `null`. **9주차와 같은 실수** |
| `GetComponent`에 `()` 빠짐 | 문법 | `GetComponent<T>()` |
| 색이 안 변함 | 몬스터에 `SpriteRenderer`가 없음 | Inspector 확인 |
| 색이 안 변함 (2) | Tag `Enemy`가 안 붙음 | 프리팹 모드에서 |
| 색이 변했다 원래대로 | **프리팹 인스턴스라 원본 색으로 보임?** | 아니다. Play를 멈춘 것이다 (037) |
| `Rb` 칸이 아직 보임 | `[SerializeField]`를 안 뗌 | 뗀다 |
| 드래그한 값이 남아 동작함 | 예전 값이 직렬화돼 있음 | 스크립트를 고쳤으면 Inspector `⋮` → `Reset` |
| `TryGetComponent` 문법 에러 | `out` 빠짐 | `out SpriteRenderer sr` |
| 느려짐 | `Update`에서 `GetComponent` | 변수에 담아둔다 |
| 자식 부품을 못 찾음 | `GetComponent`는 자기 것만 본다 | `GetComponentInChildren` (⭐도전) |

## 📮 다음 시간 예고

> "오늘 남의 **색**을 바꿨죠. 색 대신 **체력**을 깎으면 어떻게 될까요?"
>
> "다음 시간엔 **`Health`라는 클래스를 직접 만들고**, 총알이 그걸 `GetComponent`로 찾아서 깎습니다."
>
> "5~6주차에 만든 클래스가 **드디어 게임에서 돌아갑니다.** 10주차 마지막입니다."
