// 26주차 링크로 보낸다 — Mobbin 디자인 시스템 (DESIGN.md)
// 마지막 Phase. 이 덱의 주장: 만드는 실력만큼 보여주는 실력이 필요하다.
const pptxgen = require("pptxgenjs");
const path = require("path");

const SHOTS = path.join(__dirname, "shots2", "final");
const img = (n) => path.join(SHOTS, n + ".png");

// ---------------------------------------------------------------- colors
const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const ACCENT = "0066FF";   // 덱 전체에서 딱 한 번만 — 8장 "링크가 나온다"

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
pres.title = "26주차 · 링크로 보낸다";

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
  s.addText("26주차 · 마지막 Phase", { x: M, y: 2.15, w: 6, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("링크로 보낸다.", { x: M, y: 2.6, w: 11, h: 1.05,
    fontFace: F_SEMI, fontSize: T.display, color: INK, margin: 0, isTextBox: true });
  s.addText("126–130 · Phase 10 · 130회차 = 정규 과정 끝", { x: M, y: 3.78, w: 10, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });

  rule(s, M, 4.6, CW, HAIRLINE);
  const items = [
    ["126", "최종 빌드"],
    ["127", "itch.io 링크"],
    ["128", "영상 · 소개글"],
    ["129", "발표 준비"],
    ["130", "발표회"],
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
  s.addNotes("이 주차는 코드를 거의 안 짠다. 126회차부터 기능 동결이고, 남은 5회는 만드는 시간이 아니라 보여주는 시간이다. 그 전환을 첫 슬라이드에서 분명히 한다.");
}

// ================================================================ 2. 126 기능 동결
{
  const s = slide();
  head(s, "126", "오늘부터 새 기능은 없다.", "'이것만 하나 더' 가 마지막 주의 1등 사고다.");

  const y1 = table(s, M, 2.15, CW, [
    ["해도 되는 것", 5.0, "strong", INK], ["하면 안 되는 것", 6.67, "", MUTED],
  ], [
    ["이미 있는 버그 고치기", "새 무기 추가"],
    ["수치 조정 · 오타 수정", "새 몬스터 · 새 씬 추가"],
    ["빌드 · 배포 · 발표 준비", "\"이것만 하나 더\""],
  ], null, 0.55);

  const y2 = h3(s, M, y1 + 0.32, CW, "발표 전날 밤에 기능을 넣다가 게임이 안 켜지면");
  const y3 = body(s, M, y2, CW, "발표할 게 없다. 매 기수 나오는 사고라서 회차 문서에 못박아 뒀다 — 126회차부터 기능 동결.", 0.5);

  s.addText("남은 5회는 만드는 시간이 아니라 보여주는 시간이다.", {
    x: M, y: y3 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("이 선언을 첫 10분에 한다. 129·130회차 사고표에도 '오늘 코드를 고치려 함 → 막는다' 가 들어가 있다. 강사가 일관되게 막아야 학생이 납득한다.");
}

// ================================================================ 3. 126 빌드 숫자
{
  const s = slide();
  head(s, "126", "빌드 리포트를 숫자로 읽는다.", "결과 · 에러 · 시간 · 크기 네 줄이면 된다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["Version = 1.0.0", "b"],
    "빌드에 들어갈 씬 4개",
    "   Title  Game  Result  Coop",
    "",
    ["결과       = Succeeded", "b"],
    ["에러       = 0   경고 = 0", "b"],
    "걸린 시간   = 49.6초",
    "크기       = 108.5 MB",
    "파일 개수   = 245개",
  ]);

  const y2 = table(s, 7.4, 2.1, 5.1, [
    ["", 1.9, "strong", INK], ["21주차", 1.6, "code", MUTED], ["26주차", 1.6, "code", INK],
  ], [
    ["씬", "3개", "4개"],
    ["크기", "105.2", "108.8 MB"],
    ["파일", "203", "245개"],
  ], null, 0.5);

  const y = Math.max(y1, y2);
  const y3 = h3(s, M, y + 0.3, CW, "협동 기능 20회차 전부가 3.6 MB 다");
  body(s, M, y3, CW, "108 MB 중 대부분은 유니티 엔진(UnityPlayer.dll 37 MB)이다. 늘어난 파일 42개는 NGO 와 Relay 라이브러리다.", 0.5);
  s.addNotes("이 비교표가 학생에게 규모 감각을 준다. exe 자체는 0.7 MB 짜리 껍데기고, 진짜 내용은 WaveBreaker_Data 안에 있다. 개인 미션 3번이 그걸 직접 열어보게 한다.");
}

// ================================================================ 4. 126 실행 확인
{
  const s = slide();
  head(s, "126", "빌드가 나온 것과 게임이 되는 것은 다르다.", "전수 확인 25분 — 이 과정에서 두 번째로 중요한 시간.");

  shot(s, "126_Build_Title", 7.4, 2.05, 5.1, 2.9, "빌드된 게임 — 실측 캡처");

  const y1 = code(s, M, 2.05, 6.3, [
    ["프로세스   살아있음 = True", "b"],
    "메모리     614 MB",
    ["창 제목    웨이브 브레이커", "b"],
    ["Player.log 38줄, 예외 0개", "b"],
    "",
    ["// 딱 하나 나오는 '에러처럼 보이는 줄'", "c"],
    ["d3d12: failed to query info", "c"],
    ["   queue interface (0x80004002)", "c"],
    ["// 에러가 아니다 — 디버그 도구 없음", "c"],
  ]);

  const y2 = h3(s, M, y1 + 0.28, CW, "로그 폴더 이름은 Player Settings 가 정한다");
  body(s, M, y2, CW, "AppData\\LocalLow\\<Company Name>\\<Product Name>\\Player.log — 우리는 Product Name 이 한글이라 폴더도 한글이다. 그래도 잘 만들어진다.", 0.5);
  s.addNotes("21주차에는 빌드 화면이 미실측이었다. 이번엔 게임 자신의 창 핸들만 찍어 실측했다. 학생 전수 확인 항목은 9개이고 [같이 하기] 가 검은 화면이 아닌지가 그중 하나다.");
}

// ================================================================ 5. 126 WebGL
{
  const s = slide();
  head(s, "126", "WebGL 은 안 한다 — 이유를 말한다.", "이 Phase 의 1등 사고가 'WebGL 로 하루 날리기' 다.");

  const y1 = code(s, M, 2.1, CW, [
    ["빌드 대상 지원 여부 (강사 환경 실측)", "c"],
    "",
    "  StandaloneWindows64 = True",
    ["  WebGL               = False      ← 모듈이 안 깔려 있다", "b"],
    "  Android             = True",
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["", 4.0, "strong", INK], ["PC 빌드", 3.6, "code", MUTED], ["WebGL", 4.07, "", INK],
  ], [
    ["모듈 설치", "이미 됨", "따로 받아야 함 (수 GB)"],
    ["빌드 시간", "49.6초", "보통 10~30분"],
    ["흔한 함정", "거의 없음", "압축 · 메모리 · 입력"],
  ], null, 0.5);

  s.addText("PC 빌드를 먼저 확정한다. 시간이 남으면 그때 도전한다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("Android 모듈은 이미 깔려 있다. 130회차 '앞으로의 길' 에서 모바일 빌드를 언급할 근거가 된다. WebGL 은 Unity Hub → 버전 → Add modules 로 나중에 받을 수 있다.");
}

// ================================================================ 6. 126 도전 — 한글 경로
{
  const s = slide();
  head(s, "126", "104회차의 경고를 다시 재봤다.", "\"경로에 한글이 있으면 빌드가 실패한다\" — 반은 맞고 반은 다르다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[빌드 출력 폴더를 \"한글 경로 테스트\" 로 잡고 빌드]", "c"],
    "",
    ["결과     = Succeeded", "b"],
    "에러     = 0   경고 = 0",
    "걸린 시간 = 11.0초",
    ["실행     = 살아있음, 604 MB, 창 제목 \"웨이브 브레이커\"", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["무엇의 경로인가", 5.0, "strong", INK], ["결과", 6.67, "", MUTED],
  ], [
    ["빌드 출력 폴더", "한글이어도 된다 — 실측"],
    ["프로젝트 폴더", "미실측. 여전히 피하는 게 안전하다"],
  ], null, 0.5);

  s.addText("둘을 구분하지 않으면 학생이 \"된다는데요?\" 하고 헷갈린다.", {
    x: M, y: y2 + 0.18, w: CW, h: 0.4, fontFace: F_MED, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
  s.addNotes("104회차는 프로젝트 경로 이야기였다. 학생이 바탕화면\\빌드 같은 한글 출력 폴더를 쓰는 건 문제가 없다. 강사 환경에서 프로젝트 경로 한글은 재보지 않았으므로 미실측이라고 그대로 말한다.");
}

// ================================================================ 7. 127 압축
{
  const s = slide();
  head(s, "127", "파일 245개를 하나로.", "폴더째가 아니라 폴더 '안' 을 압축한다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["🚨 나쁜 예 — 폴더째", "c"],
    "zip 안에",
    "  └ WaveBreaker_Final/",
    "      ├ WaveBreaker.exe",
    "",
    ["✅ 좋은 예 — 폴더 안", "c"],
    "zip 안에",
    "  ├ WaveBreaker.exe",
    "  ├ UnityPlayer.dll",
    "  └ WaveBreaker_Data/",
  ]);

  code(s, 7.4, 2.1, 5.1, [
    ["실측", "c"],
    "",
    "원본 폴더 = 108.8 MB",
    ["zip      =  41.3 MB", "b"],
    ["         62.1% 줄었다", "b"],
    "압축 시간 =   8.8초",
    "",
    ["itch.io 무료 한도", "c"],
    ["  파일 하나 1 GB", "c"],
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "두 겹이어도 게임은 돌아간다 — 친구가 exe 를 못 찾을 뿐이다");
  body(s, M, y2, CW, "이름은 WaveBreaker_v1.0.0_Windows.zip 처럼 이름 · 버전 · 플랫폼 순으로 짓는다.", 0.45);
  s.addNotes("압축률이 62%나 되는 건 dll 과 데이터 파일이 압축이 잘 먹기 때문이다. 41 MB 면 업로드가 1~2분이다. 그보다 오래 걸리면 회선 문제다.");
}

// ================================================================ 8. 127 링크 (ACCENT)
{
  const s = slide();
  head(s, "127", "오늘의 결과물은 링크 하나다.", "유니티를 안 켠다. 빌드 폴더만 있으면 된다.");

  const y1 = table(s, M, 2.1, CW, [
    ["설정", 4.0, "code", INK], ["값", 3.0, "code", MUTED], ["빼먹으면", 4.67, "", INK],
  ], [
    ["Kind of project", "Downloadable", "HTML 은 WebGL 용이다"],
    ["Pricing", "No payments", "세금 정보를 요구한다"],
    ["업로드 후 플랫폼", "☑ Windows", "🔴 다운로드 버튼이 안 나온다"],
    ["Visibility", "Restricted", "링크를 아는 사람만"],
  ], ACCENT, 0.48);

  const y2 = code(s, M, y1 + 0.3, CW, [
    ["https://<내-사용자이름>.itch.io/wave-breaker", "b"],
  ]);

  const y3 = h3(s, M, y2 + 0.22, CW, "Install instructions 에 이 줄을 꼭 넣는다");
  body(s, M, y3, CW, "\"Windows 에서 'PC 보호' 창이 뜨면 [추가 정보] → [실행]\" — 서명 없는 exe 라 경고가 뜬다. 안 적으면 친구가 겁먹고 안 한다.", 0.5);
  s.addNotes("플랫폼 체크 누락이 127회차 1등 사고다. itch.io 는 이 파일이 어느 OS 것인지 우리가 알려줘야 안다. 계정은 반드시 학생 본인 이름으로 — 나중에 이력서에 적을 주소다.");
}

// ================================================================ 9. 128 3초
{
  const s = slide();
  head(s, "128", "사람은 3초 안에 떠날지 정한다.", "만드는 실력만큼 보여주는 실력이 필요하다.");

  const y1 = table(s, M, 2.15, CW, [
    ["3초 안에 보여야 하는 것", 5.0, "strong", INK], ["우리 게임의 답", 6.67, "", MUTED],
  ], [
    ["어떤 장르인가", "위에서 보는 생존 액션"],
    ["뭘 하는 게임인가", "몰려오는 몬스터를 자동 공격으로 버틴다"],
    ["재미 포인트가 뭔가", "레벨업 카드로 세진다 · 2인 협동"],
  ], null, 0.48);

  const y2 = table(s, M, y1 + 0.24, CW, [
    ["", 4.0, "strong", INK], ["GIF", 3.6, "", MUTED], ["영상", 4.07, "", INK],
  ], [
    ["자동 재생", "된다", "눌러야 재생된다"],
    ["길이", "5~8초", "30초"],
    ["쓰는 곳", "페이지 첫인상", "발표 · 백업"],
  ], null, 0.46);

  s.addText("둘 다 만든다. GIF 는 페이지에, 영상은 발표에.", {
    x: M, y: y2 + 0.16, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("커버 이미지를 GIF 로 두는 게 itch.io 페이지에서 가장 효과가 크다. 3초 테스트에서 못 알아보면 고칠 곳은 대개 글이 아니라 그림이다.");
}

// ================================================================ 10. 128 녹화
{
  const s = slide();
  head(s, "128", "설치할 프로그램이 없다 — Win + G.", "첫 5초에 게임 화면이 안 나오면 사람들이 나간다.");

  shot(s, "128_Gameplay", 7.4, 2.05, 5.1, 2.9, "HUD 가 다 보이는 순간 — 실측 캡처");

  const y1 = table(s, M, 2.05, 6.3, [
    ["초", 0.9, "code", MUTED], ["보여줄 것", 5.4, "strong", INK],
  ], [
    ["0–5", "타이틀 화면"],
    ["5–15", "몬스터가 몰려오고 자동 공격"],
    ["15–22", "레벨업 카드 3장 → 선택"],
    ["22–30", "협동 2인 또는 결과 화면"],
  ], null, 0.5);

  const y2 = h3(s, M, Math.max(y1, 4.95) + 0.28, CW, "로딩 · 메뉴 뒤적거리기 · 마우스 헤매기는 전부 자른다");
  body(s, M, y2, CW, "Game Bar 는 '지금 앞에 있는 창' 을 찍는다. 게임 창을 클릭해 활성화한 뒤 녹화를 시작한다. Unity Recorder 는 에디터 안만 찍히므로 여기서는 안 쓴다.", 0.5);
  s.addNotes("스크린샷은 레벨·시간·처치 수·체력바가 다 보이는 순간을 고른다. 그게 다 보이면 '게임처럼' 보인다. 위 캡처가 00:14 처치 5 젬 3개 칼날 3개다.");
}

// ================================================================ 11. 128 소개글
{
  const s = slide();
  head(s, "128", "사과하지 않는다.", "만든 사람이 자기 작품을 낮추면 보는 사람은 더 낮춘다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["🚨 나쁜 예", "c"],
    "",
    "유니티로 만든 게임입니다.",
    "7개월 동안 배운 것을 활용했습니다.",
    ["부족한 점이 많지만 봐주세요.", "b"],
    "C# 과 NGO 를 사용했습니다.",
    "",
    ["// 무슨 게임인지 한 줄도 안 나왔다", "c"],
  ]);

  code(s, 7.4, 2.1, 5.1, [
    ["✅ 좋은 예", "c"],
    "",
    ["몰려오는 것들을 버텨낸다.", "b"],
    "",
    "위에서 내려다보는 생존 액션.",
    "무기는 자동으로 나갑니다.",
    "",
    "▸ 10분을 버티면 승리",
    "▸ 레벨업마다 카드 3장 중 1장",
    "▸ 친구와 2인 협동",
  ]);

  const y2 = h3(s, M, y1 + 0.3, CW, "'부족하지만' '허접하지만' '처음이라' — 다 지운다");
  body(s, M, y2, CW, "7개월 동안 오브젝트 풀링을 넣고 네트워크 동기화를 붙이고 직접 빌드해서 배포했다. 그건 부족한 게 아니다.", 0.5);
  s.addNotes("소개글에 사과가 들어가는 건 매우 흔하다. 그 자리에서 지우게 한다. 규칙 다섯 개는 첫 줄 한 문장 · 뭘 하는 게임인지 · 특징 세 줄 · 조작키 · 사과 금지.");
}

// ================================================================ 12. 129 5분 설계
{
  const s = slide();
  head(s, "129", "5분은 짧다 — 다섯 덩어리로 나눈다.", "즉흥으로 하면 게임 켜다가 끝난다.");

  const y1 = table(s, M, 2.05, CW, [
    ["", 0.9, "code", MUTED], ["시간", 1.3, "code", MUTED], ["내용", 9.47, "strong", INK],
  ], [
    ["①", "30초", "이름 + 게임 한 문장 (128의 소개글 첫 줄 그대로)"],
    ["②", "90초", "라이브 시연 — 실제로 한 판"],
    ["③", "60초", "제일 어려웠던 것 하나"],
    ["④", "45초", "제일 뿌듯한 것 하나"],
    ["⑤", "15초", "링크 + 마무리"],
  ], null, 0.44);

  const y2 = h3(s, M, y1 + 0.2, CW, "③이 발표의 본체다 — \"어려웠다\" 로 끝내지 않는다");

  code(s, M, y2 + 0.08, CW, [
    "① 무엇이 안 됐나   \"레벨업 창을 열면 상대 화면은 계속 돌았습니다\"",
    "② 왜 그랬나       \"게임이 두 개니까요\"",
    "③ 어떻게 했나     \"서버가 멈춤 값을 들고 양쪽이 그걸 보게 했습니다\"",
  ]);
  s.addNotes("어려웠던 것 후보를 회차별로 뽑아뒀다 — 101 프레임 붕괴, 102 Start 는 한 번만, 113 순간이동, 114 둘 다 움직임, 117 몬스터 두 배, 123 내 화면만 멈춤. 하나만 고르게 한다.");
}

// ================================================================ 13. 129 백업 영상
{
  const s = slide();
  head(s, "129", "발표 사고의 90%가 시연에서 난다.", "백업 영상이 없으면 발표를 못 하는 상황이 생긴다.");

  const y1 = table(s, M, 2.15, CW, [
    ["시연이 실패하는 이유", 5.0, "strong", INK], ["대비", 6.67, "", MUTED],
  ], [
    ["게임이 안 켜진다", "영상 재생"],
    ["화면 공유가 안 된다", "영상 링크를 채팅에"],
    ["협동 상대가 안 붙는다", "혼자 하기로 전환"],
    ["긴장해서 조작을 못 한다", "영상 재생"],
  ], null, 0.46);

  const y2 = code(s, M, y1 + 0.24, CW, [
    ["발표 시작 전에 이미 해둘 것", "c"],
    ["  ☑ 게임을 켜서 타이틀 화면에 두기", "b"],
    "  ☑ itch.io 페이지를 다른 탭에",
    "  ☑ 알림 끄기 (윈도우 + 메신저)",
    "  ☑ 화면 공유 미리 테스트",
  ]);

  s.addText("발표 시작하고 게임을 켜면 로딩 30초가 발표 시간의 10%다.", {
    x: M, y: y2 + 0.16, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("협동이 안 되는 학생은 혼자 하기만 시연한다. 21주차부터 'Phase 8 빌드가 제출물' 이라고 약속했고 그 약속을 지킨다. 발표가 부담스러우면 녹화 제출로 대체 — 설득하지 않는다.");
}

// ================================================================ 14. 130 원본 백업
{
  const s = slide();
  head(s, "130", "Library 를 빼면 1310배 작아진다.", "지금 다 같이 한다 — 집에 가서 하겠다고 하면 안 하게 된다.");

  const y1 = code(s, M, 2.1, 6.3, [
    ["✅ 넣는 것              ❌ 빼는 것", "c"],
    "   Assets/                 Library/",
    "   ProjectSettings/        Temp/",
    "   Packages/               Builds/  Logs/  obj/",
    "",
    ["Assets+ProjectSettings+Packages =    10.2 MB", "b"],
    ["                          → zip     2.5 MB", "b"],
    "Library                         = 3,206.7 MB",
    "Temp                            =    81.8 MB",
  ]);

  const y2 = table(s, 7.4, 2.1, 5.1, [
    ["챙겨갈 파일", 3.0, "strong", INK], ["크기", 2.1, "code", MUTED],
  ], [
    ["원본 zip", "2.5 MB"],
    ["배포본 zip", "41.3 MB"],
    ["21주차 싱글 백업", "—"],
  ], null, 0.5);

  const y3 = h3(s, M, Math.max(y1, y2) + 0.28, CW, "Library 는 유니티가 자동으로 다시 만든다");
  body(s, M, y3, CW, "빼고 압축하면 2.5 MB — 메일로도 보낼 수 있다. 다시 열 때 몇 분 걸리는 게 정상이다. Library 를 새로 만드는 중이다.", 0.5);
  s.addNotes("압축본을 반드시 다시 열어보게 한다. ProjectSettings 를 빼먹으면 안 열린다. 세 파일을 클라우드에도 올리라고 말한다 — 컴퓨터는 고장 난다.");
}

// ================================================================ 15. 130 7개월
{
  const s = slide();
  head(s, null, "7개월 전과 비교한다.", "남과 비교하지 않는다.");

  const y1 = code(s, M, 2.1, CW, [
    ["[1회차]", "c"],
    ["Console.WriteLine(\"안녕하세요\");", "b"],
  ]);

  const y2 = table(s, M, y1 + 0.3, CW, [
    ["만든 것", 8.0, "strong", INK], ["회차", 3.67, "code", MUTED],
  ], [
    ["몰려오는 몬스터를 자동으로 처치하는 생존 게임", "66–100"],
    ["오브젝트 풀링으로 프레임을 지킨 최적화", "101–105"],
    ["친구와 둘이 붙어서 하는 협동 모드", "106–125"],
    ["인터넷에 올려서 링크로 나눠줄 수 있는 게임", "126–128"],
  ], null, 0.5);

  s.addText("포트폴리오를 보는 사람은 끝까지 만들어봤는가를 본다.", {
    x: M, y: y2 + 0.2, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });
  s.addNotes("매 발표 뒤에 강사가 '○○ 님이 방금 말한 그 문제는 실제 개발에서도 똑같이 나오는 겁니다' 를 한 줄 붙인다. 이 한 줄이 '내가 한 게 진짜였구나' 를 남긴다. 매번 한다.");
}

// ================================================================ 16. 마무리
{
  const s = slide();
  head(s, null, "정규 과정 종료.", "131–140 은 버퍼다 — 필요한 사람만 쓴다.");

  const y1 = table(s, M, 1.95, CW, [
    ["Phase", 1.5, "code", MUTED], ["회차", 1.6, "code", MUTED], ["무엇을 했나", 8.57, "strong", INK],
  ], [
    ["0–4", "001–065", "C# · 유니티 입문 · 2D 핵심 · 미니게임 3종"],
    ["5–7", "066–100", "코어 루프 · 레벨업 · 데이터 분리 · UI · 연출"],
    ["8–9", "101–125", "풀링 · 빌드 · 네트워크 협동"],
    ["10", "126–130", "배포 · 발표"],
  ], null, 0.5);

  s.addText("130 / 140 회차 — 정규 과정 100%.", {
    x: M, y: y1 + 0.16, w: CW, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true });

  inverse(s, 0, 5.4, W, H - 5.4, R_MD);
  s.addText("1회차에 한 약속", { x: M, y: 5.82, w: 6.5, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
  s.addText("오늘 그 링크를 보내셨습니다.", { x: M, y: 6.22, w: 8.5, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("앞으로", { x: 9.9, y: 5.98, w: 2.7, h: 0.32,
    fontFace: F_MED, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("하나를 깊게.", { x: 9.9, y: 6.34, w: 2.6, h: 0.7,
    fontFace: F_LIGHT, fontSize: T.body, color: FAINT, lineSpacingMultiple: 1.4, margin: 0, isTextBox: true });
  s.addNotes("'7개월 뒤에 여러분 게임을 친구한테 링크로 보낼 겁니다' 를 1회차에 말했다. 그 문장을 여기서 회수한다. 앞으로의 길은 하나를 깊게 — 새 프로젝트를 벌이지 않는다.");
}

const out = path.join(__dirname, "26주차-링크로보낸다.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("생성 완료:", out));
