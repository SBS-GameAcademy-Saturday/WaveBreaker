// 부록 A · 더 알아야 하는 것 — Mobbin 디자인 시스템 (DESIGN.md)
// 심화. 이 덱의 주장: 게임은 초당 60번 도는 프로그램이라 신경 쓸 곳이 다르다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 7장 "풀링만으론 부족했다"

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
pres.title = "부록 A · 더 알아야 하는 것";

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
  s.addText("부록 A · 심화", { x: M, y: 2.15, w: 8, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("더 알아야 하는 것.", { x: M, y: 2.6, w: 11, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("문법 30회차로는 게임이 안 굴러간다 — 현업이 쓰는 것들", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["성능", "힙 · GC · 풀링 · 문자열 · 박싱"],
    ["구조", "Property · Event · 람다 · 자료구조 · 제네릭"],
    ["안전", "Exception · 그리고 더 만날 것들"],
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
  s.addNotes("이 덱은 '안 배우는 것 목록' 이 아니라 '더 배워야 하는 것' 이다. 001-030 은 문법의 최소 집합일 뿐이고, 유니티 구간에서 이 열 가지가 실제로 필요해진다. 절반이 성능 이야기인 이유는 게임이 매 프레임 도는 프로그램이기 때문이다.");
}

// ================================================================ 2. 왜 필요한가
{
  const s = slide();
  head(s, null, "게임은 초당 60번 도는 프로그램이다.", "그래서 일반 프로그래밍과 신경 쓰는 곳이 다르다.");

  const y1 = table(s, M, 2.1, CW, [
    ["묶음", 2.2, "code", MUTED], ["무엇", 4.4, "strong", INK], ["왜 게임에서 특히", 5.07, "", MUTED],
  ], [
    ["성능", "힙 · GC · 풀링 · 문자열", "1프레임에 16 ms 밖에 없다"],
    ["구조", "Property · Event · 자료구조", "20회차 뒤에도 고칠 수 있어야 한다"],
    ["안전", "Exception", "내 잘못이 아닌 실패가 있다"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "001–030 은 문법의 최소 집합이다");
  body(s, M, y2, CW, "그걸로 콘솔 프로그램은 만들어진다. 그런데 몬스터 3000마리가 나오는 순간 다른 지식이 필요해진다. 이 덱이 그 목록이다.", 0.55);
  s.addNotes("16.7 ms 라는 숫자를 칠판에 쓴다. 60 FPS 를 유지하려면 한 프레임에 쓸 수 있는 시간이 그것뿐이다. 이 숫자가 이후 성능 슬라이드 전부의 기준이 된다.");
}

// ================================================================ 3. 성능① 힙과 GC
{
  const s = slide();
  head(s, "성능 ①", "만들고 없애면 쓰레기가 쌓인다.", "그 쓰레기를 치우는 순간 화면이 끊긴다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["// 스택 — 함수가 끝나면 저절로 사라진다", "c"],
    "int hp = 20;   Vector2 dir;",
    "",
    ["// 힙 — 아무도 안 쓰게 되면 '쓰레기'", "c"],
    "GameObject go = Instantiate(prefab);",
    "Destroy(go);",
    "",
    ["// 청소기(GC)가 언제 도는지 우리가 못 정한다", "b"],
    ["// 하필 전투 중에 돌면 그때 끊긴다", "b"],
  ]);

  const y2 = table(s, 7.4, 2.1, 5.1, [
    ["101회차 실측", 3.0, "strong", INK], ["", 2.1, "code", MUTED],
  ], [
    ["살아있는 몬스터", "3668"],
    ["평균 FPS", "45.2"],
    ["Destroy 500개", "+4 KB"],
  ], null, 0.5);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.28, CW, "C# 은 메모리를 알아서 치워준다 — 대신 언제 치울지는 못 정한다");
  body(s, M, y3, CW, "이게 게임에서 문제가 되는 이유다. 자료 : Chapter5/Class4(스택과 힙) · Class13(박싱)", 0.5);
  s.addNotes("C++ 은 직접 지우고 C# 은 알아서 지워준다. 편한 대신 '언제' 를 못 고른다. 그래서 게임에서는 아예 쓰레기를 안 만드는 쪽으로 간다. 그 방법이 다음 장의 풀링이다.");
}

// ================================================================ 4. 성능② 풀링이 뭔가
{
  const s = slide();
  head(s, "성능 ②", "오브젝트 풀링 — 현업의 기본기다.", "안 만들고 안 없앤다. 껐다 켠다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["[안 쓰면]  필요하다 → Instantiate", "c"],
    ["           죽었다   → Destroy       → 쓰레기", "c"],
    "",
    ["[풀링]     필요하다 → 서랍에서 꺼내 SetActive(true)", "b"],
    ["           죽었다   → SetActive(false) 로 서랍에 넣기", "b"],
    "",
    ["           오브젝트는 계속 살아 있다. 쓰레기가 안 생긴다.", "b"],
  ]);

  const y2 = code(s, 7.4, 2.05, 5.1, [
    ["// PoolManager.cs", "c"],
    "private readonly",
    "  Dictionary<GameObject,",
    "    Queue<GameObject>>",
    ["      drawers;", "b"],
    "",
    ["// 프리팹 → 그 프리팹의 서랍", "c"],
    ["// 서랍 안 = Queue", "c"],
  ]);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.28, CW, "총알 · 몬스터 · 이펙트 · 데미지 숫자 — 자주 나고 죽는 것 전부");
  body(s, M, y3, CW, "우리는 102·103회차에서 몬스터 · 총알 · 젬 · 죽음 이펙트에 넣었다. 자료 : Chapter6/Class4(Dictionary) · Class6(Queue)", 0.5);
  s.addNotes("풀링은 유니티에만 있는 개념이 아니다. 서버의 커넥션 풀, 스레드 풀도 같은 생각이다. '비싼 것을 미리 만들어 두고 돌려 쓴다.' 현업 면접에서도 자주 나온다.");
}

// ================================================================ 5. 성능③ 풀링 실측
{
  const s = slide();
  head(s, "성능 ③", "얼마나 싸지나 — 재봤다.", "21주차 실측 · 500개씩 · 몸풀기 후.");

  const y1 = code(s, M, 2.1, CW, [
    ["Instantiate 500개 : 9.2 ms   (1개당 18 µs)", "b"],
    "Destroy     500개 : 2.0 ms   (1개당  4 µs)    관리 힙 +4 KB",
    "",
    ["SetActive 껐다 켜기 : 2.6 ms  (1개당  5 µs)   힙 0 KB", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 3.6, "strong", INK], ["Instantiate + Destroy", 4.0, "code", MUTED], ["풀링", 4.07, "code", INK],
  ], [
    ["1개 비용", "22 µs", "5 µs"],
    ["남는 쓰레기", "4 KB", "0 KB"],
    ["12초 정상 플레이", "—", "만든 것 15 · 재사용 22"],
  ], null, 0.5);

  s.addText("만드는 비용 22 µs → 5 µs, 쓰레기 4 KB → 0 KB. 이게 풀링이 주는 것이다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("재사용 비율 59% 는 12초 플레이 기준이다. 오래 할수록 이 비율이 올라간다. 처음 몇 초는 서랍이 비어 있어서 만들 수밖에 없기 때문이다.");
}

// ================================================================ 6. 성능④ 풀링의 함정
{
  const s = slide();
  head(s, "성능 ④", "풀링을 넣으면 반드시 겪는 세 가지.", "우리도 102·103회차에서 다 겪었다.");

  const y1 = table(s, M, 2.1, CW, [
    ["증상", 4.2, "strong", INK], ["진짜 원인", 7.47, "", MUTED],
  ], [
    ["재활용된 몬스터가 체력 0", "Start 는 처음 한 번만 돈다 → 초기화를 OnEnable 로"],
    ["총알이 엉뚱한 방향으로", "방향을 만든 뒤에 줬다 → 꺼낼 때 같이 줘야 한다"],
    ["서랍 속 물건이 사라진다", "Destroy(go, 초) 예약은 풀링과 같이 못 쓴다"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["// 🚨 Start 는 처음 한 번만. 서랍에서 꺼낼 때는 안 돈다.", "c"],
    "void Start()    { health = maxHealth; }",
    "",
    ["// ✅ OnEnable 은 SetActive(true) 마다 돈다.", "c"],
    ["void OnEnable() { health = maxHealth; }", "b"],
  ]);

  s.addText("풀링의 어려움은 문법이 아니라 \"초기화를 어디서 하느냐\" 다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("첫 번째가 압도적으로 흔하다. 재활용 정확성 실측에서 '죽인 뒤 다시 꺼내면 체력 10' 을 확인했고, 총알은 속도 (12,0) → 재활용 시 (0,12) 로 방향이 바뀌는 걸 봤다. 세 가지를 미리 말해주면 시간을 크게 아낀다.");
}

// ================================================================ 7. 성능⑤ 풀링만으론 부족했다 (ACCENT)
{
  const s = slide();
  head(s, "성능 ⑤", "그런데 풀링만으로는 프레임이 안 살아났다.", "21주차에 실제로 재보고 강의안을 고쳤다.");

  const y1 = table(s, M, 2.1, CW, [
    ["상태", 4.6, "strong", INK], ["살아있는 몬스터", 3.4, "code", MUTED], ["평균 FPS", 3.67, "code", INK],
  ], [
    ["풀링 ✗ · 상한 ✗", "3668", "45.2"],
    ["풀링 ✓ · 상한 ✗", "2757", "13.6"],
    ["풀링 ✓ · 상한 250", "210", "442.3"],
  ], ACCENT, 0.52);

  const y2 = h3(s, M, y1 + 0.3, CW, "프레임을 살린 건 풀링이 아니라 개수 상한이었다");
  const y3 = body(s, M, y2, CW, "화면에 3000마리가 있으면 만드는 비용과 무관하게 그리고 움직이는 비용이 든다. 풀링이 준 것은 따로 있다 — 만드는 비용과 쓰레기.", 0.55);

  s.addText("\"풀링을 넣으면 빨라진다\" 는 반만 맞는 말이다. 재보고 알았다.", {
    x: M, y: y3 + 0.16, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("원래 문서는 '렉을 겪고 풀링으로 해결한다' 였다. 재보니 풀링만으로는 13.6 FPS 였고 maxAlive=250 이 442.3 을 만들었다. 강의안 101·103 과 Phase 8 문서를 그때 고쳤다. 현업에서도 프로파일러를 보기 전에 원인을 단정하지 말라는 이야기가 이것이다.");
}

// ================================================================ 8. 성능⑥ 매 프레임 문자열
{
  const s = slide();
  head(s, "성능 ⑥", "매 프레임 문자열을 만들고 있다.", "우리 HUD 코드에 이미 있다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["// HUDView.cs — Update() 안", "c"],
    ["levelLabel.text = $\"Lv.{playerLevel.Level}\";", "b"],
    ["timeLabel.text  = $\"{total/60:00}:{total%60:00}\";", "b"],
    ["killLabel.text  = $\"처치 {Kills}\";", "b"],
    "",
    ["// 값이 안 바뀌어도 매 프레임 새 문자열을 만든다", "c"],
    ["// string 은 한 번 만들면 못 바꾼다 (불변)", "c"],
  ]);

  const y2 = code(s, 7.4, 2.1, 5.1, [
    ["실측 · 20만 회", "c"],
    "",
    ["① 매 프레임 만든다", "b"],
    ["   Mono 힙 +33,168 KB", "b"],
    "   1회당 약 170 B",
    "",
    ["② 값이 바뀔 때만", "b"],
    ["   Mono 힙 0 KB", "b"],
  ]);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.28, CW, "StringBuilder 가 왜 있는지가 여기서 나온다");
  body(s, M, y3, CW, "문자열을 자주 만드는 코드는 쓰레기를 계속 만든다. 값이 바뀔 때만 만들거나 StringBuilder 를 쓴다. 자료 : Chapter3/Class5(불변) · Class6(StringBuilder)", 0.5);
  s.addNotes("60 FPS 면 170 B x 60 = 초당 약 10 KB, 10분이면 약 6 MB 다(계산값). 우리 게임 규모에서는 문제가 안 되지만 원리는 알아야 한다. 실제 상용 프로젝트에서 프레임 저하 원인 1위가 이런 매 프레임 할당이다.");
}

// ================================================================ 9. 성능⑦ 박싱
{
  const s = slide();
  head(s, "성능 ⑦", "박싱 — 조용히 힙을 쓴다.", "코드만 봐서는 안 보인다.");

  const y1 = code(s, M, 2.1, CW, [
    ["int hp = 20;              // 스택. 공짜다", "c"],
    "",
    ["object o = hp;            // 🚨 박싱 — 힙에 상자를 만든다", "b"],
    "",
    ["// 이런 데서 조용히 일어난다", "c"],
    "Debug.Log(\"체력 \" + hp);            // int → object",
    "list.Add(hp);  // ArrayList 처럼 object 를 담는 자료구조",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 4.2, "strong", INK], ["", 7.47, "", MUTED],
  ], [
    ["왜 문제인가", "매 프레임 돌면 쓰레기가 쌓인다"],
    ["어떻게 피하나", "List<int> 처럼 제네릭을 쓴다 (14장)"],
    ["자료", "Chapter5/Class13"],
  ], null, 0.5);

  s.addText("제네릭이 왜 생겼는지가 여기서 나온다 — 박싱을 안 하려고.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("박싱은 노베이스에게 어려운 개념이라 101회차 이후에 다룬다. 요점은 '값 타입을 object 로 취급하면 힙을 쓴다' 하나다. 왜 List<int> 가 ArrayList 보다 나은지의 답이기도 하다.");
}

// ================================================================ 10. 구조① Property
{
  const s = slide();
  head(s, "구조 ①", "Property — 아무나 못 바꾸게 한다.", "필드를 열어두면 체력이 -999가 된다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 🚨 열어두면", "c"],
    "public int current;              // 어디서든 hp.current = -999;",
    "",
    ["// ✅ 읽기만 열고, 바꾸는 건 메서드로", "c"],
    ["public int Current { get; private set; }", "b"],
    "public void TakeDamage(int amount) { ... }   // 여기서만 바뀐다",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["회차", 1.8, "code", MUTED], ["어디에", 4.2, "strong", INK], ["무엇을 지키나", 5.67, "", MUTED],
  ], [
    ["024", "처음 배운다", "은닉성 바로 다음"],
    ["070·081", "PlayerHealth · PlayerLevel", "체력·경험치를 한 곳에서만 바꾼다"],
    ["121", "CameraFollow.Span", "카메라가 계산한 값을 밖에서 못 건드린다"],
  ], null, 0.5);

  s.addText("자료 : Chapter7/Class3 · Chapter5/Class8(은닉성)", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("버그를 찾을 때 '이 값이 어디서 바뀌었지' 를 추적하게 되는데, private set 이면 후보가 그 클래스 안으로 좁혀진다. 그게 property 의 진짜 값어치다. 현업에서 코드 리뷰 지적 1순위이기도 하다.");
}

// ================================================================ 11. 구조② Delegate · Event
{
  const s = slide();
  head(s, "구조 ②", "Delegate 와 Event — 115회차에 처음 필요해진다.", "\"바뀌면 알려줘\" 를 코드로 쓰는 법.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 지금 우리 HUD — 매 프레임 물어본다 (폴링)", "c"],
    "void Update() { healthBar.Set(playerHealth.Current, playerHealth.Max); }",
    "",
    ["// 115회차 NetworkHealthDemo.cs — 바뀔 때만 불린다", "c"],
    ["Health.OnValueChanged += OnHealthChanged;    // 구독한다", "b"],
    ["Health.OnValueChanged -= OnHealthChanged;    // 🚨 반드시 뗀다", "b"],
    "",
    "private void OnHealthChanged(int before, int after) { ... }",
  ]);

  const y2 = table(s, M, y1 + 0.28, CW, [
    ["", 3.4, "strong", INK], ["폴링 (매 프레임 물어본다)", 4.2, "", MUTED], ["이벤트 (바뀌면 알려준다)", 4.07, "", INK],
  ], [
    ["언제 도나", "60번/초", "값이 바뀔 때만"],
    ["누가 누구를 아나", "UI 가 데이터를 안다", "데이터는 UI 를 모른다"],
  ], null, 0.48);

  s.addNotes("싱글 구간에서는 폴링으로 충분해서 이벤트를 한 번도 안 쓴다. 네트워크에서는 값이 언제 올지 모르기 때문에 이벤트가 필수가 된다. 구독 해제(-=)를 빼먹으면 사라진 오브젝트를 계속 부른다 — 현업 메모리 누수 원인 1위다.");
}

// ================================================================ 12. 구조③ 람다와 클로저
{
  const s = slide();
  head(s, "구조 ③", "람다 — 그리고 반복문에서 반드시 걸리는 함정.", "085회차에 이미 만났다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 085회차 LevelUpView.cs — 이름 없는 함수를 그 자리에서 넘긴다", "c"],
    ["buttons[i].onClick.AddListener(() => Choose(data));", "b"],
    "",
    ["// 🚨 반복문 변수를 그대로 담으면", "c"],
    "for (int i = 0; i < 3; i++)",
    "    cards[i].onClick.AddListener(() => Choose(i));   // 전부 마지막 값",
    "",
    ["// ✅ 복사본을 만들어 담는다 — NetworkLevelUpView.cs 실제 코드", "c"],
    ["int index = i;", "b"],
    ["cards[i].onClick.AddListener(() => Choose(index));", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "람다가 바깥 변수를 \"들고 간다\" — 이걸 클로저라고 한다");
  body(s, M, y2, CW, "값을 복사해 가는 게 아니라 변수 자체를 붙잡는다. 그래서 반복이 끝난 뒤의 값이 보인다. 자료 : Chapter7/Class7(람다) · Chapter4/Class7(클로저)", 0.55);
  s.addNotes("이 함정은 언어를 가리지 않는다. 자바스크립트 var 문제와 같은 이야기다. 085회차 코드에 '반복문 변수를 그대로 쓰면 전부 마지막 값이 된다' 는 주석이 실제로 달려 있다.");
}

// ================================================================ 13. 구조④ 자료구조 고르기
{
  const s = slide();
  head(s, "구조 ④", "언제 무엇을 쓰나.", "이름을 아는 것보다 고르는 기준이 중요하다.");

  const y1 = table(s, M, 1.95, CW, [
    ["이럴 때", 4.0, "strong", INK], ["쓴다", 2.6, "code", MUTED], ["우리 프로젝트", 5.07, "", INK],
  ], [
    ["순서대로 여러 개", "List<T>", "카메라 목록(095) · 카드(082) · 스폰 지점(073)"],
    ["키로 바로 찾기", "Dictionary<K,V>", "풀 서랍(102) — 프리팹 → 서랍"],
    ["넣은 순서대로 꺼내기", "Queue<T>", "서랍 안에 쌓인 오브젝트(102)"],
    ["중복 없이 담기", "HashSet<T>", "안 씀 — 현업에선 \"이미 처리함\" 표시에 흔하다"],
    ["마지막 것부터 꺼내기", "Stack<T>", "안 씀 — 되돌리기 · UI 창 스택에 쓴다"],
  ], null, 0.46);

  const y2 = h3(s, M, y1 + 0.24, CW, "\"찾는 데 얼마나 걸리나\" 가 고르는 기준이다");
  body(s, M, y2, CW, "List 에서 특정 값을 찾으려면 처음부터 훑는다. Dictionary 는 키로 바로 간다. 풀 서랍이 Dictionary 인 이유가 그것이다. 자료 : Chapter6 전체", 0.5);
  s.addNotes("HashSet 과 Stack 은 우리 게임에 자리가 없을 뿐 현업에서는 자주 쓴다. 그래서 '안 배운다' 가 아니라 '언제 쓰는지만 알아두자' 로 말한다. 자료구조 이름 외우기 대신 표의 왼쪽 칸을 외우게 한다.");
}

// ================================================================ 14. 구조⑤ 제네릭
{
  const s = slide();
  head(s, "구조 ⑤", "제네릭 — 담을 것의 종류를 적는 칸.", "만들 일은 없다. 읽을 줄만 알면 된다.");

  const y1 = code(s, M, 2.1, CW, [
    ["List<int>                              // int 을 담는 목록", "c"],
    ["Dictionary<GameObject, Queue<GameObject>>   // 풀 서랍(102)", "c"],
    ["NetworkVariable<int>                   // int 을 동기화하는 상자(115)", "c"],
    "",
    ["// 제네릭이 없던 시절 — 박싱이 일어난다 (9장)", "c"],
    "ArrayList list = new ArrayList();",
    ["list.Add(20);        // int → object 로 상자에 담긴다", "b"],
    "int hp = (int)list[0];  // 꺼낼 때 캐스팅도 필요하다",
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "꺾쇠 안은 \"무엇을 담느냐\" 다");
  body(s, M, y2, CW, "타입을 미리 정해두면 컴파일러가 실수를 잡아주고, 박싱도 안 일어난다. 016회차 List<int> 에서 이미 지나간 문법이다. 자료 : Chapter7/Class1", 0.55);
  s.addNotes("꺾쇠 괄호를 처음 보면 겁을 먹는다. '담을 것의 종류를 적는 칸' 이라고만 말해주면 넘어간다. 제네릭 클래스를 직접 설계하는 건 이 과정 범위 밖이고, 현업에서도 흔한 일은 아니다.");
}

// ================================================================ 15. 안전 + 더 만날 것
{
  const s = slide();
  head(s, "안전", "내 잘못이 아닌 실패 — 그리고 앞으로 더 만날 것.", "124회차 Relay 에서 처음 필요해진다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["// RelayConnector.cs — 124회차", "c"],
    "try",
    "{",
    "    var alloc = await RelayService.Instance",
    "                  .CreateAllocationAsync(max - 1);",
    "}",
    ["catch (Exception e)", "b"],
    "{",
    ["    Debug.Log(\"방 만들기 실패 — \" + e.Message);", "b"],
    "}",
  ]);

  const y2 = table(s, 7.4, 2.05, 5.1, [
    ["현업에서 더", 2.7, "strong", INK], ["어디에", 2.4, "", MUTED],
  ], [
    ["async / await", "네트워크 · 로딩"],
    ["LINQ", "목록 걸러내기"],
    ["Reflection", "에디터 툴 · 저장"],
    ["Nullable", "\"값 없음\" 표현"],
    ["정규식", "툴 · 데이터 검증"],
  ], null, 0.44);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.24, CW, "인터넷이 끊기면 내 코드가 맞아도 실패한다");
  body(s, M, y3, CW, "그때 게임이 멈추지 않게 하는 게 try/catch 다. 오른쪽 다섯 가지는 이 과정에 자리가 없지만 취업하면 첫 달에 만난다. 자료 : Chapter7/Class8 · Class9 · Class10 · Chapter3/Class9", 0.55);
  s.addNotes("124회차에서 우리도 'Play 모드가 아니면 초기화 실패' 를 겪었다. async/await 는 이미 RelayConnector 에서 쓰고 있지만 문법을 따로 가르치지는 않는다 — 읽을 수 있으면 된다고 말해준다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "언제 배우나 — 전부 자리가 정해져 있다.", "예습할 필요 없다. 그 회차에 그 자리에서 한다.");

  const y1 = table(s, M, 1.9, CW, [
    ["회차", 1.6, "code", MUTED], ["무엇", 4.4, "strong", INK], ["자료", 5.67, "code", MUTED],
  ], [
    ["024·070·081", "Property", "Ch7/Class3 · Ch5/Class8"],
    ["085", "람다 · 클로저", "Ch7/Class7 · Ch4/Class7"],
    ["101–103", "힙 · GC · 풀링 · 박싱 ⭐", "Ch5/Class4 · Class13 · Ch6/Class4 · Class6"],
    ["115", "Delegate · Event · 제네릭", "Ch7/Class4 · Class6 · Class1"],
    ["124", "Exception", "Ch7/Class8"],
  ], null, 0.44);

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("절반이 성능 이야기인 이유", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("한 프레임에 16 ms 뿐이다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("자료", { x: 9.9, y: 5.98, w: 2.7, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("CSharpStudyProject\n7개 챕터 · 78개 파일", { x: 9.9, y: 6.34, w: 2.7, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.bodySm, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("101–103 이 이 덱의 중심이다. 별표를 붙인 이유가 그것이다. 풀링은 현업 기본기이고 우리 커리큘럼에서도 실제로 만든다. 나머지는 그 주변 지식이다.");
}

const out = path.join(__dirname, "부록A-CSharp-더-알아야-하는-것.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
