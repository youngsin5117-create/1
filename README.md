# 🐉 중국 역사 완전정복 퀴즈

> 중학교 역사 시간을 위한 인터랙티브 중국 역사 퀴즈 앱

![Quiz Preview](https://img.shields.io/badge/문항수-120문제-gold?style=for-the-badge)
![Difficulty](https://img.shields.io/badge/대상-중학생-red?style=for-the-badge)
![Language](https://img.shields.io/badge/언어-한국어-blue?style=for-the-badge)

---

## 📚 개요

하은주부터 현대 중국까지, **총 120문항** 문제은행으로 구성된 중국 역사 퀴즈 앱입니다.  
별도 서버 없이 GitHub Pages에서 바로 실행할 수 있습니다.

---

## 🎮 기능

| 기능 | 설명 |
|------|------|
| 🎲 **랜덤 20문제** | 전체 문제에서 무작위 20문제 출제 |
| 📚 **파트별 도전** | 7개 단원 중 원하는 파트만 집중 훈련 |
| 🏆 **전체 도전** | 120문제 전부 도전 |
| 💡 **즉각 해설** | 정답/오답 후 상세 해설 표시 |
| 🔥 **연속 정답 콤보** | 3·5·7·10·15 연속 시 특별 메시지 |
| 📝 **오답 복습** | 결과 화면에서 틀린 문제 한눈에 확인 |
| ⌨️ **키보드 지원** | `1`·`2`·`3`·`4`로 선택, `Enter`로 다음 |
| 💾 **최고점 저장** | localStorage로 최고 점수 기록 |

---

## 📖 문제 구성 (총 120문항)

| 파트 | 내용 | 문항 수 |
|------|------|---------|
| 🏺 파트 1 | 고대 문명 · 하은주 · 춘추전국 | 20문항 |
| 👑 파트 2 | 진나라 · 한나라 | 20문항 |
| 🏯 파트 3 | 삼국시대 · 수나라 · 당나라 | 20문항 |
| 🧭 파트 4 | 송나라 · 원나라 · 명나라 | 20문항 |
| 🔴 파트 5 | 청나라 | 15문항 |
| 🌏 파트 6 | 근현대 중국 | 15문항 |
| 🌟 파트 7 | 인물 · 문화 · 한국사 연결 | 20문항 |

---

## 🚀 GitHub Pages 배포 방법

### 1단계: 저장소 생성
```bash
# GitHub에서 새 저장소 생성 (예: china-history-quiz)
git init
git add .
git commit -m "🐉 중국 역사 퀴즈 앱 첫 배포"
git branch -M main
git remote add origin https://github.com/[사용자명]/china-history-quiz.git
git push -u origin main
```

### 2단계: GitHub Pages 활성화
1. 저장소 → **Settings** 탭 클릭
2. 왼쪽 메뉴 **Pages** 클릭
3. **Source** → `Deploy from a branch` 선택
4. **Branch** → `main` / `/ (root)` 선택
5. **Save** 클릭
6. 약 1~2분 후 `https://[사용자명].github.io/china-history-quiz/` 접속!

---

## 📁 파일 구조

```
china-history-quiz/
├── index.html          # 메인 HTML
├── README.md           # 이 파일
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── quiz.js         # 퀴즈 게임 로직
└── data/
    └── questions.js    # 120문항 문제은행
```

---

## ✏️ 문제 추가 방법

`data/questions.js` 파일을 열어 원하는 파트에 추가:

```javascript
{
  q: "문제 내용",
  opts: ["보기1", "보기2", "보기3", "보기4"],
  a: 0,   // 정답 인덱스 (0~3)
  ex: "해설 내용"
}
```

---

## 🛠 기술 스택

- **Vanilla HTML/CSS/JS** — 프레임워크 없음, 빠른 로딩
- **Google Fonts** — Nanum Myeongjo, Noto Sans KR
- **localStorage** — 최고 점수 저장

---

## 📜 라이선스

개인·교육 목적으로 자유롭게 사용하세요. 🎓
