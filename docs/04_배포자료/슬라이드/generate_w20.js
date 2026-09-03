// 20주차 화면을 잇는다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 7 마무리. 이 덱의 주장: 같은 값을 여러 곳에서 만지면 반드시 싸운다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 8장의 "창은 떠 있는데 게임이 돈다"

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
pres.title = "20주차 · 화면을 잇는다";

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
  s.addText("20주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("화면을 잇는다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("096–100 · Phase 7 마무리 · 100회차 = 전체의 70%", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["096", "레벨업 선택창"],
    ["097", "타이틀 · 결과 화면"],
    ["098", "일시정지"],
    ["099", "타격감"],
    ["100", "사운드 · 전체 점검"],
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
  s.addNotes("100회차는 전체 140회 중 100번째다. 이 사실을 첫 슬라이드와 마지막 슬라이드에서 두 번 말한다. 학생이 '얼마나 왔는지' 를 아는 것이 완주율에 직접 영향을 준다.");
}

// ================================================================ 2. 오늘의 지도
{
  const s = slide();
  head(s, null, "게임에 시작과 끝을 만든다.", "지금은 켜면 바로 시작하고, 죽으면 글자 한 줄이 전부다.");

  const y1 = h3(s, M, 2.05, CW, "만들 흐름");
  code(s, M, y1, CW, [
    ["Title.unity  ──[시작]──▶  Game.unity  ──[죽음]──▶  Result.unity", "b"],
    "     ▲                                                   │",
    "     └────────────────[타이틀]────────────────────────────┘",
    "                                                    [다시] ─▶ Game",
  ]);

  const y2 = table(s, M, 4.5, CW, [
    ["회차", 1.3, "code", MUTED], ["하는 것", 4.6, "strong", INK], ["새로 배우는 것", 5.77, "", MUTED],
  ], [
    ["096", "레벨업 창을 보이게", "Raycast Target · UI 층"],
    ["097", "화면 연결", "LoadScene · static"],
    ["098", "일시정지", "timeScale 의 주인"],
  ], null, 0.5);

  s.addNotes("096 은 코드를 거의 안 쓴다. 그런데 화면이 제일 많이 바뀐다. '프로그래밍 = 코드 쓰기' 라고 생각하는 학생에게 배치도 일이라는 걸 보여주는 회차다.");
}

// ================================================================ 3. 096 UI 층
{
  const s = slide();
  head(s, "096", "UI 는 층이다. 아래에 있을수록 위에 그려진다.", "Hierarchy 순서가 곧 그리는 순서다.");

  const y1 = code(s, M, 2.1, 6.3, [
    "HUD (Canvas)",
    [" ├ LevelUpPanel      ← 먼저 그려진다", "c"],
    " ├ ExpBar · HealthBar",
    " ├ LevelLabel · TimeLabel · KillLabel",
    [" └ PausePanel        ← 나중 = 맨 위", "b"],
  ]);

  table(s, 7.4, 2.1, 5.1, [
    ["Raycast Target", 2.6, "strong", INK], ["", 2.5, "", MUTED],
  ], [
    ["판때기", "켠다 — 뒤쪽 클릭을 막는다"],
    ["글자(TMP)", "끈다 — 버튼을 가리면 안 된다"],
  ], null, 0.62);

  const y3 = h3(s, M, y1 + 0.4, CW, "레벨업 창은 HUD 아래, 일시정지 창은 HUD 위");
  body(s, M, y3, CW, "업그레이드를 고를 땐 내 체력과 레벨이 보여야 한다. 멈췄을 땐 볼 이유가 없다. 층 순서는 취향이 아니라 이유가 있어야 한다.", 0.62);
  s.addNotes("글자의 Raycast Target 때문에 버튼이 안 눌리는 사고가 Phase 7 버튼 문제 2위다. Extra Settings 를 펼쳐야 보인다는 것까지 알려준다.");
}

// ================================================================ 4. 096 배치
{
  const s = slide();
  head(s, "096", "카드 간격은 눈대중하지 않는다.", "334 = 카드 폭 300 + 간격 34.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 2.6, "strong", INK], ["Anchor / Pivot", 2.9, "", MUTED],
    ["Pos", 2.6, "code", INK], ["크기 · 색", 3.57, "", MUTED],
  ], [
    ["LevelUpPanel", "사방 Stretch", "0", "알파 0.86 · Raycast 켬"],
    ["Title", "위 가운데", "(0, -150)", "54 · 노랑"],
    ["Card_0 / 1 / 2", "가운데", "-334 / 0 / +334", "300 x 250"],
    ["Card 안 Label", "사방 Stretch", "여백 22", "30 · 가운데"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.26, CW, "겪은 것 — 제목을 -80 에 뒀더니 시계와 겹쳤다");
  const y3 = body(s, M, y2, CW, "숫자만 보면 절대 안 보인다. -150 으로 내려야 안 겹친다. 배경 알파도 1.0 이 아니라 0.86 이다 — 완전히 까맣게 덮으면 '게임이 꺼졌나' 싶어진다.", 0.5);

  code(s, M, y3 + 0.1, CW, [
    ["Button Transition = Color Tint", "b"],
    "Highlighted (1.35, 1.35, 1.45)   Fade Duration 0.08",
    ["색은 곱해지는 값이라 1 을 넘으면 밝아진다. 이게 눌린다는 걸 알려주는 유일한 신호다.", "c"],
  ]);
  s.addNotes("Fade Duration 0 은 딱딱 끊긴다. 0.08 이 부드럽고 빠르다. 이 신호가 없으면 학생들이 버튼을 두 번 세 번 누른다.");
}

// ================================================================ 5. 097 씬 연결
{
  const s = slide();
  head(s, "097", "씬을 넘기려면 Build Settings 에 있어야 한다.", "여기 없는 씬은 LoadScene 이 못 찾는다.");

  const y1 = table(s, M, 2.1, 6.2, [
    ["번호", 1.4, "code", MUTED], ["씬", 2.4, "strong", INK], ["", 2.4, "", MUTED],
  ], [
    ["0", "Title", "게임을 켜면 여기부터"],
    ["1", "Game", ""],
    ["2", "Result", ""],
  ], null, 0.56);

  shot(s, "097_Title", 7.3, 2.1, 5.2, 2.4, "Title.unity · 오브젝트 4개면 된다");

  const y3 = h3(s, M, y1 + 0.3, CW, "타이틀 씬에 들어가는 것 — 네 개뿐");
  code(s, M, y3, CW, [
    "Main Camera    Orthographic · 배경색 · AudioListener",
    ["EventSystem    없으면 버튼이 안 눌린다 (085 회수)", "b"],
    "AudioManager   100회차에서 쓴다",
    "UI (Canvas)    Scale With Screen Size · 1280x720 · Match 0.5 (091 그대로)",
  ]);
  s.addNotes("에러 메시지가 친절하다: Scene ... couldn't be loaded because it has not been added to the build settings. 이 문구를 읽는 법을 알려주는 것도 수업이다.");
}

// ================================================================ 6. 097 사고
{
  const s = slide();
  head(s, "097", "의도된 사고 — 결과 화면에 처치 수가 0 이다.", "먼저 겪게 하고, 그 다음에 방법을 준다.");

  code(s, M, 2.05, CW, [
    ["// 일부러 틀린 코드", "c"],
    "killLabel.text = $\"처치 수   {GameManager.Instance.Kills}\";",
    "",
    ["NullReferenceException: Object reference not set to an instance of an object", "b"],
    "ResultView.Start ()",
  ], true);

  const y2 = h3(s, M, 4.35, CW, "GameManager 는 Game 씬의 오브젝트다.");
  const y3 = body(s, M, y2, CW, "씬이 바뀌면 그 씬의 오브젝트는 전부 사라진다. GameManager 도, 그 안에 들어 있던 처치 수도 같이 사라진다. 여러분이 만든 버그가 아니라 유니티가 그렇게 동작하는 것이다.", 0.66);

  inverse(s, M, y3 + 0.2, CW, 0.8, R_SM);
  s.addText("원칙 4번(불편을 먼저)의 마지막 적용 지점. 순서를 바꾸면 static 을 그냥 외운다.", {
    x: M + 0.34, y: y3 + 0.2, w: CW - 0.68, h: 0.8, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h4, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("학생이 스스로 답을 못 찾으면 Hierarchy 를 보여준다. 씬이 바뀐 뒤 GameManager 가 없다는 걸 눈으로 보게 하는 게 설명보다 빠르다.");
}

// ================================================================ 7. 097 static
{
  const s = slide();
  head(s, "097", "static 은 클래스에 붙어 있어서 씬을 안 탄다.", "적는 곳과 읽는 곳이 다르다 — 가운데 우편함을 둔다.");

  code(s, M, 2.05, 6.4, [
    "public static class RunResult",
    "{",
    ["    public static float Time;", "b"],
    ["    public static int   Kills;", "b"],
    ["    public static int   Level;", "b"],
    ["    public static bool  Cleared;", "b"],
    "",
    "    public static void Record(float time, int kills,",
    "                              int level, bool cleared) { ... }",
    "}",
  ]);

  shot(s, "097_Result", 7.3, 2.05, 5.2, 2.95, "실측 — 시간 8.7초 · 처치 2 · Lv.4 가 그대로 넘어왔다");

  const y2 = table(s, M, 5.15, 6.4, [
    ["", 2.5, "strong", INK], ["", 3.9, "", MUTED],
  ], [
    ["Game 씬", "RunResult.Record(...) 로 적는다"],
    ["Result 씬", "RunResult 에서 읽는다"],
  ], null, 0.5);
  s.addNotes("static class 는 인스턴스를 못 만든다. MonoBehaviour 도 아니고 씬에 붙일 수도 없다. 022회차의 static 을 실제로 쓰는 첫 자리다.");
}

// ================================================================ 8. 098 충돌 버그
{
  const s = slide();
  head(s, "098", "실제로 난 버그 — 창은 떠 있는데 게임이 돈다.", "timeScale 을 세 곳에서 만지고 있었다.");

  code(s, M, 2.0, CW, [
    "레벨업 창 열림   →  창 = True   timeScale = 0     ← 정상",
    ["(그 사이 플레이어가 맞아 히트스톱 발생)", "c"],
    ["1초 뒤          →  창 = True   timeScale = 1     ← 창은 떠 있는데 게임이 돈다", "b"],
  ]);

  const y2 = table(s, M, 3.5, CW, [
    ["누가", 3.2, "strong", INK], ["언제", 3.0, "", MUTED], ["무엇을", 5.47, "code", INK],
  ], [
    ["LevelUpView.Open", "레벨업", "timeScale = 0"],
    ["PauseView.Open", "ESC", "timeScale = 0"],
    ["GameManager.HitStop", "맞았을 때", "0 으로 했다가 1 로 되돌림"],
  ], ACCENT, 0.5);

  const y3 = h3(s, M, y2 + 0.28, CW, "히트스톱은 레벨업 창이 있는지 모른다. 알 방법도 없다.");
  body(s, M, y3, CW, "같은 값을 여러 곳에서 만지면 반드시 이런 일이 난다. 고치는 방법은 하나 — 주인을 정한다.", 0.5);
  s.addNotes("이 버그는 검증 중에 실제로 나왔다. 강의안 본문에 로그를 그대로 넣었다. 학생도 같은 구조로 만들면 같은 버그를 만난다.");
}

// ================================================================ 9. 098 고친 방법
{
  const s = slide();
  head(s, "098", "고친 방법 — 각자 만지지 말고 상태만 알린다.", "timeScale 의 주인은 GameManager 하나다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 3.3, "strong", INK], ["전", 4.0, "code", MUTED], ["후", 4.37, "code", INK],
  ], [
    ["LevelUpView", "Time.timeScale = 0f", "ChangeState(Upgrading)"],
    ["PauseView", "Time.timeScale = 0f", "ChangeState(Paused)"],
    ["HitStop 끝", "Time.timeScale = 1f", "if (!ShouldFreeze) 일 때만"],
  ], null, 0.5);

  const y2 = code(s, M, y1 + 0.26, CW, [
    ["private bool ShouldFreeze => IsFinished", "b"],
    ["    || State == GameState.Paused || State == GameState.Upgrading;", "b"],
    ["066회차에 만든 GameState 에 Paused 와 Upgrading 이 이미 있었다. 32주 만에 쓴다.", "c"],
  ]);

  code(s, M, y2 + 0.24, CW, [
    ["재측정", "c"],
    "레벨업 창 열림              state = Upgrading   timeScale = 0",
    "그 상태에서 HitStop 호출  →  timeScale = 0     ✅",
  ]);
  s.addNotes("'이 값을 누가 책임지는가' 는 유니티 얘기가 아니라 프로그램을 짤 때 계속 나오는 질문이다. 그 점을 명시적으로 말한다.");
}

// ================================================================ 10. 098 일시정지
{
  const s = slide();
  head(s, "098", "ESC 하나로 켜고 끈다.", "멈춰 있어도 Update 는 돈다 — 그래서 다시 풀 수 있다.");

  code(s, M, 2.1, 6.4, [
    "private void Update()",
    "{",
    "    if (!Input.GetKeyDown(KeyCode.Escape)) return;",
    "",
    ["    // 죽은 뒤엔 무시 · 레벨업 창이 떠 있어도 무시", "c"],
    "    if (GameManager.Instance.IsFinished) return;",
    "    if (levelUpView.IsOpen) return;",
    "",
    ["    if (IsOpen) Resume(); else Open();   // 토글", "b"],
    "}",
  ]);

  shot(s, "098_Pause", 7.4, 2.1, 5.1, 2.9, "실측 — Paused / timeScale 0, 클릭으로 복귀");

  const y2 = h3(s, M, 5.35, CW, "겪은 것 — 버튼에 글자가 없었다");
  body(s, M, y2, CW, "배경만 만들고 Label 의 Text 를 안 채웠다. 네모만 두 개 떠 있으면 이걸 먼저 의심한다. 오늘 1등 사고다.", 0.5);
  s.addNotes("ESC 가 안 먹는다는 질문의 절반은 Game 뷰에 포커스가 없어서다. 화면을 한 번 클릭하라고 먼저 말한다.");
}

// ================================================================ 11. 099 세 가지
{
  const s = slide();
  head(s, "099", "타격감 셋은 같은 문제를 갖는다.", "멈춰 있을 때(timeScale 0)도 움직여야 한다.");

  const y1 = table(s, M, 2.1, CW, [
    ["연출", 2.9, "strong", INK], ["시간", 1.5, "code", MUTED],
    ["어디에", 3.2, "", MUTED], ["쓰는 문법", 4.07, "code", INK],
  ], [
    ["화면 흔들림", "0.15초", "CameraFollow", "Time.unscaledDeltaTime"],
    ["시간 정지", "0.06초", "GameManager", "WaitForSecondsRealtime"],
    ["흰색 번쩍임", "0.06초", "Enemy", "WaitForSecondsRealtime"],
    ["조각 튀기", "0.35초", "DeathEffect", "sortingLayer = Effect"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.26, CW, "전부 0.5초 미만이다. 길면 오히려 답답해진다.");
  code(s, M, y2, CW, [
    ["WaitForSeconds 는 timeScale 이 0 이면 영원히 안 끝난다 — 게임이 얼어붙는다.", "b"],
    "yield return new WaitForSecondsRealtime(seconds);   // 진짜 시계를 본다",
  ]);
  s.addNotes("일부러 WaitForSeconds 로 바꿔 실행해 보여준다. 게임이 얼어붙는 걸 한 번 봐야 왜 Realtime 인지 기억한다.");
}

// ================================================================ 12. 099 어디서 부르나
{
  const s = slide();
  head(s, "099", "연출은 플레이어가 맞을 때만 크게 준다.", "칼 4자루가 초당 수십 번 맞는다 — 매번 흔들면 못 본다.");

  const y1 = table(s, M, 2.1, CW, [
    ["언제", 4.0, "strong", INK], ["연출", 4.3, "", MUTED], ["볼륨", 3.37, "code", INK],
  ], [
    ["몬스터가 맞을 때", "흰색 번쩍임", "0.5"],
    ["몬스터가 죽을 때", "조각 8개", "0.6"],
    ["플레이어가 맞을 때", "셰이크 + 히트스톱", "1.0"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.28, CW, "우리 수치 — 과한 쪽으로 한 번 가보게 한다");
  const y3 = table(s, M, y2, CW, [
    ["값", 3.4, "code", INK], ["우리 설정", 2.4, "code", INK], ["너무 크면", 5.87, "", MUTED],
  ], [
    ["shakePower", "0.12", "어지럽다. 화면이 뭘 보여주는지 모른다"],
    ["shakeTime", "0.15", "계속 흔들려 멀미가 난다"],
    ["hitStopTime", "0.06", "게임이 뚝뚝 끊긴다"],
  ], null, 0.5);

  s.addNotes("연출은 과하면 독이다. 정답은 없고 각자 재밌다고 느끼는 값이 정답이다 — 이 말을 수치 조정 실습 앞에서 한 번 한다. 볼륨으로 중요도를 말하는 건 095에서 글자 크기로 한 것과 같은 생각이다. 내가 맞은 건 제일 중요하니 제일 크다.");
}

// ================================================================ 13. 099 파티클 포기
{
  const s = slide();
  head(s, "099", "겪은 것 — 파티클을 포기하고 스프라이트로 갔다.", "안 되는 걸 붙잡기보다, 되는 걸로 만든다.");

  code(s, M, 2.1, 6.4, [
    ["ParticleSystem 으로 만들었더니", "c"],
    "",
    "입자 24개 살아 있음 · isVisible = True",
    "머티리얼 있음 · 위치도 화면 안",
    ["그런데 화면에는 아무것도 없다", "b"],
    "",
    ["정렬 레이어 · 머티리얼 · 크기를 다 고쳐도 안 나왔다", "c"],
  ]);

  shot(s, "099_Effect", 7.4, 2.1, 5.1, 2.9, "스프라이트 조각 8개 — 확실히 나온다");

  const y2 = h3(s, M, 5.35, CW, "원인 모를 렌더링 문제를 파는 건 좋은 선택이 아니다");
  body(s, M, y2, CW, "스프라이트는 이 게임의 모든 것이 쓰는 방식이라 예측이 된다. 파티클로 다시 해보는 건 도전 과제로 남겼다. 실력이 아니라 시간 배분의 문제다.", 0.5);
  s.addNotes("이 판단 자체를 가르친다. 학생은 막히면 끝까지 붙잡다가 회차를 통째로 날린다. 대안이 있으면 갈아타는 것도 실력이라고 말해준다.");
}

// ================================================================ 14. 100 사운드
{
  const s = slide();
  head(s, "100", "소리는 한 군데서만 낸다.", "몬스터마다 AudioSource 를 붙이면 30개가 동시에 울린다.");

  code(s, M, 2.05, CW, [
    "public void Play(AudioClip clip, float volume = 1f)",
    "{",
    "    if (clip == null || source == null) return;",
    "",
    ["    if (lastPlayed.TryGetValue(clip, out float last))", "b"],
    ["        if (Time.unscaledTime - last < minGap) return;   // 같은 소리는 0.05초 간격", "b"],
    "",
    "    lastPlayed[clip] = Time.unscaledTime;",
    ["    source.PlayOneShot(clip, volume);   // Play() 는 앞 소리를 끊는다", "b"],
    "}",
  ], true);

  const y2 = table(s, M, 5.3, CW, [
    ["", 3.4, "strong", INK], ["", 8.27, "", MUTED],
  ], [
    ["Dictionary 를 쓴 이유", "소리마다 따로 센다. 타격음이 났다고 버튼음까지 막으면 안 된다"],
    ["unscaledTime 인 이유", "멈춰 있어도 버튼음은 나야 한다"],
  ], null, 0.5);
  s.addNotes("AudioSource 는 Play On Awake 끄고 Spatial Blend 0(2D). 3D 로 두면 카메라 거리에 따라 볼륨이 변한다. 소리가 아예 안 난다는 질문의 1위는 에디터 뮤트 버튼이다.");
}

// ================================================================ 15. Phase 7 종료 조건
{
  const s = slide();
  head(s, "100", "Phase 7 종료 조건 — 아홉 개를 화면으로 확인한다.", "강사가 읽고 학생이 화면으로 답한다.");

  const y1 = table(s, M, 2.05, CW, [
    ["#", 0.8, "code", MUTED], ["확인할 것", 8.3, "strong", INK], ["회차", 2.57, "code", MUTED],
  ], [
    ["1", "창 크기를 바꿔도 UI 가 안 깨진다", "091 · 092"],
    ["2", "체력 · 경험치 · 레벨 · 시간 · 처치 수가 보인다", "094 · 095"],
    ["3", "한글이 □ 로 안 나온다", "093"],
    ["4", "레벨업 카드 3장이 제대로 보이고 눌린다", "096"],
    ["5", "타이틀 → 게임 → 결과가 끊김 없이 연결된다", "097"],
    ["6", "결과에 시간 · 처치 수 · 레벨이 정확히 나온다", "097"],
    ["7", "일시정지가 된다", "098"],
    ["8", "때리는 느낌이 난다", "099"],
    ["9", "효과음이 난다", "100"],
  ], null, 0.44);

  s.addText("Snapshot_P7_Full 배포 · UI 전체 + 화면 연결 + 연출 + 사운드", {
    x: M, y: y1 + 0.14, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("아홉 개 다 되는 학생 한 명을 골라 전체 시연시킨다. 안 되는 항목이 있는 학생은 그 자리에서 회차 번호를 보고 되짚게 한다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "Phase 7 회고 — 기능 0개, 물건이 됐다.", "10회차 동안 새 문법은 다섯 개뿐이다.");

  const y1 = table(s, M, 1.95, CW, [
    ["", 3.0, "strong", INK], ["Phase 6 끝 (090)", 4.3, "", MUTED], ["Phase 7 끝 (100)", 4.37, "", INK],
  ], [
    ["시작", "켜면 바로 시작", "타이틀 화면"],
    ["죽으면", "가운데 글자 한 줄", "결과 화면 (시간·처치·레벨)"],
    ["멈추기", "불가능", "ESC"],
    ["때리면", "조용히 사라짐", "흔들림 · 정지 · 조각 · 소리"],
    ["남에게 보여줄 만한가", "아니오", "예"],
  ], null, 0.44);

  s.addText("100회차 = 140회 중 100번째. 전체의 70% 를 지났다.", {
    x: M, y: y1 + 0.14, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 21주차 · Phase 8", { x: M, y: 5.82, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("이 과정 전체의 분기점.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("101회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("빌드 · 백업. 통과하면 반드시 완성작을 갖는다.", { x: 9.6, y: 6.34, w: 3.0, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("21주차를 통과하면 Phase 9(네트워크)가 잘 안 돼도 종강 때 보여줄 게 있다. 한 명도 빠짐없이 빌드와 백업을 끝낸다 — 이 말을 마지막에 못박는다.");
}

const out = path.join(__dirname, "20주차-화면을잇는다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
