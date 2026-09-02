# 037회차 · `[SerializeField]`와 Play 모드 함정

| | |
|---|---|
| **Phase** | 2 · 유니티 입문 |
| **소요** | 2시간 (비대면) |
| **선행** | 036회차 (Start·Update·Debug.Log) |
| **오늘 배우는 것** | `[SerializeField]`, `transform.Rotate`, Play 모드 함정 |
| **씬** | 시작 `037_SerializeField_Start` · 완성 `037_SerializeField_Done` |
| **준비물(강사)** | `Spinner.cs` 완성본, Play 모드 날림 시연 |

## 🎯 오늘의 목표

1. `[SerializeField]`로 **코드를 안 고치고** 값을 바꾼다
2. `transform`을 코드에서 건드린다
3. **Play 중 바꾼 값은 사라진다**는 걸 몸으로 안다

> ⚠️ **오늘 안 하는 것**: `Time.deltaTime`. 학생이 "속도가 이상해요"라고 하면
> → **"맞아요. 그거 039회차에 고칩니다."** 로만 답하고 **절대 미리 알려주지 않는다.**
>
> 🔑 **설계 의도**: 오늘 만드는 `Spinner`는 **일부러 덜 만든 것**이다.
> 회전 속도가 컴퓨터마다 다르다. 이 불편을 039회차에서 `Time.deltaTime`으로 회수한다.
> 지금 정답을 주면 039는 "이유 없는 문법 암기"가 된다.

## 📦 오늘의 제출물

**물체가 도는 GIF (3초) + Inspector에서 속도 값을 바꾼 스크린샷** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 3문제 |
| 00:10–00:45 | 같이 치기 — SerializeField → Rotate → Play 함정 |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 개인 미션 |
| 01:35–01:50 | 데모 + "왜 사람마다 속도가 다르지?" |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 (채팅 동시 답변)

1. `Start`와 `Update`, 각각 몇 번 실행되나? → **한 번 / 계속**
2. 스크립트가 안 붙을 때 원인 1순위는? → **파일명 ≠ 클래스명**
3. (콘솔) `private`을 붙이면 밖에서? → **못 건드린다**

> 3번을 반드시 넣는다. 오늘 이 답과 정면으로 충돌시킨다.

---

## 00:10–00:45 · 같이 치기 ★

### ① 불편함 먼저 (7분) — 오늘의 도입

```csharp
void Update()
{
    transform.Rotate(0f, 0f, 1.5f);
}
```

붙이면 돈다. 여기서 **강사가 요구한다.**

> "더 빠르게 해보세요." → 코드 열고 `3f`로 고치고 저장하고 유니티 전환하고 기다림
> "아니 좀 느리게." → 또 코드 열고 고치고 저장하고 기다림
> "다시 조금만 빠르게." → 또

> 💬 "지금 뭐가 불편하죠?"
> → **"숫자 하나 바꾸려고 매번 코드 열고 저장하고 기다려야 한다."**
>
> 💬 "이걸 해결하는 게 오늘 배울 `[SerializeField]` 입니다."

### ② `[SerializeField]` (10분)

```csharp
using UnityEngine;

public class Spinner : MonoBehaviour
{
    [SerializeField] private float rotateStep = 1.5f;

    void Update()
    {
        transform.Rotate(0f, 0f, rotateStep);
    }
}
```

이제 **Inspector에서 숫자만 끌면** 속도가 바뀐다. 코드를 안 연다.

> 💬 "숫자 칸을 **좌우로 드래그**해보세요." — 이걸 모르는 학생이 많다. 반응이 제일 좋다.

**여기서 짚을 것 — 퀴즈 3번과 충돌시킨다**

> 💬 "잠깐, `private`인데 왜 Inspector에 보이죠? 아까 퀴즈에서 **밖에서 못 건드린다**고 했잖아요."

| 포인트 | 설명 |
|---|---|
| `private` | **다른 코드에서는** 여전히 못 건드린다 |
| `[SerializeField]` | **Inspector에게만** 예외로 열어준다 |
| 왜 `public`을 안 쓰나 | `public`으로 열면 **아무 코드나** 건드릴 수 있다. 필요 이상으로 여는 것 |

