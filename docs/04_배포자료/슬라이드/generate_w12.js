// 12주차 끝내는 연습 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 4 첫 주. 새 기술이 아니라 조립이라 코드 비교와 "어디서 배웠나" 표가 중심이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 6장의 Build Settings 에러

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
pres.title = "12주차 · 끝내는 연습";

const W = 13.333, H = 7.5, M = 0.83, CW = W - M * 2;

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

function code(s, x, y, w, h, lines, dark) {
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
}

function shot(s, name, x, y, w, h, caption) {
  soft(s, x, y, w, h + 0.52);
  const pad = 0.22;
  s.addImage({ path: img(name), x: x + pad, y: y + pad, w: w - pad * 2, h: h - pad * 2 });
  if (caption) s.addText(caption, { x: x + pad, y: y + h - 0.14, w: w - pad * 2, h: 0.34,
    fontFace: F_REG, fontSize: T.caption, color: FAINT, align: "center", valign: "middle",
    margin: 0, isTextBox: true });
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

// ================================================================ 1. 타이틀
{
  const s = slide();
  s.addText("12주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("끝내는 연습.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("만드는 것과 끝내는 것은 다르다. 본 프로젝트 전에 그걸 세 번 겪는다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("057_Dodge_Score"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("060_Breakout"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("056 – 060회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 4 착수 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("Phase 4 는 새 기술을 배우는 구간이 아니다. Phase 0~3 을 조립해 완결시키는 구간이다. 학생이 '이제 좀 알겠다' 고 말하면 이 Phase 의 목적은 달성이다.");
}

// ================================================================ 2. Phase 4 + 흐름
{
  const s = slide();
  head(s, null, "지금까지는 씬을 만들었다.", "시작도 끝도 없었다. 앞으로 2주 동안 작은 게임 세 개를 끝까지 만든다.");

  table(s, M, 2.15, CW, [
    ["미니게임", 3.4, "strong", INK], ["회차", 2.0, "code", MUTED], ["새로 배우는 것", 6.27, "", MUTED],
  ], [
    ["① 피하기", "055 – 057", "점수 · 게임오버"],
    ["② 벽돌깨기", "058 – 062", "배열 배치 · 반사 · 클리어"],
    ["③ 생존 슈팅", "063 – 065", "웨이브 — 본 프로젝트의 축소판"],
  ], null, 0.66);

  rule(s, M, 4.55, CW, HAIRLINE);
  const items = [
    ["056", "점수를 화면에", "Canvas · TextMeshPro"],
    ["057", "게임오버 · 재시작 · 개조", "timeScale · LoadScene"],
    ["058", "블록을 배열로 깐다", "2중 for · Color[]"],
    ["059", "튀는 공", "Physics Material 2D · .normalized"],
    ["060", "패들 · 클리어", "Mathf.Clamp · 같은 뼈대"],
  ];
  let y = 4.75;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.4, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 4.4, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 5.55, y, w: CW - 5.55, h: 0.4, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.54, CW);
    y += 0.44;
  });
  s.addNotes("진도가 밀리면 ②번 벽돌깨기를 잘라 5회차를 회수한다. 3개 중 하나만 남긴다면 ③번 생존 슈팅이다. 3개 시키려다 0개가 되는 게 최악이다.");
}

