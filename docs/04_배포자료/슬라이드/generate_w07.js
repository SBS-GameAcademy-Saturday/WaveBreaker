// 7주차 유니티 입문 — Mobbin 디자인 시스템 (DESIGN.md) 적용
// gallery-white monochrome / shadow-free / stadium pills / weight contrast
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK         = "141414";
const INK_SOFT    = "262626";
const MUTED       = "707070";
const FAINT       = "ADADAD";
const CANVAS      = "FFFFFF";
const CANVAS_SOFT = "F3F3F3";
const HAIRLINE_S  = "F0F0F0";
const HAIRLINE    = "E0E0E0";
const ACCENT      = "0066FF";   // 덱 전체에서 딱 한 번만

// ---------------------------------------------------------------- type
// Saans 652 / 456 / 300  ->  Pretendard SemiBold / Regular / Light
const F_SEMI  = "Pretendard SemiBold";
const F_MED   = "Pretendard Medium";
const F_REG   = "Pretendard";
const F_LIGHT = "Pretendard Light";

const T = {
  display: 46, h1: 34, h2: 26, h3: 19, h4: 15.5,
  title: 14, bodyLg: 15, body: 12, bodySm: 11, label: 9.5, caption: 9.5,
};

// ---------------------------------------------------------------- geometry
const R_SM = 0.167;   // 16px
const R_MD = 0.25;    // 24px
const pill = (h) => h / 2;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WaveBreaker 강의";
pres.title = "7주차 · 유니티 입문";

const W = 13.333, H = 7.5;
const M = 0.83;
const CW = W - M * 2;

// ---------------------------------------------------------------- helpers
function slide() {
  const s = pres.addSlide();
  s.background = { color: CANVAS };
  return s;
}

function soft(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS_SOFT }, line: { width: 0 },
  });
}

function outlined(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS }, line: { color: HAIRLINE_S, width: 1 },
  });
}

function inverse(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: INK }, line: { width: 0 },
  });
}

function softPill(s, x, y, w, h, text) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: pill(h),
    fill: { color: CANVAS_SOFT }, line: { width: 0 },
  });
  s.addText(text, {
    x, y, w, h, align: "center", valign: "middle",
    fontFace: F_SEMI, fontSize: T.label, color: INK, margin: 0, isTextBox: true,
  });
}

function rule(s, x, y, w, color) {
  s.addShape(pres.ShapeType.line, {
    x, y, w, h: 0, line: { color: color || HAIRLINE_S, width: 1 },
  });
}

function head(s, num, title, sub) {
  // 회차 라벨은 제목 위 eyebrow. 모든 요소가 M 에서 좌측 정렬된다.
  if (num) softPill(s, M, 0.6, 0.64, 0.3, num);
  s.addText(title, {
    x: M, y: num ? 1.0 : 0.62, w: CW, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: INK,
    valign: "middle", margin: 0, isTextBox: true,
  });
  if (sub) {
    s.addText(sub, {
      x: M, y: num ? 1.54 : 1.16, w: CW, h: 0.36,
      fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED,
      valign: "middle", margin: 0, isTextBox: true,
    });
  }
}

function shot(s, name, x, y, w, h, caption) {
  soft(s, x, y, w, h + 0.52);
  const pad = 0.22;
  s.addImage({ path: img(name), x: x + pad, y: y + pad, w: w - pad * 2, h: h - pad * 2 });
  if (caption) {
    s.addText(caption, {
      x: x + pad, y: y + h - 0.14, w: w - pad * 2, h: 0.34,
      fontFace: F_REG, fontSize: T.caption, color: FAINT,
      align: "center", valign: "middle", margin: 0, isTextBox: true,
    });
  }
}

