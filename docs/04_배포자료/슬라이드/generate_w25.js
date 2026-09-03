// 25주차 배운 게 안 통할 때 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 9 마무리. 이 덱의 주장: 틀린 답이 아니라 그 상황에서 맞는 답이었다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 15장 "배운 게 안 통한 순간들"

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
pres.title = "25주차 · 배운 게 안 통할 때";

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
  s.addText("25주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("배운 게 안 통할 때.", { x: M, y: 2.6, w: 11, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("121–125 · Phase 9 마무리 · 125회차 = 전체의 89%", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["121", "줌 · 소프트 리쉬"],
    ["122", "다운 · 부활"],
    ["123", "양쪽 시간 정지"],
    ["124", "Relay"],
    ["125", "모드 통합"],
  ];
  let cx = M;
  const cw = CW / 5;
  items.forEach((it) => {
    s.addText(it[0], { x: cx, y: 4.85, w: cw, h: 0.3,
      fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
    s.addText(it[1], { x: cx, y: 5.18, w: cw - 0.2, h: 0.6,
      fontFace: F_MED, fontSize: T.bodySm, color: INK, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
    cx += cw;
  });
  s.addNotes("123회차가 이 주차의 뼈대다. 084에서 배운 Time.timeScale 이 협동에서 처음으로 안 통한다. '배운 게 안 통하는 순간' 을 정면으로 다루는 회차이고, 그게 네트워크의 본질이다.");
}

// ================================================================ 2. 121 문제
{
  const s = slide();
  head(s, "121", "가운데는 맞는데 볼 게 없다.", "120회차 도전 과제에서 학생이 이미 본 문제다.");

  const y1 = table(s, M, 2.1, CW, [
    ["필요한 것", 4.0, "strong", INK], ["왜", 7.67, "", MUTED],
  ], [
    ["줌아웃", "멀어진 만큼 화면을 넓힌다"],
    ["소프트 리쉬", "그래도 한계가 있으니 살짝 당긴다"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["// 가장 먼 두 점 사이의 거리를 잰다 — 이중 반복문", "c"],
    "foreach (Transform a in targets)",
    "    foreach (Transform b in targets)",
    "        span = Mathf.Max(span, Vector2.Distance(a.position, b.position));",
    "",
    ["// 🔑 목록이 하나면 Span 이 0 이다. 자기와 자기 거리는 0이니까.", "b"],
  ]);

  s.addText("이게 오늘의 핵심이다 — 싱글은 분기문 없이 자동으로 안 바뀐다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("2명이면 4번, 4명이면 16번 돈다. 사람 수가 적어서 괜찮다. 성능이 걱정되면 가장 먼 두 점만 따로 추적하면 되지만 지금은 필요 없다.");
}

// ================================================================ 3. 121 줌
{
  const s = slide();
  head(s, "121", "Clamp 로 막고 Lerp 로 부드럽게.", "안 막으면 무한히 넓어진다.");

  const y1 = code(s, M, 2.1, CW, [
    ["float goal = Mathf.Clamp(baseSize + Span * zoomPadding, baseSize, maxSize);", "b"],
    "",
    "cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, goal, Time.deltaTime / zoomSmooth);",
  ]);

  const y2 = table(s, M, y1 + 0.3, 6.3, [
    ["항목", 2.4, "code", INK], ["값", 1.2, "code", INK], ["뜻", 2.7, "", MUTED],
  ], [
    ["baseSize", "5", "기본 크기 (091 그대로)"],
    ["maxSize", "8.5", "이 이상 안 넓힌다"],
    ["zoomPadding", "0.6", "거리 1당 얼마나"],
    ["zoomSmooth", "0.4", "0이면 뚝뚝"],
  ], null, 0.5);

  code(s, 7.4, y1 + 0.3, 5.1, [
    ["실측", "c"],
    "",
    ["Span = 1.34", "b"],
    ["   → ortho = 5.80", "b"],
    "",
    ["5 + 1.34 × 0.6 = 5.80", "c"],
    "",
    ["싱글 : ortho = 5.00", "b"],
  ]);
  s.addNotes("Lerp 는 095의 SmoothDamp 와 같은 생각이다. 목표값으로 서서히 가는 것. 싱글에서 5.00 이 그대로 나오는지 반드시 확인시킨다.");
}

// ================================================================ 4. 121 리쉬
{
  const s = slide();
  head(s, "121", "'딱딱하게' 막으면 조작이 씹힌다.", "그래서 이름이 소프트 리쉬다.");

  const y1 = code(s, M, 2.1, CW, [
    ["if (!IsOwner) return;              // 내 캐릭터만 내가 당긴다 (114)", "b"],
    ["if (cam.Span <= 0.01f) return;     // 혼자면 당길 이유가 없다", "b"],
    "",
    "float dist = toCenter.magnitude;",
    "if (dist <= maxDistance) return;",
    "",
    ["float over = dist - maxDistance;   // 넘은 만큼만, 많이 넘을수록 세게", "b"],
    "transform.position += (Vector3)(toCenter.normalized * over * pullStrength * Time.deltaTime);",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 5.0, "strong", INK], ["IsOwner 검사", 6.67, "", MUTED],
  ], [
    ["카메라 목록 (120)", "넣으면 안 된다 — 다시 한 명만 따라간다"],
    ["소프트 리쉬 (121)", "넣어야 한다 — 내 캐릭터만 내가 당긴다"],
  ], null, 0.5);

  s.addText("매번 \"이 동작이 나만의 것인가\" 를 물어야 하는 이유가 이것이다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("120에서는 넣으면 안 됐고 121에서는 넣어야 한다. 바로 다음 회차에서 반대가 되므로 학생이 반드시 헷갈린다. 이 표를 칠판에 남겨둔다.");
}

// ================================================================ 5. 122 기획서
{
  const s = slide();
  head(s, "122", "혼자면 죽는데 둘이면 산다.", "기획서 11장 — 부활 규칙이 협동의 재미다.");

  const y1 = table(s, M, 2.1, CW, [
    ["항목", 3.4, "strong", INK], ["내용", 8.27, "", MUTED],
  ], [
    ["체력", "개별"],
    ["사망", "쓰러진 상태(다운). 즉시 게임오버 아님"],
    ["부활", "동료가 3초간 곁에 있으면 체력 30으로"],
    ["전멸", "둘 다 다운되면 게임 오버"],
  ], null, 0.46);

  const y2 = h3(s, M, y1 + 0.2, CW, "다운은 '죽음' 이 아니라 '상태' 다");
  const y3 = body(s, M, y2, CW, "오브젝트를 없애면 안 된다 — 부활해야 하니까. 게이지도 동기화한다 — 상대 화면에 바를 보여주려면 알아야 하니까.", 0.42);

  code(s, M, y3 + 0.16, CW, [
    ["public NetworkVariable<bool>  IsDown         = new(false, Everyone, Server);", "b"],
    ["public NetworkVariable<float> ReviveProgress = new(0f,    Everyone, Server);", "b"],
  ]);
  s.addNotes("이 과정에서 협동이 협동다워지는 순간이 122회차다. 그 점을 학생에게 말해준다. 몬스터가 오는데 3초를 버텨야 하는 긴장감이 핵심이다.");
}

// ================================================================ 6. 122 세 가지 검사
{
  const s = slide();
  head(s, "122", "부활 조건 — 세 가지를 걸러낸다.", "하나만 빠뜨려도 규칙이 무너진다.");

  const y1 = table(s, M, 2.1, CW, [
    ["검사", 5.0, "code", INK], ["빼면", 6.67, "", MUTED],
  ], [
    ["obj == NetworkObject", "자기 자신이 자기를 살린다"],
    ["other.IsDown.Value", "둘 다 쓰러졌는데 서로 살린다 — 게임이 안 끝난다"],
    ["거리 > reviveRange", "멀리서도 살아난다"],
    ["게이지 0 으로 초기화", "왔다갔다 하면서 살릴 수 있다"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    "if (!helperNear)",
    "{",
    ["    ReviveProgress.Value = 0f;   // 떨어지면 처음부터", "b"],
    "    return;",
    "}",
    "ReviveProgress.Value += Time.deltaTime;",
  ]);

  s.addNotes("네 번째가 규칙의 핵심이다. 3초간 '계속' 곁에 있어야 한다. 이게 몬스터를 막으면서 버티는 긴장감을 만든다.");
}

// ================================================================ 7. 122 실측
{
  const s = slide();
  head(s, "122", "재본 값 — 게이지가 차고 체력 30으로 살아난다.", "기획서 그대로다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[다운시킨 직후]", "c"],
    "  플레이어 0 체력 20 다운=False",
    ["  플레이어 1 체력  0 다운=True   부활게이지 0.0", "b"],
    "",
    ["[동료를 1.20 거리로 옮기고 2초 뒤]", "c"],
    ["  플레이어 1 다운=True   부활게이지 2.1", "b"],
    "",
    ["[4초 뒤]", "c"],
    ["  플레이어 1 체력 30 다운=False   ← 부활", "b"],
  ]);

  const y2 = code(s, M, y1 + 0.28, CW, [
    "[호스트] 소유자 1 다운",
    ["[호스트] 소유자 1 부활 — 체력 30", "b"],
  ]);

  s.addText("SetHealth 를 maxHealth 로 Clamp 하면 30이 20으로 잘린다 — 122회차 2등 사고다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("부활 체력이 최대 체력보다 클 수 있다는 게 포인트다. Mathf.Max(value, 0) 만 쓰고 상한은 부르는 쪽에 맡긴다.");
}

// ================================================================ 8. 123 안 통한다
{
  const s = slide();
  head(s, "123", "Time.timeScale 이 협동에서는 안 통한다.", "084·098에서 배운 게 여기서 처음으로 막힌다.");

  const y1 = code(s, M, 2.1, CW, [
    "   내 화면                          상대 화면",
    " timeScale = 0                    timeScale = 1",
    " ┌──────────────┐                ┌──────────────┐",
    [" │ 멈춰 있다     │                │ 몬스터가 온다  │", "b"],
    " │ 카드를 고른다  │                │ 계속 돈다     │",
    " └──────────────┘                └──────────────┘",
    "",
    ["        돌아왔을 땐 이미 죽어 있다", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "틀린 코드가 아니다 — 전제가 달라진 것이다");
  body(s, M, y2, CW, "싱글에서는 완벽하게 동작한다. 게임이 하나일 때만 통하는 방법이었을 뿐이다. 106회차의 '게임이 두 개' 가 여기서 또 나온다.", 0.6);
  s.addNotes("'맞는 답' 이 아니라 '그 상황에서 맞는 답' 이었다는 말을 여기서 처음 한다. 마지막 슬라이드에서 다시 정리한다.");
}

// ================================================================ 9. 123 서버가 멈춤을 든다
{
  const s = slide();
  head(s, "123", "멈춤도 동기화한다.", "무엇을 멈출지 우리가 고른다 — timeScale 로는 못 하던 것.");

  const y1 = code(s, M, 2.05, CW, [
    ["public NetworkVariable<bool> Paused = new(false, Everyone, Server);", "b"],
    ["public static bool IsPaused => Instance != null && Instance.Paused.Value;", "b"],
    "",
    ["// 움직이는 것 세 곳이 이 값을 본다", "c"],
    "NetworkEnemy.FixedUpdate       : if (IsPaused) { 속도 0; return; }",
    "NetworkWaveManager.SpawnOne    : if (IsPaused) return;",
    "NetworkPlayerMove.FixedUpdate  : if (IsPaused) { 속도 0; return; }",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "timeScale 은 유니티가 알아서 멈춰줬다. 이번엔 우리가 정한다.");
  body(s, M, y2, CW, "그게 오히려 나은 점도 있다 — UI 애니메이션은 계속 돌게 둘 수 있다. timeScale 로는 그게 안 됐다(084의 그 문제).", 0.6);
  s.addNotes("세 곳뿐인 이유는 움직이는 게 몬스터·스폰·플레이어 셋이기 때문이다. 어디를 빠뜨렸는지 학생이 직접 찾게 하면 구조가 머리에 들어온다.");
}

// ================================================================ 10. 123 둘 다 골라야
{
  const s = slide();
  head(s, "123", "둘 다 골라야 다시 움직인다.", "한 명만 고르고 기다리는 게 협동이다.");

  const y1 = code(s, M, 2.05, 6.4, [
    "[Rpc(SendTo.Server)]",
    "private void ChoiceRpc(int index)",
    "{",
    "    chosenCount++;",
    "    int total = NetworkManager.Singleton",
    "                    .ConnectedClientsIds.Count;",
    "",
    ["    if (chosenCount < total) return;", "b"],
    "",
    "    NetworkTeam.Instance.SetPaused(false);",
    "}",
  ]);

  shot(s, "123_LevelUp", 7.4, 2.05, 5.1, 2.4, "레벨업 창 — 양쪽에 똑같이 뜬다");

  const y3 = code(s, M, y1 + 0.3, CW, [
    ["[호스트가 카드를 고른 뒤 — 실측]", "c"],
    "선택 1 / 2명",
    ["멈춤 = True     ← 클라이언트가 아직 안 골랐다", "b"],
    ["내 패널 = False  ← 내 것만 닫혔다", "b"],
  ]);
  s.addNotes("창은 OnValueChanged 로 양쪽에 자동으로 뜬다 — Rpc 가 필요 없다. 선택만 Rpc 로 올린다. 116회차의 '값이 유지되면 NetworkVariable' 규칙 그대로다.");
}

// ================================================================ 11. 124 Relay 왜
{
  const s = slide();
  head(s, "124", "왜 중계 서버인가.", "비대면 수업에서 포트포워딩은 절대 못 시킨다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[직접 연결]  내 컴퓨터 ──?── 공유기 ──?── 공유기 ──?── 친구 컴퓨터", "c"],
    ["                              막혀 있다", "c"],
    "",
    ["[Relay]      내 컴퓨터 ────▶ 유니티 서버 ◀──── 친구 컴퓨터", "b"],
    ["                             둘 다 \"나가는\" 연결이라 막히지 않는다", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["🔴 미리 확인할 것", 5.0, "strong", INK], ["안 되면 나오는 에러", 6.67, "", MUTED],
  ], [
    ["Play 모드에서 실행", "Unity Services can only be initialized in Play Mode"],
    ["Unity Cloud 프로젝트 연결", "프로젝트 ID 관련"],
    ["대시보드에서 Relay 켜기", "service is not enabled"],
    ["에디터에 계정 로그인", "인증 관련"],
  ], null, 0.5);

  s.addNotes("첫 번째가 흔하다. 강사도 에디트 모드에서 시도했다가 이 에러를 봤다. 나머지 셋은 22주차 전에 미리 검증해 두라고 Phase 9 문서가 못박고 있다.");
}

// ================================================================ 12. 124 실측
{
  const s = slide();
  head(s, "124", "실제로 코드가 나오고 호스트가 떴다.", "127.0.0.1 이 진짜 인터넷 주소로 바뀐다.");

  const y1 = code(s, M, 2.1, CW, [
    ["UnityServices 초기화 = Initialized", "b"],
    "로그인 = True   PlayerId = L1xXNWcKBH4J45bpKTHhOJwYEj9f",
    "",
    ["접속 코드 = RMKDHN", "b"],
    "Relay 서버 = 34.180.64.245:37000",
    "StartHost = True",
    "IsListening=True  IsHost=True  내 번호=0",
    ["전송 방식 = RelayUnityTransport", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 4.0, "strong", INK], ["호스트", 3.6, "code", MUTED], ["클라이언트", 4.07, "code", INK],
  ], [
    ["CreateAllocation 인자", "maxPlayers - 1", "—"],
    ["hostConnectionData", "null", "join.HostConnectionData"],
    ["시작", "StartHost()", "StartClient()"],
  ], null, 0.5);

  s.addNotes("코드 입력은 Trim().ToUpper() 로 받는다. 학생이 소문자로 치거나 앞뒤에 공백을 넣는다. maxPlayers 를 그대로 넣으면 3인 방이 된다.");
}

// ================================================================ 13. 125 왜 안 합쳤나
{
  const s = slide();
  head(s, "125", "왜 씬을 하나로 안 합쳤나 — 정직하게 말한다.", "실력의 문제가 아니라 판단이다.");

  const y1 = table(s, M, 2.1, CW, [
    ["구분", 4.0, "strong", INK], ["씬 구성", 7.67, "", MUTED],
  ], [
    ["이상적인 모습", "Game.unity 하나에서 혼자도 하고 같이도 한다"],
    ["지금 우리 모습", "Game.unity(혼자) 와 Coop.unity(같이) 두 개"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "본 게임은 풀에서 꺼내고, 협동은 Spawn() 으로 만든다");
  const y3 = body(s, M, y2, CW, "이 둘을 한 코드로 합치려면 스폰 경로를 통째로 갈아엎어야 한다. 그러다 실패하면 21주차의 완성작이 깨진다. 그래서 안 합쳤다.", 0.6);

  code(s, M, y3 + 0.16, CW, [
    ["// 다만 합칠 준비는 해뒀다 — NetworkRole (117회차)", "c"],
    ["if (nm == null) return true;        // 씬에 없다 = 싱글 모드다", "b"],
    ["if (!nm.IsListening) return true;   // 접속 안 했으면 싱글과 같다", "b"],
  ]);
  s.addNotes("학생이 '왜 안 합쳤냐' 고 물으면 좋은 질문이다. 정직하게 답한다. 본 게임 WaveManager 는 이미 이 문지기를 쓰고 있고, 카메라는 한 파일로 둘 다 처리한다.");
}

// ================================================================ 14. 125 재확인
{
  const s = slide();
  head(s, "125", "이 과정에서 가장 중요한 25분.", "20회차 동안 협동을 만들며 21주차 완성작을 안 깨뜨렸는가.");

  shot(s, "125_Modes", 7.4, 2.05, 5.1, 2.9, "타이틀 — 혼자 하기 / 같이 하기");

  const y1 = code(s, M, 2.05, 6.3, [
    ["[혼자 하기 — 실측]", "c"],
    "씬 = Game",
    "시간 14초  처치 5  Lv.1  체력 20/20",
    "살아있는 몬스터 2  풀 재사용 26",
    ["NetworkRole.IsServerOrOffline = True", "b"],
    ["NetworkManager 존재 = False", "b"],
    "카메라 목록 1개",
    ["싱글 카메라 ortho = 5.00", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "싱글에는 네트워크가 하나도 안 끼어 있다");
  body(s, M, y2, CW, "카메라 크기도 5.00 그대로다 — 121회차에 줌을 넣었는데도. 하나라도 다르면 오늘 고친다. 못 고치면 21주차 백업으로 되돌린다.", 0.5);
  s.addNotes("Phase 9 문서가 종료 조건 마지막 줄에 '[혼자 하기]도 여전히 정상 동작한다 ⭐' 를 넣고 매 회차 확인을 요구했다. 오늘이 마지막 확인이다.");
}

// ================================================================ 15. 배운 게 안 통한 순간
{
  const s = slide();
  head(s, null, "배운 게 안 통한 순간들.", "'틀린 답' 이 아니라 '그 상황에서 맞는 답' 이었다.");

  const y1 = table(s, M, 2.15, CW, [
    ["배운 것", 4.0, "code", INK], ["어디서 안 통했나", 3.0, "code", MUTED], ["대신", 4.67, "", INK],
  ], [
    ["Time.timeScale = 0  (084)", "123회차", "서버가 Paused 를 들고 있는다"],
    ["Instantiate  (047)", "117회차", "NetworkObject.Spawn()"],
    ["Destroy  (048)", "117회차", "Despawn()"],
    ["값을 직접 바꾸기", "115회차", "서버에 Rpc 로 부탁"],
  ], ACCENT, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "앞으로도 계속 만난다");
  body(s, M, y2, CW, "그때 물어야 할 것은 하나다 — \"전제가 뭐였지?\" 싱글에서는 게임이 하나였고, 협동에서는 둘이다. 그 차이가 전부다.", 0.6);
  s.addNotes("이 슬라이드가 Phase 9 전체의 결론이다. 문법을 몇 개 배웠느냐보다 이 태도가 남아야 한다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "Phase 9 회고 — 20회차가 끝났다.", "협동이 안 된 학생도 21주차 빌드가 제출물이 된다.");

  const y1 = table(s, M, 1.95, CW, [
    ["주차", 1.5, "code", MUTED], ["회차", 1.6, "code", MUTED], ["한 것", 8.57, "strong", INK],
  ], [
    ["22", "106–110", "개념 · 설치 · 첫 접속 · 가상 플레이어"],
    ["23", "111–115", "2인 접속 · 이동 동기화 · IsOwner · NetworkVariable"],
    ["24", "116–120", "Rpc · 서버 스폰 · 젬 · 피격 · 협동 카메라"],
    ["25", "121–125", "줌 · 부활 · 시간 정지 · Relay · 모드 통합"],
  ], null, 0.5);

  s.addText("125 / 140 회차 — 89%.  그러려고 21주차에 백업했다.", {
    x: M, y: y1 + 0.16, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 26주차 · 마지막 Phase", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("친구에게 링크로 보낸다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("126–130회차", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("최종 빌드 · 배포 · 발표.", { x: 9.6, y: 6.34, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("협동이 끝내 안 된 학생이 있어도 괜찮다고 반드시 말한다. Phase 8 빌드가 제출물이 되고, 그게 21주차 백업의 목적이었다.");
}

const out = path.join(__dirname, "25주차-배운게안통할때.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
