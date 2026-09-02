// 18주차 코드를 안 고친다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 6 마무리. 이 덱의 주장: SO 는 불편을 겪은 뒤에 꺼내야 몸에 남는다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 5장의 "순서를 절대 바꾸지 않는다"

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
pres.title = "18주차 · 코드를 안 고친다";

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
  s.addText("18주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("코드를 안 고친다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true });
  s.addText("15분 고생시킨 뒤에 ScriptableObject 를 연다. 순서를 바꾸면 안 된다.", {
    x: M, y: 3.9, w: 9.5, h: 0.45, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  soft(s, 7.35, 1.85, 5.2, 3.4);
  s.addImage({ path: img("090_Bosses"), x: 7.57, y: 2.07, w: 4.76, h: 2.68 });

  rule(s, M, 5.6, 3.4, HAIRLINE);
  s.addText("086 – 090회차", { x: M, y: 5.78, w: 4, h: 0.3,
    fontFace: F_MED, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true });
  s.addText("Phase 6 · 데이터 분리와 보스", { x: M, y: 6.12, w: 6, h: 0.3,
    fontFace: F_REG, fontSize: T.bodySm, color: FAINT, margin: 0, isTextBox: true });
  s.addNotes("이번 주가 끝나면 Phase 6 이 끝난다. Phase 5 는 '잡는 게임', Phase 6 은 '강해지고 이길 수 있는 게임' 이다.");
}

// ================================================================ 2. 흐름
{
  const s = slide();
  head(s, null, "이번 주 흐름.", "087의 앞 15분이 이번 주 전체를 결정한다.");
  rule(s, M, 2.2, CW, HAIRLINE);
  const items = [
    ["086", "업그레이드 8종", "수치를 코드에 박아둔다 — 087의 재료다"],
    ["087", "ScriptableObject 도입", "먼저 15분 고생시킨다"],
    ["088", "EnemyData · WeaponData", "무엇을 빼고 무엇을 남길지"],
    ["089", "UpgradeData + 밸런싱", "후반 40분은 코드 금지"],
    ["090", "보스와 클리어", "새 코드 30줄. 나머지는 조합"],
  ];
  let y = 2.42;
  items.forEach((it) => {
    s.addText(it[0], { x: M, y, w: 0.9, h: 0.44, fontFace: F_REG, fontSize: T.bodySm, color: FAINT, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: M + 0.95, y, w: 5.0, h: 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: M + 6.1, y, w: CW - 6.1, h: 0.44, fontFace: F_REG, fontSize: T.body, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
    rule(s, M, y + 0.64, CW);
    y += 0.86;
  });

  h3(s, M, 6.85, CW, "새 문법은 [CreateAssetMenu] 하나뿐이다.");
  s.addNotes("086은 일부러 수치를 코드에 박는다. 087에서 그걸로 고생시켜야 SO 의 이유가 몸에 남는다.");
}

// ================================================================ 3. 086 8종
{
  const s = slide();
  head(s, "086", "새 기능은 하나도 없다.", "이미 만들어둔 시스템의 숫자만 골랐다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["업그레이드", 3.0, "strong", INK], ["건드리는 것", 2.4, "code", INK], ["만든 회차", 2.0, "", MUTED],
  ], [
    ["칼 +1 · 회전 + · 피해 +", "MeleeRing", "076 · 077"],
    ["연사 + · 총알 피해 + · 관통 +", "AutoGun", "078 · 079"],
    ["이동 +", "PlayerController", "067"],
    ["최대 체력 +", "PlayerHealth", "080"],
  ], null, 0.62);

  const c1 = code(s, M, e1 + 0.4, 7.4, [
    ["전: 칼=3 회전=180 칼피해=3 총간격=0.50 총피해=3 관통=2 체력=20/20", "c"],
    ["후: 칼=4 회전=225 칼피해=4 총간격=0.44 총피해=4 관통=3 체력=25/25", "c"],
  ], true);
  s.addText("실측 — 8종을 한 번씩 적용한 전후", {
    x: M, y: c1 + 0.12, w: 7.4, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "3종일 땐 매번\n같은 카드였다.");
  s.addText("종류가 3개인데 3장을 뽑으니 항상 전부 나온다. 8종이 되어야 처음으로 \"뭘 고를까\" 가 생긴다.", {
    x: rx, y: 3.3, w: rw, h: 1.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("최대 체력은 올린 만큼 회복도 시킨다. 안 그러면 체감이 없다.", {
    x: rx, y: 5.1, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("숫자가 아니라 느낌을 만드는 게 게임 디자인이다. 최대 체력 회복이 그 예다.");
}

// ================================================================ 4. 086 함정
{
  const s = slide();
  head(s, "086", "이미 달린 칼은 옛 값을 갖고 있다.", "값만 바꾸면 새로 만드는 것부터 적용된다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "public void AddBladeDamage(int step)",
    "{",
    "    bladeDamage += step;",
    ["    Build();   // 이미 달린 칼에도 적용되게 다시 만든다", "b"],
    "}",
  ]);

  const c2 = code(s, M, c1 + 0.4, 7.4, [
    ["// MeleeRing.Build() 안, 칼을 만든 직후", "c"],
    "if (blade.TryGetComponent(out Blade b))",
    "{",
    ["    b.Setup(bladeDamage, hitInterval);", "b"],
    "}",
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "총알은 반대다.");
  s.addText("총알은 만들어질 때마다 새 값을 받는다. 079에서 배운 그대로 — 복사본의 값이 바뀌는 것이지 프리팹 원본이 바뀌는 게 아니다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.8, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  inverse(s, rx, 4.7, rw, 1.6);
  s.addText("077의 Build() 가\n여기서 또 값을 한다.", {
    x: rx + 0.35, y: 5.05, w: rw - 0.7, h: 0.9, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addNotes("칼 피해를 올렸는데 안 세진다는 질문이 반드시 나온다. Build() 를 빼고 한 번 실행해 보여준다.");
}

// ================================================================ 5. 087 밸런싱 지옥
{
  const s = slide();
  head(s, "087", "먼저 15분 고생시킨다.", "SO 를 먼저 설명하면 학생은 코드만 베낀다.");

  const c1 = code(s, M, 2.15, 6.4, [
    ["칼 회전 +        45  →  60", "c"],
    ["이동 +          0.6 →  0.4", "c"],
    ["최대 체력 +       5  →  8", "c"],
    ["연사 하한       0.12 → 0.15", "c"],
    ["돌진형 체력      10  →  12", "c"],
    ["러너 속도       5.5  →  6.5", "c"],
    ["탱커 피해 감소   50% →  40%", "c"],
  ]);

  let y = h3(s, M, c1 + 0.4, 6.4, "강사는 도와주지 않는다.");
  body(s, M, y, 6.4,
    "순회만 하고 15분을 꽉 채운다. 중간에 \"몇 개 파일 열었어요?\" 를 한 번 묻는다. 보통 스크립트 4~5개 + 프리팹 2~3개다.", 1.0);

  const rx = 7.8, rw = W - M - 7.8;
  s.addShape(pres.ShapeType.roundRect, { x: rx, y: 2.15, w: rw, h: 2.2, rectRadius: R_MD,
    fill: { color: ACCENT }, line: { width: 0 } });
  s.addText("순서를 절대\n바꾸지 않는다.", {
    x: rx + 0.4, y: 2.45, w: rw - 0.8, h: 0.95, fontFace: F_SEMI, fontSize: T.h3, color: CANVAS,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true });
  s.addText("이 15분이 이 회차의 절반이다. 아깝게 느껴져도 줄이지 않는다.", {
    x: rx + 0.4, y: 3.45, w: rw - 0.8, h: 0.7, fontFace: F_LIGHT, fontSize: T.body, color: "DCE8FF",
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  const e1 = table(s, rx, 4.7, rw, [["아픈 곳", 2.4, "strong", INK], ["왜", 2.35, "", MUTED]], [
    ["파일이 여러 개", "어디에 뭐가 있는지"],
    ["매번 컴파일", "숫자 하나에 몇 초"],
    ["기획자가 못 한다", "코드를 열어야 하니"],
  ], null, 0.58);

  s.addNotes("게임 회사에서 밸런싱은 기획자가 한다. 그 사람들이 코드를 열어야 하냐고 물으면 학생이 스스로 답한다.");
}

// ================================================================ 6. 087 SerializeField vs SO
{
  const s = slide();
  head(s, "087", "\"[SerializeField] 로도 되잖아요?\"", "반드시 나오는 질문이다. 표로 답한다.");

  const e1 = table(s, M, 2.15, CW, [
    ["", 3.0, "strong", INK], ["[SerializeField]", 4.3, "", MUTED], ["ScriptableObject", 4.37, "", INK],
  ], [
    ["어디에 저장되나", "그 오브젝트 하나에", "에셋 파일 하나에"],
    ["프리팹 3종의 값", "프리팹 3개를 각각", "에셋 3개, 관리가 같다"],
    ["같은 값을 여럿이 공유", "못 한다", "한 파일을 여럿이 본다"],
    ["씬 없이 열어보기", "프리팹을 열어야", "Project 창에서 바로"],
  ], null, 0.62);

  const c1 = code(s, M, e1 + 0.4, CW, [
    ["[CreateAssetMenu(fileName = \"Enemy_\", menuName = \"WaveBreaker/Enemy Data\")]", "b"],
    "public class EnemyData : ScriptableObject",
    "{",
    "    public int maxHealth = 10;   public Color color = Color.white;",
    "}",
  ]);

  s.addNotes("[CreateAssetMenu] 를 빼면 에셋을 만들 방법이 아예 없다. 일부러 빼고 Create 메뉴를 열어 보여준다. 결정적인 차이는 표의 마지막 줄이다. 에셋 파일 하나만 클릭하면 수치가 보인다. 그 파일을 기획자에게 줄 수 있다.");
}

// ================================================================ 7. 087 SO 의 함정
{
  const s = slide();
  head(s, "087", "SO 는 Play 중 바꾼 값이 저장된다.", "일반 컴포넌트와 정반대다. 장점이자 함정이다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["", 3.4, "strong", INK], ["Play 중 값을 바꾸면", 4.0, "", MUTED],
  ], [
    ["일반 컴포넌트", "Stop 하면 되돌아간다 (037)"],
    ["ScriptableObject", "그대로 남는다 — 파일이니까"],
  ], null, 0.6);

  const c1 = code(s, M, e1 + 0.4, 7.4, [
    ["SO  →  (Awake 에서 한 번 복사)  →  런타임 필드", "b"],
    ["게임 중 업그레이드는 런타임 필드만 올린다. SO 파일은 그대로다.", "c"],
  ]);

  let y = h3(s, M, c1 + 0.4, 7.4, "만약 SO 를 직접 올렸다면?");
  body(s, M, y, 7.4,
    "한 판 할 때마다 영구히 세지는 게임이 된다. 다음 판을 원래 수치로 시작하려면 반드시 복사해서 써야 한다.", 0.9);

  const rx = 8.6, rw = W - M - 8.6;
  inverse(s, rx, 2.15, rw, 2.1);
  s.addText("밸런싱할 땐 편하고,\n실수로 바꾸면\n그대로 남는다.", {
    x: rx + 0.35, y: 2.5, w: rw - 0.7, h: 1.3, fontFace: F_SEMI, fontSize: T.h4, color: CANVAS,
    lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  s.addText("Play 중 체력을 100 으로 바꾸고 Stop 한 뒤 다시 보게 한다. 100 이 남아 있다.", {
    x: rx, y: 4.6, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("이 함정을 안 짚으면 088에서 '다음 판에도 칼이 8개' 라는 사고가 난다. 반드시 실연한다.");
}

// ================================================================ 8. 088 무엇을 남기나
{
  const s = slide();
  head(s, "088", "전부 빼는 게 정답이 아니다.", "빼면 좋은 것만 뺀다.");

  const c1 = code(s, M, 2.15, 6.6, [
    ["EnemyData 에 전부 넣으면", "c"],
    "┌──────────────────────────┐",
    ["│ 체력 · 피해 · 속도 · 색 · 크기 │  셋 다 쓴다", "b"],
    "│ 피해 감소      (탱커만)     │  둘은 안 쓴다",
    "│ 돌진 피해      (돌진형만)   │  둘은 안 쓴다",
    "│ 최종 보스인가   (보스만)    │  셋 다 안 쓴다",
    "└──────────────────────────┘",
    ["      빈 칸투성이 에셋", "c"],
  ]);

  let y = h3(s, M, c1 + 0.4, 6.6, "\"빼는 게 좋은가\" 가 아니다.");
  body(s, M, y, 6.6,
    "\"여럿이 공유하는가\" 를 묻는다. 이 판단이 실무의 대부분이다.", 0.6);

  const rx = 7.9, rw = W - M - 7.9;
  const e1 = table(s, rx, 2.15, rw, [
    ["어떤 값인가", 2.5, "strong", INK], ["어디에 두나", 2.1, "", MUTED],
  ], [
    ["모든 종류가 쓴다", "EnemyData (SO)"],
    ["그 종류만 쓴다", "그 컴포넌트에"],
  ], null, 0.66);

  let y2 = h3(s, rx, e1 + 0.4, rw, "종류가 하나면\n찾아갈 곳이 명확하다.");
  s.addText("탱커의 damageReduction 은 TankEnemy.cs 에 남긴다. 탱커 프리팹에서 고치면 된다.", {
    x: rx, y: y2 + 0.55, w: rw, h: 1.4, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("학생은 보통 '전부 넣어야죠' 라고 답한다. 빈 칸투성이 에셋 그림을 보여주면 스스로 생각을 바꾼다.");
}

// ================================================================ 9. 088 몬스터 vs 무기
{
  const s = slide();
  head(s, "088", "몬스터는 종류마다, 무기는 하나에.", "지금 두 개뿐이고 둘 다 플레이어 것이다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["", 2.6, "strong", INK], ["에셋 나누기", 2.4, "", MUTED], ["왜", 2.4, "", INK],
  ], [
    ["몬스터", "종류마다 하나", "종류가 계속 는다"],
    ["무기", "전부 한 파일", "지금 두 개뿐"],
  ], null, 0.66);

  const c1 = code(s, M, e1 + 0.4, 7.4, [
    "[Header(\"회전 칼\")]",
    "public int bladeCount = 3;",
    "public float bladeRotateSpeed = 180f;",
    "",
    "[Header(\"자동 총\")]",
    "public float gunFireInterval = 0.5f;",
    "public int gunPierce = 2;",
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  let y = h3(s, rx, 2.15, rw, "Data 폴더를 연다.");
  const c2 = code(s, rx, y + 0.1, rw, [
    ["Enemy_Charger", "b"],
    ["Enemy_Runner", "b"],
    ["Enemy_Tank", "b"],
    ["WeaponData", "b"],
  ]);

  s.addText("이 게임의 수치가 전부 여기 있다. 파일 네 개다. 코드를 한 줄도 안 열고 밸런싱할 수 있다.", {
    x: rx, y: c2 + 0.3, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("나중에 무기가 다섯 개가 되면 그때 나눈다. 지금 나누면 파일만 늘어난다.", {
    x: M, y: c1 + 0.3, w: 7.4, h: 0.5, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    margin: 0, isTextBox: true });

  s.addNotes("087에서 15분 걸린 밸런싱을 여기서 30초에 해 보인다. 러너 속도를 8로 올렸다가 6.5로 되돌리는 식이다.");
}

// ================================================================ 10. 089 코드와 데이터
{
  const s = slide();
  head(s, "089", "무엇이 코드고 무엇이 데이터인가.", "switch 는 남는다. 남아야 맞다.");

  const e1 = table(s, M, 2.15, 7.4, [
    ["", 3.4, "strong", INK], ["어디에", 4.0, "", MUTED],
  ], [
    ["어떻게 동작하나 (로직)", "코드"],
    ["얼마나 · 뭐라고 (수치 · 글자)", "데이터"],
  ], null, 0.66);

  const c1 = code(s, M, e1 + 0.4, 7.4, [
    ["// 어떻게 — 코드에 남는다", "c"],
    "case UpgradeType.BladeSpeed:",
    ["    meleeRing.AddRotateSpeed(data.value);   // 얼마나 — 데이터", "b"],
    "    break;",
    "",
    ["labels[i].text = $\"{data.title}\\n<size=60%>{data.description}\";", "b"],
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  const c2 = code(s, rx, 2.15, rw, [
    ["public UpgradeType type;", "b"],
    "public string title;",
    "public string description;",
    ["public float value;", "b"],
    "public float minLimit;",
  ]);

  let y = h3(s, rx, c2 + 0.35, rw, "value 하나가\n종류마다 다른 뜻.");
  s.addText("칼이면 개수, 회전이면 각도, 체력이면 회복량. 종류마다 클래스를 나누면 파일이 8개가 된다.", {
    x: rx, y: y + 0.55, w: rw, h: 1.5, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("minLimit 은 연사만 쓴다. 작을수록 좋은 값이라 하한이 필요하다. 다른 종류는 0 으로 두고 안 쓴다.");
}

// ================================================================ 11. 089 9번째 카드
{
  const s = slide();
  head(s, "089", "9번째 카드를 코드 없이 만든다.", "이게 SO 를 쓰는 이유다.");

  const e1 = table(s, M, 2.15, 7.6, [
    ["단계", 1.4, "code", MUTED], ["하는 일", 6.2, "strong", INK],
  ], [
    ["1", "Upgrade_BladeDamage 를 Ctrl+D 로 복사"],
    ["2", "title = 칼 피해 +3, value = 3"],
    ["3", "LevelUpView 의 Upgrades 배열에 넣는다"],
    ["4", "Play — 새 카드가 나온다"],
  ], null, 0.62);

  let y = h3(s, M, e1 + 0.4, 7.6, "코드를 한 줄도 안 고쳤다.");
  body(s, M, y, 7.6,
    "콘텐츠가 늘어도 코드는 그대로다. 087에서 15분 고생한 게 여기서 값을 한다.", 0.9);

  const rx = 8.8, rw = W - M - 8.8;
  const c1 = code(s, rx, 2.15, rw, [
    ["Upgrade_BladeCount", "c"],
    ["Upgrade_BladeSpeed", "c"],
    ["Upgrade_BladeDamage", "c"],
    ["Upgrade_FireRate", "c"],
    ["Upgrade_GunDamage", "c"],
    ["Upgrade_Pierce", "c"],
    ["Upgrade_MoveSpeed", "c"],
    ["Upgrade_MaxHealth", "c"],
    ["Upgrade_BladeDamageBig", "b"],
  ]);
  s.addText("9번째만 굵게. 코드가 아니라 파일이 늘었다.", {
    x: rx, y: c1 + 0.3, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("이 시연은 30초면 끝난다. 그런데 학생이 SO 를 이해했는지 여부가 여기서 갈린다.");
}

// ================================================================ 12. 089 밸런싱 실습
{
  const s = slide();
  head(s, "089", "후반 40분은 코드를 열지 않는다.", "학생이 처음으로 \"기획자\" 를 해본다.");

  const c1 = code(s, M, 2.15, 6.4, [
    ["① 5분을 버틸 수 있게 만들어라", "b"],
    ["② 레벨을 10 이상 올릴 수 있게 만들어라", "b"],
    ["③ 그런데 너무 쉬우면 안 된다", "b"],
    ["   — 한 번은 죽을 뻔해야 한다", "b"],
  ]);

  const e1 = table(s, M, c1 + 0.4, 6.4, [
    ["만질 수 있는 것", 3.0, "code", INK], ["무엇을", 3.4, "", MUTED],
  ], [
    ["Enemy_*", "체력 · 피해 · 속도 · 크기"],
    ["WeaponData", "칼 · 총 시작 수치"],
    ["Upgrade_*", "얼마나 강해지나"],
    ["Inspector", "경험치 곡선 · 웨이브"],
  ], null, 0.6);

  const rx = 7.8, rw = W - M - 7.8;
  let y = h3(s, rx, 2.15, rw, "한 번에 하나만.");
  y = body(s, rx, y, rw,
    "여러 개를 동시에 바꾸면 뭐 때문에 달라졌는지 모른다. 밸런싱의 기본 규칙이다. 반드시 못 박는다.", 1.2);

  const c2 = code(s, rx, y + 0.25, rw, [
    ["바꾼 것    전 → 후    결과", "c"],
    "───────────────────────",
    "러너 속도  5.5 → 6.5  좋다",
    "칼 개수    3 → 4      너무 쉬움",
    "baseExp    5 → 4      재밌다",
  ]);
  s.addText("기록지를 나눠준다. 강사는 \"뭘 바꿨고 그래서 어떻게 됐냐\" 만 묻는다.", {
    x: rx, y: c2 + 0.25, w: rw, h: 0.9, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("정답은 없다. 학생이 재밌다고 느낀 게 정답이다. 이 40분이 게임 회사에서 기획자가 하는 일이다.");
}

// ================================================================ 13. 090 보스는 30줄
{
  const s = slide();
  head(s, "090", "보스는 30줄이다.", "070 · 088 · 073 을 조합하면 나온다.");

  const c1 = code(s, M, 2.15, 7.4, [
    "public class BossEnemy : Enemy",
    "{",
    "    [SerializeField] private bool isFinal;",
    "",
    "    protected override void Die()",
    "    {",
    ["        base.Die();   // 처치 수 · 젬 · 제거는 부모가", "b"],
    "",
    ["        if (isFinal)", "b"],
    ["            GameManager.Instance.ChangeState(GameState.Clear);", "b"],
    "    }",
    "}",
  ]);

  const rx = 8.6, rw = W - M - 8.6;
  const e1 = table(s, rx, 2.15, rw, [
    ["조각", 1.9, "code", INK], ["어디서", 2.05, "", MUTED],
  ], [
    [": Enemy", "070 상속"],
    ["override Attack", "072"],
    ["OnCollisionStay2D", "080"],
    ["base.Die()", "072"],
    ["EnemyData", "088"],
  ], null, 0.5);

  let y = h3(s, rx, e1 + 0.35, rw, "크기도 색도\n데이터에서 온다.");
  s.addText("088에서 EnemyData 에 넣어둔 덕분이다. 안 뺐으면 프리팹 3개를 손으로 고쳐야 했다.", {
    x: rx, y: y + 0.05, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addText("nextBoss++ 를 빼면 매 프레임 보스가 쏟아진다. 일부러 빼고 보여준다.", {
    x: M, y: c1 + 0.3, w: 7.4, h: 0.5, fontFace: F_SEMI, fontSize: T.h4, color: INK,
    margin: 0, isTextBox: true });

  s.addNotes("base.Die() 누락은 072의 base.TakeDamage 와 같은 사고다. 세 번째다. 보스가 안 죽는다.");
}

// ================================================================ 14. 090 진짜 버그
{
  const s = slide();
  head(s, "090", "보스를 잡아보니 Die() 가 5번 불렸다.", "칼이 하나였을 땐 안 드러나던 버그다.");

  const c1 = code(s, M, 2.15, 7.5, [
    ["보스 처치! — 보스 III     ← 5번", "c"],
    ["게임 상태: Clear          ← 4번", "c"],
    ["kills = 5                 ← 1마리 잡았는데", "c"],
  ], true);
  s.addText("실측 — 고치기 전, 한 프레임에 여러 번 피해를 준 결과", {
    x: M, y: c1 + 0.12, w: 7.5, h: 0.32, fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });

  const c2 = code(s, M, c1 + 0.65, 7.5, [
    "public virtual void TakeDamage(int amount)",
    "{",
    ["    if (currentHealth <= 0) return;   // 이 한 줄", "b"],
    "",
    "    currentHealth -= amount;",
    "    ...",
    "}",
  ]);

  const rx = 8.7, rw = W - M - 8.7;
  let y = h3(s, rx, 2.15, rw, "왜 여러 번인가.");
  y = body(s, rx, y, rw,
    "Destroy 는 프레임 끝에 처리된다. 같은 프레임에 칼 네 자루와 총알이 맞으면 체력이 0 이하인데 Die() 가 또 불린다.", 1.5);

  y = h3(s, rx, y + 0.2, rw, "080에서 플레이어에\n넣었던 그 검사다.");
  s.addText("재측정: 처치 1번 · Clear 1번 · kills 1. 게임이 커져야 보이는 버그다.", {
    x: rx, y: y + 0.55, w: rw, h: 1.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.42, margin: 0, isTextBox: true });

  s.addNotes("이 버그는 070부터 있었지만 칼이 하나일 땐 드러나지 않았다. 자주 돌려봐야 한다는 이야기를 여기서 한다.");
}

// ================================================================ 15. 090 클리어
{
  const s = slide();
  head(s, "090", "처음으로 이길 수 있는 게임이 된다.", "066에서 만든 GameState.Clear 를 24주 만에 쓴다.");

  shot(s, "090_Clear", M, 2.15, 6.4, 3.6, "최종 보스 처치 → 클리어 · timeScale 0");

  const rx = 7.65, rw = W - M - 7.65;
  const e1 = table(s, rx, 2.15, rw, [
    ["확인한 것", 2.5, "strong", INK], ["측정값", 2.35, "code", INK],
  ], [
    ["보스 3종 스폰", "정해진 시각에 1번씩"],
    ["크기 · 색", "3.0 / 3.5 / 4.0"],
    ["체력", "150 / 350 / 700"],
    ["최종 보스 처치", "state = Clear"],
    ["클리어 직후", "timeScale = 0"],
  ], null, 0.56);

  s.addText("R 로 다시 시작하는 경로는 080과 같다. IsFinished 하나로 게임오버와 클리어를 같이 다룬다.", {
    x: rx, y: e1 + 0.25, w: rw, h: 1.0, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });

  s.addNotes("보스 시간은 테스트할 때 5/10/15 로 줄인다. 제출 전에 180/360/600 으로 되돌리는 걸 잊지 않게 한다.");
}

// ================================================================ 16. Phase 6 회고
{
  const s = slide();
  head(s, null, "Phase 6 회고 — 10회차 동안.", "새 문법은 네 개. 그런데 게임이 완전히 달라졌다.");

  const e1 = table(s, M, 1.95, CW, [
    ["", 3.0, "strong", INK], ["Phase 5 (080)", 4.3, "", MUTED], ["Phase 6 (090)", 4.37, "", INK],
  ], [
    ["10판을 하면", "10판이 똑같다", "매 판이 다르다"],
    ["강해지나", "안 강해진다", "레벨업으로 강해진다"],
    ["끝이 있나", "죽는 것뿐", "클리어가 있다"],
    ["밸런싱", "코드를 고쳐야", "파일만 고치면 된다"],
  ], null, 0.55);

  s.addText("새 문법: MoveTowards · => 프로퍼티 · Time.timeScale · [CreateAssetMenu]", {
    x: M, y: e1 + 0.2, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 Phase 7", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("재밌어졌다. 그런데 못생겼다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("091회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("HUD · 이펙트 · 사운드 · 연출.", { x: 9.6, y: 6.34, w: 3.0, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("Phase 7 은 기능이 안 늘어나는데 완전히 다른 게임처럼 보이게 만드는 구간이다. 그 예고를 명확히 해둔다.");
}

const out = path.join(__dirname, "18주차-코드를안고친다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
