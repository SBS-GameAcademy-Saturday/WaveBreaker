# 수업 슬라이드

주차별 수업용 PPT와 생성 스크립트. **슬라이드는 손으로 고치지 말고 스크립트를 고쳐서 다시 뽑는다.**

## 목록

| 파일 | 주차 | 회차 | 장수 | 생성 스크립트 |
|---|---|---|---|---|
| `7주차-유니티입문.pptx` | 7주차 | 031–035 | 15 | `generate_w07.js` |
| `8주차-코드로움직이기.pptx` | 8주차 | 036–040 | 16 | `generate_w08.js` |

> 📌 **8주차는 스크린샷이 아니라 코드가 내용이다.** 코딩 주간이라 씬 렌더는 흰 사각형뿐이라
> 슬라이드 소재로 약하다. 코드 블록·비교표 중심으로 짜고 스크린샷은 타이틀과 040 실습에만 썼다.

## 디자인 시스템

[`DESIGN.md`](./DESIGN.md) 를 따른다. **새 주차를 만들 때도 이 문서를 기준으로 한다.**

| 항목 | 값 |
|---|---|
| 배경 | 흰색 `#FFFFFF` — 갤러리 화이트 |
| 잉크 | `#141414` (제목·본문) / `#707070` (보조) / `#ADADAD` (3차) |
| 면 | `#F3F3F3` 채움 카드 · `#F0F0F0` 1px 실선 · `#E0E0E0` 강한 실선 |
| 강조색 | `#0066FF` — **덱 전체에서 한 번만.** 지금은 13장의 "경로 한글" 경고 |
| 폰트 | **Pretendard** (Saans 대체) |
| 모서리 | 24px 카드 · 16px 표 행 · pill(완전 라운드) |

### 폰트 웨이트 — 이 시스템의 핵심

원본은 Saans 를 652 / 456 / 300 이라는 비표준 웨이트로 쓴다. **무게 대비가 곧 위계**이고,
색이나 장식 없이 그것만으로 계층을 만든다. Pretendard 로 그대로 옮겼다.

| 원본 | 쓰는 곳 | 이 덱 |
|---|---|---|
| 652 | 모든 제목 | `Pretendard SemiBold` |
| 456 | 본문 | `Pretendard` / `Pretendard Medium` |
| 300 | 부제·리드 | `Pretendard Light` |

> ⚠️ **Pretendard 가 설치돼 있어야 한다.** 없으면 시스템 폰트로 치환되어 무게 대비가 사라지고
> 디자인의 절반이 날아간다. [github.com/orioncactus/pretendard](https://github.com/orioncactus/pretendard)

### 하지 말 것

`DESIGN.md` 의 Don't 목록이 곧 규칙이다. 특히 이 세 가지를 어기면 티가 난다.

- **그림자 금지.** 높이 차이는 면 색과 1px 실선으로만 만든다
- **강조색을 CTA 나 장식에 쓰지 않는다.** 파란색은 "결정을 요구하는" 자리에만
- **제목 밑줄, 색 띠, 사이드 스트라이프 금지.** 여백으로 구분한다

## 다시 뽑는 법

```bash
npm install pptxgenjs
```

```bash
node generate_w07.js
```

```bash
node generate_w08.js
```

> ⚠️ 스크립트가 씬 스크린샷을 `shots2/final/*.png` 에서 읽는다. 없으면 실패한다.

## 스크린샷 다시 뽑기

슬라이드 이미지는 `Assets/_Project/Scenes/Practice/` 실습 씬을 **1920×1080 으로 렌더**한 것이다.
씬을 고쳤으면 이미지도 다시 뽑는다.

```bash
uloop screenshot --capture-mode rendering --output-directory ./shots2
```

`rendering` 모드는 **Play 중에만** 동작한다. 씬 열기 → Play → 캡처 → Stop 순서로 돈다.
`window` 모드로 찍으면 Unity 툴바가 딸려 들어가고 해상도가 낮아진다.

## 슬라이드 구성 (7주차)

| # | 내용 |
|---|---|
| 1 | 타이틀 |
| 2 | 이번 주 흐름 (031–035) |
| 3 | 031 · 에디터 6개 창 + `F` 키 |
| 4 | 031 · 실습 (얼굴) |
| 5 | 032 · 좌표계 |
| 6 | 032 · 실습 (십자가) |
| 7 | 033 · Rotation · Scale · 부모자식 |
| 8 | 033 · 실습 (로봇팔) |
| 9 | 034 · 부품표 |
| 10 | 034 · 실습 (부품 조합 4종) |
| 11 | 035 · 막혔을 때 확인 순서 5단계 |
| 12 | 035 · 실습 (내 놀이터) |
| 13 | 흔한 사고 (강사용) |
| 14 | 체크리스트 + 다음 주 예고 |

> 📌 **모든 슬라이드에 발표자 노트가 있다.** 강사 대사와 주의점이 들어 있으니
> 발표자 보기로 켜고 진행한다.

## QA 절차 (필수)

```bash
python validate.py 7주차-유니티입문.pptx
```

그리고 **눈으로 확인한다.** Windows 에는 LibreOffice·pdftoppm 이 없으므로
PowerPoint COM 으로 PNG 를 뽑아 본다. 실제 렌더러라 한글 폰트가 정확하다.

```powershell
$app = New-Object -ComObject PowerPoint.Application; $d = $app.Presentations.Open("$PWD\7주차-유니티입문.pptx", $true, $false, $false); foreach ($s in $d.Slides) { $s.Export("$PWD\render\slide-$('{0:D2}' -f $s.SlideIndex).png", "PNG", 1400, 788) }; $d.Close(); $app.Quit()
```
