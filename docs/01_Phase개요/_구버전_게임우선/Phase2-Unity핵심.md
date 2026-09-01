# Phase 2 · Unity 핵심 구조

| | |
|---|---|
| **회차** | 029–043 (15회) |
| **기간** | 3주 |
| **선행** | Phase 1 |
| **산출물** | 총알이 적을 맞히면 체력이 깎이고 죽는 씬 |

## 🎯 목표

1. 충돌을 감지하고 반응한다
2. 프리팹을 만들어 관리한다
3. 다른 오브젝트의 컴포넌트를 참조한다
4. 코루틴으로 시간차 처리를 한다

## 📚 다루는 내용

| 주제 | 깊이 |
|---|---|
| Collider2D / Trigger | `OnTriggerEnter2D`, `isTrigger` 차이 |
| Rigidbody2D | Dynamic / Kinematic 구분, Gravity Scale 0 |
| Tag / Layer | 충돌 대상 구분. Layer Collision Matrix |
| **Prefab** | 원본-인스턴스 관계, 프리팹 수정 반영 |
| `GetComponent` | 다른 오브젝트의 스크립트 호출 |
| `[SerializeField]` 참조 연결 | Inspector 드래그로 연결 |
| **코루틴** | `IEnumerator`, `yield return new WaitForSeconds` |
| Sprite / Animator | 아주 얕게. 걷기 애니메이션 1개 |
| 오브젝트 정리 | `Destroy`, 화면 밖 정리 |

> ❌ **여기서 안 하는 것**: 상속·인터페이스(Phase 4), 오브젝트 풀링(Phase 7 — 렉을 겪은 뒤에).

## 🗓 회차 배분

| 회차 | 주제 |
|---|---|
| 029–031 | Collider2D · Rigidbody2D · Trigger |
| 032–033 | Tag / Layer로 충돌 대상 구분 |
| 034–036 | **Prefab** — 만들기, 수정 반영, 인스턴스 |
| 037–039 | `GetComponent` · 참조 연결 · 체력 깎기 |
| 040–042 | **코루틴** — 일정 간격 스폰 |
| 043 | Sprite / Animator 맛보기 + 정리 |

## ✅ 종료 조건

- [ ] 총알이 적에 닿으면 이벤트가 발생한다
- [ ] Tag로 "적만" 골라 반응한다
- [ ] 프리팹을 만들고 원본을 고쳐 전부 반영시킨다
- [ ] `GetComponent`로 다른 오브젝트의 체력을 깎는다
- [ ] 코루틴으로 2초마다 적을 생성한다
- [ ] 체력이 0이 되면 적이 사라진다

## 📦 스냅샷 — `Snapshot_P2`

플레이어 + 적 프리팹 + 총알 + 코루틴 스폰 + 체력 시스템이 도는 씬.

## 🚨 위험 신호 (강사용)

| 신호 | 의미 | 대응 |
|---|---|---|
| **충돌이 아예 안 일어남** | 이 Phase 질문의 70% | 체크리스트 고정: 둘 다 Collider 있나 / 하나는 Rigidbody2D 있나 / isTrigger 맞나 / Layer Matrix |
| 프리팹 원본과 씬 인스턴스를 헷갈림 | 정상 | "씬에 있는 건 복사본, Project에 있는 게 원본" 반복 |
| `GetComponent` null 에러 | 정상 | Null 개념을 여기서 처음 만난다. "없는 걸 만졌다"로 설명 |
| 코루틴에서 무너짐 | 정상. Phase 2 최대 난관 | `yield`를 문법으로 설명하지 말고 "여기서 잠깐 쉬었다 이어서"로 |
| 애니메이션에 시간을 너무 씀 | 함정 | **Animator는 얕게.** 걷기 1개면 충분. 파고들면 2주 날아간다 |

## ⏭ 연결

여기서 만든 "코루틴 스폰"이 Phase 4 웨이브 스포너의 원형이고, "체력 깎기"가 `IDamageable` 인터페이스의 밑밥이 된다.
