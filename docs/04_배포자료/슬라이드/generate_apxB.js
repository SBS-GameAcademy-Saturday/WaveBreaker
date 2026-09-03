// 부록 B · 네트워크와 서버 이론 — Mobbin 디자인 시스템 (DESIGN.md)
// 노베이스 대상. 이 덱의 주장: 게임이 두 개라서 진짜를 하나로 정해줄 누군가가 필요하다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 5장 "진짜는 하나뿐이다"

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
pres.title = "부록 B · 네트워크와 서버 이론";

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
  s.addText("부록 B · 106–107회차 이론 보강", { x: M, y: 2.15, w: 8, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("서버가 뭐예요?", { x: M, y: 2.6, w: 11, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("코드는 한 줄도 안 칩니다. 그림만 봅니다.", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["왜 필요한가", "게임이 두 개라서"],
    ["서버-클라", "진짜가 하나뿐인 구조"],
    ["P2P", "모두가 모두에게"],
    ["우리 것", "호스트 방식"],
  ];
  let cx = M;
  const cw = CW / 4;
  items.forEach((it) => {
    s.addText(it[0], { x: cx, y: 4.85, w: cw, h: 0.3,
      fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
    s.addText(it[1], { x: cx, y: 5.18, w: cw - 0.3, h: 0.6,
      fontFace: F_MED, fontSize: T.bodySm, color: INK, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true });
    cx += cw;
  });
  s.addNotes("네트워크에서 학생이 막히는 이유는 문법이 아니라 그림이 안 그려져서다. 106회차 설계 의도가 그것이고, 이 덱은 그 회차를 통째로 뒷받침한다. 유니티를 켜지 않는다.");
}

// ================================================================ 2. 가장 큰 오해
{
  const s = slide();
  head(s, null, "가장 큰 오해부터 깬다.", "\"화면이 두 개\" 가 아니라 \"게임이 두 개\" 다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["🚨 많은 사람이 생각하는 그림", "c"],
    "",
    "        ┌──────────────┐",
    "        │   게임 하나   │",
    "        └──────┬───────┘",
    "          ┌────┴────┐",
    "      화면 A       화면 B",
    "",
    ["        틀렸다", "b"],
  ]);

  code(s, 7.4, 2.05, 5.1, [
    ["✅ 실제 그림", "c"],
    "",
    " 내 컴퓨터      친구 컴퓨터",
    "┌────────┐    ┌────────┐",
    ["│ 게임 1개│    │ 게임 1개│", "b"],
    "│ (완전한)│←→ │ (완전한)│",
    "└────────┘    └────────┘",
    "",
    ["   각자 따로 돈다", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "내 몬스터와 친구 몬스터는 다른 물건이다");
  body(s, M, y2, CW, "같은 코드로 만들어졌을 뿐, 서로 아무 상관이 없는 두 오브젝트다. 그래서 일일이 알려줘야 한다.", 0.5);
  s.addNotes("이 그림 하나가 Phase 9 전체의 토대다. 여기서 안 넘어가면 뒤에 나오는 IsOwner, NetworkVariable, Rpc 가 전부 외우기가 된다. 시간을 충분히 쓴다.");
}

// ================================================================ 3. 안 알려주면
{
  const s = slide();
  head(s, null, "안 알려주면 이렇게 된다.", "학생에게 물어가며 채운다.");

  const y1 = table(s, M, 2.15, CW, [
    ["내 게임에서 일어난 일", 5.6, "strong", INK], ["친구 화면에서는", 6.07, "", MUTED],
  ], [
    ["내가 오른쪽으로 걸었다", "내가 제자리에 서 있다"],
    ["몬스터를 잡았다", "그 몬스터가 아직 살아 있다"],
    ["젬을 먹었다", "젬이 바닥에 그대로 있다"],
    ["레벨업해서 칼이 4개가 됐다", "여전히 칼이 3개"],
    ["내가 죽었다", "내가 멀쩡하게 서 있다"],
  ], null, 0.48);

  s.addText("네트워크 코드의 정체는 이것뿐이다 — \"무엇을, 누구에게, 언제 알려줄까\"", {
    x: M, y: y1 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("학생이 직접 채우게 하는 게 중요하다. 강사가 다 말해주면 '그렇구나' 로 끝나고, 스스로 채우면 20회차 내내 이 표를 떠올린다. 106회차 제출물이 바로 이 목록이다.");
}

// ================================================================ 4. 서버가 없으면
{
  const s = slide();
  head(s, null, "그럼 각자 계산하면 되지 않나?", "안 된다. 답이 갈린다.");

  const y1 = code(s, M, 2.1, CW, [
    ["몬스터 체력이 10이다.", "c"],
    ["내가 3을 때렸고, 친구도 거의 동시에 3을 때렸다.", "c"],
    "",
    ["몬스터 체력은 얼마인가?", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["방식", 3.6, "strong", INK], ["무슨 일이 나나", 8.07, "", MUTED],
  ], [
    ["각자 계산", "내 화면 7, 친구 화면 7 — 둘 다 틀렸다"],
    ["각자 계산 (순서가 다르면)", "내 화면 4, 친구 화면 7 — 둘이 다르다"],
    ["누군가 한 명이 계산", "✅ 둘 다 4"],
  ], null, 0.52);

  s.addText("계산할 사람을 정해야 한다. 그 역할이 서버다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("이 질문을 던지고 학생이 4라고 답할 때까지 기다린다. 그 다음 '그럼 누가 그 4를 계산하죠' 를 묻는 순간 서버가 필요한 이유가 스스로 나온다. 정의를 먼저 말하지 않는다.");
}

// ================================================================ 5. 진짜는 하나뿐 (ACCENT)
{
  const s = slide();
  head(s, null, "서버 = 진짜 값을 갖고 있는 쪽.", "내 화면에 보이는 건 서버가 알려준 사본이다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["      서버 (진짜 값)", "b"],
    ["    몬스터 체력 = 4", "b"],
    "           │",
    "      ┌────┴────┐",
    "      ↓         ↓",
    "   내 화면    친구 화면",
    ["   4 (사본)   4 (사본)", "b"],
  ]);

  const y2 = table(s, 7.4, 2.05, 5.1, [
    ["구분", 2.4, "strong", INK], ["어디에 있나", 2.7, "", MUTED],
  ], [
    ["진짜", "서버에 하나"],
    ["사본", "각 화면에 하나씩"],
    ["틀릴 수 있나", "사본은 잠깐 틀린다"],
    ["곧 맞나", "맞는다. 진짜가 하나니까"],
  ], ACCENT, 0.5);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.3, CW, "이걸 권한(authority) 이라고 한다");
  body(s, M, y3, CW, "\"이 값은 누구 말이 맞는가\" 를 정해두는 것. 인터넷이 느리면 사본이 잠깐 옛날 값을 보여주지만, 진짜가 하나뿐이라 금방 맞춰진다.", 0.55);
  s.addNotes("'사본은 틀릴 수 있다' 를 반드시 말해준다. 113회차에서 캐릭터가 순간이동하는 걸 볼 때 이 문장이 회수된다. 네트워크 게임에서 화면이 잠깐 어긋나는 건 버그가 아니라 구조다.");
}

// ================================================================ 6. 서버가 있으면 좋은 점
{
  const s = slide();
  head(s, null, "서버가 있어서 좋은 점 네 가지.", "\"그냥 서로 알려주면 안 되나\" 에 대한 답이다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 3.4, "strong", INK], ["없으면", 4.0, "", MUTED], ["있으면", 4.27, "", INK],
  ], [
    ["① 값이 일치한다", "화면마다 체력이 다르다", "모두 같은 값을 본다"],
    ["② 부정을 막는다", "\"내 체력 999\" 를 우겨도 통한다", "서버가 안 받아준다"],
    ["③ 다툼을 정리한다", "젬 하나를 둘이 먹는다", "먼저 닿은 한 명만"],
    ["④ 끊겨도 남는다", "나가면 그 사람 정보가 사라진다", "서버가 갖고 있다"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.28, CW, "③이 협동 게임에서 제일 자주 터진다");
  body(s, M, y2, CW, "젬 하나를 둘이 동시에 먹으면 경험치가 두 배로 들어간다. 우리 게임은 118회차에서 서버가 단독으로 판정하게 만들어 이걸 막는다.", 0.55);
  s.addNotes("②는 친구끼리 하는 게임에서는 덜 중요하다. 그래서 우리는 캐릭터 이동만큼은 소유자 권한으로 둔다(반응 속도 우선). 그 트레이드오프는 11장에서 다룬다.");
}

// ================================================================ 7. 서버-클라이언트 구조
{
  const s = slide();
  head(s, null, "구조 ① 서버 – 클라이언트.", "가운데 한 명이 있고, 나머지는 그 한 명하고만 이야기한다.");

  const y1 = code(s, M, 2.05, 6.3, [
    "            ┌────────┐",
    ["            │  서버   │   진짜 값", "b"],
    "            └───┬────┘",
    "      ┌─────┬───┴───┬─────┐",
    "      ↓     ↓       ↓     ↓",
    "   클라A  클라B   클라C  클라D",
    "",
    ["   클라끼리는 직접 말하지 않는다", "b"],
  ]);

  const y2 = table(s, 7.4, 2.05, 5.1, [
    ["항목", 2.4, "strong", INK], ["서버 – 클라", 2.7, "", MUTED],
  ], [
    ["연결 수", "사람 수만큼"],
    ["진짜 값", "서버에 하나"],
    ["누가 판정", "서버"],
    ["예", "롤 · 오버워치"],
  ], null, 0.5);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.3, CW, "회사가 서버 컴퓨터를 따로 둔다 — 전용 서버");
  body(s, M, y3, CW, "24시간 켜져 있고, 아무도 그 컴퓨터로 게임을 하지 않는다. 심판만 하는 사람이 따로 있는 셈이다. 대신 서버 비용이 든다.", 0.55);
  s.addNotes("'전용 서버' 라는 말을 여기서 처음 쓴다. 학생이 아는 게임 이름을 하나씩 대게 하면 이해가 빠르다. 우리가 왜 이걸 못 쓰는지는 11장에서 돈 이야기로 설명한다.");
}

// ================================================================ 8. P2P 구조
{
  const s = slide();
  head(s, null, "구조 ② P2P — 모두가 모두에게.", "Peer to Peer. 가운데가 없다.");

  const y1 = code(s, M, 2.05, 6.3, [
    "        A ──────── B",
    "        │  ╲    ╱  │",
    "        │    ╳     │",
    "        │  ╱    ╲  │",
    "        C ──────── D",
    "",
    ["  A-B   A-C   A-D", "b"],
    ["  B-C   B-D   C-D     = 6개", "b"],
  ]);

  const y2 = table(s, 7.4, 2.05, 5.1, [
    ["항목", 2.4, "strong", INK], ["P2P", 2.7, "", MUTED],
  ], [
    ["연결 수", "n(n-1)/2"],
    ["진짜 값", "정해져 있지 않다"],
    ["누가 판정", "합의하거나 각자"],
    ["서버 비용", "0원"],
  ], null, 0.5);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.3, CW, "돈이 안 든다. 대신 \"누구 말이 맞는가\" 가 없다");
  body(s, M, y3, CW, "4장의 몬스터 체력 문제가 그대로 남는다. 부정도 막기 어렵다 — 아무도 심판이 아니니까.", 0.55);
  s.addNotes("P2P 를 '옛날 방식' 으로 소개하면 안 된다. 지금도 격투게임이나 소규모 대전에서 쓴다. 장점(지연이 짧다, 비용 0)과 단점(권한 없음, 연결 폭증)을 균형 있게 말한다.");
}

// ================================================================ 9. 연결 수
{
  const s = slide();
  head(s, null, "P2P 는 사람이 늘면 연결이 폭발한다.", "n(n-1)/2 — 사람 수의 제곱에 가깝게 는다.");

  const y1 = table(s, M, 2.15, CW, [
    ["사람", 2.2, "code", MUTED], ["서버-클라", 3.0, "code", INK], ["P2P", 3.0, "code", INK], ["", 3.57, "", MUTED],
  ], [
    ["2명", "2개", "1개", "차이가 없다"],
    ["4명", "4개", "6개", "슬슬 벌어진다"],
    ["8명", "8개", "28개", "3배 넘는다"],
    ["16명", "16개", "120개", "감당이 안 된다"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.3, CW, "각 연결마다 내 정보를 따로 보내야 한다");
  const y3 = body(s, M, y2, CW, "8명이면 내가 한 번 움직일 때 7명에게 각각 보낸다. 서버-클라라면 서버 한 곳에만 보내면 된다.", 0.55);

  s.addText("우리 게임은 2인 협동이다 — 그래서 이 차이가 문제가 되지 않는다.", {
    x: M, y: y3 + 0.16, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("숫자를 직접 계산시켜 보면 좋다. 2명일 때 차이가 없다는 점이 중요하다 — 우리 게임 규모에서는 구조 선택이 성능 문제가 아니라 권한 문제라는 뜻이다.");
}

// ================================================================ 10. 둘을 비교
{
  const s = slide();
  head(s, null, "두 구조를 나란히 놓는다.", "어느 쪽이 좋다가 아니라, 무엇을 포기하느냐의 문제다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 3.2, "strong", INK], ["서버 – 클라이언트", 4.2, "", MUTED], ["P2P", 4.27, "", INK],
  ], [
    ["진짜 값", "서버에 하나", "없다"],
    ["부정 막기", "쉽다", "어렵다"],
    ["연결 수", "사람 수만큼", "n(n-1)/2"],
    ["비용", "서버 임대료가 든다", "0원"],
    ["지연", "서버를 거친다", "직접 가서 짧다"],
    ["한 명이 나가면", "나머지는 계속한다", "구조가 흔들린다"],
  ], null, 0.46);

  s.addText("우리는 둘을 섞는다. 그게 다음 장의 호스트 방식이다.", {
    x: M, y: y1 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("표를 다 채운 뒤 '그럼 우리는 뭘 쓸까요' 를 묻는다. 학생이 '서버가 좋은데 돈이 없다' 는 결론에 스스로 도달하면 호스트 방식이 자연스럽게 나온다.");
}

// ================================================================ 11. 호스트 방식
{
  const s = slide();
  head(s, null, "구조 ③ 호스트 — 심판 겸 선수.", "우리가 쓸 방식이다.");

  const y1 = code(s, M, 2.05, CW, [
    ["[전용 서버 방식]                        [호스트 방식]  ← 우리 것", "c"],
    "",
    "      서버 (아무도 안 함)                 호스트 = A (심판 겸 선수)",
    "       ↙        ↘                                ↕",
    "   클라A       클라B                          클라B",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["단어", 2.6, "strong", INK], ["하는 일", 5.4, "", MUTED], ["비유", 3.67, "", INK],
  ], [
    ["서버", "판정한다 · 몬스터를 만든다 · 진짜를 갖고 있다", "심판"],
    ["클라이언트", "입력을 보내고, 받은 걸 보여준다", "선수"],
    ["호스트", "서버 + 클라이언트를 겸한다", "심판 겸 선수"],
  ], null, 0.5);

  s.addText("서버 컴퓨터를 빌릴 돈이 없다. 그래서 둘 중 한 명이 심판을 겸한다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("세 단어를 여기서 한 번에 정리한다. 107회차 복습 퀴즈가 이 표에서 나온다. 호스트는 새로운 개념이 아니라 두 역할을 한 컴퓨터가 겸하는 것뿐이라는 점을 강조한다.");
}

// ================================================================ 12. 호스트의 대가
{
  const s = slide();
  head(s, null, "공짜는 아니다 — 호스트의 대가.", "\"방장이 나가서 게임이 터졌다\" 가 이것이다.");

  const y1 = table(s, M, 2.15, CW, [
    ["대가", 3.6, "strong", INK], ["무슨 일이 나나", 8.07, "", MUTED],
  ], [
    ["호스트가 끄면 끝난다", "심판이 사라진다. 남은 사람도 게임이 종료된다"],
    ["호스트가 조금 유리하다", "자기 컴퓨터가 서버라 지연이 0이다"],
    ["호스트 컴퓨터가 더 힘들다", "판정과 게임을 동시에 한다"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "그래도 우리에겐 이게 맞다");
  body(s, M, y2, CW, "2인 협동이고, 친구끼리 하고, 서버 비용이 0원이어야 한다. 상용 게임이라면 전용 서버로 갔을 것이다 — 조건이 다르면 답도 다르다.", 0.6);
  s.addNotes("이 슬라이드가 '기술 선택에는 조건이 따라온다' 를 처음 가르치는 자리다. 123회차의 '틀린 답이 아니라 그 상황에서 맞는 답이었다' 와 같은 태도다.");
}

// ================================================================ 13. Relay
{
  const s = slide();
  head(s, null, "그런데 애초에 연결이 안 된다.", "공유기가 밖에서 들어오는 연결을 막는다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[직접 연결]  내 컴퓨터 ──?── 공유기 ──?── 공유기 ──?── 친구 컴퓨터", "c"],
    ["                              막혀 있다", "c"],
    "",
    ["[Relay]      내 컴퓨터 ────▶ 유니티 서버 ◀──── 친구 컴퓨터", "b"],
    ["                             둘 다 \"나가는\" 연결이라 막히지 않는다", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 3.6, "strong", INK], ["Relay 가 하는 일", 8.07, "", MUTED],
  ], [
    ["판정한다?", "❌ 아니다. 판정은 여전히 호스트가 한다"],
    ["짐만 옮긴다", "✅ 우체국이다. 내용은 안 본다"],
    ["그래서 필요한 것", "6자리 접속 코드 하나 (124회차)"],
  ], null, 0.5);

  s.addText("전용 서버가 아니라 중계 서버다. 이 둘을 헷갈리면 안 된다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Relay 를 '서버' 라고만 부르면 학생이 판정까지 한다고 오해한다. 우체국 비유를 쓴다. 124회차 실측에서 접속 코드 RMKDHN, Relay 서버 34.180.64.245:37000 이 나왔다.");
}

// ================================================================ 14. 우리 게임을 나눈다
{
  const s = slide();
  head(s, null, "우리 게임을 나눠본다.", "기본은 서버, 예외가 각자.");

  const y1 = table(s, M, 1.95, 6.3, [
    ["항목", 3.4, "strong", INK], ["누구 것", 2.9, "", MUTED],
  ], [
    ["몬스터 생성", "서버"],
    ["몬스터 위치 · 체력", "서버"],
    ["젬 생성 · 획득 판정", "서버"],
    ["플레이어 체력", "서버"],
    ["경험치 · 레벨", "서버"],
  ], null, 0.44);

  const y2 = table(s, 7.4, 1.95, 5.1, [
    ["항목", 2.7, "strong", INK], ["누구 것", 2.4, "", MUTED],
  ], [
    ["내 캐릭터 위치", "소유자(나)"],
    ["칼 회전 각도", "각자"],
    ["화면 흔들림", "각자"],
    ["죽음 이펙트", "각자"],
    ["버튼 하이라이트", "각자"],
  ], null, 0.44);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.28, CW, "내 캐릭터만 예외인 이유");
  body(s, M, y3, CW, "입력을 서버에 보내고 답을 기다리면 조작이 느려진다. 친구끼리 하는 게임에 치트를 쓸 사람도 없으니 반응 속도를 택했다 — 114회차 IsOwner 가 그것이다.", 0.55);
  s.addNotes("칼 회전 각도가 '각자' 인 이유를 학생에게 물어보면 좋다. 양쪽이 같은 규칙으로 돌리면 알아서 같아지기 때문이다. 안 보내도 되는 것을 찾는 게 네트워크 설계의 절반이다.");
}

// ================================================================ 15. 우리 코드가 이미 준비된 이유
{
  const s = slide();
  head(s, null, "우리 코드는 이미 준비돼 있다.", "설계는 지금 편하려고가 아니라 나중에 안 무너지려고 한다.");

  const y1 = code(s, M, 2.1, CW, [
    ["067회차 · 입력 읽는 곳과 움직이는 곳을 분리했다", "c"],
    ["   → 114회차에  if (!IsOwner) return;   한 줄이면 끝난다", "b"],
    "",
    ["073회차 · 스폰은 매니저 한 곳에서만 했다", "c"],
    ["   → 117회차에  if (!IsServer) return;  두 줄이면 끝난다", "b"],
    "",
    ["095회차 · 카메라가 \"목록의 중심\" 을 따라가게 했다", "c"],
    ["   → 120회차에  여섯 줄이면 협동 카메라가 된다", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "몬스터를 여기저기서 만들었다면 절반을 뜯어고쳐야 했다");
  body(s, M, y2, CW, "네트워크가 어려운 진짜 이유는 문법이 아니라, 준비 안 된 코드를 뜯어고치는 일이 크기 때문이다.", 0.5);
  s.addNotes("이 세 가지를 '세 번의 회수' 라고 부른다. 24주차 덱의 제목이기도 하다. 106~107회차에서 미리 예고해 두면 114·117·120에서 학생이 '아, 그거' 하고 알아본다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "오늘 코드는 한 줄도 안 쳤다.", "그래도 Phase 9 의 절반은 지나간 것이다.");

  const y1 = table(s, M, 1.95, CW, [
    ["주차", 1.5, "code", MUTED], ["회차", 1.6, "code", MUTED], ["하는 것", 8.57, "strong", INK],
  ], [
    ["22", "106–110", "개념 · 설치 · 첫 접속 · 가상 플레이어"],
    ["23", "111–115", "2인 접속 · 이동 동기화 · IsOwner · NetworkVariable"],
    ["24", "116–120", "Rpc · 서버 스폰 · 젬 · 피격 · 협동 카메라"],
    ["25", "121–125", "줌 · 부활 · 시간 정지 · Relay · 모드 통합"],
  ], null, 0.5);

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("외울 것은 하나뿐", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("게임이 두 개다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("안전망", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Phase 8 완성본이\n이미 백업돼 있다.", { x: 9.6, y: 6.34, w: 3.0, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.bodySm, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("Phase 9 가 통째로 실패해도 21주차 빌드로 종강한다는 말을 반드시 한 번 더 한다. 그 안심이 있어야 학생이 어려운 걸 시도한다. 105회차 백업이 그것을 위한 것이었다.");
}

const out = path.join(__dirname, "부록B-네트워크와-서버-이론.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
