# 048회차 · Destroy와 몬스터 생성 — 오브젝트 수명 관리

| | |
|---|---|
| **Phase** | 3 · 유니티 2D 핵심 |
| **소요** | 2시간 (비대면) |
| **선행** | 047회차 (`Instantiate`), 044회차 (`OnTriggerEnter2D`) |
| **오늘 배우는 것** | `Destroy(gameObject)`, `Destroy(obj, 시간)`, 몬스터 스포너 |
| **씬** | 시작 `048_Destroy_Start` · 완성 `048_Destroy_Done` |
| **준비물(강사)** | 총알 500개 쌓인 Hierarchy 시연, `EnemySpawner.cs` 완성본 |

## 🎯 오늘의 목표

1. **`Destroy(gameObject)`** 로 자기 자신을 없앤다
2. **`Destroy(gameObject, 2f)`** 로 수명을 준다
3. 총알이 몬스터에 맞으면 **둘 다 사라지게** 한다

> ⚠️ **오늘 안 하는 것**: 체력. 오늘 몬스터는 **한 방에 죽는다.**
> "한 대만 맞아도 죽어요?" 가 나오면 **"050회차에 체력을 넣습니다."**
> `GetComponent`도 아직이다. 오늘은 **`Destroy`까지**.
> **코루틴 자동 스폰도 안 한다.** 오늘 스폰은 **키를 눌러서** 한다. 자동은 051회차.
>
> 🔑 **설계 의도**: 047에서 학생이 직접 만든 문제(총알이 안 사라짐)를 오늘 푼다.
> **문제를 겪은 다음 해법을 주는 순서**가 이번 주의 축이다.
> 그리고 오늘 "맞으면 사라진다"까지 가면 **게임처럼 보이기 시작한다.** 여기서 반응이 크게 온다.

## 📦 오늘의 제출물

**총알로 몬스터를 맞혀 둘 다 사라지는 GIF (5초)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 3문제 |
| 00:10–00:45 | 같이 치기 — 수명 주기 → 맞으면 삭제 → 몬스터 스폰 |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + Destroy / SetActive 정리 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 (채팅 동시 답변)

1. 프리팹 칸에는 어디서 드래그하나? → **Project 창**
2. `Instantiate`의 세 번째 값 `Quaternion.identity`는? → **안 돌림**
3. 통과하면서 알아채게 하는 설정은? → **`Is Trigger`**

---

## 00:10–00:45 · 같이 치기 ★

### ① 문제를 다시 본다 (5분)

`048_Destroy_Start` 를 연다. 047 완성 상태다.

▶ Play → 스페이스를 **20초 연타** → Hierarchy를 보여준다.

> 💬 "총알이 몇 개죠? 화면 밖에 나간 것도 **전부 살아 있습니다.**"
> 💬 "실제 게임은 몇 시간을 켜두기도 합니다. 이대로면 **컴퓨터가 죽어요.**"

### ② `Destroy` — 수명을 준다 (9분) — 오늘의 핵심

`Bullet` 스크립트에 한 줄 추가.

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float lifeTime = 2f;
    [SerializeField] private Rigidbody2D rb;

    void Start()
    {
        rb.linearVelocity = transform.up * speed;

        Destroy(gameObject, lifeTime);
    }
}
```

▶ Play → 총알이 **2초 뒤 저절로 사라진다.** Hierarchy가 깨끗하다.

**한 줄씩 짚는다.**

| 조각 | 뜻 |
|---|---|
| `Destroy(...)` | 없앤다 |
| `gameObject` | **내가 붙어 있는 오브젝트 전체** |
| `, lifeTime` | **몇 초 뒤에** (생략하면 즉시) |

> 🚨 **`gameObject`와 `this`의 차이가 오늘 최다 사고다.**
>
> | 쓰면 | 없어지는 것 |
> |---|---|
> | `Destroy(gameObject)` | **오브젝트 전체** ← 이게 맞다 |
> | `Destroy(this)` | **이 스크립트 컴포넌트만** ← 오브젝트는 그대로 남는다 |
>
> 💬 "`this`는 **이 스크립트**고, `gameObject`는 **이 스크립트가 붙어 있는 몸통**입니다."
> 💬 "`this`로 쓰면 **에러도 안 나고** 총알만 계속 남아요. 찾기 어렵습니다."

> 💡 `Destroy(gameObject, 2f)`를 `Start`에 쓰는 게 왜 되는지 한 줄: **"2초 뒤에 없애라고 예약해 두는 것"**.
> 예약이라는 말이 코루틴(051)의 밑밥이 된다.

### ③ 맞으면 둘 다 사라진다 (12분)

몬스터 프리팹에 **Tag `Enemy`** 가 붙어 있는지 확인한다. (046 미션에서 붙였다)

`Bullet` 에 추가.

```csharp
private void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Enemy"))
    {
        Destroy(other.gameObject);   // 몬스터
        Destroy(gameObject);         // 나 자신
    }
}
```

▶ Play → 총알이 몬스터에 맞으면 **둘 다 사라진다.**

> 🎉 **이 순간이 이번 주의 목표다.** 서두르지 않는다. 다들 한참 쏜다.

**두 줄의 차이를 반드시 짚는다.**

| 줄 | 없어지는 것 |
|---|---|
| `Destroy(other.gameObject)` | **상대** (몬스터) |
| `Destroy(gameObject)` | **나** (총알) |

> 💬 "044에서 `other`가 **닿은 상대**라고 했죠. 그대로예요."
> 💬 "`other.gameObject`는 **상대의 몸통**, `gameObject`는 **내 몸통**입니다."

> ⚠️ **`Destroy` 는 그 프레임 끝에 실제로 지워진다.** 지운 직후에도 코드가 한 줄 더 돌 수 있다.
> 지금은 문제가 안 되지만, **"지웠는데 왜 아직 있어요"** 라는 질문이 나오면 이 한 문장으로 답한다.
> 깊이 들어가지 않는다.

### ④ 몬스터를 코드로 만든다 (9분)

빈 GameObject **`EnemySpawner`** 를 만들고 스크립트를 붙인다.

```csharp
using UnityEngine;

