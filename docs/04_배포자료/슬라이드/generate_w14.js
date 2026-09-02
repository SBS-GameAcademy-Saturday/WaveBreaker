// 14주차 여기서부터 5개월 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 5 착수. 이 덱의 주장: 새로 배우는 건 무한 맵 하나뿐이고, 나머지는 전부 회수다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 13장의 IDamageable

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
pres.title = "14주차 · 여기서부터 5개월";

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
  s.addText("14주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("여기서부터 5개월.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("새로 배우는 건 무한 맵 하나뿐이다. 나머지는 전부 회수다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.85, 5.2, 3.4);
  s.addImage({ path: img("070_Game"), x: 7.57, y: 2.07, w: 4.76, h: 2.68 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("066 – 070회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 5 · 본 프로젝트 코어", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("여기서부터 씬 하나가 65회차 동안 자란다. 미니게임처럼 매 회차 새 씬을 만들지 않는다. 첫 시간에 이 규칙을 못 박는다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "네 회차는 회수, 한 회차만 새 것이다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["066", "프로젝트 착수", "enum · 싱글톤 하나 · 폴더 규칙"],
    ["067", "플레이어 이동과 좌우 반전", "입력과 이동을 나눈다 · flipX"],
    ["068", "카메라 추적", "LateUpdate · SmoothDamp"],
    ["069", "무한 맵", "이번 주 유일하게 새로 배우는 것"],
    ["070", "Enemy 와 IDamageable", "6주차 콘솔 코드를 그대로 꺼낸다"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  h3(s, M, 6.85, CW, "070회차가 이 과정의 투자 회수 지점이다. 생략 금지.");
  s.addNotes("5·6주차에 절반이 '이걸 왜 배우죠' 했다. 070이 그 답이다. 여기를 건너뛰면 상속을 처음부터 다시 가르쳐야 한다.");
}

// ================================================================ 3. 066 씬 하나로 간다
{
  const s = slide();
  head(s, "066", "이제 씬을 새로 만들지 않는다.", "Game.unity 하나가 65회차 동안 자란다.");

  const e1 = table(s, M, 2.15, 6.6, [
    ["", 2.5, "strong", INK], ["Phase 4 까지", 2.05, "", MUTED], ["Phase 5 부터", 2.05, "", INK],
  ], [
    ["씬", "회차마다 새로", "Game.unity 하나"],
    ["되돌리기", "이전 씬을 연다", "git 커밋"],
    ["완성본", "Done 씬", "스냅샷 5회차마다"],
  ], null, 0.66);

  let y = h3(s, M, e1 + 0.4, 6.6, "그래서 저장 습관이 중요해진다.");
  body(s, M, y, 6.6,
    "씬 하나를 계속 고쳐 나가니 되돌릴 지점을 스스로 만들어야 한다. 회차가 끝날 때마다 폴더를 통째로 복사해 두는 것만으로 충분하다.", 0.95);

  const rx = 8.0, rw = W - M - 8.0;
  inverse(s, rx, 2.15, rw, 3.6);
  s.addText("싱글톤은\nGameManager 하나만.", {
    x: rx + 0.4, y: 2.5, w: rw - 0.8, h: 1.1, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("어디서든 부를 수 있다는 건 어디서든 망가뜨릴 수 있다는 뜻이다. 이 프로젝트에서 static Instance 는 여기 한 곳뿐이다.", {
    x: rx + 0.4, y: 3.75, w: rw - 0.8, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("싱글톤 남용은 이 Phase 의 위험 신호다. 학생이 매니저를 여러 개 만들기 시작하면 바로 잡는다.");
}

// ================================================================ 4. 066 GameState
{
  const s = slide();
  head(s, "066", "상태를 문자열로 두지 않는다.", "enum 은 5주차에 배웠다. 여기가 그 쓸 자리다.");

  const c1 = code(s, M, 2.15, 6.7, [
    ["public enum GameState", "b"],
    "{",
    "    Title, Playing, Upgrading,",
    "    Paused, GameOver, Clear",
    "}",
    "",
    ["public GameState State { get; private set; }", "b"],
  ]);

  let y = h3(s, M, c1 + 0.35, 6.7, "왜 bool 을 여러 개 두지 않나.");
  body(s, M, y, 6.7,
    "isPlaying 과 isGameOver 가 동시에 true 가 되는 순간이 반드시 온다. 상태가 하나뿐이면 그 사고가 아예 불가능하다.", 0.9);

  const rx = 8.05, rw = W - M - 8.05;
  table(s, rx, 2.15, rw, [["상태", 1.7, "code", INK], ["언제", 2.75, "", MUTED]], [
    ["Playing", "지금 만드는 것"],
    ["GameOver", "080회차"],
    ["Upgrading", "Phase 6 레벨업"],
    ["Title / Paused", "나중에"],
  ], null, 0.6);
  s.addText("지금 다 쓰지 않는다. 자리만 만들어 둔다.", {
    x: rx, y: 5.4, w: rw, h: 0.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("지금 쓰지 않는 상태를 미리 넣는 이유를 말해준다. 나중에 enum 을 고치면 Inspector 값이 밀린다.");
}

// ================================================================ 5. 067 입력과 이동을 나눈다
{
  const s = slide();
  head(s, "067", "읽는 일과 움직이는 일은 다른 일이다.", "스크립트 두 개로 나눈다. 이유는 나중에 회수한다.");

  const c1 = code(s, M, 2.15, 6.0, [
    ["// PlayerInput — 읽기만 한다", "c"],
    "public Vector2 MoveInput { get; private set; }",
    "",
    "void Update()",
    "{",
    "    MoveInput = new Vector2(h, v).normalized;",
    "}",
  ]);

  const c2 = code(s, 7.15, 2.15, W - M - 7.15, [
    ["// PlayerController — 움직이기만 한다", "c"],
    "void FixedUpdate()",
    "{",
    "    Vector2 move = input.MoveInput;",
    "",
    "    rb.linearVelocity = move * moveSpeed;",
    "}",
  ]);

  let y = h3(s, M, Math.max(c1, c2) + 0.4, CW, "학생에게는 이렇게만 말한다.");
  body(s, M, y, CW,
    "\"키보드 읽는 일이랑 움직이는 일은 다른 일이에요.\" — 네트워크는 한마디도 하지 않는다. 114회차에 이 구조 덕분에 갈아엎지 않게 된다.", 0.9);

  s.addNotes("네트워크 대비 규칙 ②. 절대 네트워크를 언급하지 않는다. '좋은 습관' 으로만 심는다. 규칙 ① 은 스폰을 매니저 한 곳에서만 하는 것이고 073에서 나온다.");
}

// ================================================================ 6. 067 flipX
{
  const s = slide();
  head(s, "067", "그림 두 장을 만들지 않는다.", "왼쪽 그림은 오른쪽 그림을 뒤집은 것이다.");

  const c1 = code(s, M, 2.15, 7.0, [
    "if (move.x != 0f)",
    "{",
    ["    sprite.flipX = move.x < 0f;", "b"],
    "}",
  ]);

  let y = h3(s, M, c1 + 0.4, 7.0, "왜 if 가 필요한가.");
  y = body(s, M, y, 7.0,
    "가만히 서 있으면 move.x 가 0 이다. if 가 없으면 멈출 때마다 오른쪽을 보게 된다. 마지막으로 본 방향을 유지하려면 입력이 있을 때만 바꿔야 한다.", 1.0);

  const rx = 8.25, rw = W - M - 8.25;
  table(s, rx, 2.15, rw, [["방법", 2.3, "code", INK], ["문제", 2.15, "", MUTED]], [
    ["flipX", "없다"],
    ["Scale.x = -1", "자식도 같이 뒤집힌다"],
    ["그림 2장", "관리할 게 2배"],
  ], null, 0.66);
  s.addText("무기를 자식으로 달 예정이라 Scale 뒤집기는 076회차에서 사고가 된다.", {
    x: rx, y: 4.5, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("Scale.x 뒤집기를 쓴 학생은 076 회전 무기에서 반드시 막힌다. 지금 flipX 로 통일시킨다.");
}

// ================================================================ 7. 067 이름 충돌
{
  const s = slide();
  head(s, "067", "PlayerInput 이라는 이름은 이미 있다.", "유니티가 만든 것과 이름이 겹친다.");

  const c1 = code(s, M, 2.15, 7.4, [
    ["using UnityEngine.InputSystem;   // 이 줄이 생기는 순간", "c"],
    "",
    ["'PlayerInput' is an ambiguous reference", "b"],
    "",
    ["// 해결: 그 using 을 지운다", "c"],
  ]);

  let y = h3(s, M, c1 + 0.4, 7.4, "우리는 Input Manager 를 쓴다.");
  y = body(s, M, y, 7.4,
    "Input System 패키지는 이번 과정에서 쓰지 않는다. 자동완성이 이 using 을 넣어버리는 경우가 있으니, 갑자기 컴파일이 깨지면 파일 맨 위를 먼저 본다.", 1.0);

  const rx = 8.6, rw = W - M - 8.6;
  inverse(s, rx, 2.15, rw, 2.3);
  s.addText("Active Input Handling", {
    x: rx + 0.35, y: 2.45, w: rw - 0.7, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: FAINT, margin: 0, isTextBox: true });
  s.addText("Both", {
    x: rx + 0.35, y: 2.9, w: rw - 0.7, h: 0.6, fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Project Settings → Player", {
    x: rx + 0.35, y: 3.6, w: rw - 0.7, h: 0.5, fontFace: F_LIGHT, fontSize: T.bodySm, color: FAINT,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });

  s.addNotes("이 설정이 아니면 GetAxisRaw 가 예외를 던진다. 40회차에서 이미 맞춰뒀지만, 새로 프로젝트를 만든 학생은 여기서 걸린다.");
}

// ================================================================ 8. 068 LateUpdate
{
  const s = slide();
  head(s, "068", "카메라 코드는 Update 에 쓰지 않는다.", "화면이 미세하게 떠는 이유가 여기에 있다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["순서", 1.6, "code", MUTED], ["일어나는 일", 3.0, "strong", INK], ["결과", 2.8, "", MUTED],
  ], [
    ["Update", "카메라가 따라간다", "플레이어는 아직 안 움직였다"],
    ["FixedUpdate", "플레이어가 움직인다", "카메라는 이미 지나갔다"],
    ["LateUpdate", "카메라가 따라간다", "이번 프레임 위치를 본다"],
  ], null, 0.68);

  let y = h3(s, M, e1 + 0.4, 7.4, "한 프레임 늦게 보면 그게 떨림이다.");
  body(s, M, y, 7.4,
    "Update 안에서의 실행 순서는 유니티가 정한다. 우리가 고를 수 없는 걸 기대하지 말고, 확실히 나중인 자리에 쓴다.", 0.9);

  const rx = 8.55, rw = W - M - 8.55;
  const c1 = code(s, rx, 2.15, rw, [
    ["void LateUpdate()", "b"],
    "{",
    "    ...",
    "}",
  ]);
  s.addText("068 이후 카메라 코드는 전부 여기로 간다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("떨림은 화면으로 보여주는 게 제일 빠르다. Update 로 한 번 켜서 보여주고 LateUpdate 로 고친다.");
}

// ================================================================ 9. 068 SmoothDamp
{
  const s = slide();
  head(s, "068", "딱 붙어 다니면 오히려 어지럽다.", "조금 늦게 따라오는 게 더 자연스럽다.");

  const c1 = code(s, M, 2.15, 8.2, [
    "Vector3 goal = new Vector3(target.position.x,",
    "                           target.position.y, -10f);",
    "",
    ["transform.position = Vector3.SmoothDamp(", "b"],
    ["    transform.position, goal, ref velocity, smoothTime);", "b"],
  ]);

  let y = h3(s, M, c1 + 0.4, 8.2, "z 를 -10 으로 고정하는 이유.");
  y = body(s, M, y, 8.2,
    "2D 카메라가 z = 0 으로 오면 화면이 비어버린다. 카메라는 항상 뒤에 있어야 한다. 실수로 z 를 따라가게 두는 것이 이 회차 1등 사고다.", 1.0);

  const rx = 9.35, rw = W - M - 9.35;
  table(s, rx, 2.15, rw, [["값", 1.2, "code", INK], ["느낌", 1.6, "", MUTED]], [
    ["0.05", "딱 붙는다"],
    ["0.15", "기본값"],
    ["0.4", "너무 늦다"],
  ], null, 0.6);
  s.addText("숫자를 바꿔보게 하는 게 설명보다 빠르다.", {
    x: rx, y: 4.35, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("ref velocity 는 SmoothDamp 가 스스로 쓰는 메모장이다. 그 이상 설명하지 않는다.");
}

// ================================================================ 10. 069 무한 맵의 정체
{
  const s = slide();
  head(s, "069", "무한 맵은 무한하지 않다.", "타일 아홉 장을 돌려쓰는 속임수다.");

  // 3x3 다이어그램
  const gx = M, gy = 2.35, cell = 1.05, gap = 0.06;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const isCenter = r === 1 && c === 1;
      s.addShape(pres.ShapeType.roundRect, {
        x: gx + c * (cell + gap), y: gy + r * (cell + gap), w: cell, h: cell, rectRadius: R_SM,
        fill: { color: isCenter ? INK : CANVAS_SOFT }, line: { width: 0 } });
      s.addText("20", { x: gx + c * (cell + gap), y: gy + r * (cell + gap), w: cell, h: cell,
        align: "center", valign: "middle", fontFace: F_CODE, fontSize: T.caption,
        color: isCenter ? CANVAS : FAINT, margin: 0, isTextBox: true });
    }
  }
  s.addText("전체 폭 60", { x: gx, y: gy + 3 * cell + 2 * gap + 0.12, w: 3 * cell + 2 * gap, h: 0.32,
    align: "center", fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });

  const rx = 4.7, rw = W - M - 4.7;
  let y = h3(s, rx, 2.35, rw, "두 개의 숫자만 알면 된다.");
  const e1 = table(s, rx, y + 0.15, rw, [
    ["숫자", 1.3, "code", INK], ["뜻", 2.6, "strong", INK], ["어디서 나왔나", 3.9, "", MUTED],
  ], [
    ["30", "이만큼 멀어지면 옮긴다", "20 × 3 ÷ 2 (한쪽 끝까지)"],
    ["60", "이만큼 옮긴다", "20 × 3 (전체 폭)"],
  ], null, 0.68);

  body(s, rx, e1 + 0.35, rw,
    "40 을 쓰면 이미 타일이 있는 자리로 간다. 겹치고, 반대쪽에 구멍이 생긴다. 이 회차 계산 사고 1등이다.", 0.9);

  s.addNotes("여기서 '게임은 속임수의 집합' 이라는 말을 한다. 앞으로 학생이 '이거 어떻게 만들지' 할 때 속일 방법을 먼저 떠올리게 하는 게 목적이다.");
}

// ================================================================ 11. 069 코드
{
  const s = slide();
  head(s, "069", "if 네 개가 전부다.", "가로와 세로를 따로 본다. 그래서 대각선도 안 뚫린다.");

  const c1 = code(s, M, 2.15, 8.1, [
    ["float span = tileSize * gridCount;   // 60", "c"],
    ["float half = span / 2f;              // 30", "c"],
    "",
    "foreach (Transform tile in transform)",
    "{",
    "    Vector3 diff = tile.position - player.position;",
    "",
    ["    if (diff.x >  half) tile.position += Vector3.left  * span;", "b"],
    ["    if (diff.x < -half) tile.position += Vector3.right * span;", "b"],
    ["    if (diff.y >  half) tile.position += Vector3.down  * span;", "b"],
    ["    if (diff.y < -half) tile.position += Vector3.up    * span;", "b"],
    "}",
  ]);

  const rx = 9.25, rw = W - M - 9.25;
  let y = h3(s, rx, 2.15, rw, "부모 하나가\n아홉 개를 관리한다.");
  s.addText("foreach 에 transform 을 그냥 넣으면 자식이 하나씩 나온다. 타일마다 스크립트를 붙일 필요가 없다.", {
    x: rx, y: 3.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("매 프레임 아홉 개를 다 확인한다. 그래서 한 번 놓쳐도 다음 프레임에 고쳐진다.", {
    x: M, y: c1 + 0.35, w: 8.1, h: 0.6, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("타일마다 Trigger 를 달고 벗어날 때만 옮기는 방식은 대각선으로 달릴 때 타일이 격자에서 이탈한다. 매 프레임 검사가 코드도 짧고 안 뚫린다.");
}

// ================================================================ 12. 069 실측
{
  const s = slide();
  head(s, "069", "실측 — 어디로 가도 바닥이 있다.", "Game.unity · 카메라 시야를 441점으로 훑었다.");

  shot(s, "069_Far", M, 2.15, 6.3, 3.55, "플레이어 (213, -147) — 처음과 똑같이 바닥이 깔려 있다");

  const rx = 7.55, rw = W - M - 7.55;
  const e1 = table(s, rx, 2.15, rw, [
    ["항목", 2.4, "strong", INK], ["측정값", 2.55, "code", INK],
  ], [
    ["무작위 15회 이동", "구멍 0 / 441점"],
    ["대각선 이동 8회", "구멍 0 / 441점"],
    ["타일 좌표 % 20", "전부 0"],
    ["타일 개수", "9 (그대로)"],
  ], null, 0.66);

  let y = h3(s, rx, e1 + 0.4, rw, "격자가 어긋나지 않는다.");
  body(s, rx, y, rw,
    "타일은 항상 60 의 배수만큼만 움직이므로 20 격자가 유지된다. 어느 방향으로든 바닥이 최소 20 유닛 더 있고, 카메라 반폭은 8.9 다.", 1.2);

  s.addNotes("이 수치는 실제로 재서 넣은 것이다. 처음 만든 Trigger 방식은 대각선에서 441점 중 273점이 비었다. 지금 방식으로 바꿔 0이 됐다.");
}

// ================================================================ 13. 070 8주 전 코드
{
  const s = slide();
  head(s, "070", "8주 전에 짠 코드를 꺼낸다.", "이 회차가 이 과정의 투자 회수 지점이다.");

  const bx = M, by = 2.4;
  s.addShape(pres.ShapeType.roundRect, { x: bx + 2.2, y: by, w: 2.6, h: 0.62, rectRadius: R_SM,
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("IDamageable", { x: bx + 2.2, y: by, w: 2.6, h: 0.62, align: "center", valign: "middle",
    fontFace: F_CODE, fontSize: T.body, color: CANVAS, margin: 0, isTextBox: true });

  s.addShape(pres.ShapeType.line, { x: bx + 3.5, y: by + 0.62, w: 0, h: 0.5, line: { color: HAIRLINE, width: 1 } });
  s.addShape(pres.ShapeType.line, { x: bx + 1.1, y: by + 1.12, w: 4.8, h: 0, line: { color: HAIRLINE, width: 1 } });
  s.addShape(pres.ShapeType.line, { x: bx + 1.1, y: by + 1.12, w: 0, h: 0.4, line: { color: HAIRLINE, width: 1 } });
  s.addShape(pres.ShapeType.line, { x: bx + 5.9, y: by + 1.12, w: 0, h: 0.4, line: { color: HAIRLINE, width: 1 } });

  [["Enemy", bx + 0.1, INK], ["PlayerHealth", bx + 4.9, INK]].forEach((n) => {
    s.addShape(pres.ShapeType.roundRect, { x: n[1], y: by + 1.52, w: 2.0, h: 0.62, rectRadius: R_SM,
      fill: { color: CANVAS_SOFT }, line: { width: 0 } });
    s.addText(n[0], { x: n[1], y: by + 1.52, w: 2.0, h: 0.62, align: "center", valign: "middle",
      fontFace: F_CODE, fontSize: T.body, color: n[2], margin: 0, isTextBox: true });
  });

  s.addShape(pres.ShapeType.line, { x: bx + 1.1, y: by + 2.14, w: 0, h: 0.45, line: { color: HAIRLINE, width: 1 } });
  s.addText("ChargerEnemy", { x: bx + 0.1, y: by + 2.62, w: 2.0, h: 0.4, align: "center",
    fontFace: F_CODE, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });

  s.addText("부모가 서로 다르다. 그래서 인터페이스가 필요하다.", {
    x: M, y: by + 3.25, w: 7.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  const rx = 7.9, rw = W - M - 7.9;
  table(s, rx, 2.15, rw, [["문법", 2.05, "code", INK], ["언제 배웠나", 2.55, "", MUTED]], [
    ["abstract class", "6주차 · 콘솔"],
    ["virtual / override", "6주차 · 콘솔"],
    ["interface", "6주차 · 콘솔"],
    ["protected", "5주차 · 콘솔"],
  ], null, 0.62);
  s.addText("오늘 새로 배우는 문법은 하나도 없다.", {
    x: rx, y: 5.45, w: rw, h: 0.5, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("6주차 콘솔 프로젝트를 실제로 열어서 실행해 보여준다. 앞 15분을 절대 줄이지 않는다. 8주 전 내용이라 다 잊었다고 가정한다.");
}

// ================================================================ 14. 070 abstract
{
  const s = slide();
  head(s, "070", "혼자서는 붙지 않는 부모.", "'몬스터' 라는 몬스터는 없다.");

  const c1 = code(s, M, 2.15, 7.2, [
    ["public abstract class Enemy", "b"],
    "    : MonoBehaviour, IDamageable",
    "{",
    "    protected virtual void Start()",
    "    {",
    "        currentHealth = maxHealth;",
    "    }",
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.35, 7.2, [
    ["Can't add script behaviour 'Enemy'.", "b"],
    ["The script class can't be abstract!", "b"],
  ], true);
  s.addText("Enemy.cs 를 오브젝트에 끌어다 놓으면 나오는 실제 메시지", {
    x: M, y: c2 + 0.12, w: 7.2, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.4, rw = W - M - 8.4;
  let y = h3(s, rx, 2.15, rw, "private Start 는\n자식이 못 덮어쓴다.");
  s.addText("유니티가 만들어주는 기본 코드가 private void Start 다. 그대로 두면 override 가 안 된다. protected virtual 로 고친다.", {
    x: rx, y: 3.3, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  inverse(s, rx, 4.9, rw, 1.6);
  s.addText("base.Start() 를 빼면\n첫 대미지에 죽는다.", {
    x: rx + 0.35, y: 5.2, w: rw - 0.7, h: 1.0, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("base.Start() 누락은 이 Phase 사고 상위권이다. 일부러 빼고 실행해서 체력 0 으로 시작하는 걸 보여준다.");
}

// ================================================================ 15. 070 IDamageable 실측
{
  const s = slide();
  head(s, "070", "몬스터는 플레이어를 모른다.", "아는 건 '맞을 수 있는 무언가' 하나뿐이다.");

  const c1 = code(s, M, 2.15, 7.6, [
    "private void OnCollisionEnter2D(Collision2D collision)",
    "{",
    ["    if (collision.gameObject", "b"],
    ["            .TryGetComponent(out IDamageable target))", "b"],
    "    {",
    "        Attack(target);",
    "    }",
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.35, 7.6, [
    ["Enemy : 돌진! 3 피해", "c"],
    ["플레이어 : -3  (남은 체력 17)", "c"],
  ], true);
  s.addText("실측 — Game.unity 에서 플레이어를 몬스터에 부딪혔을 때의 Console", {
    x: M, y: c2 + 0.12, w: 7.6, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.8, rw = W - M - 8.8;
  let y = h3(s, rx, 2.15, rw, "그래서 뭐가 좋은가.");
  s.addText("나중에 부술 수 있는 상자를 만들어도 몬스터 코드는 한 줄도 안 바뀐다. 상자에 IDamageable 만 붙이면 된다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("도전 미션에서 상자를 만든 학생을 반드시 데모시킨다.", {
    x: rx, y: 4.4, w: rw, h: 0.9, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("Rigidbody 2D 가 없으면 OnCollisionEnter2D 가 안 불린다. 043 체크리스트로 돌아간다. 이 회차 사고 2등이다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "이번 주 종료 조건.", "다섯 개다. 하나라도 안 되면 다음 주가 막힌다.");

  const chk = [
    "무한 맵이 어디로 가도 끊기지 않는다",
    "카메라가 부드럽게 따라간다",
    "입력과 이동이 다른 스크립트에 있다",
    "Enemy 를 상속한 몬스터가 화면에 있다",
    "플레이어와 몬스터가 같은 방식으로 맞는다",
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
    ["Snapshot_P5_Map", "070", "무한 맵 + 구조"],
    ["Snapshot_P5_Enemy", "075", "몬스터 3종"],
    ["Snapshot_P5_Full", "080", "코어 루프"],
  ], null, 0.6);
  s.addText("이 Phase 는 진도 격차가 최대가 된다. 5회차마다 배포한다.", {
    x: rx, y: 4.35, w: rw, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 15주차", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("몬스터가 쫓아온다. 그리고 셋이 된다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("071 – 075회차", { x: 9.2, y: 5.98, w: 3.4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("오늘 만든 Enemy 를 세 번 상속한다.", { x: 9.2, y: 6.34, w: 3.4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("070 구조를 잘 만들어 놓으면 072 몬스터 3종이 아주 쉬워진다. 반대로 070을 대충 하면 15주차 내내 막힌다.");
}

const out = path.join(__dirname, "14주차-여기서부터5개월.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
