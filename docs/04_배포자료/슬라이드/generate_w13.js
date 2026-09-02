// 13주차 세 번째, 그리고 본편 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 4 마무리. 미니게임 ③ 이 본 프로젝트의 축소판이라는 게 이 덱의 주장이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 4장의 yield return null

// ---------------------------------------------------------------- type
const F_SEMI = "Pretendard SemiBold", F_MED = "Pretendard Medium";
const F_REG = "Pretendard", F_LIGHT = "Pretendard Light";
const F_CODE = "Consolas";

const T = { display: 46, h2: 26, h3: 19, h4: 15.5, title: 14, bodyLg: 15, body: 12, bodySm: 11, label: 9.5, caption: 9.5, code: 11.5 };

const R_SM = 0.167, R_MD = 0.25;
const pill = (h) => h / 2;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WaveBreaker 강의";
pres.title = "13주차 · 세 번째, 그리고 본편";

const W = 13.333, H = 7.5, M = 0.83, CW = W - M * 2;

// 줄 수로 코드 박스 높이를 구한다. 눈대중으로 넣다가 12주차까지 계속 잘렸다.
const codeH = (n) => n * 0.225 + 0.62;
// 표가 끝나는 y. 다음 요소는 여기에 여백을 더해 놓는다.
const tableEnd = (y, rows, rowH) => y + 0.62 + rows * rowH;

// ---------------------------------------------------------------- helpers
function slide() { const s = pres.addSlide(); s.background = { color: CANVAS }; return s; }

