# Unity 프로젝트 개요

> 이 강의에서 만들 **Unity 프로젝트 3종**의 규격 문서. 프로젝트를 실제로 만들기 전에 여기서 규칙을 확정한다.
> 게임 사양: [확정-게임기획서.md](../00_기획/확정-게임기획서.md) · 스크립트 설계: [스크립트-설계.md](./스크립트-설계.md)

---

## 1. 프로젝트 3종

이 강의는 프로젝트를 **세 갈래로 관리**한다. 하나로 뭉치면 반드시 사고가 난다.

| # | 이름 | 용도 | 관리 |
|---|---|---|---|
| ① | **레퍼런스 (강사용)** | 완성본. 강사가 미리 끝까지 만들어 둔 정답 프로젝트 | 강사만. 학생 배포 금지 |
| ② | **템플릿 (학생 배포용)** | 폴더 구조 + 에셋 임포트 + 설정만 끝난 빈 프로젝트 | 14주차(066회차)에 배포 |
| ③ | **스냅샷 (구간별)** | ①에서 각 Phase 종료 시점을 잘라낸 것 | 뒤처진 학생 재합류용 |

> 🔑 **①을 먼저 끝까지 만든다.** 강사가 완성해본 적 없는 걸 가르치면 회차마다 막힌다. ②③은 ①에서 파생시킨다.

### 스냅샷 목록

| 스냅샷 | 회차 | 상태 |
|---|---|---|
| `Snapshot_P5_Core` | 070 | 코어 루프 (상속 구조 + 매니저) |
| `Snapshot_P5_Full` | 080 | 무기 3종 + 몬스터 3종 |
| `Snapshot_P6` | 090 | 업그레이드 + 보스 |
| `Snapshot_P7` | 100 | UI + 연출 |
| **`Snapshot_P8_Final_Single`** | 105 | ⭐ **폐기 금지.** 최소 보장 결과물 |
| `Snapshot_P9_step1` | 110 | NGO 설치 + 로컬 접속 |
| `Snapshot_P9_step2` | 115 | 동기화 + Ownership |
| `Snapshot_P9_step3` | 120 | 호스트 권한 스폰 |
| `Snapshot_P9_step4` | 124 | Relay + 모드 통합 |

> 배포 방식은 **압축본 권장.** 노베이스에게 Git을 가르치는 데 회차를 쓸 여유가 없다. (Git은 27주차 ⭐도전 과제로)

---

## 2. 프로젝트 이름

### 후보

| 영문 (폴더·프로젝트명) | 한글 표시명 | 평가 |
|---|---|---|
| **`WaveBreaker`** | **웨이브 브레이커** | ⭐ **권장.** 짧고 발음이 쉽고, 이름만 봐도 뭘 하는 게임인지 읽힌다. 폴더·URL·빌드명 어디에 써도 안전 |
| `HoldTheLine` | 홀드 더 라인 | 협동 방어 느낌이 가장 강하다. 다만 조금 길다 |
| `CoopArena` | 코옵 아레나 | 장르가 바로 읽히지만 이름이라기보단 분류에 가깝다 |
| `SurviveTogether` | 서바이브 투게더 | 협동은 잘 드러나나 길고 평범 |
| `CoopWaveDefense` | — | 설명문이지 이름이 아니다. **초안 임시명. 쓰지 않는다** |
| `LastStand` | 라스트 스탠드 | 동명 게임이 많아 검색·URL 충돌 위험 |

> **확정: `WaveBreaker` / 웨이브 브레이커** (변경 시 이 표와 아래 표기 규칙을 함께 수정)

### 표기 규칙

| 대상 | 값 | 비고 |
|---|---|---|
| Unity 프로젝트명 / 폴더명 | `WaveBreaker` | **영문. 한글·공백 금지** |
| 프로젝트 경로 | `C:\Unity\WaveBreaker` | ⚠️ 경로 전체에 한글·공백 없어야 한다 |
| Company Name | 기관명 또는 강사명 (영문) | Player Settings |
| Product Name | `WaveBreaker` | 빌드 실행 파일 이름이 된다 |
| 타이틀 화면 표기 | **웨이브 브레이커** | 화면에는 한글로 |
| 빌드 산출물 | `WaveBreaker.exe` | |
| itch.io URL | `wavebreaker-<본인닉네임>` | 이름이 겹치므로 개인 식별자를 붙인다 |
| 스냅샷 파일명 | `WaveBreaker_Snapshot_P8.zip` | |
| 네임스페이스 | **쓰지 않는다** | 노베이스에게 개념 하나를 아낀다. 27주차 ⭐도전 과제로 |

