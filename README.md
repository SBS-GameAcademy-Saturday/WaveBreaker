# Chapter 2 · 14주차 — 본 프로젝트 착수와 무한 맵

> **이 브랜치(`Chapter_2/Week1`)에는 14주차(066–070회차) 수업 내용만 들어 있습니다.**
> Chapter 1 실습 씬은 없습니다. `Chapter_1/Week1`~`Week7` 에 있습니다.

| | |
|---|---|
| Phase | 5 · 본 프로젝트 코어 (첫 주) |
| 회차 | 066–070 (5회차 · 10시간) |
| 씬 | `Game.unity` 하나 — 이 씬이 21주차까지 자란다 |
| 스크립트 | 9개 |
| 패키지 | `com.unity.cinemachine` 6.6.0 추가 |
| 결과물 | 끝나지 않는 들판을 돌아다니고, 오크에게 부딪히면 피가 깎인다 |

## 이번 주 5회차

### 066 · 본 프로젝트 착수
**배우는 것** — 폴더 규칙, `enum` 게임 상태, **설계 규칙 2가지**
- `GameState` 를 `bool` 여러 개가 아니라 `enum` 으로 두는 이유를 말한다
- 규칙 ① **몬스터를 만드는 곳은 스포너 한 곳뿐이다**
- 규칙 ② **입력을 읽는 코드와 움직이는 코드를 나눈다**

> 이 두 규칙은 22주차 네트워크를 위한 것이다. 지금은 네트워크를 한마디도 하지 않는다.

`Scripts/Manager/GameManager.cs`
→ [강의안](./docs/02_수업계획서/066-P5-본프로젝트-착수.md)

### 067 · 플레이어 이동과 반전
**배우는 것** — `PlayerInput` / `PlayerController` 분리, `flipX` 좌우 반전
- 입력과 이동을 **다른 스크립트로** 나눈다 ← 규칙 ②
- `.normalized` 를 빼면 대각선이 빨라지는 것을 확인한다
- 손을 뗐을 때 캐릭터가 홱 돌아가지 않게 조건을 건다

`Scripts/Player/PlayerInput.cs` · `PlayerController.cs`
→ [강의안](./docs/02_수업계획서/067-P5-플레이어-이동과-반전.md)

### 068 · 카메라 추적
**배우는 것** — **`LateUpdate`**, `Vector3.SmoothDamp`, **시네머신**
- `Update` 에 쓰면 카메라가 떠는 것을 **직접 겪는다**
- 왜 `LateUpdate` 여야 하는지 설명한다
- 손으로 짠 뒤 **시네머신으로 갈아 끼운다** — `smoothTime` 이 `Damping` 이 될 뿐 하는 일은 같다

`Scripts/Manager/CameraFollow.cs` (손으로 짜는 단계 · 씬에는 시네머신이 붙어 있다)
→ [강의안](./docs/02_수업계획서/068-P5-카메라-추적.md)

### 069 · 무한 맵
**배우는 것** — 타일 순환, `foreach (Transform t in transform)`
- 바닥 타일 **3×3** 을 깐다
- 멀어진 타일을 반대편으로 옮긴다 — 맵을 넓게 만들지 않는다

`Scripts/Map/InfiniteGround.cs`
→ [강의안](./docs/02_수업계획서/069-P5-무한-맵.md)

### 070 · Enemy 와 IDamageable ⭐
**배우는 것** — `abstract` · `virtual/override` · `interface` **를 유니티에서**
- 6주차에 콘솔로 짠 `Enemy` 상속과 `IDamageable` 을 **그대로 꺼낸다**
- `base.Start()` 를 빼면 체력이 0 으로 시작하는 것을 확인한다
- 플레이어도 `IDamageable` 을 단다 — 때리는 쪽은 상대가 뭔지 모른다

`Scripts/IDamageable.cs` · `Enemy/Enemy.cs` · `Enemy/ChargerEnemy.cs` · `Player/PlayerHealth.cs`
→ [강의안](./docs/02_수업계획서/070-P5-Enemy와-IDamageable.md)

## 이 브랜치에 있는 것

```
Assets/
├── _Project/
│   ├── Scenes/Game.unity ········ 이번 주에 만든 씬
│   ├── Scripts/ ················· 9개 (아래)
│   └── Animation/ ··············· Orc 클립 5 + 컨트롤러
└── _GameAssets/ ················· 에셋 팩 (교체 완료본)
    ├── Character/ ··············· Tiny RPG — Soldier · Orc
    ├── Environment/Cainos/ ······ 바닥 타일
    ├── Action RPG SFX V2/ ······· 효과음
    ├── Action RPG Music 1.6/ ···· BGM
    ├── Layer Lab/ ··············· GUI
    ├── Effect and FX Pixel All Free/
    ├── Items/ · Fonts/
```

| 스크립트 | 회차 |
|---|---|
| `Manager/GameManager.cs` | 066 |
| `Player/PlayerInput.cs` · `PlayerController.cs` | 067 |
| `Manager/CameraFollow.cs` | 068 |
| `Map/InfiniteGround.cs` | 069 |
| `IDamageable.cs` · `Enemy/Enemy.cs` · `Enemy/ChargerEnemy.cs` · `Player/PlayerHealth.cs` | 070 |

## 씬 구성

| 오브젝트 | 붙은 것 |
|---|---|
| `GameManager` | `GameManager` |
| `Main Camera` | `CinemachineBrain` |
| `CM_PlayerCamera` | `CinemachineCamera` (Follow = Player) · `CinemachinePositionComposer` (Damping 0.5 / 0.5) |
| `Player` (tag `Player`) | Soldier 스프라이트 · `Rigidbody2D` · `CapsuleCollider2D` · `PlayerInput` · `PlayerController` · `PlayerHealth` |
| `Ground` | `InfiniteGround` (tileSize 20, 3×3) + 타일 9장 |
| `Orc_Charger` | Orc 스프라이트 · `ChargerEnemy` · `Animator(Orc)` |

## 브랜치

| | |
|---|---|
| `Chapter_1/Week1`~`Week7` | 유니티 기초 (031–065) |
| **`Chapter_2/Week1`** | **← 지금 여기** (066–070) |
| `main` | 전체 과정 문서 + Chapter 1 |