> 💬 "6주차에 배운 property 기억나요? **'밖에 열어주되, 아무나 못 바꾸게'** — 그 이야기랑 같은 겁니다."
> 💬 "`public float`으로 해도 Inspector에 보이긴 해요. 그런데 **필요한 만큼만 여는 게** 좋은 습관입니다."

**직접 비교시킨다**: `private int updateCount;` 는 Inspector에 안 보인다. `[SerializeField]`를 붙였다 뗐다 해본다.

### ③ `transform` 건드리기 (8분)

```csharp
transform.Rotate(0f, 0f, rotateStep);
```

| 조각 | 뜻 |
|---|---|
| `transform` | **내가 붙어 있는 물체의** Transform 부품 (034회차의 그것) |
| `.Rotate(...)` | 그 부품에게 "돌아라"라고 시키는 것 |
| `0f, 0f, rotateStep` | X, Y, Z 순서. **2D는 Z만** |

> 💬 "033회차에 Inspector에서 손으로 돌렸던 그 Rotation을, 지금은 **코드가 대신 돌리고** 있는 겁니다."

X나 Y에 값을 넣어보게 한다. 2D에서 물체가 납작해지며 사라진다.

> ⚠️ 되돌리는 법(0으로)을 반드시 같이 알려준다. 안 그러면 "사라졌어요"가 남는다.

### ④ Play 모드 함정 — 정식으로 (10분)

**031·034에서 예고했던 것을 오늘 정면으로 다룬다.**

1. ▶ Play를 켠다
2. Play 중에 Inspector에서 `rotateStep`을 `10`으로 바꾼다 → 빨라진다
3. ⏹ Stop → **`1.5`로 돌아가 있다**

> 💬 "방금 그거 날아갔죠. **Play 중에 바꾼 건 전부 사라집니다.**"
> 💬 "이걸 모르면 30분 작업하고 통째로 날립니다. 오늘 이후로도 반드시 한 번은 당해요."

**대응책 두 가지를 알려준다.**

| 방법 | 어떻게 |
|---|---|
| 값만 남기기 | Play 중 컴포넌트 `⋮` → **Copy Component** → Stop 후 → **Paste Component Values** |
| 애초에 예방 | **Play 중엔 값만 찾고, 확정은 Stop 후에** |

> 💬 "그래서 Play 중엔 **'얼마가 좋은지 찾는' 것만** 하세요. 찾았으면 멈추고 그 숫자를 넣습니다."

> 🎨 **선택**: 에디터 색 바꾸기(Preferences → Colors → Playmode tint)를 알려주면 실수가 줄어든다.
> 다만 설정 항목이 하나 늘어나므로 **⭐도전 미션으로만** 던진다.

---

## 00:55–01:35 · 개인 미션

### 필수 미션 — `Bouncer` 만들기

크기가 커졌다 작아졌다 하는 스크립트를 만든다.

```csharp
using UnityEngine;

public class Bouncer : MonoBehaviour
{
    // TODO ①: Inspector 에서 조절할 수 있는 float 변수 scaleStep 을 만드세요 (기본값 0.01)
    //   힌트: [SerializeField] private float ...


    // TODO ②: Inspector 에서 조절할 수 있는 회전 속도 변수도 만드세요


    void Update()
    {
        // TODO ③: 매 프레임 Z축으로 회전시키세요
        //   힌트: transform.Rotate(0f, 0f, ...);


        // TODO ④: 크기를 조금씩 키우세요
        //   힌트: transform.localScale = transform.localScale + Vector3.one * scaleStep;
    }
}
```

<details>
<summary>막히면 열기 (정답)</summary>

```csharp
using UnityEngine;

public class Bouncer : MonoBehaviour
{
    [SerializeField] private float scaleStep = 0.01f;
    [SerializeField] private float rotateStep = 2f;

    void Update()
    {
        transform.Rotate(0f, 0f, rotateStep);
        transform.localScale = transform.localScale + Vector3.one * scaleStep;
    }
}
```