### ⚠️ 학생 개별 이름 정책

**폴더명·프로젝트명은 수업 내내 `WaveBreaker`로 고정한다.** 학생마다 다르면 스냅샷 배포·경로 안내·질문 대응이 전부 어긋난다.

**대신 아래 셋은 26주차(배포)에 학생이 자유롭게 바꾼다.**

- 타이틀 화면에 뜨는 게임 이름
- Product Name (빌드 파일 이름)
- itch.io 페이지 제목·URL

> 💬 26주차에 하는 말: "지금까지는 다 같은 이름으로 만들었지만, **이제부터는 여러분 게임입니다. 이름을 붙이세요.**"
> 포트폴리오에 올라갈 물건이라 이름은 본인 것이어야 한다. 다만 **폴더명은 끝까지 안 바꾼다** — 바꾸면 경로가 깨진다.

---

## 3. GitHub 저장소

조직: `SBS-GameAcademy-Saturday` / 저장소: `WaveBreaker`

### Description (350자 제한)

**권장안**

```
코딩을 처음 배우는 수강생이 7개월 과정에서 단계별로 완성하는 2D 협동 웨이브 디펜스 게임. Unity 6 + C#, 싱글 플레이와 2인 협동(Netcode for GameObjects + Relay)을 모두 지원합니다. 수업용 템플릿과 구간별 스냅샷을 제공합니다.
```

**대안 ① — 짧게**

```
Unity 6 + C#로 만드는 2D 협동 웨이브 디펜스. 노베이스 대상 7개월 게임개발 과정의 수업용 프로젝트 (싱글 / 2인 협동)
```

**대안 ② — 영문**

```
A 2D co-op wave defense game built step by step in a 7-month Unity course for absolute beginners. Unity 6 + C#, with single-player and 2-player co-op powered by Netcode for GameObjects and Relay.
```

### Topics (저장소 태그)

`unity` `unity6` `csharp` `game-development` `2d-game` `multiplayer` `netcode-for-gameobjects` `co-op` `education` `curriculum`

### 저장소 구성 권장

| 저장소 | 공개 범위 | 용도 |
|---|---|---|
| `WaveBreaker` | **Public** | 학생 배포 템플릿 + 구간별 스냅샷(Releases) + 강의 자료 링크 |
| `WaveBreaker-Reference` | **Private** ⚠️ | 강사 완성본(정답) |

> ⚠️ **레퍼런스(완성본)를 Public에 올리지 않는다.** 학생이 진도보다 먼저 정답을 보면 실습이 의미를 잃는다. 공개 저장소에는 **골격 + `// TODO` 로 가공한 템플릿**만 올린다.

### 설정 권장

| 항목 | 값 | 이유 |
|---|---|---|
| Visibility | Public (템플릿) / Private (레퍼런스) | 위 표 참고 |
| Add README | On | 학생이 처음 보는 화면 |
| .gitignore | **Unity** ✅ | 잘 선택했다. `Library/`, `Temp/`, `Build/` 등을 제외한다 |
| License | **MIT 권장** | ⚠️ "No license"면 법적으로 **아무도 사용·수정할 수 없다.** 학생이 포트폴리오로 쓰고 개조하려면 라이선스가 있어야 한다 |
| Template repository | **On** (템플릿 저장소만) | 학생이 "Use this template"로 자기 저장소를 만들 수 있다 |
| Releases | 스냅샷 배포에 활용 | `Snapshot_P5_Core`, `Snapshot_P8_Final_Single` 등을 태그로 |

> 💡 **Git LFS**: 에셋 용량이 커지면 필요하다. Kenney 2D 팩 정도(수십 MB)는 LFS 없이도 충분하니, **일단 쓰지 않는다.** 나중에 켜면 히스토리 정리가 번거로우므로, 켤 거면 첫 커밋 전에 결정한다.