public class EnemySpawner : MonoBehaviour
{
    [SerializeField] private GameObject enemyPrefab;
    [SerializeField] private float spawnRangeX = 7f;
    [SerializeField] private float spawnY = 4f;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.E))
        {
            SpawnOne();
        }
    }

    [ContextMenu("몬스터 10마리 소환")]
    private void SpawnTen()
    {
        for (int i = 0; i < 10; i++)
        {
            SpawnOne();
        }
    }

    private void SpawnOne()
    {
        float x = Random.Range(-spawnRangeX, spawnRangeX);

        Instantiate(enemyPrefab, new Vector3(x, spawnY, 0f), Quaternion.identity);
    }
}
```

▶ Play → `E` 키를 누를 때마다 **몬스터가 위쪽 랜덤 위치에 나타난다.**

| 조각 | 어디서 배웠나 |
|---|---|
| `Instantiate` | **047회차** — 총알이랑 똑같다 |
| `Random.Range` | 040회차 ⭐도전 |
| `for` 문 | **3주차 반복문** |
| `[ContextMenu]` | **040회차** |

> 💬 "새로 배우는 게 **하나도 없습니다.** 총알 만들던 코드에서 프리팹만 바꾼 거예요."
> 💬 "040에서 `[ContextMenu]` 배울 때 뭐라고 했죠? **'몬스터 10마리 소환 같은 걸 버튼 하나로 하게 된다.'** 그게 오늘입니다."

> 💡 **`Random.Range(float, float)` 는 끝값을 포함**하고 `Random.Range(int, int)` 는 **포함하지 않는다.**
> 물어보는 학생에게만 알려준다. 반 전체에는 안 꺼낸다.

---

## 00:55–01:35 · 개인 미션

### 필수 미션 — 수명과 삭제

```csharp
using UnityEngine;

public class Bullet : MonoBehaviour
{
    [SerializeField] private float speed = 10f;
    [SerializeField] private float lifeTime = 2f;
    [SerializeField] private Rigidbody2D rb;

    void Start()
    {
        rb.linearVelocity = transform.up * speed;

        // TODO ①: lifeTime 초 뒤에 자기 자신을 없애세요
        //   힌트: this 가 아니라 gameObject 입니다
    }

    // TODO ②: Trigger 로 닿았을 때 불리는 메서드를 만드세요 (044 그대로)


        // TODO ③: 상대 Tag 가 "Enemy" 일 때만


            // TODO ④: 상대와 자기 자신을 둘 다 없애세요
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
    [SerializeField] private Rigidbody2D rb;

