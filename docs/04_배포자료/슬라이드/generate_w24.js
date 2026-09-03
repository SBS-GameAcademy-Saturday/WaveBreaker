// 24주차 세 번의 회수 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 9 서버 권한. 이 덱의 주장: 설계는 지금 편하려고가 아니라 나중에 안 무너지려고 한다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 15장의 "세 번의 회수"

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
pres.title = "24주차 · 세 번의 회수";

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
  s.addText("24주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("세 번의 회수.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("116–120 · 서버 권한 · 몇 달 전에 심어둔 것을 이번 주에 거둔다", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["116", "Rpc"],
    ["117", "호스트만 스폰"],
    ["118", "젬 · 팀 경험치"],
    ["119", "피격 판정"],
    ["120", "협동 카메라"],
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
  s.addNotes("117(073 회수)과 120(095 회수)이 이번 주의 뼈대다. 114(067 회수)까지 세 번을 마지막 슬라이드에서 나란히 놓고 정리한다. 세 번 반복해야 '설계가 값을 한다' 가 실감으로 남는다.");
}

// ================================================================ 2. 116 Rpc
{
  const s = slide();
  head(s, "116", "서버에 부탁하는 방법.", "115회차에 부딪힌 벽의 열쇠다.");

  const y1 = code(s, M, 2.05, CW, [
    ["[Rpc(SendTo.Server)]                     // 서버에서 실행해 달라", "b"],
    ["public void RequestDamageRpc(int amount) // 이름이 Rpc 로 끝나야 한다", "b"],
    "{",
    "    // 여기부터는 서버다.",
    "    TakeDamage(amount);",
    "}",
  ], true);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["   클라이언트                             호스트", "c"],
    " ┌──────────────────────┐         ┌──────────────────────┐",
    " │ RequestDamageRpc(7)  │ ──────▶ │ RequestDamageRpc(7)  │",
    ["  │   호출만 한다         │  인터넷  │   ← 여기서 몸통이 돈다  │", "b"],
    " └──────────────────────┘         └──────────────────────┘",
  ]);

  s.addText("호출한 곳과 실행되는 곳이 다르다 — 클라이언트 Console 에는 몸통 로그가 안 찍힌다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("함수 이름이 Rpc 로 안 끝나면 컴파일 에러가 난다. 116회차 1등 사고다. NGO 가 이름으로 구분한다.");
}