// ================================================================ 1. 타이틀
{
  const s = slide();
  s.addText("7주차", {
    x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  s.addText("유니티 입문.", {
    x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK,
    lineSpacingMultiple: 1.0, margin: 0, isTextBox: true,
  });
  s.addText("에디터가 손에 붙는 다섯 회차. 코드는 한 줄도 치지 않는다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true,
  });

  // 오른쪽 스크린샷 스택 — content supplies the color
  soft(s, 7.35, 1.35, 5.0, 2.95);
  s.addImage({ path: img("031_Inspector"), x: 7.57, y: 1.57, w: 4.56, h: 2.51 });
  soft(s, 6.55, 3.62, 5.0, 2.95);
  s.addImage({ path: img("035_Playground"), x: 6.77, y: 3.84, w: 4.56, h: 2.51 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("031 – 035회차", {
    x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true,
  });
  s.addText("Phase 2 · 웨이브 브레이커", {
    x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true,
  });
  s.addNotes("6주간 콘솔만 했다. 오늘부터 유니티다. 학생이 가장 기다린 주간이라는 걸 첫 마디에 인정하고 시작한다.");
}

// ================================================================ 2. 이번 주 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "다음 주부터 스크립트를 시작한다.");

  const items = [
    ["031", "에디터와 Inspector", "6개 창 · Scene 조작 · 값 바꾸기"],
    ["032", "Transform ① Position", "좌표계 · X는 가로, Y는 세로"],
    ["033", "Transform ② 회전과 크기", "Rotation Z · Scale · 부모자식"],
    ["034", "GameObject와 Component", "그릇과 부품 · 붙이면 능력이 생긴다"],
    ["035", "7주차 정리", "조합 실습 · 자가진단 5단계"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let y = 2.42;
  items.forEach((it, i) => {
    s.addText(it[0], {
      x: M, y: y, w: 0.9, h: 0.44,
      fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(it[1], {
      x: M + 0.95, y: y, w: 4.8, h: 0.44,
      fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(it[2], {
      x: M + 5.95, y: y, w: CW - 5.95, h: 0.44,
      fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true,
    });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });
  s.addNotes("035는 진도를 나가지 않는 날이다. 새 문법을 넣고 싶은 유혹을 참는다.");
}

// ================================================================ 3. 031 · 6개 창
{
  const s = slide();
  head(s, "031", "에디터 인터페이스와 Inspector.", "오늘의 중심은 Inspector — 앞으로 7개월간 가장 오래 볼 창이다.");

  const wins = [
    ["Hierarchy", "지금 씬에 있는 것들의 목록"],
    ["Scene", "내가 배치하는 작업대"],
    ["Game", "플레이어가 보게 될 화면"],
    ["Inspector", "고른 것의 설정판"],
    ["Project", "이 프로젝트의 파일 전부"],
    ["Console", "에러와 메시지가 뜨는 곳"],
  ];
  const cw = (CW - 0.5) / 3;
  wins.forEach((wv, i) => {
    const cx = M + (i % 3) * (cw + 0.25);
    const cy = 2.15 + Math.floor(i / 3) * 1.5;
    const hot = wv[0] === "Inspector";
    if (hot) inverse(s, cx, cy, cw, 1.28); else soft(s, cx, cy, cw, 1.28);
    s.addText(wv[0], {
      x: cx + 0.32, y: cy + 0.24, w: cw - 0.64, h: 0.36,
      fontFace: F_SEMI, fontSize: T.h4, color: hot ? CANVAS : INK, margin: 0, isTextBox: true,
    });
    s.addText(wv[1], {
      x: cx + 0.32, y: cy + 0.66, w: cw - 0.64, h: 0.45,
      fontFace: F_LIGHT, fontSize: T.bodySm, color: hot ? FAINT : MUTED, margin: 0, isTextBox: true,
    });
  });

  s.addText("물체가 안 보이면 — 클릭하고 F.", {
    x: M, y: 5.6, w: 8, h: 0.44,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });
  s.addText("마우스가 Scene 창 위에 있어야 하고, 한/영이 영문이어야 먹는다.", {
    x: M, y: 6.12, w: 9.5, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true,
  });
  s.addNotes("F가 안 먹는 이유 두 개(마우스 위치, 한영키)를 반드시 같이 말한다. 안 그러면 'F 눌러도 안 돼요'가 나온다.");
}

// ================================================================ 4. 031 실습
{
  const s = slide();
  head(s, "031", "실습 — 얼굴 만들기.", "Square와 Circle만으로. 코드 없음, Play 없음.");

  const rows = [
    ["Face", "Circle", "0, 0", "4, 4"],
    ["EyeL", "Circle", "-0.8, 0.7", "0.5, 0.5"],
    ["EyeR", "Circle", "0.8, 0.7", "0.5, 0.5"],
    ["Mouth", "Square", "0, -0.8", "2, 0.3"],
  ];
  s.addText("Position / Scale", {
    x: M, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  rule(s, M, 2.6, 5.4, HAIRLINE);
  let ry = 2.8;
  rows.forEach((r) => {
    s.addText(r[0], { x: M, y: ry, w: 1.3, h: 0.36, fontFace: F_MED, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(r[1], { x: M + 1.3, y: ry, w: 1.2, h: 0.36, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(r[2], { x: M + 2.7, y: ry, w: 1.4, h: 0.36, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(r[3], { x: M + 4.1, y: ry, w: 1.3, h: 0.36, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, ry + 0.5, 5.4);
    ry += 0.62;
  });

  s.addText("눈이 얼굴에 가려지면 Sprite Renderer의 Order in Layer를 1로 올린다.", {
    x: M, y: 5.5, w: 5.4, h: 0.66,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true,
  });
  s.addText("숫자 칸 위에서 좌우로 드래그해 보세요.", {
    x: M, y: 6.3, w: 5.4, h: 0.38,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true,
  });

  shot(s, "031_Inspector", 6.85, 2.15, 5.65, 3.7, "완성 상태 — 강사 레퍼런스 씬");
  s.addNotes("아직 Play를 누르지 않는다. Play 중 변경 날림은 037회차 주제다.");
}

// ================================================================ 5. 032 좌표계
{
  const s = slide();
  head(s, "032", "Transform ① Position과 좌표계.", "앞으로 나올 거의 모든 코드가 좌표를 다룬다.");

  soft(s, M, 2.15, 5.9, 4.5);
  const cx = M + 2.95, cy = 4.4;
  s.addShape(pres.ShapeType.line, { x: cx - 2.25, y: cy, w: 4.5, h: 0, line: { color: HAIRLINE, width: 1.25 } });
  s.addShape(pres.ShapeType.line, { x: cx, y: cy - 1.45, w: 0, h: 2.9, line: { color: HAIRLINE, width: 1.25 } });
  s.addShape(pres.ShapeType.ellipse, { x: cx - 0.07, y: cy - 0.07, w: 0.14, h: 0.14, fill: { color: INK }, line: { width: 0 } });

  s.addText("0, 0", { x: cx + 0.16, y: cy + 0.08, w: 1.4, h: 0.28, fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("X +  오른쪽", { x: cx + 1.4, y: cy - 0.42, w: 1.7, h: 0.28, fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("X −  왼쪽", { x: cx - 3.1, y: cy - 0.42, w: 1.7, h: 0.28, fontFace: F_MED, fontSize: T.bodySm, color: INK, align: "right", margin: 0, isTextBox: true });
  s.addText("Y +  위", { x: cx + 0.18, y: cy - 1.62, w: 1.7, h: 0.28, fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Y −  아래", { x: cx + 0.18, y: cy + 1.38, w: 1.7, h: 0.28, fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });

  const rx = 7.05, rw = W - M - 7.05;
  outlined(s, rx, 2.15, rw, 2.12);
  s.addText("2D에서 Z는 0으로 둔다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.4,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });
  s.addText("유니티는 원래 3D 엔진이다. Z는 깊이인데 2D에서는 쓸 일이 거의 없다. 건드리면 물체가 사라진 것처럼 보인다.", {
    x: rx + 0.4, y: 3.02, w: rw - 0.8, h: 1.0,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true,
  });

  outlined(s, rx, 4.53, rw, 2.12);
  s.addText("Ctrl을 누른 채 끌면 정수로 떨어진다.", {
    x: rx + 0.4, y: 4.88, w: rw - 0.8, h: 0.4,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });
  s.addText("손으로 그냥 끌면 2.03718 같은 값이 남는다. 게임은 돌아가지만 나중에 찾기 어려워진다.", {
    x: rx + 0.4, y: 5.4, w: rw - 0.8, h: 1.0,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true,
  });
  s.addNotes("받아쓰기 5문제: (2,3) (-2,3) (-2,-3) (0,4) (5,0). 틀리는 학생이 절반이면 한 번 더 돈다.");
}

// ================================================================ 6. 032 실습
{
  const s = slide();
  head(s, "032", "실습 — 좌표로 십자가 그리기.", "소수점 없이 정확히. 1.99도 틀린 것으로 본다.");
  shot(s, "032_Position", M, 2.15, 7.25, 4.1, "완성 상태 — 강사 레퍼런스 씬");

  const pos = [["Center", "0, 0"], ["Up", "0, 2"], ["Down", "0, -2"], ["Left", "-2, 0"], ["Right", "2, 0"]];
  const qx = 8.55, qw = W - M - 8.55;
  s.addText("목표 좌표", {
    x: qx, y: 2.15, w: qw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  rule(s, qx, 2.6, qw, HAIRLINE);
  let py = 2.8;
  pos.forEach((p) => {
    s.addText(p[0], { x: qx, y: py, w: 2.0, h: 0.36, fontFace: F_MED, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(p[1], { x: qx + 2.1, y: py, w: 1.5, h: 0.36, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, qx, py + 0.5, qw);
    py += 0.62;
  });
  s.addText("값은 손으로 끌지 말고 Inspector에 직접 타이핑한다. 그게 제일 빠르고 정확하다.", {
    x: qx, y: 6.0, w: qw, h: 0.8,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true,
  });
  s.addNotes("좌표 맞히기 게임: 강사가 물체를 놓고 학생이 채팅에 좌표를 예상해 쓴다. 3~4번 반복하면 감각이 붙는다.");
}

// ================================================================ 6.5 월드/로컬 좌표
{
  const s = slide();
  head(s, "033", "월드 좌표와 로컬 좌표.", "같은 자리에 있는데 Inspector 숫자가 다르다.");

  shot(s, "032_WorldLocal", M, 2.15, 6.35, 3.55, "032_WorldLocal_Demo — 설명 없이 이 씬부터 연다");

  const rx = 7.65, rw = W - M - 7.65;

  // 두 오브젝트 비교
  s.addText("Inspector Position", {
    x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  rule(s, rx, 2.6, rw, HAIRLINE);

  const cmp = [
    ["A_NoParent", "부모 없음", "3, 2"],
    ["B_Child", "부모 있음", "0, 0"],
  ];
  let cy = 2.8;
  cmp.forEach((c) => {
    s.addText(c[0], { x: rx, y: cy, w: 2.1, h: 0.42, fontFace: F_MED, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(c[1], { x: rx + 2.1, y: cy, w: 1.5, h: 0.42, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(c[2], { x: rx + 3.7, y: cy, w: 1.2, h: 0.42, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    rule(s, rx, cy + 0.56, rw);
    cy += 0.7;
  });

  s.addText("두 사각형은 화면상 같은 자리에 있다.", {
    x: rx, y: 4.35, w: rw, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true,
  });

  // 규칙 — 잉크 반전
  inverse(s, rx, 4.95, rw, 1.72);
  s.addText("Position은 부모가 있으면 부모 기준,\n없으면 월드 기준이다.", {
    x: rx + 0.4, y: 5.28, w: rw - 0.8, h: 1.05,
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true,
  });

  s.addText("부모 자리 + 로컬 좌표 = 실제 자리", {
    x: M, y: 6.35, w: 6.35, h: 0.4,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });

  s.addNotes("설명 없이 씬부터 연다. 두 사각형이 같은 자리인데 숫자가 다른 걸 먼저 보여주고, 그다음에 이름을 붙인다. 순서가 바뀌면 용어 암기가 된다. B_Parent 의 Position X 를 6 으로 바꿔 자식이 따라가는데 자식 숫자는 (0,0) 그대로인 걸 확인시킨다. 038회차의 transform.position / localPosition 이 여기서 시작된다.");
}

// ================================================================ 7. 033 회전·크기
{
  const s = slide();
  head(s, "033", "Transform ② Rotation과 Scale.", "2D는 Z만 돈다. Scale 음수는 뒤집기다.");

  soft(s, M, 2.15, 5.9, 2.15);
  s.addText("Rotation", { x: M + 0.4, y: 2.45, w: 3, h: 0.34, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "Z = 45 → 기울어진다. 우리가 쓸 것.", options: { breakLine: true } },
    { text: "X 또는 Y → 납작해진다. 2D에선 쓸 일 없다.", options: { breakLine: true } },
    { text: "되돌리기는 Transform ⋮ → Reset.", options: {} },
  ], {
    x: M + 0.4, y: 2.92, w: 5.1, h: 1.25,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.5, margin: 0, isTextBox: true,
  });

  soft(s, M, 4.5, 5.9, 2.15);
  s.addText("Scale", { x: M + 0.4, y: 4.8, w: 3, h: 0.34, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addText([
    { text: "1이 기본, 2면 두 배, 0.5면 절반.", options: { breakLine: true } },
    { text: "X에 −1을 넣으면 거울처럼 뒤집힌다.", options: { breakLine: true } },
    { text: "0을 넣으면 사라진다.", options: {} },
  ], {
    x: M + 0.4, y: 5.27, w: 5.1, h: 1.25,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.5, margin: 0, isTextBox: true,
  });

  const px = 7.05, pw = W - M - 7.05;
  inverse(s, px, 2.15, pw, 4.5);
  s.addText("부모자식", {
    x: px + 0.4, y: 2.5, w: pw - 0.8, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true,
  });
  s.addText("부모를 움직이면 위치·회전·크기가 다 따라온다.", {
    x: px + 0.4, y: 2.95, w: pw - 0.8, h: 0.95,
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true,
  });
  s.addText("자식이 되는 순간 Position이 로컬 좌표로 바뀐다.", {
    x: px + 0.4, y: 3.98, w: pw - 0.8, h: 0.4,
    fontFace: F_REG, fontSize: T.body, color: CANVAS, margin: 0, isTextBox: true,
  });
  rule(s, px + 0.4, 4.68, pw - 0.8, INK_SOFT);
  s.addText("Hierarchy에서 오브젝트를 다른 오브젝트 위로 끌어다 놓으면 자식이 된다. 부모를 움직이면 자식이 따라온다. 캐릭터가 움직이면 체력바도 따라와야 한다 — 그때 이걸 쓴다.", {
    x: px + 0.4, y: 4.9, w: pw - 0.8, h: 1.5,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.45, margin: 0, isTextBox: true,
  });
  s.addNotes("'로컬 좌표계'라는 용어는 쓰지 않는다. 물어보는 학생에게만 개별로 알려준다.");
}

// ================================================================ 8. 033 실습
{
  const s = slide();
  head(s, "033", "실습 — 로봇팔 만들기.", "어깨를 돌리면 팔 전체가 돌아야 한다.");

  s.addText("계층 구조", {
    x: M, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  rule(s, M, 2.6, 5.4, HAIRLINE);
  const tree = [["Shoulder", 0, "어깨 — 부모"], ["UpperArm", 1, "윗팔"], ["LowerArm", 2, "아랫팔"], ["Hand", 3, "손"]];
  let ty = 2.8;
  tree.forEach((t) => {
    s.addText(t[0], {
      x: M + t[1] * 0.42, y: ty, w: 2.8, h: 0.36,
      fontFace: F_MED, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(t[2], {
      x: M + 3.5, y: ty, w: 1.9, h: 0.36,
      fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true,
    });
    rule(s, M, ty + 0.5, 5.4);
    ty += 0.62;
  });
  s.addText("4개를 먼저 만들어 계층부터 잡고, 그다음 좌표를 넣는다. 반대로 하면 위치가 튄다.", {
    x: M, y: 5.5, w: 5.4, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true,
  });
  s.addText("Shoulder만 돌렸는데 손까지 따라 움직이면 통과.", {
    x: M, y: 6.3, w: 5.7, h: 0.38,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true,
  });

  shot(s, "033_Transform", 6.85, 2.15, 5.65, 3.7, "완성 상태 — 4단 계층");
  s.addNotes("팔이 흩어지면 자식 Position이 부모 기준이라는 걸 다시 짚는다. (1.5, 0)은 원점에서가 아니라 부모에서 1.5다.");
}

// ================================================================ 9. 034 부품표
{
  const s = slide();
  head(s, "034", "GameObject와 Component.", "조립이 아니라 분해로 가르친다.");

  const parts = [
    ["Transform", "존재 불가", "위치 · 회전 · 크기", true],
    ["Sprite Renderer", "안 보인다", "그림이 보인다", false],
    ["Collider 2D", "통과한다", "부딪힌다", false],
    ["Rigidbody 2D", "가만히 있는다", "중력을 받는다", false],
  ];
  const cA = M, cB = M + 4.3, cC = M + 7.7;
  s.addText("부품", { x: cA, y: 2.15, w: 3.6, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("없으면", { x: cB, y: 2.15, w: 3.2, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("있으면", { x: cC, y: 2.15, w: 3.2, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  rule(s, M, 2.62, CW, HAIRLINE);

  let py = 2.82;
  parts.forEach((p) => {
    if (p[3]) soft(s, M - 0.28, py - 0.12, CW + 0.56, 0.74, R_SM);
    s.addText(p[0], { x: cA, y: py, w: 4.1, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(p[1], { x: cB, y: py, w: 3.2, h: 0.46, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(p[2], { x: cC, y: py, w: 3.4, h: 0.46, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, py + 0.64, CW);
    py += 0.88;
  });

  s.addText("벽과 떨어지는 상자의 차이는 부품 하나다.", {
    x: M, y: 6.35, w: 9, h: 0.44,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });
  s.addNotes("Rigidbody를 뺐다 넣었다 두 번 반복한다. 능력이 부품에 있다는 걸 눈으로 확인시킨다. Add Component는 반드시 검색으로 — 3D Rigidbody를 고르는 학생이 나온다.");
}

// ================================================================ 10. 034 실습
{
  const s = slide();
  head(s, "034", "실습 — 부품 조합 네 가지.", "전부 Create Empty로 만든다.");

  const combos = [
    ["Invisible", "Transform만"],
    ["Decoration", "+ Sprite Renderer"],
    ["Wall", "+ Collider 2D"],
    ["Falling", "+ Rigidbody 2D"],
  ];
  rule(s, M, 2.35, 5.4, HAIRLINE);
  let ky = 2.55;
  combos.forEach((c) => {
    s.addText(c[0], { x: M, y: ky, w: 2.4, h: 0.42, fontFace: F_MED, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(c[1], { x: M + 2.5, y: ky, w: 2.9, h: 0.42, fontFace: F_REG, fontSize: T.bodySm, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, ky + 0.56, 5.4);
    ky += 0.72;
  });

  s.addText("떨어지는 쪽에도 Collider가 있어야 부딪힌다.", {
    x: M, y: 5.7, w: 5.6, h: 0.42,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true,
  });
  s.addText("양쪽 다 필요하다. 한쪽만 있으면 그냥 통과한다.", {
    x: M, y: 6.22, w: 5.6, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true,
  });

  shot(s, "034_Component", 6.85, 2.15, 5.65, 3.7, "완성 상태 — Falling이 Wall에서 멈춘다");
  s.addNotes("Falling이 Decoration은 통과하고 Wall에서 멈추는지 확인시킨다. 안 멈추면 양쪽 Collider부터 본다.");
}

// ================================================================ 11. 035 자가진단
{
  const s = slide();
  head(s, "035", "막혔을 때 확인 순서.", "오늘의 진짜 수업 — 새 문법은 하나도 안 나간다.");

  const steps = [
    ["물체가 화면 안에 있나", "Hierarchy 클릭 → F"],
    ["Inspector 값이 이상하지 않나", "Scale 0 / Rotation X·Y / Position Z"],
    ["부품이 다 붙어 있나", "안 보이면 Sprite Renderer, 안 부딪히면 Collider"],
    ["체크박스가 켜져 있나", "오브젝트와 컴포넌트 둘 다"],
    ["Console에 빨간 줄이 있나", "있으면 더블클릭"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let sy = 2.42;
  steps.forEach((st, i) => {
    s.addText(String(i + 1), {
      x: M, y: sy, w: 0.5, h: 0.46,
      fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(st[0], {
      x: M + 0.55, y: sy, w: 5.2, h: 0.46,
      fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true,
    });
    s.addText(st[1], {
      x: M + 6.0, y: sy, w: CW - 6.0, h: 0.46,
      fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true,
    });
    rule(s, M, sy + 0.64, CW);
    sy += 0.84;
  });

  s.addText("이 다섯 개로 열 번 중 아홉 번은 해결된다.", {
    x: M, y: 6.45, w: 9, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true,
  });
  s.addNotes("이 표를 채팅에 고정하거나 공지에 박아둔다. 다음 주부터 여기에 항목이 더 붙는다.");
}

// ================================================================ 12. 035 실습
{
  const s = slide();
  head(s, "035", "실습 — 내 놀이터 만들기.", "7주차에 배운 것만으로 장면을 구성한다.");
  shot(s, "035_Playground", M, 2.15, 7.25, 4.1, "완성 예시 — Play 중");

  const req = [
    "바닥 (Collider 있음, Rigidbody 없음)",
    "떨어지는 물체 3개 이상",
    "부모자식 구조 최소 한 곳",
    "회전된 물체 하나",
    "뒤집힌 물체 하나",
    "이름 정리, 좌표는 정수로",
  ];
  const qx = 8.55, qw = W - M - 8.55;
  s.addText("요구 조건", {
    x: qx, y: 2.15, w: qw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true,
  });
  rule(s, qx, 2.6, qw, HAIRLINE);
  let qy = 2.8;
  req.forEach((r) => {
    s.addText(r, {
      x: qx, y: qy, w: qw, h: 0.4,
      fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true,
    });
    rule(s, qx, qy + 0.52, qw);
    qy += 0.64;
  });
  s.addNotes("오늘은 전원이 30초씩 데모한다. 잘 만든 걸 보여주는 자리가 아니라 여기까지 왔다는 걸 확인하는 자리다. 못 만든 학생에게는 Snapshot_P2_Week07.zip 을 배포한다.");
}

// ================================================================ 13. 흔한 사고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "미리 알고 있으면 대응이 빨라진다. 강사용.");

  const acc = [
    ["물체가 안 보여요", "화면 밖 또는 카메라 밖", "클릭하고 F", false],
    ["창을 닫아버림", "탭을 실수로 드래그", "Window → Layouts → Default", false],
    ["3D Rigidbody를 넣음", "검색 결과 첫 줄을 고름", "2D가 붙은 것을 고른다", false],
    ["자식으로 넣으니 위치가 튐", "좌표가 부모 기준으로 바뀜", "부모에서부터 센다", false],
    ["프로젝트 경로가 한글", "사용자 이름이 한글", "지금 다시 만든다", true],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let ay = 2.4;
  acc.forEach((a, i) => {
    if (a[3]) soft(s, M - 0.28, ay - 0.1, CW + 0.56, 0.7, R_SM);
    s.addText(a[0], { x: M, y: ay, w: 4.1, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.3, y: ay, w: 3.5, h: 0.46, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.0, y: ay, w: 3.4, h: 0.46, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    // 마지막(강조) 행은 tint 가 경계를 만드니 구분선을 그리지 않는다
    if (i < acc.length - 1) rule(s, M, ay + 0.62, CW);
    ay += 0.8;
  });

  // 덱 전체에서 accent 를 쓰는 유일한 자리
  const bw = 4.55, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 6.62, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 },
  });
  s.addText("경로 문제는 21주차 빌드에서 터진다", {
    x: M, y: 6.62, w: bw, h: bh, align: "center", valign: "middle",
    fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true,
  });
  s.addText("그때 고치면 프로젝트를 다시 만들어야 한다. 031회차에 못을 박는다.", {
    x: M + bw + 0.35, y: 6.62, w: 6.5, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true,
  });
  s.addNotes("경로 한글은 이번 주에 잡지 않으면 21주차 빌드에서 프로젝트를 다시 만들어야 한다. 031회차에 못을 박는다.");
}

// ================================================================ 14. 체크리스트 + 예고
{
  const s = slide();
  head(s, null, "7주차 체크리스트.", "전원이 통과해야 8주차로 넘어간다.");

  const chk = [
    "6개 창의 이름과 역할을 말한다",
    "클릭하고 F로 물체를 찾는다",
    "Inspector에서 Position을 바꾼다",
    "X 양수는 오른쪽, Y 양수는 위",
    "2D는 Rotation Z만 쓴다",
    "Scale 음수는 뒤집기",
    "월드 좌표와 로컬 좌표를 구분한다",
    "Component를 추가하고 제거한다",
    "Transform은 지울 수 없다",
    "막혔을 때 5단계를 돌린다",
  ];
  chk.forEach((c, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const bx = M + col * 5.95;
    const by = 2.2 + row * 0.55;
    s.addShape(pres.ShapeType.roundRect, {
      x: bx, y: by + 0.08, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: HAIRLINE, width: 1 },
    });
    s.addText(c, {
      x: bx + 0.42, y: by, w: 5.2, h: 0.38,
      fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true,
    });
  });

  // 폴라리티 반전 푸터 — 페이지의 끝을 막는 baseboard
  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주", {
    x: M, y: 5.82, w: 4, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true,
  });
  s.addText("이제 코드가 대신 값을 바꾼다.", {
    x: M, y: 6.22, w: 7.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true,
  });
  s.addText("036 – 040회차", {
    x: 8.6, y: 5.98, w: 4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true,
  });
  s.addText("6주 동안 배운 클래스와 메서드가 드디어 나온다.", {
    x: 8.6, y: 6.34, w: 4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true,
  });
  s.addNotes("'언제 코딩해요?'라는 조급함이 반드시 나온다. 날짜를 명확히 말해준다.");
}

const out = path.join(__dirname, "7주차-유니티입문.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