    void Start()
    {
        rb.linearVelocity = transform.up * speed;

        Destroy(gameObject, lifeTime);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Enemy"))
        {
            Destroy(other.gameObject);
            Destroy(gameObject);
        }
    }
}
```

</details>

**확인 조건**: 총알이 2초 뒤 저절로 사라지고, 몬스터에 맞으면 둘 다 즉시 사라진다.
`E` 키로 몬스터가 생긴다. Hierarchy가 계속 깨끗하다.

> 💡 **Hierarchy를 열어놓고 Play한다.** 총알이 생겼다 사라지는 게 눈에 보인다.
> 이게 오늘 배운 걸 확인하는 가장 빠른 방법이다.

### ⭐ 도전 미션

- [ ] `Destroy(gameObject)`를 `Destroy(this)`로 바꿔보고 뭐가 다른지 한 줄로 쓴다 (그리고 되돌린다)
- [ ] `lifeTime`을 `0.3`으로 줄여 **사거리가 짧은 총**을 만든다
- [ ] 몬스터가 아래로 천천히 내려오게 한다 (`Bullet`의 속도 코드를 참고)
- [ ] `[ContextMenu]`로 **"몬스터 전부 삭제"** 를 만든다 (`GameObject.FindGameObjectsWithTag`)
- [ ] 총알이 **벽에 맞아도** 사라지게 한다 (Tag `Wall`)
- [ ] 몬스터를 몇 마리 잡았는지 `Debug.Log`로 센다
- [ ] `Destroy` 대신 `SetActive(false)`로 바꿔보고 Hierarchy가 어떻게 다른지 확인한다

---

## 01:35–01:50 · 데모 + 정리

학생 2명 데모. **`Destroy(this)`를 해본 학생**이 있으면 반드시 보여주게 한다.
"총알이 안 없어지는데 에러도 없는" 상황을 다 같이 보는 게 오늘의 안전장치다.

**마무리 정리 (한 장)**

| | 무슨 일 | 되돌릴 수 있나 | 언제 |
|---|---|---|---|
| `SetActive(false)` | **꺼둔다.** 그대로 있다 | ✅ 다시 켤 수 있다 | 다시 쓸 것 |
| `Destroy(gameObject)` | **없앤다** | ❌ 없다 | 다시 안 쓸 것 |
| `Destroy(this)` | **스크립트만** 없앤다 | ❌ | 거의 안 쓴다 |

> 💬 "044에서 동전은 `SetActive(false)`로 껐죠. 오늘 총알은 `Destroy`로 없앱니다."
> 💬 "차이는 **다시 쓸 거냐**입니다. 총알은 안 쓰죠."
>
> 🔑 "그런데 **`Destroy`도 공짜가 아닙니다.** 1초에 수백 개를 만들고 없애면 렉이 와요.
> Phase 8에서 **오브젝트 풀링**으로 이걸 고칩니다. 오늘은 여기까지."

---

## ✅ 체크리스트 (학생)

- [ ] `Destroy(gameObject)`로 자기 자신을 없앤다
- [ ] `gameObject`와 `this`의 차이를 말한다
- [ ] `Destroy(obj, 2f)`로 수명을 준다
- [ ] `other.gameObject`가 **상대**인 걸 안다
- [ ] 총알이 몬스터를 맞히면 둘 다 사라진다
- [ ] `Instantiate`로 몬스터를 코드에서 만든다
- [ ] `Destroy`와 `SetActive(false)`의 차이를 안다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **총알이 안 사라짐 · 에러도 없음** | **`Destroy(this)`를 씀** | **오늘 1등.** `gameObject`로 |
| 총알이 몬스터를 통과만 함 | 몬스터 프리팹에 **Tag `Enemy`** 없음 | 프리팹 모드에서 붙인다 (046) |
| 총알이 몬스터를 통과만 함 (2) | 044 체크리스트 1~5번 | "1번부터 보세요" |
| 몬스터가 총알을 밀어냄 | 총알 `Is Trigger`가 꺼짐 | 프리팹에서 켠다 |
| **몬스터만 사라지고 총알은 남음** | `Destroy(gameObject)` 줄을 빼먹음 | 두 줄 다 있는지 확인 |
| 총알이 자기끼리 사라짐 | Layer Matrix Bullet×Bullet이 켜짐 | 045대로 끈다 |
| `MissingReferenceException` | 이미 지운 걸 또 만짐 | "지운 건 만지지 않는다". 깊이 안 감 |
| 스폰한 몬스터가 안 보임 | `spawnY`가 화면 밖 | Scene 뷰에서 확인. `4` 정도 |
| 몬스터가 겹쳐서 나옴 | `Random.Range` 폭이 좁음 | `spawnRangeX`를 키운다 |
| `E`를 눌러도 반응 없음 | Game 창 포커스 / 한글 입력 | 040 그대로 |
| `[ContextMenu]`가 안 보임 | 필드에 붙임 | 메서드 바로 위에 |
| Play 중 스폰한 게 저장됨? | 안 된다 | 037 그대로 |
| 몬스터 프리팹 원본이 사라짐 | **씬 인스턴스가 아니라 원본을 지움** | `Ctrl+Z`. Project 창의 것은 지우지 않는다 |

## 📮 다음 시간 예고

> "지금 몬스터는 **한 대만 맞아도 죽습니다.** 보스가 한 방에 죽으면 안 되겠죠."
>
> "체력을 넣으려면 **총알이 몬스터의 체력을 깎을 수 있어야** 합니다. 그런데 총알 입장에서
> 몬스터는 **남의 오브젝트**예요. 남의 부품을 어떻게 만질까요?"
>
> "다음 시간에 **`GetComponent`** 를 배웁니다. 그리고 그동안 Inspector에 드래그하던 것도 없어집니다."
