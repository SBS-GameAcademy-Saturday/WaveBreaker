// 00 · 강좌 소개 — Mobbin 디자인 시스템 (DESIGN.md)
// 수강생용. 강의 소개 페이지 구조(대상 → 수강 후 → 결과물 → 차별점 → 커리큘럼 → 수업 방식 → 강사 → FAQ → 준비물)를 따른다.
const pptxgen = require("pptxgenjs");

// ---------------------------------------------------------------- colors
// 나이트 모드 — 라이트 토큰을 그대로 뒤집는다 (INK↔CANVAS). 라이트로 되돌리려면 아래 주석 블록과 교체.
// const INK = "141414", INK_SOFT = "262626", MUTED = "707070", FAINT = "ADADAD";
// const CANVAS = "FFFFFF", CANVAS_SOFT = "F3F3F3", HAIRLINE_S = "F0F0F0", HAIRLINE = "E0E0E0";
const INK = "F5F5F5", INK_SOFT = "E0E0E0", MUTED = "A3A3A3", FAINT = "6B6B6B";
const CANVAS = "141414", CANVAS_SOFT = "1F1F1F", HAIRLINE_S = "2A2A2A", HAIRLINE = "383838";
const ACCENT = "3B82FF";   // 덱 전체에서 딱 한 번 — 5장 "완성 보장" (다크 배경용으로 한 단계 밝게)

// ---------------------------------------------------------------- type
const F_SEMI = "Pretendard SemiBold", F_MED = "Pretendard Medium";
const F_REG = "Pretendard", F_LIGHT = "Pretendard Light";
const F_CODE = "Consolas";

const T = { display: 44, h2: 26, h3: 19, h4: 15.5, title: 14, bodyLg: 15, body: 12, bodySm: 11, label: 9.5, caption: 9.5, code: 11.5 };

const R_SM = 0.167, R_MD = 0.25;
const pill = (h) => h / 2;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "WaveBreaker 강의";
pres.title = "게임개발 입문 · 7개월 과정 — 수강생 안내";

const W = 13.333, H = 7.5, M = 0.83, CW = W - M * 2;

