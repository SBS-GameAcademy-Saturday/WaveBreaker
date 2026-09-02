// 8주차 코드로 움직이기 — Mobbin 디자인 시스템 (DESIGN.md)
// 8주차는 코딩 주간이라 스크린샷보다 코드가 내용이다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만

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
pres.title = "8주차 · 코드로 움직이기";

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

// 2열 표
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
  s.addText("8주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("코드로 움직이기.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("6주 동안 배운 클래스와 메서드가 드디어 나온다. 새로 배우는 게 아니다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.5, 5.0, 2.8);
  s.addImage({ path: img("039_DeltaTime"), x: 7.57, y: 1.72, w: 4.56, h: 2.36 });
  soft(s, 6.55, 3.65, 5.0, 2.8);
  s.addImage({ path: img("040_Input"), x: 6.77, y: 3.87, w: 4.56, h: 2.36 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("036 – 040회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 2 마무리 · 웨이브 브레이커", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("8주를 기다린 '내가 조종하는 캐릭터'가 이번 주 마지막에 나온다. 그 얘기를 첫 마디에 한다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "040에서 WASD로 움직이는 캐릭터가 완성된다. Phase 2의 산출물이다.");
  const items = [
    ["036", "첫 스크립트", "MonoBehaviour · Start · Update · Debug.Log"],
    ["037", "[SerializeField]", "코드를 안 고치고 값만 바꾼다 · Play 모드 함정"],
    ["038", "코드로 이동", "transform.position · localPosition · Vector3"],
    ["039", "Time.deltaTime", "컴퓨터가 달라도 같은 속도로"],
    ["040", "키보드 입력", "WASD 캐릭터 · SetActive · [ContextMenu]"],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let y = 2.42;
  items.forEach((it, i) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 4.4, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 5.55, y, w: CW - 5.55, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });
  s.addNotes("039는 037과 038에서 겪게 한 불편을 회수하는 회차다. 순서를 바꾸면 문법 암기가 된다.");
}

// ================================================================ 3. 036 콘솔과 나란히
{
  const s = slide();
  head(s, "036", "스크립트도 결국 클래스다.", "6주 동안 배운 것이 그대로 나온다. 새로 배우는 건 하나도 없다.");

  code(s, M, 2.15, 5.9, 2.05, [
    ["// 5~6주차 · 콘솔", "c"],
    "class Enemy",
    "{",
    "    void Attack()",
    "    {",
    "    }",
    "}",
  ]);
  code(s, 7.05, 2.15, W - M - 7.05, 2.05, [
    ["// 036회차 · 유니티", "c"],
    ["class HelloUnity : MonoBehaviour", "b"],
    "{",
    "    void Start()",
    "    {",
    "    }",
    "}",
  ]);

  const rows = [
    ["class Enemy", "class HelloUnity", "똑같은 클래스"],
    ["(상속 없음)", ": MonoBehaviour", "6주차에 배운 상속"],
    ["void Attack()", "void Start()", "똑같은 메서드"],
    ["내가 Main에서 호출", "유니티가 알아서 호출", "부르는 사람만 다르다"],
  ];
  table(s, M, 4.5, CW, [
    ["콘솔", 3.9, "code", MUTED], ["유니티", 4.0, "code", INK], ["같은 것", 3.7, "", MUTED],
  ], rows, null, 0.56);
  s.addNotes("MonoBehaviour 가 뭐냐고 물으면 '컴포넌트가 되게 해주는 부모 클래스'까지만. 상속 구조를 더 파면 오늘 목표가 날아간다.");
}

// ================================================================ 4. 036 Start / Update
{
  const s = slide();
  head(s, "036", "Start는 한 번, Update는 매 프레임.", "이 차이가 앞으로 7개월 내내 나온다.");

  code(s, M, 2.15, 6.4, 3.2, [
    "void Start()",
    "{",
    ["    Debug.Log(\"한 번만 실행됩니다\");", "b"],
    "}",
    "",
    "void Update()",
    "{",
    "    updateCount++;",
    ["    if (updateCount % 60 == 0)", "b"],
    "    {",
    "        Debug.Log(updateCount + \"번\");",
    "    }",
    "}",
  ]);

  const cx = 7.55, cwid = W - M - 7.55;
  s.addText("Console 출력", { x: cx, y: 2.15, w: cwid, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, cx, 2.55, cwid, 1.75, [
    "안녕하세요, 유니티",
    "Update 가 60번 실행됐습니다.",
    "Update 가 120번 실행됐습니다.",
    "Update 가 180번 실행됐습니다.",
  ], true);

  s.addText("매 프레임 찍으면 Console이 순식간에 잠긴다. 60번에 한 번만 찍어 얼마나 자주 도는지 눈으로 본다.", {
    x: cx, y: 4.5, w: cwid, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("파일 이름과 클래스 이름이 다르면 스크립트가 안 붙는다.", {
    x: M, y: 5.75, w: 9, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("\"Can't add script\" 가 뜨면 파일을 지우고 다시 만드는 게 이름 고치는 것보다 빠르다.", {
    x: M, y: 6.25, w: 11, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("저장 -> 유니티로 전환 -> 잠깐 기다림. 이 3단계를 오늘 최소 세 번 소리 내어 반복한다.");
}

// ================================================================ 5. 037 SerializeField
{
  const s = slide();
  head(s, "037", "private인데 왜 Inspector에 보이나.", "6주차 property 이야기와 같은 것이다.");

  code(s, M, 2.15, 6.4, 1.9, [
    ["[SerializeField] private float rotateStep = 1.5f;", "b"],
    "",
    "void Update()",
    "{",
    "    transform.Rotate(0f, 0f, rotateStep);",
    "}",
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  table(s, rx, 2.15, rw, [["", 2.0, "code", INK], ["", 2.9, "", MUTED]], [
    ["private", "다른 코드에서는 못 건드린다"],
    ["[SerializeField]", "Inspector 에게만 예외로 연다"],
    ["public", "아무 코드나 건드릴 수 있다"],
  ]);

  s.addText("밖에 열어주되, 아무나 못 바꾸게. 필요한 만큼만 여는 게 좋은 습관이다.", {
    x: rx, y: 4.5, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  inverse(s, M, 4.65, 6.4, 1.95);
  s.addText("Play 중에 바꾼 값은 멈추면 사라진다.", {
    x: M + 0.4, y: 5.0, w: 5.6, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Play 중엔 얼마가 좋은지 찾는 것만 한다. 찾았으면 멈추고 그 숫자를 넣는다.", {
    x: M + 0.4, y: 5.55, w: 5.6, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Play 중 값 날림은 반드시 나온다. Copy Component -> Paste Component Values 를 그 자리에서 실습시킨다.");
}

// ================================================================ 6. 038 world / local
{
  const s = slide();
  head(s, "038", "position은 월드, localPosition은 로컬.", "033에서 배운 것의 코드 버전이다. 이름이 그대로다.");

  code(s, M, 2.15, 6.4, 1.5, [
    ["Debug.Log(\"월드: \" + transform.position);", "b"],
    ["Debug.Log(\"로컬: \" + transform.localPosition);", "b"],
  ]);

  table(s, M, 3.95, 6.4, [["코드", 3.1, "code", INK], ["기준점", 3.3, "", MUTED]], [
    ["transform.position", "게임 세계의 원점"],
    ["transform.localPosition", "부모가 있는 자리"],
  ]);

  const rx = 7.55, rw = W - M - 7.55;
  inverse(s, rx, 2.15, rw, 2.85);
  s.addText("Inspector에 뜨는 건 항상 로컬이다.", {
    x: rx + 0.4, y: 2.48, w: rw - 0.8, h: 0.9, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
  s.addText("부모가 없으면 그게 곧 월드인 것뿐이다.", {
    x: rx + 0.4, y: 3.48, w: rw - 0.8, h: 0.4, fontFace: F_REG, fontSize: T.body, color: CANVAS, margin: 0, isTextBox: true });
  rule(s, rx + 0.4, 4.02, rw - 0.8, INK_SOFT);
  s.addText("부모가 없으면 같고, 자식이 되면 다르다.", {
    x: rx + 0.4, y: 4.18, w: rw - 0.8, h: 0.65, fontFace: F_LIGHT, fontSize: T.body, color: FAINT,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });

  s.addText("오늘 코드로 움직일 때는 position(월드)을 쓴다.", {
    x: rx, y: 5.3, w: rw, h: 0.44, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("지금 만드는 물체는 부모가 없어 어느 쪽이든 결과가 같지만, 월드로 생각하는 습관을 먼저 들인다. 로컬로 움직이는 상황은 Phase 5 총구 위치에서 나온다.", {
    x: rx, y: 5.78, w: rw, h: 1.1, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("033 마무리에 한 예고를 지키는 자리다. 그때 이름을 붙여뒀으니 오늘은 '코드 버전'으로만 소개하면 된다.");
}

// ================================================================ 7. 038 더해서 움직이기
{
  const s = slide();
  head(s, "038", "지금 위치 + 조금 = 새 위치.", "이걸 매 프레임 반복하니까 움직여 보인다.");

  code(s, M, 2.15, 6.9, 1.3, [
    ["transform.position = transform.position + Vector3.right * moveStep;", "b"],
  ]);

  table(s, M, 3.7, 6.9, [["조각", 3.6, "code", INK], ["뜻", 3.3, "", MUTED]], [
    ["Vector3.right * moveStep", "오른쪽으로 그만큼"],
    ["transform.position + ...", "지금 자리에서 더한 자리"],
    ["transform.position = ...", "그 자리로 옮긴다"],
  ]);

  const rx = 8.05, rw = W - M - 8.05;
  s.addText("가장 많이 나오는 실수", { x: rx, y: 2.15, w: rw, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, rx, 2.55, rw, 1.4, [
    ["transform.position.x = 5f;", "b"],
    ["// 컴파일 에러. 통째로 넣어야 한다", "c"],
  ]);
  code(s, rx, 4.15, rw, 1.4, [
    ["transform.position = Vector3.right;", "b"],
    ["// 움직이는 게 아니라 (1,0,0)에 붙는다", "c"],
  ]);
  s.addText("2D여도 position은 Vector3다. Vector2를 쓰면 형 변환 에러가 난다.", {
    x: rx, y: 5.75, w: rw, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("= 는 '같다'가 아니라 '넣는다'. 4회차에 한 그대로다. 학생이 가장 헷갈리는 지점이라 다시 짚는다.");
}

// ================================================================ 8. 039 왜 다른가
{
  const s = slide();
  head(s, "039", "왜 컴퓨터마다 속도가 다른가.", "037 회전과 038 이동에서 두 번 겪은 그 문제다.");

  s.addText("moveStep = 0.05 는 \"한 장 그릴 때마다 0.05\" 라는 뜻이었다.", {
    x: M, y: 2.15, w: 11, h: 0.4, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  table(s, M, 2.85, CW, [
    ["컴퓨터", 3.0, "", INK], ["1초에 그리는 장", 3.4, "", MUTED],
    ["Time.deltaTime", 3.2, "code", MUTED], ["1초에 가는 거리", 2.05, "strong", INK],
  ], [
    ["A", "60장", "0.0167", "3.0"],
    ["B", "144장", "0.0069", "7.2"],
  ]);

  s.addText("좋은 컴퓨터일수록 빨리 간다. 게임에서 이건 최악이다.", {
    x: M, y: 4.9, w: 11, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });

  inverse(s, M, 5.55, CW, 1.4);
  s.addText("우리가 원한 건 \"한 장마다 얼마\"가 아니라 \"1초에 얼마\" 였다.", {
    x: M + 0.4, y: 5.82, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Time.deltaTime 은 직전 한 장을 그리는 데 걸린 시간(초)이다. 빠른 컴퓨터일수록 이 값이 작아서, 곱하면 상쇄된다.", {
    x: M + 0.4, y: 6.32, w: 11.3, h: 0.44, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("1f / Time.deltaTime 을 화면에 찍어 학생마다 다른 숫자가 나오는 걸 눈으로 보여준다. 그게 원인이다.");
}

// ================================================================ 9. 039 고치기
{
  const s = slide();
  head(s, "039", "곱하면 값의 의미가 바뀐다.", "값이 갑자기 커져 놀라는데 단위가 바뀐 것이다. 0.05를 60번 하면 3이다.");

  s.addText("고치기 전", { x: M, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  code(s, M, 2.55, 6.0, 1.6, [
    "[SerializeField] float moveStep = 0.05f;",
    "",
    "position + moveDir * moveStep;",
  ]);

  s.addText("고친 뒤", { x: 7.15, y: 2.15, w: 4, h: 0.3,
    fontFace: F_SEMI, fontSize: T.label, color: INK, margin: 0, isTextBox: true });
  code(s, 7.15, 2.55, W - M - 7.15, 1.6, [
    ["[SerializeField] float moveSpeed = 3f;", "b"],
    "",
    ["position + moveDir * moveSpeed * Time.deltaTime;", "b"],
  ]);

  table(s, M, 4.55, CW, [
    ["스크립트", 3.0, "code", INK], ["이전", 3.4, "code", MUTED],
    ["이후", 3.4, "code", INK], ["뜻", 2.85, "", MUTED],
  ], [
    ["Spinner", "rotateStep 1.5", "rotateSpeed 90", "4초에 한 바퀴"],
    ["Bouncer", "scaleStep 0.01", "scaleSpeed 0.5", "1초에 0.5씩"],
    ["Mover", "moveStep 0.05", "moveSpeed 3", "1초에 3만큼"],
  ]);

  s.addNotes("이름도 같이 바꾼다. 안 바꾸면 나중에 moveSpeed = 3 을 보고 왜 이렇게 큰지 모른다. / 곱했는데 거의 안 움직인다는 학생이 오늘 1등이다. 값을 안 바꿔서 그렇다. 단위가 바뀌었다고 말해준다.");
}

// ================================================================ 10. 040 입력
{
  const s = slide();
  head(s, "040", "키를 누르면 숫자가 나온다.", "032에서 배운 그대로다. 양수면 오른쪽, 음수면 왼쪽.");

  code(s, M, 2.15, 6.0, 1.4, [
    ["float h = Input.GetAxisRaw(\"Horizontal\");", "b"],
    ["float v = Input.GetAxisRaw(\"Vertical\");", "b"],
  ]);

  table(s, M, 3.85, 6.0, [
    ["누르는 키", 2.4, "", INK], ["h", 1.8, "code", MUTED], ["v", 1.8, "code", MUTED],
  ], [
    ["아무것도", "0", "0"],
    ["D 또는 →", "1", "0"],
    ["A 또는 ←", "-1", "0"],
    ["W 또는 ↑", "0", "1"],
    ["S 또는 ↓", "0", "-1"],
  ]);

  const rx = 7.35, rw = W - M - 7.35;
  code(s, rx, 2.15, rw, 2.3, [
    ["Vector3 dir = new Vector3(h, v, 0f);", "b"],
    "",
    "transform.position =",
    "    transform.position",
    ["    + dir * moveSpeed * Time.deltaTime;", "b"],
  ]);
  s.addText("새로 배운 건 첫 두 줄뿐이다.", {
    x: rx, y: 4.75, w: rw, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
  s.addText("나머지는 038·039에서 한 그대로다. 키를 안 누르면 dir이 (0,0,0)이라 안 움직인다 — 조건문이 필요 없다.", {
    x: rx, y: 5.25, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("Play 후 Game 창을 한 번 클릭해야 키가 먹는다. 한/영도 영문이어야 한다. 안 움직인다는 질문의 대부분이 이 둘이다.");
}

// ================================================================ 11. 040 실습
{
  const s = slide();
  head(s, "040", "실습 — WASD로 움직이는 캐릭터.", "8주를 기다린 결과물이다. 서두르지 않는다.");

  code(s, M, 2.15, 6.6, 3.9, [
    "public class PlayerMove : MonoBehaviour",
    "{",
    "    [SerializeField] float moveSpeed = 5f;",
    "    [SerializeField] GameObject item;",
    "",
    "    void Update()",
    "    {",
    ["        // TODO ①~③ 이동", "c"],
    ["        // TODO ④ 스페이스로 item 토글", "c"],
    "    }",
    "",
    ["    // TODO ⑤ [ContextMenu] 원점으로", "c"],
    "}",
  ]);

  shot(s, "040_Input", 7.75, 2.15, 4.75, 2.7, "040_Input_Done — Player 와 Item");

  s.addText("Inspector의 Item 칸이 비어 있으면", {
    x: 7.75, y: 5.35, w: 4.75, h: 0.36, fontFace: F_SEMI, fontSize: T.title, color: INK, margin: 0, isTextBox: true });
  s.addText("스페이스를 누르는 순간 NullReferenceException 이 난다. Hierarchy에서 드래그해 넣는다.", {
    x: 7.75, y: 5.78, w: 4.75, h: 0.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  s.addNotes("WASD 가 되면 3분쯤 그냥 놀게 둔다. 이 순간이 Phase 2 의 목표다. 대각선이 빠른 건 눈치챈 학생에게만 normalized 를 개별로 알려준다.");
}

// ================================================================ 12. 흔한 사고
{
  const s = slide();
  head(s, null, "이번 주 흔한 사고.", "미리 알고 있으면 대응이 빨라진다. 강사용.");

  const acc = [
    ["Can't add script", "파일명 ≠ 클래스명", "파일을 지우고 다시 만든다", false],
    ["고쳤는데 반영이 안 됨", "저장 안 함 / 컴파일 대기", "저장 → 전환 → 기다림", false],
    ["곱했더니 거의 안 움직임", "값을 안 바꿈 (0.05 그대로)", "단위가 바뀌었다. 3으로", false],
    ["NullReferenceException", "Inspector 칸이 비어 있음", "Hierarchy 에서 드래그", false],
    ["키를 눌러도 안 움직임", "Active Input Handling", "Both 로. 에디터 재시작", true],
  ];
  rule(s, M, 2.2, CW, HAIRLINE);
  let ay = 2.4;
  acc.forEach((a, i) => {
    if (a[3]) soft(s, M - 0.28, ay - 0.1, CW + 0.56, 0.7, R_SM);
    s.addText(a[0], { x: M, y: ay, w: 4.3, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: M + 4.5, y: ay, w: 3.6, h: 0.46, fontFace: F_REG, fontSize: T.body, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[2], { x: M + 8.2, y: ay, w: 3.2, h: 0.46, fontFace: F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
    if (i < acc.length - 1) rule(s, M, ay + 0.62, CW);
    ay += 0.8;
  });

  const bw = 4.9, bh = 0.36;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.62, w: bw, h: bh, rectRadius: pill(bh),
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("040 전에 강사가 반드시 확인할 것", { x: M, y: 6.62, w: bw, h: bh,
    align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.label, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("New 전용이면 Input.GetAxisRaw 가 런타임에 예외를 던진다. 반 전체가 동시에 막힌다.", {
    x: M + bw + 0.35, y: 6.62, w: 6.5, h: 0.36, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    valign: "middle", margin: 0, isTextBox: true });
  s.addNotes("Active Input Handling 은 Project Settings > Player > Other Settings 에 있다. 바꾸면 에디터 재시작이 필요하다.");
}

// ================================================================ 13. Phase 2 종료 조건
{
  const s = slide();
  head(s, null, "Phase 2 종료 조건.", "040 데모에서 한 명씩 확인한다. Phase 3는 이 위에 그대로 쌓인다.");

  const chk = [
    "에디터 6개 창의 역할을 말한다",
    "F 키로 오브젝트를 찾는다",
    "Component 를 추가·제거한다",
    "월드 좌표와 로컬 좌표를 구분한다",
    "스크립트를 만들어 GameObject 에 붙인다",
    "Start / Update 차이를 한 문장으로 말한다",
    "[SerializeField] 를 Inspector 에서 조절한다",
    "Play 중 변경은 저장되지 않음을 안다",
    "움직이는 코드에 Time.deltaTime 을 곱한다",
    "WASD 로 캐릭터를 움직인다",
  ];
  chk.forEach((c, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const bx = M + col * 5.95;
    const by = 2.3 + row * 0.6;
    const last = (i === 9);
    s.addShape(pres.ShapeType.roundRect, { x: bx, y: by + 0.08, w: 0.22, h: 0.22, rectRadius: 0.05,
      fill: { color: CANVAS }, line: { color: last ? INK : HAIRLINE, width: last ? 1.5 : 1 } });
    s.addText(c, { x: bx + 0.42, y: by, w: 5.2, h: 0.4,
      fontFace: last ? F_SEMI : F_REG, fontSize: T.body, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });

  inverse(s, M, 5.5, CW, 1.3);
  s.addText("하나라도 안 되는 학생이 있으면 이번 주 안에 개별 시간을 잡는다.", {
    x: M + 0.4, y: 5.78, w: 11.3, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Snapshot_P2.zip 을 전원에게 배포한다. 못 따라온 학생은 다음 주에 이걸 열고 시작한다.", {
    x: M + 0.4, y: 6.3, w: 11.3, h: 0.4, fontFace: F_LIGHT, fontSize: T.body, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("Phase 3(물리·충돌)는 오늘 것 위에 그대로 쌓인다. 여기서 못 따라온 학생은 9주차에 더 못 따라온다.");
}

// ================================================================ 14. Phase 3 예고
{
  const s = slide();
  head(s, null, "다음 주부터 Phase 3.", "9~11주차. 유니티 2D 핵심.");

  const items = [
    ["041–045", "2D 물리와 충돌", "034에서 맛만 본 Rigidbody 를 제대로"],
    ["046–050", "프리팹과 코루틴", "총알을 찍어내고 몬스터를 스폰한다"],
    ["051–055", "체력과 피격", "총알이 몬스터를 맞히면 체력이 깎인다"],
  ];
  rule(s, M, 2.3, CW, HAIRLINE);
  let y = 2.55;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 1.7, h: 0.46, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 1.8, y, w: 4.2, h: 0.46, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.2, y, w: CW - 6.2, h: 0.46, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.66, CW);
    y += 0.88;
  });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주", { x: M, y: 5.82, w: 4, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("이제 캐릭터가 벽을 뚫고 지나간다.", { x: M, y: 6.22, w: 8, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("041 – 055회차", { x: 8.6, y: 5.98, w: 4, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("부딪히게 만드는 것부터 시작한다.", { x: 8.6, y: 6.34, w: 4, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("034 에서 Rigidbody 를 맛만 보여준 이유가 여기 있다. 조작이 먼저고 물리가 나중이다.");
}

const out = path.join(__dirname, "8주차-코드로움직이기.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
