// 21주차 분기점 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 8. 이 덱의 주장: 원인을 재보고 나서 고친다. 그리고 백업이 진짜 목표다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 16장의 "백업"

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
pres.title = "21주차 · 분기점";

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
  s.addText("21주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("분기점.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("101–105 · Phase 8 · 이번 주가 끝나면 .exe 를 갖는다", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["101", "렉을 겪는다"],
    ["102", "풀링 ① 몬스터"],
    ["103", "풀링 ② + 개수 상한"],
    ["104", "밸런싱 · 빌드"],
    ["105", "상호 테스트 · 백업"],
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
  s.addNotes("이 주차를 통과하면 이후 무슨 일이 있어도 모든 학생이 완성작을 갖는다. Phase 9(네트워크)가 실패해도 종강 때 보여줄 게 있다. 이 5회차는 무슨 일이 있어도 사수한다.");
}

// ================================================================ 2. 왜 지금인가
{
  const s = slide();
  head(s, null, "풀링을 100회차까지 미룬 이유.", "처음부터 풀링으로 짜면 '왜 이렇게 복잡하지' 만 남는다.");

  const y1 = table(s, M, 2.05, CW, [
    ["", 3.6, "strong", INK], ["골드메탈 강좌", 4.0, "", MUTED], ["우리", 4.07, "", INK],
  ], [
    ["풀링을 언제", "06강 (초반)", "102회차 (거의 끝)"],
    ["학생이 얻는 것", "코드를 베낀다", "해결책으로 기억한다"],
    ["전제", "빠른 진도", "노베이스 · 불편을 먼저"],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.3, CW, "불편을 먼저 겪게 하는 마지막 회차다");
  body(s, M, y2, CW, "Phase 5부터 100회차까지 몬스터·총알·젬을 전부 Instantiate / Destroy 로 만들어 왔다. 그걸 먼저 겪게 하고 고친다. 원칙 4번의 마지막 적용 지점이다.", 0.62);
  s.addNotes("091~092(Anchor)에서도, 097(씬 전환)에서도 같은 순서를 썼다. 이번이 마지막이다. Phase 9 부터는 불편을 겪게 할 여유가 없다.");
}

// ================================================================ 3. 101 재기
{
  const s = slide();
  head(s, "101", "'느린 것 같다' 는 측정이 아니다.", "숫자로 재야 고칠 자리를 찾는다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["Time.frameCount              지금까지 그린 프레임 수", "c"],
    ["Time.realtimeSinceStartup    진짜 시계 (timeScale 을 안 탄다)", "c"],
    "",
    ["평균 FPS = 흐른 프레임 수 / 흐른 시간", "b"],
  ]);

  table(s, 7.4, 2.1, 5.1, [
    ["프로파일러에서 볼 것", 2.9, "code", INK], ["", 2.2, "", MUTED],
  ], [
    ["FixedUpdate", "몬스터 Move()"],
    ["Rendering", "그리기"],
    ["GC.Alloc", "쓰레기가 생긴 양"],
  ], null, 0.58);

  const y3 = h3(s, M, y1 + 0.4, CW, "겪은 것 — 재기 전에 timeScale 을 확인하지 않았다");
  body(s, M, y3, CW, "처음 잴 때 레벨업 창이 열려 있었다. timeScale = 0 이라 게임이 멈춘 상태였고 '몬스터 4764마리인데 458 FPS' 라는 엉터리 결과가 나왔다. 멈춘 게임은 당연히 빠르다.", 0.62);
  s.addNotes("이 실수를 그대로 강의안에 넣었다. 학생도 똑같이 겪는다. 17주차 자석 검증 때도 같은 함정에 빠졌었다 — timeScale 확인은 이 프로젝트의 상비 점검 항목이다.");
}

// ================================================================ 4. 101 실측 (가)
{
  const s = slide();
  head(s, "101", "원인 (가) — 오브젝트가 많다.", "에디터 · 1280x720 · 플레이어 무적 상태에서 잰 값.");

  const y1 = table(s, M, 2.15, CW, [
    ["살아 있는 몬스터", 5.5, "code", INK], ["평균 FPS", 3.0, "code", INK], ["", 3.17, "", MUTED],
  ], [
    ["1", "435.9", ""],
    ["236", "421.7", ""],
    ["917", "368.1", "여기부터 체감된다"],
    ["1802", "263.0", ""],
    ["3668", "45.2", "열 배 가까이 느려졌다"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.28, CW, "1000마리 근처부터 눈에 띄게 떨어진다.");
  body(s, M, y2, CW, "숫자는 컴퓨터마다 다르다. 곡선의 모양이 같으면 된다. 학생 각자가 자기 컴퓨터에서 재게 하고, 그 값을 칠판에 모은다.", 0.5);
  s.addNotes("몬스터가 3000마리면 FixedUpdate 가 매 프레임 3000번 돈다. Deep Profile 을 잠깐 켜서 어느 함수가 비싼지 보여줘도 좋다.");
}

// ================================================================ 5. 101 실측 (나)
{
  const s = slide();
  head(s, "101", "원인 (나) — 만들고 버리기가 비싸다.", "500개씩 재본 값.");

  code(s, M, 2.1, CW, [
    "Instantiate 500개 : 9.2 ms   (1개당 18 µs)",
    "Destroy     500개 : 2.0 ms   (1개당  4 µs)",
    ["합계 11.2 ms → 60FPS 한 프레임(16.7ms) 기준 0.7프레임 분량", "c"],
    "관리 힙 4 KB 증가",
    "",
    ["SetActive 껐다 켜기 500개 : 2.6 ms  (1개당 5 µs)   힙 0 KB", "b"],
  ]);

  const y2 = h3(s, M, 4.5, CW, "그런데 우리 게임은 초당 2~3마리만 만든다");
  const y3 = body(s, M, y2, CW, "초당 3마리면 66 µs 다. 한 프레임이 16700 µs 인데. 즉 만들고 버리는 비용은 우리 게임에서 프레임을 안 잡아먹는다.", 0.5);

  inverse(s, M, y3 + 0.16, CW, 0.86, R_SM);
  s.addText("풀링(102·103)은 (나)를 고친다. (가)는 개수 상한을 걸어야 고쳐진다.", {
    x: M + 0.34, y: y3 + 0.16, w: CW - 0.68, h: 0.86, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("Phase 8 문서는 '렉을 풀링으로 해결한다' 고 썼지만, 재보니 그렇지 않았다. 이 슬라이드가 그 정정이다. 풀링만 하고 '왜 여전히 느리지' 가 나오면 곤란하다.");
}

// ================================================================ 6. 102 비유
{
  const s = slide();
  head(s, "102", "쓰레기통 대신 서랍.", "컵을 버리지 말고 씻어서 다시 쓴다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 3.0, "strong", INK], ["지금 (Instantiate / Destroy)", 4.6, "", MUTED], ["풀링", 4.07, "", INK],
  ], [
    ["만들 때", "새로 만든다", "서랍에서 꺼낸다"],
    ["다 쓰면", "버린다", "서랍에 넣는다"],
    ["비용", "22 µs + 쓰레기", "5 µs + 쓰레기 0"],
  ], null, 0.55);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["서랍에 넣기 = SetActive(false)   →  Despawn", "b"],
    ["꺼내기      = SetActive(true)    →  Spawn", "b"],
    ["오브젝트는 안 없어진다. 그냥 꺼져 있는 것이다.", "c"],
  ]);

  s.addText("씻지 않고 다시 쓰면? 몬스터가 체력 0 인 채로 나온다. 그게 오늘 두 번째 내용이다.", {
    x: M, y: y2 + 0.24, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("풀링은 노베이스가 개념적으로 가장 많이 막히는 주제다. 코드보다 비유가 먼저다. 실물 컵을 들고 설명해도 좋다.");
}

// ================================================================ 7. 102 생명주기
{
  const s = slide();
  head(s, "102", "Start 는 한 번만 돈다.", "재활용하면 오브젝트가 새로 안 생긴다 — 그래서 Start 가 안 돈다.");

  const y1 = table(s, M, 2.1, CW, [
    ["함수", 2.6, "code", INK], ["언제 도는가", 5.0, "", MUTED], ["풀링에서", 4.07, "", INK],
  ], [
    ["Awake", "오브젝트가 생길 때 한 번", "한 번만"],
    ["Start", "첫 Update 직전 한 번", "한 번만 — 문제"],
    ["OnEnable", "켜질 때마다", "매번 — 상태를 되돌리는 자리"],
    ["OnDisable", "꺼질 때마다", "매번"],
  ], null, 0.5);

  const y2 = code(s, M, y1 + 0.26, CW, [
    "protected virtual void OnEnable()",
    "{",
    "    AliveCount++;",
    ["    currentHealth = maxHealth;   // 이걸 안 하면 지난 판의 체력 0 을 갖고 나온다", "b"],
    "}",
  ]);

  s.addText("자식 4종도 base.OnEnable() 을 부른다 — 072와 같은 사고, 네 번째다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("Awake → OnEnable → Start 순서를 Debug.Log 로 찍어보게 하는 도전 과제를 넣었다. 순서를 몸으로 알면 이후 사고가 확 준다.");
}

// ================================================================ 8. 102 최다 사고
{
  const s = slide();
  head(s, "102", "SetActive(true) 를 빼면 아무것도 안 나온다.", "에러도 로그도 없다. 그래서 더 헷갈린다.");

  code(s, M, 2.05, CW, [
    "private GameObject Take(GameObject prefab, Vector3 pos, Quaternion rot)",
    "{",
    "    GameObject go = null;",
    ["    while (drawer.Count > 0 && go == null) go = drawer.Dequeue();", "c"],
    "",
    "    if (go == null) { go = Instantiate(prefab, pos, rot); Created++; }",
    "    else            { go.transform.SetPositionAndRotation(pos, rot); Reused++; }",
    "",
    ["    go.SetActive(true);   // 이 줄을 빼면 아무것도 안 나온다", "b"],
    "    return go;",
    "}",
  ], true);

  const y2 = table(s, M, 5.5, CW, [
    ["증상", 4.6, "strong", INK], ["원인", 7.07, "", MUTED],
  ], [
    ["몬스터가 아예 안 나옴", "SetActive(true) 누락"],
    ["두 번째부터 체력 0", "Start 를 OnEnable 로 안 바꿨다"],
  ], null, 0.5);
  s.addNotes("일부러 지우고 실행해 보여준다. 몬스터가 한 마리도 안 나오는데 Console 은 조용하다. 이 조합이 학생을 가장 오래 잡아둔다.");
}

// ================================================================ 9. 103 예약 Destroy
{
  const s = slide();
  head(s, "103", "Destroy(go, 2f) 는 풀링과 절대 같이 못 쓴다.", "예약해 둔 파괴가 서랍 속 물건까지 없앤다.");

  const y1 = code(s, M, 2.1, CW, [
    ["// 전 — 2초 뒤에 없애 줘", "c"],
    "Destroy(gameObject, lifeTime);",
    "",
    ["// 그 사이에 반납해서 서랍에 들어가 있으면? 서랍 속 물건이 사라진다.", "c"],
  ]);

  const y2 = code(s, M, y1 + 0.28, CW, [
    ["// 후 — 수명을 직접 센다", "c"],
    "private void OnEnable() { rb.linearVelocity = transform.up * speed; lifeLeft = lifeTime; }",
    "",
    "private void Update()",
    "{",
    "    lifeLeft -= Time.deltaTime;",
    ["    if (lifeLeft <= 0f) PoolManager.Despawn(gameObject);", "b"],
    "}",
  ]);

  s.addText("Destroy( 를 검색해 인자가 두 개인 것을 전부 찾는다. 우리 프로젝트엔 Projectile 한 곳뿐이었다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("도전 과제로 Destroy 예약을 되살려 서랍 속 총알이 사라지는 걸 직접 보게 한다. 말로만 하면 안 믿는다.");
}

// ================================================================ 10. 103 순서 문제
{
  const s = slide();
  head(s, "103", "OnEnable 이 먼저 돈다 — 방향을 꺼낼 때 같이 준다.", "Instantiate 시절의 순서가 풀링에서는 안 통한다.");

  const y1 = code(s, M, 2.1, CW, [
    ["Spawn 호출", "c"],
    "  └ SetActive(true)",
    ["      └ OnEnable 실행   ← 여기서 transform.up 을 읽는다 (아직 옛날 방향!)", "b"],
    "  return",
    ["shot.transform.up = dir   ← 너무 늦다", "b"],
  ]);

  const y2 = code(s, M, y1 + 0.26, CW, [
    ["Quaternion rot = Quaternion.FromToRotation(Vector3.up, dir);   // 064의 transform.up 과 같은 뜻", "b"],
    "GameObject shot = PoolManager.Spawn(projectilePrefab, transform.position, rot);",
  ]);

  code(s, M, y2 + 0.26, CW, [
    ["재활용해도 방향이 제대로 바뀐다 (실측)", "c"],
    "총알 1발   속도=(12.0, 0.0)     ← 오른쪽",
    "재활용     속도=(0.0, 12.0)     ← 위쪽",
  ]);
  s.addNotes("Instantiate 는 Start 가 다음 프레임에 돌아서 '만들고 나서 방향 주기' 가 통했다. 풀링은 그 자리에서 OnEnable 이 돈다. 순서가 바뀐 것이 핵심이다.");
}

// ================================================================ 11. 103 상한
{
  const s = slide();
  head(s, "103", "네 줄로 프레임이 열 배 살아난다.", "화면에 300마리 있으나 250마리 있으나 플레이어는 구분 못 한다.");

  const y1 = code(s, M, 2.1, 6.3, [
    "[SerializeField] private int maxAlive = 250;",
    "",
    "public void SpawnOne()",
    "{",
    ["    // 꽉 찼으면 안 만든다", "c"],
    ["    if (Enemy.AliveCount >= maxAlive) return;", "b"],
    "    ...",
    "}",
  ]);

  table(s, 7.4, 2.1, 5.1, [
    ["maxAlive", 2.0, "code", INK], ["느낌", 3.1, "", MUTED],
  ], [
    ["100", "후반이 심심하다"],
    ["250", "꽉 차 보이고 프레임도 산다"],
    ["500", "떨어지기 시작"],
  ], null, 0.58);

  const y3 = h3(s, M, y1 + 0.4, CW, "AliveCount 는 static — 씬을 다시 열어도 안 사라진다");
  body(s, M, y3, CW, "097에서 배운 그것이다. GameManager.Awake 에서 Enemy.ResetAliveCount() 로 되돌린다. 안 하면 다시 시작했을 때 몬스터가 한 마리도 안 나온다.", 0.5);
  s.addNotes("보스는 상한 밖이다. SpawnBoss 에 상한을 걸면 보스가 안 나온다 — 흔한 사고표에 넣었다.");
}

// ================================================================ 12. 103 결과
{
  const s = slide();
  head(s, "103", "재본 결과 — 프레임을 살리는 건 상한이다.", "같은 조건에서 세 가지 상태를 비교했다.");

  const y1 = table(s, M, 2.1, CW, [
    ["상태", 5.0, "strong", INK], ["살아 있는 몬스터", 3.4, "code", MUTED], ["평균 FPS", 3.27, "code", INK],
  ], [
    ["풀링 ✗ · 상한 ✗", "3668", "45.2"],
    ["풀링 ✓ · 상한 ✗", "2757", "13.6"],
    ["풀링 ✓ · 상한 250", "210", "442.3"],
  ], ACCENT, 0.5);

  const y2 = h3(s, M, y1 + 0.3, CW, "가운데 줄 — 풀링만 해서는 프레임이 안 살아난다");
  const y3 = table(s, M, y2, CW, [
    ["그럼 풀링이 준 것", 5.0, "strong", INK], ["", 6.67, "code", INK],
  ], [
    ["만드는 비용", "22 µs → 5 µs"],
    ["쓰레기(GC)", "4 KB → 0 KB"],
    ["재사용 비율 (12초 플레이)", "59%"],
  ], null, 0.46);

  s.addNotes("둘 다 필요하다 — 상한은 프레임을, 풀링은 비용과 쓰레기를 잡는다. 최적화는 어려운 걸 많이 하는 게 아니라 어디가 비싼지 찾는 게 일이다. 이 표가 그 예시다.");
}

// ================================================================ 13. 104 경로
{
  const s = slide();
  head(s, "104", "경로에 한글이 있으면 빌드가 실패한다.", "031회차에서 경고한 것의 대가를 치르는 날.");

  code(s, M, 2.1, CW, [
    ["✅  C:\\Users\\hong\\Unity\\WaveBreaker", "b"],
    "🚨  C:\\Users\\홍길동\\바탕화면\\유니티\\웨이브브레이커",
  ]);

  const y2 = h3(s, M, 3.35, CW, "빌드 전에 전원이 경로를 채팅에 붙여넣게 한다");
  const y3 = table(s, M, y2, CW, [
    ["옮기는 순서", 3.0, "code", MUTED], ["", 8.67, "", INK],
  ], [
    ["1", "유니티를 완전히 닫는다"],
    ["2", "폴더를 통째로 C:\\Unity\\WaveBreaker 같은 영문 경로로"],
    ["3", "Unity Hub 에서 Add 를 누르고 옮긴 폴더를 고른다"],
    ["4", "처음 여는 데 몇 분 걸린다 (정상)"],
  ], null, 0.5);

  s.addText("Assets · Packages · ProjectSettings 세 폴더는 절대 빠뜨리면 안 된다. Library 는 다시 만들어진다.", {
    x: M, y: y3 + 0.18, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Phase 8 위험 신호표에서 '가장 비싼 사고' 로 표시한 항목이다. 104회차 시작 7분을 통째로 이 점검에 쓴다.");
}

// ================================================================ 14. 104 빌드
{
  const s = slide();
  head(s, "104", "빌드 — Mono 로 두면 1분, IL2CPP 면 수십 분.", "수업에서는 Mono 를 쓴다.");

  const y1 = table(s, M, 2.1, 6.3, [
    ["Player Settings", 3.0, "strong", INK], ["", 3.3, "code", INK],
  ], [
    ["Product Name", "웨이브 브레이커"],
    ["기본 해상도", "1280 x 720"],
    ["Fullscreen Mode", "Windowed"],
    ["Resizable Window", "켬"],
    ["Scripting Backend", "Mono"],
  ], null, 0.5);

  table(s, 7.4, 2.1, 5.1, [
    ["빌드 결과 (실측)", 2.9, "code", INK], ["", 2.2, "code", MUTED],
  ], [
    ["결과", "Succeeded"],
    ["걸린 시간", "64.0초"],
    ["빌드 크기", "105 MB"],
    ["에러 / 경고", "0 / 0"],
    ["WaveBreaker.exe", "652 KB"],
  ], null, 0.5);

  const y3 = h3(s, M, y1 + 0.36, CW, "폴더를 통째로 줘야 한다 — .exe 만 보내면 안 돌아간다");
  code(s, M, y3, CW, [
    "WaveBreaker.exe          0.64 MB   ← 이걸 더블클릭한다",
    "UnityPlayer.dll         35.42 MB   ← 유니티 엔진 본체",
    "WaveBreaker_Data\\                  ← 씬 · 이미지 · 소리",
  ]);
  s.addNotes("Resizable Window 를 켤 수 있는 건 091~092에서 해상도 대응을 해뒀기 때문이다. 그 회차가 여기서 값을 한다는 걸 짚어준다.");
}

// ================================================================ 15. 104 실행 확인
{
  const s = slide();
  head(s, "104", "실행까지 확인한다. 검은 화면이면 씬 등록을 본다.", "빌드가 됐다 ≠ 게임이 된다.");

  const y1 = code(s, M, 2.1, CW, [
    ["강사가 확인한 것 (실측)", "c"],
    "프로세스 시작됨    8초 뒤 살아있음 = True",
    "메모리 = 594 MB",
    ["Player.log — 에러 없음, 물리(PhysX)·입력 초기화 정상", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["확인할 것", 5.6, "strong", INK], ["안 되면", 6.07, "", MUTED],
  ], [
    ["창 제목이 '웨이브 브레이커'", "Product Name 미변경"],
    ["타이틀 화면이 뜬다", "Build Settings 0번이 Title 인지"],
    ["창 크기를 바꿔도 UI 가 안 깨진다", "091·092 회수"],
    ["소리가 난다", "시스템 볼륨 / 장치"],
  ], null, 0.5);

  s.addText("Player.log 는 AppData\\LocalLow\\<Company>\\<Product>\\ 에 생긴다. 빌드 문제는 여기부터 본다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("빌드 화면 자체는 강사가 캡처하지 못했다 — 다른 창이 앞에 있었다. 수업에서는 학생 화면 공유로 확인한다.");
}

// ================================================================ 16. 105 백업
{
  const s = slide();
  head(s, "105", "이 과정에서 가장 중요한 20분.", "'백업했어요' 라는 대답을 믿지 않는다. 화면으로 확인한다.");

  const y1 = table(s, M, 2.0, CW, [
    ["압축할 것", 3.4, "code", INK], ["뺄 것", 3.4, "code", MUTED], ["둘 곳 (두 군데 이상)", 4.87, "", INK],
  ], [
    ["Assets\\", "Library\\  (수 GB)", "클라우드 (드라이브 · OneDrive)"],
    ["Packages\\", "Temp\\  obj\\", "USB 또는 외장 하드"],
    ["ProjectSettings\\", "Builds\\  Logs\\", "GitHub (해본 학생)"],
  ], ACCENT, 0.5);

  const y2 = h3(s, M, y1 + 0.26, CW, "한 군데만 두면 백업이 아니다");
  body(s, M, y2, CW, "의심해서가 아니라, 이게 안 되면 7개월이 날아가서다. 강사가 한 명씩 화면 공유로 파일을 눈으로 본다.", 0.46);

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("105 / 140 회차 — 75%", { x: M, y: 5.82, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("오늘 만든 건 그대로 남는다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("106회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("네트워크 협동 20회차. 안전망을 깔고 시작한다.", { x: 9.6, y: 6.34, w: 2.9, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("마지막에 반드시 하는 말: 여러분은 오늘 게임 하나를 완성했다. 다음 주부터 하는 건 여기에 얹는 것이고, 잘 안 돼도 오늘 만든 건 그대로 남는다.");
}

const out = path.join(__dirname, "21주차-분기점.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
