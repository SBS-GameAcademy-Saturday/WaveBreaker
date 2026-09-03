
# 124회차 · Relay — 6자리 코드로 친구와 붙는다

| | |
|---|---|
| **Phase** | 9 · 네트워크 협동 |
| **소요** | 2시간 (비대면) |
| **선행** | 123회차 (시간 정지), 109회차 (`NetworkManager`) |
| **오늘 배우는 것** | Unity Gaming Services, 익명 로그인, Relay 할당, 접속 코드 |
| **씬** | `Practice/109_Network_Test.unity` |
| **준비물(강사)** | 🔴 **UGS 연동과 Relay 활성화를 미리 검증해 둘 것** |

## 🎯 오늘의 목표

1. **접속 코드**로 방을 만든다
2. 코드를 받아 **진짜 인터넷으로** 들어간다
3. 왜 중계 서버가 필요한지 안다

> 🔴 **오늘은 준비가 안 되면 회차가 통째로 막힌다.**
> 강사가 **미리** ① Unity Cloud 프로젝트 연결 ② 대시보드에서 Relay 켜기 ③ 계정 로그인
> 세 가지를 검증해 둔다. 학생 화면에서 안 되면 그 학생은 아무것도 못 한다.
>
> 🔑 **설계 의도**: 여기까지 오면 학생은 "친구랑 진짜로 해보고 싶다" 가 된다.
> 그 욕구가 최고조일 때 Relay 를 준다. 그리고 **다음 회차가 합동 플레이 데이**다.

## 📦 오늘의 제출물

**친구와 접속 코드로 연결된 화면 (양쪽 창 또는 두 사람 화면)** → `#자랑`

---

## ⏱ 타임테이블

| 시간 | 블록 |
|---|---|
| 00:00–00:10 | 복습 퀴즈 + 왜 중계가 필요한가 |
| 00:10–00:30 | 🔴 **준비 확인** (전원) |
| 00:30–01:00 | 같이 하기 — 로그인 → 방 만들기 → 입장 |
| 01:00–01:10 | 휴식 |
| 01:10–01:40 | **합동 플레이** (실제로 붙어서 논다) |
| 01:40–01:50 | 정리 |
| 01:50–02:00 | 체크리스트 + 제출 + 예고 |

---

## 00:00–00:10 · 복습 퀴즈 + 왜 중계가 필요한가

### 복습 퀴즈 (4분)

1. 협동에서 `timeScale` 이 안 되는 이유는? → **내 컴퓨터에만 적용된다** (123)
2. 대신 뭘 쓰나? → **서버가 들고 있는 `Paused`** (123)
3. 지금까지 쓴 주소는? → **`127.0.0.1` (내 컴퓨터)** (108)

### 왜 중계 서버인가 (6분)

> 💬 "친구 컴퓨터에 직접 붙으려면 **친구 집 공유기를 열어야** 합니다."
> 💬 "포트포워딩이라고 하는데, 공유기마다 화면이 다르고 학교/회사망에서는 아예 안 됩니다."
> 💬 "비대면 수업에서 **절대 못 시킵니다.**"

```
[직접 연결]  내 컴퓨터 ──?── 공유기 ──?── 공유기 ──?── 친구 컴퓨터
                              막혀 있다

[Relay]      내 컴퓨터 ────▶ 유니티 서버 ◀──── 친구 컴퓨터
                             둘 다 "나가는" 연결이라 막히지 않는다
```

> 🔑 💬 "**나가는 연결은 대부분 열려 있습니다.** 웹사이트 접속처럼요."
> 💬 "그래서 둘 다 유니티 서버로 '나가서' 거기서 만나는 겁니다."

---

## 00:10–00:30 · 🔴 준비 확인

**전원이 한 명씩 확인한다. 안 되면 오늘 아무것도 못 한다.**

| # | 확인 | 어디서 |
|---|---|---|
| ① | Unity Cloud 프로젝트 연결 | `Edit → Project Settings → Services` |
| ② | Relay 서비스 **켜짐** | Unity Cloud 대시보드 |
| ③ | 에디터에 계정 로그인 | 유니티 우상단 |

> 💬 "강사 프로젝트에는 이렇게 나옵니다."

```
cloudProjectId = 2624e16a-aa69-47cf-8aad-ed094afa965c
```