### 학생에게 Git을 가르치는가

**아니다.** 노베이스 대상 7개월 과정에서 Git 교육에 회차를 쓸 여유가 없다.

- **스냅샷은 압축본(zip) 배포가 기본** — Releases 페이지에서 zip 다운로드만 안내한다
- Git 사용은 **27주차 ⭐도전 과제**로 (관심 있는 학생만)
- 저장소는 **강사가 관리하고 학생은 내려받기만** 하는 구조

---

## 4. 프로젝트 생성 규격

| 항목 | 값 | 비고 |
|---|---|---|
| Unity 버전 | **Unity 6 LTS** (마이너 버전 확정 필요 ⬜) | MPPM이 Unity 6 이상 요구 |
| 템플릿 | **2D (Built-in Render Pipeline)** | URP는 노베이스에게 설정 항목이 늘어난다. 2D 기본으로 간다 |
| 프로젝트명 | **`WaveBreaker`** | 영문. 한글 금지 (2장 참고) |
| 경로 | `C:\Unity\WaveBreaker` | ⚠️ **한글·공백 절대 금지** — 21주차 빌드에서 터진다 |
| 해상도 | 1920 × 1080 기준, 16:9 | Canvas Scaler 기준값 |
| Color Space | Linear | 기본값 유지 |

> ⚠️ **URP를 쓰지 않는 이유**: 2D Renderer 에셋, Light 2D, Sorting Layer 추가 설정이 붙는다. 노베이스에게는 "왜 안 보이죠"가 늘어날 뿐이고, 이 게임에는 조명 연출이 필요 없다.

---

## 5. 폴더 구조

```
Assets/
├── _GameAssets/            ← 강사 배포 에셋 (언더스코어로 최상단 고정)
│   ├── Sprites/
│   │   ├── Characters/     플레이어, 몬스터
│   │   ├── Projectiles/    총알
│   │   ├── Environment/    타일, 장애물
│   │   └── UI/             버튼, 패널, 바, 아이콘
│   ├── Audio/
│   │   ├── SFX/
│   │   └── UI/
│   ├── Effects/            파티클 텍스처
│   └── Fonts/              TMP 한글 폰트 애셋 (생성 완료본)
├── _Project/               ← 학생이 만드는 것은 전부 여기
│   ├── Scenes/
│   │   ├── Title.unity
│   │   ├── Game.unity
│   │   └── Result.unity
│   ├── Scripts/
│   │   ├── Player/
│   │   ├── Enemy/
│   │   ├── Weapon/
│   │   ├── Manager/
│   │   ├── Data/           ScriptableObject 클래스
│   │   ├── UI/
│   │   └── Network/        ← 22주차부터 사용
│   ├── Prefabs/
│   │   ├── Player/
│   │   ├── Enemy/
│   │   ├── Projectile/
│   │   └── UI/
│   ├── Data/               ScriptableObject 에셋 파일
│   └── Materials/
└── Settings/
```

> 🔑 **`_GameAssets`(받은 것)와 `_Project`(만든 것)를 분리한다.** 학생이 "내가 만든 게 어디 있지"를 헤매지 않고, 스냅샷 배포 시 덮어쓸 범위가 명확해진다.

---

## 6. 패키지 목록

### 처음부터 넣는 것 (템플릿 프로젝트에 포함)

| 패키지 | 용도 | 비고 |
|---|---|---|
| **TextMeshPro** | UI 텍스트 | Unity 6에서는 uGUI 패키지에 포함. 별도 설치 불필요 |
| **2D Sprite / 2D Tilemap** | 기본 2D | 2D 템플릿에 기본 포함 |
| Input System | — | ❌ **쓰지 않는다.** 구 `Input.GetAxis`로 간다 (아래 참고) |

> ⚠️ **Input System을 쓰지 않는 이유**: Action Map·Binding 개념이 노베이스에게 큰 벽이고, 8주차에 이걸로 1주를 쓰면 게임 제작 시간이 사라진다. 구 Input Manager로 충분하다. 학생이 물으면 "현업에서는 새 시스템도 씁니다. 여기선 기본기부터"로 답한다.

