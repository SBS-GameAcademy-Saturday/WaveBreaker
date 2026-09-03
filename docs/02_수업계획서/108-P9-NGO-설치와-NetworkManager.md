# 108회차 · NGO 설치 + NetworkManager — 심판을 놓는다

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 107회차 (서버·클라이언트·호스트) |
| **오늘 배우는 것** | Package Manager, `NetworkManager`, `UnityTransport` |
| **씬** | `Practice/109_Network_Test.unity` (신규) |
| **준비물(강사)** | ⚠️ **인터넷이 느린 학생 대비.** 패키지 6개를 받는다 |

## 🎯 오늘의 목표

1. 네트워크 패키지를 **전부** 설치한다
2. **`NetworkManager`** 를 놓고 설정한다
3. **본 게임을 건드리지 않는다** — 연습 씬에서만 한다

> ⚠️ **오늘 접속은 안 한다.** 접속은 109회차다. 오늘은 도구를 갖추는 날이다.
>
> 🔴 **`Game.unity` 를 절대 안 건드린다.** Phase 9 최대 사고는 **협동을 만들다 싱글을 깨뜨리는 것**이다.
> 22~23주차는 **연습 씬에서만** 작업하고, 본 게임에는 24주차부터 옮긴다.
>
> 🔑 **설계 의도**: 네트워크는 처음 설치에서 막히면 그 주가 통째로 날아간다.
> 그래서 한 회차를 **설치와 설정에만** 쓴다.

## 📦 오늘의 제출물

**Package Manager에 패키지 6개가 보이는 스크린샷 + `NetworkManager` 인스펙터 스크린샷** → `#제출`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 + 오늘 할 일 |
| 00:10–00:45 | 같이 하기 ① 패키지 설치 (🚨 **재시작 포함**) |
| 00:45–00:55 | 휴식 |
| 00:55–01:35 | 같이 하기 ② 연습 씬 + `NetworkManager` |
| 01:35–01:50 | 순회 확인 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 + 오늘 할 일

### 복습 퀴즈 (4분)

1. 호스트는 무엇과 무엇을 겸하나? → **서버 + 클라이언트** (107)
2. "진짜 값" 은 어디에 있나? → **서버** (107)
3. 내 캐릭터를 소유자 권한으로 두는 이유는? → **반응이 빨라야 해서** (107)

### 오늘 할 일 (6분)

```
① 패키지 6개 설치          →  유니티 재시작 (중요!)
② 연습 씬 만들기            →  109_Network_Test
③ NetworkManager 놓기       →  Transport 연결
```

> 🔴 💬 "**본 게임 `Game.unity` 는 오늘 안 엽니다.**"
> 💬 "네트워크를 만들다가 싱글을 깨뜨리는 게 이 구간 최대 사고예요. 연습 씬에서만 합니다."

---

## 00:10–00:45 · 같이 하기 ① 패키지 설치

### ① 무엇을 왜 까는가 (8분)

`Window → Package Manager` → `Unity Registry`

| 패키지 | 버전 | 왜 |
|---|---|---|
| **Netcode for GameObjects** | 2.13.2 | **본체.** 동기화를 해준다 |
| **Multiplayer Play Mode** | 2.0.2 | 에디터 하나로 2인 테스트 (110회차) |
| Multiplayer Tools | 2.2.11 | 네트워크 프로파일러 |
| Services Core | 1.18.0 | 아래 둘의 바탕 |
| Authentication | 3.7.4 | Relay 를 쓰려면 필요 |
| **Relay** | 1.2.0 | 인터넷 접속 (124회차) |

> 💬 "뒤의 셋은 **25주차**에 씁니다. 그런데 지금 같이 깝니다."
> 💬 "**설치는 한 번에 몰아서** 하는 게 낫습니다. 나중에 또 깔면 또 재시작해야 해요."

**설치 순서**: 이름으로 검색 → `Install`. 하나씩 끝나고 다음 걸 한다.

> 🚨 **인터넷이 느리면 5분 이상 걸린다.** 정상이다. 중간에 유니티를 끄지 않는다.

### ② 🚨 유니티를 재시작한다 (7분) — 놓치기 쉬움

