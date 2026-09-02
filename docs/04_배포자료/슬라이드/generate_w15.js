// 15주차 몰려온다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 5 중반. 이 덱의 주장: 몬스터 3종·스폰·웨이브를 만들었는데 새 문법은 두 개뿐이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 10장의 Layer Collision Matrix

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
pres.title = "15주차 · 몰려온다";

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
  s.addText("15주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("몰려온다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("몬스터 3종 · 스폰 · 웨이브 · 처치. 새 문법은 두 개뿐이다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.85, 5.2, 3.4);
  s.addImage({ path: img("074_Wave"), x: 7.57, y: 2.07, w: 4.76, h: 2.68 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("071 – 075회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 5 · 몬스터와 스폰", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("이번 주는 학생이 '이제 게임 같다' 고 처음 느끼는 주다. 075 끝에 처치 수가 화면에서 올라가는 순간이 그 지점이다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "만드는 건 많은데, 배우는 문법은 두 개다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["071", "몬스터 추적 이동", "Move() 를 미리 빼둔다 — 다음 시간을 위해"],
    ["072", "몬스터 3종", "자식마다 다른 메서드 하나씩 override"],
    ["073", "스폰 포인트", "카메라 자식 · Layer 로 편 가르기"],
    ["074", "웨이브 매니저", "코루틴 두 개를 동시에"],
    ["075", "피격과 처치", "OverlapCircleAll · 처치 수 표시"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  h3(s, M, 6.85, CW, "새로 배우는 건 OverlapCircleAll 과 Time.time 쿨다운뿐이다.");
  s.addNotes("나머지는 전부 조합이다. 상속(070) 코루틴(052) 레이어(045) 프리팹(046) TMP(056). 마지막 회고에서 이 사실을 다시 말한다.");
}

// ================================================================ 3. 071 미리 빼둔다
{
  const s = slide();
  head(s, "071", "지금 안 나눠두면 다음 시간에 복사한다.", "이동 코드를 Move() 로 빼는 게 오늘의 전부다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "protected virtual void FixedUpdate()",
    "{",
    "    if (player == null) return;",
    "",
    ["    Move();          // 여기만 자식이 바꾼다", "b"],
    "}",
    "",
    ["protected virtual void Move()", "b"],
    "{",
    "    Vector2 dir = ((Vector2)player.position",
    "                   - rb.position).normalized;",
    "    rb.linearVelocity = dir * moveSpeed;",
    "}",
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "동작은 하나도\n안 바뀐다.");
  s.addText("그래서 학생이 반드시 묻는다 — \"굳이 왜 나눠요?\" 그 질문이 나오면 성공이다. 다음 시간 화면을 미리 보여준다.", {
    x: rx, y: 3.3, w: rw, h: 1.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  inverse(s, rx, 5.0, rw, 1.5);
  s.addText("필요해지기\n한 회차 전에\n자리를 만든다.", {
    x: rx + 0.35, y: 5.25, w: rw - 0.7, h: 1.1, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });

  s.addNotes("071은 063에서 이미 한 내용이다. 새로울 게 없어서 학생이 지루해할 수 있다. 그래서 '왜 나누는가' 를 오늘의 주제로 잡는다.");
}

// ================================================================ 4. 071 쫓아오기
{
  const s = slide();
  head(s, "071", "방향은 빼기로 만든다.", "063에서 이미 했다. 순서만 안 틀리면 된다.");

  const c1 = code(s, M, 2.15, 7.6, [
    ["Vector2 dir = ((Vector2)player.position", "b"],
    ["               - rb.position).normalized;", "b"],
    "",
    "rb.linearVelocity = dir * moveSpeed;",
    "sprite.flipX = dir.x < 0f;",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.6, [
    ["쓴 것", 2.6, "code", INK], ["뜻", 2.4, "strong", INK], ["배운 회차", 2.6, "", MUTED],
  ], [
    ["목표 − 나", "그 쪽으로 가는 화살표", "063"],
    [".normalized", "방향만 남긴다", "063"],
    ["flipX", "가는 쪽을 본다", "067"],
    ["FixedUpdate", "물리는 여기서", "042"],
  ], null, 0.6);

  const rx = 8.8, rw = W - M - 8.8;
  inverse(s, rx, 2.15, rw, 1.9);
  s.addText("나 − 목표", {
    x: rx + 0.35, y: 2.45, w: rw - 0.7, h: 0.45, fontFace: F_CODE, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("순서를 뒤집으면 도망간다. 2등 사고다.", {
    x: rx + 0.35, y: 3.0, w: rw - 0.7, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addText("1등은 Rigidbody 2D 를 안 붙인 것이다.", {
    x: rx, y: 4.35, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("도망가는 몬스터는 화면으로 보여주면 학생이 바로 웃는다. 일부러 한 번 뒤집어서 보여준 뒤 고친다.");
}

// ================================================================ 5. 072 3종 구조
{
  const s = slide();
  head(s, "072", "부모가 셋을 열어두면, 자식은 하나씩만 바꾼다.", "공통 코드가 자식에 한 줄도 없다.");

  // 부모 박스
  inverse(s, M, 2.35, 3.5, 1.5);
  s.addText("Enemy", { x: M + 0.35, y: 2.6, w: 2.8, h: 0.4,
    fontFace: F_CODE, fontSize: T.h4, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Move · Attack · TakeDamage\n전부 virtual", { x: M + 0.35, y: 3.05, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.bodySm, color: FAINT, lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  const kids = [
    ["ChargerEnemy", "Attack()", "부딪히면 3 피해", "체력 10 · 속도 2.0"],
    ["RunnerEnemy", "Move()", "안 꺾고 직진", "체력 4 · 속도 5.5"],
    ["TankEnemy", "TakeDamage()", "피해를 절반만", "체력 30 · 속도 1.1"],
  ];
  let ky = 2.35;
  kids.forEach((k) => {
    soft(s, 4.8, ky, 4.2, 1.28, R_SM);
    s.addText(k[0], { x: 5.1, y: ky + 0.16, w: 3.6, h: 0.34,
      fontFace: F_CODE, fontSize: T.body, color: INK, margin: 0, isTextBox: true });
    s.addText("override " + k[1], { x: 5.1, y: ky + 0.54, w: 3.6, h: 0.3,
      fontFace: F_CODE, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
    s.addText(k[2], { x: 9.15, y: ky + 0.2, w: 3.4, h: 0.34,
      fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
    s.addText(k[3], { x: 9.15, y: ky + 0.62, w: 3.4, h: 0.3,
      fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
    ky += 1.42;
  });

  s.addText("몬스터가 세 종류인데 체력 깎는 코드는 하나뿐이다.", {
    x: M, y: 6.5, w: CW, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addNotes("세 파일을 한 화면에 나란히 띄우고 '공통 코드가 한 줄이라도 있나요' 를 묻는다. 그게 이 회차의 마무리다.");
}

// ================================================================ 6. 072 러너
{
  const s = slide();
  head(s, "072", "러너 — 한 번만 보고 직진한다.", "Move() 를 바꾸면 완전히 다른 몬스터가 된다.");

  const c1 = code(s, M, 2.15, 6.4, [
    "protected override void Move()",
    "{",
    ["    if (!aimed)          // 처음 한 번만", "b"],
    "    {",
    "        chargeDir = ((Vector2)player.position",
    "                     - rb.position).normalized;",
    ["        aimed = true;", "b"],
    "    }",
    "",
    "    rb.linearVelocity = chargeDir * moveSpeed;",
    "}",
  ]);

  let y = h3(s, M, c1 + 0.35, 6.4, "피할 수 있는 적이 생겼다.");
  body(s, M, y, 6.4,
    "옆으로 비키면 그냥 지나간다. bool 하나로 '한 번만 실행' 을 막는 건 057·061에서 세 번째로 쓰는 패턴이다.", 0.95);

  shot(s, "072_ThreeKinds", 7.6, 2.15, 4.9, 2.76, "빨강 돌진형 · 노랑 러너 · 보라 탱커");

  s.addText("실측 — 플레이어를 (40, 0) 으로 옮겨도\n러너 속도는 (0.00, 5.50) 그대로였다.", {
    x: 7.6, y: 5.55, w: 4.9, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("같은 순간 돌진형은 (1.76, 0.95) 로 방향을 틀었다. 두 값을 나란히 보여주면 override 가 무슨 일을 했는지 한눈에 보인다.");
}

// ================================================================ 7. 072 탱커
{
  const s = slide();
  head(s, "072", "탱커 — 숫자만 줄이고 부모에게 넘긴다.", "체력을 직접 깎지 않는 게 핵심이다.");

  const c1 = code(s, M, 2.15, 7.5, [
    "public override void TakeDamage(int amount)",
    "{",
    "    int reduced = Mathf.Max(",
    "        Mathf.RoundToInt(amount * (1f - damageReduction)), 1);",
    "",
    ["    base.TakeDamage(reduced);   // 깎는 건 부모가 한다", "b"],
    "}",
  ]);

  let y = h3(s, M, c1 + 0.35, 7.5, "부모를 한 글자 고쳐야 한다.");
  y = body(s, M, y, 7.5,
    "public void TakeDamage → public virtual void TakeDamage. 부모가 열어주지 않으면 자식은 바꿀 수 없다. 이 회차 1등 사고다.", 0.95);

  const rx = 8.7, rw = W - M - 8.7;
  inverse(s, rx, 2.15, rw, 2.2);
  s.addText("base. 를 빼면\n유니티가 멈춘다.", {
    x: rx + 0.35, y: 2.45, w: rw - 0.7, h: 0.9, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("TakeDamage 안에서 TakeDamage 를 부르면 자기를 무한히 부른다.", {
    x: rx + 0.35, y: 3.4, w: rw - 0.7, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  table(s, rx, 4.6, rw, [["안전장치", 2.2, "code", INK], ["막는 것", 2.3, "", MUTED]], [
    ["Mathf.Max(.., 1)", "무적 몬스터"],
    ["Range(0f, 0.9f)", "감소율 100%"],
  ], null, 0.6);

  s.addNotes("무한 재귀는 유니티가 통째로 멈춘다. Play 전 Ctrl+S 를 다시 강조하기 좋은 자리다.");
}

// ================================================================ 8. 073 한 곳에서만
{
  const s = slide();
  head(s, "073", "몬스터를 만드는 곳은 한 곳뿐이다.", "지금은 불편해 보이지만 몇 달 뒤에 살려준다.");

  const c1 = code(s, M, 2.15, 7.3, [
    ["public void SpawnOne()   // 여기 하나뿐", "b"],
    "{",
    "    GameObject prefab =",
    "        enemyPrefabs[Random.Range(0, KindCount())];",
    "    Transform point =",
    "        spawnPoints[Random.Range(0, spawnPoints.Length)];",
    "",
    "    Instantiate(prefab, point.position, Quaternion.identity);",
    "}",
  ]);

  let y = h3(s, M, c1 + 0.35, 7.3, "학생에게는 이렇게만 말한다.");
  body(s, M, y, 7.3,
    "\"여기저기서 몬스터를 만들면 나중에 누가 만들었는지 못 찾아요.\" — 네트워크는 한마디도 하지 않는다. 117회차에 이 규칙 덕분에 한 줄로 서버 권한으로 바뀐다.", 1.0);

  const rx = 8.5, rw = W - M - 8.5;
  let ry = h3(s, rx, 2.15, rw, "스폰 포인트 8개,\n반지름 14.");
  s.addText("카메라가 보는 범위는 가로 ±8.9, 세로 ±5. 모서리까지 약 10.2 이므로 14면 확실히 화면 밖이다.", {
    x: rx, y: 3.3, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("네트워크 대비 규칙 ①. 규칙 ② 는 067의 입력/이동 분리였다. 둘 다 네트워크라는 말 없이 심는다.");
}

// ================================================================ 9. 073 문제 ①
{
  const s = slide();
  head(s, "073", "문제 ① — 멀리 가면 몬스터가 안 온다.", "무한 맵에서는 '화면 밖' 이 계속 바뀐다.");

  const e1 = table(s, M, 2.15, 7.6, [
    ["", 2.6, "strong", INK], ["스폰 포인트가 씬에", 2.5, "", MUTED], ["카메라 자식이면", 2.5, "", INK],
  ], [
    ["제자리에 있을 때", "정상", "정상"],
    ["20초 달린 뒤", "아무것도 안 나옴", "화면 밖에서 나옴"],
    ["고치는 법", "—", "드래그 한 번"],
  ], null, 0.66);

  let y = h3(s, M, e1 + 0.4, 7.6, "부모가 움직이면 자식도 움직인다.");
  body(s, M, y, 7.6,
    "033회차 로봇팔에서 배운 그것이다. 코드를 한 줄도 안 쓰고 Hierarchy 에서 드래그 한 번으로 끝난다.", 0.95);

  const rx = 8.8, rw = W - M - 8.8;
  const c1 = code(s, rx, 2.15, rw, [
    ["Main Camera", "b"],
    "  └ SpawnPoints",
    "      ├ Point_0",
    "      ├ Point_1",
    "      └ ...",
  ]);
  s.addText("Scene 뷰에서 원이 카메라를 따라 움직이는 걸 보여준다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("먼저 문제를 겪게 한다. 20초 달린 뒤 소환해서 아무것도 안 나오는 걸 본 다음에 고친다.");
}

// ================================================================ 10. 073 문제 ②
{
  const s = slide();
  head(s, "073", "문제 ② — 몬스터끼리 싸운다.", "070에서 자랑했던 설계가 여기서 되돌아온다.");

  const c1 = code(s, M, 2.15, 7.4, [
    ["// ChargerEnemy.OnCollisionEnter2D", "c"],
    "if (collision.gameObject",
    "        .TryGetComponent(out IDamageable target))",
    "{",
    "    Attack(target);",
    "}",
    "",
    ["// 몬스터도 IDamageable 이다", "c"],
  ]);

  const c2 = code(s, M, c1 + 0.35, 7.4, [
    ["Enemy_Charger(Clone) : 돌진! 3 피해", "c"],
    ["Enemy_Runner(Clone) : -3  (남은 체력 1)", "c"],
    ["Enemy_Runner(Clone) 사망", "c"],
  ], true);
  s.addText("우리는 아무것도 안 했는데 몬스터가 줄어든다", {
    x: M, y: c2 + 0.12, w: 7.4, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.6, rw = W - M - 8.6;
  s.addShape(pres.ShapeType.roundRect, { x: rx, y: 2.15, w: rw, h: 2.0, rectRadius: R_MD,
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("Layer Collision\nMatrix", {
    x: rx + 0.35, y: 2.42, w: rw - 0.7, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("Enemy × Enemy 체크를 끈다. 045에서 총알이 벽을 통과하게 했던 그 화면이다.", {
    x: rx + 0.35, y: 3.35, w: rw - 0.7, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: "DCE8FF",
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  let y = h3(s, rx, 4.4, rw, "코드는 한 줄도\n안 고쳤다.");
  s.addText("실측 — 웨이브 7까지 90초를 돌린 뒤 처치 0. 고치기 전에는 아무도 안 때렸는데 38이었다.", {
    x: rx, y: 5.5, w: rw, h: 1.1, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("\"if (상대가 몬스터면 return)\" 을 쓸 수도 있지만 몬스터가 열 종류면 조건을 열 군데 관리해야 한다. 레이어는 한 곳이다. 부작용(몬스터가 겹친다)도 같이 말해준다.");
}

// ================================================================ 11. 074 코루틴 두 개
{
  const s = slide();
  head(s, "074", "한 함수가 두 가지 일을 하지 않게 한다.", "코루틴은 몇 개든 동시에 돌릴 수 있다.");

  const c1 = code(s, M, 2.15, 6.2, [
    "private void Start()",
    "{",
    ["    StartCoroutine(SpawnRoutine());   // 소환만", "b"],
    ["    StartCoroutine(WaveRoutine());    // 시계만", "b"],
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.35, 6.2, [
    "private IEnumerator WaveRoutine()",
    "{",
    "    while (true)",
    "    {",
    "        yield return new WaitForSeconds(waveDuration);",
    "",
    "        Wave++;",
    ["        spawnInterval = Mathf.Max(", "b"],
    ["            spawnInterval - intervalStep, minInterval);", "b"],
    "    }",
    "}",
  ]);

  const rx = 7.4, rw = W - M - 7.4;
  let y = h3(s, rx, 2.15, rw, "각자 자기 일만 한다.");
  y = body(s, rx, y, rw,
    "간격이 계속 변하니까 소환 루틴 안에서 시간을 재면 계산이 어긋난다. 시계는 따로 두면 정확하다.", 1.0);

  y = h3(s, rx, y + 0.3, rw, "Mathf.Max 가 없으면");
  s.addText("간격이 0이 되고, 그 다음엔 음수가 된다. 화면이 몬스터로 꽉 찬다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("학생은 보통 SpawnRoutine 안에 타이머를 넣으려 한다. 먼저 그렇게 해보게 한 뒤 어긋나는 걸 보여주고 나눈다.");
}

// ================================================================ 12. 074 실측
{
  const s = slide();
  head(s, "074", "실측 — 90초 동안 어떻게 어려워지나.", "Game.unity · waveDuration 15초 · step 0.3 · min 0.4");

  const e1 = table(s, M, 2.15, 6.5, [
    ["웨이브", 1.5, "code", MUTED], ["간격", 1.5, "code", INK], ["나오는 종류", 3.5, "", INK],
  ], [
    ["1", "2.00초", "돌진형"],
    ["2", "1.70초", "돌진형 · 러너"],
    ["3", "1.40초", "세 종류 전부"],
    ["5", "0.80초", "세 종류 전부"],
    ["7", "0.40초", "여기서 더 안 줄어든다"],
  ], null, 0.6);

  let y = h3(s, M, e1 + 0.35, 6.5, "7웨이브에서 멈춘 이유.");
  body(s, M, y, 6.5,
    "Mathf.Max 가 minInterval(0.4) 아래로 못 내려가게 막는다. 없으면 음수가 되고 한 프레임에 수십 마리가 나온다.", 0.95);

  shot(s, "074_Wave", 7.75, 2.15, 4.75, 2.67, "웨이브 6 · 적 88마리 · 아무도 안 죽었다");

  s.addText("프레임이 떨어지기 시작한다. 정상이다.\n풀링은 101회차에서 한다.", {
    x: 7.75, y: 5.4, w: 4.75, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("실측 로그: 웨이브 2(1.70) 3(1.40) 4(1.10) 5(0.80) 6(0.50) 7(0.40). 90초 시점 적 88마리, 처치 0.");
}

// ================================================================ 13. 075 OverlapCircleAll
{
  const s = slide();
  head(s, "075", "주변을 한꺼번에 훑는다.", "이 코드에 Enemy 라는 글자가 없다.");

  const c1 = code(s, M, 2.15, 7.7, [
    ["Collider2D[] hits = Physics2D.OverlapCircleAll(", "b"],
    ["    transform.position, attackRadius);", "b"],
    "",
    "foreach (Collider2D hit in hits)",
    "{",
    ["    if (hit.gameObject == gameObject) continue;", "b"],
    "",
    "    if (hit.TryGetComponent(out IDamageable target))",
    "    {",
    "        target.TakeDamage(damage);",
    "    }",
    "}",
  ]);

  const rx = 8.9, rw = W - M - 8.9;
  let y = h3(s, rx, 2.15, rw, "내 몸도 목록에\n들어온다.");
  s.addText("플레이어도 IDamageable 이다. 안 걸러내면 내가 나를 때린다. 이 회차 1등 사고다.", {
    x: rx, y: 3.3, w: rw, h: 1.3, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  const c2 = code(s, rx, 4.7, rw, [
    "OnDrawGizmosSelected",
    "  → 노란 원",
  ]);
  s.addText("숫자만 보면 감이 안 온다. 그려주면 바로 안다.", {
    x: rx, y: c2 + 0.25, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("자기를 때리는 사고는 반드시 한 번 겪게 한 뒤 고친다. 070에서 심은 '상대가 누군지 모른다' 가 여기서도 양날이라는 걸 보여준다.");
}

// ================================================================ 14. 075 쿨다운
{
  const s = slide();
  head(s, "075", "꾹 누르면 매 프레임 나간다.", "Invoke 도 코루틴도 필요 없다. 시각을 적어두면 된다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "private void Update()",
    "{",
    "    if (!Input.GetKey(KeyCode.Space)) return;",
    ["    if (Time.time < nextAttackTime) return;", "b"],
    "",
    ["    nextAttackTime = Time.time + cooldown;", "b"],
    "    Swing();",
    "}",
  ]);

  const e1 = table(s, M, c1 + 0.4, 7.4, [
    ["조각", 2.6, "code", INK], ["뜻", 4.8, "", MUTED],
  ], [
    ["Time.time", "게임이 시작하고 지난 시간(초)"],
    ["nextAttackTime", "다음에 때릴 수 있는 시각"],
  ], null, 0.6);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "먼저 없이 해본다.");
  y = body(s, rx, y, rw,
    "Space 를 꾹 누르면 Console 이 폭발하고 몬스터가 순식간에 사라진다. 재미가 없다는 걸 몸으로 느낀 뒤에 넣는다.", 1.2);

  y = h3(s, rx, y + 0.25, rw, "078에서 다시 쓴다.");
  s.addText("자동 발사 무기의 쿨다운도 같은 방식이다.", {
    x: rx, y: y + 0.05, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("061의 isRespawning 과 같은 계열이다. Update 는 매 프레임 돈다는 사실을 이 Phase 에서 네 번째로 확인하는 자리.");
}

// ================================================================ 15. 075 다형성 실측
{
  const s = slide();
  head(s, "075", "한 번 휘둘렀는데 셋이 다르게 반응한다.", "플레이어는 전부 TakeDamage(4) 를 불렀을 뿐이다.");

  const c1 = code(s, M, 2.15, 7.3, [
    ["휘두르기 — 3마리 명중", "b"],
    "Enemy_Charger : -4  (남은 체력 6)",
    "Enemy_Runner : -4  (남은 체력 0)",
    "Enemy_Runner 사망",
    ["Enemy_Tank : 단단하다!  4 → 2", "b"],
    "Enemy_Tank : -2  (남은 체력 28)",
  ], true);
  s.addText("실측 — Game.unity 에서 세 종류를 나란히 세우고 Swing() 한 번", {
    x: M, y: c1 + 0.12, w: 7.3, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  let y = h3(s, M, c1 + 0.65, 7.3, "다르게 만든 건 각자의 override 다.");
  body(s, M, y, 7.3,
    "처치 수를 세는 코드도 부모의 Die() 한 곳에만 넣었다. 몬스터를 열 종류로 늘려도 그 한 줄이면 끝난다.", 0.95);

  shot(s, "075_Kills", 8.05, 2.15, 4.45, 2.5, "웨이브 8 · 처치 38");

  s.addNotes("보라색(탱커)만 길게 살아남아 줄지어 따라오는 게 스크린샷에 보인다. 절반만 맞는다는 설정이 화면으로 드러난 것이다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "이번 주 종료 조건.", "다섯 개다. 다음 주는 무기다.");

  const chk = [
    "몬스터가 플레이어를 쫓아온다",
    "Enemy 를 상속한 3종이 각각 다르게 동작한다",
    "화면 밖에서 저절로 스폰된다",
    "시간이 갈수록 자주, 여러 종류가 나온다",
    "Space 로 때리고 처치 수가 화면에 뜬다",
  ];
  chk.forEach((c, i) => {
    const by = 2.3 + i * 0.55;
    s.addShape(pres.ShapeType.roundRect, { x: M, y: by + 0.06, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: i === 4 ? INK : HAIRLINE, width: i === 4 ? 1.5 : 1 } });
    s.addText(c, { x: M + 0.42, y: by, w: 6.4, h: 0.4,
      fontFace: i === 4 ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["회수한 것", 2.2, "code", INK], ["언제 배웠나", 2.75, "", MUTED]], [
    ["상속 · override", "070 · 6주차"],
    ["코루틴", "051 · 052"],
    ["Layer Matrix", "045"],
    ["프리팹 · TMP", "046 · 056"],
  ], null, 0.55);
  s.addText("새 문법은 OverlapCircleAll 과 Time.time 쿨다운, 둘뿐이다.", {
    x: rx, y: 5.02, w: rw, h: 0.3, fontFace: F_SEMI, fontSize: T.body, color: INK,
    margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 16주차", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("무기가 알아서 싸운다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("076 – 080회차", { x: 9.2, y: 5.98, w: 3.4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("회전 칼 · 자동 조준 · 코어 루프 완성.", { x: 9.2, y: 6.34, w: 3.4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("080에서 플레이어가 죽을 수 있게 되면 시작→전투→사망→게임오버가 한 바퀴 돈다. Phase 5 종료 조건이다.");
}

const out = path.join(__dirname, "15주차-몰려온다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
