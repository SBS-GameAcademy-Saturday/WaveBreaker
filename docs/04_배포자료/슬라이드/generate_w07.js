const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- palette
const BG      = "1E2129";  // deep charcoal
const CARD    = "2A2F3A";
const CARD2   = "343A47";
const TEAL    = "4FD1C5";
const YELLOW  = "FFC94D";
const ORANGE  = "F97E4A";
const PURPLE  = "9B7BE8";
const WHITE   = "FFFFFF";
const MUTED   = "9AA3B2";
const DIM     = "6B7383";

const KR = "맑은 고딕";
const MONO = "Consolas";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";          // 13.333 x 7.5
pres.author = "WaveBreaker 강의";
pres.title = "7주차 · 유니티 입문";

const W = 13.333, H = 7.5;
const M = 0.7;                        // margin

// ---------------------------------------------------------------- helpers
function bgSlide(fill) {
  const s = pres.addSlide();
  s.background = { color: fill || BG };
  return s;
}

// 회차 배지 (원 + 번호) — 이 덱의 시각 모티프
function badge(s, num, x, y, color) {
  s.addShape(pres.ShapeType.ellipse, {
    x: x, y: y, w: 0.72, h: 0.72,
    fill: { color: color }, line: { color: color, width: 0 },
  });
  s.addText(String(num), {
    x: x, y: y, w: 0.72, h: 0.72,
    align: "center", valign: "middle",
    fontFace: KR, fontSize: 20, bold: true, color: BG, isTextBox: true,
  });
}

function sectionTitle(s, num, title, sub, color) {
  badge(s, num, M, 0.55, color);
  s.addText(title, {
    x: M + 0.95, y: 0.5, w: W - M * 2 - 0.95, h: 0.5,
    fontFace: KR, fontSize: 32, bold: true, color: WHITE,
    align: "left", valign: "middle", margin: 0, isTextBox: true,
  });
  if (sub) {
    s.addText(sub, {
      x: M + 0.95, y: 1.0, w: W - M * 2 - 0.95, h: 0.35,
      fontFace: KR, fontSize: 14, color: MUTED,
      align: "left", valign: "middle", margin: 0, isTextBox: true,
    });
  }
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: w, h: h, rectRadius: 0.12,
    fill: { color: fill || CARD }, line: { color: fill || CARD, width: 0 },
  });
}

// ================================================================ 1. 타이틀
{
  const s = bgSlide(BG);
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.6, y: -1.6, w: 5.6, h: 5.6,
    fill: { color: TEAL, transparency: 88 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 11.2, y: 4.4, w: 3.4, h: 3.4,
    fill: { color: YELLOW, transparency: 90 }, line: { width: 0 },
  });

  s.addText("7주차", {
    x: M, y: 2.0, w: 6, h: 0.6,
    fontFace: KR, fontSize: 20, bold: true, color: TEAL,
    margin: 0, isTextBox: true,
  });
  s.addText("유니티 입문", {
    x: M, y: 2.55, w: 9, h: 1.2,
    fontFace: KR, fontSize: 54, bold: true, color: WHITE,
    margin: 0, isTextBox: true,
  });
  s.addText("에디터 인터페이스 · Inspector · Transform · Component", {
    x: M, y: 3.8, w: 9, h: 0.5,
    fontFace: KR, fontSize: 17, color: MUTED,
    margin: 0, isTextBox: true,
  });
  s.addText("031 – 035회차   ·   Phase 2   ·   웨이브 브레이커", {
    x: M, y: 6.3, w: 9, h: 0.4,
    fontFace: KR, fontSize: 13, color: DIM,
    margin: 0, isTextBox: true,
  });
  s.addNotes("6주간 콘솔만 했다. 오늘부터 유니티다. 학생이 가장 기다린 주간이라는 걸 첫 마디에 인정하고 시작한다.");
}

