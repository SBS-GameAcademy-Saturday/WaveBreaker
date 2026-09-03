# C# 학습 자료 연동 — 001–030회차

> **저장소** : [SBS-GameAcademy-Saturday/CSharpStudyProject](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject)
> **로컬** : `WaveBreaker` 와 **같은 폴더에 나란히** 두는 것을 기준으로 한다 (`../CSharpStudyProject`)
>
> ⚠️ **이 저장소는 아직 만들어지는 중이다.** 이 문서는 **링크와 대응만** 잡아둔 것이고,
> 강의안(`001`–`030`)은 자료가 굳은 뒤에 쓴다. 파일이 늘거나 이름이 바뀌면 이 표만 고치면 된다.

## 1. 왜 따로 두나

| | WaveBreaker | CSharpStudyProject |
|---|---|---|
| 무엇 | 유니티 본 프로젝트 + 전체 커리큘럼 문서 | **C# 문법 예제 코드** |
| 도구 | Unity 6.5 | Visual Studio · .NET 콘솔 |
| 쓰는 구간 | 031–140회차 | **001–030회차** |
| 실행 | 유니티 에디터 | `dotnet run` / VS 실행 |

> 🔑 **1~6주차에는 유니티를 켜지 않는다.** 그래서 저장소도 나눠 둔다.
> 학생은 1주차에 `CSharpStudyProject` 만 클론하고, 7주차(031)에 `WaveBreaker` 를 받는다.

## 2. 저장소 구조

```
CSharpStudyProject/
 ├ Chapter1_Data/          변수 · 자료형 · 연산자        (Class_1 ~ Class_12 + Quiz)
 ├ Chapter2_CodeFlow/      조건문 · 반복문               (Class1 ~ Class9 + StarPattern + Quiz)
 ├ Chapter3_String/        문자열                        (Class1 ~ Class11 + Quiz)
 ├ Chapter4_Method/        메서드                        (Class1 ~ Class7)
 ├ Chapter5_OOP/           클래스 · 상속 · 다형성        (Class1 ~ Class13 + Class_TSG)
 ├ Chapter6_DataStructure/ 배열 · List · Dictionary …    (Class1 ~ Class10 + Quiz)
 ├ Chapter7_Extension/     제네릭 · 델리게이트 · 람다 …  (Class1 ~ Class10)
 ├ Slides/                 pptxgenjs 슬라이드            (ch01.js · ch02.js)
 ├ RPGProjectil.md         delegate/event 턴제 RPG 과제
 └ Program.cs              스크래치용 Main
```

각 파일 맨 위에 **`/// <summary>` 로 목표가 적혀 있다.** 강의안을 쓸 때 그 문장을 그대로 쓰면 된다.

## 3. 회차 ↔ 파일 대응

### Phase 0 · 1주차 (001–005) — 환경 · 첫 프로그램 · 변수

| 회차 | 주제 | 자료 |
|---|---|---|
| 001 | 오리엔테이션 & 완성작 시연 ✅ | — |
| 002 | 개발 환경 세팅 ✅ | 저장소 클론 · `dotnet run` 확인 |
| 003 | C# 첫 프로그램 ✅ | [`Program.cs`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Program.cs) |
| 004 | 변수와 자료형 ✅ | [`Ch1/Class_1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_1.cs) 변수와 데이터 형식 |
| 005 | 정수형 · 진법 · 범위 | [`Ch1/Class_2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_2.cs) 정수 형식 · [`Class_3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_3.cs) 2·10·16진수 · [`Class_4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_4.cs) 정수 범위의 비밀 |

### Phase 0 · 2주차 (006–010) — 자료형 나머지 · 연산자

| 회차 | 주제 | 자료 |
|---|---|---|
| 006 | 실수 · bool · string | [`Ch1/Class_5`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_5.cs) float · [`Class_6`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_6.cs) bool · [`Class_7`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_7.cs) string |
| 007 | 형 변환 (캐스팅) | [`Ch1/Class_8`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_8.cs) 캐스팅 · [`Ch3/Class2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter3_String/Class2.cs) 파싱 |
| 008 | 산술 · 비교 연산자 | [`Ch1/Class_9`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_9.cs) · [`Class_10`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_10.cs) |
| 009 | 논리 · 증감 연산자 | [`Ch1/Class_11`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_11.cs) · [`Class_12`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Class_12.cs) |
| 010 | 에러 메시지 읽기 + 1차 점검 | [`Ch1/Chapter1_Quiz`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter1_Data/Chapter1_Quiz.cs) |

> 💡 **출력 포맷은 필요할 때만.** [`Ch3/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter3_String/Class1.cs) 문자열 포맷팅은
> `$"체력 {hp}/{max}"` 를 처음 쓰는 회차에 한 장만 끼워 넣는다.

