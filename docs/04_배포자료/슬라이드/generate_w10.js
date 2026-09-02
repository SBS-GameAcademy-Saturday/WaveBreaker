// 10주차 찍어내고 없애기 — Mobbin 디자인 시스템 (DESIGN.md)
// 10주차는 코드가 내용이다. 스크린샷은 타이틀·046·047·048 네 자리에만 쓴다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 15장의 gameObject / this

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
pres.title = "10주차 · 찍어내고 없애기";

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
  s.addText("10주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("찍어내고 없애기.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("총알이 몬스터를 맞히면 체력이 깎이고 죽는다. Phase 3의 산출물이 이번 주에 나온다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("047_Instantiate"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("048_Spawn"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("046 – 050회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 3 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("이번 주 다섯 회차가 한 줄로 이어진다. 046에서 만든 프리팹을 047이 찍어내고, 047이 만든 문제(총알이 안 사라짐)를 048이 풀고, 049가 남의 부품을 여는 법을 주고, 050이 그걸로 체력을 깎는다. 순서를 바꾸면 전부 무너진다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "한 회차가 다음 회차의 문제를 만든다. 순서를 바꾸지 않는다.");
  const items = [
    ["046", "프리팹", "원본 하나를 고치면 전부 바뀐다 · Override"],
    ["047", "Instantiate", "코드가 프리팹을 찍어낸다 · 총알 발사"],
    ["048", "Destroy", "수명을 준다 · 맞으면 둘 다 사라진다 · 몬스터 스폰"],
    ["049", "GetComponent", "남의 부품을 만진다 · null 대비"],
    ["050", "체력과 피격", "5~6주차 클래스가 게임에서 돈다"],
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
  s.addNotes("046은 코드가 한 줄도 없고 050은 거의 전부 코드다. 이번 주는 Inspector에서 코드로 넘어가는 주간이다.");
}

// ================================================================ 3. 046 프리팹
{
  const s = slide();
  head(s, "046", "손으로 열 개를 고쳐 본 다음에 준다.", "프리팹을 먼저 설명하면 편한 기능 정도로 흘려듣는다.");

  table(s, M, 2.15, 7.3, [
    ["", 2.1, "strong", INK], ["어디 있나", 2.7, "", MUTED], ["고치면", 2.5, "strong", INK],
  ], [
    ["원본", "Project 창 (.prefab)", "전부 바뀐다"],
    ["복사본", "Hierarchy (파란 이름)", "그것만 바뀐다"],
  ], null, 0.74);

  s.addText("Project에 있는 게 원본, 씬에 있는 게 복사본.", {
    x: M, y: 4.35, w: 7.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("이 문장을 이 회차에 열 번 말한다. 앞으로 3주간 '프리팹 고치세요' 라고 할 때마다 필요하다.", {
    x: M, y: 4.85, w: 7.3, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  inverse(s, M, 5.5, 7.3, 1.35);
  s.addText("기획자가 내일 또 온다. \"역시 빨간색이 낫겠어요.\"", {
    x: M + 0.4, y: 5.75, w: 6.5, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("몬스터가 200마리일 때 손으로 고치는 그림을 먼저 보여준다. 불편을 겪은 뒤에 해법을 준다.", {
    x: M + 0.4, y: 6.25, w: 6.5, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });

  shot(s, "046_Prefab", 8.55, 2.15, 3.95, 2.3, "원본 하나 · 인스턴스 10개");
  s.addText("가운데 노란 하나는 색을 직접 바꿨다. 원본을 고쳐도 이 하나만 안 따라온다.", {
    x: 8.55, y: 5.05, w: 3.95, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실측: 원본 색을 초록으로 바꾸니 10개 중 9개가 따라오고 Override 를 건 1개는 노란색을 유지했다. 강사가 직접 열 개를 천천히 고치는 시연을 5개쯤에서 멈추는 게 이 회차의 도입이다.");
}

// ================================================================ 4. 046 Override
{
  const s = slide();
  head(s, "046", "왜 얘만 안 바뀌죠.", "한 번 손댄 항목은 원본을 따라가지 않는다. 항목 단위다.");

  table(s, M, 2.15, CW, [
    ["버튼", 2.6, "code", INK], ["무슨 일", 4.6, "", MUTED],
    ["언제 누르나", 4.47, "", INK],
  ], [
    ["Overrides", "바뀐 항목 목록을 보여준다", "\"왜 얘만 다르지\" 싶을 때 먼저 여기"],
    ["Revert", "내 변경을 버리고 원본으로", "실수로 바꿨을 때"],
    ["Apply", "내 변경을 원본에 밀어 넣는다", "이게 더 낫다고 판단했을 때"],
  ], null, 0.7);

  s.addText("Apply 는 되돌리기 어렵다.", {
    x: M, y: 4.95, w: 6.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("누르는 순간 다른 인스턴스가 전부 따라 바뀐다. 하나만 다르게 하고 싶으면 누르면 안 된다.", {
    x: M, y: 5.45, w: 6.4, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const rx = 7.55, rw = W - M - 7.55;
  s.addText("색만 바꿨으면 색만 안 따라간다", { x: rx, y: 4.95, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, rx, 5.35, rw, 1.2, [
    ["Color    ← 내가 바꿈. 안 따라간다", "b"],
    ["Scale    ← 안 건드림. 따라간다", "c"],
  ]);
  s.addNotes("Tag 나 Collider 처럼 전부에 들어가야 하는 것은 프리팹 모드 안에서 붙인다. 씬에서 붙이면 그 인스턴스만 Override 가 된다. '원본에 넣을 건 원본 방에서' 를 습관으로 만든다.");
}

// ================================================================ 5. 047 Instantiate
{
  const s = slide();
  head(s, "047", "코드가 프리팹을 찍어낸다.", "046에서 만든 원본이 여기서 쓰인다. 명령은 한 줄이다.");

  code(s, M, 2.15, CW, 0.85, [
    ["Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);", "b"],
  ]);

  table(s, M, 3.3, CW, [
    ["조각", 4.6, "code", INK], ["뜻", 7.07, "", MUTED],
  ], [
    ["bulletPrefab", "무엇을 찍을지 — 046에서 만든 원본"],
    ["firePoint.position", "어디에 놓을지"],
    ["Quaternion.identity", "안 돌린 상태 (지금은 그냥 외운다)"],
  ], null, 0.66);

  s.addText("Hierarchy 에 Bullet(Clone) 이 생긴다.", {
    x: M, y: 6.0, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("(Clone) 은 유니티가 \"이건 복사본이야\" 하고 붙여주는 표시다.", {
    x: M, y: 6.5, w: 8.5, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Quaternion 을 여기서 설명하면 이 회차가 끝난다. '안 돌림' 이면 충분하고, 회전 계산은 Phase 5 에서 제대로 한다.");
}

// ================================================================ 6. 047 어디서 드래그
{
  const s = slide();
  head(s, "047", "어디서 끌어다 넣느냐가 다르다.", "이 회차 최다 사고다. 학생 절반이 Hierarchy 에서 프리팹을 찾는다.");

  table(s, M, 2.15, 7.3, [
    ["Inspector 칸", 2.7, "code", INK], ["어디서 끄나", 2.4, "strong", INK], ["왜", 2.2, "", MUTED],
  ], [
    ["Bullet Prefab", "Project 창", "원본이라 씬에 없다"],
    ["Fire Point", "Hierarchy", "씬에 실제로 있는 자식"],
  ], null, 0.74);

  code(s, M, 4.35, 7.3, 1.7, [
    ["[SerializeField] private GameObject bulletPrefab;", "b"],
    ["[SerializeField] private Transform firePoint;", "b"],
    "",
    ["// FirePoint 는 Player 의 자식이라 플레이어를 따라다닌다 (033)", "c"],
  ]);

  s.addText("총구는 빈 GameObject 하나면 된다.", {
    x: M, y: 6.25, w: 7.3, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("Player 우클릭 → Create Empty → Position (0, 0.7, 0). 033의 부모자식 그대로다.", {
    x: M, y: 6.68, w: 8.0, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });

  shot(s, "047_Instantiate", 8.55, 2.15, 3.95, 2.3, "총구에서 나가는 총알");
  s.addText("Transform 칸에 오브젝트를 놓으면 유니티가 그 Transform 을 찾아 넣는다. 042와 같다.", {
    x: 8.55, y: 5.05, w: 3.95, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Project 에서 Inspector 로 드래그하는 걸 화면 공유로 천천히 두 번 보여준다. 말로 하면 절반이 못 따라온다.");
}

// ================================================================ 7. 047 Start vs FixedUpdate
{
  const s = slide();
  head(s, "047", "총알은 Start, 플레이어는 FixedUpdate.", "042에서 물리는 FixedUpdate 라고 했는데 오늘은 Start 다. 이유가 있다.");

  code(s, M, 2.15, 6.4, 1.7, [
    "void Start()",
    "{",
    ["    rb.linearVelocity = transform.up * speed;", "b"],
    "}",
  ]);

  table(s, M, 4.15, 6.4, [
    ["", 2.4, "", INK], ["언제 바뀌나", 2.2, "", MUTED], ["어디에", 1.8, "strong", INK],
  ], [
    ["플레이어 이동", "키 입력이 계속", "FixedUpdate"],
    ["총알 속도", "한 번 주면 끝", "Start"],
  ], null, 0.62);

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 2.15, rw, 2.35);
  s.addText("계속 바꿀 필요가 없다.", {
    x: rx + 0.4, y: 2.48, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.05, rw - 0.8, INK_SOFT);
  s.addText("한 번 준 속도는 물리 엔진이 유지한다. 매 프레임 다시 넣을 이유가 없다.", {
    x: rx + 0.4, y: 3.22, w: rw - 0.8, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("transform.up 은 자기 기준 위쪽", { x: rx, y: 4.75, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("총알을 돌리면 그 방향으로 간다. 032의 로컬 좌표가 여기서 쓰인다.", {
    x: rx, y: 5.2, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("발사는 GetKeyDown 이라 Update 에 쓴다. FixedUpdate 에 넣으면 눌러도 씹힌다 — 042에서 예고한 자리다.", {
    x: M, y: 6.15, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("이 회차 끝에 스페이스를 30번 연타시키고 Hierarchy 를 보여준다. Bullet(Clone) 산더미가 048의 도입이다.");
}

// ================================================================ 8. 048 gameObject vs this
{
  const s = slide();
  head(s, "048", "gameObject 와 this 는 다르다.", "this 로 쓰면 에러도 안 나고 총알만 계속 남는다. 찾기 어렵다.");

  table(s, M, 2.15, CW, [
    ["쓰면", 4.6, "code", INK], ["없어지는 것", 4.4, "strong", INK], ["", 2.67, "", MUTED],
  ], [
    ["Destroy(gameObject)", "오브젝트 전체", "이게 맞다"],
    ["Destroy(this)", "이 스크립트 컴포넌트만", "오브젝트는 그대로 남는다"],
  ], null, 0.76);

  code(s, M, 4.35, 6.4, 1.7, [
    "void Start()",
    "{",
    "    rb.linearVelocity = transform.up * speed;",
    ["    Destroy(gameObject, lifeTime);", "b"],
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  s.addText("2초 뒤에 없애라고 예약해 둔다", { x: rx, y: 4.35, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("lifeTime 이 곧 사거리다.", {
    x: rx, y: 4.75, w: rw, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("0.3 으로 줄이면 짧은 총, 5로 늘리면 화면을 가로지르는 총이 된다. Inspector 에서 바로 조절한다.", {
    x: rx, y: 5.25, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  const bw = 3.6, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.3, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("this 는 스크립트, gameObject 는 몸통", { x: M, y: 6.3, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("이 회차 사고 1등이다. 에러가 안 나서 학생 혼자서는 못 찾는다.", {
    x: M + bw + 0.35, y: 6.3, w: 7.0, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });
  s.addNotes("Hierarchy 를 열어놓고 Play 하게 시킨다. 총알이 생겼다 사라지는 게 눈에 보이는 게 가장 빠른 확인이다.");
}

// ================================================================ 9. 048 맞으면 둘 다
{
  const s = slide();
  head(s, "048", "맞으면 둘 다 사라진다.", "044의 other 가 여기서 쓰인다. 점 앞에 있는 게 주인이다.");

  code(s, M, 2.15, 7.0, 2.5, [
    "private void OnTriggerEnter2D(Collider2D other)",
    "{",
    "    if (other.CompareTag(\"Enemy\"))",
    "    {",
    ["        Destroy(other.gameObject);   // 상대", "b"],
    ["        Destroy(gameObject);         // 나", "b"],
    "    }",
    "}",
  ]);

  table(s, M, 4.95, 7.0, [
    ["", 3.6, "code", INK], ["무엇을", 2.0, "strong", INK], ["", 1.4, "", MUTED],
  ], [
    ["SetActive(false)", "꺼둔다", "다시 켤 수 있다"],
    ["Destroy(gameObject)", "없앤다", "되돌릴 수 없다"],
  ], null, 0.6);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.4);
  s.addText("차이는 다시 쓸 거냐다.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 3.08, rw - 0.8, INK_SOFT);
  s.addText("044의 동전은 껐고, 오늘 총알은 없앤다. 총알은 다시 쓸 일이 없다.", {
    x: rx + 0.4, y: 3.25, w: rw - 0.8, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("Destroy 도 공짜가 아니다.", { x: rx, y: 4.8, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("1초에 수백 개를 만들고 없애면 렉이 온다. Phase 8에서 오브젝트 풀링으로 고친다. 오늘은 여기까지.", {
    x: rx, y: 5.25, w: rw, h: 1.1, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("몬스터만 사라지고 총알이 남는다는 질문이 나온다. 두 줄 중 아래 줄을 빠뜨린 것이다.");
}

// ================================================================ 10. 048 스폰
{
  const s = slide();
  head(s, "048", "새로 배우는 게 하나도 없다.", "몬스터 스폰은 총알 코드에서 프리팹만 바뀐 것이다.");

  table(s, M, 2.15, 7.3, [
    ["조각", 3.3, "code", INK], ["어디서 배웠나", 4.0, "strong", INK],
  ], [
    ["Instantiate", "047회차 — 총알이랑 똑같다"],
    ["Random.Range", "040회차 도전 미션"],
    ["for", "3주차 반복문"],
    ["[ContextMenu]", "040회차"],
  ], null, 0.6);

  code(s, M, 5.15, 7.3, 1.7, [
    ["[ContextMenu(\"몬스터 10마리 소환\")]", "b"],
    "private void SpawnTen()",
    "{",
    "    for (int i = 0; i < 10; i++) SpawnOne();",
    "}",
  ]);

  shot(s, "048_Spawn", 8.55, 2.15, 3.95, 2.3, "E 키를 누를 때마다 랜덤 위치에");
  s.addText("040에서 [ContextMenu] 를 배울 때 뭐라고 했나.", {
    x: 8.55, y: 5.05, w: 3.95, h: 0.4, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("\"몬스터 10마리 소환 같은 걸 버튼 하나로 하게 됩니다.\" 그게 오늘이다.", {
    x: 8.55, y: 5.5, w: 3.95, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("2초마다 저절로 나오게 하는 코루틴은 051회차다. 오늘은 키를 눌러서 스폰한다. 여기서 코루틴을 꺼내면 이 회차가 무너진다.");
}

// ================================================================ 11. 049 드래그를 없앤다
{
  const s = slide();
  head(s, "049", "042부터 끌어다 넣던 걸 한 줄로 없앤다.", "GetComponent 는 \"내 그릇에서 이 부품 좀 꺼내줘\" 다. 034 그대로.");

  s.append = null;
  s.addText("전", { x: M, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, M, 2.55, 6.0, 1.5, [
    ["[SerializeField] private Rigidbody2D rb;", "b"],
    "",
    ["// 프리팹마다 손으로 끌어다 넣는다", "c"],
    ["// 까먹으면 NullReferenceException", "c"],
  ]);

  s.addText("후", { x: 7.15, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: INK, margin: 0, isTextBox: true });
  code(s, 7.15, 2.55, W - M - 7.15, 1.5, [
    "private Rigidbody2D rb;",
    "",
    "void Awake()",
    ["{ rb = GetComponent<Rigidbody2D>(); }", "b"],
  ]);

  table(s, M, 4.4, CW, [
    ["", 2.6, "code", INK], ["언제", 4.0, "", MUTED], ["여기서 하는 일", 5.07, "strong", INK],
  ], [
    ["Awake", "Start 보다 먼저", "내 부품 챙기기"],
    ["Start", "Awake 다음", "챙긴 걸 쓰기"],
  ], null, 0.66);

  s.addText("Update 에서 GetComponent 를 부르지 않는다. 한 번 찾아서 변수에 담아둔다.", {
    x: M, y: 6.4, w: CW, h: 0.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Awake 를 왜 쓰는지는 오늘 규칙만 준다. 이유(남이 나를 먼저 쓸 수 있다)는 050에서 Health 를 만들 때 실제로 겪는다.");
}

// ================================================================ 12. 049 점 앞이 주인
{
  const s = slide();
  head(s, "049", "점 앞에 있는 게 주인이다.", "아무것도 없으면 나, other 가 붙으면 상대.");

  table(s, M, 2.15, CW, [
    ["코드", 5.0, "code", INK], ["누구 부품", 3.2, "strong", INK], ["못 찾으면", 3.47, "code", MUTED],
  ], [
    ["GetComponent<T>()", "내 것", "null"],
    ["other.GetComponent<T>()", "상대 것", "null"],
    ["other.TryGetComponent(out T x)", "상대 것", "false"],
  ], null, 0.66);

  code(s, M, 4.9, 6.4, 1.9, [
    "SpriteRenderer sr = other.GetComponent<SpriteRenderer>();",
    "",
    ["if (sr != null)", "b"],
    "{",
    "    sr.color = Color.red;",
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 4.9, rw, 1.9);
  s.addText("못 찾으면 에러가 아니라 null 이다.", {
    x: rx + 0.4, y: 5.2, w: rw - 0.8, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("GetComponent 는 조용히 null 을 돌려준다. 터지는 건 그 다음 줄이다. 그래서 찾은 다음에 확인해야 한다.", {
    x: rx + 0.4, y: 5.85, w: rw - 0.8, h: 0.85, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실습 씬에 Tag 만 Enemy 이고 아무 부품도 없는 오브젝트를 하나 넣어뒀다. null 체크를 빼면 거기서 바로 NullReferenceException 이 난다. 학생이 에러 메시지를 직접 읽게 하는 자리다.");
}

// ================================================================ 13. 050 콘솔 회수
{
  const s = slide();
  head(s, "050", "5~6주차에 만든 클래스가 게임에서 돈다.", "036에서 한 약속을 여기서 완전히 지킨다.");

  code(s, M, 2.15, 5.9, 2.5, [
    ["// 5~6주차 · 콘솔", "c"],
    "class Enemy",
    "{",
    "    private int hp = 30;",
    "",
    "    public void TakeDamage(int damage)",
    "    { hp = hp - damage; }",
    "}",
  ]);
  code(s, 7.05, 2.15, W - M - 7.05, 2.5, [
    ["// 050회차 · 유니티", "c"],
    ["class Health : MonoBehaviour", "b"],
    "{",
    "    private int currentHealth;",
    "",
    "    public void TakeDamage(int damage)",
    "    { currentHealth -= damage; }",
    "}",
  ]);

  table(s, M, 4.95, CW, [
    ["콘솔", 3.9, "code", MUTED], ["유니티", 4.0, "code", INK], ["무엇이 바뀌었나", 3.77, "", MUTED],
  ], [
    ["class Enemy", "class Health : MonoBehaviour", "컴포넌트가 되려고 상속"],
    ["Console.WriteLine", "Debug.Log", "찍히는 곳만"],
    ["public void TakeDamage", "public void TakeDamage", "그대로"],
  ], null, 0.56);

  s.addNotes("콘솔 코드를 반드시 옆에 띄운다. 036에서 '여러분이 짜던 클래스가 유니티에 올라간 것' 이라고 했던 그 약속을 오늘 갚는다. 여기서 연결이 안 되면 학생은 콘솔 6주를 낭비로 기억한다.");
}

// ================================================================ 14. 050 설계 판단
{
  const s = slide();
  head(s, "050", "내가 만든 클래스도 컴포넌트다.", "GetComponent 는 유니티 부품만 찾는 게 아니다.");

  code(s, M, 2.15, 7.0, 1.7, [
    ["Health health = other.GetComponent<Health>();", "b"],
    "",
    "if (health != null)",
    ["{ health.TakeDamage(damage); }", "b"],
  ]);

  table(s, M, 4.1, 7.0, [
    ["", 2.4, "code", INK], ["왜 그렇게", 4.6, "", MUTED],
  ], [
    ["public TakeDamage", "총알이 부른다"],
    ["private Die", "아무도 안 부른다"],
    ["Awake 에서 초기화", "총알이 첫 프레임에 때릴 수 있다"],
    ["Mathf.Clamp", "음수 체력을 남기면 체력바가 뒤집힌다"],
  ], null, 0.58);

  const rx = 8.25, rw = W - M - 8.25;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("public 과 private 을 이유를 갖고 고른다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("6주차 접근 제한자가 오늘 실제로 필요한 자리다. 문법이 아니라 판단으로 쓴다.", {
    x: rx + 0.4, y: 3.4, w: rw - 0.8, h: 0.85, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("Phase 5에서 IDamageable 이 된다", { x: rx, y: 4.7, w: rw, h: 0.4,
    fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("몬스터든 플레이어든 상자든 맞으면 아픈 건 다 같다. 오늘은 씨앗만 심는다 — \"이 코드, 플레이어에도 그대로 붙습니다.\"", {
    x: rx, y: 5.15, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("실측: 총알 3발로 체력 30이 20 → 10 → 0 이 되고 사망 로그가 찍힌 뒤 씬에서 사라진다. Health 가 없는 Enemy 를 쏴도 예외가 나지 않는다.");
}

// ================================================================ 15. 흔한 사고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "다섯 개 중 넷은 원본과 복사본을 헷갈린 것이다. 강사용.");

  const acc = [
    ["프리팹 칸에 못 넣음", "Hierarchy 에서 끌고 있음", "Project 창에서 끈다"],
    ["원본을 고쳤는데 하나만 안 바뀜", "Override 가 걸려 있음", "Overrides → Revert"],
    ["총알이 안 사라짐 · 에러도 없음", "Destroy(this) 를 씀", "gameObject 로"],
    ["체력이 안 깎임", "Tag Enemy 를 씬에서만 붙임", "프리팹 모드에서 붙인다"],
    ["NullReferenceException", "없는 부품을 만짐", "null 체크 또는 TryGetComponent"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let ay = 2.45;
  acc.forEach((a, i) => {
    s.addText(a[0], { x: M, y: ay, w: 4.6, h: 0.5, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.8, y: ay, w: 3.6, h: 0.5, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.5, y: ay, w: 3.2, h: 0.5, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    if (i < acc.length - 1) rule(s, M, ay + 0.66, CW);
    ay += 0.84;
  });

  s.addText("Project 에 있는 게 원본, 씬에 있는 게 복사본.", {
    x: M, y: 6.7, w: CW, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Tag · Collider · 스크립트처럼 전부에 들어가야 하는 것은 반드시 프리팹 모드에서 붙인다. 씬에서 붙이면 그 인스턴스만 붙고 나머지는 조용히 빠진다.");
}

// ================================================================ 16. 종료 조건 + 예고
{
  const s = slide();
  head(s, null, "10주차 종료 조건.", "050 데모에서 한 명씩 확인한다. Phase 5부터는 전부 이 방식이다.");

  const chk = [
    "GameObject 를 프리팹으로 만든다",
    "Project = 원본, Hierarchy = 복사본",
    "원본을 고쳐 전부 반영시킨다",
    "Instantiate 로 총알을 발사한다",
    "프리팹 칸은 Project 창에서 끈다",
    "Destroy(obj, 시간) 으로 수명을 준다",
    "gameObject 와 this 를 구분한다",
    "GetComponent 로 남의 부품을 찾는다",
    "못 찾으면 null 인 걸 알고 대비한다",
    "체력이 0이면 몬스터가 사라진다",
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
  s.addText("몬스터를 E 키로 부르고 있다.", { x: M, y: 6.22, w: 8, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("051 – 055회차", { x: 8.6, y: 5.98, w: 4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("코루틴으로 2초마다 저절로 나온다.", { x: 8.6, y: 6.34, w: 4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("GetComponent 와 null 이 안 되면 11주차 이후가 통째로 막힌다. Phase 5부터 스크립트끼리 부르는 게 전부 이 방식이다. 안 되는 학생은 주말 안에 개별 시간을 잡는다.");
}

const out = path.join(__dirname, "10주차-찍어내고없애기.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
