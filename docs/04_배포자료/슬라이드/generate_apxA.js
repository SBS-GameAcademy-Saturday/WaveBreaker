// 부록 A · 지금은 안 배우는 것 — Mobbin 디자인 시스템 (DESIGN.md)
// CSharpStudyProject 중 001–030 범위 밖 자료. 이 덱의 주장: 안 배운 목록이 다음 단계 목록이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 4장 "102회차 오브젝트 풀링"

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
pres.title = "부록 A · 지금은 안 배우는 것";

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
  s.addText("부록 A · CSharpStudyProject", { x: M, y: 2.15, w: 8, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("지금은 안 배웁니다.", { x: M, y: 2.6, w: 11, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("001–030 범위 밖 자료 — 언제 다시 만나는지, 왜 안 쓰는지", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["나중에 쓴다", "여덟 갈래 · 유니티 구간에서"],
    ["아예 안 쓴다", "열 가지 · 자리가 없다"],
    ["도전 과제", "RPGProjectil.md"],
  ];
  let cx = M;
  const cw = CW / 3;
  items.forEach((it) => {
    s.addText(it[0], { x: cx, y: 4.85, w: cw, h: 0.3,
      fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
    s.addText(it[1], { x: cx, y: 5.18, w: cw - 0.3, h: 0.6,
      fontFace: F_MED, fontSize: T.bodySm, color: INK, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
    cx += cw;
  });
  s.addNotes("이 덱은 강의안이 아니라 안내용이다. 학생이 저장소를 열어보고 '이건 왜 안 해요' 라고 물을 때 쓴다. 매 기수 나오는 질문이라 미리 답을 준비해 두는 게 낫다. 파일 수는 2026-09-03 기준 78개이고 저장소가 계속 커지는 중이므로 숫자는 그때그때 확인한다.");
}

// ================================================================ 2. 왜 이 덱이 있나
{
  const s = slide();
  head(s, null, "파일은 78개, 회차는 30개다.", "다 하면 게임을 못 만든다.");

  const y1 = table(s, M, 2.15, CW, [
    ["챕터", 3.6, "code", INK], ["내용", 5.0, "", MUTED], ["파일", 1.5, "code", MUTED], ["쓰나", 1.57, "", INK],
  ], [
    ["Chapter1_Data", "변수 · 자료형 · 연산자", "13", "전부"],
    ["Chapter2_CodeFlow", "조건문 · 반복문", "11", "전부"],
    ["Chapter3_String", "문자열", "12", "2개만"],
    ["Chapter4_Method", "메서드", "7", "4개"],
    ["Chapter5_OOP", "클래스 · 상속 · 다형성", "14", "12개"],
    ["Chapter6_DataStructure", "배열 · List · Dictionary …", "11", "4개"],
    ["Chapter7_Extension", "제네릭 · 델리게이트 · 람다 …", "10", "2개"],
  ], null, 0.44);

  s.addText("고른 기준은 하나다 — \"게임을 만들 때 실제로 쓰는가\"", {
    x: M, y: y1 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("숫자를 먼저 보여주는 게 설득력이 있다. '안 가르친다' 가 아니라 '예산이 30회차뿐이다' 라는 프레임으로 말한다. 자른 것들은 이 덱 뒷부분에서 하나씩 이유를 댄다.");
}

// ================================================================ 3. 세 부류
{
  const s = slide();
  head(s, null, "세 부류로 나눴다.", "'안 배운다' 와 '안 쓴다' 는 다르다.");

  const y1 = table(s, M, 2.15, CW, [
    ["부류", 3.2, "strong", INK], ["언제", 3.4, "", MUTED], ["예", 5.07, "code", MUTED],
  ], [
    ["① 지금 배운다", "001–030회차", "변수 · 반복문 · 클래스 · 상속"],
    ["② 나중에 만난다", "유니티 구간 (031–130)", "Dictionary · Event · Generic"],
    ["③ 아예 안 쓴다", "이 과정에는 자리가 없다", "정규식 · Reflection · 클로저"],
  ], null, 0.6);

  const y2 = h3(s, M, y1 + 0.3, CW, "②는 \"미리 볼 필요 없다\" 는 뜻이다");
  body(s, M, y2, CW, "필요해지는 회차에 그 자리에서 배운다. 문법을 먼저 외우고 나중에 쓰는 것보다, 막힌 자리에서 배우는 게 훨씬 오래 남는다.", 0.6);
  s.addNotes("②를 미리 예습하겠다는 학생이 꼭 나온다. 말리지는 않되 '그때 다시 할 거라 급하지 않다' 고 말해준다. 진짜로 급한 건 3주차 반복문이다.");
}

// ================================================================ 4. 나중① Dictionary + Queue (ACCENT)
{
  const s = slide();
  head(s, "나중 ①", "Dictionary 와 Queue — 102회차에 나온다.", "오브젝트 풀링. 이 과정에서 자료구조가 가장 크게 쓰이는 자리다.");

  const y1 = table(s, M, 2.1, CW, [
    ["자료", 4.2, "code", INK], ["회차", 2.4, "code", MUTED], ["어디에", 5.07, "", MUTED],
  ], [
    ["Chapter6/Class4.cs", "102", "Dictionary — 프리팹별 서랍을 찾는다"],
    ["Chapter6/Class6.cs", "102", "Queue — 서랍 안에 쌓아 둔다"],
  ], ACCENT, 0.52);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["// PoolManager.cs — 실제 코드", "c"],
    ["private readonly Dictionary<GameObject, Queue<GameObject>> drawers", "b"],
    ["    = new Dictionary<GameObject, Queue<GameObject>>();", "b"],
    "",
    ["// \"어느 프리팹의\" 서랍을 찾아서 \"하나 꺼낸다\"", "c"],
    "if (!drawers.TryGetValue(prefab, out Queue<GameObject> drawer)) { ... }",
    "while (drawer.Count > 0 && go == null) go = drawer.Dequeue();",
  ]);

  s.addText("List 만 알아도 게임은 만들어진다. 그런데 여기서는 안 된다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("102회차에서 이 코드를 처음 보여줄 때 '이거 6장에서 봤죠' 라고 회수한다. Dictionary 를 미리 가르치는 것보다 이 자리가 훨씬 잘 붙는다. 101회차의 렉 체험이 바로 앞에 있어서 동기가 이미 만들어져 있다.");
}

// ================================================================ 5. 나중② Delegate · Event
{
  const s = slide();
  head(s, "나중 ②", "Delegate 와 Event — 115회차에 나온다.", "\"값이 바뀌면 알려줘\" 를 처음 쓰는 자리다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 싱글 HUD 는 이벤트를 안 쓴다 — 매 프레임 읽어서 그린다", "c"],
    "void Update() { healthBar.Set(playerHealth.Current, playerHealth.Max); }",
    "",
    ["// 115회차 NetworkHealthDemo.cs — 여기서 처음 += 가 나온다", "c"],
    ["Health.OnValueChanged += OnHealthChanged;    // 바뀌면 불러줘", "b"],
    ["Health.OnValueChanged -= OnHealthChanged;    // 사라질 땐 반드시 뗀다", "b"],
    "",
    "private void OnHealthChanged(int before, int after) { ... }",
  ]);

  const y2 = table(s, M, y1 + 0.28, CW, [
    ["자료", 4.2, "code", INK], ["회차", 2.4, "code", MUTED], ["어디에", 5.07, "", MUTED],
  ], [
    ["Chapter7/Class4.cs", "115", "Delegate — 함수를 값처럼 담는다"],
    ["Chapter7/Class6.cs", "115·119·122", "Event — += 로 구독하고 -= 로 뗀다"],
  ], null, 0.48);

  s.addNotes("싱글 구간에서는 이벤트를 한 번도 안 쓴다. HUDView 가 Update 에서 매 프레임 읽어 그리기 때문이다. 그래서 delegate/event 의 첫 실전은 115회차 NetworkVariable.OnValueChanged 다. 구독 해제(-=)를 안 하면 사라진 오브젝트를 계속 부른다는 점을 그 자리에서 짚는다.");
}

// ================================================================ 6. 나중③ Property
{
  const s = slide();
  head(s, "나중 ③", "Property 는 세 번 만난다.", "024에서 한 번 배우고, 070·081에서 다시 쓴다.");

  const y1 = table(s, M, 2.15, CW, [
    ["회차", 1.8, "code", MUTED], ["무엇", 3.6, "strong", INK], ["왜 거기서", 6.27, "", MUTED],
  ], [
    ["024", "처음 배운다", "\"필드를 열어두면 아무나 체력을 -999로 바꾼다\""],
    ["070", "PlayerHealth", "Current 는 읽기만, 바꾸는 건 메서드로"],
    ["081", "PlayerLevel", "Exp 가 바뀌면 레벨업을 검사해야 한다"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["// Chapter7/Class3.cs — Property", "c"],
    ["public int Current { get; private set; }   // 밖에서 읽기만 된다", "b"],
    "",
    ["// 121회차 CameraFollow 에도 그대로 나온다", "c"],
    ["public float Span { get; private set; }", "b"],
  ]);
  s.addNotes("Property 는 Chapter7 에 있지만 024회차에 당겨서 쓴다. 은닉성(Class8) 바로 다음이 자연스럽다. 챕터 순서와 회차 순서가 1:1이 아니라는 걸 강사가 알고 있어야 한다.");
}

// ================================================================ 7. 나중④ Generic
{
  const s = slide();
  head(s, "나중 ④", "Generic — 115회차에 한 줄이면 된다.", "만들 일은 없다. 읽을 줄만 알면 된다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 115회차 — 네트워크 체력 동기화", "c"],
    ["public NetworkVariable<int> Health = new(20, Everyone, Server);", "b"],
    ["                        ↑", "c"],
    ["              \"int 을 담는\" 이라는 뜻이다", "c"],
    "",
    ["// 이미 016~017회차에 써봤다", "c"],
    "List<int>   Dictionary<GameObject, Queue<GameObject>>",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "쓰는 법은 배우고, 만드는 법은 안 배운다");
  const y3 = body(s, M, y2, CW, "제네릭 클래스를 직접 설계할 일이 이 과정에는 없다. List 와 NetworkVariable 을 읽을 수 있으면 충분하다.", 0.5);

  s.addText("자료 : Chapter7/Class1.cs — 필요하면 그때 한 장만 본다", {
    x: M, y: y3 + 0.16, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("꺾쇠 괄호를 처음 보는 학생이 겁을 먹는다. '담을 것의 종류를 적는 칸' 이라고만 말해주면 넘어간다. 016회차 List<int> 에서 이미 지나간 문법이라는 걸 짚어준다.");
}

// ================================================================ 8. 나중⑤ Exception
{
  const s = slide();
  head(s, "나중 ⑤", "Exception — 124회차 Relay 에서 처음 필요해진다.", "그 전까지는 에러가 나면 그냥 고치면 됐다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 124회차 RelayConnector.cs", "c"],
    "try",
    "{",
    "    var alloc = await RelayService.Instance.CreateAllocationAsync(maxPlayers - 1);",
    "    joinCode = await RelayService.Instance.GetJoinCodeAsync(alloc.AllocationId);",
    "}",
    ["catch (System.Exception e)", "b"],
    "{",
    ["    Debug.Log(\"방 만들기 실패 — \" + e.Message);   // 게임은 계속 돈다", "b"],
    "}",
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "내 잘못이 아닌 실패가 처음 나오는 자리다");
  body(s, M, y2, CW, "인터넷이 끊기거나 유니티 서버가 응답하지 않으면 내 코드가 맞아도 실패한다. 그때 게임이 멈추지 않게 하는 게 try/catch 다. 자료 : Chapter7/Class8.cs", 0.6);
  s.addNotes("124회차 사고표 첫 줄이 'Play 모드가 아니면 초기화 실패' 다. 그 에러를 try/catch 로 잡아 로그로 보여주는 흐름을 그 자리에서 만든다. 문법을 미리 배울 필요가 없는 대표적인 예다.");
}

// ================================================================ 9. 나중⑥ 스택과 힙
{
  const s = slide();
  head(s, "나중 ⑥", "스택과 힙 · 박싱 — 101회차의 배경 지식.", "\"왜 렉이 걸리나\" 를 설명할 때 필요하다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 101회차 실측 — 몬스터를 계속 만들고 없앴을 때", "c"],
    "",
    ["몬스터 3668마리   45.2 FPS", "b"],
    "",
    ["// Instantiate 는 힙에 새로 만들고, Destroy 는 쓰레기로 남긴다", "c"],
    ["// 쓰레기가 쌓이면 청소기(GC)가 돌고, 그때 화면이 끊긴다", "c"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["자료", 4.2, "code", INK], ["무엇", 7.47, "", MUTED],
  ], [
    ["Chapter5/Class4.cs", "스택과 힙 — 값은 어디에 놓이나"],
    ["Chapter5/Class13.cs", "Boxing / Unboxing — 조용히 힙을 쓰는 경우"],
  ], null, 0.5);

  s.addText("101회차는 원리보다 체감이 먼저다. 렉을 겪은 뒤에 이 두 장을 편다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("21주차 실측에서 풀링만으로는 프레임이 안 돌아왔고 개수 상한(maxAlive 250)이 결정적이었다. 그래서 이 두 장은 '원인 설명' 용이지 '해결책' 이 아니다. 그 점을 강사가 헷갈리지 않아야 한다.");
}

// ================================================================ 10. 나중 목록 전체
{
  const s = slide();
  head(s, null, "나중에 만나는 것 — 전부.", "예습할 필요 없다. 그 회차에 그 자리에서 한다.");

  const y1 = table(s, M, 1.95, CW, [
    ["자료", 3.7, "code", INK], ["무엇", 3.4, "", MUTED], ["회차", 1.4, "code", MUTED], ["어디에", 3.17, "", INK],
  ], [
    ["Ch6/Class4 · Class6", "Dictionary · Queue", "102", "오브젝트 풀링"],
    ["Ch7/Class4 · Class6", "Delegate · Event", "115", "OnValueChanged +="],
    ["Ch7/Class7", "Lambda", "085", "AddListener(() => …)"],
    ["Ch4/Class7", "클로저", "085", "int index = i; 가 필요한 이유"],
    ["Ch7/Class3", "Property", "024·070·081", "체력 · 경험치"],
    ["Ch7/Class1", "Generic", "115", "NetworkVariable<T>"],
    ["Ch7/Class8", "Exception", "124", "Relay try/catch"],
    ["Ch5/Class4 · Class13", "스택 · 힙 · 박싱", "101", "왜 렉이 걸리나"],
  ], null, 0.44);

  s.addText("여덟 갈래다. 전부 \"필요해지는 회차\" 가 정해져 있다.", {
    x: M, y: y1 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("이 표를 인쇄해 두면 학생이 '이건 언제 해요' 라고 물을 때 바로 답할 수 있다. 회차 번호를 말해주는 것 자체가 불안을 크게 줄인다.");
}

// ================================================================ 11. 안 씀① 문자열 심화
{
  const s = slide();
  head(s, "안 씀 ①", "문자열 심화 4종 — 게임에 안 나온다.", "우리 게임의 문자열은 HUD 표시가 전부다.");

  const y1 = table(s, M, 2.1, CW, [
    ["자료", 3.7, "code", INK], ["무엇", 3.0, "", MUTED], ["왜 안 쓰나", 5.0, "", INK],
  ], [
    ["Ch3/Class9", "정규 표현식", "검사할 텍스트 입력이 없다"],
    ["Ch3/Class10", "인코딩 · 디코딩", "파일 저장 · 통신을 직접 안 다룬다"],
    ["Ch3/Class6", "StringBuilder", "문자열을 수천 번 이어붙일 일이 없다"],
    ["Ch3/Class8", "Raw 문자열 리터럴", "긴 텍스트 블록을 쓸 일이 없다"],
  ], null, 0.5);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["// 우리 게임이 쓰는 문자열은 이 정도가 끝이다", "c"],
    ["hpText.text = $\"{current} / {max}\";", "b"],
    ["timeText.text = $\"{m:00}:{s:00}\";", "b"],
  ]);

  s.addText("Chapter3 에서 쓰는 건 Class1(포맷팅) 과 Class2(파싱) 두 개다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("웹이나 업무 프로그램이면 정규식이 필수다. 게임 클라이언트에서는 거의 안 쓴다. '분야가 다르면 필요한 문법도 다르다' 는 설명을 여기서 한 번 해두면 좋다.");
}

// ================================================================ 12. 안 씀② 자료구조
{
  const s = slide();
  head(s, "안 씀 ②", "자료구조 3종 — List 와 Dictionary 면 다 된다.", "쓸 자리가 있어야 배우는 의미가 있다.");

  const y1 = table(s, M, 2.1, CW, [
    ["자료", 3.7, "code", INK], ["무엇", 3.0, "", MUTED], ["대신 쓰는 것", 5.0, "", INK],
  ], [
    ["Ch6/Class8", "LinkedList", "List — 중간 삽입이 잦지 않다"],
    ["Ch6/Class9", "SortedList", "List + 필요할 때 정렬"],
    ["Ch6/Class10", "SortedDictionary", "Dictionary — 순서가 필요 없다"],
  ], null, 0.55);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["쓰는 것", 3.7, "code", INK], ["어디에", 8.0, "", MUTED],
  ], [
    ["List<T>", "카메라 대상 목록(095) · 업그레이드 카드(082) · 스폰 지점(073)"],
    ["Dictionary<K,V>", "오브젝트 풀 서랍(102)"],
    ["Queue<T>", "풀 안에 쌓인 오브젝트(102)"],
    ["HashSet<T>", "안 씀 — 중복 제거가 필요한 자리가 없다"],
  ], null, 0.46);

  s.addNotes("Stack 도 안 쓴다. 되돌리기(undo)나 탐색 알고리즘이 있으면 나오는데 우리 게임엔 없다. 학생이 알고리즘 공부를 하고 싶다고 하면 그건 별개 트랙이라고 말해준다.");
}

// ================================================================ 13. 안 씀③ 클로저 · Reflection
{
  const s = slide();
  head(s, "안 씀 ③", "Reflection · Nullable · Action — 쓸 자리가 없다.", "\"어렵다\" 가 아니라 \"안 나온다\" 가 이유다.");

  const y1 = table(s, M, 2.15, CW, [
    ["자료", 3.7, "code", INK], ["무엇", 3.0, "", MUTED], ["왜 지금은 아닌가", 5.0, "", INK],
  ], [
    ["Ch7/Class9", "Reflection", "타입을 런타임에 뒤진다 — 쓸 자리가 없다"],
    ["Ch7/Class10", "Nullable", "게임 값에 \"없음\" 상태를 안 쓴다"],
    ["Ch7/Class5", "Action · Func", "이벤트를 직접 선언할 일이 없다"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "쓸 자리 없이 배운 문법은 억지로 끼워 넣게 된다");
  body(s, M, y2, CW, "노베이스 구간에서 이게 제일 위험하다 — 동작은 하는데 왜 그런지는 모르는 코드가 남는다. 반대로 클로저(Ch4/Class7)는 085회차에서 실제로 걸리므로 \"안 씀\" 에서 뺐다.", 0.6);
  s.addNotes("진도가 빠른 학생이 Reflection 을 발견하고 신기해하는 경우가 있다. 막지는 말되 '본 프로젝트에는 넣지 말자' 고 선을 긋는다. 유니티에서 Reflection 은 성능 문제도 있다. Action/Func 는 읽을 일은 있어도 직접 선언할 일이 없다.");
}

// ================================================================ 14. 자른 이유
{
  const s = slide();
  head(s, null, "자른 게 나쁜 게 아니다.", "140회차라는 예산이 있고, 목표는 게임을 완성하는 것이다.");

  const y1 = table(s, M, 2.1, CW, [
    ["구간", 2.6, "code", MUTED], ["회차", 1.6, "code", MUTED], ["무엇", 7.47, "strong", INK],
  ], [
    ["Phase 0–1", "001–030", "C# — 게임에 쓰는 것만"],
    ["Phase 2–8", "031–105", "유니티 · 게임 완성 · 빌드"],
    ["Phase 9–10", "106–130", "네트워크 협동 · 배포 · 발표"],
    ["버퍼", "131–140", "밀린 진도 · 개인 확장"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.3, CW, "C# 문법에 30회차를 더 쓰면 협동 모드가 없어진다");
  body(s, M, y2, CW, "정규식과 Reflection 을 다 배우고 게임을 못 만드는 것보다, 안 배우고 게임을 배포하는 쪽이 낫다고 판단했다. 이 판단은 뒤집을 수 있다 — 버퍼 10회가 그래서 있다.", 0.6);
  s.addNotes("커리큘럼은 무엇을 넣느냐가 아니라 무엇을 빼느냐로 결정된다. 이 슬라이드는 학생보다 강사에게 필요한 장이다. 요청이 들어올 때 흔들리지 않으려면 기준이 명시돼 있어야 한다.");
}

// ================================================================ 15. RPGProjectil
{
  const s = slide();
  head(s, null, "RPGProjectil.md — 도전 과제.", "빠른 학생이 지루해할 때 꺼낸다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// delegate 로 스킬의 형태를 정의하고, event 로 발동을 알린다", "c"],
    ["public delegate void SkillAction(Character target);", "b"],
    "",
    "public class Character { ... }",
    "public class Player  : Character { ... }",
    ["public class Monster : Character { ... }   // 030회차 구조 그대로다", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["언제", 3.2, "strong", INK], ["누구에게", 8.47, "", MUTED],
  ], [
    ["029~030회차", "⭐도전 — 진도가 빠른 학생"],
    ["버퍼 131–140", "개인 확장 과제"],
  ], null, 0.5);

  s.addText("delegate·event 를 먼저 만나므로 115회차가 훨씬 수월해진다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Phase 0 위험 신호에 '진도 빠른 학생이 지루해함 → 콘솔 과제 난이도를 열어준다' 가 있다. 이 과제가 그 카드다. 유니티를 미리 알려주는 것보다 이쪽이 낫다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "안 배운 목록이 다음 단계 목록이다.", "이 과정이 끝나도 저장소는 남는다.");

  const y1 = table(s, M, 1.95, CW, [
    ["하고 싶은 것", 5.2, "strong", INK], ["먼저 볼 것", 6.47, "code", MUTED],
  ], [
    ["게임 코드를 더 깔끔하게", "Ch5/Class12 클래스 설계 원칙"],
    ["UI 를 이벤트로 묶고 싶다", "Ch7/Class4 · Class6 Delegate · Event"],
    ["성능을 더 짜내고 싶다", "Ch5/Class4 · Class13 스택 · 힙 · 박싱"],
    ["게임 밖 프로그램도 만들고 싶다", "Ch3 문자열 · Ch7/Class9 Reflection"],
  ], null, 0.5);

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("저장소", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("CSharpStudyProject", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("회차 대응표", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("docs/00_기획/\nCsharp-학습자료-연동.md", { x: 9.6, y: 6.34, w: 3.0, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.bodySm, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("종강 때 이 장을 한 번 더 보여준다. 130회차의 '하나를 깊게' 와 이어진다. 저장소가 남아 있다는 사실 자체가 학생에게 안심이 된다.");
}

const out = path.join(__dirname, "부록A-CSharp-지금은-안-배우는-것.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