// ================================================================ 2. 이번 주 흐름
{
  const s = bgSlide(BG);
  s.addText("이번 주 흐름", {
    x: M, y: 0.5, w: 8, h: 0.6,
    fontFace: KR, fontSize: 34, bold: true, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addText("코드는 한 줄도 치지 않는다. 다음 주부터 스크립트를 시작한다.", {
    x: M, y: 1.12, w: 10, h: 0.4,
    fontFace: KR, fontSize: 14, color: MUTED, margin: 0, isTextBox: true,
  });

  const items = [
    ["031", "에디터와 Inspector", "6개 창 · Scene 조작 · 값 바꾸기", TEAL],
    ["032", "Transform ① Position", "좌표계 · X는 가로 Y는 세로", YELLOW],
    ["033", "Transform ② 회전·크기", "Rotation Z · Scale · 부모자식", ORANGE],
    ["034", "GameObject와 Component", "그릇과 부품 · 붙이면 능력이 생긴다", PURPLE],
    ["035", "7주차 정리", "조합 실습 · 자가진단 5단계", TEAL],
  ];
  let y = 1.75;
  items.forEach((it) => {
    card(s, M, y, W - M * 2, 0.92, CARD);
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.28, y: y + 0.2, w: 0.52, h: 0.52,
      fill: { color: it[3] }, line: { width: 0 },
    });
    s.addText(it[0], {
      x: M + 0.28, y: y + 0.2, w: 0.52, h: 0.52,
      align: "center", valign: "middle",
      fontFace: KR, fontSize: 12, bold: true, color: BG, margin: 0, isTextBox: true,
    });
    s.addText(it[1], {
      x: M + 1.05, y: y + 0.14, w: 4.2, h: 0.36,
      fontFace: KR, fontSize: 17, bold: true, color: WHITE, margin: 0, isTextBox: true,
    });
    s.addText(it[2], {
      x: M + 1.05, y: y + 0.5, w: 9.5, h: 0.32,
      fontFace: KR, fontSize: 13, color: MUTED, margin: 0, isTextBox: true,
    });
    y += 1.05;
  });
  s.addNotes("035는 진도를 나가지 않는 날이다. 새 문법을 넣고 싶은 유혹을 참는다.");
}

// ================================================================ 3. 031 목표 + 6개 창
{
  const s = bgSlide(BG);
  sectionTitle(s, "031", "에디터 인터페이스와 Inspector", "오늘의 중심은 Inspector — 앞으로 7개월간 가장 오래 볼 창", TEAL);

  const wins = [
    ["Hierarchy", "지금 씬에 있는 것들의 목록"],
    ["Scene", "내가 배치하는 작업대"],
    ["Game", "플레이어가 보게 될 화면"],
    ["Inspector", "고른 것의 설정판 ★"],
    ["Project", "이 프로젝트의 파일 전부"],
    ["Console", "에러와 메시지가 뜨는 곳"],
  ];
  let x = M, y = 1.75;
  wins.forEach((wv, i) => {
    const cw = (W - M * 2 - 0.4) / 3;
    const cx = M + (i % 3) * (cw + 0.2);
    const cy = 1.75 + Math.floor(i / 3) * 1.35;
    const hot = wv[0] === "Inspector";
    card(s, cx, cy, cw, 1.15, hot ? CARD2 : CARD);
    s.addText(wv[0], {
      x: cx + 0.25, y: cy + 0.18, w: cw - 0.5, h: 0.35,
      fontFace: KR, fontSize: 17, bold: true, color: hot ? TEAL : WHITE,
      margin: 0, isTextBox: true,
    });
    s.addText(wv[1], {
      x: cx + 0.25, y: cy + 0.58, w: cw - 0.5, h: 0.45,
      fontFace: KR, fontSize: 12, color: MUTED, margin: 0, isTextBox: true,
    });
  });

  card(s, M, 4.65, W - M * 2, 1.15, CARD2);
  s.addText("물체가 안 보이면 — 클릭하고  F", {
    x: M + 0.35, y: 4.82, w: 8, h: 0.4,
    fontFace: KR, fontSize: 20, bold: true, color: YELLOW, margin: 0, isTextBox: true,
  });
  s.addText("마우스가 Scene 창 위에 있어야 하고, 한/영이 영문이어야 먹는다", {
    x: M + 0.35, y: 5.25, w: 10, h: 0.35,
    fontFace: KR, fontSize: 13, color: MUTED, margin: 0, isTextBox: true,
  });
  s.addNotes("F가 안 먹는 이유 두 개(마우스 위치, 한영키)를 반드시 같이 말한다. 안 그러면 'F 눌러도 안 돼요'가 나온다.");
}

