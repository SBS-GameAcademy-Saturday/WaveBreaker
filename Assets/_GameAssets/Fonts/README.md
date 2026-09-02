# 폰트

| 파일 | 라이선스 | 출처 |
|---|---|---|
| `Pretendard-Regular.otf` | **SIL Open Font License 1.1** | https://github.com/orioncactus/pretendard |

**OFL 1.1은 재배포·번들·상업 이용이 가능하다.** 학생 배포본과 빌드에 포함해도 문제없다.
다만 **폰트 자체를 판매하는 것**은 금지이고, 라이선스 전문을 함께 배포하는 것이 원칙이다.
전문은 위 저장소의 `LICENSE` 를 참고한다.

> 슬라이드(`docs/04_배포자료/슬라이드/`)도 같은 Pretendard 를 쓴다. 강의 자료와 게임 화면의
> 서체가 같아지는 부수 효과가 있다.

## 왜 넣었나

TextMeshPro 기본 폰트(LiberationSans)에는 **한글 글리프가 없다.** 그대로 두면 056회차에서
`점수 0` 을 띄우는 순간 콘솔에 이 경고가 쏟아지고 글자가 빈칸으로 나온다.

```
The character with Unicode value 시 was not found in the font asset
```

그래서 Pretendard 로 TMP 폰트 에셋(`Pretendard SDF`)을 만들고 **TMP 기본 폰트로 지정**했다.

## Atlas Population Mode = Dynamic

한글은 글자가 1만 자가 넘어서 미리 다 구워둘 수 없다. **Dynamic** 으로 두면 화면에 실제로
나온 글자만 그때그때 아틀라스에 채운다.

> ⚠️ 빌드 시 주의: Dynamic 폰트는 **원본 `.otf` 가 프로젝트에 있어야** 동작한다.
> 이 파일을 지우면 빌드에서 글자가 안 나온다.
