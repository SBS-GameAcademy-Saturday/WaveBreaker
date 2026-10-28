# Chapter 1 · 10주차 — 프리팹과 동적 생성

> **이 브랜치(`Chapter_1/Week4`)에는 10주차(046–050회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 3 · 유니티 2D 핵심 |
| 회차 | 046–050 (5회차 · 10시간) |
| 실습 씬 | 10개 |
| 스크립트 | 5개 |
| 프리팹 | 2개 |

---

## 이번 주 5회차

### 046 · 프리팹 — 원본과 복사본

**배우는 것** — Prefab 만들기, 인스턴스, **Override / Apply**, 프리팹 모드

- GameObject를 **프리팹으로 만든다**
- **원본을 고치면 전부 바뀐다**는 걸 본다
- 인스턴스만 바뀐 값(**Override**)과 원본에 반영(**Apply**)을 구분한다

씬: `046_Prefab_Done` · `046_Prefab_Start`

→ [강의안](./docs/02_수업계획서/046-P3-프리팹.md)

### 047 · Instantiate — 총알 발사

**배우는 것** — `Instantiate`, 프리팹 참조, `firePoint`(Transform 참조)

- **`Instantiate`로 프리팹을 코드에서 찍어낸다**
- **어디에** 만들지를 `firePoint`로 정한다
- 만들어진 총알이 **스스로 날아가게** 한다

씬: `047_Instantiate_Done` · `047_Instantiate_Start`

→ [강의안](./docs/02_수업계획서/047-P3-Instantiate-총알-발사.md)

### 048 · Destroy와 몬스터 생성 — 오브젝트 수명 관리

**배우는 것** — `Destroy(gameObject)`, `Destroy(obj, 시간)`, 몬스터 스포너

- **`Destroy(gameObject)`** 로 자기 자신을 없앤다
- **`Destroy(gameObject, 2f)`** 로 수명을 준다
- 총알이 몬스터에 맞으면 **둘 다 사라지게** 한다

씬: `048_Destroy_Done` · `048_Destroy_Start`

→ [강의안](./docs/02_수업계획서/048-P3-Destroy와-몬스터-생성.md)

### 049 · GetComponent — 남의 부품을 만진다

**배우는 것** — `GetComponent<T>()`, `null`, `TryGetComponent`, `Awake`

- `GetComponent`로 **내 부품**을 코드에서 찾는다 (드래그를 없앤다)
- `other.GetComponent`로 **남의 부품**을 만진다
- **없는 부품을 찾으면 `null`** 이라는 걸 알고 대비한다

씬: `049_GetComponent_Done` · `049_GetComponent_Start`

→ [강의안](./docs/02_수업계획서/049-P3-GetComponent.md)

### 050 · 체력과 피격 — 내가 만든 클래스가 게임에서 돈다 (10주차 정리)

**배우는 것** — `Health` 클래스 직접 작성, `TakeDamage`, `Mathf.Clamp`, `Awake` 순서

- **`Health` 클래스를 직접 만든다** — 5~6주차 콘솔 코드와 같은 구조
- 총알이 `GetComponent<Health>()`로 찾아 **체력을 깎는다**
- 체력이 `0` 이하면 **죽는다**

씬: `050_Health_Done` · `050_Health_Start`

→ [강의안](./docs/02_수업계획서/050-P3-체력과-피격.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 046 | `046_Prefab_Done` · `046_Prefab_Start` |
| 047 | `047_Instantiate_Done` · `047_Instantiate_Start` |
| 048 | `048_Destroy_Done` · `048_Destroy_Start` |
| 049 | `049_GetComponent_Done` · `049_GetComponent_Start` |
| 050 | `050_Health_Done` · `050_Health_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

### 스크립트 — `Assets/_Project/Scripts/`

- `Enemy/EnemySpawner.cs`
- `Enemy/Health.cs`
- `Player/PlayerPhysicsMove.cs`
- `Player/PlayerShooter.cs`
- `Weapon/Bullet.cs`

이전 주차에 만든 스크립트도 이번 주 씬이 쓰면 함께 들어 있습니다.

### 프리팹 — `Assets/_Project/Prefabs/`

- `Enemy/Enemy.prefab`
- `Projectile/Bullet.prefab`

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 10주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) |
| `Chapter_1/Week2` | 8주차 (036–040) |
| `Chapter_1/Week3` | 9주차 (041–045) |
| `Chapter_1/Week4` | 10주차 (046–050) ← 지금 여기 |
| `Chapter_1/Week5` | 11주차 (051–055) |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