// ================================================================ 4. 031 실습
{
  const s = bgSlide(BG);
  sectionTitle(s, "031", "실습 — 얼굴 만들기", "Square와 Circle만으로. 코드 없음, Play 없음", TEAL);

  card(s, 6.45, 1.75, 6.18, 4.0, CARD);
  s.addImage({ path: img("031_Inspector"), x: 6.6, y: 1.9, w: 5.88, h: 3.31 });
  s.addText("완성 상태 (강사 레퍼런스 씬)", {
    x: 6.6, y: 5.28, w: 5.88, h: 0.32,
    fontFace: KR, fontSize: 11, color: DIM, align: "center", margin: 0, isTextBox: true,
  });

  const rows = [
    ["Face", "Circle", "0, 0", "4, 4"],
    ["EyeL", "Circle", "-0.8, 0.7", "0.5, 0.5"],
    ["EyeR", "Circle", "0.8, 0.7", "0.5, 0.5"],
    ["Mouth", "Square", "0, -0.8", "2, 0.3"],
  ];
  card(s, M, 1.75, 5.5, 4.0, CARD);
  s.addText("Position / Scale 값", {
    x: M + 0.3, y: 1.95, w: 4.5, h: 0.3,
    fontFace: KR, fontSize: 13, bold: true, color: TEAL, margin: 0, isTextBox: true,
  });
  let ry = 2.4;
  rows.forEach((r) => {
    s.addText(r[0], { x: M + 0.3, y: ry, w: 1.2, h: 0.3, fontFace: KR, fontSize: 13, bold: true, color: WHITE, margin: 0, isTextBox: true });
    s.addText(r[1], { x: M + 1.5, y: ry, w: 1.2, h: 0.3, fontFace: KR, fontSize: 12, color: MUTED, margin: 0, isTextBox: true });
    s.addText(r[2], { x: M + 2.6, y: ry, w: 1.4, h: 0.3, fontFace: MONO, fontSize: 12, color: YELLOW, margin: 0, isTextBox: true });
    s.addText(r[3], { x: M + 4.0, y: ry, w: 1.3, h: 0.3, fontFace: MONO, fontSize: 12, color: PURPLE, margin: 0, isTextBox: true });
    ry += 0.42;
  });
  s.addText("눈이 얼굴에 가려지면 → Sprite Renderer 의 Order in Layer 를 1 로", {
    x: M + 0.3, y: 5.05, w: 5.0, h: 0.5,
    fontFace: KR, fontSize: 11, color: MUTED, margin: 0, isTextBox: true,
  });

  card(s, M, 6.0, W - M * 2, 1.0, CARD2);
  s.addText("숫자 칸 위에서 좌우로 드래그해 보세요 — 반응이 가장 좋은 지점이다", {
    x: M + 0.35, y: 6.22, w: 11.5, h: 0.5,
    fontFace: KR, fontSize: 15, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addNotes("아직 Play를 누르지 않는다. Play 중 변경 날림은 037회차 주제다.");
}

// ================================================================ 5. 032 좌표계
{
  const s = bgSlide(BG);
  sectionTitle(s, "032", "Transform ① — Position과 좌표계", "앞으로 나올 거의 모든 코드가 좌표를 다룬다", YELLOW);

  // 좌표축 다이어그램
  const cx = 3.9, cy = 4.15;
  card(s, M, 1.75, 6.4, 4.95, CARD);
  s.addShape(pres.ShapeType.line, { x: cx - 2.7, y: cy, w: 5.4, h: 0, line: { color: DIM, width: 1.5 } });
  s.addShape(pres.ShapeType.line, { x: cx, y: cy - 1.95, w: 0, h: 3.9, line: { color: DIM, width: 1.5 } });
  s.addShape(pres.ShapeType.ellipse, { x: cx - 0.1, y: cy - 0.1, w: 0.2, h: 0.2, fill: { color: WHITE }, line: { width: 0 } });
  s.addText("(0, 0) 원점", { x: cx + 0.18, y: cy + 0.14, w: 1.8, h: 0.3, fontFace: KR, fontSize: 13, bold: true, color: WHITE, margin: 0, isTextBox: true });
  s.addText("X +  오른쪽", { x: cx + 1.75, y: cy - 0.45, w: 1.8, h: 0.32, fontFace: KR, fontSize: 14, bold: true, color: YELLOW, margin: 0, isTextBox: true });
  s.addText("X −  왼쪽", { x: cx - 3.35, y: cy - 0.45, w: 1.8, h: 0.32, fontFace: KR, fontSize: 14, bold: true, color: YELLOW, align: "right", margin: 0, isTextBox: true });
  s.addText("Y +  위", { x: cx + 0.2, y: cy - 2.12, w: 1.8, h: 0.32, fontFace: KR, fontSize: 14, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText("Y −  아래", { x: cx + 0.2, y: cy + 1.82, w: 1.8, h: 0.32, fontFace: KR, fontSize: 14, bold: true, color: TEAL, margin: 0, isTextBox: true });

  card(s, 7.5, 1.75, W - M - 7.5, 2.35, CARD);
  s.addText("2D에서 Z는 0으로 둔다", {
    x: 7.85, y: 2.02, w: 4.7, h: 0.4,
    fontFace: KR, fontSize: 19, bold: true, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addText("유니티는 원래 3D 엔진이다. Z는 깊이인데 2D에서는 쓸 일이 거의 없다. 건드리면 물체가 사라진 것처럼 보인다.", {
    x: 7.85, y: 2.55, w: 4.7, h: 1.4,
    fontFace: KR, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });

  card(s, 7.5, 4.35, W - M - 7.5, 2.35, CARD2);
  s.addText("Ctrl + 드래그 = 스냅", {
    x: 7.85, y: 4.62, w: 4.7, h: 0.4,
    fontFace: KR, fontSize: 19, bold: true, color: YELLOW, margin: 0, isTextBox: true,
  });
  s.addText("손으로 끌면 2.03718 같은 지저분한 값이 나온다. Ctrl을 누르고 끌면 정수로 딱딱 떨어진다.", {
    x: 7.85, y: 5.15, w: 4.7, h: 1.4,
    fontFace: KR, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });
  s.addNotes("받아쓰기 5문제: (2,3) (-2,3) (-2,-3) (0,4) (5,0). 틀리는 학생이 절반이면 한 번 더 돈다.");
}

// ================================================================ 6. 032 실습
{
  const s = bgSlide(BG);
  sectionTitle(s, "032", "실습 — 좌표로 십자가 그리기", "소수점 없이 정확히. 1.99도 틀린 것으로 본다", YELLOW);
  card(s, M, 1.8, 7.6, 4.9, CARD);
  s.addImage({ path: img("032_Position"), x: M + 0.15, y: 1.95, w: 7.3, h: 4.1 });
  s.addText("완성 상태 (강사 레퍼런스 씬)", {
    x: M + 0.15, y: 6.12, w: 7.3, h: 0.32,
    fontFace: KR, fontSize: 11, color: DIM, align: "center", margin: 0, isTextBox: true,
  });

  const pos = [["Center", "0, 0"], ["Up", "0, 2"], ["Down", "0, -2"], ["Left", "-2, 0"], ["Right", "2, 0"]];
  card(s, 8.55, 1.8, W - M - 8.55, 4.9, CARD);
  s.addText("목표 좌표", {
    x: 8.9, y: 2.05, w: 3.4, h: 0.32,
    fontFace: KR, fontSize: 14, bold: true, color: YELLOW, margin: 0, isTextBox: true,
  });
  let py = 2.65;
  pos.forEach((p) => {
    s.addText(p[0], { x: 8.9, y: py, w: 1.7, h: 0.34, fontFace: KR, fontSize: 15, color: WHITE, margin: 0, isTextBox: true });
    s.addText(p[1], { x: 10.6, y: py, w: 1.7, h: 0.34, fontFace: MONO, fontSize: 15, bold: true, color: YELLOW, margin: 0, isTextBox: true });
    py += 0.58;
  });
  s.addText("값은 손으로 끌지 말고 Inspector에 직접 타이핑한다. 그게 제일 빠르고 정확하다.", {
    x: 8.9, y: 5.75, w: 3.6, h: 0.8,
    fontFace: KR, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });
  s.addNotes("좌표 맞히기 게임: 강사가 물체를 놓고 학생이 채팅에 좌표를 예상해 쓴다. 3~4번 반복하면 감각이 붙는다.");
}

// ================================================================ 7. 033 회전·크기
{
  const s = bgSlide(BG);
  sectionTitle(s, "033", "Transform ② — Rotation · Scale", "2D는 Z만 돈다. Scale 음수는 뒤집기", ORANGE);

  card(s, M, 1.8, 5.9, 2.35, CARD);
  s.addText("Rotation", { x: M + 0.3, y: 2.0, w: 3, h: 0.35, fontFace: KR, fontSize: 19, bold: true, color: ORANGE, margin: 0, isTextBox: true });
  s.addText([
    { text: "Z = 45  →  기울어진다  (우리가 쓸 것)", options: { bullet: true, breakLine: true } },
    { text: "X 또는 Y  →  납작해진다  (2D에서 쓸 일 없음)", options: { bullet: true, breakLine: true } },
    { text: "되돌리기 = Transform ⋮ → Reset", options: { bullet: true } },
  ], {
    x: M + 0.3, y: 2.52, w: 5.3, h: 1.5,
    fontFace: KR, fontSize: 13, color: MUTED, paraSpaceAfter: 8, margin: 0, isTextBox: true,
  });

  card(s, M, 4.35, 5.9, 2.35, CARD);
  s.addText("Scale", { x: M + 0.3, y: 4.58, w: 3, h: 0.35, fontFace: KR, fontSize: 19, bold: true, color: PURPLE, margin: 0, isTextBox: true });
  s.addText([
    { text: "1 이 기본 · 2 면 두 배 · 0.5 면 절반", options: { bullet: true, breakLine: true } },
    { text: "X 에 −1  →  거울처럼 좌우 반전", options: { bullet: true, breakLine: true } },
    { text: "0 을 넣으면 사라진다", options: { bullet: true } },
  ], {
    x: M + 0.3, y: 5.07, w: 5.3, h: 1.5,
    fontFace: KR, fontSize: 13, color: MUTED, paraSpaceAfter: 8, margin: 0, isTextBox: true,
  });

  card(s, 7.3, 1.8, W - M - 7.3, 4.9, CARD2);
  s.addText("부모자식 — 오늘의 핵심", {
    x: 7.6, y: 2.05, w: 5, h: 0.4,
    fontFace: KR, fontSize: 20, bold: true, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addText("Hierarchy에서 오브젝트를 다른 오브젝트 위로 끌어다 놓으면 자식이 된다.", {
    x: 7.6, y: 2.55, w: 5.1, h: 0.6,
    fontFace: KR, fontSize: 13, color: MUTED, margin: 0, isTextBox: true,
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.6, y: 3.5, w: 5.1, h: 1.35, rectRadius: 0.1,
    fill: { color: ORANGE, transparency: 82 }, line: { color: ORANGE, width: 1 },
  });
  s.addText("자식이 되면 좌표를 부모 기준으로 센다.\n(0, 0)은 원점이 아니라 부모가 있는 자리다.", {
    x: 7.8, y: 3.72, w: 4.7, h: 1.0,
    fontFace: KR, fontSize: 15, bold: true, color: WHITE, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true,
  });
  s.addText("부모를 움직이면 자식이 따라온다. 캐릭터가 움직이면 체력바도 따라와야 한다 — 그때 이걸 쓴다.", {
    x: 7.6, y: 5.1, w: 5.1, h: 1.4,
    fontFace: KR, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });
  s.addNotes("'로컬 좌표계'라는 용어는 쓰지 않는다. 물어보는 학생에게만 개별로 알려준다.");
}

// ================================================================ 8. 033 실습
{
  const s = bgSlide(BG);
  sectionTitle(s, "033", "실습 — 로봇팔 만들기", "어깨를 돌리면 팔 전체가 돌아야 한다", ORANGE);
  card(s, 6.4, 1.8, 6.23, 4.0, CARD);
  s.addImage({ path: img("033_Transform"), x: 6.55, y: 1.95, w: 5.93, h: 3.34 });
  s.addText("완성 상태 — 4단 계층", {
    x: 6.55, y: 5.35, w: 5.93, h: 0.32,
    fontFace: KR, fontSize: 11, color: DIM, align: "center", margin: 0, isTextBox: true,
  });

  card(s, M, 1.8, 5.4, 4.0, CARD);
  s.addText("계층 구조", {
    x: M + 0.3, y: 2.0, w: 3, h: 0.32,
    fontFace: KR, fontSize: 14, bold: true, color: ORANGE, margin: 0, isTextBox: true,
  });
  const tree = [
    ["Shoulder", 0, "어깨 — 부모"],
    ["UpperArm", 1, "윗팔"],
    ["LowerArm", 2, "아랫팔"],
    ["Hand", 3, "손"],
  ];
  let ty = 2.5;
  tree.forEach((t) => {
    s.addText(t[0], {
      x: M + 0.35 + t[1] * 0.42, y: ty, w: 2.4, h: 0.32,
      fontFace: MONO, fontSize: 13, bold: true, color: WHITE, margin: 0, isTextBox: true,
    });
    s.addText(t[2], {
      x: M + 3.2, y: ty, w: 2.0, h: 0.32,
      fontFace: KR, fontSize: 12, color: MUTED, margin: 0, isTextBox: true,
    });
    ty += 0.5;
  });
  s.addText("순서가 중요하다. 4개를 만들어 계층부터 만들고, 그다음 좌표를 넣는다. 반대로 하면 위치가 튄다.", {
    x: M + 0.3, y: 4.85, w: 4.8, h: 0.8,
    fontFace: KR, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });

  card(s, M, 6.05, W - M * 2, 0.95, CARD2);
  s.addText("Shoulder 만 돌렸는데 손까지 따라 움직이면 통과", {
    x: M + 0.35, y: 6.26, w: 11.5, h: 0.45,
    fontFace: KR, fontSize: 16, bold: true, color: TEAL, margin: 0, isTextBox: true,
  });
  s.addNotes("팔이 흩어지면 자식 Position이 부모 기준이라는 걸 다시 짚는다. (1.5, 0)은 원점에서가 아니라 부모에서 1.5다.");
}

// ================================================================ 9. 034 그릇과 부품
{
  const s = bgSlide(BG);
  sectionTitle(s, "034", "GameObject와 Component", "조립이 아니라 분해로 가르친다", PURPLE);

  const parts = [
    ["Transform", "존재 불가", "위치 · 회전 · 크기", "못 지운다"],
    ["Sprite Renderer", "안 보인다", "그림이 보인다", ""],
    ["Collider 2D", "통과한다", "부딪힌다", ""],
    ["Rigidbody 2D", "가만히 있는다", "중력을 받는다", ""],
  ];
  card(s, M, 1.75, W - M * 2, 0.5, CARD2);
  s.addText("부품", { x: M + 0.3, y: 1.83, w: 3, h: 0.34, fontFace: KR, fontSize: 13, bold: true, color: MUTED, margin: 0, isTextBox: true });
  s.addText("없으면", { x: M + 3.8, y: 1.83, w: 3, h: 0.34, fontFace: KR, fontSize: 13, bold: true, color: MUTED, margin: 0, isTextBox: true });
  s.addText("있으면", { x: M + 7.3, y: 1.83, w: 4, h: 0.34, fontFace: KR, fontSize: 13, bold: true, color: MUTED, margin: 0, isTextBox: true });

  let cy2 = 2.35;
  parts.forEach((p, i) => {
    card(s, M, cy2, W - M * 2, 0.72, i === 0 ? CARD2 : CARD);
    s.addText(p[0], { x: M + 0.3, y: cy2 + 0.19, w: 3.4, h: 0.35, fontFace: KR, fontSize: 15, bold: true, color: i === 0 ? PURPLE : WHITE, margin: 0, isTextBox: true });
    s.addText(p[1], { x: M + 3.8, y: cy2 + 0.19, w: 3.4, h: 0.35, fontFace: KR, fontSize: 14, color: MUTED, margin: 0, isTextBox: true });
    s.addText(p[2], { x: M + 7.3, y: cy2 + 0.19, w: 4.4, h: 0.35, fontFace: KR, fontSize: 14, color: WHITE, margin: 0, isTextBox: true });
    cy2 += 0.82;
  });

  card(s, M, 5.75, W - M * 2, 0.95, CARD2);
  s.addText("벽이랑 떨어지는 상자의 차이는 부품 하나다", {
    x: M + 0.35, y: 5.95, w: 11.5, h: 0.45,
    fontFace: KR, fontSize: 17, bold: true, color: PURPLE, margin: 0, isTextBox: true,
  });
  s.addNotes("Rigidbody를 뺐다 넣었다 두 번 반복한다. 능력이 부품에 있다는 걸 눈으로 확인시킨다. Add Component는 반드시 검색으로 — 3D Rigidbody를 고르는 학생이 나온다.");
}

// ================================================================ 10. 034 실습
{
  const s = bgSlide(BG);
  sectionTitle(s, "034", "실습 — 부품 조합 4종", "전부 Create Empty 로 만든다", PURPLE);
  card(s, 6.4, 1.8, 6.23, 4.0, CARD);
  s.addImage({ path: img("034_Component"), x: 6.55, y: 1.95, w: 5.93, h: 3.34 });
  s.addText("완성 상태 — Falling 이 Wall 에서 멈춘다", {
    x: 6.55, y: 5.35, w: 5.93, h: 0.32,
    fontFace: KR, fontSize: 11, color: DIM, align: "center", margin: 0, isTextBox: true,
  });

  const combos = [
    ["Invisible", "Transform 만", DIM],
    ["Decoration", "+ Sprite Renderer", MUTED],
    ["Wall", "+ Collider 2D", TEAL],
    ["Falling", "+ Rigidbody 2D", ORANGE],
  ];
  let ky = 1.8;
  combos.forEach((c) => {
    card(s, M, ky, 5.4, 0.78, CARD);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.28, y: ky + 0.24, w: 0.3, h: 0.3, fill: { color: c[2] }, line: { width: 0 } });
    s.addText(c[0], { x: M + 0.75, y: ky + 0.1, w: 2.2, h: 0.32, fontFace: MONO, fontSize: 14, bold: true, color: WHITE, margin: 0, isTextBox: true });
    s.addText(c[1], { x: M + 0.75, y: ky + 0.42, w: 4.2, h: 0.28, fontFace: KR, fontSize: 11, color: MUTED, margin: 0, isTextBox: true });
    ky += 0.88;
  });

  card(s, M, 6.05, W - M * 2, 0.95, CARD2);
  s.addText("떨어지는 쪽에도 Collider 가 있어야 부딪힌다 — 양쪽 다 필요하다", {
    x: M + 0.35, y: 6.26, w: 11.5, h: 0.45,
    fontFace: KR, fontSize: 16, bold: true, color: YELLOW, margin: 0, isTextBox: true,
  });
  s.addNotes("Falling이 Decoration은 통과하고 Wall에서 멈추는지 확인시킨다. 안 멈추면 양쪽 Collider부터 본다.");
}

// ================================================================ 11. 035 자가진단
{
  const s = bgSlide(BG);
  sectionTitle(s, "035", "막혔을 때 확인 순서", "오늘의 진짜 수업 — 새 문법은 하나도 안 나간다", TEAL);

  const steps = [
    ["1", "물체가 화면 안에 있나", "Hierarchy 클릭 → F"],
    ["2", "Inspector 값이 이상하지 않나", "Scale 0 / Rotation X·Y / Position Z"],
    ["3", "부품이 다 붙어 있나", "안 보이면 Sprite Renderer, 안 부딪히면 Collider"],
    ["4", "체크박스가 켜져 있나", "오브젝트와 컴포넌트 둘 다"],
    ["5", "Console 에 빨간 줄이 있나", "있으면 더블클릭"],
  ];
  let sy = 1.85;
  steps.forEach((st) => {
    card(s, M, sy, W - M * 2, 0.82, CARD);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.28, y: sy + 0.17, w: 0.48, h: 0.48, fill: { color: TEAL }, line: { width: 0 } });
    s.addText(st[0], { x: M + 0.28, y: sy + 0.17, w: 0.48, h: 0.48, align: "center", valign: "middle", fontFace: KR, fontSize: 15, bold: true, color: BG, margin: 0, isTextBox: true });
    s.addText(st[1], { x: M + 1.0, y: sy + 0.22, w: 4.6, h: 0.38, fontFace: KR, fontSize: 16, bold: true, color: WHITE, margin: 0, isTextBox: true });
    s.addText(st[2], { x: M + 5.8, y: sy + 0.25, w: 6.0, h: 0.34, fontFace: KR, fontSize: 13, color: MUTED, margin: 0, isTextBox: true });
    sy += 0.92;
  });

  s.addText("이 다섯 개로 열 번 중 아홉 번은 해결된다. 나머지 한 번만 강사를 부른다.", {
    x: M, y: 6.55, w: 11.9, h: 0.4,
    fontFace: KR, fontSize: 14, color: TEAL, margin: 0, isTextBox: true,
  });
  s.addNotes("이 표를 채팅에 고정하거나 공지에 박아둔다. 다음 주부터 여기에 항목이 더 붙는다.");
}

// ================================================================ 12. 035 종합 실습
{
  const s = bgSlide(BG);
  sectionTitle(s, "035", "실습 — 내 놀이터 만들기", "7주차에 배운 것만으로 장면을 구성한다", TEAL);
  card(s, M, 1.8, 7.6, 4.9, CARD);
  s.addImage({ path: img("035_Playground"), x: M + 0.15, y: 1.95, w: 7.3, h: 4.1 });
  s.addText("완성 예시 — Play 중 (물체가 떨어지는 중)", {
    x: M + 0.15, y: 6.12, w: 7.3, h: 0.32,
    fontFace: KR, fontSize: 11, color: DIM, align: "center", margin: 0, isTextBox: true,
  });

  const req = [
    "바닥 (Collider 있음, Rigidbody 없음)",
    "떨어지는 물체 3개 이상",
    "부모자식 구조 최소 한 곳",
    "회전된 물체 하나 (Rotation Z)",
    "뒤집힌 물체 하나 (Scale 음수)",
    "이름 정리 · 좌표는 정수로",
  ];
  card(s, 8.55, 1.8, W - M - 8.55, 4.9, CARD);
  s.addText("요구 조건", {
    x: 8.9, y: 2.05, w: 3.4, h: 0.32,
    fontFace: KR, fontSize: 14, bold: true, color: TEAL, margin: 0, isTextBox: true,
  });
  s.addText(req.map((r, i) => ({
    text: r, options: { bullet: true, breakLine: i !== req.length - 1 },
  })), {
    x: 8.9, y: 2.6, w: 3.6, h: 3.9,
    fontFace: KR, fontSize: 13, color: MUTED, valign: "top",
    paraSpaceAfter: 10, margin: 0, isTextBox: true,
  });
  s.addNotes("오늘은 전원이 30초씩 데모한다. 잘 만든 걸 보여주는 자리가 아니라 여기까지 왔다는 걸 확인하는 자리다. 못 만든 학생에게는 Snapshot_P2_Week07.zip 을 배포한다.");
}

// ================================================================ 13. 흔한 사고 TOP 5
{
  const s = bgSlide(BG);
  s.addText("이번 주 흔한 사고 TOP 5", {
    x: M, y: 0.5, w: 9, h: 0.6,
    fontFace: KR, fontSize: 34, bold: true, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addText("강사용 — 미리 알고 있으면 대응이 빨라진다", {
    x: M, y: 1.12, w: 10, h: 0.4,
    fontFace: KR, fontSize: 14, color: MUTED, margin: 0, isTextBox: true,
  });

  const acc = [
    ["물체가 안 보여요", "화면 밖 / 카메라 밖", "클릭하고 F. 매번 같은 말로 반복"],
    ["창을 닫아버림", "탭을 실수로 드래그", "Window → Layouts → Default"],
    ["3D Rigidbody 를 넣음", "검색 결과 첫 줄 선택", "2D 가 붙은 것을 고른다"],
    ["자식으로 넣으니 위치가 튐", "좌표가 부모 기준으로 바뀜", "부모에서부터 센다"],
    ["프로젝트 경로가 한글", "사용자 이름이 한글", "지금 다시 만든다. 21주차에 터진다"],
  ];
  let ay = 1.85;
  acc.forEach((a, i) => {
    card(s, M, ay, W - M * 2, 0.88, i === 4 ? CARD2 : CARD);
    s.addText(a[0], { x: M + 0.3, y: ay + 0.24, w: 3.8, h: 0.4, fontFace: KR, fontSize: 15, bold: true, color: i === 4 ? ORANGE : WHITE, margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.3, y: ay + 0.26, w: 3.4, h: 0.36, fontFace: KR, fontSize: 12, color: MUTED, margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 7.9, y: ay + 0.26, w: 4.0, h: 0.36, fontFace: KR, fontSize: 12, color: TEAL, margin: 0, isTextBox: true });
    ay += 0.98;
  });
  s.addNotes("경로 한글은 이번 주에 잡지 않으면 21주차 빌드에서 프로젝트를 다시 만들어야 한다. 031회차에 못을 박는다.");
}

// ================================================================ 14. 체크리스트 + 예고
{
  const s = bgSlide(BG);
  s.addText("7주차 체크리스트", {
    x: M, y: 0.5, w: 9, h: 0.6,
    fontFace: KR, fontSize: 34, bold: true, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addText("전원이 통과해야 8주차로 넘어간다", {
    x: M, y: 1.12, w: 10, h: 0.4,
    fontFace: KR, fontSize: 14, color: MUTED, margin: 0, isTextBox: true,
  });

  const chk = [
    "6개 창의 이름과 역할을 말한다",
    "클릭하고 F 로 물체를 찾는다",
    "Inspector 에서 Position 을 바꾼다",
    "X 양수는 오른쪽, Y 양수는 위",
    "2D 는 Rotation Z 만 쓴다",
    "Scale 음수는 뒤집기",
    "자식 좌표는 부모 기준이다",
    "Component 를 추가·제거한다",
    "Transform 은 못 지운다",
    "막혔을 때 5단계를 돌린다",
  ];
  const half = 5;
  chk.forEach((c, i) => {
    const col = i < half ? 0 : 1;
    const row = i % half;
    const bx = M + col * 6.1;
    const by = 1.85 + row * 0.62;
    s.addShape(pres.ShapeType.roundRect, {
      x: bx, y: by + 0.06, w: 0.26, h: 0.26, rectRadius: 0.05,
      fill: { color: CARD2 }, line: { color: TEAL, width: 1 },
    });
    s.addText(c, {
      x: bx + 0.45, y: by, w: 5.4, h: 0.4,
      fontFace: KR, fontSize: 14, color: WHITE, valign: "middle", margin: 0, isTextBox: true,
    });
  });

  card(s, M, 5.2, W - M * 2, 1.5, CARD2);
  s.addText("다음 주 (036 – 040)", {
    x: M + 0.4, y: 5.42, w: 5, h: 0.35,
    fontFace: KR, fontSize: 14, bold: true, color: TEAL, margin: 0, isTextBox: true,
  });
  s.addText("지금까지는 손으로 값을 바꿨다. 다음 주부터는 코드가 대신 바꾼다.\n6주 동안 배운 클래스와 메서드가 드디어 나온다 — 새로 배우는 게 아니다.", {
    x: M + 0.4, y: 5.82, w: 11.3, h: 0.8,
    fontFace: KR, fontSize: 15, color: WHITE, margin: 0, isTextBox: true,
  });
  s.addNotes("'언제 코딩해요?'라는 조급함이 반드시 나온다. 날짜를 명확히 말해준다.");
}

const out = path.join(__dirname, "7주차-유니티입문.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