// ---------------------------------------------------------------- helpers
function slide() { const s = pres.addSlide(); s.background = { color: CANVAS }; return s; }
function soft(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS_SOFT }, line: { color: CANVAS_SOFT, width: 0 } });
}
function outline(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: CANVAS }, line: { color: HAIRLINE_S, width: 1 } });
}
function inverse(s, x, y, w, h, r) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: r === undefined ? R_MD : r,
    fill: { color: INK }, line: { color: INK, width: 0 } });
}
function softPill(s, x, y, w, h, text, fillColor, textColor) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: pill(h),
    fill: { color: fillColor || CANVAS_SOFT }, line: { color: fillColor || CANVAS_SOFT, width: 0 } });
  s.addText(text, { x, y, w, h, align: "center", valign: "middle",
    fontFace: F_SEMI, fontSize: T.label, color: textColor || INK, margin: 0, isTextBox: true });
}
function rule(s, x, y, w, color) {
  s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color: color || HAIRLINE_S, width: 1 } });
}
function head(s, num, title, sub) {
  if (num) softPill(s, M, 0.6, 0.9, 0.3, num);
  s.addText(title, { x: M, y: num ? 1.0 : 0.62, w: CW, h: 0.5,
    fontFace: F_SEMI, fontSize: T.h2, color: INK, valign: "middle", margin: 0, isTextBox: true });
  if (sub) s.addText(sub, { x: M, y: num ? 1.54 : 1.16, w: CW, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
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
      s.addText(cell, { x: rx, y: ry, w: cols[i][1] - 0.1, h: RH - 0.2,
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
function h3(s, x, y, w, text, color) {
  s.addText(text, { x, y, w, h: 0.44, fontFace: F_SEMI, fontSize: T.h3, color: color || INK, margin: 0, isTextBox: true });
  return y + 0.5;
}
function body(s, x, y, w, text, h, color) {
  s.addText(text, { x, y, w, h: h || 0.9, fontFace: F_LIGHT, fontSize: T.body, color: color || MUTED,
    lineSpacingMultiple: 1.38, margin: 0, isTextBox: true });
  return y + (h || 0.9);
}
function label(s, x, y, w, text, color, align) {
  s.addText(text, { x, y, w, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: color || FAINT, margin: 0, isTextBox: true, align: align || "left" });
  return y + 0.34;
}
// 불릿 목록. items: string[]  — 항목마다 paraSpaceAfter 로 띄운다.
function bullets(s, x, y, w, h, items, color, size, face, gap) {
  const runs = items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i !== items.length - 1, paraSpaceAfter: gap || 5 } }));
  s.addText(runs, { x, y, w, h, fontFace: face || F_REG, fontSize: size || T.body, color: color || INK,
    lineSpacingMultiple: 1.25, margin: 0, isTextBox: true, valign: "top" });
  return y + h;
}
// 소프트 카드 + 라벨 + 제목 + 본문
function card(s, x, y, w, h, lbl, title, text, dark, center) {
  if (dark) inverse(s, x, y, w, h); else soft(s, x, y, w, h);
  const p = 0.32, al = center ? "center" : "left";
  if (lbl) label(s, x + p, y + p, w - p * 2, lbl, dark ? FAINT : FAINT, al);
  const th = title.length > 13 ? 0.9 : 0.5;   // 제목이 두 줄로 접힐 때 본문을 아래로
  s.addText(title, { x: x + p, y: y + p + (lbl ? 0.34 : 0), w: w - p * 2, h: th,
    fontFace: F_SEMI, fontSize: T.h3, color: dark ? CANVAS : INK, valign: "top", lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, align: al });
  if (text) s.addText(text, { x: x + p, y: y + p + (lbl ? 0.34 : 0) + th + 0.06, w: w - p * 2, h: h - p * 2 - th - 0.06 - (lbl ? 0.34 : 0),
    fontFace: F_LIGHT, fontSize: T.body, color: dark ? FAINT : MUTED, lineSpacingMultiple: 1.38,
    valign: "top", margin: 0, isTextBox: true, align: al });
}
function footer(s, text) {
  s.addText(text || "게임개발 입문 · 7개월 과정", { x: M, y: 6.95, w: CW / 2, h: 0.3,
    fontFace: F_REG, fontSize: T.caption, color: FAINT, margin: 0, isTextBox: true });
}


// 큰 숫자 + 라벨 (히어로 스탯)
function stat(s, x, y, w, num, lbl) {
  s.addText(num, { x, y, w, h: 0.62, fontFace: F_SEMI, fontSize: 30, color: INK, margin: 0, isTextBox: true });
  s.addText(lbl, { x, y: y + 0.66, w, h: 0.3, fontFace: F_REG, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true });
}
// 번호 원 + 제목 + 본문 한 줄 (FAQ, 추천 대상용)
function numRow(s, x, y, w, n, title, text, titleH) {
  s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.04, w: 0.38, h: 0.38, fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText(String(n), { x, y: y + 0.04, w: 0.38, h: 0.38, align: "center", valign: "middle",
    fontFace: F_SEMI, fontSize: T.bodySm, color: CANVAS, margin: 0, isTextBox: true });
  s.addText(title, { x: x + 0.56, y, w: w - 0.56, h: titleH || 0.44, fontFace: F_SEMI, fontSize: T.h4, color: INK, valign: "top", margin: 0, isTextBox: true });
  s.addText(text, { x: x + 0.56, y: y + (titleH || 0.44), w: w - 0.56, h: 0.6, fontFace: F_LIGHT, fontSize: T.body, color: MUTED,
    lineSpacingMultiple: 1.35, valign: "top", margin: 0, isTextBox: true });
}

// ================================================================ 1. 히어로
{
  const s = slide();
  s.addText("게임개발 입문 · 7개월 과정", { x: M, y: 1.7, w: 9, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("코딩을 몰라도 됩니다.\n7개월 뒤, 내 게임을 친구에게 보냅니다.", { x: M, y: 2.1, w: 11.6, h: 1.95,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.05, margin: 0, isTextBox: true, valign: "top" });
  s.addText("C# 첫 줄부터 시작해, Unity로 만든 협동 게임을 직접 배포하는 것까지. 만드는 법이 아니라, 끝내는 법을 배웁니다.",
    { x: M, y: 4.15, w: 11.6, h: 0.7, fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, lineSpacingMultiple: 1.35, margin: 0, isTextBox: true });

  rule(s, M, 5.15, CW, HAIRLINE);
  const cw = CW / 4;
  stat(s, M, 5.4, cw, "7개월", "28주 · 140회 · 280시간");
  stat(s, M + cw, 5.4, cw, "2시간", "평일 매일 · 비대면 실시간");
  stat(s, M + cw * 2, 5.4, cw, "0", "필요한 코딩 경험");
  stat(s, M + cw * 3, 5.4, cw, "1개", "완성해서 배포하는 게임");
  s.addNotes("첫 장은 결과물로 시작한다. '코딩을 몰라도 됩니다'가 이 반의 전제고, 끝에 남는 것이 게임 하나라는 걸 숫자로 못박는다.");
}

// ================================================================ 2. 이런 분께 추천합니다
{
  const s = slide();
  head(s, null, "이런 분께 추천합니다.", "하나라도 해당되면, 이 수업이 맞습니다.");
  const cw = (CW - 0.4) / 2, ch = 1.9, y1 = 2.1, y2 = y1 + ch + 0.3;
  const items = [
    ["게임은 만들고 싶은데, 시작을 못 한 분", "유튜브 튜토리얼을 몇 개 보다가 멈춘 경험이 있다면, 순서가 문제였던 겁니다. 이 수업은 순서를 대신 정해드립니다."],
    ["코딩을 한 번도 해본 적 없는 분", "변수가 뭔지, 왜 세미콜론을 찍는지부터 시작합니다. 아는 사람이 아니라 모르는 사람이 기준입니다."],
    ["혼자 하다가 끝을 못 본 분", "만들다 만 프로젝트가 있다면, 이번엔 다릅니다. 이 수업의 목표는 '배우기'가 아니라 '완성하기'입니다."],
    ["친구와 같이 하는 게임을 만들어보고 싶은 분", "혼자 하는 게임을 먼저 완성하고, 그 위에 2인 협동을 얹습니다. 방 코드로 친구가 들어옵니다."],
  ];
  items.forEach((it, i) => {
    const x = M + (i % 2) * (cw + 0.4), y = i < 2 ? y1 : y2;
    soft(s, x, y, cw, ch);
    numRow(s, x + 0.32, y + 0.34, cw - 0.64, i + 1, it[0], it[1]);
  });
  footer(s);
  s.addNotes("네 명 중 누구든 자기 얘기라고 느끼게. 3번(혼자 하다 포기)이 가장 많다.");
}

// ================================================================ 3. 수강 후 여러분은
{
  const s = slide();
  head(s, null, "7개월 뒤, 여러분은.", "지금과 7개월 뒤를 나란히 놓으면 이렇습니다.");
  const e = table(s, M, 2.1, CW, [
    ["지금", 5.2, "", MUTED], ["7개월 뒤", 6.47, "strong", INK],
  ], [
    ["코드를 본 적이 없다", "C#으로 게임 로직을 직접 씁니다"],
    ["유니티가 뭔지 모른다", "Unity 6로 2D 게임을 처음부터 끝까지 만듭니다"],
    ["게임은 하기만 했다", "무한 맵 · 자동 공격 · 레벨업이 있는 로그라이크를 만듭니다"],
    ["'멀티플레이'는 딴 세상 얘기다", "친구가 방 코드로 들어와 같이 하는 협동 모드를 붙입니다"],
    ["만든 걸 보여줄 데가 없다", "빌드 파일과 시연 영상이 포트폴리오가 됩니다"],
  ], null, 0.62);
  footer(s);
  s.addNotes("왼쪽은 지금 학생 상태 그대로. 오른쪽을 읽을 때 '전부 이 수업 안에서 한다'를 강조.");
}

// ================================================================ 4. 만드는 게임
{
  const s = slide();
  head(s, null, "이 게임을 만듭니다.", "7개월 동안 하나의 게임을 완성합니다. 예제 여러 개가 아니라, 진짜 게임 하나입니다.");

  const LX = M, LY = 2.15, LW = 6.4, LH = 4.3;
  inverse(s, LX, LY, LW, LH);
  label(s, LX + 0.4, LY + 0.36, 4, "최종 결과물", FAINT);
  s.addText("웨이브 브레이커", { x: LX + 0.4, y: LY + 0.7, w: LW - 0.8, h: 0.6,
    fontFace: F_SEMI, fontSize: 30, color: CANVAS, margin: 0, isTextBox: true });
  s.addText("2D 로그라이크 서바이버 · 혼자서도, 둘이서도", { x: LX + 0.4, y: LY + 1.32, w: LW - 0.8, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: FAINT, margin: 0, isTextBox: true });
  bullets(s, LX + 0.4, LY + 1.85, LW - 0.8, 2.3, [
    "끝없이 몰려오는 적을 자동 공격으로 베어냅니다",
    "경험치를 모아 레벨업, 3개 중 하나를 골라 강해집니다",
    "3분 · 6분 · 10분에 보스가 옵니다. 10분을 버티면 승리",
    "타이틀에서 [혼자 하기] / [같이 하기]를 고릅니다",
    "완성하면 빌드 파일로 친구에게 보내 함께 할 수 있습니다",
  ], CANVAS, T.body, F_REG, 9);

  const RX = M + LW + 0.4, RW = CW - LW - 0.4;
  const rows = [
    ["기술", "Unity 6 + C#", "Netcode for GameObjects · Relay"],
    ["그래픽 · 사운드", "전부 제공됩니다", "무료 CC0 에셋. 포트폴리오에 써도 됩니다"],
    ["내 것인가요?", "네, 전부 여러분 것입니다", "이름도 바꾸고, 스토어에 올려도 됩니다"],
  ];
  let ry = LY;
  const rh = (LH - 0.3 * 2) / 3;
  rows.forEach((r) => {
    soft(s, RX, ry, RW, rh);
    label(s, RX + 0.32, ry + 0.26, RW - 0.64, r[0], FAINT, "center");
    s.addText(r[1], { x: RX + 0.32, y: ry + 0.56, w: RW - 0.64, h: 0.36, fontFace: F_SEMI, fontSize: T.h4, color: INK, margin: 0, isTextBox: true, align: "center" });
    s.addText(r[2], { x: RX + 0.32, y: ry + 0.92, w: RW - 0.64, h: rh - 1.05, fontFace: F_LIGHT, fontSize: T.bodySm, color: MUTED, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true, valign: "top", align: "center" });
    ry += rh + 0.3;
  });
  footer(s);
  s.addNotes("여기서 반드시 실제 플레이 영상을 튼다. 슬라이드로 설명하지 말 것.");
}

// ================================================================ 5. 이 수업이 다른 점
{
  const s = slide();
  head(s, null, "이 수업이 다른 점 3가지.", null);
  const cw = (CW - 0.4 * 2) / 3, cy = 1.85, ch = 4.3;

  // ① 완성 보장 — 강조색 1회
  soft(s, M, cy, cw, ch);
  softPill(s, M + (cw - 1.35) / 2, cy + 0.32, 1.35, 0.3, "완성 보장", ACCENT, CANVAS);
  s.addText("21주차에 게임 하나가\n먼저 완성됩니다", { x: M + 0.32, y: cy + 0.72, w: cw - 0.64, h: 0.9,
    fontFace: F_SEMI, fontSize: T.h3, color: INK, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: "top", align: "center" });
  s.addText("멀티플레이는 그 위에 얹습니다. 그래서 어떤 경우에도 '아무것도 완성 못 함'은 일어나지 않습니다. 혼자 하는 버전이 빌드된 상태로 손에 남습니다.",
    { x: M + 0.32, y: cy + 1.68, w: cw - 0.64, h: 2.2, fontFace: F_LIGHT, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.38, margin: 0, isTextBox: true, valign: "top", align: "center" });

  card(s, M + cw + 0.4, cy, cw, ch, "순서", "C#을 먼저, 유니티는 7주차부터",
    "튜토리얼을 따라 치면 그 순간은 되는데 응용이 안 됩니다. 문법을 먼저 6주 굳히고, 7주차부터 화면에서 움직입니다. 14주차에 6주차에 짠 코드를 그대로 유니티에 옮기는 걸 직접 보게 됩니다.", false, true);
  card(s, M + (cw + 0.4) * 2, cy, cw, ch, "강사", "출시해 본 사람이 가르칩니다",
    "방치형 RPG를 출시하고, 모바일 RTS를 만들어 공모전에 냈습니다. 어디서 막히는지, 왜 포기하고 싶어지는지 최근에 겪었습니다. 그 지점마다 미리 잡아드립니다.", false, true);
  footer(s);
  s.addNotes("강조색은 덱에서 여기 한 번. '완성 보장'이 이 수업의 세일즈 포인트다.");
}

// ================================================================ 6. 커리큘럼 한눈에
{
  const s = slide();
  head(s, null, "커리큘럼 한눈에.", "1~6주는 C#, 7주차부터 유니티, 22주차부터 협동.");

  const bx = M, by = 1.95, bw = CW, bh = 0.6;
  const segs = [["1–6주", "C# 기초", 6, false], ["7–21주", "유니티 · 게임 완성", 15, true], ["22–26주", "협동 · 배포", 5, false], ["27–28주", "보강", 2, false]];
  let sx = bx;
  segs.forEach((sg, i) => {
    const w = bw * sg[2] / 28 - (i < segs.length - 1 ? 0.08 : 0);
    if (sg[3]) inverse(s, sx, by, w, bh, pill(bh)); else soft(s, sx, by, w, bh, pill(bh));
    s.addText(sg[0], { x: sx, y: by, w: w, h: bh, align: "center", valign: "middle", fontFace: F_SEMI, fontSize: T.bodySm, color: sg[3] ? CANVAS : INK, margin: 0, isTextBox: true });
    s.addText(sg[1], { x: sx, y: by + bh + 0.08, w: w, h: 0.3, align: "center", fontFace: F_REG, fontSize: T.caption, color: MUTED, margin: 0, isTextBox: true });
    sx += w + 0.08;
  });

  table(s, M, 3.0, CW, [
    ["개월", 1.1, "strong", INK], ["주차", 1.3, "", MUTED], ["배우는 것", 9.27, "", INK],
  ], [
    ["1개월", "1–4주", "C# 기초 — 변수 · 조건문 · 반복문 · 배열 · 메서드 · 디버깅"],
    ["2개월", "5–8주", "클래스 · 상속 · 인터페이스 → 유니티 첫 화면, 키보드로 캐릭터 움직이기"],
    ["3개월", "9–12주", "충돌 · 프리팹 · 코루틴 → 미니게임 ① 피하기 · ② 벽돌깨기"],
    ["4개월", "13–16주", "미니게임 ③ 생존 슈팅 → 본 게임 시작: 무한 맵 · 몬스터 · 자동 무기"],
    ["5개월", "17–20주", "경험치 · 레벨업 · 보스 → 화면 UI · 이펙트 · 사운드"],
    ["6개월", "21–24주", "최적화 → 혼자 하기 완성 & 빌드 → 협동 모드 시작"],
    ["7개월", "25–28주", "협동 완성 → 최종 빌드 · 시연 영상 · 발표회"],
  ], null, 0.44);
  footer(s);
  s.addNotes("자세한 주차별 내용은 저장소 docs/00_기획/주차별-커리큘럼표.md. 학생에게는 이 표면 충분하다.");
}

// ================================================================ 7. 배우게 될 기술
{
  const s = slide();
  head(s, null, "배우게 될 기술.", "전부 현업에서 그대로 쓰는 것들입니다.");
  const cw = (CW - 0.4 * 3) / 4, cy = 2.1, ch = 3.7;
  const items = [
    ["1–6주", "C#", "변수 · 조건문 · 반복문\n배열 · List · 메서드\n클래스 · 상속 · 인터페이스\nVisual Studio 디버깅"],
    ["7–21주", "Unity 6", "에디터 · Transform · 컴포넌트\n2D 물리 · 충돌 · 프리팹\n코루틴 · ScriptableObject\nUI · 파티클 · 사운드 · 빌드"],
    ["22–25주", "멀티플레이", "Netcode for GameObjects\n호스트 · 클라이언트 구조\n동기화 · 서버 권한\nRelay 접속 코드"],
    ["26주", "배포", "PC · WebGL 빌드\n시연 영상 · 소개글\n포트폴리오 정리"],
  ];
  items.forEach((it, i) => {
    const x = M + i * (cw + 0.4);
    soft(s, x, cy, cw, ch);
    label(s, x + 0.3, cy + 0.32, cw - 0.6, it[0], FAINT);
    s.addText(it[1], { x: x + 0.3, y: cy + 0.64, w: cw - 0.6, h: 0.5, fontFace: F_SEMI, fontSize: T.h3, color: INK, margin: 0, isTextBox: true });
    s.addText(it[2], { x: x + 0.3, y: cy + 1.25, w: cw - 0.6, h: ch - 1.5, fontFace: F_REG, fontSize: T.body, color: MUTED, lineSpacingMultiple: 1.5, margin: 0, isTextBox: true, valign: "top" });
  });
  footer(s);
}

// ================================================================ 8. 수업은 이렇게 진행됩니다
{
  const s = slide();
  head(s, null, "수업은 이렇게 진행됩니다.", "매일 같은 리듬으로 2시간. 보기만 하지 않고, 같이 칩니다.");
  const e = table(s, M, 2.1, CW, [
    ["시간", 1.7, "code", MUTED], ["무엇을", 3.2, "strong", INK], ["어떻게", 6.77, "", MUTED],
  ], [
    ["00:00–00:10", "복습 · 퀴즈", "어제 배운 걸 채팅으로 같이 답합니다"],
    ["00:10–00:45", "같이 치기", "강사가 치는 코드를 같은 속도로 따라 칩니다. 복사 붙여넣기는 없습니다"],
    ["00:45–00:55", "휴식", ""],
    ["00:55–01:35", "혼자 해보기", "빈칸이 있는 코드를 받아 직접 채웁니다. 강사가 한 명씩 돌며 봐드립니다"],
    ["01:35–01:50", "같이 보기", "한 명이 화면을 공유합니다. 안 되는 화면도 같이 고칩니다"],
    ["01:50–02:00", "오늘의 결과", "그날 만든 화면 스크린샷 한 장을 올리고 끝냅니다"],
  ], null, 0.54);
  body(s, M, e + 0.15, CW, "안 되면 안 되는 화면을 올리셔도 됩니다. 그게 가장 좋은 질문입니다.", 0.4, INK);
  footer(s);
}

// ================================================================ 9. 뒤처져도 괜찮습니다
{
  const s = slide();
  head(s, null, "뒤처져도 괜찮습니다.", "따라가지 못할까 봐 걱정된다면, 이 장을 보세요.");
  const cw = (CW - 0.4 * 2) / 3, cy = 2.1, ch = 3.5;
  card(s, M, cy, cw, ch, "01", "중간 프로젝트를 드립니다",
    "구간이 끝날 때마다 완성된 프로젝트를 나눠 드립니다. 밀렸으면 그걸 받고 다음 시간에 그냥 합류하면 됩니다. 처음부터 다시 할 필요가 없습니다.");
  card(s, M + cw + 0.4, cy, cw, ch, "02", "미션은 두 단계입니다",
    "필수 미션은 모두가 할 수 있는 난이도로 고정합니다. 빨리 끝낸 분은 도전 미션으로 자기 게임을 더 키웁니다. 속도가 달라도 각자 결과물이 남습니다.");
  card(s, M + (cw + 0.4) * 2, cy, cw, ch, "03", "2주를 비워뒀습니다",
    "28주 중 마지막 2주는 진도가 밀렸을 때를 위해 비워뒀습니다. 밀리는 건 정상이고, 그걸 감안해서 설계했습니다.");
  rule(s, M, 5.95, CW, HAIRLINE);
  body(s, M, 6.1, CW, "7개월은 깁니다. 중간에 힘든 구간이 옵니다. 그때 포기하지 않게 만드는 장치가 이 세 가지입니다.", 0.5, MUTED);
  footer(s);
}

// ================================================================ 10. 강사 소개
{
  const s = slide();
  s.addText("강사 소개", { x: M, y: 0.6, w: 4, h: 0.3, fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("만드는 법이 아니라, 끝내는 법을 가르칩니다. 서병필입니다.", { x: M, y: 0.95, w: CW, h: 0.55,
    fontFace: F_SEMI, fontSize: T.h2, color: INK, valign: "middle", margin: 0, isTextBox: true });
  s.addText("4년간 직접 출시하고 운영한 게임들, 그 경험을 교육으로 전달합니다.  ·  Unity 게임 클라이언트 프로그래머", { x: M, y: 1.52, w: CW, h: 0.36,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, valign: "middle", margin: 0, isTextBox: true });
  rule(s, M, 2.15, CW, HAIRLINE);

  const c1 = 3.3, c2 = 4.75, c3 = CW - c1 - c2 - 0.8;
  const x1 = M, x2 = M + c1 + 0.4, x3 = M + c1 + c2 + 0.8;
  const ty = 2.4;
  h3(s, x1, ty, c1, "경력");
  s.addText([
    { text: "2024 – 2026", options: { fontFace: F_SEMI, color: INK, breakLine: true } },
    { text: "㈜원웨이브게임즈 (클라이언트 프로그래머)", options: { fontFace: F_REG, color: MUTED, breakLine: true, paraSpaceAfter: 8 } },
    { text: "2022 – 2024", options: { fontFace: F_SEMI, color: INK, breakLine: true } },
    { text: "㈜슈퍼트렁크 (클라이언트 프로그래머)", options: { fontFace: F_REG, color: MUTED } },
  ], { x: x1, y: ty + 0.55, w: c1, h: 1.6, fontSize: T.body, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true, valign: "top" });

  h3(s, x2, ty, c2, "활동");
  const acts = [
    ["2025", "삼국지 : 군웅할거 (모바일 실시간 전략) — 2025 서울게임공모전 출품"],
    ["2024.12", "엘리스 키우기 (방치형 3D RPG, 국내) 출시"],
    ["2024.03", "Earths 출시"],
    ["2022.09", "Nuclear-Zero (SF 2D 러닝, 국내) 출시"],
  ];
  let ay = ty + 0.55;
  acts.forEach((a) => {
    s.addText(a[0], { x: x2, y: ay, w: 0.95, h: 0.5, fontFace: F_SEMI, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true, valign: "top" });
    s.addText(a[1], { x: x2 + 0.95, y: ay, w: c2 - 0.95, h: 0.5, fontFace: F_REG, fontSize: T.bodySm, color: MUTED, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true, valign: "top" });
    ay += 0.56;
  });
  h3(s, x2, ty + 2.95, c2, "수상 경력");
  const awards = [["2025", "삼국지 : 군웅할거 — 2025 서울게임공모전 우수상"], ["2022", "Nuclear-Zero — 게임 공모전 우수상"]];
  let wy = ty + 3.5;
  awards.forEach((a) => {
    s.addText(a[0], { x: x2, y: wy, w: 0.95, h: 0.4, fontFace: F_SEMI, fontSize: T.bodySm, color: INK, margin: 0, isTextBox: true, valign: "top" });
    s.addText(a[1], { x: x2 + 0.95, y: wy, w: c2 - 0.95, h: 0.4, fontFace: F_REG, fontSize: T.bodySm, color: MUTED, margin: 0, isTextBox: true, valign: "top" });
    wy += 0.42;
  });

  h3(s, x3, ty, c3, "기술 스택");
  const stack = [["언어", "C#, C, C++, Java"], ["툴 / 엔진", "Unity, Unreal, Visual Studio, Rider, Git, GitHub, GitLab"],
    ["분야", "전투/시스템 설계, 아웃게임 아키텍처, 멀티플레이(Dedicated Server, GameLift, gRPC), 인증/결제, 퍼포먼스 최적화, CI/CD 자동화"]];
  let sy = ty + 0.55;
  stack.forEach((k) => {
    s.addText(k[0], { x: x3, y: sy, w: c3, h: 0.28, fontFace: F_SEMI, fontSize: T.label, color: FAINT, margin: 0, isTextBox: true });
    const lines = k[1].length > 44 ? 3 : (k[1].length > 22 ? 2 : 1);
    const hh = 0.24 * lines + 0.1;
    s.addText(k[1], { x: x3, y: sy + 0.28, w: c3, h: hh, fontFace: F_REG, fontSize: T.bodySm, color: INK, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true, valign: "top" });
    sy += 0.28 + hh + 0.2;
  });
  footer(s);
  s.addNotes("2분. 비전공(국제무역)에서 시작 → 처음 만든 Nuclear-Zero → 지금의 RTS. '여러분이 앞으로 겪을 걸 최근에 겪었다'로 닫는다.");
}

// ================================================================ 11. 자주 묻는 질문
{
  const s = slide();
  head(s, null, "자주 묻는 질문.", null);
  const cw = (CW - 0.5) / 2, y0 = 1.85, gap = 1.62;
  const faqs = [
    ["코딩을 전혀 몰라도 되나요?", "네. 변수가 뭔지부터 시작합니다. 첫 6주는 C# 기초에만 씁니다."],
    ["수학을 못하는데 괜찮나요?", "사칙연산이면 됩니다. 벡터는 '방향을 숫자로 적는 법' 정도로만 배웁니다."],
    ["유니티는 언제 켜나요?", "7주차부터입니다. 그 전엔 Visual Studio로 C#만 합니다."],
    ["중간에 못 따라가면요?", "구간마다 완성된 중간 프로젝트를 드립니다. 그걸 받고 다음 시간에 합류하면 됩니다."],
    ["멀티플레이가 어렵다는데, 못 만들면요?", "21주차에 혼자 하는 버전을 먼저 완성해서 빌드합니다. 어떤 경우에도 완성작은 남습니다."],
    ["만든 게임은 제 것인가요?", "네. 그래픽·사운드가 무료 라이선스(CC0)라 포트폴리오, 스토어 등록 모두 가능합니다."],
  ];
  faqs.forEach((f, i) => {
    const x = M + (i % 2) * (cw + 0.5), y = y0 + Math.floor(i / 2) * gap;
    numRow(s, x, y, cw, "Q", f[0], f[1]);
  });
  footer(s);
}

// ================================================================ 12. 준비물
{
  const s = slide();
  head(s, null, "수강 전 준비물.", "프로그램은 미리 깔지 마세요. 첫 주에 같이 깔면서 하나씩 확인합니다.");
  const e = table(s, M, 2.1, CW, [
    ["항목", 3.0, "strong", INK], ["내용", 6.0, "", INK], ["언제", 2.67, "", MUTED],
  ], [
    ["노트북 (Windows)", "여유 디스크 30GB. 최근 5년 내 기종이면 됩니다", "1주차 전"],
    ["Visual Studio 2022", "무료 Community 버전. 1~6주차는 이것만 씁니다", "1주차, 같이 설치"],
    ["Unity Hub + Unity 6", "버전은 수업에서 정해드립니다. 다른 버전은 쓰지 않습니다", "7주차 전까지"],
    ["GitHub 계정", "수업 자료를 내려받는 데 씁니다. Git은 배우지 않아도 됩니다", "1주차"],
    ["디스코드", "공지 · 질문 · 결과물 공유. 초대 링크를 드립니다", "1주차"],
  ], null, 0.62);
  rule(s, M, e + 0.15, CW, HAIRLINE);
  body(s, M, e + 0.3, CW, "설치가 안 되는 분은 따로 시간을 잡아 끝까지 봐드립니다. 첫 주에 한 명도 남기지 않습니다.", 0.5, MUTED);
  footer(s);
}

// ================================================================ 13. 마무리
{
  const s = slide();
  s.addText("게임개발 입문 · 7개월 과정", { x: M, y: 2.2, w: 9, h: 0.32,
    fontFace: F_SEMI, fontSize: T.label, color: MUTED, margin: 0, isTextBox: true });
  s.addText("7개월 뒤에 뵙겠습니다.\n완성된 게임과 함께.", { x: M, y: 2.6, w: 11.5, h: 1.95,
    fontFace: F_SEMI, fontSize: T.display, color: INK, lineSpacingMultiple: 1.05, margin: 0, isTextBox: true, valign: "top" });
  s.addText("궁금한 점은 언제든 물어보세요. 첫 수업에서 이 게임을 직접 플레이하는 것부터 시작합니다.", { x: M, y: 4.65, w: 11.5, h: 0.4,
    fontFace: F_LIGHT, fontSize: T.bodyLg, color: MUTED, margin: 0, isTextBox: true });
  rule(s, M, 5.35, CW, HAIRLINE);
  s.addText("서병필", { x: M, y: 5.55, w: CW, h: 0.4, fontFace: F_SEMI, fontSize: T.body, color: INK, margin: 0, isTextBox: true });
}

pres.writeFile({ fileName: "00-강좌소개.pptx" }).then((f) => console.log("saved", f));