// ================================================================ 3. 056 Canvas
{
  const s = slide();
  head(s, "056", "UI 는 Canvas 안에 있어야 보인다.", "오늘 만드는 건 글자 한 줄이다. 레이아웃은 19주차.");

  table(s, M, 2.15, 7.3, [
    ["같이 생기는 것", 2.8, "code", INK], ["뭔가", 4.5, "", MUTED],
  ], [
    ["Canvas", "UI 가 올라가는 판"],
    ["Text (TMP)", "글자. Canvas 의 자식이어야 한다"],
    ["EventSystem", "버튼 클릭 등을 받는 것 — 오늘은 안 쓴다"],
  ], null, 0.62);

  s.addText("Import TMP Essentials 를 먼저 누른다.", {
    x: M, y: 4.45, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("처음 TMP 오브젝트를 만들면 창이 뜬다. 안 누르면 글자가 깨지거나 안 보인다. 반 전체가 동시에 만나는 창이다.", {
    x: M, y: 4.95, w: 7.3, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  inverse(s, M, 5.95, 7.3, 1.1);
  s.addText("기본 폰트에는 한글이 없다.", {
    x: M + 0.4, y: 6.12, w: 6.5, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("한글 폰트로 TMP 폰트 에셋을 따로 만들어 기본 폰트로 지정해 둬야 한다. 강사 준비물이다.", {
    x: M + 0.4, y: 6.52, w: 6.5, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });

  shot(s, "057_Dodge_Score", 8.55, 2.15, 3.95, 2.3, "왼쪽 위에 글자 한 줄");
  s.addText("이게 있고 없고가 \"게임 같다\" 를 가른다.", {
    x: 8.55, y: 5.05, w: 3.95, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("UI 를 예쁘게 만드느라 시간을 다 쓰는 학생이 나온다. 이 Phase 의 함정이다. '19주차에 제대로 합니다' 를 반복한다.");
}

// ================================================================ 4. 056 점수
{
  const s = slide();
  head(s, "056", "039 의 deltaTime 이 점수가 된다.", "1초 동안 다 더하면 1이다. 그때 배운 그대로다.");

  code(s, M, 2.15, 7.0, 2.8, [
    ["[SerializeField] private TextMeshProUGUI scoreText;", "b"],
    "",
    "score += Time.deltaTime;",
    "int now = Mathf.FloorToInt(score);",
    "",
    ["if (now != shownScore)", "b"],
    "{",
    ["    shownScore = now;", "b"],
    ["    scoreText.text = \"점수 \" + now;", "b"],
    "}",
  ]);

  table(s, M, 5.15, 7.0, [["조각", 3.0, "code", INK], ["어디서 배웠나", 4.0, "", MUTED]], [
    ["score += Time.deltaTime", "039"],
    ["scoreText.text = ...", "049 의 sr.color = ... 와 같다"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("값이 바뀔 때만 갱신한다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.08, rw - 0.8, INK_SOFT);
  s.addText("숫자가 바뀔 때만 글자를 건드리면 1초에 60번이 1번이 된다. 지금은 글자 하나라 괜찮지만 습관을 들인다.", {
    x: rx + 0.4, y: 3.25, w: rw - 0.8, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("Text 가 아니라 TextMeshProUGUI", { x: rx, y: 4.75, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("검색하면 옛날 UI Text 자료가 나온다. 우리는 TMP 를 쓰고 using TMPro; 가 필요하다.", {
    x: rx, y: 5.2, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실측: t=0.99 에 점수 1, t=9.51 에 점수 9. Mathf.FloorToInt 를 빼면 3.847261 처럼 나온다 — 일부러 한 번 보여준다.");
}

// ================================================================ 5. 057 죽음 감지
{
  const s = slide();
  head(s, "057", "죽었는지는 null 로 안다.", "049 에서 배운 것이 여기서는 게임오버 조건이 된다.");

  code(s, M, 2.15, 7.0, 2.1, [
    "void Update()",
    "{",
    ["    if (isGameOver) { /* R 키 재시작 */ return; }", "b"],
    "",
    ["    if (player == null)   // Health 가 Destroy 하면 null 이 된다", "b"],
    "    {",
    "        GameOver();",
    "        return;",
    "    }",
    "}",
  ]);

  s.addText("isGameOver 가 왜 필요한가.", {
    x: M, y: 4.55, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("없으면 GameOver() 가 매 프레임 불린다. 036 의 \"한 번이냐 계속이냐\" 가 또 나온다.", {
    x: M, y: 5.05, w: 7.4, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 8.25, rw = W - M - 8.25;
  table(s, rx, 2.15, rw, [["049 에서", 2.0, "", INK], ["057 에서", 2.2, "strong", INK]], [
    ["없는 걸 만지지 마라", "없어졌으면 게임오버"],
  ], null, 0.8);

  s.addText("같은 도구가 다른 일을 한다", { x: rx, y: 3.5, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 4 가 계속 이런 식이다. 새 문법이 아니라 배운 것의 새 쓰임이 나온다.", {
    x: rx, y: 3.95, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실측: 장애물 3대를 맞으면 GameOverText 가 켜지고 player 가 사라지며 timeScale 이 0 이 된다. 점수는 10에서 멈춘다.");
}

// ================================================================ 6. 057 멈춤과 재시작
{
  const s = slide();
  head(s, "057", "멈추고, 다시 시작한다.", "게임의 뼈대 네 줄 중 마지막 두 줄이다.");

  code(s, M, 2.15, 7.0, 1.9, [
    ["Time.timeScale = 0f;                                  // 멈춤", "b"],
    "",
    ["Time.timeScale = 1f;                                  // 먼저 되돌리고", "b"],
    ["SceneManager.LoadScene(SceneManager.GetActiveScene().name);", "b"],
  ]);

  table(s, M, 4.3, 7.0, [["조각", 3.0, "code", INK], ["뜻", 4.0, "", MUTED]], [
    ["Time.timeScale", "게임 시간의 배속 — 0이면 물리도 코루틴도 멈춘다"],
    ["LoadScene(이름)", "씬을 처음부터 다시 연다 = 재시작"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.0);
  s.addText("timeScale 은 씬을 바꿔도 안 돌아온다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("0 으로 둔 채 재시작하면 새 씬도 멈춰 있다. LoadScene 앞에서 1 로 돌린다.", {
    x: rx + 0.4, y: 3.35, w: rw - 0.8, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const bw = 4.6, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.2, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("씬을 Build Settings 에 추가해야 열린다", { x: M, y: 6.2, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("여기서 반 전체가 동시에 막힌다. 에러 메시지에 답이 그대로 적혀 있으니 다 같이 읽는다.", {
    x: M + bw + 0.35, y: 6.2, w: 6.6, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });

  code(s, rx, 4.3, rw, 1.5, [
    ["Scene 'xxx' couldn't be loaded", "c"],
    ["because it has not been added", "c"],
    ["to the Build Settings", "c"],
  ]);
  s.addNotes("File > Build Profiles(또는 Build Settings) > Add Open Scenes. 강사가 일부러 재현해서 에러를 읽는 시간을 갖는다 — Phase 0 의 '에러 읽는 습관' 자리다.");
}

// ================================================================ 7. 057 개조
{
  const s = slide();
  head(s, "057", "개조 예시를 미리 준다.", "자유도가 오히려 부담이 되는 학생이 많다. 낮게 시작한다.");

  table(s, M, 2.15, CW, [
    ["개조", 4.6, "strong", INK], ["난이도", 1.6, "", MUTED], ["어디를 만지나", 5.47, "", MUTED],
  ], [
    ["장애물이 점점 빨라진다", "쉬움", "코루틴에서 spawnInterval 을 줄인다 (052)"],
    ["장애물 색·크기가 랜덤", "쉬움", "Instantiate 뒤에 localScale · color (049)"],
    ["회복 아이템이 떨어진다", "보통", "Health 에 Heal 추가 + 프리팹 하나 (050)"],
    ["10초마다 두 배로", "보통", "코루틴 안에서 for 횟수를 늘린다"],
    ["무적 시간 1초", "어려움", "Health 에 시간 확인 추가"],
  ], null, 0.62);

  inverse(s, M, 5.55, CW, 1.35);
  s.addText("1번이나 2번이면 충분하다.", {
    x: M + 0.4, y: 5.8, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("오늘 목표는 \"내가 바꿨다\" 다. 시연 때 뭘 왜 바꿨는지 한 문장으로 말하는 것까지가 과제다.", {
    x: M + 0.4, y: 6.3, w: 11.3, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("개조 시간에 아무것도 안 하는 학생이 있으면 그 자리에서 예시 1번을 같이 5분 안에 해준다. 시연을 빈손으로 넘기지 않는다. 여기서 학생이 처음 '내 게임' 감각을 갖는다.");
}

// ================================================================ 8. 058 콘솔과 나란히
{
  const s = slide();
  head(s, "058", "4주차 2차원 배열과 구조가 같다.", "Console.Write 자리에 Instantiate 가 들어간 것뿐이다.");

  code(s, M, 2.15, 5.9, 2.2, [
    ["// 4주차 · 콘솔", "c"],
    "for (int row = 0; row < 3; row++)",
    "{",
    "    for (int col = 0; col < 4; col++)",
    ["        Console.Write(map[row, col]);", "b"],
    "}",
  ]);
  code(s, 7.05, 2.15, W - M - 7.05, 2.2, [
    ["// 058회차 · 유니티", "c"],
    "for (int row = 0; row < rows; row++)",
    "{",
    "    for (int col = 0; col < columns; col++)",
    ["        Instantiate(brick, 계산한 좌표);", "b"],
    "}",
  ]);

  table(s, M, 4.65, CW, [
    ["콘솔 (4주차)", 4.2, "code", MUTED], ["유니티 (오늘)", 4.4, "code", INK], ["", 3.07, "", MUTED],
  ], [
    ["map[row, col] 읽기", "row, col 로 좌표 계산", "인덱스를 좌표로"],
    ["Console.Write", "Instantiate", "찍는 대상만 다르다"],
    ["줄바꿈", "y 를 한 칸 내린다", "032: 위가 +y 다"],
  ], null, 0.56);

  s.addNotes("046 에서 몬스터 10개를 손으로 끌어다 놨다. 오늘은 50개다. 손으로는 못 한다 — 배열과 반복문이 왜 필요한지가 여기서 처음 몸으로 온다.");
}

// ================================================================ 9. 058 좌표 계산
{
  const s = slide();
  head(s, "058", "블록이 10개면 간격은 9개다.", "가운데 정렬에서 -1 을 빼먹는 게 계산 사고 1등이다.");

  code(s, M, 2.15, 7.0, 1.5, [
    ["float startX = -(columns - 1) * spacingX / 2f;", "b"],
    "",
    "float x = startX + col * spacingX;",
    ["float y = startY - row * spacingY;    // 아래로 가려면 빼기", "b"],
  ]);

  table(s, M, 3.95, 7.0, [["인덱스", 2.2, "code", INK], ["좌표로 바꾸는 법", 4.8, "code", MUTED]], [
    ["col (열)", "startX + col * spacingX"],
    ["row (행)", "startY - row * spacingY"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 058_Bricks_Done", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 2.55, rw, [["항목", 2.0, "", INK], ["값", 2.2, "strong", INK]], [
    ["블록 수", "50개"],
    ["x 범위", "-5.40 ~ 5.40"],
    ["중심", "0.00"],
    ["서로 다른 색", "5개"],
  ], null, 0.58);

  s.addText("숫자 하나로 30개가 늘어난다.", {
    x: M, y: 5.9, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("rows 를 5에서 8로 바꾸면 80개가 되고 여전히 가운데 정렬이다. 이게 반복문을 쓰는 이유다.", {
    x: M, y: 6.4, w: 7.6, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("변수명은 i, j 가 아니라 row, col 로 쓰게 한다. 훨씬 안 헷갈린다. 타일맵·인벤토리 칸·미니맵은 전부 이 계산이다.");
}

// ================================================================ 10. 059 물리 재질
{
  const s = slide();
  head(s, "059", "튀는 건 코드가 아니라 에셋이 한다.", "부딪힌 뒤 어떻게 되느냐는 Physics Material 2D 로 정한다.");

  table(s, M, 2.15, 7.3, [
    ["항목", 2.6, "code", INK], ["값", 1.4, "strong", INK], ["뜻", 3.3, "", MUTED],
  ], [
    ["Friction", "0", "마찰 없음 — 스치면서 안 느려진다"],
    ["Bounciness", "1", "부딪힌 만큼 그대로 튄다"],
  ], null, 0.72);

  s.addText("Material 칸은 Rigidbody 가 아니라 Collider 에 있다.", {
    x: M, y: 4.15, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  table(s, M, 4.75, 7.3, [["", 3.0, "code", INK], ["", 4.3, "", MUTED]], [
    ["Bounciness 0", "안 튄다"],
    ["Bounciness 0.5", "절반씩 죽는다"],
    ["Bounciness 1", "온전히 튄다"],
  ], null, 0.56);

  const rx = 8.55, rw = W - M - 8.55;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("공은 Is Trigger 가 꺼져 있어야 한다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("동전은 통과해야 해서 Trigger 였고(043), 공은 튕겨야 하니 아니다.", {
    x: rx + 0.4, y: 3.35, w: rw - 0.8, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("9주차 물리의 마지막 조각", { x: rx, y: 4.75, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Rigidbody · Collider · Layer 까지 배웠는데 반사만 안 했다. 벽돌깨기가 그걸 배우는 가장 자연스러운 자리다.", {
    x: rx, y: 5.2, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("벽에도 같은 재질을 줄지 묻는 학생이 있다. 한쪽만 있어도 되지만 확실하게 하려면 둘 다 주는 게 낫다.");
}

// ================================================================ 11. 059 normalized
{
  const s = slide();
  head(s, "059", "040 에서 미뤄둔 .normalized.", "그때는 눈치챈 사람에게만 알려줬다. 오늘은 없으면 게임이 망가진다.");

  code(s, M, 2.15, 7.0, 1.05, [
    ["void FixedUpdate()", "c"],
    ["rb.linearVelocity = rb.linearVelocity.normalized * speed;", "b"],
  ]);

  table(s, M, 3.6, 7.0, [
    ["", 2.6, "", INK], ["벡터", 2.2, "code", MUTED], ["길이", 2.2, "strong", INK],
  ], [
    ["지금 속도", "(6, 4)", "약 7.2"],
    [".normalized", "(0.83, 0.55)", "1"],
    ["x speed(8)", "(6.6, 4.4)", "8"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 060_Breakout_Done", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 2.55, rw, [["시점", 2.0, "code", INK], ["공 속도", 2.2, "strong", INK]], [
    ["t = 1.06초", "8.000"],
    ["t = 1.16초", "8.000"],
  ], null, 0.6);
  s.addText("Bounciness 1 이어도 물리 오차가 쌓여 흔들린다. 이 한 줄이 그걸 잡는다.", {
    x: rx, y: 4.35, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("040 의 대각선 문제가 이거였다.", {
    x: M, y: 6.05, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("(1,1) 은 길이가 1.41 이라 대각선이 빨랐다. 방향만 쓰고 싶을 때는 항상 .normalized 다.", {
    x: M, y: 6.5, w: 7.6, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("속도 유지 줄을 지우고 3분간 Play 해본 학생에게 데모를 시킨다. 느려지는 걸 다 같이 보면 그 줄의 이유가 굳는다.");
}

// ================================================================ 12. 059 Collision vs Trigger
{
  const s = slide();
  head(s, "059", "총알은 통과하며 맞히고, 공은 튕기며 맞힌다.", "044 에서 표로만 봤던 차이가 실제로 갈리는 자리다.");

  table(s, M, 2.15, CW, [
    ["", 2.6, "", INK], ["총알 (050)", 4.0, "code", MUTED], ["공 (059)", 5.07, "code", INK],
  ], [
    ["메서드", "OnTriggerEnter2D", "OnCollisionEnter2D"],
    ["매개변수", "Collider2D other", "Collision2D collision"],
    ["상대", "other.gameObject", "collision.gameObject"],
    ["맞은 뒤 나는", "사라진다", "튕긴다"],
  ], null, 0.64);

  // 049 에서 가르친 명시적 null 확인 그대로 쓴다 (?. 는 안 배웠다)
  code(s, M, 5.2, CW, 1.9, [
    ["// OnCollisionEnter2D(Collision2D collision) 안에서", "c"],
    ["if (collision.gameObject.CompareTag(\"Brick\"))", "b"],
    "{",
    "    Health health = collision.gameObject.GetComponent<Health>();",
    ["    if (health != null) health.TakeDamage(damage);", "b"],
    "}",
  ]);

  s.addNotes("050 에서 총알이 하던 것과 같은 코드다. Health 도 GetComponent 도 그대로 쓴다. 실측: t=1.06 에 남은 블록 49 — 한 개가 이미 깨졌다.");
}

// ================================================================ 13. 060 패들
{
  const s = slide();
  head(s, "060", "패들은 Kinematic 이어야 한다.", "Dynamic 이면 공에 맞아서 패들이 밀려난다. 041 의 Body Type 그대로다.");

  code(s, M, 2.15, 7.0, 1.9, [
    "float h = Input.GetAxisRaw(\"Horizontal\");",
    "",
    "pos.x += h * moveSpeed * Time.deltaTime;",
    ["pos.x = Mathf.Clamp(pos.x, -limitX, limitX);", "b"],
  ]);

  table(s, M, 4.35, 7.0, [["조각", 3.2, "code", INK], ["어디서 배웠나", 3.8, "", MUTED]], [
    ["Input.GetAxisRaw", "040"],
    ["h * moveSpeed * Time.deltaTime", "039"],
    ["Mathf.Clamp", "050 — 체력에서 썼다"],
  ], null, 0.58);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.2);
  s.addText("055 에서 여러분이 만든 그 코드다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("042 의 이동에서 세로 입력을 빼서 좌우로만 움직이게 한 것. 여기에 Clamp 만 더했다.", {
    x: rx + 0.4, y: 3.3, w: rw - 0.8, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("왜 linearVelocity 가 아닌가", { x: rx, y: 4.65, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Kinematic 이라 물리가 안 밀어준다. 그래서 직접 옮긴다. 좋은 질문이니 나오면 이렇게 답한다.", {
    x: rx, y: 5.1, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("공을 놓치는 것은 DeadZone(Trigger + Tag)으로 잡는다. 043 의 동전과 같은 구조다. 한 스크립트에 Collision 과 Trigger 가 같이 있어도 된다.");
}

// ================================================================ 14. 060 같은 뼈대
{
  const s = slide();
  head(s, "060", "두 매니저가 거의 같다.", "게임이 완전히 다른데 뼈대는 같다. 이게 Phase 4 가 가르치는 전부다.");

  table(s, M, 2.15, CW, [
    ["하는 일", 3.0, "", INK], ["057 피하기", 4.2, "code", MUTED], ["060 벽돌깨기", 4.47, "code", INK],
  ], [
    ["죽음 감지", "player == null", "ball == null"],
    ["한 번만", "isGameOver", "isOver"],
    ["멈춤", "Time.timeScale = 0", "같다"],
    ["재시작", "LoadScene(...)", "같다"],
    ["끝나는 방법", "죽음 하나", "죽음 + 클리어 둘"],
  ], null, 0.6);

  s.addText("클리어 판정은 왜 코루틴인가.", {
    x: M, y: 5.9, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("FindGameObjectsWithTag 는 씬 전체를 뒤진다. 0.5초에 한 번이면 사람 눈에는 즉시다.", {
    x: M, y: 6.4, w: 7.6, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 8.55, rw = W - M - 8.55;
  s.addText("실측 — 060_Breakout_Done", { x: rx, y: 5.9, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, rx, 6.3, rw, 1.05, [
    ["공 놓침 → \"게임 오버\"", "b"],
    ["블록 0 → \"클리어!\"", "b"],
  ]);
  s.addNotes("Finish 에 if (isOver) return; 이 있는 이유: 마지막 블록을 깨면서 공을 놓치면 클리어와 게임오버가 거의 동시에 온다. 먼저 들어온 쪽으로 끝낸다.");
}

// ================================================================ 15. 흔한 사고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "절반이 씬 설정, 절반이 되돌리기를 잊은 것이다. 강사용.");

  const acc = [
    ["글자가 깨지거나 안 보임", "TMP Essentials 미임포트", "창이 뜨면 Import"],
    ["씬을 못 연다는 에러", "Build Settings 에 씬 없음", "Add Open Scenes"],
    ["재시작했는데 멈춰 있음", "timeScale 을 1로 안 돌림", "LoadScene 앞에서"],
    ["패들이 공에 밀려남", "Body Type 이 Dynamic", "Kinematic 으로 (041)"],
    ["공이 벽에 붙어 멈춤", "Physics Material 없음", "Bounciness 1"],
    ["가운데가 살짝 안 맞음", "-1 을 빼먹음", "간격은 개수보다 하나 적다"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let ay = 2.45;
  acc.forEach((a, i) => {
    s.addText(a[0], { x: M, y: ay, w: 4.6, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.8, y: ay, w: 3.6, h: 0.46, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.5, y: ay, w: 3.2, h: 0.46, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    if (i < acc.length - 1) rule(s, M, ay + 0.56, CW);
    ay += 0.7;
  });

  s.addText("UI 를 예쁘게 만드느라 시간을 다 쓰는 것 — 이 Phase 의 함정이다.", {
    x: M, y: 6.75, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addNotes("개조 시간에 아무것도 안 하는 학생과, 개조를 너무 크게 잡는 학생이 양쪽에 있다. 둘 다 그 자리에서 크기를 조절해준다.");
}

// ================================================================ 16. 정리 + 예고
{
  const s = slide();
  head(s, null, "12주차 정리.", "게임을 끝내는 데 필요한 건 네 줄이다. 벽돌깨기도 본 프로젝트도 같다.");

  table(s, M, 2.15, CW, [
    ["", 2.0, "strong", INK], ["무엇", 4.2, "", MUTED], ["쓴 것", 5.47, "code", INK],
  ], [
    ["시작", "씬을 연다", "(자동)"],
    ["진행", "점수가 쌓인다", "Time.deltaTime · .text"],
    ["끝", "조건이 되면 멈춘다", "null 확인 · Time.timeScale = 0"],
    ["다시", "처음으로 돌아간다", "SceneManager.LoadScene"],
  ], null, 0.62);

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주", { x: M, y: 5.82, w: 4, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("미니게임 ③ 이 본 프로젝트의 축소판이다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("061 – 065회차", { x: 9.2, y: 5.98, w: 3.4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("적이 계속 나오고, 쏘고, 버틴다.", { x: 9.2, y: 6.34, w: 3.4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("14주차 첫 회차에서 '③번 기억나죠? 그걸 제대로 만듭니다' 로 본 프로젝트에 연결한다. 3주 뒤에 '아 그때 그거' 하게 만드는 게 목적이다.");
}

const out = path.join(__dirname, "12주차-끝내는연습.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