### Phase 0 · 3주차 (011–015) — 조건문 · 반복문 🔴 최대 난관

| 회차 | 주제 | 자료 |
|---|---|---|
| 011 | `if` / `else` | [`Ch2/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class1.cs) |
| 012 | `switch` · 상수 | [`Ch2/Class2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class2.cs) · [`Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class4.cs) 상수와 열거형 |
| 013 | **가위바위보 실습** | [`Ch2/Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class3.cs) |
| 014 | `while` · `do-while` · `for` | [`Ch2/Class5`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class5.cs) · [`Class6`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class6.cs) · [`Class7`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class7.cs) |
| 015 | `break`/`continue` · 이중 반복문 · **별찍기** | [`Ch2/Class8`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class8.cs) · [`Class9`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class9.cs) · [`StarPattern`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Chapter2_StarPattern.cs) · [`Quiz`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Chapter2_Quiz.cs) |

> 🔴 **Phase 0 문서가 "3주차 최대 난관, 서두르지 않는다" 고 못박아 뒀다.**
> 별찍기는 **버퍼용 난이도 조절 카드**로 쓴다 — 빠른 학생에게 ⭐도전으로 준다.

### Phase 0 · 4주차 (016–020) — 배열 · 메서드 · 디버깅

| 회차 | 주제 | 자료 |
|---|---|---|
| 016 | 배열 · 2차원 배열 | [`Ch6/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Class1.cs) · [`Class2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Class2.cs) |
| 017 | `List` · `foreach` | [`Ch6/Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Class3.cs) · [`Ch7/Class2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class2.cs) |
| 018 | 메서드 · 반환값 | [`Ch4/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter4_Method/Class1.cs) 함수 · [`Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter4_Method/Class3.cs) 반환값 |
| 019 | 오버로딩 · 매개변수 · VS 디버깅 | [`Ch4/Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter4_Method/Class4.cs) · [`Class5`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter4_Method/Class5.cs) |
| 020 | **종합 평가** | [`Ch6/Chapter6_Quiz`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Chapter6_Quiz.cs) |

### Phase 1 · 5주차 (021–025) — 클래스

| 회차 | 주제 | 자료 |
|---|---|---|
| 021 | 클래스와 객체 | [`Ch5/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class1.cs) 클래스 개념 |
| 022 | 필드 · 메서드 · 생성자 | [`Ch5/Class6`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class6.cs) 생성자와 소멸자 |
| 023 | 접근제한자 · 은닉성 | [`Ch5/Class8`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class8.cs) |
| 024 | **`property`** | [`Ch7/Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class3.cs) |
| 025 | 값과 참조 · 캐릭터 정보 실습 | [`Ch5/Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class3.cs) 복사와 참조 · [`Class2`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class2.cs) struct |

### Phase 1 · 6주차 (026–030) — 상속 · 다형성 · 인터페이스