### 22주차(네트워크)에 추가하는 것

| 패키지 | ID | 용도 |
|---|---|---|
| **Netcode for GameObjects** | `com.unity.netcode.gameobjects` | 동기화 |
| **Multiplayer Services** | `com.unity.services.multiplayer` | Relay·Lobby (Unity 6에서 통합 제공) |
| **Multiplayer Play Mode** | `com.unity.multiplayer.playmode` | 가상 플레이어 로컬 2인 테스트 |

> 📌 **네트워크 패키지는 21주차 빌드·백업이 끝난 뒤에 넣는다.** 미리 넣으면 프로젝트가 무거워지고, 싱글 완성본에 불필요한 의존이 생긴다.
> 📌 Relay는 UGS 프로젝트 연동(Project Settings → Services)이 필요하다. **강사가 22주차 전에 절차를 검증해 둘 것.**

---

## 7. 프로젝트 설정

### Tags

`Player` / `Enemy` / `PlayerProjectile` / `EnemyProjectile` / `Obstacle`

### Layers

| Layer | 용도 |
|---|---|
| `Player` | 플레이어 |
| `Enemy` | 몬스터 |
| `PlayerProjectile` | 플레이어 투사체 |
| `EnemyProjectile` | 몬스터 투사체 |
| `Obstacle` | 아레나 장애물 |

**Layer Collision Matrix** — 켜는 조합만 남긴다

| | Player | Enemy | PlayerProj | EnemyProj | Obstacle |
|---|---|---|---|---|---|
| **Player** | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Enemy** | ✅ | ❌ | ✅ | ❌ | ✅ |
| **PlayerProj** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **EnemyProj** | ✅ | ❌ | ❌ | ❌ | ✅ |

> ⚠️ **Player ↔ Player, Enemy ↔ Enemy를 끄는 게 핵심.** 안 끄면 협동 모드에서 두 플레이어가 서로 밀고, 몬스터끼리 뭉쳐서 안 온다. 9주차에 이 표를 그대로 보여준다.

### Physics 2D

| 항목 | 값 | 이유 |
|---|---|---|
| **Gravity Y** | **0** | 탑다운이라 중력 없음. ⚠️ 안 바꾸면 전부 아래로 떨어진다 |
| Rigidbody2D Body Type | Dynamic (플레이어·몬스터) | |
| Collision Detection | Continuous (총알) | 빠른 총알이 뚫고 지나가는 것 방지 |

### Sprite Import 기본값

| 항목 | 값 |
|---|---|
| Texture Type | Sprite (2D and UI) |
| **Pixels Per Unit** | **100 통일** |
| Filter Mode | Bilinear |
| Compression | Normal Quality |

---

## 8. 네이밍 규칙

| 대상 | 규칙 | 예 |
|---|---|---|
| 클래스 / 파일 | PascalCase, **파일명 = 클래스명** | `PlayerHealth.cs` |
| public 메서드 | PascalCase | `TakeDamage()` |
| private 필드 | camelCase | `moveSpeed` |
| `[SerializeField]` 필드 | camelCase | `maxHp` |
| 상수 | 대문자 + 언더스코어 | `MAX_WAVE` |
| 인터페이스 | `I` + PascalCase | `IDamageable` |
| 프리팹 | PascalCase | `ChargerEnemy.prefab` |
| SO 에셋 | `종류_이름` | `Weapon_Pierce.asset` |
| 씬 | PascalCase | `Game.unity` |

> ⚠️ **파일명 = 클래스명**은 규칙이 아니라 강제다. 어기면 스크립트가 안 붙는다 (7주차 최다 질문).

---

## 9. 씬 구성

| 씬 | 내용 |
|---|---|
| `Title` | 타이틀 UI, [혼자 하기] / [같이 하기], 로비(협동) |
| `Game` | 아레나, 플레이어 스폰 포인트, 매니저, HUD |
| `Result` | 클리어/실패, 생존 시간·처치 수·최종 스탯 |

**`Game` 씬 계층 구조**