> 🚨 **셋 중 하나라도 빠지면 예외가 납니다.** 메시지를 읽으면 어느 것인지 알 수 있어요.

| 에러 메시지 | 무엇이 빠졌나 |
|---|---|
| `Unity Services can only be initialized in Play Mode` | **Play 를 안 눌렀다** |
| 프로젝트 ID 관련 | ① 연결 |
| `service is not enabled` | ② Relay 활성화 |
| 인증 관련 | ③ 로그인 |

> 💡 **첫 번째가 흔하다.** `UnityServices.InitializeAsync()` 는 **Play 모드에서만** 된다.
> 강사도 에디트 모드에서 시도했다가 이 에러를 봤다.

---

## 00:30–01:00 · 같이 하기 ★

### ① 로그인 (10분)

```csharp
private async Task<bool> SignIn()
{
    if (signedIn) return true;

    try
    {
        await UnityServices.InitializeAsync();

        if (!AuthenticationService.Instance.IsSignedIn)
            await AuthenticationService.Instance.SignInAnonymouslyAsync();

        signedIn = true;
        return true;
    }
    catch (Exception e)
    {
        Report("로그인 실패 — " + e.Message);
        return false;
    }
}
```

| 조각 | 뜻 |
|---|---|
| `async Task<bool>` | 인터넷을 기다려야 하니 비동기다 |
| `await` | 끝날 때까지 기다린다 (게임은 안 멈춘다) |
| `SignInAnonymouslyAsync` | **아이디·비번 없이** 로그인 |
| `try / catch` | 인터넷 일은 **실패할 수 있다** |

> 💬 "**익명 로그인**입니다. 회원가입이 없어요. 기기마다 임시 ID 를 하나 받습니다."

**실측** — 강사가 확인한 값

```
UnityServices 초기화 = Initialized
로그인 = True   PlayerId = L1xXNWcKBH4J45bpKTHhOJwYEj9f
```

> 🚨 **`try / catch` 를 꼭 쓴다.** 인터넷이 끊기거나 서비스가 꺼져 있으면 예외가 난다.
> 안 감싸면 게임이 그냥 멈춘 것처럼 보인다.

### ② 방 만들기 (12분)

```csharp
// maxPlayers - 1 : 호스트를 뺀 인원이다. 2인이면 1을 넣는다.
Allocation allocation = await RelayService.Instance.CreateAllocationAsync(maxPlayers - 1);

string code = await RelayService.Instance.GetJoinCodeAsync(allocation.AllocationId);

var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();

// 호스트는 hostConnectionData 가 없다 (자기가 호스트니까) → null
transport.SetRelayServerData(
    allocation.RelayServer.IpV4,
    (ushort)allocation.RelayServer.Port,
    allocation.AllocationIdBytes,
    allocation.Key,
    allocation.ConnectionData,
    null,
    true);   // isSecure — dtls

NetworkManager.Singleton.StartHost();
```

> 🚨 **`maxPlayers - 1` 을 넣는다.** 호스트를 뺀 인원이다. 2인 게임이면 `1`.
> 여기에 `2` 를 넣으면 3인 방이 된다.

**실측**

```
접속 코드 = RMKDHN
Relay 서버 = 34.180.64.245:37000
StartHost = True
IsListening=True  IsHost=True  내 번호=0
전송 방식 = RelayUnityTransport
```

> 💬 "**6자리 코드**가 나왔죠. 이걸 친구에게 보내면 됩니다."
> 💬 "그리고 `전송 방식` 을 보세요. **`RelayUnityTransport`** 로 바뀌었습니다."
> 💬 "아까까지는 `127.0.0.1` 이었는데 이제 **진짜 인터넷 주소**예요."

### ③ 입장 (10분)

```csharp
JoinAllocation join = await RelayService.Instance.JoinAllocationAsync(code);

var transport = NetworkManager.Singleton.GetComponent<UnityTransport>();

// 클라이언트는 호스트의 연결 정보(HostConnectionData)까지 받아야 한다
transport.SetRelayServerData(
    join.RelayServer.IpV4,
    (ushort)join.RelayServer.Port,
    join.AllocationIdBytes,
    join.Key,
    join.ConnectionData,
    join.HostConnectionData,   // ← 호스트와 다른 점
    true);

NetworkManager.Singleton.StartClient();
```