| 회차 | 주제 | 자료 |
|---|---|---|
| 026 | **상속** | [`Ch5/Class7`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class7.cs) |
| 027 | **`virtual` · `override` 다형성** | [`Ch5/Class10`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class10.cs) · [`Class9`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class9.cs) 클래스 형식 변환 |
| 028 | **추상 클래스와 인터페이스** | [`Ch5/Class11`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class11.cs) |
| 029 | `enum` · `static` | [`Ch2/Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter2_CodeFlow/Class4.cs) 열거형 · [`Ch5/Class5`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class5.cs) static의 정체 |
| 030 | 🔴 **몬스터 클래스 설계 실습** | [`Ch5/Class_TSG`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class_TSG.cs) `Character` 계층 · [`Class12`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class12.cs) 설계 원칙 |

> 🔑 **`Class_TSG.cs` 가 030회차의 핵심 재료다.** `Character` 부모에 `Player`/`Monster` 가 붙는 구조인데,
> 이게 **Phase 5 의 `Enemy` + `ChargerEnemy`/`RunnerEnemy`/`TankEnemy` 와 같은 모양**이다.
> 030에서 만든 콘솔 클래스를 **14주차(066–070)에 `MonoBehaviour` 만 붙여 옮기는** 형태로 간다.

## 4. 001–030 범위 밖 — 나중에 쓰는 것

지금 저장소에 있지만 **1~6주차에는 안 쓴다.** 유니티 구간에서 필요해질 때 꺼낸다.

| 자료 | 어디서 쓰나 |
|---|---|
| [`Ch7/Class3`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class3.cs) Property | 024에서 한 번, **070·081** 에서 다시 |
| [`Ch7/Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class4.cs) Delegate · [`Class6`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class6.cs) Event | **115회차** `Health.OnValueChanged += OnHealthChanged;` · 119 · 122 |
| [`Ch7/Class7`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class7.cs) Lambda | **085회차** `buttons[i].onClick.AddListener(() => Choose(data));` |
| [`Ch4/Class7`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter4_Method/Class7.cs) 클로저 | **085회차** — 반복문 변수를 그대로 담으면 전부 마지막 값이 된다 (`int index = i;`) |
| [`Ch6/Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Class4.cs) Dictionary | **102회차 오브젝트 풀링** (`Dictionary<GameObject, Queue<GameObject>>`) |
| [`Ch6/Class6`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter6_DataStructure/Class6.cs) Queue | **102회차 풀 서랍** |
| [`Ch7/Class1`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class1.cs) Generic | 115 `NetworkVariable<T>` 를 볼 때 한 줄 |
| [`Ch7/Class8`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter7_Extension/Class8.cs) Exception | 124 Relay `try/catch` |
| [`Ch5/Class4`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class4.cs) 스택과 힙 · [`Class13`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/Chapter5_OOP/Class13.cs) 박싱 | **101회차 "왜 렉이 걸리나"** 의 배경 |
| [`RPGProjectil.md`](https://github.com/SBS-GameAcademy-Saturday/CSharpStudyProject/blob/main/RPGProjectil.md) delegate/event 턴제 RPG | **버퍼(131–140)** 또는 빠른 학생 ⭐도전 |

> ⚠️ **2026-09-03 정정.** 처음에는 Delegate·Event 를 "088회차 HUD 이벤트" 로 적었는데 **틀렸다.**
> `HUDView` 는 이벤트를 안 쓰고 `Update()` 에서 매 프레임 읽어 그린다. 프로젝트 스크립트 전체에
> `event` 선언이 하나도 없다. `+=` 로 구독하는 첫 자리는 **115회차 `NetworkVariable.OnValueChanged`** 다.
> 람다와 클로저도 마찬가지로 **085회차 `AddListener(() => Choose(data))`** 가 첫 자리다.

**아예 안 쓰는 것** — 커리큘럼에 자리가 없다. 지우지는 말고 참고 자료로 둔다.

`Ch3` 정규식·인코딩·`StringBuilder`·Raw 리터럴 ·
`Ch6` LinkedList·SortedList·SortedDictionary · `Ch7` Reflection·Nullable·Action/Func

## 5. 슬라이드

`CSharpStudyProject/Slides/` 에 **pptxgenjs 스크립트**가 있다. `WaveBreaker` 쪽 덱과 같은 방식이다.

| 파일 | 대응 |
|---|---|
| `ch01.js` → `Chapter1_데이터와_변수.pptx` | 004–010회차 |
| `ch02.js` → `Chapter2_조건문과_반복문.pptx` | 011–015회차 |

**WaveBreaker 쪽에도 이 저장소를 다루는 덱이 하나 있다.**

| 파일 | 무엇 |
|---|---|
| [`부록A-CSharp-지금은-안-배우는-것.pptx`](../04_배포자료/슬라이드/부록A-CSharp-지금은-안-배우는-것.pptx) | 위 4장의 내용을 16장으로 — "나중에 만난다" 와 "아예 안 쓴다" |

> ⚠️ **이 문서의 4장과 그 덱은 같은 내용이다.** 한쪽을 고치면 `generate_apxA.js` 도 같이 고친다.

> 💡 **디자인은 [`WaveBreaker/docs/04_배포자료/슬라이드/DESIGN.md`](../04_배포자료/슬라이드/DESIGN.md) 를 따르면 된다.**
> `codeH(n) = n*0.225 + 0.62` 헬퍼와 `code()`/`table()` 이 y 를 반환하는 규칙이 그쪽에 정리돼 있다.
> 13주차 이후 덱이 안 잘리는 이유가 그것이다.

## 6. 앞으로 할 일

- [ ] `CSharpStudyProject` 자료가 굳으면 **005–030 강의안 26개**를 쓴다
- [ ] 각 회차 상단표의 `준비물(강사)` 에 해당 `.cs` 파일 경로를 넣는다
- [ ] `Slides/ch03.js` 이후를 `DESIGN.md` 규격으로 맞춘다
- [ ] `Snapshot_P0` · `Snapshot_P1` 을 이 저장소의 태그로 대신할지 정한다

> ⚠️ **이 문서는 저장소가 바뀌면 같이 고쳐야 한다.** 파일 이름이 `Class_1.cs` / `Class1.cs` 로
> 챕터마다 다르니(1장만 언더바가 있다) 링크를 복사할 때 주의한다.
