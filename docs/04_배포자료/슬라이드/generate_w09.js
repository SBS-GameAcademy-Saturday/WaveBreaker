// 9주차 부딪히게 만들기 — Mobbin 디자인 시스템 (DESIGN.md)
// 9주차는 Inspector 주간이라 표와 스크린샷이 함께 내용이 된다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 15장의 5단계 체크리스트

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
pres.title = "9주차 · 부딪히게 만들기";

const W = 13.333, H = 7.5, M = 0.83, CW = W - M * 2;

// ---------------------------------------------------------------- helpers
function slide() { const s = pres.addSlide(); s.background = { color: CANVAS }; return s; }

function soft(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS_SOFT }, line: { width: 0 } });
}
function outlined(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS }, line: { color: HAIRLINE_S, width: 1 } });
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

// 코드 블록 — canvas-soft 면에 모노스페이스. 주석은 muted, 강조 줄은 ink bold.
// lines: [text, kind]  kind: "" 기본 / "c" 주석 / "b" 강조
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

// 표
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
  s.addText("9주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("부딪히게 만들기.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("8주 동안 캐릭터는 벽을 뚫고 지나갔다. 이번 주에 멈춘다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("044_Trigger"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("045_Layer_Done"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("041 – 045회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 3 착수 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("Phase 3 질문의 70퍼센트가 '충돌이 안 돼요' 다. 이번 주의 진짜 산출물은 씬이 아니라 학생이 손에 쥔 충돌 체크리스트다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "041에서 떨어뜨리고, 042에서 멈추고, 045에서 안 부딪히게 만든다.");
  const items = [
    ["041", "Rigidbody 2D", "Body Type · Gravity Scale · 물리가 주인이 된다"],
    ["042", "물리 기반 이동", "FixedUpdate · linearVelocity · 벽에서 멈춘다"],
    ["043", "Collider 2D", "충돌 성립 조건 · Is Trigger · 통과하지만 알아챈다"],
    ["044", "충돌 이벤트와 Tag", "OnTriggerEnter2D · CompareTag · 코드로 받는다"],
    ["045", "Layer · Sorting Layer", "아예 안 부딪히게 · 누가 앞에 보이나"],
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
  s.addNotes("041에서 043까지는 코드가 거의 없다. 전부 Inspector 다. 코드는 042와 044 둘뿐이라는 걸 첫날에 말해두면 학생 부담이 준다.");
}

// ================================================================ 3. 041 부품 하나
{
  const s = slide();
  head(s, "041", "부품 하나 붙였더니 떨어진다.", "034에서 맛만 본 그 부품이다. 코드는 한 줄도 없다.");

  const rows = [
    ["Dynamic", "받는다", "밀린다", "플레이어 · 몬스터 · 총알"],
    ["Kinematic", "안 받는다", "안 밀린다", "정해진 길로 움직이는 발판"],
    ["Static", "안 받는다", "안 밀린다", "벽 · 바닥"],
  ];
  table(s, M, 2.15, CW, [
    ["Body Type", 3.0, "strong", INK], ["중력", 2.4, "", MUTED],
    ["부딪히면", 2.7, "", MUTED], ["우리 게임에서", 3.57, "", INK],
  ], rows, null, 0.72);

  inverse(s, M, 4.95, 6.4, 2.0);
  s.addText("Rigidbody 2D 는 떨어지는 능력만 준다.", {
    x: M + 0.4, y: 5.3, w: 5.6, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("부딪히는 능력은 Collider 2D 라는 다른 부품이다. 오늘 바닥을 뚫고 지나가는 건 정상이다.", {
    x: M + 0.4, y: 6.0, w: 5.6, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 7.55, rw = W - M - 7.55;
  s.addText("검색하면 두 개가 나온다", { x: rx, y: 4.95, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, rx, 5.35, rw, 1.6, [
    ["Rigidbody", "c"],
    ["  3D 용. 붙여도 아무 일도 안 일어난다", "c"],
    "",
    ["Rigidbody 2D", "b"],
    ["  이걸 고른다", "c"],
  ]);
  s.addNotes("Add Component 검색창에 Rigid 를 치고 목록 두 개를 나란히 보여준다. 3D 를 붙이는 사고가 이 주 내내 반복된다.");
}

// ================================================================ 4. 041 숫자
{
  const s = slide();
  head(s, "041", "무거우면 빨리 떨어질까.", "아니다. Mass 는 부딪혔을 때 누가 미느냐에 쓴다.");

  table(s, M, 2.15, 7.1, [
    ["항목", 2.2, "code", INK], ["뜻", 2.6, "", MUTED], ["낙하 속도에", 2.3, "strong", INK],
  ], [
    ["Gravity Scale", "중력을 몇 배로 받나", "영향 있다"],
    ["Mass", "무게", "없다"],
    ["Linear Damping", "공기 저항", "있다"],
  ], null, 0.6);

  s.addText("Gravity Scale 0 / 1 / 3 을 6.4초 떨어뜨린 실측", {
    x: M, y: 4.6, w: 7.1, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  table(s, M, 5.0, 7.1, [
    ["Gravity Scale", 2.2, "code", INK], ["6.4초 뒤 y", 2.6, "code", MUTED], ["기준 대비", 2.3, "strong", INK],
  ], [
    ["0", "3.00", "안 떨어진다"],
    ["1", "-201.06", "1배"],
    ["3", "-609.18", "약 3배"],
  ], null, 0.56);

  const rx = 8.3, rw = W - M - 8.3;
  inverse(s, rx, 2.15, rw, 2.5);
  s.addText("위에서 내려다보는 게임은 전부 0이다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.5, rw - 0.8, INK_SOFT);
  s.addText("웨이브 브레이커도 위에서 보는 로그라이크다. 042부터 플레이어 Gravity Scale 은 계속 0이다.", {
    x: rx + 0.4, y: 3.68, w: rw - 0.8, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("Drag 가 안 보인다는 질문", { x: rx, y: 4.95, w: rw, h: 0.36,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Unity 6에서 Linear Damping 으로 이름이 바뀌었다. 인터넷 자료는 아직 전부 Drag 다. 같은 항목이다.", {
    x: rx, y: 5.4, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Mass 실험은 말로 하지 말고 1 / 10 / 100 을 나란히 떨어뜨려 보여준다. 갈릴레오 얘기를 한 줄 붙이면 기억에 남는다.");
}

// ================================================================ 5. 042 왜 뚫나
{
  const s = slide();
  head(s, "042", "왜 040 코드는 벽을 뚫나.", "부딪히는 부품이 이미 붙어 있는데도 통과한다. 이게 오늘의 도입이다.");

  s.addText("040까지", { x: M, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, M, 2.55, 6.0, 1.6, [
    ["transform.position =", "b"],
    ["    transform.position + dir * speed * Time.deltaTime;", "b"],
    "",
    ["// 물어보지도 않고 좌표를 그냥 넣는다", "c"],
  ]);

  s.addText("오늘부터", { x: 7.15, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: INK, margin: 0, isTextBox: true });
  code(s, 7.15, 2.55, W - M - 7.15, 1.6, [
    ["rb.linearVelocity = new Vector2(h, v) * moveSpeed;", "b"],
    "",
    "",
    ["// 물리 엔진에게 부탁한다", "c"],
  ]);

  table(s, M, 4.5, CW, [
    ["", 3.2, "", MUTED], ["040까지", 4.2, "", MUTED], ["오늘부터", 4.27, "strong", INK],
  ], [
    ["누가 옮기나", "내가 좌표를 대입", "물리 엔진에게 부탁"],
    ["Time.deltaTime", "곱한다", "안 곱한다"],
    ["벽을 만나면", "통과한다", "멈춘다"],
  ], null, 0.62);

  s.addNotes("Player 와 벽에는 Box Collider 2D 를 미리 붙여둔 시작 씬으로 연다. '충돌 부품이 있는데도 통과한다'를 먼저 보여줘야 이동 방식을 바꾸는 이유가 선다.");
}

// ================================================================ 6. 042 속도를 넣는다
{
  const s = slide();
  head(s, "042", "위치를 넣으면 곱하고, 속도를 넣으면 안 곱한다.", "039에서 deltaTime 을 곱했는데 오늘은 안 곱한다. 이유가 있다.");

  code(s, M, 2.15, 6.4, 1.9, [
    ["rb.linearVelocity = new Vector2(h, v) * moveSpeed;", "b"],
    "",
    ["// Vector3 가 아니라 Vector2 — 2D 물리는 z 를 안 쓴다", "c"],
    ["// deltaTime 이 없다 — 이미 '1초에' 가 들어 있다", "c"],
  ]);

  table(s, M, 4.35, 6.4, [
    ["무엇을 넣나", 3.2, "code", INK], ["deltaTime", 1.7, "strong", INK], ["회차", 1.5, "", MUTED],
  ], [
    ["transform.position", "곱한다", "038 – 040"],
    ["rb.linearVelocity", "안 곱한다", "042"],
  ], null, 0.62);

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 2.15, rw, 2.5);
  s.addText("1초에 얼마나 갈지를 넣는다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.5, rw - 0.8, INK_SOFT);
  s.addText("위치가 아니라 속도다. 속도에 시간을 또 곱하면 단위가 하나 더 나눠진다.", {
    x: rx + 0.4, y: 3.68, w: rw - 0.8, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("velocity 에 노란 줄이 뜬다는 질문", { x: rx, y: 4.95, w: rw, h: 0.36,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Unity 6에서 linearVelocity 로 이름이 바뀌었다. 경고지 에러가 아니다. 인터넷 자료는 전부 velocity 로 나온다.", {
    x: rx, y: 5.4, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Rigidbody 는 GetComponent 가 아니라 [SerializeField] 로 드래그해 넣는다. 코드로 찾는 건 046회차다. 040에서 Item 칸에 넣던 것과 똑같다고 연결한다.");
}

// ================================================================ 7. 042 FixedUpdate
{
  const s = slide();
  head(s, "042", "물리는 시계가 따로 돈다.", "화면은 컴퓨터마다 다르지만 물리는 누구든 1초에 50번이다.");

  table(s, M, 2.15, CW, [
    ["", 2.6, "code", INK], ["언제", 3.4, "", MUTED],
    ["1초에 몇 번", 3.0, "strong", INK], ["여기에 쓰는 것", 2.67, "", MUTED],
  ], [
    ["Update", "화면 한 장 그릴 때마다", "컴퓨터마다 다르다", "입력 읽기 · 화면"],
    ["FixedUpdate", "정해진 시간마다", "누구든 50번", "Rigidbody 만지는 것"],
  ], null, 0.72);

  code(s, M, 4.2, 6.4, 1.5, [
    ["void FixedUpdate()", "b"],
    "{",
    "    rb.linearVelocity = new Vector2(h, v) * moveSpeed;",
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  s.addText("규칙 하나만 기억한다", { x: rx, y: 4.2, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("rb. 으로 시작하는 줄은 FixedUpdate 에.", {
    x: rx, y: 4.6, w: rw, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: INK,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("나머지는 Update 에 둔다. 특히 GetKeyDown 은 FixedUpdate 에 쓰면 눌러도 씹힌다.", {
    x: rx, y: 5.25, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("Fixedupdate 로 잘못 쓰면 에러도 안 난다. 유니티가 그냥 안 부른다. 이 주에서 가장 찾기 어려운 사고다.", {
    x: M, y: 6.15, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("이름만 바꿔도 겉으로는 차이가 없다. 그래서 '왜 바꾸는지'를 말로 짚어야 한다. 컴퓨터마다 물리가 달라지면 게임이 달라진다.");
}

// ================================================================ 8. 043 성립 조건
{
  const s = slide();
  head(s, "043", "충돌이 성립하는 조건은 두 줄뿐이다.", "이 주 질문의 70퍼센트가 여기서 끝난다.");

  s.addText("① 둘 다 Collider 2D 가 있어야 한다", { x: M, y: 2.15, w: 7.0, h: 0.44,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("② 둘 중 최소 하나에 움직이는 Rigidbody 2D 가 있어야 한다", { x: M, y: 2.68, w: 7.0, h: 0.44,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  table(s, M, 3.5, CW, [
    ["Player", 4.2, "", INK], ["벽", 4.2, "", INK], ["결과", 3.27, "strong", INK],
  ], [
    ["Collider + Rigidbody(Dynamic)", "Collider", "막힌다"],
    ["Collider + Rigidbody(Dynamic)", "Collider + Rigidbody(Static)", "막힌다 · 더 빠르다"],
    ["Collider 만", "Collider 만", "아무 일도 안 일어난다"],
    ["Rigidbody 만", "Collider", "통과한다"],
  ], null, 0.62);

  s.addText("물리 엔진은 움직이는 쪽을 기준으로 계산한다. 둘 다 가만히 있으면 검사할 이유가 없다.", {
    x: M, y: 6.6, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("네 줄을 말로 넘기지 말고 씬에서 조합을 바꿔가며 네 번 Play 한다. 겪게 하는 게 목적이다. Scene 뷰의 초록 선이 실제 판정 경계라는 것도 여기서 짚는다.");
}

// ================================================================ 9. 043 Is Trigger
{
  const s = slide();
  head(s, "043", "막지는 않는데 알아챈다.", "동전에 부딪혀 멈추면 이상하다. 통과하면서 먹어야 한다.");

  table(s, M, 2.15, 7.3, [
    ["", 3.5, "", INK], ["막나", 1.4, "strong", INK], ["알아채나", 1.6, "strong", INK], ["예", 0.8, "", MUTED],
  ], [
    ["Collider 없음", "아니다", "아니다", "배경"],
    ["Is Trigger 끔", "막는다", "알아챈다", "벽"],
    ["Is Trigger 켬", "아니다", "알아챈다", "동전"],
  ], null, 0.68);

  s.addText("총알이 몬스터를 맞히는 것도 Is Trigger 다.", {
    x: M, y: 4.9, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("함정, 회복 구역, 획득물 — 막지 않고 알아채기만 하면 되는 건 전부 이쪽이다. 046회차 총알 발사에서 그대로 쓴다.", {
    x: M, y: 5.4, w: 7.3, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  shot(s, "043_Collider", 8.4, 2.15, 4.1, 2.4, "043_Collider_Done — 사방이 막힌 방");

  s.addText("오늘은 통과하는 것까지만 보인다. 알아챈 걸 받아내는 건 다음 시간이다.", {
    x: 8.4, y: 5.15, w: 4.1, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Is Trigger 를 켜면 Collider 를 뗀 것과 뭐가 다르냐고 물어본다. 학생 답을 기다린다. 여기가 이 회차에서 가장 중요한 순간이다.");
}

// ================================================================ 10. 044 유니티가 부른다
{
  const s = slide();
  head(s, "044", "내가 부르지 않아도 유니티가 부른다.", "036의 Start · Update 와 같은 구조다. 매 프레임이 아니라 닿을 때다.");

  code(s, M, 2.15, 7.3, 2.6, [
    ["private void OnTriggerEnter2D(Collider2D other)", "b"],
    "{",
    ["    if (other.CompareTag(\"Coin\"))", "b"],
    "    {",
    "        coinCount++;",
    "        other.gameObject.SetActive(false);",
    "    }",
    "}",
  ]);

  table(s, M, 5.05, 7.3, [["조각", 3.4, "code", INK], ["뜻", 3.9, "", MUTED]], [
    ["Collider2D other", "닿은 상대가 여기 들어온다"],
    ["SetActive(false)", "040에서 스페이스로 껐다 켜던 그것"],
  ], null, 0.6);

  shot(s, "044_Trigger", 8.55, 2.15, 3.95, 2.3, "044_Trigger_Done — 코인 3개와 벽");

  s.addText("메서드 이름을 틀리면 에러도 안 난다.", {
    x: 8.55, y: 5.05, w: 3.95, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("그냥 조용히 아무 일도 안 일어난다. 손으로 치지 말고 OnTri 까지 치고 자동완성으로 넣는다.", {
    x: 8.55, y: 5.5, w: 3.95, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실측: 코인 3개를 지나가면 Console 에 1개째 2개째 3개째 먹었다 가 찍히고 코인이 전부 꺼진다. 벽에 닿으면 부딪혔다: Wall 이 따로 찍힌다.");
}

// ================================================================ 11. 044 Tag
{
  const s = slide();
  head(s, "044", "만들었다와 붙였다는 다르다.", "Add Tag 는 목록에 이름을 등록만 한다. 오브젝트에 붙이는 건 별개다.");

  const steps = [
    ["1", "Inspector 맨 위 Tag → Add Tag...", "목록에 Coin 을 등록한다"],
    ["2", "다시 오브젝트를 선택", "여기서 멈추는 학생이 가장 많다"],
    ["3", "Tag 드롭다운에서 Coin 선택", "이제야 붙는다"],
  ];
  rule(s, M, 2.2, 7.3, HAIRLINE);
  let y = 2.42;
  steps.forEach((st, i) => {
    if (i === 1) soft(s, M - 0.28, y - 0.1, 7.86, 0.7, R_SM);
    s.addText(st[0], { x: M, y, w: 0.5, h: 0.46, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(st[1], { x: M + 0.5, y, w: 3.9, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(st[2], { x: M + 4.5, y, w: 3.6, h: 0.46, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    if (i < steps.length - 1) rule(s, M, y + 0.62, 7.3);
    y += 0.8;
  });

  s.addText("이름으로 구분하면 안 되나", { x: M, y: 5.1, w: 7.3, h: 0.36,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("몬스터 이름은 Enemy, Enemy (1), Enemy (37)... 끝이 없다. Tag 는 하나로 전부 잡는다.", {
    x: M, y: 5.55, w: 7.3, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 8.55, rw = W - M - 8.55;
  code(s, rx, 2.15, rw, 2.0, [
    ["other.tag == \"Coin\"", "c"],
    ["  오타를 조용히 넘긴다", "c"],
    "",
    ["other.CompareTag(\"Coin\")", "b"],
    ["  없는 Tag 면 에러로 알려준다", "c"],
  ]);
  inverse(s, rx, 4.45, rw, 2.0);
  s.addText("CompareTag 를 쓴다.", {
    x: rx + 0.4, y: 4.8, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("더 빠르고, 틀렸을 때 알려준다. == 로 쓰면 Tag 이름을 오타 내도 아무 일이 안 일어나서 원인을 못 찾는다.", {
    x: rx + 0.4, y: 5.35, w: rw - 0.8, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Add Tag 후 다시 오브젝트를 선택해 드롭다운에서 고르는 단계를 화면 공유로 두 번 보여준다. 045의 Layer 에서 같은 실수가 그대로 반복된다.");
}

// ================================================================ 12. 044 Trigger vs Collision
{
  const s = slide();
  head(s, "044", "글자 한 개 차이로 안 불린다.", "Trigger 는 Collider2D, Collision 은 Collision2D 다.");

  table(s, M, 2.15, CW, [
    ["메서드", 4.2, "code", INK], ["Is Trigger", 2.3, "", MUTED],
    ["매개변수", 3.0, "code", INK], ["상대 오브젝트", 2.17, "code", MUTED],
  ], [
    ["OnTriggerEnter2D", "켬 · 통과", "Collider2D", "other.gameObject"],
    ["OnCollisionEnter2D", "끔 · 막힘", "Collision2D", "collision.gameObject"],
  ], null, 0.74);

  code(s, M, 4.35, 6.4, 2.0, [
    ["private void OnTriggerEnter2D(Collider2D other)", "b"],
    "",
    ["private void OnCollisionEnter2D(Collision2D collision)", "b"],
    "",
    ["// Collider2D / Collision2D — 자동완성으로 넣는다", "c"],
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 4.35, rw, [["시점", 1.6, "code", INK], ["언제 불리나", 3.3, "", MUTED]], [
    ["Enter", "닿는 순간 한 번"],
    ["Stay", "닿아 있는 동안 계속"],
    ["Exit", "떨어질 때"],
  ], null, 0.56);
  s.addText("040의 GetKeyDown / GetKey 와 같은 구조다.", {
    x: rx, y: 6.75, w: rw, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Stay 를 넣어본 학생이 있으면 Console 이 잠기는 걸 보여주게 한다. 036에서 Update 로 Console 을 잠근 것과 같은 그림이라 연결이 잘 된다.");
}

// ================================================================ 13. 045 Layer Matrix
{
  const s = slide();
  head(s, "045", "부딪힌 다음 고르지 말고, 아예 검사를 막는다.", "Tag 로는 총알끼리 부딪히는 걸 막을 수 없다.");

  table(s, M, 2.15, 7.1, [
    ["관계", 3.3, "code", INK], ["체크", 1.6, "strong", INK], ["이유", 2.2, "", MUTED],
  ], [
    ["Bullet × Bullet", "끈다", "부딪힐 이유가 없다"],
    ["Bullet × Player", "끈다", "내 총알에 내가 맞으면 안 된다"],
    ["Bullet × Wall", "켠다", "벽에는 맞아야 한다"],
    ["Player × Wall", "켠다", "벽에 막혀야 한다"],
  ], null, 0.62);

  s.addText("Edit → Project Settings → Physics 2D → Layer Collision Matrix", {
    x: M, y: 5.25, w: 7.1, h: 0.36, fontFace: F_CODE, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });

  s.addText("총알이 200발이면 서로 검사하는 것만 매 프레임 4만 번이다.", {
    x: M, y: 5.75, w: 7.1, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("체크 하나를 끄면 그게 통째로 사라진다. 성능 이야기이기도 하다.", {
    x: M, y: 6.35, w: 7.1, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });

  const rx = 8.3, rw = W - M - 8.3;
  table(s, rx, 2.15, rw, [["", 1.3, "", INK], ["Tag", 1.4, "", MUTED], ["Layer", 1.5, "", INK]], [
    ["무엇", "이름표", "소속 그룹"],
    ["개수", "제한 없음", "32개"],
    ["쓰는 곳", "코드", "물리 설정"],
    ["언제", "부딪힌 뒤", "부딪히기 전"],
  ], null, 0.6);
  s.addText("Layer 는 검사 자체를 막고, Tag 는 검사 결과를 골라낸다.", {
    x: rx, y: 5.3, w: rw, h: 0.9, fontFace: F_SEMI, fontSize: T.title, color: INK,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });
  s.addText("둘 다 쓴다. Layer 로 큰 그물을 치고 Tag 로 세부를 고른다.", {
    x: rx, y: 6.2, w: rw, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Layer 도 Add Layer 로 만들기만 하고 오브젝트에 안 붙이는 실수가 그대로 반복된다. 044의 Tag 와 같은 실수라고 짚어준다. Matrix 는 프로젝트 설정이라 씬에 저장되지 않는다 — 시연 전에 강사가 직접 끄고, 끝나면 되돌린다.");
}

// ================================================================ 14. 045 Sorting Layer
{
  const s = slide();
  head(s, "045", "2D는 앞뒤를 따로 정해줘야 한다.", "Z 좌표가 아니라 Sorting Layer 로 관리한다.");

  shot(s, "045_Layer_Start", M, 2.15, 5.5, 2.8, "Order in Layer 1인 배경이 캐릭터를 덮는다");
  shot(s, "045_Layer_Done", 6.75, 2.15, 5.5, 2.8, "배경을 Background 로 내리면 앞에 보인다");

  table(s, M, 5.62, 7.4, [["칸", 2.9, "code", INK], ["뜻", 4.5, "", MUTED]], [
    ["Sorting Layer", "큰 묶음 — 배경 / 바닥 / 캐릭터 / 이펙트"],
    ["Order in Layer", "같은 묶음 안에서의 순서 — 숫자가 클수록 앞"],
  ], null, 0.56);

  s.addText("목록의 위가 뒤, 아래가 앞이다.", {
    x: 8.55, y: 5.62, w: 3.95, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("2D에서도 Z가 먹지만 Sorting Layer 가 우선이다. Z로 관리하면 나중에 뒤죽박죽이 된다.", {
    x: 8.55, y: 6.07, w: 3.95, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Background / Ground / Enemy / Player / Effect 순으로 만든다. 순서를 잘못 만들면 드래그로 바꿀 수 있지만 처음에 맞추는 게 낫다. 깜빡거리면 순서가 같다는 뜻이다.");
}

// ================================================================ 15. 충돌 체크리스트
{
  const s = slide();
  head(s, null, "충돌이 안 될 때 — 위에서부터.", "이 주에 만들어 앞으로 계속 쓴다. 학생에게 받아 적게 한다.");

  const chk = [
    ["1", "둘 다 Collider 2D 가 있나", "Inspector", false],
    ["2", "최소 하나에 Rigidbody 2D (Dynamic) 가 있나", "Inspector", false],
    ["3", "Is Trigger 상태가 의도한 대로인가", "Inspector", false],
    ["4", "메서드 이름 · Tag 를 오브젝트에 붙였나", "코드 / Inspector 맨 위", false],
    ["5", "Layer Collision Matrix 가 꺼져 있진 않나", "Project Settings → Physics 2D", true],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let y = 2.45;
  chk.forEach((c, i) => {
    if (c[3]) soft(s, M - 0.28, y - 0.12, CW + 0.56, 0.74, R_SM);
    s.addText(c[0], { x: M, y, w: 0.5, h: 0.5, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(c[1], { x: M + 0.5, y, w: 7.2, h: 0.5, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(c[2], { x: M + 7.8, y, w: CW - 7.8, h: 0.5, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    if (i < chk.length - 1) rule(s, M, y + 0.66, CW);
    y += 0.84;
  });

  const bw = 4.4, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.62, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("5번은 씬을 아무리 봐도 안 보인다", { x: M, y: 6.62, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("1~4번을 다 봤는데도 안 되면 여기다. 씬에는 아무 문제가 없는데 안 부딪힌다.", {
    x: M + bw + 0.35, y: 6.62, w: 7.0, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });
  s.addNotes("043에서 1~3번을 만들고 044에서 4번, 045에서 5번을 채운다. 빈칸을 남겨두고 학생이 직접 채우게 하는 게 설계 의도다. 앞으로 '충돌이 안 돼요' 라는 질문에는 '1번부터 봤어요?' 로 되묻는다.");
}

// ================================================================ 16. 종료 조건 + 예고
{
  const s = slide();
  head(s, null, "9주차 종료 조건.", "045 데모에서 한 명씩 확인한다. 10주차는 이 위에 그대로 쌓인다.");

  const chk = [
    "Rigidbody 2D 로 물체를 떨어뜨린다",
    "Body Type 3종의 차이를 말한다",
    "rb.linearVelocity 로 캐릭터를 움직인다",
    "물리 코드를 FixedUpdate 에 쓴다",
    "Collider 2D 로 벽을 만들고 막힌다",
    "Is Trigger 로 통과하는 구역을 만든다",
    "OnTriggerEnter2D 로 닿은 걸 받는다",
    "Tag 로 특정 대상만 골라낸다",
    "Layer Collision Matrix 로 충돌을 끈다",
    "충돌 5단계 체크리스트를 외운다",
  ];
  chk.forEach((c, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const bx = M + col * 5.95;
    const by = 2.3 + row * 0.58;
    const last = (i === 9);
    s.addShape(pres.ShapeType.roundRect, { x: bx, y: by + 0.08, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: last ? INK : HAIRLINE, width: last ? 1.5 : 1 } });
    s.addText(c, { x: bx + 0.42, y: by, w: 5.2, h: 0.4,
      fontFace: last ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주", { x: M, y: 5.82, w: 4, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("총알 20개를 손으로 복사했다.", { x: M, y: 6.22, w: 8, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("046 – 050회차", { x: 8.6, y: 5.98, w: 4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("프리팹과 Instantiate 로 코드가 찍어낸다.", { x: 8.6, y: 6.34, w: 4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("Is Trigger 와 Tag 가 안 되는 학생은 10주차 총알에서 통째로 막힌다. 이 둘은 주말 안에 개별 시간을 잡아서라도 되게 만든다.");
}

const out = path.join(__dirname, "9주차-부딪히게만들기.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
