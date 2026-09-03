// 22주차 게임이 두 개다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 9 착수. 이 덱의 주장: 문법이 아니라 그림이 안 그려져서 막힌다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 4장의 "게임이 두 개다"

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
pres.title = "22주차 · 게임이 두 개다";

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
  s.addText("22주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("게임이 두 개다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("106–110 · Phase 9 착수 · 이번 주는 그림과 설치가 전부다", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["106", "왜 멀티는 어려운가"],
    ["107", "호스트 · 클라이언트"],
    ["108", "NGO 설치"],
    ["109", "첫 접속"],
    ["110", "가상 플레이어"],
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
  s.addNotes("Phase 9 는 골드메탈 강좌 범위 밖이라 참고할 강의가 없다. 그래서 개념에 두 회차(106·107)를 통째로 쓴다. 학생이 막히는 건 문법이 아니라 그림이 안 그려져서다.");
}

// ================================================================ 2. 안전망
{
  const s = slide();
  head(s, null, "먼저 말한다 — 여기부터 어렵다.", "그래서 지난주에 백업을 한 것이다.");

  const y1 = table(s, M, 2.05, CW, [
    ["", 3.0, "strong", INK], ["Phase 1–8", 4.3, "", MUTED], ["Phase 9", 4.37, "", INK],
  ], [
    ["회차", "105회", "20회"],
    ["참고 강의", "있다", "거의 없다"],
    ["안 되면", "그 회차만 밀린다", "그 다음이 다 막힌다"],
    ["안전망", "—", "Phase 8 완성본"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "이 Phase 가 통째로 실패해도 학생은 완성작을 갖고 종강한다");
  body(s, M, y2, CW, "그러니까 마음 편하게 어려운 걸 해보자 — 이 말을 106회차 첫머리에 한다. 겁먹은 상태로 20회차를 버틸 수는 없다.", 0.62);
  s.addNotes("105회차의 백업이 여기서 값을 한다. 학생에게 '실패해도 된다' 를 명시적으로 허락해주는 것이 이 구간 이탈률을 좌우한다.");
}

// ================================================================ 3. 106 오해
{
  const s = slide();
  head(s, "106", "가장 큰 오해 — 화면이 두 개가 아니다.", "칠판에 틀린 그림을 먼저 그린다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[ 틀린 그림 ]                          [ 맞는 그림 ]", "c"],
    "",
    "        게임 하나                내 컴퓨터            친구 컴퓨터",
    "           │                   ┌──────────┐        ┌──────────┐",
    "      ┌────┴────┐              │ 게임 하나 │ ←인터넷→ │ 게임 하나 │",
    "  화면 A     화면 B             └──────────┘        └──────────┘",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "게임이 두 개다. 각자 자기 컴퓨터에서 따로 돈다.");
  body(s, M, y2, CW, "내 게임의 몬스터와 친구 게임의 몬스터는 다른 물건이다. 그래서 일일이 알려줘야 한다 — 그게 앞으로 20회차 동안 할 일이다.", 0.6);
  s.addNotes("106회차는 코드를 한 줄도 안 친다. 유니티를 안 켜도 된다. 이 그림 하나가 남은 19회차의 바탕이 된다.");
}

// ================================================================ 4. 106 안 알려주면
{
  const s = slide();
  head(s, "106", "안 알려주면 어떻게 되나.", "학생에게 물어가며 표를 채운다.");

  const y1 = table(s, M, 2.1, CW, [
    ["내 게임에서 일어난 일", 5.4, "strong", INK], ["안 알려주면 친구 화면에서는", 6.27, "", MUTED],
  ], [
    ["내가 오른쪽으로 걸었다", "내가 제자리에 서 있다"],
    ["몬스터를 잡았다", "그 몬스터가 아직 살아 있다"],
    ["젬을 먹었다", "젬이 바닥에 그대로 있다"],
    ["레벨업해서 칼이 4개가 됐다", "여전히 칼이 3개"],
    ["내가 죽었다", "내가 멀쩡하게 서 있다"],
  ], ACCENT, 0.5);

  const y2 = h3(s, M, y1 + 0.26, CW, "무엇을 알려줄지 정하는 기준은 하나");
  body(s, M, y2, CW, "\"이걸 모르면 두 사람이 다른 게임을 하게 되는가?\" — 칼 회전 각도는 몰라도 된다. 양쪽이 같은 규칙으로 돌리면 알아서 같아진다.", 0.6);
  s.addNotes("전부 알려주면 느려진다. 인터넷으로 보내는 건 비싸다. 그래서 기준이 필요하다는 흐름으로 간다.");
}

// ================================================================ 5. 107 세 단어
{
  const s = slide();
  head(s, "107", "서버 · 클라이언트 · 호스트.", "우리는 호스트 방식이다 — 심판 겸 선수.");

  const y1 = table(s, M, 2.1, CW, [
    ["단어", 2.6, "strong", INK], ["하는 일", 6.0, "", MUTED], ["비유", 3.07, "", INK],
  ], [
    ["서버", "판정한다. 몬스터를 만든다. 진짜를 갖고 있다", "심판"],
    ["클라이언트", "입력을 보내고, 받은 걸 보여준다", "선수"],
    ["호스트", "서버 + 클라이언트를 겸한다", "심판 겸 선수"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.28, CW, [
    ["[ 전용 서버 ]                        [ 호스트 방식 ]  ← 우리 것", "c"],
    "",
    "   서버 (아무도 안 함)                호스트 = A (심판 겸 선수)",
    "    ↙        ↘                              ↕",
    "클라A       클라B                        클라B",
  ]);

  s.addText("그래서 호스트가 게임을 끄면 다 끝난다 — '방장이 나가서 터졌다' 가 이것이다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("큰 온라인 게임은 회사가 서버 컴퓨터를 따로 둔다. 우리는 그럴 돈이 없어서 둘 중 한 명이 심판을 겸한다.");
}

// ================================================================ 6. 107 권한
{
  const s = slide();
  head(s, "107", "진짜는 하나뿐이다.", "몬스터 체력 10, 둘이 동시에 3씩 때렸다 — 누가 계산하나?");

  const y1 = table(s, M, 2.1, CW, [
    ["방식", 4.0, "strong", INK], ["무슨 일이 나나", 7.67, "", MUTED],
  ], [
    ["각자 계산", "내 화면 7, 친구 화면 7 — 둘 다 틀렸다"],
    ["각자 계산 (순서가 다르면)", "내 화면 4, 친구 화면 7 — 둘이 다르다"],
    ["서버가 계산하고 알려준다", "둘 다 4"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.28, CW, [
    ["      서버 (진짜 값)          진짜 값은 서버에만 있다.", "b"],
    "   몬스터 체력 = 4            내 화면에 보이는 건 사본이다.",
    "        │",
    "   ┌────┴────┐               사본은 잠깐 틀릴 수 있다.",
    "   ↓         ↓                그래도 금방 맞춰진다 —",
    " 내 화면    친구 화면           진짜가 하나뿐이니까.",
  ]);

  s.addText("권한(authority) = \"이 값은 누구 말이 맞는가\"", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("네트워크 버그의 대부분은 '누구 말이 맞는가' 를 안 정해서 생긴다. 문법보다 이 원칙을 먼저 세워야 116~119회차에서 안 헤맨다.");
}

// ================================================================ 7. 107 나누기
{
  const s = slide();
  head(s, "107", "기본은 서버. 예외가 각자.", "우리 게임을 나눠본다.");

  const y1 = table(s, M, 2.05, 6.3, [
    ["서버 것", 3.0, "strong", INK], ["왜", 3.3, "", MUTED],
  ], [
    ["몬스터 생성", "안 그러면 두 배로 나온다"],
    ["몬스터 체력", "동시에 때리면 꼬인다"],
    ["젬 획득 판정", "둘이 동시에 먹으면 안 된다"],
    ["플레이어 체력", "죽었는지를 둘 다 알아야"],
    ["경험치 · 레벨", "협동은 경험치를 공유한다"],
  ], null, 0.48);

  table(s, 7.4, 2.05, 5.1, [
    ["각자 것", 2.5, "strong", INK], ["왜", 2.6, "", MUTED],
  ], [
    ["칼 회전 각도", "같은 규칙이면 같아진다"],
    ["화면 흔들림", "내 화면 연출이다"],
    ["죽음 이펙트", "위치만 맞으면 된다"],
    ["버튼 하이라이트", "완전히 내 화면 일"],
  ], null, 0.48);

  const y3 = h3(s, M, y1 + 0.3, CW, "내 캐릭터 위치만 예외 — 소유자 권한을 쓴다");
  body(s, M, y3, CW, "서버가 움직여주면 안전하지만 반응이 느리다. 친구랑 하는 게임에 치트를 쓸 사람도 없고, 반응이 느리면 재미가 없다.", 0.5);
  s.addNotes("소유자 권한이라는 개념이 114회차 IsOwner 로 이어진다. 오늘은 이름만 알아둔다.");
}

// ================================================================ 8. 이미 준비된 것
{
  const s = slide();
  head(s, null, "우리 코드는 이미 준비돼 있다.", "14주차에 '왜 이렇게 나눠요?' 하던 것의 답.");

  const y1 = table(s, M, 2.1, CW, [
    ["언제", 1.6, "code", MUTED], ["무엇을 해뒀나", 5.4, "strong", INK], ["그래서 지금", 4.67, "", INK],
  ], [
    ["067", "입력 읽는 곳과 움직이는 곳을 분리", "114회차에 한 줄이면 끝난다"],
    ["073", "스폰은 매니저 한 곳에서만", "117회차에 한 줄이면 끝난다"],
    ["095", "카메라가 목록의 중심을 본다", "120회차에 고칠 게 없다"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["if (!IsOwner) return;    // 114회차 — 내 캐릭터만 내가 조종", "b"],
    ["if (!IsServer) return;   // 117회차 — 몬스터는 호스트만 만든다", "b"],
    "",
    ["몬스터를 여기저기서 만들었다면 오늘 표의 절반을 다 뜯어고쳐야 했다.", "c"],
  ]);

  s.addNotes("Phase 5 의 규칙 ①②가 여기서 회수된다. 학생이 그때 이유를 못 받아들였더라도 지금 이해하면 된다 — 이 슬라이드가 그 자리다.");
}

// ================================================================ 9. 108 설치
{
  const s = slide();
  head(s, "108", "패키지 6개를 한 번에 깐다.", "나중에 또 깔면 또 재시작해야 한다.");

  const y1 = table(s, M, 2.1, CW, [
    ["패키지", 5.0, "strong", INK], ["버전", 1.8, "code", MUTED], ["왜", 4.87, "", MUTED],
  ], [
    ["Netcode for GameObjects", "2.13.2", "본체. 동기화를 해준다"],
    ["Multiplayer Play Mode", "2.0.2", "에디터 하나로 2인 테스트"],
    ["Multiplayer Tools", "2.2.11", "네트워크 프로파일러"],
    ["Services Core", "1.18.0", "아래 둘의 바탕"],
    ["Authentication", "3.7.4", "Relay 를 쓰려면 필요"],
    ["Relay", "1.2.0", "인터넷 접속 (124회차)"],
  ], null, 0.46);

  const y2 = h3(s, M, y1 + 0.24, CW, "뒤의 셋은 25주차에 쓴다. 그래도 지금 같이 깐다.");
  body(s, M, y2, CW, "Unity 6.5(6000.5.4f1) 기준 버전이다. 설치는 하나씩 끝나고 다음 걸 한다. 인터넷이 느리면 5분 이상 걸린다 — 중간에 유니티를 끄지 않는다.", 0.5);
  s.addNotes("설치에서 막히면 그 주가 통째로 날아간다. 그래서 한 회차를 설치와 설정에만 쓴다.");
}

// ================================================================ 10. 108 재시작
{
  const s = slide();
  head(s, "108", "설치 후 유니티를 껐다 켠다.", "안 그러면 '깔았는데 안 보이는' 상태가 된다.");

  code(s, M, 2.1, CW, [
    ["강사가 실제로 겪은 것", "c"],
    "",
    "설치 직후 :  Window → Multiplayer  메뉴가 없다",
    "             Multiplayer Play Mode 창을 열 수가 없다",
    "",
    ["재시작 후 :  메뉴가 생긴다", "b"],
  ]);

  const y2 = h3(s, M, 4.5, CW, "Multiplayer Play Mode 는 에디터가 켜질 때 등록된다");
  const y3 = body(s, M, y2, CW, "Unity 6 에서 이 패키지는 문서만 들어 있고 기능은 에디터에 내장돼 있다. 그래서 '설치했는데 패키지 폴더에 코드가 없다' 고 놀라지 않아도 된다.", 0.6);

  inverse(s, M, y3 + 0.16, CW, 0.82, R_SM);
  s.addText("Game.unity 는 22~23주차 내내 안 건드린다. 연습 씬에서만 작업한다.", {
    x: M + 0.34, y: y3 + 0.16, w: CW - 0.68, h: 0.82, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("Phase 9 최대 사고는 협동을 만들다 싱글을 깨뜨리는 것이다. 매 회차 체크리스트 마지막 줄에 'Game.unity 를 안 건드렸다' 를 넣었다.");
}

// ================================================================ 11. 109 NetworkObject
{
  const s = slide();
  head(s, "109", "NetworkObject 는 이름표다.", "\"이건 네트워크가 관리할 물건이다\" 라는 표시.");

  const y1 = table(s, M, 2.1, 6.3, [
    ["NetworkPlayer 프리팹", 3.0, "strong", INK], ["", 3.3, "code", MUTED],
  ], [
    ["Sprite Renderer", "UI_Bar · Player 레이어"],
    ["Transform Scale", "0.8"],
    ["Network Object", "← 오늘의 주인공"],
  ], null, 0.58);

  shot(s, "109_FirstConnect", 7.4, 2.1, 5.1, 2.9, "실측 — 호스트 · 내 번호 0 · 접속자 1명");

  const y3 = h3(s, M, y1 + 0.4, CW, "Player Prefab 칸에 넣으면 유니티가 알아서 만들어 준다");
  body(s, M, y3, CW, "누가 접속하면 이 프리팹이 하나 생긴다. 우리가 코드로 안 만든다. 여기가 비어 있으면 접속은 되는데 캐릭터가 안 생긴다 — 109회차 1등 사고다.", 0.5);
  s.addNotes("플레이어 말고 다른 네트워크 물건(몬스터·젬)은 Network Prefabs List 에 따로 등록한다. 그건 117회차다.");
}

// ================================================================ 12. 109 OnNetworkSpawn
{
  const s = slide();
  head(s, "109", "Start 가 아니라 OnNetworkSpawn 이다.", "그때는 아직 주인이 안 정해져 있다.");

  const y1 = code(s, M, 2.05, CW, [
    ["public class NetworkPlayerTag : NetworkBehaviour   // MonoBehaviour 아님", "b"],
    "{",
    ["    public override void OnNetworkSpawn()", "b"],
    "    {",
    "        sprite.color = colors[OwnerClientId % (ulong)colors.Length];",
    "",
    "        Debug.Log($\"[{(IsServer ? \"호스트\" : \"클라이언트\")}] 플레이어 등장 — \" +",
    "                  $\"소유자 {OwnerClientId}  내 것인가 = {IsOwner}\");",
    "    }",
    "}",
  ], true);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["함수", 3.4, "code", INK], ["언제 도는가", 8.27, "", MUTED],
  ], [
    ["Awake · Start", "오브젝트가 생길 때"],
    ["OnNetworkSpawn", "네트워크에 등록될 때 — 네트워크 값은 여기서부터 유효"],
  ], null, 0.5);

  s.addNotes("102회차에서 Start → OnEnable 로 옮긴 것과 같은 종류의 문제다. '언제 도는 함수인가' 를 따지는 습관이 여기서도 쓰인다.");
}

// ================================================================ 13. 109 실측
{
  const s = slide();
  head(s, "109", "[호스트] 를 누른 순간.", "네모 하나뿐이지만 네트워크가 도는 걸 처음 보는 순간이다.");

  const y1 = code(s, M, 2.1, CW, [
    ["호스트 시작 = True", "b"],
    "[호스트] 플레이어 등장 — 소유자 0  내 것인가 = True",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["확인한 것", 5.4, "strong", INK], ["실측", 6.27, "code", INK],
  ], [
    ["IsListening", "True"],
    ["IsHost / IsServer / IsClient", "전부 True — 호스트니까"],
    ["플레이어 오브젝트", "1개"],
    ["소유자 / Spawned / IsOwner", "0 / True / True"],
    ["색", "파랑 (0.300, 0.600, 1.000)"],
  ], null, 0.5);

  s.addText("IsServer 도 True 고 IsClient 도 True 다 — 107에서 배운 '호스트는 둘을 겸한다' 가 이것이다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("네트워크는 성공 경험이 늦게 온다. 그래서 109회차에 작지만 확실한 성공을 만든다. 이 로그를 학생이 자기 Console 에서 보게 하는 것이 목표다.");
}

// ================================================================ 14. 110 MPPM
{
  const s = slide();
  head(s, "110", "가상 플레이어 — 혼자서 둘이 한다.", "에디터가 두 번째 유니티를 띄워준다.");

  const y1 = table(s, M, 2.1, CW, [
    ["방법", 4.6, "strong", INK], ["어떻게", 7.07, "", MUTED],
  ], [
    ["친구를 부른다", "매번 시간을 맞춰야 한다"],
    ["빌드해서 두 개 실행", "고칠 때마다 다시 빌드 — 느리다"],
    ["가상 플레이어", "같은 프로젝트를 보는 두 번째 유니티"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.28, CW, [
    ["실측 (강사 컴퓨터)", "c"],
    "Player 2 상태 = Launched",
    "창 제목      = Player 2",
    ["메모리       = 3.3 GB   (메인 에디터는 3.5 GB)", "b"],
  ]);

  s.addText("램 8GB 이하 학생은 대안으로 간다 — 에디터에서 호스트, 빌드한 exe 에서 클라이언트.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("104회차에서 이미 빌드를 해봤기 때문에 대안이 성립한다. 램 확인을 110회차 첫 6분에 반드시 한다.");
}

// ================================================================ 15. 110 제약
{
  const s = slide();
  head(s, "110", "가상 플레이어에서는 못 하는 게 있다.", "이걸 모르면 30분을 날린다.");

  const y1 = table(s, M, 2.1, 6.3, [
    ["못 하는 것", 3.2, "strong", INK], ["", 3.1, "", MUTED],
  ], [
    ["GameObject 만들기 · 고치기", "메인에서"],
    ["Package Manager", "메인에서"],
    ["프로젝트 설정 변경", "메인에서"],
    ["씬 저장", "메인에서"],
  ], null, 0.5);

  table(s, 7.4, 2.1, 5.1, [
    ["되는 것", 5.1, "strong", INK],
  ], [
    ["Play / Stop"],
    ["Console 보기"],
    ["Hierarchy · Inspector 보기"],
    ["게임 조작"],
  ], null, 0.5);

  const y3 = h3(s, M, y1 + 0.3, CW, "가상 플레이어는 '보는 창' 이다. 고치는 건 항상 메인 에디터.");
  body(s, M, y3, CW, "코드(.cs)는 양쪽이 같은 파일을 본다. 그래서 코드를 고치면 둘 다 바뀐다. 씬과 프리팹도 같은 파일이지만 저장은 메인에서만 된다.", 0.5);
  s.addNotes("Console 이 따로 나오는 것도 정상이다 — 게임이 두 개니까 로그도 두 개다. 106의 그림으로 되돌아가 설명한다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "22주차 회고 — 화면엔 네모 하나가 전부다.", "그런데 20회차짜리 구간의 바닥을 깔았다.");

  const y1 = table(s, M, 1.95, CW, [
    ["회차", 1.3, "code", MUTED], ["한 것", 4.3, "strong", INK], ["새로 배운 것", 6.07, "", MUTED],
  ], [
    ["106", "왜 멀티가 어려운가", "게임이 두 개"],
    ["107", "호스트 · 클라이언트", "권한(authority)"],
    ["108", "패키지 설치", "NetworkManager · UnityTransport"],
    ["109", "첫 접속", "NetworkObject · OnNetworkSpawn"],
    ["110", "가상 플레이어", "MPPM"],
  ], null, 0.44);

  s.addText("Game.unity 는 이번 주 내내 한 번도 안 건드렸다 — 완성작은 지난주 그대로다.", {
    x: M, y: y1 + 0.14, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 23주차", { x: M, y: 5.82, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("네모가 두 개가 된다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("111회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("2인 접속 · 이동 동기화 · IsOwner.", { x: 9.6, y: 6.34, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("112회차에 '내가 움직이면 상대도 같이 움직이는' 사고가 난다. 그걸 고치는 114회차가 067(입력/이동 분리)의 회수 지점이다 — 예고에서 이 연결을 흘려둔다.");
}

const out = path.join(__dirname, "22주차-게임이두개다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
