# 수업 슬라이드

주차별 수업용 PPT와 그 생성 스크립트. **슬라이드는 손으로 고치지 말고 스크립트를 고쳐서 다시 뽑는다.**

## 목록

| 파일 | 주차 | 회차 | 장수 | 생성 스크립트 |
|---|---|---|---|---|
| `7주차-유니티입문.pptx` | 7주차 | 031–035 | 14 | `generate_w07.js` |

## 다시 뽑는 법

```bash
npm install pptxgenjs
```

```bash
node generate_w07.js
```

> ⚠️ 스크립트가 씬 스크린샷을 `shots2/final/*.png` 경로에서 읽는다.
> 이미지가 없으면 생성이 실패한다. 아래 "스크린샷 다시 뽑기" 참고.

## 스크린샷 다시 뽑기

슬라이드에 들어가는 이미지는 `Assets/_Project/Scenes/Practice/` 의 실습 씬을 **1920×1080으로 렌더한 것**이다.
씬을 고쳤으면 이미지도 다시 뽑아야 한다.

```bash
uloop screenshot --capture-mode rendering --output-directory ./shots2
```

`rendering` 모드는 **Play 중에만** 동작한다. 씬을 연 뒤 Play → 캡처 → Stop 순서로 돈다.
`window` 모드로 찍으면 Unity 툴바가 같이 들어가고 해상도가 낮아진다.

## 슬라이드 구성 (7주차)

| # | 내용 |
|---|---|
| 1 | 타이틀 |
| 2 | 이번 주 흐름 (031–035 로드맵) |
| 3 | 031 · 에디터 6개 창 + `F` 키 |
| 4 | 031 · 실습 (얼굴 만들기) |
| 5 | 032 · 좌표계 다이어그램 |
| 6 | 032 · 실습 (십자가) |
| 7 | 033 · Rotation · Scale · 부모자식 |
| 8 | 033 · 실습 (로봇팔) |
| 9 | 034 · 부품표 (없으면 / 있으면) |
| 10 | 034 · 실습 (부품 조합 4종) |
| 11 | 035 · 막혔을 때 확인 순서 5단계 |
| 12 | 035 · 실습 (내 놀이터) |
| 13 | 흔한 사고 TOP 5 (강사용) |
| 14 | 체크리스트 + 다음 주 예고 |

> 📌 **모든 슬라이드에 발표자 노트가 들어 있다.** 강사 대사와 주의점이 적혀 있으니
> 발표자 보기(Presenter View)로 켜고 진행한다.

## 만들 때 지킨 것

| 항목 | 값 |
|---|---|
| 캔버스 | 13.333 × 7.5 인치 (16:9) |
| 폰트 | 맑은 고딕 (한글) / Consolas (코드·좌표값) |
| 배경 | `1E2129` 다크 |
| 강조색 | 회차별로 다름 — 031 teal / 032 yellow / 033 orange / 034 purple / 035 teal |
| 모티프 | 회차 번호 배지(원) |

> 회차별 강조색이 강의안·슬라이드·씬에서 같은 색으로 이어지게 해 두었다.
> 새 주차를 만들 때도 이 규칙을 따른다.

## QA 절차 (필수)

```bash
python validate.py 7주차-유니티입문.pptx
```

그리고 **반드시 눈으로 확인한다.** Windows에서는 LibreOffice·pdftoppm이 없으므로
PowerPoint COM으로 슬라이드를 PNG로 뽑아 본다.

```powershell
$app = New-Object -ComObject PowerPoint.Application; $d = $app.Presentations.Open("$PWD\7주차-유니티입문.pptx", $true, $false, $false); foreach ($s in $d.Slides) { $s.Export("$PWD\render\slide-$('{0:D2}' -f $s.SlideIndex).png", "PNG", 1400, 788) }; $d.Close(); $app.Quit()
```

> 실제 PowerPoint 렌더러라 한글 폰트가 정확히 나온다. LibreOffice보다 신뢰할 수 있는 QA다.