> 🔴 💬 "설치가 끝나면 **유니티를 껐다 켭니다.**"

**왜인가** — 강사가 실제로 겪은 것.

```
설치 직후 :  Window → Multiplayer  메뉴가 없다
             Multiplayer Play Mode 창을 열 수가 없다

재시작 후 :  메뉴가 생긴다
```

> 💬 "`Multiplayer Play Mode` 는 **에디터가 켜질 때 등록**됩니다."
> 💬 "설치만 하고 안 껐다 켜면 **깔았는데 안 보이는** 상태가 됩니다."

> 💡 Unity 6에서 이 패키지는 **문서만 들어 있고 기능은 에디터에 내장**돼 있다.
> 그래서 "설치했는데 폴더에 코드가 없다" 고 놀라지 않아도 된다.

### ③ 설치 확인 (10분)

`Window → Package Manager` → `In Project` 에서 6개를 눈으로 센다.

**메뉴도 확인한다**

```
Window → Multiplayer → Multiplayer Play Mode     ← 이게 보이면 성공
```

> 🚨 **안 보이면 재시작을 안 한 것이다.** 다시 껐다 켠다.

### ④ 뭐가 늘었나 (10분)

> 💬 "이제 코드에서 쓸 수 있는 게 늘었습니다."

```csharp
using Unity.Netcode;                        // NetworkManager, NetworkBehaviour ...
using Unity.Netcode.Transports.UTP;         // UnityTransport
using Unity.Netcode.Components;             // NetworkTransform (112회차)
```

| 이름 | 하는 일 | 언제 배우나 |
|---|---|---|
| `NetworkManager` | 심판. 접속을 받고 관리한다 | **오늘** |
| `NetworkObject` | "이건 네트워크 물건이다" 는 표시 | 109 |
| `NetworkBehaviour` | `MonoBehaviour` 의 네트워크판 | 109 |
| `NetworkTransform` | 위치를 자동으로 맞춰준다 | 112 |
| `NetworkVariable` | 값을 자동으로 맞춰준다 | 115 |
| `Rpc` | "이거 해줘" 라고 부탁한다 | 116 |

---

## 00:55–01:35 · 같이 하기 ② 연습 씬 + NetworkManager

### ① 연습 씬을 만든다 (10분)

`File → New Scene → Empty` → `Assets/_Project/Scenes/Practice/109_Network_Test.unity` 로 저장.

| 오브젝트 | 내용 |
|---|---|
| `Main Camera` | Orthographic · Size 5 · 배경 `(0.13, 0.14, 0.18)` |
| `EventSystem` | 버튼을 누르려면 필요 (085 회수) |
| `NetworkManager` | ← 오늘의 주인공 |
| `UI` | Canvas — 상태 글자 + 버튼 3개 (109회차에 씀) |

> 💡 Build Settings 에는 **넣되 체크는 끈다.** 학생 빌드에 연습 씬이 들어갈 이유가 없다. (104 회수)

### ② `NetworkManager` 를 놓는다 (15분)

빈 오브젝트를 만들고 이름을 `NetworkManager` 로. 컴포넌트 두 개를 붙인다.

| 컴포넌트 | 하는 일 |
|---|---|
| **`Unity Transport`** | 실제로 데이터를 주고받는 부분 |
| **`Network Manager`** | 접속 관리 |

> 🚨 **`Unity Transport` 를 먼저 붙인다.** `NetworkManager` 의 `Network Transport` 칸에 넣어야 하기 때문이다.

**`NetworkManager` 설정**

| 항목 | 값 | 뜻 |
|---|---|---|
| **Network Transport** | `Unity Transport` | 방금 붙인 것 |
| **Player Prefab** | (109회차에 채운다) | 접속하면 자동으로 만들어 줄 것 |
| Tick Rate | 30 (기본) | 초당 몇 번 동기화하나 |
| Connection Approval | 끔 | 아무나 들어올 수 있다 |

**`Unity Transport` 설정**

| 항목 | 값 |
|---|---|
| Address | `127.0.0.1` |
| Port | `7777` |

