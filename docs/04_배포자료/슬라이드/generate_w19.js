// 19주차 안 깨지는 화면 — Mobbin 디자인 시스템 (DESIGN.md)
// Phase 7 착수. 이 덱의 주장: 기능을 하나도 안 늘리고 게임을 다르게 보이게 만든다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 7장의 "4:3 으로 바꾸는 순간"

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
pres.title = "19주차 · 안 깨지는 화면";

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
  s.addText("19주차", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("안 깨지는 화면.", { x: M, y: 2.6, w: 10, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("091–095 · Phase 7 착수 · 기능은 하나도 안 늘어난다", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["091", "Canvas · Canvas Scaler"],
    ["092", "Anchor · Pivot"],
    ["093", "TextMeshPro · 한글"],
    ["094", "체력바 · 경험치바"],
    ["095", "레벨 · 시간 · 처치 수"],
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
  s.addNotes("Phase 7 의 첫 주. 이 주차는 게임 기능을 하나도 안 늘린다. 그 사실을 첫 슬라이드에서 못 박아야 학생이 '왜 이걸 5회차나 하지?' 라고 안 묻는다.");
}

// ================================================================ 2. 왜 하는가
{
  const s = slide();
  head(s, null, "재밌다. 그런데 남한테 못 보여준다.", "Phase 6 이 끝난 시점의 화면이 어떤 상태인가.");

  const y1 = table(s, M, 2.05, CW, [
    ["", 3.2, "strong", INK], ["18주차 (090)", 4.6, "", MUTED], ["19주차 (095)", 3.87, "", INK],
  ], [
    ["체력", "글자 '체력 13/20'", "빨간 바"],
    ["경험치", "글자 '0/8'", "위쪽 파란 바"],
    ["배치", "긴 한 줄", "네 모서리"],
    ["창 크기를 바꾸면", "어긋난다", "안 어긋난다"],
  ], null, 0.58);

  const y2 = h3(s, M, y1 + 0.34, CW, "기능 추가 0개.");
  body(s, M, y2, CW, "몬스터도 무기도 보스도 그대로다. 바뀌는 건 화면뿐이다. 그런데 이 5회차를 건너뛴 학생은 26주차 발표에서 보여줄 화면이 없다.", 0.7);

  s.addNotes("첫 블록에서 Play 를 켜고 '재밌습니까' / '남한테 보여주고 싶습니까' 두 질문을 던진다. 대답이 갈리는 게 이 Phase 의 존재 이유다.");
}

// ================================================================ 3. 091 Canvas
{
  const s = slide();
  head(s, "091", "Canvas 는 어디에, Scaler 는 얼마나 크게.", "HUD 오브젝트에 붙어 있는 네 컴포넌트를 뜯는다.");

  const y1 = table(s, M, 2.15, 6.1, [
    ["Render Mode", 2.7, "strong", INK], ["", 3.4, "", MUTED],
  ], [
    ["Overlay", "화면 맨 위에 무조건 — 우리 것"],
    ["Screen Space · Camera", "카메라가 그린다"],
    ["World Space", "월드에 판때기로 (머리 위 체력바)"],
  ], null, 0.6);

  table(s, 7.2, 2.15, 5.3, [
    ["UI Scale Mode", 2.9, "strong", INK], ["", 2.4, "", MUTED],
  ], [
    ["Constant Pixel Size", "픽셀 수 고정"],
    ["Constant Physical Size", "cm 고정"],
    ["Scale With Screen Size", "비율로 — 우리 것"],
  ], null, 0.6);

  const y3 = h3(s, M, y1 + 0.4, CW, "우리 설정");
  code(s, M, y3, CW, [
    ["UI Scale Mode        Scale With Screen Size", "b"],
    "Reference Resolution 1280 x 720",
    "Screen Match Mode    Match Width Or Height",
    ["Match                0.5      // 가로·세로를 반반 참고", "b"],
  ]);
  s.addNotes("Reference Resolution 은 '이 해상도를 기준으로 만들었다' 는 선언이다. 한 번 정하면 안 바꾼다. 바꾸면 이미 배치한 UI 크기가 통째로 변한다.");
}

// ================================================================ 4. 091 실측
{
  const s = slide();
  head(s, "091", "재봤다 — 체력바가 화면에서 차지하는 폭.", "기준 폭 440. 세 해상도에서 실제로 몇 %인가.");

  const y1 = table(s, M, 2.15, CW, [
    ["설정", 4.0, "strong", INK], ["640x480", 2.55, "code", INK],
    ["1280x720 (기준)", 2.9, "code", MUTED], ["1920x1080", 2.22, "code", INK],
  ], [
    ["Constant Pixel Size", "68.8%", "34.4%", "22.9%"],
    ["Scale With · Match 0.5", "39.7%", "34.4%", "34.4%"],
  ], null, 0.6);

  const y2 = h3(s, M, y1 + 0.3, CW, "기준 해상도에서는 둘이 완전히 같다 — 34.4%.");
  body(s, M, y2, CW, "그래서 해상도를 안 바꿔보면 이 문제는 절대 안 드러난다. 개발하는 해상도에서만 멀쩡하고, 빌드해서 남한테 보낸 날 터진다.", 0.62);

  code(s, M, y2 + 0.72, CW, [
    ["scaleFactor  ( = UI 를 몇 배로 그리는가 )", "c"],
    "640x480   Constant 1.000   Match 0 0.500   Match 1 0.667   Match 0.5 0.577",
    "1920x1080 Constant 1.000                                   Match 0.5 1.500",
  ]);
  s.addNotes("Match 0 은 가로만, 1 은 세로만 본다. 0.5 는 반반. 640x480 은 4:3 이라 가로/세로 배율이 달라서 셋이 전부 다른 값이 나온다. 16:9 끼리면 셋이 같다.");
}

// ================================================================ 5. 091 발견
{
  const s = slide();
  head(s, "091", "네 설정 전부, 화면 밖으로는 안 나갔다.", "그럼 Canvas Scaler 는 뭘 고친 건가.");

  code(s, M, 2.1, CW, [
    ["640x480 에서 다섯 요소의 화면 좌표를 재본 결과", "c"],
    "",
    "[A] Constant Pixel Size            모두 화면안 = True",
    "[B] Scale With Screen Size · 0     모두 화면안 = True",
    "[C] Scale With Screen Size · 1     모두 화면안 = True",
    "[D] Scale With Screen Size · 0.5   모두 화면안 = True",
  ]);

  const y2 = h3(s, M, 4.3, CW, "Scaler 는 '크기' 만 고친다. '위치' 는 안 고친다.");
  body(s, M, y2, CW, "오늘 아무것도 안 튀어나간 이유는 Anchor 가 이미 제대로 잡혀 있어서다. 위치를 정하는 건 Anchor 다 — 그게 다음 회차다.", 0.62);

  inverse(s, M, y2 + 0.85, CW, 0.86, R_SM);
  s.addText("Anchor 는 '이 UI 가 화면의 어디에 붙어 있을지' 를 정하는 것.", {
    x: M + 0.34, y: y2 + 0.85, w: CW - 0.68, h: 0.86, valign: "middle",
    fontFace: F_SEMI, fontSize: T.h3, color: CANVAS, margin: 0, isTextBox: true });
  s.addNotes("이 슬라이드가 091 과 092 를 잇는 다리다. Scaler 만 해두고 '끝났다' 고 착각하면 다음 주에 UI 가 다 튀어나간다.");
}

// ================================================================ 6. 092 Anchor
{
  const s = slide();
  head(s, "092", "Anchor — 벽의 어디에 붙인 포스트잇인가.", "Min 과 Max 가 같으면 점, 다르면 범위(Stretch).");

  const y1 = table(s, M, 2.1, CW, [
    ["Anchor Min / Max", 4.3, "code", INK], ["뜻", 4.0, "", MUTED], ["우리 HUD", 3.37, "", INK],
  ], [
    ["(0.5,0.5) / (0.5,0.5)", "화면 정가운데 한 점 (기본값)", "CenterText"],
    ["(0,1) / (0,1)", "왼쪽 위 한 점", "LevelLabel"],
    ["(1,1) / (1,1)", "오른쪽 위 한 점", "KillLabel"],
    ["(0.5,0) / (0.5,0)", "아래 가운데 한 점", "HealthBar"],
    ["(0,1) / (1,1)", "위쪽 가로 전체 — 늘어난다", "ExpBar"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.24, CW, "Min ≠ Max 면 칸 이름이 바뀐다");
  code(s, M, y2, CW, [
    ["점 앵커      Pos X / Width      Pos Y / Height", "c"],
    ["범위 앵커    Left / Right       Top / Bottom", "b"],
    "ExpBar 는 Left 0 / Right 0  →  640x480:0~640   1280x720:0~1280   1920x1080:0~1920",
  ]);
  s.addNotes("가운데 앵커가 틀린 게 아니다. 가운데에 있어야 할 것은 가운데로 잡는 게 맞다. 틀린 건 모서리에 있어야 할 것을 가운데로 잡은 것이다.");
}

// ================================================================ 7. 092 실측 — 사고
{
  const s = slide();
  head(s, "092", "4:3 으로 바꾸는 순간 잘려나간다.", "오른쪽 위 '처치 N' 하나로 잰 값.");

  const y1 = table(s, M, 2.05, CW, [
    ["해상도", 2.7, "code", INK], ["앵커 가운데", 2.5, "code", INK],
    ["앵커 오른쪽위", 2.5, "code", MUTED], ["화면 폭", 1.3, "code", MUTED], ["", 2.67, "", INK],
  ], [
    ["1280x720 (16:9)", "1020 ~ 1260", "1020 ~ 1260", "1280", "둘 다 멀쩡"],
    ["1920x1080 (16:9)", "1530 ~ 1890", "1530 ~ 1890", "1920", "둘 다 멀쩡"],
    ["640x480 (4:3)", "539 ~ 678", "490 ~ 628", "640", "가운데만 38px 잘림"],
  ], ACCENT, 0.6);

  const y2 = h3(s, M, y1 + 0.34, CW, "16:9 끼리는 좌표까지 똑같다.");
  body(s, M, y2, CW, "1280 에서도 1920 에서도 두 방식이 한 픽셀도 안 다르다. 비율이 같으니까. 그래서 이 사고는 끝까지 안 드러나다가, 빌드해서 남한테 보낸 날 터진다.", 0.7);
  s.addNotes("이 표가 092 회차 전체의 근거다. 강사는 실제로 Game 뷰 드롭다운을 4:3 으로 바꿔 눈으로 보여준 뒤에 앵커를 고친다. 순서를 바꾸면 학생은 '그냥 누르라는 버튼' 으로 기억한다.");
}

// ================================================================ 8. 092 Pivot
{
  const s = slide();
  head(s, "092", "Pivot — 자기 몸의 어디를 잡고 있나.", "Anchor 는 바깥, Pivot 은 안쪽.");

  const y1 = table(s, M, 2.1, 6.3, [
    ["처치 9 → 처치 128", 3.0, "strong", INK], ["글자가 길어지면", 3.3, "", MUTED],
  ], [
    ["Pivot (0.5, 0.5)", "양쪽으로 벌어진다 → 오른쪽이 화면 밖"],
    ["Pivot (1, 1)", "왼쪽으로만 자란다 → 오른쪽 끝 고정"],
  ], null, 0.62);

  table(s, 7.4, 2.1, 5.1, [
    ["앵커 프리셋 클릭", 2.6, "code", INK], ["", 2.5, "", MUTED],
  ], [
    ["그냥 클릭", "앵커만. 위치는 그대로"],
    ["Alt + 클릭", "그 자리로 이동까지"],
    ["Shift + 클릭", "Pivot 도 같이"],
  ], null, 0.62);

  const y3 = h3(s, M, y1 + 0.4, CW, "처음엔 Alt + Shift 클릭을 쓰라고 한다.");
  body(s, M, y3, CW, "그냥 클릭하면 UI 가 안 움직여서 '안 먹었나?' 한다. 실제로는 먹었다 — Pos X / Pos Y 가 이상한 숫자로 바뀐 걸 보여준다. 이게 오늘 2등 사고다.", 0.66);
  s.addNotes("Pivot 이 회전의 중심이라는 것도 같이 보여준다. Pivot 을 (0,0) 으로 두고 Rotation Z 를 돌리면 한눈에 들어온다.");
}

// ================================================================ 9. 093 □
{
  const s = slide();
  head(s, "093", "□ 는 버그가 아니다. 폰트에 그 글자가 없는 것.", "기본 폰트로 한글을 그려보면 이렇게 나온다.");

  code(s, M, 2.1, CW, [
    ["검사 문자열: [ 게임 오버 처치 레벨 ]", "c"],
    "",
    ["Pretendard SDF       전부 있나 = True    없는 글자 수 = 0", "b"],
    "LiberationSans SDF   전부 있나 = False   없는 글자 수 = 8",
    ["                     없는 글자: [게임오버처치레벨]", "c"],
  ]);

  const y2 = table(s, M, 4.3, CW, [
    ["", 3.2, "strong", INK], ["레거시 Text", 4.6, "", MUTED], ["TextMeshPro", 3.87, "", INK],
  ], [
    ["원리", "픽셀 그림", "SDF (경계선까지의 거리)"],
    ["확대하면", "뭉개진다", "선명하다"],
    ["외곽선·그림자", "어렵다", "체크 한 번"],
  ], null, 0.55);

  s.addNotes("SDF 는 글자 그림 대신 경계선까지의 거리를 저장한다. 거리를 알고 있으니 아무리 키워도 경계선을 다시 계산할 수 있다. CenterText 를 56 에서 200 으로 올려 보여주면 즉시 이해된다.");
}

// ================================================================ 10. 093 Static / Dynamic
{
  const s = slide();
  head(s, "093", "한글은 11,172자다. 그래서 Dynamic 을 쓴다.", "쓴 글자만 그때그때 굽는다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 3.0, "strong", INK], ["Static", 4.3, "", MUTED], ["Dynamic", 4.37, "", INK],
  ], [
    ["언제 굽나", "미리 전부", "화면에 나올 때 그때그때"],
    ["한글이면", "11,172자를 다 구워야", "쓴 글자만 들어간다"],
    ["없는 글자", "□", "그 자리에서 만들어 넣는다"],
    ["원본 .ttf", "빌드에 없어도 된다", "빌드에 있어야 한다"],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.28, CW, "재본 값");
  code(s, M, y2, CW, [
    "LiberationSans SDF   생성 방식 = Static    담긴 글자 수 = 250",
    ["Pretendard SDF       생성 방식 = Dynamic   담긴 글자 수 = 96", "b"],
    ["아틀라스 1024x1024 · 멀티 아틀라스 켜짐 · 패딩 9 · 파일 3.0MB · fallback 0개", "c"],
  ]);

  s.addText("폰트 애셋은 강사가 만들어 배포한다. 학생이 각자 만들면 라이선스·생성 시간·설정 차이로 회차가 통째로 날아간다.", {
    x: M, y: 6.85, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("우리 게임에 실제로 나온 글자가 96자뿐이다. Static 으로 한글 전체를 구우면 수십 MB 가 된다. Pretendard 는 SIL OFL 1.1 이라 재배포가 된다 — 라이선스 얘기를 꼭 한다.");
}

// ================================================================ 11. 094 Filled
{
  const s = slide();
  head(s, "094", "바는 Image 하나에 fillAmount 뿐이다.", "Image Type 을 Filled 로 두면 일부만 그린다.");

  const y1 = table(s, M, 2.1, 6.2, [
    ["Image Type", 2.6, "strong", INK], ["", 3.6, "", MUTED],
  ], [
    ["Simple", "그냥 늘려서 그린다"],
    ["Sliced", "모서리를 안 늘린다 (버튼용)"],
    ["Tiled", "반복해서 깐다"],
    ["Filled", "일부만 그린다 — 우리 것"],
  ], null, 0.5);

  table(s, 7.3, 2.1, 5.2, [
    ["Filled 를 고르면", 2.7, "code", INK], ["", 2.5, "", MUTED],
  ], [
    ["Fill Method", "Horizontal"],
    ["Fill Origin", "Left"],
    ["Fill Amount", "0 ~ 1 — 코드로 바꾼다"],
    ["Source Image", "비면 fillAmount 가 안 먹는다"],
  ], null, 0.5);

  const y3 = h3(s, M, y1 + 0.34, CW, "바 하나는 두 겹이다");
  code(s, M, y3, CW, [
    ["HealthBar        Image (배경, 어두운 색)  + StatBar", "b"],
    "  └ Fill         Image (Filled, 빨강)     ← 이게 줄어든다",
    "  └ Label        TMP_Text  '13 / 20'",
    "",
    ["배경이 없으면 줄어든 만큼이 그냥 사라진다. 얼마나 남았는지 모른다.", "c"],
  ]);
  s.addNotes("Fill 은 사방 Stretch 로 안쪽 2px 을 준다. 그러면 부모 크기를 바꿔도 Fill 이 알아서 따라온다 — 092 회수 지점이다.");
}

// ================================================================ 12. 094 StatBar
{
  const s = slide();
  head(s, "094", "스크립트는 하나면 된다.", "체력바와 경험치바가 하는 일이 똑같기 때문이다.");

  code(s, M, 2.05, CW, [
    "public class StatBar : MonoBehaviour",
    "{",
    "    [SerializeField] private Image fill;",
    "    [SerializeField] private TMP_Text label;",
    "    [SerializeField] private string format = \"{0} / {1}\";",
    "",
    "    public void Set(int current, int max)",
    "    {",
    ["        if (fill != null) fill.fillAmount = max > 0 ? (float)current / max : 0f;", "b"],
    "        if (label != null) label.text = string.Format(format, current, max);",
    "    }",
    "}",
  ], true);

  const y2 = h3(s, M, 5.4, CW, "(float) 를 빼면 바가 안 줄어든다 — 오늘 1등 사고");
  body(s, M, y2, CW, "C# 에서 13 / 20 은 0 이다 (정수 나눗셈, 020회차). 바가 꽉 찼다가 죽는 순간 0 이 된다. max > 0 검사를 빼면 NaN 이 나와 바가 통째로 사라진다.", 0.68);
  s.addNotes("체력이든 경험치든 보스 체력이든 전부 이 하나로 된다. '현재값 / 최대값 만큼 채워라' 가 전부이기 때문이다. 똑같은 걸 두 번 쓰지 않는다 — 이게 오늘의 진짜 수업 내용이다.");
}

// ================================================================ 13. 094 겪은 버그
{
  const s = slide();
  head(s, "094", "겪은 것 — 기본 스프라이트로 만들었더니 뾰족해졌다.", "체력바 왼쪽 끝이 둥글게 늘어났다.");

  const y1 = h3(s, M, 2.1, CW, "원인");
  const y2 = body(s, M, y1, CW, "Unity 기본 UISprite 는 모서리가 둥근 그림이다. Sliced 로 쓰면 모서리를 안 늘려서 괜찮은데, Filled 는 Sliced 를 무시하고 통째로 늘린다. 둥근 모서리가 그대로 늘어나 뾰족해진 것이다.", 0.72);

  const y3 = h3(s, M, y2 + 0.2, CW, "고친 것 — 8x8 흰 사각형");
  const y4 = table(s, M, y3, CW, [
    ["항목", 3.4, "strong", INK], ["값", 4.2, "code", INK], ["왜", 5.07, "", MUTED],
  ], [
    ["크기", "8 x 8", "색만 있으면 되니 클 이유가 없다"],
    ["Texture Type", "Sprite (2D and UI)", ""],
    ["Filter Mode", "Point (no filter)", "픽셀 아트 프로젝트 규칙 (053)"],
    ["색", "흰색", "Image 의 Color 로 아무 색이나 곱한다"],
  ], null, 0.5);

  s.addText("빨강 바, 파랑 바를 그림 두 장으로 만들 필요가 없다. 흰 것 한 장이면 된다.", {
    x: M, y: y4 + 0.22, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("검증하다가 실제로 나온 문제다. 학생도 똑같이 겪을 것이므로 강의안 본문에 넣었다. Filled 가 Sliced 를 무시한다는 건 문서에도 잘 안 나온다.");
}

// ================================================================ 14. 095 세 라벨
{
  const s = slide();
  head(s, "095", "긴 한 줄을 세 모서리로 뜯는다.", "항상 같은 자리에 있으면 안 찾아도 된다.");

  const y1 = table(s, M, 2.1, CW, [
    ["", 2.7, "strong", INK], ["Anchor", 2.5, "code", INK], ["Pivot", 2.2, "code", MUTED],
    ["Pos", 2.3, "code", MUTED], ["크기", 1.4, "code", MUTED], ["", 0.57, "", INK],
  ], [
    ["LevelLabel", "왼쪽 위", "(0, 1)", "(20, -30)", "32", ""],
    ["TimeLabel", "위 가운데", "(0.5, 1)", "(0, -30)", "40", ""],
    ["KillLabel", "오른쪽 위", "(1, 1)", "(-20, -30)", "32", ""],
    ["웨이브", "— 화면에서 뺀다", "", "", "", ""],
  ], null, 0.5);

  const y2 = h3(s, M, y1 + 0.24, CW, "TimeLabel 만 40 이다");
  const y3 = body(s, M, y2, CW, "크기로 무엇이 중요한지를 말한다. 다 같은 크기면 아무것도 안 중요해진다. 웨이브 번호는 플레이어가 알 필요 없는 내부 숫자라 뺀다.", 0.5);

  code(s, M, y3 + 0.16, CW, [
    ["094 에선 (float) 를 안 써서 사고가 났는데, 여기선 정수 나눗셈이 정답이다.", "c"],
    ["timeLabel.text = $\"{total / 60:00}:{total % 60:00}\";     // 95초 → 01:35", "b"],
  ]);
  s.addNotes(":00 은 '두 자리로, 빈 자리는 0 으로' 라는 서식 지정자다. 빼면 1:35 가 되고 숫자가 흔들려 보인다.");
}

// ================================================================ 15. 095 카메라 + 실측
{
  const s = slide();
  head(s, "095", "카메라를 지금 목록으로 바꿔둔다.", "Phase 9 협동을 붙일 때 이 파일을 안 고치려고.");

  code(s, M, 2.1, 6.5, [
    "[SerializeField]",
    "private List<Transform> targets = new List<Transform>();",
    "",
    "void LateUpdate()",
    "{",
    "    if (targets.Count == 0) return;",
    ["    Vector3 center = Center();   // 원소가 1개면 068과 동작이 같다", "b"],
    "    Vector3 goal = new Vector3(center.x, center.y, -10f);",
    "    transform.position = Vector3.SmoothDamp(",
    "        transform.position, goal, ref velocity, smoothTime);",
    "}",
  ]);

  shot(s, "095_HUD_640", 7.5, 2.1, 5.0, 2.9, "640x480 (4:3) · 다섯 요소 전부 화면 안");

  const y2 = h3(s, M, 5.35, CW, "재본 값 — 지금은 목록에 한 명뿐이다");
  code(s, M, y2, CW, [
    "camera = (0.00, 0.00, -10.00)   player = (0.00, 0.00, 0.00)   거리 = 0.00",
    ["필드 이름이 target → targets 로 바뀌어 Inspector 배선이 풀린다. Targets 에 Player 를 다시 넣는다.", "c"],
  ]);
  s.addNotes("targets 를 비우고 Play 하면 카메라가 아예 안 움직인다. 일부러 보여주면 배선 사고를 한 번에 이해한다. 037 회차의 '이름을 바꾸면 Unity 가 못 찾는다' 와 같은 사고다.");
}

// ================================================================ 16. 회고
{
  const s = slide();
  head(s, null, "19주차 회고 — 기능 0개, 인상은 완전히 달라졌다.", "새로 배운 건 다섯 개뿐이다.");

  const y1 = table(s, M, 1.95, CW, [
    ["회차", 1.3, "code", MUTED], ["만든 것", 4.3, "strong", INK], ["새로 배운 것", 6.07, "", MUTED],
  ], [
    ["091", "해상도 대응", "Canvas · Canvas Scaler"],
    ["092", "안 어긋나는 배치", "Anchor · Pivot · Stretch"],
    ["093", "한글", "Font Asset · SDF · Static/Dynamic"],
    ["094", "체력바 · 경험치바", "Image.fillAmount"],
    ["095", "레벨 · 시간 · 처치 수", "List<T> 로 대상 여러 개"],
  ], null, 0.45);

  s.addText("Snapshot_P7_HUD 배포 · 바 2개 + 라벨 3개 + 목록형 카메라", {
    x: M, y: y1 + 0.16, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("다음 주 20주차", { x: M, y: 5.82, w: 5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("화면과 화면을 잇는다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("096회차 –", { x: 9.6, y: 5.98, w: 3.0, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("타이틀 · 결과 · 일시정지 · 타격감 · 사운드.", { x: 9.6, y: 6.34, w: 3.0, h: 0.6,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("097회차에 '씬을 넘기면 점수가 사라지는' 사고를 일부러 겪게 한다. 원칙 4번(불편을 먼저)의 마지막 적용 지점이라는 걸 예고에서 흘려둔다.");
}

const out = path.join(__dirname, "19주차-안깨지는화면.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