`Vector3.one`은 `(1, 1, 1)`이다. 여기에 `scaleStep`을 곱해서 더하면 세 축이 같이 커진다.
**계속 커지는 게 정상이다.** 되돌리는 건 다음 주 과제.
</details>

**확인 조건**: 물체가 돌면서 커진다. Inspector에서 두 값을 각각 바꾸면 즉시 반영된다.

### ⭐ 도전 미션

- [ ] Play 중 값을 바꾼 뒤 **Copy Component → Paste Component Values**로 살려낸다
- [ ] `scaleStep`에 **음수**를 넣어서 작아지게 만든다
- [ ] `[SerializeField]`를 떼면 Inspector에서 사라지는지 확인한다
- [ ] `[Range(0f, 10f)]`를 `[SerializeField]` 앞에 붙이고 Inspector가 어떻게 바뀌는지 본다
- [ ] Preferences → Colors → **Playmode tint**를 바꿔서 Play 중 화면 색이 달라지게 한다
- [ ] **친구와 회전 속도 값을 똑같이 맞춰보고, 실제로 같은 속도로 도는지 비교한다** ← 039회차 복선

---

## 01:35–01:50 · 데모 + "왜 사람마다 속도가 다르지?"

학생 3명에게 **`rotateStep`을 똑같이 `2`로 맞추게** 하고 동시에 화면 공유시킨다.

**속도가 미묘하게 다르다.** 같은 학생 화면에서도 순간마다 흔들린다.

> 💬 "숫자는 다 똑같은데 왜 속도가 다르죠?"
>
> 학생들이 추측하게 둔다. "컴퓨터 성능?" 같은 답이 나온다.
>
> 💬 "거의 맞아요. **왜 그런지, 어떻게 고치는지는 다음 주에 합니다.** 오늘은 '이상하다'만 기억하세요."

> 🚨 **여기서 절대 답을 말하지 않는다.** `Time.deltaTime`을 아는 학생이 채팅에 쓰면
> "오, 정확해요. 그런데 **왜** 그게 답인지는 039회차에 같이 봅시다"로 받고 넘어간다.

---

## ✅ 체크리스트 (학생)

- [ ] `[SerializeField]`를 붙여 Inspector에 값을 노출한다
- [ ] `private`인데 Inspector에 보이는 이유를 안다
- [ ] `transform.Rotate`로 물체를 돌린다
- [ ] 2D는 Z축만 쓴다
- [ ] **Play 중 바꾼 값은 사라진다**
- [ ] Copy/Paste Component Values를 안다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| Inspector에 변수가 안 보임 | `[SerializeField]` 누락 / 저장 안 함 | 둘 다 확인. "저장 → 전환 → 기다림" |
| 값을 바꿔도 안 변함 | **Play 중이 아님** | Play를 눌러야 `Update`가 돈다 |
| Play 멈추니 값이 돌아감 | **정상. 오늘의 핵심** | "그래서 오늘 배운 겁니다" |
| 물체가 납작해지며 사라짐 | Rotate X/Y에 값을 넣음 | Rotation을 0,0,0으로. "2D는 Z만" |
| 크기가 무한정 커져 화면을 덮음 | 정상 동작 | `F`로 다시 찾는다. 음수로 되돌려보게 한다 |
| `float`인데 `f` 누락 | 1주차 그대로 | "소수점 뒤엔 f. 4회차에 했죠" |
| `transform.Rotate(0,0,1.5)` | 정수/실수 혼용 | `0f, 0f, 1.5f`로 통일시킨다 |
| **"속도가 이상해요"** | `Time.deltaTime` 없음 | **의도된 것.** "039회차에 고칩니다"만 답한다 |
| 진도 빠른 학생이 `Time.deltaTime`을 씀 | 좋은 신호 | 개별로 칭찬. **반 전체에 공유하지 않는다** |
| Play 중 작업하고 30분 날림 | 반드시 나온다 | 오늘 배운 Copy Component Values를 즉시 실습시킨다 |

## 📮 다음 시간 예고

> "오늘 돌렸으니 다음 시간엔 **움직입니다.** 그리고 '왜 사람마다 속도가 다른가'도 곧 풀립니다. 지금은 궁금한 채로 두세요."