// ================================================================ 3. 116 방향
{
  const s = slide();
  head(s, "116", "방향은 두 가지뿐이다.", "올라가는 것과 내려오는 것.");

  const y1 = table(s, M, 2.1, CW, [
    ["SendTo", 3.0, "code", INK], ["어디서 실행되나", 3.6, "", MUTED], ["언제 쓰나", 5.07, "", INK],
  ], [
    ["Server", "서버에서", "클라이언트가 부탁할 때 — 제일 많다"],
    ["ClientsAndHost", "모두에게서", "서버가 모두에게 알릴 때 (연출·소리)"],
    ["Owner", "소유자에게서", "그 사람에게만 알릴 때"],
    ["NotServer", "서버 빼고", ""],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.28, CW, "값이 유지되면 NetworkVariable, 한 번만 알리면 Rpc");
  const y3 = body(s, M, y2, CW, "\"체력\" 은 변수, \"맞았다는 이펙트\" 는 Rpc. 이 구분을 못 하면 매 프레임 Rpc 를 쏘게 된다.", 0.5);

  inverse(s, M, y3 + 0.18, CW, 0.86, R_SM);
  s.addText("서버는 클라이언트 말을 믿으면 안 된다. amount 에 99999 를 보내면 그대로 들어간다.", {
    x: M + 0.34, y: y3 + 0.18, w: CW - 0.68, h: 0.86, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("우리 수업 코드에는 검사를 주석으로만 남겼다. 친구랑 하는 게임이라 치트가 없다. 어디에 넣어야 하는지만 알면 된다.");
}

// ================================================================ 4. 117 회수
{
  const s = slide();
  head(s, "117", "규칙 ①의 회수 — 고칠 곳이 한 군데다.", "073회차에 스폰을 매니저 한 곳으로 모아뒀다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// WaveManager.cs — 073회차에 써둔 주석", "c"],
    ["// 🔑 이 프로젝트의 규칙: 몬스터 스폰은 매니저 한 곳에서만 한다.", "c"],
    ["//    여기저기서 Instantiate 하면 나중에 누가 만들었는지 못 찾는다.", "c"],
    "",
    "public override void OnNetworkSpawn()",
    "{",
    ["    if (!IsServer) return;   // 클라이언트는 몬스터를 안 만든다", "b"],
    "    StartCoroutine(SpawnRoutine());",
    "}",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "그때 이유를 '나중에 못 찾는다' 고만 했다");
  body(s, M, y2, CW, "진짜 이유가 오늘이다. 몬스터를 5개 파일에서 만들었다면 5군데를 다 고쳐야 하고, 하나만 빠뜨리면 그 몬스터만 두 배로 나온다. 찾기도 어렵다.", 0.6);
  s.addNotes("073 코드를 실제로 화면에 띄운다. 15주차라 학생이 기억을 못 한다. 주석을 소리내어 읽히면 연결이 붙는다.");
}

// ================================================================ 5. 117 Spawn
{
  const s = slide();
  head(s, "117", "Instantiate 만으로는 상대에게 안 보인다.", "유니티는 그게 네트워크 물건인지 모른다.");

  const y1 = code(s, M, 2.1, CW, [
    "GameObject go = Instantiate(enemyPrefab, pos, Quaternion.identity);",
    "",
    ["// 🚨 Instantiate 만으로는 내 화면에만 생긴다.", "c"],
    ["go.GetComponent<NetworkObject>().Spawn();   // 네트워크에 등록 → 모두에게 보인다", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["함수", 4.0, "code", INK], ["하는 일", 7.67, "", MUTED],
  ], [
    ["Instantiate", "내 컴퓨터에 만든다"],
    ["NetworkObject.Spawn()", "네트워크에 등록한다 → 모두에게 생긴다"],
    ["NetworkObject.Despawn()", "네트워크에서 뺀다 → 모두에게서 사라진다"],
  ], null, 0.5);

  s.addText("없앨 때도 Destroy 가 아니라 Despawn 이다. 102의 PoolManager.Spawn 과 이름이 겹쳐 헷갈린다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Spawn() 을 넣으면 이번엔 'NetworkPrefab is not registered' 가 난다. 프리팹 목록 등록이 117회차 2등 사고다.");
}

// ================================================================ 6. 117 본 게임
{
  const s = slide();
  head(s, "117", "본 게임에 두 줄. 싱글은 안 바뀐다.", "22주차부터 안 건드리던 Game.unity 에 처음 손을 댄다.");

  const y1 = code(s, M, 2.05, CW, [
    "public static bool IsServerOrOffline",
    "{",
    "    NetworkManager nm = NetworkManager.Singleton;",
    ["    if (nm == null) return true;          // 씬에 없다 = 싱글 모드다", "b"],
    ["    if (!nm.IsListening) return true;     // 접속 안 했으면 싱글과 같다", "b"],
    "    return nm.IsServer;",
    "}",
  ]);

  const y2 = code(s, M, y1 + 0.28, CW, [
    ["public void SpawnOne()   { if (!NetworkRole.IsServerOrOffline) return; ... }", "b"],
    ["public void SpawnBoss(int i) { if (!NetworkRole.IsServerOrOffline) return; ... }", "b"],
  ]);

  const y3 = h3(s, M, y2 + 0.26, CW, "싱글은 '호스트 혼자 하는 게임' 으로 취급한다");
  body(s, M, y3, CW, "그러면 본 게임 코드에 if / else 분기가 하나도 안 생긴다. 125회차의 모드 통합이 여기서 시작된다.", 0.46);
  s.addNotes("실측: 싱글에서 NetworkRole.IsServerOrOffline = True, NetworkManager 존재 = False. 14초에 처치 5, 풀 재사용 22 — 21주차와 똑같이 돌았다.");
}

// ================================================================ 7. 118 동시에 먹으면
{
  const s = slide();
  head(s, "118", "둘이 동시에 같은 젬을 밟으면?", "학생이 스스로 떠올리기 어려운데 실제로 터진다.");

  const y1 = table(s, M, 2.1, CW, [
    ["방식", 4.6, "strong", INK], ["결과", 7.07, "", MUTED],
  ], [
    ["각자 판정", "둘 다 먹는다 — 경험치가 두 배로 들어간다"],
    ["서버만 판정", "한 번만"],
  ], ACCENT, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    "private void OnTriggerEnter2D(Collider2D other)",
    "{",
    ["    if (!IsServer) return;   // 두 컴퓨터가 각자 판정하는 것을 막는다", "b"],
    ["    if (taken) return;       // 한 프레임에 두 번 처리되는 것을 막는다", "b"],
    "",
    "    taken = true;",
    "    NetworkTeam.Instance.AddExp(exp);",
    "    NetworkObject.Despawn();",
    "}",
  ]);

  s.addText("두 번째 줄은 090의 그 함정이다 — 보스가 5번 죽었던 그것.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Despawn 은 바로 안 끝난다. 그 사이에 두 번째 OnTriggerEnter2D 가 들어온다. 090에서 Destroy 가 프레임 끝에 처리돼 Die() 가 여러 번 불린 것과 같은 종류다.");
}

// ================================================================ 8. 118 팀 경험치
{
  const s = slide();
  head(s, "118", "경험치는 팀 공유.", "기획서 11장 — 혼자 독차지하면 같이 하는 재미가 없다.");

  const y1 = code(s, M, 2.05, CW, [
    "public NetworkVariable<int> Exp   = new(0, Everyone, Server);",
    "public NetworkVariable<int> Level = new(1, Everyone, Server);",
    "",
    "public void AddExp(int amount)",
    "{",
    "    if (!IsServer) return;",
    "    Exp.Value += amount;",
    "",
    ["    while (Exp.Value >= NeedExp)   // 083과 계산이 똑같다", "b"],
    "    { Exp.Value -= NeedExp; Level.Value++; }",
    "}",
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "달라진 건 int 가 상자가 된 것뿐이다");
  body(s, M, y2, CW, "083회차 PlayerLevel 의 while 루프를 그대로 옮겼다. 레벨이 오르면 OnValueChanged 가 양쪽에서 불린다 — 123회차에 거기서 레벨업 창을 띄운다.", 0.5);
  s.addNotes("씬의 매니저(NetworkTeam, NetworkWaveManager)에도 NetworkObject 컴포넌트가 필요하다. 없으면 조용히 동작을 안 해서 찾기 어렵다.");
}

// ================================================================ 9. 119 무엇을 보내나
{
  const s = slide();
  head(s, "119", "GameObject 는 못 보낸다.", "내 컴퓨터의 주소라서 상대 컴퓨터에선 의미가 없다.");

  const y1 = table(s, M, 2.1, 6.3, [
    ["보낼 수 있는 것", 3.1, "code", INK], ["못 보내는 것", 3.2, "code", MUTED],
  ], [
    ["int  float  bool  ulong", "GameObject"],
    ["Vector3  Quaternion", "Transform"],
    ["NetworkObjectId", "MonoBehaviour"],
  ], null, 0.55);

  code(s, 7.4, 2.1, 5.1, [
    ["클라 : \"26번 몬스터를", "c"],
    ["        3만큼 때렸어요\"", "c"],
    "",
    ["서버 : 26번을 찾아서", "b"],
    ["        체력을 깎는다", "b"],
  ]);

  const y3 = code(s, M, y1 + 0.36, CW, [
    "AttackServerRpc(target.NetworkObjectId, damage);",
    "",
    ["// 서버에서 — TryGetValue 를 꼭 쓴다. 그 사이에 죽었을 수 있다.", "c"],
    ["if (!NetworkManager.SpawnManager.SpawnedObjects.TryGetValue(targetId, out var obj)) return;", "b"],
  ]);
  s.addNotes("[targetId] 로 바로 꺼내면 KeyNotFoundException 이 난다. 인터넷은 시간이 걸리니 보내는 사이에 대상이 죽을 수 있다. 119회차 1등 사고다.");
}

// ================================================================ 10. 119 누가 때리나
{
  const s = slide();
  head(s, "119", "부탁이 필요한 건 클라이언트뿐이다.", "서버는 그냥 하면 된다.");

  const y1 = table(s, M, 2.15, CW, [
    ["누가 때리나", 5.0, "strong", INK], ["어떻게", 6.67, "", MUTED],
  ], [
    ["클라이언트 → 몬스터", "Rpc 로 부탁한다"],
    ["호스트 → 몬스터", "바로 (이미 서버니까)"],
    ["몬스터 → 플레이어", "바로 (몬스터가 서버 것이니까)"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "사거리 검사에는 여유를 준다");
  const y3 = body(s, M, y2, CW, "클라이언트가 때렸을 땐 사거리 안이었는데 서버에 도착하니 몬스터가 움직였을 수 있다. 너무 빡빡하게 검사하면 정상 플레이가 씹힌다.", 0.6);

  code(s, M, y3 + 0.16, CW, [
    ["if (dist > range * 1.5f) return;   // 여유를 준다", "b"],
    ["if (amount > 10) return;           // 말도 안 되는 값 거르기", "b"],
  ]);
  s.addNotes("nextHitTime 은 080의 무적시간과 같은 생각이다. OnCollisionStay2D 는 매 프레임 불리므로 간격을 안 두면 즉사한다.");
}

// ================================================================ 11. 120 095를 띄운다
{
  const s = slide();
  head(s, "120", "19주차에 써둔 주석을 읽는다.", "계산 코드는 오늘 한 글자도 안 고친다.");

  const yA = code(s, M, 2.1, CW, [
    ["// CameraFollow.cs — 095회차", "c"],
    ["// 095회차 · \"하나를 따라간다\" 를 \"목록의 중심을 따라간다\" 로 바꿨다.", "c"],
    ["//   목록에 하나만 넣으면 동작이 068과 완전히 같다.", "c"],
    ["//   Phase 9 에서 협동을 붙일 때 이 파일은 안 고치고", "b"],
    ["//   목록에 하나 더 넣기만 하면 된다.", "b"],
  ]);

  const y2 = code(s, M, yA + 0.24, CW, [
    ["// 120회차에 새로 쓴 것 — 이게 전부다", "c"],
    "public void AddTarget(Transform t)",
    "{",
    "    if (t == null || targets.Contains(t)) return;",
    "    targets.Add(t);",
    "}",
    "",
    "public void RemoveTarget(Transform t) { targets.Remove(t); }",
  ]);

  s.addText("두 함수, 여섯 줄. Center() 와 LateUpdate 는 그대로다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Contains 검사가 없으면 두 번 등록됐을 때 평균이 그쪽으로 쏠린다. RemoveTarget 을 빼면 나간 사람 쪽으로 카메라가 끌린다.");
}

// ================================================================ 12. 120 IsOwner 함정
{
  const s = slide();
  head(s, "120", "여기엔 IsOwner 를 넣으면 안 된다.", "114를 배웠다고 아무 데나 넣으면 안 된다.");

  const y1 = code(s, M, 2.1, CW, [
    "public override void OnNetworkSpawn()",
    "{",
    ["    // \"내 것\" 만 넣는 게 아니라 둘 다 넣는다 — 카메라는 둘의 중심을 봐야 하니까", "c"],
    "    CameraFollow cam = Camera.main.GetComponent<CameraFollow>();",
    ["    if (cam != null) cam.AddTarget(transform);", "b"],
    "}",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "\"이 동작이 나만의 것인가\" 를 매번 물어야 한다");
  const y3 = table(s, M, y2, CW, [
    ["", 5.0, "strong", INK], ["IsOwner 검사", 6.67, "", MUTED],
  ], [
    ["입력 읽기 (114)", "필요하다 — 내 키보드는 내 캐릭터만 움직인다"],
    ["카메라 목록 (120)", "넣으면 안 된다 — 다시 한 명만 따라가게 된다"],
  ], null, 0.5);

  s.addNotes("이게 120회차 1등 사고다. 114에서 IsOwner 를 배운 직후라 반사적으로 넣는다. 왜 여기는 아닌지 학생이 설명할 수 있어야 한다.");
}

// ================================================================ 13. 실측
{
  const s = slide();
  head(s, null, "이번 주 실측.", "호스트 화면에서 잰 값이다.");

  const y1 = code(s, M, 2.05, 6.3, [
    ["[ 협동 — 2인 접속 ]", "c"],
    "접속자=2명  목록=[0, 1]",
    ["몬스터 1마리  젬 2개  플레이어 2명", "b"],
    "네트워크 오브젝트 총 7개",
    ["팀 — 경험치 6/8  레벨 2", "b"],
    "",
    "[호스트] 몬스터 처치 — 젬을 떨군다",
    ["[호스트] 팀 레벨 2 → 3", "b"],
  ]);

  shot(s, "117_CoopLoop", 7.4, 2.05, 5.1, 2.1, "플레이어 2 · 몬스터 · 젬 2 — 모두 호스트가 만든 것");

  const y3 = code(s, M, y1 + 0.28, CW, [
    ["[ 협동 카메라 ]", "c"],
    "플레이어 0 (-0.77, 0.00)   플레이어 1 (0.40, 0.00)",
    ["목록 평균 (-0.18, 0.00)   카메라 (-0.18, 0.00)   거리 0.00", "b"],
    "",
    ["[ 싱글 회귀 ]  14초에 처치 5 · 풀 재사용 22 · NetworkManager 없음", "b"],
  ]);
  s.addNotes("네트워크 오브젝트 7개 = 플레이어 2 + 몬스터 1 + 젬 2 + 매니저 2. 숫자가 맞아떨어지는지 확인하면 몬스터가 두 배로 안 나온 게 증명된다.");
}

// ================================================================ 14. 미실측
{
  const s = slide();
  head(s, null, "재지 못한 것.", "추측을 결과처럼 쓰지 않는다.");

  const y1 = table(s, M, 2.15, CW, [
    ["재지 못한 것", 5.4, "strong", INK], ["왜", 6.27, "", MUTED],
  ], [
    ["클라이언트 쪽 화면 상태", "가상 플레이어 프로세스 안의 값을 읽을 수단이 없다"],
    ["키보드 이동 (WASD)", "레거시 Input Manager 는 시뮬레이션이 안 된다"],
    ["Relay 인터넷 접속", "UGS 연동이 필요하다 — 124회차"],
    ["10분 완주 · 밸런스", "네트워크 판을 끝까지 돌려보지 않았다"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "겪은 것 — 맞은 몬스터가 하얗게 남았다");
  body(s, M, y2, CW, "피격 시 흰색으로 바꾸고 되돌리는 코드를 안 넣었다. 스크린샷을 보고 발견해서 099의 Flash 와 같은 구조(코루틴 + 원래 색 복귀)로 고쳤다.", 0.6);
  s.addNotes("공격은 자동 발사로 만들어 키보드 없이도 검증이 되게 했다. 그래서 몬스터 처치와 젬 드롭까지는 실측할 수 있었다.");
}

// ================================================================ 15. 세 번의 회수
{
  const s = slide();
  head(s, null, "세 번의 회수 — 이번 Phase 의 주제.", "세 번 다 몇 달 전에 심어둔 것이다.");

  const y1 = table(s, M, 2.05, CW, [
    ["언제 심었나", 2.8, "code", MUTED], ["무엇을", 5.0, "strong", INK],
    ["언제 거뒀나", 1.9, "code", MUTED], ["고친 양", 1.97, "", INK],
  ], [
    ["067 (14주차)", "입력 읽는 곳과 움직이는 곳을 분리", "114", "한 줄"],
    ["073 (15주차)", "스폰은 매니저 한 곳에서만", "117", "두 줄"],
    ["095 (19주차)", "카메라가 목록의 중심을 본다", "120", "여섯 줄"],
  ], ACCENT, 0.55);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 3.4, "strong", INK], ["해뒀을 때", 3.4, "", MUTED], ["안 해뒀을 때", 4.87, "", INK],
  ], [
    ["입력", "한 줄", "입력 읽는 모든 파일"],
    ["스폰", "두 줄", "Instantiate 하는 모든 곳"],
    ["카메라", "여섯 줄", "카메라 계산을 새로 짠다"],
    ["빠뜨리면", "—", "그 기능만 조용히 고장난다"],
  ], null, 0.46);
  s.addNotes("반대 경우를 반드시 같이 보여준다. '한 줄로 끝났다' 만 말하면 운이 좋았던 것처럼 들린다. 안 해뒀다면 어땠을지가 설계의 값이다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "24주차 회고 — 120회차는 새 문법이 없다.", "설계는 지금 편하려고가 아니라 나중에 안 무너지려고 한다.");

  const y1 = table(s, M, 1.95, CW, [
    ["회차", 1.3, "code", MUTED], ["한 것", 4.3, "strong", INK], ["새로 배운 것", 6.07, "", MUTED],
  ], [
    ["116", "서버에 부탁하기", "Rpc"],
    ["117", "호스트만 스폰", "NetworkObject.Spawn() · 프리팹 목록"],
    ["118", "젬 · 팀 경험치", "서버 단독 판정"],
    ["119", "피격 판정", "NetworkObjectId · SpawnManager"],
    ["120", "협동 카메라", "— 없음"],
  ], null, 0.44);

  s.addText("앞으로 코드를 짤 때 물어야 할 질문 — \"이 규칙을 나중에 바꾸려면 몇 군데를 고쳐야 하나?\"", {
    x: M, y: y1 + 0.14, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 25주차 · Phase 9 마지막", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("진짜 인터넷으로 접속한다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("121회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("줌아웃 · 부활 · Relay · 모드 통합.", { x: 9.6, y: 6.34, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("Snapshot_P9_step3 을 120회차에 배포한다. 다음 주는 부활(기획서 11장의 핵심 재미)과 Relay 가 들어간다.");
}

const out = path.join(__dirname, "24주차-세번의회수.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
