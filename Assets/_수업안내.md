# Chapter 1 · 7주차 — 에디터와 Inspector

> **이 브랜치(`Chapter_1/Week1`)에는 7주차(031–035회차) 수업 내용만 들어 있습니다.**
> 다른 주차 씬·스크립트·문서는 없습니다. 브랜치를 바꾸면 그 주차 것만 보입니다.

| | |
|---|---|
| Phase | 2 · 유니티 입문 |
| 회차 | 031–035 (5회차 · 10시간) |
| 실습 씬 | 13개 |
| 스크립트 | 없음 (코드가 나오지 않는 주차) |
| 프리팹 | 없음 |

---

## 이번 주 5회차

### 031 · 에디터 인터페이스와 Inspector

**배우는 것** — 6개 창의 역할, Scene 조작법, **Inspector 읽고 쓰기**

- 6개 창이 **각각 뭘 하는 창인지** 말한다
- Scene 창을 **마우스로 자유롭게 돌린다**
- **Inspector에서 값을 바꿔 물체를 움직인다** ← 오늘의 중심

씬: `031_Inspector_Demo` · `031_Inspector_Done` · `031_Inspector_Start`

→ [강의안](./docs/02_수업계획서/031-P2-에디터-인터페이스와-Inspector.md)

### 032 · Transform ① — Position과 좌표계

**배우는 것** — **월드 좌표계**, Position X·Y·Z, Move 툴, 스냅

- **월드 원점(0, 0)이 어디인지** 안다
- X는 가로, Y는 세로, **Z는 2D에서 안 쓴다**를 안다
- 목표 좌표를 듣고 **그 자리에 물체를 놓는다**
- Inspector의 Position이 **무엇을 기준으로 한 값인지** 안다

씬: `032_Position_Done` · `032_Position_Start` · `032_WorldLocal_Demo`

→ [강의안](./docs/02_수업계획서/032-P2-Transform-Position.md)

### 033 · Transform ② — Rotation · Scale · 부모자식

**배우는 것** — Rotation Z, Scale, 부모자식, **월드 좌표 ↔ 로컬 좌표**

- **2D는 Rotation Z만 쓴다**를 안다
- Scale로 크기를 바꾸고 **음수로 뒤집는다**
- **부모를 움직이면 자식이 따라온다**를 안다
- **월드 좌표와 로컬 좌표를 구분한다** ← 오늘의 핵심

씬: `033_Transform_Done` · `033_Transform_Start`

→ [강의안](./docs/02_수업계획서/033-P2-Transform-Rotation-Scale.md)

### 034 · GameObject와 Component — 그릇과 부품

**배우는 것** — GameObject = 그릇 / Component = 부품, 추가·제거, Rigidbody 2D 맛보기

- **GameObject는 빈 그릇, Component가 능력**인 구조를 안다
- 컴포넌트를 **추가·제거**한다
- Transform이 **왜 못 지워지는지** 안다

씬: `034_Component_Demo` · `034_Component_Done` · `034_Component_Start`

→ [강의안](./docs/02_수업계획서/034-P2-GameObject와-Component.md)

### 035 · 7주차 정리 — 장면 하나 만들기

**배우는 것** — 새 문법 없음. **조합과 자가진단**

- 4회차 동안 배운 것을 **하나의 장면으로** 조합한다
- 막혔을 때 **스스로 원인을 찾는 순서**를 익힌다
- 8주차(코드)로 넘어갈 상태를 만든다

씬: `035_Playground_Done` · `035_Playground_Start`

→ [강의안](./docs/02_수업계획서/035-P2-7주차-정리.md)

---

## 이 브랜치에 있는 것

### 실습 씬 — `Assets/_Project/Scenes/Practice/`

| 회차 | 씬 |
|---|---|
| 031 | `031_Inspector_Demo` · `031_Inspector_Done` · `031_Inspector_Start` |
| 032 | `032_Position_Done` · `032_Position_Start` · `032_WorldLocal_Demo` |
| 033 | `033_Transform_Done` · `033_Transform_Start` |
| 034 | `034_Component_Demo` · `034_Component_Done` · `034_Component_Start` |
| 035 | `035_Playground_Done` · `035_Playground_Start` |

`_Start` 는 수업을 시작하는 상태, `_Done` 은 그 회차가 끝났을 때의 정답,
`_Demo` 는 설명용 시연 씬입니다. 수업은 `_Start` 를 열어서 시작합니다.

---

## 같이 보는 문서

| | |
|---|---|
| [docs/02_수업계획서/](./docs/02_수업계획서/) | 이번 주 5회차 강의안 |
| [docs/01_Phase개요/](./docs/01_Phase개요/) | 이 주차가 속한 Phase 의 목표와 종료 조건 |
| [docs/04_배포자료/슬라이드/](./docs/04_배포자료/슬라이드/) | 7주차 수업 슬라이드 |
| [Scenes/Practice/README.md](./Assets/_Project/Scenes/Practice/README.md) | 씬을 어떻게 만들어 뒀는지, 주의할 점 |

---

## 브랜치

| 브랜치 | 내용 |
|---|---|
| `Chapter_1/Week1` | 7주차 (031–035) ← 지금 여기 |
| `Chapter_1/Week2` | 8주차 (036–040) |
| `Chapter_1/Week3` | 9주차 (041–045) |
| `Chapter_1/Week4` | 10주차 (046–050) |
| `Chapter_1/Week5` | 11주차 (051–055) |
| `Chapter_1/Week6` | 12주차 (056–060) |
| `Chapter_1/Week7` | 13주차 (061–065) |
| `Chapter_1/Full` | 1단계 전체 (031–065) |
| `main` | 전체 과정 — WaveBreaker 본 게임까지 |
