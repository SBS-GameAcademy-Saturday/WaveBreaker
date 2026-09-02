// 11주차 시간과 그림 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 3 마지막 주. 코루틴은 표와 코드로, 스프라이트는 전후 비교 사진으로 간다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 7장의 "유니티가 멈춘다"

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
pres.title = "11주차 · 시간과 그림";

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

// 코드 블록 — lines: [text, kind]  kind: "" 기본 / "c" 주석 / "b" 강조
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
  s.addText("11주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("시간과 그림.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("Phase 3 마지막 주. 마지막 회차에는 새로 배우는 게 하나도 없다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("054_Sprite_After"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("055_Dodge"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("051 – 055회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 3 마무리 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("코루틴은 이 Phase 최대 난관이다. yield 를 문법으로 설명하는 순간 반이 무너진다. '여기서 잠깐 쉬었다 이어서' 이 한 문장으로 끝까지 간다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "051–052로 시간을 다루고, 053–054로 그림을 입히고, 055에서 조립만 한다.");
  const items = [
    ["051", "코루틴 ①", "3초 뒤에 한 번 · yield return WaitForSeconds"],
    ["052", "코루틴 ②", "while + yield · 2초마다 저절로 나오는 몬스터"],
    ["053", "스프라이트", "PPU · Filter Mode · 흰 네모가 그림이 된다"],
    ["054", "Animator", "걷기 하나. 상태 전환은 Phase 7로 미룬다"],
    ["055", "미니게임 ①", "새로 배우는 것 없이 피하기 게임 + Phase 3 마무리"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 4.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 5.55, y, w: CW - 5.55, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });
  s.addNotes("053·054는 게임이 예뻐지는 주간이라 학생 몰입이 크게 오른다. 대신 Animator 상태 머신에 빠지면 2주가 날아간다. 054에서 '오늘 안 하는 것'을 먼저 띄운다.");
}

// ================================================================ 3. 051 불편
{
  const s = slide();
  head(s, "051", "타이머 변수로 먼저 만들어 본다.", "이걸 건너뛰면 코루틴이 그냥 이상한 문법으로만 남는다.");

  code(s, M, 2.15, 6.4, 2.6, [
    ["private float timer;", "b"],
    ["private bool  done;", "b"],
    "",
    "void Update()",
    "{",
    "    if (done) return;",
    "    timer += Time.deltaTime;",
    "    if (timer >= 3f) { Debug.Log(\"발사!\"); done = true; }",
    "}",
  ]);

  s.addText("한 번 하는 데 변수가 두 개다.", {
    x: M, y: 5.05, w: 6.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("3초 → 2초 → 1초로 이어지면 변수가 여섯 개가 된다. 웨이브 10개면 스무 개다.", {
    x: M, y: 5.55, w: 6.4, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 2.15, rw, 2.4);
  s.addText("된다. 그런데 흩어진다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.08, rw - 0.8, INK_SOFT);
  s.addText("\"3초 뒤에 무엇을 한다\" 가 변수 선언과 Update 여기저기에 나뉘어 있다. 읽어서는 순서가 안 보인다.", {
    x: rx + 0.4, y: 3.25, w: rw - 0.8, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("불편을 먼저 겪게 한다", { x: rx, y: 4.85, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("코루틴부터 주면 \"왜 이런 이상한 문법을 쓰지\" 로만 기억한다. 이 회차 설계의 전부다.", {
    x: rx, y: 5.3, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("타이머 버전을 반드시 직접 쳐보게 한다. 3초 → 2초 → 1초로 이어지는 확장은 칠판에 그림만 그리고 실제로 치지는 않는다.");
}

// ================================================================ 4. 051 코루틴
{
  const s = slide();
  head(s, "051", "여기서 잠깐 쉬었다 이어서.", "이 한 문장이 코루틴의 전부다. 그 이상 설명하지 않는다.");

  code(s, M, 2.15, 6.4, 2.9, [
    ["using System.Collections;", "b"],
    "",
    "void Start()",
    ["{ StartCoroutine(Fire()); }", "b"],
    "",
    ["IEnumerator Fire()", "b"],
    "{",
    ["    yield return new WaitForSeconds(3f);", "b"],
    "    Debug.Log(\"발사!\");",
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["조각", 2.2, "code", INK], ["뜻", 2.7, "", MUTED]], [
    ["using ...Collections", "IEnumerator 를 쓰려면"],
    ["IEnumerator", "쉴 수 있다는 표시"],
    ["StartCoroutine", "시작해 달라고 부탁"],
    ["yield return", "여기서 쉬었다 이어서"],
  ], null, 0.6);

  s.addText("변수가 하나도 없다.", {
    x: rx, y: 5.3, w: rw, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("위에서 아래로 읽으면 그대로다. IEnumerator 안에서 뭐가 도는지는 설명하지 않는다.", {
    x: rx, y: 5.8, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("IEnumerator 가 뭐냐고 반드시 묻는다. 답은 \"이 메서드는 중간에 쉴 수 있다는 표시\" 까지만.", {
    x: M, y: 5.35, w: 6.4, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("컴파일러가 상태 머신을 만든다는 설명은 절대 하지 않는다. 이 회차가 끝난다. 궁금해하는 학생에게는 '나중에 궁금해지면 보세요' 로 넘긴다.");
}

// ================================================================ 5. 051 두 가지 사고
{
  const s = slide();
  head(s, "051", "안 되면 둘 중 하나다.", "이 회차 사고의 90%가 이 표로 설명된다.");

  table(s, M, 2.15, CW, [
    ["증상", 4.2, "strong", INK], ["원인", 4.4, "code", MUTED], ["", 3.07, "", MUTED],
  ], [
    ["아무것도 안 찍힘", "StartCoroutine 을 빼먹음", "에러도 안 난다"],
    ["한 번에 다 찍힘", "yield return 을 빼먹음", "쉬는 표시가 없다"],
  ], null, 0.78);

  code(s, M, 4.4, 6.4, 2.3, [
    "IEnumerator Countdown()",
    "{",
    "    Debug.Log(\"3\");",
    ["    yield return new WaitForSeconds(1f);", "b"],
    "    Debug.Log(\"2\");",
    ["    yield return new WaitForSeconds(1f);", "b"],
    "    Debug.Log(\"1\");",
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  s.addText("실측 — 051_Coroutine_Done", { x: rx, y: 4.4, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 4.8, rw, [["Play 후", 2.2, "code", INK], ["찍힌 줄", 2.7, "strong", INK]], [
    ["t = 0.99초", "2줄"],
    ["t = 7.81초", "4줄"],
  ], null, 0.6);
  s.addText("yield 가 빠졌다면 t≈0 에 4줄이 한꺼번에 몰린다.", {
    x: rx, y: 6.7, w: rw, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("StartCoroutine 을 뺀 상태를 강사가 일부러 재현해서 보여준다. Console 이 조용한 그림을 다 같이 봐야 학생이 나중에 혼자 찾는다.");
}

// ================================================================ 6. 052 자동 스폰
{
  const s = slide();
  head(s, "052", "10주차의 E 키를 없앤다.", "코루틴 안에 while 을 넣으면 저절로 나온다. Phase 3의 마지막 종료 조건이다.");

  code(s, M, 2.15, 7.0, 2.4, [
    "IEnumerator SpawnRoutine()",
    "{",
    ["    while (true)", "b"],
    "    {",
    "        SpawnOne();",
    ["        yield return new WaitForSeconds(spawnInterval);", "b"],
    "    }",
    "}",
  ]);

  table(s, M, 4.95, 7.0, [["줄", 3.4, "code", INK], ["뜻", 3.6, "", MUTED]], [
    ["while (true)", "계속 반복해라"],
    ["yield return ...", "여기서 쉬었다 다시 위로"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 052_Spawn_Done", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 2.55, rw, [["설정 / 시점", 2.0, "code", INK], ["값", 2.2, "strong", INK]], [
    ["spawnInterval", "2초"],
    ["t = 8.55초", "5마리"],
  ], null, 0.62);

  s.addText("0 · 2 · 4 · 6 · 8초에 하나씩 = 5마리.", {
    x: rx, y: 4.35, w: rw, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("공식대로 나온다. 간격이 흔들리면 yield 자리를 의심한다.", {
    x: rx, y: 4.9, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("3주차에 배운 while 그대로다. 끝나지 않는데 게임이 안 멈추는 이유는 중간에 쉬기 때문이다.", {
    x: M, y: 6.55, w: 7.0, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("이 SpawnRoutine 이 Phase 5~6 웨이브 매니저의 원형이다. while (true) 가 조건 있는 while 로 바뀌면 그게 웨이브다. 17주차에 여기서 이어간다.");
}

// ================================================================ 7. 052 얼어붙는다
{
  const s = slide();
  head(s, "052", "yield 를 빼면 유니티가 죽는다.", "학생 컴퓨터에서 처음 만나게 두지 않는다. 강사가 먼저 재현한다.");

  code(s, M, 2.15, 6.4, 1.7, [
    "while (true)",
    "{",
    "    SpawnOne();",
    ["    // yield return new WaitForSeconds(2f);", "c"],
    "}",
  ]);

  s.addText("한 프레임 안에서 무한히 돈다.", {
    x: M, y: 4.15, w: 6.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("몬스터를 1초에 수십만 마리 만들려고 하는 중이다. 유니티는 응답하지 않는다.", {
    x: M, y: 4.65, w: 6.4, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["상황", 2.0, "", INK], ["대처", 2.9, "", MUTED]], [
    ["아직 반응함", "Ctrl+Shift+P 로 Play 토글"],
    ["완전히 멈춤", "작업 관리자에서 강제 종료"],
    ["다시 열면", "저장 안 한 씬은 날아간다"],
  ], null, 0.66);

  const bw = 3.2, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 5.85, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("Play 전에 Ctrl+S", { x: M, y: 5.85, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("이 회차부터 습관으로 만든다. 코드는 남지만 저장 안 한 씬은 통째로 날아간다.", {
    x: M + bw + 0.35, y: 5.85, w: 7.5, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });

  s.addText("while 을 쓸 때는 yield 가 있는지 먼저 본다. 이건 습관이다.", {
    x: M, y: 6.5, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addNotes("이 시연은 강사만 한다. 학생에게는 시키지 않는다. 미리 한 번 연습해 두고, 주석을 풀어 정상으로 돌아오는 것까지 보여준다.");
}

// ================================================================ 8. 052 시작과 정지
{
  const s = slide();
  head(s, "052", "손잡이를 받아둬야 멈출 수 있다.", "StartCoroutine 은 돌려주는 값이 있다.");

  code(s, M, 2.15, 7.0, 2.6, [
    ["private Coroutine spawnRoutine;", "b"],
    "",
    ["spawnRoutine = StartCoroutine(SpawnRoutine());", "b"],
    "",
    "if (spawnRoutine != null)",
    "{",
    ["    StopCoroutine(spawnRoutine);", "b"],
    "    spawnRoutine = null;",
    "}",
  ]);

  table(s, M, 5.1, 7.0, [["조각", 3.4, "code", INK], ["뜻", 3.6, "", MUTED]], [
    ["Coroutine spawnRoutine", "시작한 코루틴을 담는 손잡이"],
    ["spawnRoutine = null", "지금 안 돌고 있다는 표시"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("049의 null 확인이 또 나온다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.15, rw - 0.8, INK_SOFT);
  s.addText("\"지금 돌고 있나\" 를 null 로 판단한다. 없는 걸 만지지 않으려는 것과 같은 습관이다.", {
    x: rx + 0.4, y: 3.32, w: rw - 0.8, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("StopAllCoroutines() 도 있다", { x: rx, y: 4.85, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("이 오브젝트의 코루틴을 전부 멈춘다. 편한데 거칠다. 문자열로 멈추는 방법은 오타를 못 잡으니 쓰지 않는다.", {
    x: rx, y: 5.3, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("E 키 스폰은 지우고 [ContextMenu] 는 남긴다. 판단 기준은 '쓸모가 남았나' 다. 자동 스폰이 생겨 E 키는 할 일이 없어졌지만 ContextMenu 는 Play 없이 부를 수 있어 여전히 쓸모가 있다.");
}

// ================================================================ 9. 053 전후
{
  const s = slide();
  head(s, "053", "11주 만에 흰 네모를 벗는다.", "게임은 하나도 안 바뀌었다. 그림만 끼웠다.");

  shot(s, "053_Sprite_Before", M, 2.15, 5.5, 2.8, "053_Sprite_Start — 플레이어가 흰 네모");
  shot(s, "054_Sprite_After", 6.75, 2.15, 5.5, 2.8, "054_Animator_Done — 그림 + 걷기");

  table(s, M, 5.62, 7.4, [["바뀐 것", 2.9, "code", INK], ["안 바뀐 것", 4.5, "", MUTED]], [
    ["Sprite Renderer 의 Sprite 칸", "이동 · 발사 · 피격 · 스폰 전부 그대로"],
    ["임포트 설정 3줄", "코드는 한 줄도 안 고쳤다"],
  ], null, 0.56);

  s.addText("몰입이 확 오르는 회차다.", {
    x: 8.55, y: 5.62, w: 3.95, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("그래서 설정을 못 맞추면 오히려 실망이 크다. 세 줄을 확실히 잡는다.", {
    x: 8.55, y: 6.07, w: 3.95, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("총알은 흰 네모로 둬도 된다. 작아서 티가 안 나고 오늘 목표는 캐릭터다. 다 한 학생만 총알까지 바꾼다.");
}

// ================================================================ 10. 053 임포트 3줄
{
  const s = slide();
  head(s, "053", "새 그림을 넣을 때마다 하는 세 줄.", "그리고 Apply. 안 누르면 아무것도 안 바뀐다.");

  table(s, M, 2.15, CW, [
    ["항목", 3.6, "code", INK], ["값", 3.4, "strong", INK], ["안 하면", 4.67, "", MUTED],
  ], [
    ["Pixels Per Unit", "32", "크기가 제각각이 된다"],
    ["Filter Mode", "Point (no filter)", "흐릿해진다"],
    ["Compression", "None", "화질이 깎인다"],
  ], null, 0.7);

  s.addText("Scale 을 만지고 싶어지면 PPU 를 의심한다.", {
    x: M, y: 4.95, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  table(s, M, 5.5, 7.0, [
    ["그림", 2.0, "code", MUTED], ["PPU", 1.6, "code", INK], ["화면에서", 3.4, "strong", INK],
  ], [
    ["32 x 32", "100", "0.32 유닛 — 너무 작다"],
    ["32 x 32", "32", "1 유닛 — 딱 맞다"],
  ], null, 0.58);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 4.95, rw, 2.0);
  s.addText("PPU 는 프로젝트에서 하나로 통일한다.", {
    x: rx + 0.4, y: 5.25, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("섞이면 캐릭터마다 크기가 제각각이 되고, 나중에 전부 다시 임포트해야 한다.", {
    x: rx + 0.4, y: 6.15, w: rw - 0.8, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("그림을 바꾸면 Collider(초록 선)는 그대로 남는다. 043에서 배운 대로 Reset 하거나 Edit Collider 로 다시 잡는다. 그림보다 조금 작게가 게임 느낌이 좋다.");
}

// ================================================================ 11. 054 파일 셋
{
  const s = slide();
  head(s, "054", "파일 세 개가 한 번에 생긴다.", "그림을 타임라인에 끌어다 놓으면 끝난다. 코드는 없다.");

  table(s, M, 2.15, CW, [
    ["무엇", 3.2, "code", INK], ["어디", 2.6, "", MUTED], ["역할", 5.87, "strong", INK],
  ], [
    ["Player_Walk.anim", "Project", "그림을 넘기는 순서 (클립)"],
    ["Player.controller", "Project", "어떤 클립을 언제 트나 (컨트롤러)"],
    ["Animator", "오브젝트", "컨트롤러를 실행하는 부품"],
  ], null, 0.7);

  s.addText("034의 \"부품을 붙이면 능력이 생긴다\" 가 또 나온다.", {
    x: M, y: 4.75, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("컨트롤러는 재생목록, 클립은 곡 하나. 오늘은 곡이 하나뿐이라 컨트롤러가 할 일이 없다.", {
    x: M, y: 5.25, w: 7.0, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 8.25, rw = W - M - 8.25;
  s.addText("실측 — 054_Animator_Done", { x: rx, y: 4.75, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, rx, 5.15, rw, 1.5, [
    ["플레이어", "c"],
    "  _2 → _3 → _0",
    ["스폰된 Enemy(Clone)", "c"],
    "  _0 → _1",
  ]);
  s.addNotes("프리팹 모드에서 붙여야 스폰되는 몬스터가 전부 걷는다. 씬 인스턴스에 붙이면 그 하나만 움직인다. 046에서 배운 게 여기서 값을 한다.");
}

// ================================================================ 12. 054 함정
{
  const s = slide();
  head(s, "054", "오늘 안 하는 것을 먼저 띄운다.", "이 Phase의 최대 함정이다. 파고들면 2주가 날아간다.");

  table(s, M, 2.15, 7.3, [
    ["안 하는 것", 3.6, "code", INK], ["언제 하나", 3.7, "strong", INK],
  ], [
    ["Parameters (bool, float)", "Phase 7 (19~20주차)"],
    ["Transition (상태 전환)", "Phase 7"],
    ["Blend Tree", "Phase 7"],
    ["공격 · 피격 · 사망", "Phase 7"],
  ], null, 0.6);

  s.addText("오늘은 걷기 하나. 상태가 하나라 전환도 없다.", {
    x: M, y: 5.15, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("상태 머신은 재미있어 보이고 실제로 재미있어서 학생이 스스로 빠진다. 그래서 미리 못을 박는다.", {
    x: M, y: 5.65, w: 7.3, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 8.55, rw = W - M - 8.55;
  s.addText("대신 이건 만진다", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, rx, 2.55, rw, [["Samples", 1.6, "code", INK], ["느낌", 2.3, "", MUTED]], [
    ["60", "너무 빠르다 (기본)"],
    ["8 ~ 12", "걷기에 적당"],
    ["2", "뚝뚝 끊긴다"],
  ], null, 0.6);
  s.addText("1초에 몇 장 넘길 거냐다. 눈으로 고른다 — 정답은 없다.", {
    x: rx, y: 4.95, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Animator 를 붙이면 SpriteRenderer 의 Sprite 칸을 애니메이션이 매 프레임 덮어쓴다. 'Sprite 를 바꿨는데 Play 하면 돌아가요' 라는 질문이 반드시 나온다.");
}

// ================================================================ 13. 055 회차 대응표
{
  const s = slide();
  head(s, "055", "전부 배운 것이다.", "이 표를 수업 내내 화면에 띄워둔다. 강사는 답을 주지 않는다.");

  const rows = [
    ["좌우로 움직이는 플레이어", "042", "linearVelocity"],
    ["장애물이 떨어진다", "041", "Gravity Scale"],
    ["부딪힌 걸 알아챈다", "044", "OnTriggerEnter2D"],
    ["원본 하나로 여러 개", "046", "프리팹"],
    ["코드로 만든다", "047", "Instantiate"],
    ["화면 밖 정리", "048", "Destroy · lifeTime"],
    ["체력을 깎는다", "050", "Health · GetComponent"],
    ["계속 떨어진다", "052", "코루틴"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let y = 2.4;
  rows.forEach((r, i) => {
    s.addText(r[0], { x: M, y, w: 5.2, h: 0.42, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(r[1], { x: M + 5.4, y, w: 1.2, h: 0.42, fontFace: F_CODE, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(r[2], { x: M + 6.8, y, w: CW - 6.8, h: 0.42, fontFace: F_CODE, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    if (i < rows.length - 1) rule(s, M, y + 0.56, CW);
    y += 0.52;
  });

  s.addText("막힌 학생에게는 \"몇 번째 줄에서 막혔어요?\" 로 되묻는다.", {
    x: M, y: 6.7, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addNotes("학생이 스스로 해당 회차 강의안을 찾아가게 만드는 게 이 표의 목적이다. 강사가 답을 주는 것보다 이게 낫다. 오늘은 가르치지 않고 순회만 한다.");
}

// ================================================================ 14. 055 프리팹 재사용
{
  const s = slide();
  head(s, "055", "떨어지는 장애물이 뭐죠.", "부딪히면 상대 체력을 깎고 사라지는 것. 우리 총알이랑 똑같지 않나요.");

  table(s, M, 2.15, 7.3, [
    ["Obstacle 설정", 3.4, "code", INK], ["값", 1.7, "strong", INK], ["회차", 2.2, "", MUTED],
  ], [
    ["Rigidbody 2D → Gravity Scale", "1", "041"],
    ["Circle Collider 2D → Is Trigger", "켬", "043"],
    ["Bullet → Speed", "0", "047"],
    ["Bullet → Life Time", "5", "048"],
    ["Bullet → Damage", "10", "050"],
    ["Bullet → Target Tag", "Player", "오늘"],
  ], null, 0.56);

  s.addText("코드는 하나, 용도는 둘.", {
    x: M, y: 6.15, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("총알은 targetTag = Enemy, 장애물은 Player. 속도는 0으로 두고 낙하는 중력이 맡는다.", {
    x: M, y: 6.65, w: 7.9, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });

  shot(s, "055_Dodge", 8.55, 2.15, 3.95, 2.3, "055_Dodge_Done");
  s.addText("실측 — 맞으면 체력 20 → 10 → 0 → 사망.", {
    x: 8.55, y: 5.05, w: 3.95, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("스폰 y=6 에서 놓은 장애물이 1.62초에 y=4.18. 중력이 제대로 떨어뜨린다.", {
    x: 8.55, y: 5.5, w: 3.95, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("새 스크립트를 만들지 않는 게 이 회차의 핵심이다. Bullet 에 targetTag 를 연 것이 이번 주의 유일한 코드 변경이고, 기본값이 Enemy 라 047~050 수업 코드와 동작이 같다.");
}

// ================================================================ 15. Phase 3 종료
{
  const s = slide();
  head(s, null, "Phase 3 종료 조건.", "여섯 개가 다 되면 통과다. 하나라도 안 되면 12주차 전에 개별 시간을 잡는다.");

  const chk = [
    "총알이 몬스터에 닿으면 이벤트가 발생한다",
    "Tag 로 몬스터만 골라 반응한다",
    "프리팹 원본을 고치면 전부 반영된다",
    "GetComponent 로 다른 오브젝트 체력을 깎는다",
    "코루틴으로 2초마다 몬스터를 생성한다",
    "체력이 0이면 몬스터가 사라진다",
  ];
  chk.forEach((c, i) => {
    const by = 2.3 + i * 0.5;
    const last = (i === 4);
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by + 0.06, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: last ? INK : HAIRLINE, width: last ? 1.5 : 1 } });
    s.addText(c, { x: M + 0.42, y: by, w: 6.4, h: 0.4,
      fontFace: last ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["", 1.4, "", MUTED], ["8주차 끝", 1.9, "", MUTED], ["11주차 끝", 1.6, "strong", INK]], [
    ["화면", "흰 네모", "그림 + 애니메이션"],
    ["이동", "벽을 뚫는다", "물리로 막힌다"],
    ["상호작용", "없다", "쏘고 맞고 죽는다"],
    ["오브젝트", "손으로 놓는다", "코드가 만든다"],
    ["시간", "없다", "코루틴"],
  ], null, 0.56);

  inverse(s, M, 5.55, CW, 1.3);
  s.addText("Snapshot_P3 를 전원에게 배포한다.", {
    x: M + 0.4, y: 5.82, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("플레이어 + 몬스터 프리팹 + 총알 + 코루틴 스폰 + 체력 시스템. 못 따라온 학생은 다음 주에 이걸 연다.", {
    x: M + 0.4, y: 6.32, w: 11.3, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("055 는 전원 30초씩 데모한다. 한 명도 빠뜨리지 않는다. Phase 4 는 이 여섯 개를 계속 다시 쓰므로 여기서 못 따라오면 3주가 힘들어진다.");
}

// ================================================================ 16. 사고 + 예고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "코루틴 사고는 둘, 그림 사고는 하나로 압축된다. 강사용.");

  const acc = [
    ["아무것도 안 일어남", "StartCoroutine 을 안 씀", "에러가 안 난다"],
    ["한 번에 다 실행됨", "yield return 이 없음", "쉬는 표시가 없다"],
    ["유니티가 완전히 멈춤", "while 안에 yield 가 없음", "강제 종료. 그래서 Ctrl+S"],
    ["설정을 바꿨는데 그대로", "Apply 를 안 누름", "Inspector 아래쪽"],
    ["스폰된 것만 애니메이션 없음", "씬 인스턴스에 붙임", "프리팹 모드에서"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let ay = 2.42;
  acc.forEach((a, i) => {
    s.addText(a[0], { x: M, y: ay, w: 4.6, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.8, y: ay, w: 3.6, h: 0.46, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.5, y: ay, w: 3.2, h: 0.46, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    if (i < acc.length - 1) rule(s, M, ay + 0.5, CW);
    ay += 0.62;
  });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주부터 Phase 4", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("만드는 것과 끝내는 것은 다르다.", { x: M, y: 6.22, w: 8, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("056 – 065회차", { x: 8.6, y: 5.98, w: 4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("작은 게임 세 개를 끝까지 만든다.", { x: 8.6, y: 6.34, w: 4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("14주차부터 시작할 본 프로젝트를 위해 '끝내는 경험'을 먼저 시킨다. 미니게임 3종은 그 연습이다.");
}

const out = path.join(__dirname, "11주차-시간과그림.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
