// 17주차 강해진다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 6 착수. 이 덱의 주장: 이 장르의 재미는 전부 레벨업 순환에서 나온다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 10장의 "움직이는 것만 멈춘다"

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
pres.title = "17주차 · 강해진다";

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
  s.addText("17주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("강해진다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("이 장르의 재미는 전부 레벨업에서 나온다. 5회차 뒤에 게임이 달라진다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.85, 5.2, 3.4);
  s.addImage({ path: img("085_LevelUp"), x: 7.57, y: 2.07, w: 4.76, h: 2.68 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("081 – 085회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 6 · 경험치와 레벨업", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("Phase 5까지는 '잡는 게임' 이었다. 이번 주가 끝나면 '강해지는 게임' 이 된다. 085 마지막에 5분간 직접 플레이시켜 그 차이를 느끼게 한다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "쉬운 회차로 열고, 어려운 건 084에 몰려 있다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["081", "경험치 젬 드롭", "Instantiate 한 줄 — 047과 같다"],
    ["082", "자석 흡수", "Vector3.MoveTowards"],
    ["083", "경험치와 레벨업 곡선", "숫자 두 개로 한 판의 리듬이 정해진다"],
    ["084", "시간을 멈춘다", "이번 Phase 최고 난도 · 039 회수"],
    ["085", "업그레이드 3택 1", "여기서 게임이 게임이 된다"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  h3(s, M, 6.85, CW, "084를 이해 못 하면 085에서 게임이 영영 멈춘다.");
  s.addNotes("081은 일부러 쉽게 만들었다. Phase 첫날에 체력을 쓰지 않게 하고 084에 몰아준다.");
}

// ================================================================ 3. 081 Phase 6 안내
{
  const s = slide();
  head(s, "081", "지금 게임은 열 판이 다 똑같다.", "100마리를 잡아도 처음과 똑같이 약하다.");

  const c1 = code(s, M, 2.2, 6.6, [
    ["081  몬스터가 젬을 떨군다", "b"],
    "082  젬이 나한테 끌려온다",
    "083  젬을 모으면 레벨이 오른다",
    ["084  레벨이 오르면 시간이 멈춘다   ← 제일 어렵다", "b"],
    ["085  카드 세 장 중 하나를 고른다   ← 게임이 된다", "b"],
  ]);

  let y = h3(s, M, c1 + 0.4, 6.6, "첫 시간에 이 이야기를 한다.");
  body(s, M, y, 6.6,
    "5회차 뒤에 게임이 완전히 달라진다는 걸 먼저 말해준다. 오늘 코드가 Instantiate 한 줄뿐이어도 학생은 그 방향을 안다.", 1.0);

  const rx = 8.0, rw = W - M - 8.0;
  inverse(s, rx, 2.2, rw, 2.3);
  s.addText("로그라이크의 재미는\n전부 레벨업에서\n나온다.", {
    x: rx + 0.4, y: 2.55, w: rw - 0.8, h: 1.3, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });

  s.addText("한 판 안에서 점점 강해지는 것, 그리고 뭘로 강해질지 고르는 것. 이 둘이 전부다.", {
    x: rx, y: 4.8, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("Phase 6은 이 과정에서 재미가 생기는 유일한 구간이다. 첫 시간에 그 프레임을 잡아주면 5회차 내내 동기가 유지된다.");
}

// ================================================================ 4. 081 Die() 한 곳
{
  const s = slide();
  head(s, "081", "부모의 Die() 한 곳이면 3종이 다 떨군다.", "075에서 처치 수를 셀 때와 똑같다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "protected virtual void Die()",
    "{",
    "    if (GameManager.Instance != null)",
    "        GameManager.Instance.AddKill();",
    "",
    ["    if (expGemPrefab != null)", "b"],
    ["        Instantiate(expGemPrefab, transform.position,", "b"],
    ["                    Quaternion.identity);", "b"],
    "",
    "    Destroy(gameObject);",
    "}",
  ]);

  let y = h3(s, M, c1 + 0.35, 7.4, "null 검사를 왜 넣나.");
  body(s, M, y, 7.4,
    "젬을 안 떨구는 몬스터가 나중에 생긴다. 그때 Inspector 칸을 비워두면 된다. 코드를 안 고친다.", 0.9);

  shot(s, "081_Gem", 8.5, 2.15, 4.0, 2.25, "초록 젬 · Lv.4  0/14");

  s.addText("Kinematic Rigidbody 를 붙인다.\n082에서 코드로 움직일 것이라, 물리에 밀리면 안 된다.", {
    x: 8.5, y: 4.9, w: 4.0, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("Rigidbody 가 아예 없으면 유니티가 '안 움직이는 물체' 로 보고 움직일 때마다 계산을 다시 한다. Kinematic 이 정답이다.");
}

// ================================================================ 5. 082 MoveTowards
{
  const s = slide();
  head(s, "082", "셋 다 '목표로 다가간다' 인데 느낌이 다르다.", "상황에 맞는 걸 고른다.");

  const e1 = table(s, M, 2.15, 7.6, [
    ["함수", 2.8, "code", INK], ["어떻게 움직이나", 2.6, "strong", INK], ["쓰는 곳", 2.2, "", MUTED],
  ], [
    ["MoveTowards", "일정 속도, 정확히 도착", "젬 자석 (082)"],
    ["SmoothDamp", "부드럽게, 서서히 멈춤", "카메라 (068)"],
    ["Lerp", "가까울수록 느려짐", "도착이 중요하지 않을 때"],
  ], null, 0.66);

  const c1 = code(s, M, e1 + 0.4, 7.6, [
    "if (Vector2.Distance(transform.position,",
    "        player.position) > magnetRange) return;",
    "",
    ["transform.position = Vector3.MoveTowards(", "b"],
    ["    transform.position, player.position,", "b"],
    ["    moveSpeed * Time.deltaTime);", "b"],
  ]);

  const rx = 8.8, rw = W - M - 8.8;
  let y = h3(s, rx, 2.15, rw, "실측 — 범위 2.5");
  const e2 = table(s, rx, y + 0.1, rw, [["젬", 1.7, "code", INK], ["결과", 2.0, "", MUTED]], [
    ["거리 2.00", "끌려와 먹힘"],
    ["거리 4.00", "4.00 그대로"],
  ], null, 0.6);

  s.addText("젬은 딱 도착해야 한다. 그래서 MoveTowards 다.", {
    x: rx, y: e2 + 0.3, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("Lerp 는 영원히 조금씩 남아서 먹히는 순간이 애매해진다. 도착이 중요한 곳에는 MoveTowards 를 쓴다.");
}

// ================================================================ 6. 082 숫자가 게임을 바꾼다
{
  const s = slide();
  head(s, "082", "숫자 하나가 게임 느낌을 바꾼다.", "코드는 세 줄이다. 시간은 값을 정하는 데 쓴다.");

  const e1 = table(s, M, 2.15, 6.4, [
    ["자석 범위", 2.2, "code", INK], ["느낌", 4.2, "", MUTED],
  ], [
    ["1", "거의 밟아야 먹는다"],
    ["2.5", "스쳐 지나가면 먹힌다 — 기본값"],
    ["6", "가만히 서 있어도 다 온다"],
    ["20", "주울 필요가 없어진다"],
  ], null, 0.62);

  let y = h3(s, M, e1 + 0.4, 6.4, "20으로 하면 편하지만 재미가 없다.");
  body(s, M, y, 6.4,
    "젬이 어디 있는지 보고 거기로 갈지 말지 정하는 게 판단이다. 077에서 칼 개수를 정할 때와 같은 이야기다.", 0.95);

  const rx = 7.8, rw = W - M - 7.8;
  const e2 = table(s, rx, 2.15, rw, [["끌리는 속도", 2.2, "code", INK], ["느낌", 2.5, "", MUTED]], [
    ["2", "느릿느릿. 답답하다"],
    ["8", "착 붙는다 — 기본값"],
    ["30", "순간이동처럼 보인다"],
  ], null, 0.62);

  let y2 = h3(s, rx, e2 + 0.4, rw, "학생이 직접 정한다.");
  s.addText("데모 때 \"저는 범위를 ○○로 했고 이유는 ○○입니다\" 한 문장을 말하게 한다. 그게 게임 디자인이다.", {
    x: rx, y: y2 + 0.05, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("강한 게 재미있는 게 아니다. 077의 칼 개수, 079의 관통 수에 이어 세 번째로 같은 이야기를 한다.");
}

// ================================================================ 7. 083 곡선
{
  const s = slide();
  head(s, "083", "몇 개 모아야 레벨이 오를까.", "숫자 두 개로 한 판의 리듬 전체가 정해진다.");

  const c1 = code(s, M, 2.15, 7.0, [
    ["① 고정      5, 5, 5, 5, 5 …        후반이 너무 쉽다", "c"],
    ["② 더하기    5, 8, 11, 14, 17 …     완만하게 어려워진다", "b"],
    ["③ 곱하기    5, 10, 20, 40, 80 …    금방 벽에 부딪힌다", "c"],
  ]);

  const c2 = code(s, M, c1 + 0.4, 7.0, [
    ["public int NeedExp => baseExp + (Level - 1) * expStep;", "b"],
  ]);

  let y = h3(s, M, c2 + 0.4, 7.0, "=> 는 저장이 아니라 계산이다.");
  body(s, M, y, 7.0,
    "물어볼 때마다 계산한다. 레벨이 오르면 값이 자동으로 바뀐다. 따로 갱신할 필요가 없다.", 0.9);

  const rx = 8.2, rw = W - M - 8.2;
  const e1 = table(s, rx, 2.15, rw, [
    ["Level", 1.3, "code", MUTED], ["계산", 2.0, "code", INK], ["필요", 1.0, "code", INK],
  ], [
    ["1", "5 + 0×3", "5"],
    ["2", "5 + 1×3", "8"],
    ["3", "5 + 2×3", "11"],
    ["4", "5 + 3×3", "14"],
  ], null, 0.6);

  s.addText("실측 — HUD 가 0/5 → 0/8 → 0/11 → 0/14 로 늘어났다.", {
    x: rx, y: e1 + 0.3, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("게임 디자인은 코드가 아니라 숫자다. 같은 코드로 완전히 다른 게임이 나온다.");
}

// ================================================================ 8. 083 while vs if
{
  const s = slide();
  head(s, "083", "if 로 쓰면 젬을 20개 먹어도 1레벨.", "그리고 남는 경험치가 사라진다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "public void AddExp(int amount)",
    "{",
    "    Exp += amount;",
    "",
    ["    while (Exp >= NeedExp)   // if 가 아니다", "b"],
    "    {",
    ["        Exp -= NeedExp;      // = 0 이 아니다", "b"],
    "        Level++;",
    "    }",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.4, [
    ["틀린 코드", 2.8, "code", INK], ["무슨 일이 나나", 4.6, "", MUTED],
  ], [
    ["if (Exp >= NeedExp)", "한 번에 여러 레벨이 안 오른다"],
    ["Exp = 0", "초과분이 사라진다"],
  ], null, 0.6);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "직접 겪게 한다.");
  s.addText("if 로 바꾼 뒤 AddExp(100) 을 한 번 부르게 한다. 레벨이 1만 오르는 걸 보면 설명이 필요 없다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("Exp -= NeedExp 는 061에서 목숨을 깎던 것과 같은 이야기다. 쓴 만큼만 뺀다.", {
    x: rx, y: 4.6, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("NeedExp 가 0 이하가 되면 while 이 무한 루프에 빠져 유니티가 멈춘다. baseExp 는 1 이상이어야 한다.");
}

// ================================================================ 9. 084 deltaTime 이 0
{
  const s = slide();
  head(s, "084", "039에서 곱했던 그거다.", "timeScale 은 Time.deltaTime 을 0으로 만드는 스위치다.");

  const c1 = code(s, M, 2.15, 7.8, [
    ["// 039회차", "c"],
    "transform.position += Vector3.right * moveSpeed * Time.deltaTime;",
    "",
    ["Time.timeScale = 1     →  deltaTime ≈ 0.016  →  정상 속도", "b"],
    ["Time.timeScale = 0.5   →  deltaTime ≈ 0.008  →  절반 속도", "b"],
    ["Time.timeScale = 0     →  deltaTime  = 0     →  안 움직인다", "b"],
  ]);

  let y = h3(s, M, c1 + 0.4, 7.8, "게임이 꺼지는 게 아니다.");
  y = body(s, M, y, 7.8,
    "Update 는 계속 돈다. 다만 Time.deltaTime 이 0이라 곱한 값이 전부 0이 된다. 이 문장 하나가 084의 전부다.", 0.95);

  const rx = 9.0, rw = W - M - 9.0;
  inverse(s, rx, 2.15, rw, 2.4);
  s.addText("039에서\n\"왜 곱하지\" 했던 게\n10주 뒤에\n게임을 멈춘다.", {
    x: rx + 0.35, y: 2.5, w: rw - 0.7, h: 1.7, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("039 실습 씬을 실제로 열어서 코드를 띄운다. 그 다음에 'deltaTime 이 0이 되면?' 을 묻고 학생 답을 기다린다.");
}

// ================================================================ 10. 084 뭐가 멈추나
{
  const s = slide();
  head(s, "084", "뭐가 멈추고 뭐가 안 멈추나.", "이 표를 모르면 085에서 버튼이 안 눌린다.");

  const e1 = table(s, M, 2.15, 7.2, [
    ["", 3.0, "strong", INK], ["멈추나?", 1.6, "code", INK], ["왜", 2.6, "", MUTED],
  ], [
    ["몬스터 · 칼 · 젬 · 총", "멈춘다", "deltaTime 을 곱했다"],
    ["웨이브 코루틴", "멈춘다", "WaitForSeconds"],
    ["Update 자체", "안 멈춘다", "값이 0일 뿐"],
    ["Input · UI 클릭", "안 멈춘다", "시간과 무관"],
    ["Time.unscaledTime", "계속 는다", "실제 시간"],
  ], null, 0.6);

  const c1 = code(s, M, e1 + 0.4, 7.2, [
    ["Update 는 돈다. deltaTime=0  time=42.13  unscaled=45.80", "c"],
  ], true);
  s.addText("실측 — 멈춘 상태에서 Update 안에 찍은 로그", {
    x: M, y: c1 + 0.12, w: 7.2, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.4, rw = W - M - 8.4;
  s.addShape(pres.ShapeType.roundRect, { x: rx, y: 2.15, w: rw, h: 2.0, rectRadius: R_MD,
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("움직이는 것만\n멈춘다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("그래서 HUD 도 갱신되고 키도 먹힌다. 085의 카드 클릭이 되는 이유가 여기 있다.", {
    x: rx + 0.4, y: 3.35, w: rw - 0.8, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: "DCE8FF",
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addText("연출을 만들 땐 unscaledDeltaTime 을 써야 한다. deltaTime 으로 만들면 영원히 안 움직인다.", {
    x: rx, y: 4.5, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("이 목록은 말로 설명하지 말고 멈춘 상태에서 하나씩 눌러보며 확인시킨다. 확인 뒤 Debug.Log 는 반드시 지운다.");
}

// ================================================================ 11. 084 세 번째 사고
{
  const s = slide();
  head(s, "084", "timeScale = 1 을 빼면 영영 멈춘다.", "057 · 080 에 이어 세 번째로 같은 사고다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "public void Close()",
    "{",
    "    panel.SetActive(false);",
    "",
    ["    Time.timeScale = 1f;   // 이걸 빼면 끝이다", "b"],
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.4, [
    ["회차", 1.6, "code", MUTED], ["상황", 2.8, "strong", INK], ["같은 사고", 3.0, "", MUTED],
  ], [
    ["057", "미니게임 재시작", "다시 열어도 멈춰 있다"],
    ["080", "본 프로젝트 게임오버", "R 을 눌러도 멈춰 있다"],
    ["084", "레벨업 창 닫기", "고르고 나서 안 움직인다"],
  ], null, 0.62);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "일부러 빼고\n실행해 보여준다.");
  s.addText("\"이제 아무것도 못 합니다\" 를 한 번 겪으면 세 번째 사고는 안 난다. 말로 세 번 하는 것보다 낫다.", {
    x: rx, y: 3.3, w: rw, h: 1.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("084는 빈 창에 아무 키나 눌러 닫는다. 카드는 085에서 붙인다.", {
    x: rx, y: 5.1, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("Input 이 먹히는 이유를 여기서 다시 짚는다. Input 은 키보드를 직접 읽으므로 시간과 상관이 없다.");
}

// ================================================================ 12. 085 카드 UI
{
  const s = slide();
  head(s, "085", "EventSystem 이 없으면 아무것도 안 눌린다.", "Canvas 를 코드로 만들었으면 같이 안 생긴다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["필요한 것", 3.2, "code", INK], ["없으면", 4.2, "", MUTED],
  ], [
    ["EventSystem", "클릭이 아예 안 먹는다"],
    ["Graphic Raycaster", "Canvas 가 클릭을 못 받는다"],
    ["Button 컴포넌트", "Image 는 눌러도 반응이 없다"],
  ], null, 0.66);

  let y = h3(s, M, e1 + 0.4, 7.4, "카드는 Image + Button + 자식 Label.");
  y = body(s, M, y, 7.4,
    "300 × 300 크기로 셋을 330 씩 벌려 놓는다. 056에서 만든 Canvas 위에 얹는 것뿐이다.", 0.9);

  const rx = 8.6, rw = W - M - 8.6;
  const c1 = code(s, rx, 2.15, rw, [
    ["LevelUpPanel", "b"],
    "  ├ Title",
    "  ├ Card_0",
    "  │   └ Label",
    "  ├ Card_1",
    "  └ Card_2",
  ]);
  s.addText("패널은 Start 에서 꺼둔다. 안 그러면 처음부터 떠 있다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("버튼이 안 눌린다는 질문의 대부분은 EventSystem 이다. Hierarchy 를 먼저 보게 한다.");
}

// ================================================================ 13. 085 두 함정
{
  const s = slide();
  head(s, "085", "함정 두 개가 같은 슬라이드에 있다.", "둘 다 겪게 한 뒤에 고친다.");

  const c1 = code(s, M, 2.15, 7.6, [
    "for (int i = 0; i < buttons.Length; i++)",
    "{",
    ["    UpgradeType type = picked[i];   // 지역 변수에 담는다", "b"],
    "",
    "    labels[i].text = Describe(type);",
    "",
    ["    buttons[i].onClick.RemoveAllListeners();", "b"],
    "    buttons[i].onClick.AddListener(() => Choose(type));",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.6, [
    ["빠뜨리면", 3.4, "code", INK], ["무슨 일이 나나", 4.2, "", MUTED],
  ], [
    ["RemoveAllListeners", "3레벨에 한 번 눌러 3개 적용"],
    ["지역 변수에 담기", "세 카드가 전부 같은 효과"],
  ], null, 0.62);

  const rx = 8.8, rw = W - M - 8.8;
  let y = h3(s, rx, 2.15, rw, "다시 붙일 땐\n먼저 지운다.");
  s.addText("077에서 칼이 쌓이던 것과 같은 종류의 사고다. 이번 Phase 에서 두 번째다.", {
    x: rx, y: 3.3, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("() => Choose(type) 은 \"누르면 이걸 해라\" 라고 적어두는 것. 지금은 그 이상 설명하지 않는다.", {
    x: rx, y: 4.9, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("람다와 클로저 캡처를 정면으로 설명하지 않는다. '반복문 변수는 지역 변수에 담는다' 라는 규칙으로만 준다.");
}

// ================================================================ 14. 085 Apply
{
  const s = slide();
  head(s, "085", "077에서 public 으로 열어둔 게 여기서 값을 한다.", "칼 개수를 올리고 다시 배치하면 끝이다.");

  const c1 = code(s, M, 2.15, 7.5, [
    ["// MeleeRing — 077의 Build() 를 그대로 쓴다", "c"],
    "public void AddBlade()",
    "{",
    ["    bladeCount++;", "b"],
    ["    Build();", "b"],
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.35, 7.5, [
    "switch (type)",
    "{",
    "    case UpgradeType.BladeCount: meleeRing.AddBlade(); break;",
    "    case UpgradeType.FireRate:   autoGun.SpeedUp(0.06f, 0.12f); break;",
    "    case UpgradeType.MoveSpeed:  playerController.SpeedUp(0.6f); break;",
    "}",
  ]);

  const rx = 8.7, rw = W - M - 8.7;
  let y = h3(s, rx, 2.15, rw, "실측");
  const e1 = table(s, rx, y + 0.1, rw, [["고른 카드", 1.9, "code", INK], ["결과", 1.8, "code", INK]], [
    ["BladeCount", "칼 3 → 4"],
    ["FireRate", "0.50 → 0.44"],
    ["MoveSpeed", "5.0 → 5.6"],
  ], null, 0.6);

  s.addText("칼 4자루의 위치가 (2,0) (0,2) (−2,0) (0,−2) — 정확히 90도로 다시 퍼졌다.", {
    x: rx, y: e1 + 0.3, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("Mathf.Max 로 하한을 두지 않으면 연사 간격이 음수가 된다. 074의 웨이브 간격과 같은 사고, 세 번째다.");
}

// ================================================================ 15. 085 실측
{
  const s = slide();
  head(s, "085", "실측 — 5회차의 결승선.", "레벨업 → 시간 정지 → 카드 3장 → 강해짐 → 재개.");

  shot(s, "085_LevelUp", M, 2.15, 6.5, 3.66, "Lv.2 · timeScale 0 · 서로 다른 카드 3장");

  const rx = 7.75, rw = W - M - 7.75;
  const e1 = table(s, rx, 2.15, rw, [
    ["확인한 것", 2.5, "strong", INK], ["측정값", 2.25, "code", INK],
  ], [
    ["레벨업 순간", "timeScale = 0"],
    ["카드 3장", "전부 다른 종류"],
    ["칼 카드 클릭", "칼 3 → 4"],
    ["클릭 직후", "timeScale = 1"],
    ["HUD", "Lv.2  0/8"],
  ], null, 0.56);

  s.addText("멈춘 동안 젬도 몬스터도 멈춰 있고, HUD 숫자와 클릭만 살아 있다.", {
    x: rx, y: e1 + 0.25, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("085 마지막에 5분간 각자 한 판 하게 한다. 칼만 고른 사람과 연사만 고른 사람의 차이를 이야기하면 다음 주 8종으로 자연스럽게 이어진다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "이번 주 종료 조건.", "다섯 개다. 다음 주는 8종과 데이터 분리다.");

  const chk = [
    "몬스터가 죽으면 젬을 떨군다",
    "가까이 가면 젬이 끌려온다",
    "젬을 모으면 레벨이 오른다",
    "레벨업하면 시간이 멈추고 카드 3장이 뜬다",
    "카드를 고르면 실제로 강해진다",
  ];
  chk.forEach((c, i) => {
    const by = 2.3 + i * 0.55;
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by + 0.06, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: i === 4 ? INK : HAIRLINE, width: i === 4 ? 1.5 : 1 } });
    s.addText(c, { x: M + 0.42, y: by, w: 6.4, h: 0.4,
      fontFace: i === 4 ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["새 문법", 2.3, "code", INK], ["회차", 2.65, "", MUTED]], [
    ["Vector3.MoveTowards", "082"],
    ["=> 계산 프로퍼티", "083"],
    ["Time.timeScale", "084 (039 회수)"],
    ["Button.onClick", "085"],
  ], null, 0.55);
  s.addText("네 개뿐이다. 나머지는 전부 조합이다.", {
    x: rx, y: 4.95, w: rw, h: 0.32, fontFace: F_SEMI, fontSize: T.body, color: INK,
    margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 18주차", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("코드 8군데를 고쳐본 뒤에 SO 를 연다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("086 – 090회차", { x: 9.2, y: 5.98, w: 3.4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("업그레이드 8종 · ScriptableObject · 보스.", { x: 9.2, y: 6.34, w: 3.4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("087 전에 반드시 '공격력 20%를 25%로 바꾸세요' 를 시킨다. 불편을 겪지 않으면 SO 를 왜 쓰는지 이해하지 못하고 코드만 베낀다.");
}

const out = path.join(__dirname, "17주차-강해진다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