> 🔑 💬 "**`127.0.0.1` 은 '내 컴퓨터' 라는 뜻입니다.**"
> 💬 "지금은 내 컴퓨터 안에서만 테스트해요. 진짜 인터넷은 124회차(Relay)입니다."

> 💡 `7777` 은 관례적으로 쓰는 번호다. 다른 프로그램이 쓰고 있으면 바꾼다.

### ③ `NetworkManager` 는 특별하다 (8분)

> 💬 "이 오브젝트는 **씬에 하나만** 있어야 합니다."

```csharp
NetworkManager.Singleton      // 어디서든 이걸로 찾는다
```

> 💬 "`GameManager.Instance` 랑 같은 방식이죠. **066회차에서 배운 싱글톤**입니다."
> 💬 "다만 이건 우리가 만든 게 아니라 **유니티가 만들어 준** 겁니다."

**자주 쓸 값**

| 값 | 뜻 |
|---|---|
| `IsListening` | 지금 네트워크가 켜져 있나 |
| `IsHost` / `IsServer` / `IsClient` | 나는 누구인가 |
| `LocalClientId` | 내 번호 (호스트는 0) |
| `ConnectedClientsIds` | 접속자 목록 (**서버만 정확하다**) |

### ④ 확인 (7분)

▶ Play → **아무 일도 안 일어난다.** 정상이다.

> 💬 "**아직 접속을 안 했으니까요.** `NetworkManager` 는 대기 중입니다."

Console 에 빨간 에러가 없으면 오늘은 성공이다.

---

## 01:35–01:50 · 순회 확인

강사가 브레이크아웃을 돌며 **화면 공유로** 확인한다.

| 확인 | 어떻게 |
|---|---|
| 패키지 6개 | Package Manager → In Project |
| 재시작했나 | `Window → Multiplayer` 메뉴가 보이는지 |
| `NetworkManager` | Transport 칸이 비어 있지 않은지 |
| **`Game.unity` 를 안 건드렸나** | 🔴 Git 이나 저장 시각 확인 |

---

## ✅ 체크리스트 (학생)

- [ ] 패키지 6개가 In Project 에 보인다
- [ ] **유니티를 껐다 켰다**
- [ ] `Window → Multiplayer` 메뉴가 보인다
- [ ] 연습 씬 `109_Network_Test` 를 만들었다
- [ ] `NetworkManager` + `Unity Transport` 를 붙였다
- [ ] Transport 칸이 채워져 있다
- [ ] Address `127.0.0.1` · Port `7777`
- [ ] Play 했을 때 빨간 에러가 없다
- [ ] 🔴 **`Game.unity` 를 안 건드렸다**
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`Window → Multiplayer` 가 없음** | 재시작 안 함 | **오늘 1등.** 강사도 겪었다 |
| 패키지 설치가 안 끝남 | 인터넷 | 기다린다. 유니티를 끄면 더 꼬인다 |
| 설치 후 컴파일 에러 | 다른 패키지와 충돌 | Console 을 보고 하나씩. 대개 재시작으로 해결 |
| `Transport` 칸이 안 채워짐 | `NetworkManager` 를 먼저 붙였다 | Transport 를 붙이고 드래그 |
| `NetworkManager` 가 둘 | 실수로 두 개 만듦 | 씬에 하나만 |
| Play 하면 에러 | Player Prefab 이 비었다 | 109회차에 채운다. 지금은 경고여도 정상 |
| **`Game.unity` 를 열어버림** | 🔴 습관 | 저장하지 말고 닫는다 |
| 포트 충돌 | 다른 프로그램이 7777 사용 | `7778` 로 바꾼다 |
| 패키지 폴더에 코드가 없음 | MPPM 은 문서만 있다 | **정상.** 기능은 에디터 내장 |

## 📮 다음 시간 예고

> "도구는 다 갖췄습니다. 다음 시간에 **드디어 접속합니다.**"
>
> "플레이어 프리팹에 `NetworkObject` 라는 표시를 붙이고,
> [호스트] 버튼을 누르면 **캐릭터가 생깁니다.**"
>
> "아직 안 움직여요. 움직이는 건 112회차예요. 그래도 **처음으로 네트워크가 도는 걸** 보게 됩니다."