function soft(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS_SOFT }, line: { width: 0 } });
}
function inverse(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: INK }, line: { width: 0 } });
}
function softPill(s, x, y, w, h, text) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: pill(h),
    fill: { color: CANVAS_SOFT }, line: { width: 0 } });
  s.addText(text, { x, y, w, h, align: "center", valign: "middle",
    fontFace: F_SEMI, fontSize: T.label, color: INK, margin: 0, isTextBox: true });
}
function rule(s, x, y, w, color) {
  s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color: color || HAIRLINE_S, width: 1 } });
}
function head(s, num, title, sub) {
  if (num) softPill(s, M, 0.6, 0.64, 0.3, num);
  s.addText(title, { x: M, y: num ? 1.0 : 0.62, w: CW, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: INK, valign: "middle", margin: 0, isTextBox: true });
  if (sub) s.addText(sub, { x: M, y: num ? 1.54 : 1.16, w: CW, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
}

function code(s, x, y, w, lines, dark) {
  const h = codeH(lines.length);
  if (dark) inverse(s, x, y, w, h, R_SM); else soft(s, x, y, w, h, R_SM);
  const runs = lines.map((L, i) => {
    const txt = typeof L === "string" ? L : L[0];
    const kind = typeof L === "string" ? "" : L[1];
    let col = dark ? CANVAS : INK;
    let bold = false;
    if (kind === "c") col = dark ? FAINT : MUTED;
    if (kind === "b") { bold = true; col = dark ? CANVAS : INK; }
    return { text: txt === "" ? " " : txt,
      options: { fontFace: F_CODE, fontSize: T.code, color: col, bold: bold,
        breakLine: i !== lines.length - 1 } };
  });
  s.addText(runs, { x: x + 0.28, y: y + 0.22, w: w - 0.56, h: h - 0.44,
    lineSpacingMultiple: 1.32, margin: 0, isTextBox: true, valign: "top" });
  return y + h;
}

function shot(s, name, x, y, w, h, caption) {
  soft(s, x, y, w, h + 0.52);
  const pad = 0.22;
  s.addImage({ path: img(name), x: x + pad, y: y + pad, w: w - pad * 2, h: h - pad * 2 });
  if (caption) s.addText(caption, { x: x + pad, y: y + h - 0.14, w: w - pad * 2, h: 0.34,
    fontFace: F_REG, fontSize: T.caption, color: FAINT, align: "center", valign: "middle",
    margin: 0, isTextBox: true });
  return y + h + 0.52;
}

function table(s, x, y, w, cols, rows, headRule, rowH) {
  const RH = rowH || 0.64;
  let cx = x;
  cols.forEach((c) => {
    s.addText(c[0], { x: cx, y: y, w: c[1], h: 0.3, fontFace: F_SEMI, fontSize: T.label,
      color: MUTED, margin: 0, isTextBox: true });
    cx += c[1];
  });
  rule(s, x, y + 0.44, w, headRule || HAIRLINE);
  let ry = y + 0.62;
  rows.forEach((r) => {
    let rx = x;
    r.forEach((cell, i) => {
      const mono = cols[i][2] === "code";
      const strong = cols[i][2] === "strong";
      s.addText(cell, { x: rx, y: ry, w: cols[i][1], h: 0.4,
        fontFace: mono ? F_CODE : (strong ? F_SEMI : F_REG),
        fontSize: strong ? T.h4 : T.body,
        color: cols[i][3] || INK, valign: "middle", margin: 0, isTextBox: true });
      rx += cols[i][1];
    });
    rule(s, x, ry + RH - 0.12, w);
    ry += RH;
  });
  return ry;
}

function h3(s, x, y, w, text) {
  s.addText(text, { x, y, w, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  return y + 0.5;
}
function body(s, x, y, w, text, h) {
  s.addText(text, { x, y, w, h: h || 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  return y + (h || 0.9);
}

// ================================================================ 1. 타이틀
{
  const s = slide();
  s.addText("13주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("세 번째, 그리고 본편.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("미니게임 ③ 은 연습이 아니다. 7개월짜리 게임의 축소판이다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("061_Breakout_Hud"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("065_Survival"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("061 – 065회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 4 마무리 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("진도가 밀리면 ①②를 잘라서라도 ③은 완주시킨다. 14주차 본 프로젝트가 여기서 그대로 이어진다. 3개 시키려다 0개가 되는 게 최악이다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "②를 끝내고, ③을 만들고, 셋 다 시연한다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["061", "벽돌깨기 — 목숨과 점수", "Invoke · nameof · 상태 표시 세 번째"],
    ["062", "벽돌깨기 — 개조와 시연", "강사는 가르치지 않고 순회만 한다"],
    ["063", "생존 슈팅 — 쫓아오는 적", "FindWithTag · 방향은 빼기로"],
    ["064", "생존 슈팅 — 자동 발사와 웨이브", "최솟값 찾기 · transform.up"],
    ["065", "3종 시연 + Phase 4 마무리", "세 번째 매니저는 학생이 채운다"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  let yy = h3(s, M, 6.85, CW, "새로 배우는 문법은 다섯 개뿐이다.");
  s.addNotes("Invoke, nameof, yield break, FindWithTag, transform.up 대입. 나머지는 전부 배운 것의 새 쓰임이다.");
}

// ================================================================ 3. 061 상태 표시
{
  const s = slide();
  head(s, "061", "상태를 표시로 남긴다 — 세 번째.", "패턴이 보이면 그건 이제 도구다.");

  const e1 = table(s, M, 2.15, CW, [
    ["회차", 1.8, "code", MUTED], ["표시", 3.2, "code", INK], ["막는 것", 6.67, "strong", INK],
  ], [
    ["057", "isGameOver", "게임오버가 매 프레임 불리는 것"],
    ["060", "isOver", "클리어와 게임오버가 겹치는 것"],
    ["061", "isRespawning", "목숨이 한 번에 다 깎이는 것"],
  ], null, 0.68);

  const c1 = code(s, M, e1 + 0.35, 7.0, [
    "if (isRespawning) return;            // 이 줄이 없으면",
    "",
    "if (ball == null)",
    "{",
    ["    lives--;                         // 매 프레임 깎인다", "b"],
    "}",
  ]);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, e1 + 0.35, rw, 2.0);
  s.addText("공이 없는 동안 Update 는 계속 돈다.", {
    x: rx + 0.4, y: e1 + 0.65, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("1초 뒤에 다시 만들 거라고 예약해 놓고, 그 동안 이 블록을 건너뛰게 막아야 한다.", {
    x: rx + 0.4, y: e1 + 1.55, w: rw - 0.8, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addNotes("이 Phase 에서 세 번째로 나오는 패턴이다. 여기서 못을 박으면 본 프로젝트에서 학생이 스스로 쓴다.");
}

// ================================================================ 4. 061 yield return null
{
  const s = slide();
  head(s, "061", "051에서 배운 그 줄이, 없으면 값이 틀린다.", "yield return null 이 실제로 필요한 첫 자리다.");

  const c1 = code(s, M, 2.15, 7.0, [
    ["yield return null;                   // 한 프레임 기다린다", "b"],
    "",
    ["lastBrickCount = FindGameObjectsWithTag(\"Brick\").Length;", "b"],
    "",
    "while (true) { ... }",
  ]);

  let y = h3(s, M, c1 + 0.35, 7.2, "왜 한 프레임을 기다리나.");
  y = body(s, M, y, 7.2,
    "Start 실행 순서는 유니티가 정한다. 이 시점에는 BrickSpawner.Start 가 아직 안 돌았을 수 있어 블록이 0개로 세어진다. 한 프레임 뒤면 그 프레임의 Start 가 전부 끝나 있다.", 1.0);

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 061_Lives_Done", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  const e2 = table(s, rx, 2.55, rw, [["", 2.0, "", INK], ["블록 : 점수", 2.2, "strong", INK]], [
    ["수정 전", "11개 : 100점"],
    ["수정 후", "1개 : 10점"],
  ], null, 0.62);
  s.addText("0.5초를 기다렸다 세면 그 사이에 깨진 블록이 점수에 안 잡힌다.", {
    x: rx, y: e2 + 0.3, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const bw = 4.0, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.75, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("051에서는 \"이런 것도 있다\" 였다", { x: M, y: 6.75, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("배운 게 나중에 쓰이는 자리를 보여주는 것 — 이 커리큘럼이 계속 하는 일이다.", {
    x: M + bw + 0.35, y: 6.75, w: 7.0, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });
  s.addNotes("이건 실제로 구현하다 발견해서 고친 버그다. 학생에게 '만들다 보면 이런 게 나온다' 를 보여주는 자리로 쓴다.");
}

// ================================================================ 5. 061 Invoke
{
  const s = slide();
  head(s, "061", "한 줄이면 되는 일에 코루틴은 과하다.", "Invoke 는 코루틴의 간단한 버전이다.");

  const c1 = code(s, M, 2.15, 6.4, [
    ["Invoke(nameof(RespawnBall), 1f);", "b"],
    "",
    ["// 코루틴으로 해도 된다 — 세 줄이 더 든다", "c"],
    ["// yield return new WaitForSeconds(1f); RespawnBall();", "c"],
  ]);

  const e1 = table(s, M, c1 + 0.35, 6.4, [["조각", 2.8, "code", INK], ["뜻", 3.6, "", MUTED]], [
    ["Invoke(메서드, 초)", "몇 초 뒤에 부른다"],
    ["nameof(...)", "이름을 문자열로 바꿔준다"],
    ["CancelInvoke()", "예약을 취소한다"],
  ], null, 0.6);

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 2.15, rw, 2.2);
  s.addText("왜 nameof 인가.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.02, rw - 0.8, INK_SOFT);
  s.addText("Invoke 는 원래 문자열을 받는다. 문자열은 오타를 못 잡는다. nameof 를 쓰면 이름이 틀릴 때 컴파일 에러가 난다.", {
    x: rx + 0.4, y: 3.2, w: rw - 0.8, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  let y = h3(s, rx, 4.7, rw, "049의 CompareTag 와 같은 판단.");
  body(s, rx, y, rw, "틀렸을 때 알려주는 쪽을 고른다. 이 기준이 계속 나온다.", 0.9);

  s.addText("게임오버 때 CancelInvoke() 를 안 하면 끝난 뒤에도 공이 생긴다.", {
    x: M, y: e1 + 0.35, w: 7.0, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Invoke 와 코루틴 중 뭘 쓸지는 취향이 아니라 크기의 문제다. 한 번 기다리면 Invoke, 반복하거나 중간에 여러 번 쉬면 코루틴.");
}

// ================================================================ 6. 062 개조 예시
{
  const s = slide();
  head(s, "062", "개조 예시 7개.", "두 번째 개조다. 예시 밖으로 나가는 학생이 오늘의 목표.");

  table(s, M, 2.15, CW, [
    ["개조", 5.2, "strong", INK], ["난이도", 1.5, "", MUTED], ["어디를 만지나", 4.97, "", MUTED],
  ], [
    ["블록 모양을 바꾼다 (삼각형·구멍)", "쉬움", "BrickSpawner 의 if 하나 (058)"],
    ["패들 크기를 바꾼다", "쉬움", "Scale + limitX"],
    ["공이 점점 빨라진다", "쉬움", "블록 깰 때 speed 증가 (059)"],
    ["패들 위치로 반사 각도가 바뀐다", "보통", "충돌 지점 계산 (060)"],
    ["튼튼한 블록 — 두 번 맞아야 깨짐", "보통", "Health 의 maxHealth + 색 (049·050)"],
    ["아이템이 떨어진다", "어려움", "블록 사망 시 Instantiate + Trigger"],
    ["스테이지 2", "어려움", "클리어 시 다시 깔기 (060)"],
  ], null, 0.55);

  s.addText("1번이나 2번이면 오늘 통과다. 무리하지 않게 한다.", {
    x: M, y: 6.75, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addNotes("아무것도 못 정하는 학생에게는 강사가 골라준다. 너무 크게 잡는 학생에게는 그 자리에서 범위를 잘라준다. 망설이게 두면 50분을 헤맨다.");
}

// ================================================================ 7. 062 되묻기
{
  const s = slide();
  head(s, "062", "답을 주지 않고 되묻는다.", "오늘 강사는 가르치지 않고 순회만 한다.");

  table(s, M, 2.15, CW, [
    ["학생이 물으면", 5.2, "strong", INK], ["이렇게 되묻는다", 6.47, "", MUTED],
  ], [
    ["블록을 삼각형으로 어떻게 해요?", "058에서 col 이 뭐였죠? row 로 제한하면요?"],
    ["아이템을 어떻게 떨어뜨려요?", "떨어지는 물건, 055에서 만들었죠. 뭐였어요?"],
    ["패들을 어떻게 키워요?", "049에서 남의 부품을 만졌잖아요. 크기는 어디 있죠?"],
    ["에러가 나요", "뭐라고 적혀 있어요? 읽어주세요"],
  ], null, 0.68);

  inverse(s, M, 5.4, CW, 1.5);
  s.addText("마지막 줄이 제일 중요하다.", {
    x: M + 0.4, y: 5.68, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("에러를 소리 내어 읽게 하는 것 — 이게 Phase 4 의 숨은 목표다. 대부분 답이 그 안에 있다.", {
    x: M + 0.4, y: 6.2, w: 11.3, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("15분짜리 최소 코스도 준비해 둔다 — rows·columns 를 바꾸고, 공 속도를 올리고, 패들을 줄인다. 숫자 세 개로도 난이도를 바꿨으면 그것도 개조다.");
}

// ================================================================ 8. 063 축소판
{
  const s = slide();
  head(s, "063", "이게 여러분이 만들 게임이다.", "첫 5분에 기획서를 띄운다. 이 회차부터가 Phase 4 의 핵심이다.");

  table(s, M, 2.15, CW, [
    ["", 3.4, "", INK], ["미니게임 ③ (063–065)", 4.2, "", MUTED], ["본 프로젝트 (066–130)", 4.07, "strong", INK],
  ], [
    ["적이 쫓아온다", "있다", "같다"],
    ["자동 발사", "있다", "같다"],
    ["오래 버티기", "웨이브", "웨이브 + 보스"],
    ["적 종류", "1종", "3종 + 보스"],
    ["강화", "없음", "업그레이드 8종"],
    ["인원", "혼자", "2인 협동"],
  ], null, 0.56);

  s.addText("뼈대는 똑같다. 3주 동안 만드는 게 7개월짜리 게임의 씨앗이다.", {
    x: M, y: 6.05, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("14주차 첫 시간에 이 씬을 다시 연다. \"③번 기억나죠? 그걸 제대로 만듭니다\" 로 시작한다.", {
    x: M, y: 6.6, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("1회차 오리엔테이션에서 보여준 완성작 시연 화면을 다시 띄운다. 학생이 3개월 만에 그 게임의 축소판을 만든다는 걸 느끼는 자리다.");
}

// ================================================================ 9. 063 FindWithTag
{
  const s = slide();
  head(s, "063", "스폰된 적은 나를 모른다.", "042에서는 Inspector 에 끌어다 넣었다. 그런데 적은 게임 중에 생긴다.");

  const c1 = code(s, M, 2.15, 7.0, [
    "void Start()",
    "{",
    ["    GameObject player = GameObject.FindWithTag(\"Player\");", "b"],
    "",
    "    if (player != null) target = player.transform;",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.35, 7.0, [["조각", 3.0, "code", INK], ["어디서 배웠나", 4.0, "", MUTED]], [
    ["FindWithTag", "044의 Tag — 골라내는 대신 찾는다"],
    ["if (player != null)", "049 — 못 찾을 수도 있다"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("Start 에서 한 번만 찾는다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.02, rw - 0.8, INK_SOFT);
  s.addText("Update 에서 매 프레임 찾으면 적 200마리일 때 게임이 멈춘다. 049에서 GetComponent 를 Awake 에 넣은 것과 같은 이유다.", {
    x: rx + 0.4, y: 3.2, w: rw - 0.8, h: 1.1, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  let y = h3(s, rx, 4.8, rw, "무거운 함수 이야기, 세 번째.");
  body(s, rx, y, rw, "060 클리어 판정, 063 적 찾기, 064 조준. 전부 같은 규칙이다 — 자주 부르지 않는다.", 1.0);

  s.addText("플레이어가 죽으면 target 이 null 이 된다. 057의 그 상황이다.", {
    x: M, y: e1 + 0.35, w: 7.0, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Tag 를 두 가지로 쓴다는 게 오늘의 포인트다. 044에서는 부딪힌 상대를 골라냈고, 오늘은 씬에서 찾는다.");
}

// ================================================================ 10. 063 방향은 빼기
{
  const s = slide();
  head(s, "063", "방향은 빼기로 만든다.", "좌표끼리 빼면 방향이 나온다. 오늘 제일 중요한 문장이다.");

  const c1 = code(s, M, 2.15, 7.4, [
    ["Vector2 dir = ((Vector2)target.position - rb.position).normalized;", "b"],
    "",
    ["rb.linearVelocity = dir * moveSpeed;", "b"],
  ]);

  const e1 = table(s, M, c1 + 0.35, 7.4, [["조각", 3.6, "code", INK], ["뜻", 3.8, "", MUTED]], [
    ["목표 - 나", "나에서 목표로 가는 화살표"],
    [".normalized", "그 방향만 (059)"],
    ["* moveSpeed", "그 방향으로 그 속도"],
  ], null, 0.6);

  s.addText("순서를 바꾸면 도망간다. 헷갈리면 한 번 뒤집어 본다.", {
    x: M, y: e1 + 0.35, w: 7.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  const rx = 8.65, rw = W - M - 8.65;
  s.addText("앞으로 계속 나온다", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 2.55, rw, [["쓰는 곳", 1.8, "", INK], ["회차", 2.0, "code", MUTED]], [
    ["적이 쫓아오기", "063"],
    ["총알이 적을 향해", "064"],
    ["카메라 따라가기", "Phase 5"],
    ["아이템이 끌려오기", "Phase 6"],
  ], null, 0.58);
  s.addNotes("일부러 순서를 뒤집어 도망가게 해본다. 그 그림을 다 같이 보면 뺄셈 순서가 굳는다.");
}

// ================================================================ 11. 064 최솟값 찾기
{
  const s = slide();
  head(s, "064", "4주차 최솟값 찾기 그대로다.", "비교하는 게 숫자가 아니라 거리라는 것만 다르다.");

  code(s, M, 2.15, 5.9, [
    ["// 4주차 · 콘솔", "c"],
    "int min = scores[0];",
    "",
    "for (int i = 1; i < n; i++)",
    "    if (scores[i] < min)",
    ["        min = scores[i];", "b"],
  ]);
  code(s, 7.05, 2.15, W - M - 7.05, [
    ["// 064회차 · 유니티", "c"],
    "float minDistance = float.MaxValue;",
    "",
    "foreach (GameObject e in enemies)",
    "    if (d < minDistance)",
    ["    { minDistance = d; nearest = e.transform; }", "b"],
  ]);

  const e1 = table(s, M, 4.15, CW, [
    ["콘솔 (4주차)", 4.0, "code", MUTED], ["유니티 (오늘)", 4.2, "code", INK], ["", 3.47, "", MUTED],
  ], [
    ["int min", "float minDistance", "비교할 값"],
    ["scores[i]", "Vector2.Distance(나, 적)", "거리로 바뀌었다"],
    ["값만 기록", "누구였는지도 기록", "nearest 가 추가됐다"],
  ], null, 0.58);

  s.addText("float.MaxValue 로 시작하는 이유 — 첫 적이 무조건 이기게 하려고.", {
    x: M, y: e1 + 0.3, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("도전 미션: Vector2.Distance 자리에 체력을 넣으면 '체력이 가장 낮은 적' 을 노린다. 비교 기준만 바꾸면 되는 구조라는 걸 깨닫는 학생이 나온다.");
}

// ================================================================ 12. 064 transform.up
{
  const s = slide();
  head(s, "064", "방향 벡터를 그냥 대입한다.", "Quaternion 계산 없이 유니티가 회전을 만들어 준다.");

  const c1 = code(s, M, 2.15, 7.2, [
    "Transform target = FindNearestEnemy();",
    "",
    ["if (target == null) continue;        // 적이 없으면 이번 바퀴는 건너뛴다", "b"],
    "",
    "GameObject bullet =",
    "    Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);",
    "",
    ["bullet.transform.up = dir;           // 047의 Bullet 은 up 방향으로 날아간다", "b"],
  ]);

  let y = h3(s, M, c1 + 0.35, 7.2, "총알은 047~050에서 만든 그 Bullet 이다.");
  body(s, M, y, 7.4, "055에서는 targetTag 를 Player 로 바꿔 낙하물로 썼다. 오늘은 다시 총알로 쓴다 — 한 스크립트를 세 번째 쓰는 것이다.", 1.0);

  const rx = 8.45, rw = W - M - 8.45;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("만들고 → 돌린다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.02, rw - 0.8, INK_SOFT);
  s.addText("Instantiate 할 때 회전을 넣어도 되지만, 두 줄로 나누는 쪽이 읽기 쉽다.", {
    x: rx + 0.4, y: 3.2, w: rw - 0.8, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  let y2 = h3(s, rx, 4.8, rw, "이 회차 사고 1등");
  body(s, rx, y2, rw, "transform.up 대입을 빼먹으면 총알이 전부 위로만 간다.", 0.9);
  s.addNotes("continue 는 3주차 반복문에서 배웠다. 적이 없을 때 그냥 건너뛰는 게 자연스럽다.");
}

// ================================================================ 13. 064 웨이브
{
  const s = slide();
  head(s, "064", "시간이 지나면 어려워진다.", "이게 웨이브다. Phase 6 웨이브 매니저의 원형이다.");

  const c1 = code(s, M, 2.15, 7.0, [
    ["public void SpeedUp(float step, float min)", "b"],
    "{",
    ["    spawnInterval = Mathf.Max(spawnInterval - step, min);", "b"],
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.35, 7.0, [
    ["시간", 1.6, "code", MUTED], ["웨이브", 1.6, "strong", INK], ["스폰 간격", 3.8, "code", INK],
  ], [
    ["0초", "1", "2.00초"],
    ["10초", "2", "1.85초"],
    ["60초", "7", "1.10초"],
    ["120초", "13", "0.25초 (하한)"],
  ], null, 0.56);

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 065_Survival_Done", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  const e2 = table(s, rx, 2.55, rw, [["t = 14.89초", 2.0, "code", INK], ["", 2.2, "strong", INK]], [
    ["HUD", "웨이브 2"],
    ["spawnInterval", "1.85"],
  ], null, 0.62);
  s.addText("2.00 − 0.15 = 1.85. 공식대로 나온다.", {
    x: rx, y: e2 + 0.3, w: rw, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });

  s.addText("Mathf.Max 로 하한을 두지 않으면 간격이 0이 되어 게임이 터진다 — 050의 Clamp 와 같은 이야기다.", {
    x: M, y: e1 + 0.3, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("SpeedUp 이 public 인 이유: 매니저가 스포너를 밖에서 부른다. 050의 TakeDamage 와 같은 판단이다.");
}

// ================================================================ 14. 065 세 번째 매니저
{
  const s = slide();
  head(s, "065", "세 번째 매니저는 학생이 채운다.", "표를 비워두고 물어본다. 세 번째라 대부분 스스로 채운다.");

  table(s, M, 2.15, CW, [
    ["", 2.0, "strong", INK], ["무엇", 3.6, "", MUTED],
    ["057 피하기", 3.0, "code", MUTED], ["065 생존 슈팅", 3.07, "code", INK],
  ], [
    ["시작", "씬을 연다", "(자동)", "(자동)"],
    ["진행", "점수가 쌓인다", "Time.deltaTime", "같다"],
    ["끝", "조건이 되면 멈춘다", "player == null", "같다"],
    ["다시", "처음으로 돌아간다", "LoadScene", "같다"],
  ], null, 0.62);

  s.addText("이걸 학생이 채우는 게 오늘의 확인 시험이다.", {
    x: M, y: 5.15, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  inverse(s, M, 5.75, CW, 1.35);
  s.addText("결과에 숫자를 보여주면 다시 하고 싶어진다.", {
    x: M + 0.4, y: 6.0, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("\"26초 버텼습니다 / 웨이브 3 도달\" — 기술이 아니라 판단이다. 게임 디자인의 첫 경험.", {
    x: M + 0.4, y: 6.5, w: 11.3, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("못 채우는 학생이 있으면 057·060 매니저를 옆에 띄워준다. 세 번 같은 구조를 봤으면 본 프로젝트에서 스스로 만든다.");
}

// ================================================================ 15. 흔한 사고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "절반이 \"한 번만\" 을 안 막은 것이다. 강사용.");

  rule(s, M, 2.2, CW, HAIRLINE);
  const acc = [
    ["목숨이 한 번에 0이 됨", "isRespawning 없음", "매 프레임 깎인다"],
    ["게임오버 후에도 공이 생김", "CancelInvoke 없음", "Finish 에서 취소"],
    ["첫 블록이 점수에 안 잡힘", "yield return null 없음", "한 프레임 기다린다"],
    ["적이 반대로 도망감", "뺄셈 순서가 반대", "목표 − 나"],
    ["적이 점점 빨라짐", ".normalized 빠짐", "거리에 비례해진다"],
    ["총알이 위로만 감", "transform.up 대입 안 함", "Instantiate 뒤에"],
    ["플레이어가 순식간에 죽음", "적이 안 사라짐", "Destroy(gameObject)"],
  ];
  let ay = 2.45;
  acc.forEach((a, i) => {
    s.addText(a[0], { x: M, y: ay, w: 4.6, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.8, y: ay, w: 3.6, h: 0.44, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.5, y: ay, w: 3.2, h: 0.44, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    if (i < acc.length - 1) rule(s, M, ay + 0.54, CW);
    ay += 0.62;
  });

  s.addText("\"이제 좀 알겠다\" 는 발언이 나오면 이 Phase 는 성공이다.", {
    x: M, y: 6.95, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addNotes("3개 중 하나가 미완성이면 ③번만이라도 완주시킨다. 3개 다 미완성이면 스냅샷을 배포하고 ③번에 집중한다.");
}

// ================================================================ 16. Phase 4 종료 + 예고
{
  const s = slide();
  head(s, null, "Phase 4 종료 조건.", "기술이 아니라 경험이다. 세 번 끝내봤으면 성공.");

  const chk = [
    "게임이 시작부터 게임오버/클리어까지 돈다 (3개 전부)",
    "각 게임을 자기 방식으로 하나 이상 개조했다",
    "시연 영상을 올렸다",
  ];
  chk.forEach((c, i) => {
    const by = 2.3 + i * 0.55;
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by + 0.06, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: i === 0 ? INK : HAIRLINE, width: i === 0 ? 1.5 : 1 } });
    s.addText(c, { x: M + 0.42, y: by, w: 6.4, h: 0.4,
      fontFace: i === 0 ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["스냅샷", 1.9, "code", INK], ["회차", 1.2, "code", MUTED], ["내용", 1.85, "", MUTED]], [
    ["Snapshot_P4_1", "057", "피하기"],
    ["Snapshot_P4_2", "062", "벽돌깨기"],
    ["Snapshot_P4_3", "065", "생존 슈팅"],
  ], null, 0.6);

  s.addText("3개월 전에는 콘솔에 글자만 찍었다. 지금 게임 세 개를 만들었다.", {
    x: M, y: 4.35, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주부터 Phase 5", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("웨이브 브레이커 — 65회차, 5개월.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("066 – 130회차", { x: 9.2, y: 5.98, w: 3.4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("③번 씬을 다시 열고 거기서 시작한다.", { x: 9.2, y: 6.34, w: 3.4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("마지막 한마디: 3개월 전에는 콘솔에 글자만 찍었습니다. 앞으로 5개월이면 뭘 만들 수 있을지 생각해보세요.");
}

const out = path.join(__dirname, "13주차-세번째그리고본편.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
