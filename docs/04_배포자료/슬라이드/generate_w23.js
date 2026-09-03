// 23주차 한 줄로 끝난다 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 9 동기화. 이 덱의 주장: 14주차에 나눠둔 설계가 25주 뒤에 값을 한다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 10장의 "한 줄"

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
pres.title = "23주차 · 한 줄로 끝난다";

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
  s.addText("23주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("한 줄로 끝난다.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("111–115 · 14주차에 나눠둔 설계가 25주 뒤에 값을 한다", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["111", "2인 접속"],
    ["112", "NetworkTransform"],
    ["113", "문제 진단"],
    ["114", "IsOwner"],
    ["115", "NetworkVariable"],
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
  s.addNotes("114회차가 Phase 5 규칙 ②의 회수 지점이다. 067에서 입력과 이동을 나눈 이유를 그때 다 못 줬는데, 이번 주가 그 답이다. 이 연결을 못 짚으면 회차의 절반이 날아간다.");
}

// ================================================================ 2. 111 2인 접속
{
  const s = slide();
  head(s, "111", "106회차의 그림이 화면에 나타난다.", "게임이 두 개, Console 이 두 개, 각자 '내 것' 이 다르다.");

  shot(s, "111_TwoPlayers", 7.2, 2.05, 5.3, 3.0, "실측 — 접속자 2명 · 파랑(0번) 주황(1번)");

  const y1 = code(s, M, 2.05, 6.1, [
    ["메인 에디터", "c"],
    "  소유자 0  내 것인가 = True",
    "  소유자 1  내 것인가 = False",
    "",
    ["가상 플레이어", "c"],
    ["  소유자 0  내 것인가 = False", "b"],
    ["  소유자 1  내 것인가 = True", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "같은 오브젝트인데 양쪽에서 IsOwner 가 다르다");
  body(s, M, y2, CW, "게임이 두 개니까 각자 '내 것' 이 다르다. Console 이 두 개인 것도 같은 이유다 — 로그는 각자 게임에서 찍힌다.", 0.5);
  s.addNotes("접속자 수도 다르게 나온다. 서버는 2명, 클라이언트는 1명. 클라이언트는 자기밖에 못 센다 — 116회차 Rpc 로 해결한다.");
}

// ================================================================ 3. 111 자동화
{
  const s = slide();
  head(s, "111", "테스트를 하루에 오십 번 한다.", "창 두 개에서 버튼을 누르는 건 그때부터 일이다.");

  code(s, M, 2.05, CW, [
    ["using Unity.Multiplayer.PlayMode;   // P 가 대문자다 — 오타가 잦다", "b"],
    "",
    "private void Start()",
    "{",
    "#if UNITY_EDITOR",
    "    bool isClient = false;",
    "    foreach (string tag in CurrentPlayer.Tags)",
    "        if (tag == \"Client\") { isClient = true; break; }",
    "",
    ["    if (isClient) NetworkManager.Singleton.StartClient();", "b"],
    ["    else          NetworkManager.Singleton.StartHost();", "b"],
    "#endif",
    "}",
  ], true);

  const y2 = table(s, M, 5.55, CW, [
    ["", 4.0, "strong", INK], ["", 7.67, "", MUTED],
  ], [
    ["#if UNITY_EDITOR", "태그는 에디터 전용이다. 빼면 빌드가 안 된다"],
    ["메인 에디터", "태그가 비어 있다 → 자동으로 호스트가 된다"],
  ], null, 0.48);
  s.addNotes("실측 로그: 메인은 '태그 없음 — 호스트로 자동 시작', 가상 플레이어는 '태그 Client — 클라이언트로 자동 접속'. Play 한 번으로 양쪽이 붙는다.");
}

// ================================================================ 4. 112 NetworkTransform
{
  const s = slide();
  head(s, "112", "위치 동기화는 코드 0줄이다.", "컴포넌트 하나를 붙이면 끝난다.");

  const y1 = table(s, M, 2.1, CW, [
    ["NetworkTransform", 4.2, "strong", INK], ["우리 값", 2.6, "code", INK], ["왜", 4.87, "", MUTED],
  ], [
    ["Authority Mode", "Owner", "소유자가 정하고 나머지가 받는다 (107)"],
    ["Interpolate", "켬", "받은 위치로 부드럽게"],
    ["Sync Position Z", "끔", "2D 라 안 쓴다"],
    ["Sync Rotation / Scale", "끔", "안 쓰는 건 안 보낸다"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.26, CW, "이동 코드는 067과 똑같다");
  const y3 = body(s, M, y2, CW, "바뀐 건 부모가 NetworkBehaviour 가 된 것뿐이다. 네트워크라고 이동 코드가 달라지지 않는다 — 그게 오늘의 첫 번째 배움이다.", 0.5);

  code(s, M, y3 + 0.14, CW, [
    ["rb.linearVelocity = input.MoveInput * moveSpeed;   // 067회차와 한 글자도 안 다르다", "b"],
  ]);
  s.addNotes("안 쓰는 축을 끄는 건 106회차의 '인터넷으로 보내는 건 비싸다' 를 실제로 적용하는 자리다.");
}

// ================================================================ 5. 112 실측
{
  const s = slide();
  head(s, "112", "동기화가 진짜로 흐르는지 확인하는 법.", "상대 캐릭터를 억지로 옮겨보면 안다.");

  code(s, M, 2.1, CW, [
    ["[전]        내 것 (-0.75, 0.00)   상대 것 (0.40, 0.00)", "c"],
    "[강제 이동]  상대 것 → (99, 99)",
    ["[3초 뒤]     내 것 (-0.65, 0.00)   상대 것 (0.40, 0.00)   ← 돌아왔다", "b"],
  ]);

  const y2 = h3(s, M, 3.55, CW, "상대 캐릭터가 제자리로 돌아왔다");
  const y3 = body(s, M, y2, CW, "클라이언트가 자기 위치를 계속 보내고 있고, 호스트 화면은 그걸 받아 덮어쓴다. 내가 남의 캐릭터를 마음대로 못 옮긴다 — 그게 소유자 권한이다.", 0.6);

  inverse(s, M, y3 + 0.2, CW, 0.86, R_SM);
  s.addText("위치를 보내는 코드를 한 줄도 안 썼다.", {
    x: M + 0.34, y: y3 + 0.2, w: CW - 0.68, h: 0.86, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("이 실험을 학생 전원이 하게 한다. 소유자 권한이 뭔지 말로 듣는 것과 직접 해보는 것은 다르다. 도전 미션 다섯 번째에 넣었다.");
}

// ================================================================ 6. 113 증상 3분류
{
  const s = slide();
  head(s, "113", "'네트워크가 이상해요' 는 진단이 아니다.", "증상이 다르면 원인도 고치는 법도 다르다.");

  const y1 = table(s, M, 2.1, CW, [
    ["#", 0.7, "code", MUTED], ["증상", 4.0, "strong", INK],
    ["진짜 원인", 3.6, "", MUTED], ["언제 고치나", 3.37, "", INK],
  ], [
    ["①", "한 키에 둘 다 움직인다", "입력을 모두가 읽는다", "114회차"],
    ["②", "상대 움직임이 살짝 늦다", "인터넷을 타고 오니까", "못 고친다"],
    ["③", "상대 움직임이 뚝뚝 끊긴다", "초당 몇 번만 보내니까", "Interpolate"],
  ], ACCENT, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "②번은 고칠 수 없다 — 빛보다 빠른 건 없다");
  body(s, M, y2, CW, "서울-부산 왕복이 10ms 정도다. 그건 물리 법칙이라 줄일 수는 있어도 없앨 수는 없다. 학생이 이걸 알아야 헛수고를 안 한다.", 0.6);
  s.addNotes("101회차와 같은 구조다 — 재고, 나누고, 그 다음에 고친다. 증상을 분류하는 법을 먼저 가르쳐야 학생이 혼자 디버깅할 수 있다.");
}

// ================================================================ 7. 113 끊김
{
  const s = slide();
  head(s, "113", "Interpolate 는 점과 점 사이를 채워준다.", "위치는 초당 30번만 보낸다.");

  const y1 = code(s, M, 2.1, CW, [
    ["보낸 것    :   ● ---- ● ---- ● ---- ●      (초당 30개 점)", "c"],
    "받은 쪽    :   ● ---- ● ---- ● ---- ●      끊겨 보인다",
    ["Interpolate:   ●━━━━●━━━━●━━━━●          점 사이를 이어준다", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, 6.3, [
    ["Tick Rate", 2.2, "code", INK], ["느낌", 2.0, "", MUTED], ["데이터", 2.1, "", MUTED],
  ], [
    ["5", "눈에 띄게 끊긴다", "적다"],
    ["30", "기본값. 괜찮다", "보통"],
    ["60", "조금 더 부드럽다", "두 배"],
  ], null, 0.52);

  table(s, 7.4, y1 + 0.3, 5.1, [
    ["Network Simulator", 2.9, "strong", INK], ["", 2.2, "code", MUTED],
  ], [
    ["Packet Delay", "100 ms"],
    ["Packet Jitter", "30 ms"],
    ["Packet Loss", "5 %"],
  ], null, 0.52);

  s.addText("로컬 테스트는 RTT 가 0에 가깝다 — 진짜 문제를 못 본다. 그래서 나쁜 인터넷을 흉내낸다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("수업이 끝나면 Simulator 를 반드시 끄게 한다. 켜두면 개발이 괴롭다. 113회차 체크리스트에 '설정을 전부 되돌렸다' 를 넣었다.");
}

// ================================================================ 8. 114 문제
{
  const s = slide();
  head(s, "114", "왜 둘 다 움직이나.", "스크립트는 네모마다 하나씩 붙어 있다.");

  code(s, M, 2.1, CW, [
    "내 화면 (호스트)",
    " ┌─────────────────────────────────────┐",
    " │  네모 A (내 것)   ← 이 스크립트가 돈다   │",
    ["  │  네모 B (남의 것) ← 이 스크립트도 돈다   │", "b"],
    " └─────────────────────────────────────┘",
    "",
    ["        내가 D 키를 누르면 → 둘 다 오른쪽으로", "b"],
  ]);

  const y2 = h3(s, M, 4.6, CW, "내 키보드 입력은 내 화면의 모든 네모가 읽는다");
  body(s, M, y2, CW, "구분을 안 해줬으니까. 구분하는 값이 IsOwner 다 — 109회차에 로그로 이미 찍어봤던 그 값이다.", 0.6);
  s.addNotes("112회차에 이 버그를 일부러 남겼다. 113에서 관찰하고 114에서 고친다. 고치는 게 한 줄이라 바로 알려주면 왜 그렇게 짰는지가 안 남는다.");
}

// ================================================================ 9. 114 한 줄
{
  const s = slide();
  head(s, "114", "고치는 데 한 줄.", "입력을 읽는 곳이 한 군데뿐이라서.");

  const y1 = code(s, M, 2.05, CW, [
    "void Update()",
    "{",
    ["    if (!IsOwner)", "b"],
    ["    {", "b"],
    ["        MoveInput = Vector2.zero;   // 안 넣으면 마지막 값이 남아 계속 밀린다", "b"],
    ["        return;", "b"],
    ["    }", "b"],
    "",
    "    float h = Input.GetAxisRaw(\"Horizontal\");",
    "    MoveInput = new Vector2(h, v).normalized;",
    "}",
  ], true);

  const y2 = table(s, M, y1 + 0.28, CW, [
    ["어디에 넣나", 4.6, "strong", INK], ["", 7.07, "", MUTED],
  ], [
    ["NetworkPlayerMove", "움직이진 않지만 입력은 계속 읽는다 (낭비)"],
    ["NetworkPlayerInput", "입력을 아예 안 읽는다 — 여기가 맞다"],
  ], null, 0.5);

  s.addNotes("이동 쪽에도 한 줄이 필요하다. Rigidbody2D 가 관성으로 밀어서, 받은 위치와 물리가 싸우면 캐릭터가 부들부들 떤다.");
}

// ================================================================ 10. 114 왜 한 줄인가
{
  const s = slide();
  head(s, "114", "만약 067에서 안 나눴다면.", "이게 오늘 회차의 절반이다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["// 흔히 짜는 방식", "c"],
    "class PlayerController { void Update() {",
    "    float h = Input.GetAxisRaw(...);   // 여기서 읽고",
    "} }",
    "class PlayerAttack { void Update() {",
    "    if (Input.GetKeyDown(Space)) ...   // 여기서도",
    "} }",
    "class PlayerDash { void Update() {",
    "    if (Input.GetKeyDown(Shift)) ...   // 여기서도",
    "} }",
  ]);

  table(s, 7.4, 2.05, 5.1, [
    ["", 2.5, "strong", INK], ["고칠 곳", 2.6, "", MUTED],
  ], [
    ["안 나눴다면", "전부. 하나만 빠뜨려도 버그"],
    ["우리 프로젝트", "NetworkPlayerInput 한 곳"],
  ], null, 0.6);

  const y3 = h3(s, M, y1 + 0.36, CW, "14주차에 번거롭게 나눈 대가를 25주 뒤에 받는다");
  body(s, M, y3, CW, "앞으로 코드를 짤 때 이 질문을 하라 — \"나중에 이 규칙을 바꾸려면 몇 군데를 고쳐야 하나?\"", 0.5);
  s.addNotes("067 코드를 실제로 화면에 띄운다. 25주 전이라 학생이 기억을 못 한다. 띄워놓고 비교해야 연결이 붙는다.");
}

// ================================================================ 11. 115 NetworkVariable
{
  const s = slide();
  head(s, "115", "값을 담는 상자.", "위치는 NetworkTransform, 숫자는 NetworkVariable.");

  const y1 = code(s, M, 2.05, CW, [
    "public NetworkVariable<int> Health = new NetworkVariable<int>(",
    "    20,",
    "    NetworkVariableReadPermission.Everyone,",
    ["    NetworkVariableWritePermission.Server);   // ← 107회차가 코드로 나타난 자리", "b"],
    "",
    ["int now = Health.Value;   // 읽기 — 누구나", "c"],
    ["Health.Value = 13;        // 쓰기 — 서버만", "c"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["무엇", 4.6, "strong", INK], ["무엇으로", 7.07, "", MUTED],
  ], [
    ["위치 · 회전 · 크기", "NetworkTransform (112)"],
    ["숫자 · 문자 · bool", "NetworkVariable<T> — 오늘"],
    ["한 번만 알리는 일", "Rpc (116회차)"],
  ], null, 0.5);

  s.addNotes(".Value 를 빼먹는 실수가 1등이다. Health 는 상자고 Health.Value 가 값이다. 이 구분을 첫 5분에 못박는다.");
}

// ================================================================ 12. 115 벽
{
  const s = slide();
  head(s, "115", "클라이언트는 벽에 부딪힌다.", "그게 오늘의 마지막 배움이다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[호스트에서 깎았을 때]", "c"],
    "상대 체력 → 13",
    ["[호스트] 소유자 1 체력 20 → 13        ← 양쪽에 전달된다", "b"],
    "",
    ["[클라이언트에서 깎았을 때]", "c"],
    ["체력은 서버만 바꿀 수 있다. 116회차의 Rpc 가 필요하다.", "b"],
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "클라이언트가 '내 체력 깎아줘' 하려면 서버에 부탁해야 한다");
  body(s, M, y2, CW, "그 부탁하는 방법이 Rpc 다 — 다음 주 116회차. 오늘은 벽에 부딪히는 것까지가 목표다.", 0.5);

  s.addText("OnValueChanged 는 양쪽 화면에서 다 불린다 — 체력바를 여기서 갱신하면 된다.", {
    x: M, y: y2 + 0.66, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("OnValueChanged 등록은 OnNetworkSpawn 에서, 해제는 OnNetworkDespawn 에서. 085회차의 RemoveAllListeners 와 같은 이유다.");
}

// ================================================================ 13. 실측 종합
{
  const s = slide();
  head(s, null, "이번 주 실측 종합.", "호스트 화면에서 잰 값이다.");

  const y1 = code(s, M, 2.1, CW, [
    "IsListening=True  IsHost=True  IsServer=True",
    ["내 번호 = 0   접속자 = 2명   접속자 목록 = [0, 1]", "b"],
    "",
    "플레이어 오브젝트 = 2개",
    ["   소유자 0  IsOwner=True   위치 (-0.75, 0.00)  색 파랑   체력 20", "b"],
    ["   소유자 1  IsOwner=False  위치 ( 0.40, 0.00)  색 주황   체력 20", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["확인한 것", 5.4, "strong", INK], ["결과", 6.27, "", MUTED],
  ], [
    ["2인 동시 접속", "성공 — 태그 자동 접속으로"],
    ["위치 동기화", "강제 이동 (99,99) → 3초 뒤 원위치 복귀"],
    ["NetworkVariable", "호스트가 20 → 13, OnValueChanged 로그 확인"],
    ["싱글 회귀", "Title → Game, 12초 4킬, NetworkManager 없음"],
  ], null, 0.5);
  s.addNotes("클라이언트 쪽 화면 상태는 미실측이다 — 가상 플레이어 프로세스 안의 값을 읽을 수단이 없다. 호스트가 받은 데이터로 간접 확인했다.");
}

// ================================================================ 14. 미실측
{
  const s = slide();
  head(s, null, "재지 못한 것.", "추측을 결과처럼 쓰지 않는다.");

  const y1 = table(s, M, 2.15, CW, [
    ["재지 못한 것", 5.4, "strong", INK], ["왜", 6.27, "", MUTED],
  ], [
    ["클라이언트 쪽 화면 상태", "가상 플레이어 프로세스 안의 값을 읽을 수단이 없다"],
    ["키보드 입력 (WASD)", "레거시 Input Manager 는 시뮬레이션이 안 된다"],
    ["끊김 · 지연의 체감", "로컬이라 RTT 가 0에 가깝다"],
    ["Relay 인터넷 접속", "UGS 연동이 필요하다 — 124회차"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "대신 이렇게 확인했다");
  body(s, M, y2, CW, "이동은 MoveInput 을 코드로 넣어 검증했고, 클라이언트가 살아 있다는 것은 '강제로 옮긴 상대 캐릭터가 돌아온다' 로 간접 확인했다. 클라이언트가 자기 위치를 계속 보내지 않으면 돌아올 수 없다.", 0.7);
  s.addNotes("수업에서는 학생이 두 창을 직접 보므로 이 항목들이 자연히 확인된다. 강사가 자동 검증으로 확인할 수 없었을 뿐이다.");
}

// ================================================================ 15. 코드 양
{
  const s = slide();
  head(s, null, "이번 주에 쓴 코드의 양.", "제일 어려워 보이던 게 제일 짧았다.");

  const y1 = table(s, M, 2.15, CW, [
    ["무엇", 5.0, "strong", INK], ["줄 수", 2.4, "code", INK], ["", 4.27, "", MUTED],
  ], [
    ["NetworkPlayerInput", "약 25줄", "067과 거의 같다 + IsOwner 한 줄"],
    ["NetworkPlayerMove", "약 25줄", "067과 거의 같다 + IsOwner 한 줄"],
    ["NetworkAutoConnect", "약 30줄", "테스트 편의용"],
    ["NetworkHealthDemo", "약 40줄", ""],
    ["NetworkTransform", "0줄", "컴포넌트"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.28, CW, "위치 동기화 0줄, '내 것만 조종' 한 줄");
  body(s, M, y2, CW, "네트워크가 어렵다는 건 코드가 길어서가 아니라 그림이 안 그려져서다. 106~107에 두 회차를 쓴 이유가 이것이다.", 0.5);
  s.addNotes("Snapshot_P9_step2 를 여기서 배포한다. 네트워크는 한 번 꼬이면 학생 혼자 못 푼다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "23주차 회고 — 설계가 값을 했다.", "새 문법은 셋뿐이다.");

  const y1 = table(s, M, 1.95, CW, [
    ["회차", 1.3, "code", MUTED], ["한 것", 4.3, "strong", INK], ["새로 배운 것", 6.07, "", MUTED],
  ], [
    ["111", "2인 접속", "MPPM 태그 · CurrentPlayer.Tags"],
    ["112", "이동 동기화", "NetworkTransform"],
    ["113", "문제 진단", "Tick Rate · Interpolate · Simulator"],
    ["114", "내 것만 조종", "IsOwner"],
    ["115", "체력 동기화", "NetworkVariable"],
  ], null, 0.44);

  s.addText("Game.unity 는 이번 주에도 안 건드렸다 — 완성작은 21주차 그대로다.", {
    x: M, y: y1 + 0.14, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 24주차", { x: M, y: 5.82, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("이번엔 규칙 ①의 회수.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("116회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("Rpc · 호스트 전용 스폰 · 본 게임 이식.", { x: 9.6, y: 6.34, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("117회차가 073(스폰은 매니저 한 곳에서만)의 회수 지점이다. if (!IsServer) return; 한 줄로 끝난다. 그리고 24주차부터 본 게임에 네트워크를 얹기 시작한다.");
}

const out = path.join(__dirname, "23주차-한줄로끝난다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
