// 16주차 알아서 싸운다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 5 마무리. 이 덱의 주장: 무기 2종과 코어 루프를 만들었는데 새 문법은 셋뿐이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 15장의 코어 루프 한 바퀴

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
pres.title = "16주차 · 알아서 싸운다";

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
  s.addText("16주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("버튼이 없다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("무기가 알아서 싸운다. 그리고 Phase 5가 한 바퀴 돈다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.85, 5.2, 3.4);
  s.addImage({ path: img("076_Blades"), x: 7.57, y: 2.07, w: 4.76, h: 2.68 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("076 – 080회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 5 · 무기와 코어 루프", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("Phase 5의 종료 조건은 재미가 아니라 '한 바퀴' 다. 080에서 시작→전투→사망→게임오버→재시작이 돌면 끝이다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "새 문법은 셋. 나머지는 3개월치 회수다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["076", "회전 무기 ① 도는 칼", "033 로봇팔 · OnTriggerStay2D"],
    ["077", "회전 무기 ② 개수 늘리기", "각도 분배 · Mathf.Deg2Rad"],
    ["078", "자동 조준", "4주차 최솟값 · Gizmos"],
    ["079", "발사와 관통", "047 총알 · pierce--"],
    ["080", "코어 루프 완성", "무적시간 · 057 게임오버"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  h3(s, M, 6.85, CW, "새 문법은 OnTriggerStay2D · Mathf.Deg2Rad · Gizmos 뿐이다.");
  s.addNotes("080 회고에서 이 표를 다시 띄운다. 15회차 동안 진짜 새로 배운 건 네 개 정도라는 걸 학생이 직접 세어보게 한다.");
}

// ================================================================ 3. 076 버튼이 없다
{
  const s = slide();
  head(s, "076", "\"공격 버튼이 없어요?\"", "반드시 나오는 질문이다. 답이 오늘의 절반이다.");

  const rx0 = M;
  inverse(s, rx0, 2.2, 6.6, 1.9);
  s.addText("이 장르는 어디로 움직일지만 정하는 게임이다.", {
    x: rx0 + 0.4, y: 2.5, w: 5.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("100마리를 일일이 조준하면 손만 아프다. 대신 어느 무리에 뛰어들지를 계속 정한다.", {
    x: rx0 + 0.4, y: 3.4, w: 5.8, h: 0.6, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  let y = h3(s, M, 4.45, 6.6, "그래서 075의 Space 를 뗀다.");
  body(s, M, y, 6.6,
    "PlayerAttack 컴포넌트를 Player 에서 뗀다. 스크립트 파일은 남겨둔다 — 지운 게 아니라 무기로 대체한 것이다.", 0.95);

  const rx = 8.0, rw = W - M - 8.0;
  let ry = h3(s, rx, 2.2, rw, "033 로봇팔을 다시 연다.");
  const c1 = code(s, rx, ry + 0.1, rw, [
    ["Player", "b"],
    "  └ Blades      ← 이게 돈다",
    "      └ Blade   ← 공전한다",
  ]);
  s.addText("부모를 돌리면 자식이 궤도를 그린다. Player 에 직접 붙이면 캐릭터 그림까지 돈다. 그래서 중간에 빈 오브젝트를 하나 둔다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("033 로봇팔 씬을 실제로 열어서 Shoulder 를 돌려 보여준다. 3개월 전에 배운 게 오늘 무기가 된다.");
}

// ================================================================ 4. 076 Enter vs Stay
{
  const s = slide();
  head(s, "076", "Enter 는 한 번뿐이다.", "칼 궤도 안에 갇힌 몬스터는 한 대만 맞는다.");

  const e1 = table(s, M, 2.15, 7.2, [
    ["함수", 2.8, "code", INK], ["언제 불리나", 2.4, "strong", INK], ["배운 회차", 2.0, "", MUTED],
  ], [
    ["OnTriggerEnter2D", "닿는 순간 한 번", "044"],
    ["OnTriggerStay2D", "닿아 있는 동안 계속", "오늘"],
    ["OnTriggerExit2D", "떨어지는 순간 한 번", "069"],
  ], null, 0.6);

  const c1 = code(s, M, e1 + 0.4, 7.2, [
    "private void OnTriggerStay2D(Collider2D other)",
    "{",
    ["    if (Time.time < nextHitTime) return;", "b"],
    "    if (!other.CompareTag(\"Enemy\")) return;",
    "",
    ["    nextHitTime = Time.time + hitInterval;", "b"],
    "    target.TakeDamage(damage);",
    "}",
  ]);

  const rx = 8.4, rw = W - M - 8.4;
  let y = h3(s, rx, 2.15, rw, "Stay 에 쿨다운이\n없으면?");
  s.addText("매 프레임 피해가 들어간다. 075에서 Space 를 꾹 눌렀을 때와 똑같은 문제이고, 해결도 똑같이 Time.time 이다.", {
    x: rx, y: 3.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("쿨다운은 칼 한 자루에 하나다. 여러 마리에 동시에 닿아도 0.3초에 한 번. 몬스터별로 세는 건 지금 필요 없다.", {
    x: rx, y: 5.0, w: rw, h: 1.3, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("먼저 Enter 로 만들어 궤도에 갇힌 몬스터가 한 대만 맞는 걸 보여준 뒤 Stay 로 바꾼다. 문제를 겪게 하는 게 먼저다.");
}

// ================================================================ 5. 077 손으로 놓아보기
{
  const s = slide();
  head(s, "077", "먼저 손으로 6개를 놓게 한다.", "5분이면 학생이 짜증을 낸다. 그 짜증이 코드를 쓰는 이유다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["학생이 겪는 것", 3.6, "strong", INK], ["왜", 3.8, "", MUTED],
  ], [
    ["간격이 어긋난다", "60도를 눈으로 맞출 수 없다"],
    ["Position 을 못 정한다", "대각선 자리의 x, y 를 모른다"],
    ["개수를 바꾸면 처음부터", "5개로 바꾸려면 전부 다시"],
  ], null, 0.66);

  let y = h3(s, M, e1 + 0.4, 7.4, "미리 설명하면 안 와닿는다.");
  body(s, M, y, 7.4,
    "\"코드로 하면 편해요\" 를 먼저 말하면 그냥 받아적는다. 손으로 해보고 나면 코드가 답이라는 걸 스스로 안다.", 0.95);

  const rx = 8.6, rw = W - M - 8.6;
  const c1 = code(s, rx, 2.15, rw, [
    ["3개 → 360÷3 = 120도", "c"],
    "  0 · 120 · 240",
    "",
    ["6개 → 360÷6 = 60도", "c"],
    "  0 · 60 · 120 ·",
    "  180 · 240 · 300",
  ]);
  s.addText("069에서 타일을 원형으로 놓아본 그 계산이다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("5분을 진짜로 준다. 시간이 아깝게 느껴져도 이 5분이 다음 15분을 만든다.");
}

// ================================================================ 6. 077 각도 분배
{
  const s = slide();
  head(s, "077", "개수만 바꾸면 알아서 퍼진다.", "실행 중에 1 → 3 → 6 → 12 로 바꿔 보여준다.");

  const c1 = code(s, M, 2.15, 7.3, [
    "for (int i = 0; i < bladeCount; i++)",
    "{",
    ["    float angle = 360f / bladeCount * i;", "b"],
    ["    float rad = angle * Mathf.Deg2Rad;", "b"],
    "",
    "    GameObject blade = Instantiate(bladePrefab, transform);",
    "",
    "    blade.transform.localPosition = new Vector3(",
    "        Mathf.Cos(rad) * radius, Mathf.Sin(rad) * radius, 0f);",
    "}",
  ]);

  let y = h3(s, M, c1 + 0.35, 7.3, "Mathf.Deg2Rad 를 빼면 한 자리에 몰린다.");
  body(s, M, y, 7.3,
    "Cos/Sin 은 도가 아니라 라디안을 받는다. 라디안이 뭔지는 몰라도 된다 — \"각도를 넣을 땐 * Mathf.Deg2Rad\" 만 외우면 된다.", 0.95);

  shot(s, "077_SixBlades", 8.4, 2.15, 4.1, 2.31, "bladeCount = 6 · 정확히 60도 간격");

  s.addText("실측 — 6개의 localPosition\n(2, 0) (1, 1.73) (−1, 1.73)\n(−2, 0) (−1, −1.73) (1, −1.73)", {
    x: 8.4, y: 5.1, w: 4.1, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("Phase 6 레벨업에서 bladeCount 를 올리고 Build() 를 다시 부른다. 오늘 만든 게 그대로 쓰인다는 걸 예고한다.");
}

// ================================================================ 7. 077 뒤에서부터 지우기
{
  const s = slide();
  head(s, "077", "지울 때는 뒤에서부터.", "앞에서부터 지우면 절반만 지워진다.");

  const c1 = code(s, M, 2.15, 7.2, [
    ["for (int i = transform.childCount - 1; i >= 0; i--)", "b"],
    "{",
    "    Destroy(transform.GetChild(i).gameObject);",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.2, [
    ["앞에서부터", 3.4, "", MUTED], ["무슨 일이 나나", 3.8, "strong", INK],
  ], [
    ["i=0 을 지운다", "뒤가 한 칸씩 당겨진다"],
    ["i=1 로 간다", "원래 2번을 보게 된다 — 1번을 건너뛴다"],
    ["결과", "절반만 지워지고 칼이 쌓인다"],
  ], null, 0.62);

  const rx = 8.4, rw = W - M - 8.4;
  inverse(s, rx, 2.15, rw, 2.1);
  s.addText("Build() 를 다시\n부를 때마다\n칼이 쌓인다.", {
    x: rx + 0.35, y: 2.45, w: rw - 0.7, h: 1.2, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  let y = h3(s, rx, 4.6, rw, "일부러 겪게 한다.");
  s.addText("앞에서부터 지우는 for 로 한 번 실행해 몇 개가 남는지 세어보게 한다. 설명보다 빠르다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("이 함정은 리스트를 다루는 어떤 언어에서도 똑같이 나온다. 여기서 한 번 겪어두면 평생 쓴다.");
}

// ================================================================ 8. 078 064와 뭐가 다른가
{
  const s = slide();
  head(s, "078", "씬 전체를 뒤지지 않는다.", "미니게임은 10마리였고, 지금은 100마리가 넘는다.");

  const e1 = table(s, M, 2.15, 7.6, [
    ["", 2.4, "strong", INK], ["064 미니게임", 2.6, "code", MUTED], ["078 본 프로젝트", 2.6, "code", INK],
  ], [
    ["적 찾는 법", "FindGameObjects", "OverlapCircleAll"],
    ["보는 범위", "씬 전체", "사거리 안만"],
    ["적 수", "10마리", "100마리+"],
  ], null, 0.66);

  let y = h3(s, M, e1 + 0.4, 7.6, "사거리 밖은 어차피 못 쏜다.");
  body(s, M, y, 7.6,
    "볼 필요가 없는 걸 보지 않는 것 — 최적화의 첫 번째 원칙이다. 알고리즘을 바꾼 게 아니라 보는 대상을 줄였다.", 0.95);

  const rx = 8.8, rw = W - M - 8.8;
  let ry = h3(s, rx, 2.15, rw, "오늘은 쏘지 않는다.");
  s.addText("조준까지만 만들고 눈으로 확인한다. 발사까지 한 번에 하면 엉뚱한 적을 쏠 때 조준이 틀린 건지 발사가 틀린 건지 알 수 없다.", {
    x: rx, y: ry + 0.05, w: rw, h: 1.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("한 회차에 하나씩 만들고 확인하는 습관을 여기서 명시적으로 가르친다. 078은 조준, 079는 발사.");
}

// ================================================================ 9. 078 최솟값 찾기
{
  const s = slide();
  head(s, "078", "4주차 콘솔과 같은 코드다.", "비교 대상이 숫자가 아니라 거리일 뿐이다.");

  const c1 = code(s, M, 2.15, 6.0, [
    ["// 4주차 · 콘솔", "c"],
    "int min = scores[0];",
    "",
    "for (i)",
    "    if (scores[i] < min)",
    "        min = scores[i];",
  ]);

  const c2 = code(s, 7.15, 2.15, W - M - 7.15, [
    ["// 078 · 조준", "c"],
    "float minDistance = float.MaxValue;",
    "Transform nearest = null;",
    "",
    "foreach (hit)",
    "    if (distance < minDistance)",
    "    { minDistance = distance;",
    "      nearest = hit.transform; }",
  ]);

  let y = h3(s, M, Math.max(c1, c2) + 0.45, CW,
    "다른 건 둘 — 비교 대상이 거리라는 것, 그리고 \"누구였는지\" 도 기록한다는 것.");

  const e1 = table(s, M, y + 0.35, CW, [
    ["시작값", 2.6, "code", INK], ["왜", 9.0, "", MUTED],
  ], [
    ["float.MaxValue", "첫 번째 적이 무조건 이기게. 0f 로 시작하면 아무도 못 이긴다"],
    ["nearest = null", "사거리 안에 아무도 없을 수 있다. null 이 \"없다\" 를 알려준다"],
  ], null, 0.6);

  s.addNotes("0f 로 시작하면 아무도 안 잡히는 걸 한 번 실행해서 보여준다. 도전 미션 1번이기도 하다.");
}

// ================================================================ 10. 078 Gizmos
{
  const s = slide();
  head(s, "078", "숫자보다 선 하나가 빠르다.", "보이는 걸 만들면 디버깅이 쉬워진다.");

  const c1 = code(s, M, 2.15, 7.2, [
    "private void OnDrawGizmosSelected()",
    "{",
    ["    Gizmos.color = Color.cyan;", "b"],
    ["    Gizmos.DrawWireSphere(transform.position, range);", "b"],
    "",
    "    if (CurrentTarget != null)",
    "    {",
    ["        Gizmos.color = Color.red;", "b"],
    ["        Gizmos.DrawLine(transform.position, CurrentTarget.position);", "b"],
    "    }",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.2, [
    ["함수", 3.2, "code", INK], ["언제 그려지나", 4.0, "", MUTED],
  ], [
    ["OnDrawGizmos", "항상 (선택 안 해도)"],
    ["OnDrawGizmosSelected", "선택했을 때만"],
  ], null, 0.54);

  const rx = 8.4, rw = W - M - 8.4;
  let y = h3(s, rx, 2.15, rw, "Scene 뷰에만\n나온다.");
  s.addText("Game 뷰에도, 빌드한 게임에도 안 보인다. 개발용 표시다. Gizmo 가 안 보인다는 질문의 절반은 Game 뷰를 보고 있어서다.", {
    x: rx, y: 3.3, w: rw, h: 1.7, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("하늘색 원 = 사거리\n빨간 선 = 지금 조준 중인 적", {
    x: rx, y: 5.2, w: rw, h: 0.9, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("선이 가장 가까운 적을 따라 탁탁 옮겨 다니는 걸 Scene 뷰로 보여준다. 이 회차의 정점이다.");
}

// ================================================================ 11. 079 transform.up
{
  const s = slide();
  head(s, "079", "방향 벡터를 up 에 넣으면 끝이다.", "Quaternion 계산을 직접 할 필요가 없다.");

  const c1 = code(s, M, 2.15, 7.6, [
    "Vector2 dir = ((Vector2)CurrentTarget.position",
    "               - (Vector2)transform.position).normalized;",
    "",
    "GameObject shot = Instantiate(",
    "    projectilePrefab, transform.position, Quaternion.identity);",
    "",
    ["shot.transform.up = dir;   // 064에서 배운 그 한 줄", "b"],
  ]);

  let y = h3(s, M, c1 + 0.4, 7.6, "이 줄을 빼면 전부 위로만 날아간다.");
  y = body(s, M, y, 7.6,
    "일부러 빼고 한 번 실행해 보여준다. 총알이 적을 향하지 않고 일제히 위로 가는 그림이 설명보다 빠르다.", 0.95);

  const rx = 8.8, rw = W - M - 8.8;
  const c2 = code(s, rx, 2.15, rw, [
    ["// Projectile.Start", "c"],
    "rb.linearVelocity =",
    "    transform.up * speed;",
    "",
    "Destroy(gameObject,",
    "        lifeTime);",
  ]);
  s.addText("047의 Bullet 과 뼈대가 같다. 달라진 건 IDamageable 을 쓴다는 것뿐이다.", {
    x: rx, y: c2 + 0.3, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("Destroy(gameObject, lifeTime) 를 빼면 총알이 영원히 날아간다. 048에서 겪은 사고가 여기서 다시 나온다.");
}

// ================================================================ 12. 079 코루틴으로 옮긴다
{
  const s = slide();
  head(s, "079", "매 프레임 조준할 이유가 없다.", "078에서 남겨둔 숙제를 여기서 회수한다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["", 2.4, "strong", INK], ["Update (078)", 2.5, "", MUTED], ["코루틴 (079)", 2.5, "", INK],
  ], [
    ["조준 횟수", "초당 60번", "초당 2번"],
    ["100마리일 때", "초당 6000번 계산", "초당 200번"],
    ["쏘는 횟수", "초당 2번", "초당 2번"],
  ], null, 0.66);

  const c1 = code(s, M, e1 + 0.4, 7.4, [
    "while (true)",
    "{",
    ["    yield return new WaitForSeconds(fireInterval);", "b"],
    "    CurrentTarget = FindNearest();",
    ["    if (CurrentTarget == null) continue;   // 다음 바퀴로", "b"],
    "    ... 발사 ...",
    "}",
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "왜 078에선\nUpdate 였나.");
  s.addText("Gizmo 로 매 프레임 조준선을 보고 싶어서였다. 실제 이유를 그대로 말해준다. 학생은 이런 답을 기억한다.", {
    x: rx, y: 3.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("옮기고 나면 조준선이 뚝뚝 끊겨 보인다. 정상이다 — 성능을 택한 결과다.", {
    x: rx, y: 5.0, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("continue 와 yield break 의 차이를 짚는다. continue 는 다음 바퀴로, break 는 코루틴 종료(051).");
}

// ================================================================ 13. 079 관통
{
  const s = slide();
  head(s, "079", "오늘 완전히 새로운 건 이 한 줄이다.", "숫자를 깎고, 0이면 사라진다. 061의 목숨과 같은 구조다.");

  const c1 = code(s, M, 2.15, 7.2, [
    "target.TakeDamage(damage);",
    "",
    ["pierce--;", "b"],
    "",
    "if (pierce <= 0)",
    "{",
    "    Destroy(gameObject);",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.2, [
    ["pierce", 2.0, "code", INK], ["결과", 5.2, "", MUTED],
  ], [
    ["1", "한 마리 맞고 사라진다 (047과 같다)"],
    ["2", "두 마리를 뚫는다"],
    ["999", "화면을 쓸어버린다 — 재미가 없다"],
  ], null, 0.6);

  const rx = 8.4, rw = W - M - 8.4;
  let y = h3(s, rx, 2.15, rw, "프리팹 원본은\n안 깎인다.");
  s.addText("총알마다 자기 pierce 를 갖는다. 복사본의 값이 줄어드는 것이지 원본이 줄어드는 게 아니다 (046).", {
    x: rx, y: 3.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  inverse(s, rx, 5.0, rw, 1.5);
  s.addText("pierce-- 를 빼면\n한 발로 화면을 쓴다.", {
    x: rx + 0.35, y: 5.3, w: rw - 0.7, h: 0.9, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("999 를 실제로 넣어 보여주면 학생이 '너무 세면 재미없다' 를 스스로 말한다. 077의 칼 개수와 같은 이야기다.");
}

// ================================================================ 14. 080 무적시간
{
  const s = slide();
  head(s, "080", "무적시간은 맞는 쪽에 넣는다.", "때리는 쪽에 넣으면 몬스터가 100마리일 때 쿨다운도 100개다.");

  const c1 = code(s, M, 2.15, 7.5, [
    ["public bool IsInvincible => Time.time < invincibleUntil;", "b"],
    "",
    "public void TakeDamage(int amount)",
    "{",
    ["    if (IsInvincible) return;", "b"],
    ["    if (currentHealth <= 0) return;   // Die() 중복 방지", "b"],
    "",
    "    invincibleUntil = Time.time + invincibleTime;",
    "    ...",
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.35, 7.5, [
    ["플레이어 : -3  (남은 체력 17)", "c"],
    ["플레이어 : -3  (남은 체력 14)", "c"],
    ["...  7번 맞고", "c"],
    ["플레이어 사망", "c"],
  ], true);
  s.addText("실측 — Game.unity 방치 · 무적 0.6초 · 몬스터가 몇 마리든 같은 속도", {
    x: M, y: c2 + 0.12, w: 7.5, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.7, rw = W - M - 8.7;
  let y = h3(s, rx, 2.15, rw, "눈으로 알려준다.");
  s.addText("무적 동안 스프라이트를 반투명하게 만든다. 078의 Gizmo 와 같은 이야기 — 보이게 만들면 이해가 빠르다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("currentHealth <= 0 검사를 빼면 Die() 가 여러 번 불린다. 057의 isGameOver 와 같은 사고다.", {
    x: rx, y: 4.5, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("ChargerEnemy 를 Enter 에서 Stay 로 바꾼 뒤 무적시간 없이 한 번 실행해 순식간에 죽는 걸 보여준다.");
}

// ================================================================ 15. 080 한 바퀴
{
  const s = slide();
  head(s, "080", "실측 — 한 바퀴가 돈다.", "Phase 5의 종료 조건은 재미가 아니라 이것이다.");

  shot(s, "080_GameOver", M, 2.15, 6.3, 3.55, "웨이브 6 · 처치 51 · 체력 0/20 — 조작 없이 방치한 결과");

  const rx = 7.55, rw = W - M - 7.55;
  s.addShape(pres.ShapeType.roundRect, { x: rx, y: 2.15, w: rw, h: 1.5, rectRadius: R_MD,
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("시작 → 전투 → 사망\n→ 게임오버 → 재시작", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.95, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });

  const e1 = table(s, rx, 3.95, rw, [
    ["확인한 것", 2.5, "strong", INK], ["측정값", 2.45, "code", INK],
  ], [
    ["사망까지", "7대 · 3피해씩"],
    ["게임오버", "timeScale = 0"],
    ["R 재시작 후", "Wave 1 · hp 20/20"],
    ["재시작 상태", "Playing · scale 1"],
  ], null, 0.54);

  s.addText("재미없어도 된다. 끝까지 도는 것이 기준이다.", {
    x: rx, y: e1 + 0.22, w: rw, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    margin: 0, isTextBox: true });

  s.addNotes("066에서 자리만 만들어 둔 GameState 가 14주 만에 쓰인다. '지금 안 쓰는데 왜 넣어요' 에 대한 답이다.");
}

// ================================================================ 16. Phase 5 회고
{
  const s = slide();
  head(s, null, "Phase 5 회고 — 15회차 동안.", "진짜 새로 배운 건 네 개 정도다.");

  const e1 = table(s, M, 1.95, CW, [
    ["회차", 1.3, "code", MUTED], ["만든 것", 3.4, "strong", INK], ["회수한 것", 6.97, "", MUTED],
  ], [
    ["066–068", "착수 · 이동 · 카메라", "enum(5주) · 입력 분리 · LateUpdate"],
    ["069", "무한 맵", "— 이번 Phase 유일한 신기술"],
    ["070–072", "Enemy · IDamageable · 3종", "6주차 콘솔 설계 · 상속 · override"],
    ["073–075", "스폰 · 웨이브 · 처치", "Layer(045) · 코루틴(051) · TMP(056)"],
    ["076–080", "무기 2종 · 코어 루프", "033 로봇팔 · 4주차 최솟값 · 057 게임오버"],
  ], null, 0.48);

  s.addText("3개월 전 콘솔에서 배운 상속이 몬스터가 됐고, 로봇팔이 무기가 됐다.", {
    x: M, y: e1 + 0.16, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.7, W, H - 5.7, R_MD);
  s.addText("다음 Phase 6", { x: M, y: 6.05, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("레벨업하면 카드 세 장이 뜬다.", { x: M, y: 6.42, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("081회차 –", { x: 9.6, y: 6.18, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("그 선택이 이 장르의 진짜 재미다.", { x: 9.6, y: 6.54, w: 3.0, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("지금까지는 재미를 얹을 뼈대를 만든 것이다. Phase 6에서 경험치·레벨업·업그레이드가 붙으면 '강해지는' 게임이 된다.");
}

const out = path.join(__dirname, "16주차-알아서싸운다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