```
Game
├── --- Managers ---        (빈 GameObject, 구분선 역할)
│   ├── GameManager
│   ├── WaveManager
│   ├── UpgradeManager
│   └── PoolManager
├── --- Environment ---
│   ├── Arena (Tilemap)
│   ├── Obstacles
│   └── SpawnPoints         아레나 가장자리 4방향
├── --- Camera ---
│   └── Main Camera         고정. 추적 없음
├── --- Runtime ---         런타임 생성물의 부모 (풀 오브젝트)
└── --- UI ---
    └── Canvas (HUD / Upgrade / Pause)
```

> `--- 이름 ---` 형태의 빈 GameObject를 구분선으로 쓴다. Hierarchy가 30개 넘어가면 노베이스는 아무것도 못 찾는다.

---

## 10. 제작 순서 (강사 레퍼런스 프로젝트)

수업 진도와 같은 순서로 만든다. 그래야 각 회차에서 "어디까지 되어 있어야 하는지"가 스냅샷과 정확히 맞는다.

- [ ] 1. 프로젝트 생성 + 설정(Tags/Layers/Physics/Sprite 기본값)
- [ ] 2. Kenney 에셋 임포트 + 슬라이싱 + 폴더 정리
- [ ] 3. TMP 한글 폰트 애셋 생성
- [ ] 4. **여기까지를 `템플릿(학생 배포용)`으로 익스포트** ⬜
- [ ] 5. 플레이어 이동 + 자동사격
- [ ] 6. `Enemy` 상속 구조 + `IDamageable`
- [ ] 7. `WaveManager` 스폰 → **코어 루프 완성** → `Snapshot_P5_Core`
- [ ] 8. 무기 3종 + 몬스터 3종 → `Snapshot_P5_Full`
- [ ] 9. ScriptableObject 데이터 분리
- [ ] 10. 업그레이드 3택 + 보스 → `Snapshot_P6`
- [ ] 11. UI 3화면 + 연출·사운드 → `Snapshot_P7`
- [ ] 12. 오브젝트 풀링 + 밸런싱 + **PC 빌드** → `Snapshot_P8_Final_Single` ⭐
- [ ] 13. **여기서 프로젝트를 복제**해 네트워크 브랜치 시작
- [ ] 14. NGO 도입 → 동기화 → 호스트 권한 스폰 → Relay → 모드 통합
- [ ] 15. 최종 빌드 (싱글 + 협동 동작 확인)

> 🔑 **12번까지를 반드시 먼저 끝낸다.** 네트워크에 손대기 전에 싱글 완성본이 있어야 강의도 안전하고 강사도 안전하다.

---

## 11. 강사 작업 시 주의

| 항목 | 내용 |
|---|---|
| **회차 경계를 의식하며 커밋** | 스냅샷을 잘라낼 지점이라 나중에 쪼개기 어렵다 |
| **완성본 코드를 그대로 배포하지 않는다** | 골격 + `// TODO` 빈칸으로 가공해서 배포 |
| **어려웠던 지점을 기록** | 강사가 막힌 곳은 학생이 반드시 막힌다 → 수업계획서 `🚨 흔한 사고` 표로 |
| 최적화를 미리 하지 않는다 | 풀링은 21주차 소재. 미리 넣으면 "왜 필요한지" 못 가르친다 |
| 패키지를 미리 넣지 않는다 | 네트워크 패키지는 13번 단계(복제 후)부터 |

---

## ⬜ 프로젝트 만들기 전 확정할 것

0. ~~프로젝트 이름~~ → **`WaveBreaker` / 웨이브 브레이커** 확정 (2장)
1. **Unity 6 LTS 마이너 버전** — 확정 후 전 문서 일괄 치환
2. **한글 폰트 1종** — TMP 애셋 생성해서 템플릿에 포함
3. **Kenney 통합 `.unitypackage`** — 슬라이싱까지 완료 ([에셋-리소스.md](../00_기획/에셋-리소스.md))
4. **스냅샷 배포 방식** — 압축본 / 클라우드 드라이브 중 택 1
5. **UGS 프로젝트 개설** — Relay 사용 절차 사전 검증 (22주차 전까지)
6. **GitHub 저장소 2개 생성** — 공개 템플릿 / 비공개 레퍼런스 (3장)