> 💬 "호스트와 딱 **한 군데**만 다릅니다. `hostConnectionData` 요."
> 💬 "호스트는 자기가 호스트니까 `null`, 클라이언트는 **호스트 정보를 받아야** 붙습니다."

**코드 입력 주의**

```csharp
string code = codeInput.text.Trim().ToUpper();
```

> 🚨 **대문자로 바꾸고 공백을 지운다.** 학생이 소문자로 치거나 앞뒤에 공백을 넣는다.

---

## 01:10–01:40 · 🎮 합동 플레이

> 📌 **Phase 9 문서가 "주 1회 합동 플레이 데이" 를 고정 편성하라고 한 자리다.**
> 네트워크는 혼자 붙들고 있으면 재미가 하나도 없다.

**짝을 지어 실제로 붙는다.** 30분 동안 논다.

| 강사가 볼 것 | |
|---|---|
| 접속이 되나 | 코드 전달 방법(채팅) 안내 |
| 렉이 어떤가 | 113회차의 3분류로 말하게 한다 |
| 부활이 되나 | 122회차 |
| 레벨업이 같이 뜨나 | 123회차 |

> 💬 "**지금 여러분은 서로 다른 집에서 같은 게임을 하고 있습니다.**"
> 💬 "22주차에 '게임이 두 개' 라고 배웠죠. 그 두 개가 지금 이어져 있는 거예요."

---

## 01:40–01:50 · 정리

**칠판 요약**

```
왜 중계인가   직접 연결은 공유기에 막힌다
              둘 다 "나가는" 연결로 유니티 서버에서 만난다

순서
  ① UnityServices.InitializeAsync()      ← Play 모드에서만!
  ② SignInAnonymouslyAsync()             ← 회원가입 없음
  ③ CreateAllocationAsync(maxPlayers-1)  ← 호스트 뺀 인원
  ④ GetJoinCodeAsync()                   ← 6자리 코드
  ⑤ SetRelayServerData(...)              ← 호스트는 null, 클라는 HostConnectionData
  ⑥ StartHost() / StartClient()

전부 try/catch 로 감싼다. 인터넷 일은 실패할 수 있다.
```

---

## ✅ 체크리스트 (학생)

- [ ] Unity Cloud 프로젝트가 연결돼 있다
- [ ] Relay 서비스가 켜져 있다
- [ ] Play 모드에서 로그인이 된다
- [ ] 방을 만들면 **6자리 코드**가 나온다
- [ ] 전송 방식이 `RelayUnityTransport` 로 바뀐다
- [ ] 친구 코드로 **입장**이 된다
- [ ] 서로의 캐릭터가 보인다
- [ ] `try / catch` 로 감쌌다
- [ ] 제출했다

## 🚨 흔한 사고 & 대응 (강사용)

| 에러/상황 | 진짜 원인 | 대응 |
|---|---|---|
| **`can only be initialized in Play Mode`** | 에디트 모드에서 시도 | **강사도 겪었다.** Play 를 누른다 |
| 🔴 서비스 미활성 | 대시보드 설정 | **미리 검증해 둘 것** |
| 프로젝트 미연결 | Project Settings → Services | |
| 코드가 안 먹음 | 소문자 / 공백 | `Trim().ToUpper()` |
| 3인 방이 됨 | `maxPlayers` 를 그대로 넣음 | `maxPlayers - 1` |
| 클라이언트가 못 붙음 | `HostConnectionData` 누락 | 호스트와 다른 한 군데 |
| 예외에 게임이 멈춘 듯 | `try/catch` 없음 | 감싸고 메시지를 화면에 |
| 코드가 만료됨 | 할당에 수명이 있다 | 다시 만든다 |
| 인터넷이 느림 | 학교/회사망 | 113회차 3분류로 설명 |

## 📮 다음 시간 예고

> "친구와 붙었습니다. **Phase 9 의 마지막 시간**이에요."
>
> "다음 시간엔 **[혼자 하기] 와 [같이 하기] 를 한 게임에** 넣습니다."
>
> 🔑 "그리고 반드시 확인할 게 있어요 — **[혼자 하기] 가 여전히 잘 되는가.**
> 20회차 동안 협동을 만들면서 21주차의 완성작을 안 깨뜨렸는지 봅니다."
