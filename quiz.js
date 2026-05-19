/* ═══════════════════════════════════════════
   CHINA HISTORY QUIZ — Game Logic
   ═══════════════════════════════════════════ */

// ── STATE ──
let state = {
  mode: null,          // 'random' | 'part' | 'full'
  partKey: null,
  questions: [],
  current: 0,
  correct: 0,
  wrong: 0,
  streak: 0,
  maxStreak: 0,
  wrongList: [],
  answered: false,
  startTime: 0,
  totalTime: 0,
};

// ── PARTICLES ──
(function initParticles() {
  const chars = ['龍','史','漢','唐','宋','秦','明','清','道','仁'];
  const wrap = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (28 + Math.random() * 40) + 'px';
    el.style.animationDuration = (18 + Math.random() * 22) + 's';
    el.style.animationDelay = -(Math.random() * 30) + 's';
    wrap.appendChild(el);
  }
})();

// ── INIT ──
window.addEventListener('DOMContentLoaded', () => {
  const total = Object.values(QUESTION_BANK).reduce((s, p) => s + p.questions.length, 0);
  document.getElementById('total-count').textContent = total;
  document.getElementById('stat-total').textContent = total;
  loadBestScore();
  buildPartGrid();
});

function loadBestScore() {
  const best = localStorage.getItem('china_quiz_best');
  document.getElementById('stat-best').textContent = best ? best + '%' : '—';
}

function saveBestScore(pct) {
  const prev = parseInt(localStorage.getItem('china_quiz_best') || '0');
  if (pct > prev) {
    localStorage.setItem('china_quiz_best', pct);
    document.getElementById('stat-best').textContent = pct + '%';
  }
}

// ── PART GRID ──
function buildPartGrid() {
  const grid = document.getElementById('part-grid');
  grid.innerHTML = '';
  const icons = { ancient:'🏺', qin_han:'👑', tang:'🏯', song_yuan_ming:'🧭', qing:'🔴', modern:'🌏', mixed:'🌟' };
  Object.entries(QUESTION_BANK).forEach(([key, part]) => {
    const btn = document.createElement('button');
    btn.className = 'part-btn';
    btn.innerHTML = `
      <span class="part-btn-icon">${icons[key] || '📚'}</span>
      <div class="part-btn-name">${part.label}</div>
      <div class="part-btn-count">${part.questions.length}문항</div>
    `;
    btn.style.borderColor = part.color + '44';
    btn.onclick = () => startPart(key);
    grid.appendChild(btn);
  });
}

// ── SCREEN TRANSITIONS ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── HOME ACTIONS ──
function showPartSelect() {
  document.getElementById('part-select').style.display = 'block';
  document.querySelector('.mode-cards').style.display = 'none';
}
function hidePartSelect() {
  document.getElementById('part-select').style.display = 'none';
  document.querySelector('.mode-cards').style.display = 'grid';
}

// ── SHUFFLE ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── START MODES ──
function startRandom() {
  const all = [];
  Object.entries(QUESTION_BANK).forEach(([key, part]) => {
    part.questions.forEach(q => all.push({ ...q, _part: key, _partLabel: part.label, _partColor: part.color }));
  });
  const picked = shuffle(all).slice(0, 20);
  beginQuiz(picked, '🎲 랜덤 20문제', 'random');
}

function startFull() {
  const all = [];
  Object.entries(QUESTION_BANK).forEach(([key, part]) => {
    part.questions.forEach(q => all.push({ ...q, _part: key, _partLabel: part.label, _partColor: part.color }));
  });
  beginQuiz(shuffle(all), '🏆 전체 도전', 'full');
}

function startPart(key) {
  const part = QUESTION_BANK[key];
  const qs = part.questions.map(q => ({ ...q, _part: key, _partLabel: part.label, _partColor: part.color }));
  beginQuiz(shuffle(qs), part.label, 'part');
}

function beginQuiz(questions, title, mode) {
  state = {
    mode, partKey: null,
    questions,
    current: 0,
    correct: 0, wrong: 0,
    streak: 0, maxStreak: 0,
    wrongList: [],
    answered: false,
    startTime: Date.now(),
    totalTime: 0,
  };
  document.getElementById('quiz-title-bar').textContent = title;
  document.getElementById('q-total').textContent = questions.length;
  showScreen('screen-quiz');
  renderQuestion();
}

// ── RENDER QUESTION ──
function renderQuestion() {
  const q = state.questions[state.current];
  const idx = state.current;
  const total = state.questions.length;
  state.answered = false;

  // Header
  document.getElementById('q-current').textContent = idx + 1;
  document.getElementById('progress-bar').style.width = (idx / total * 100) + '%';

  // Score
  document.getElementById('s-correct').textContent = state.correct;
  document.getElementById('s-wrong').textContent = state.wrong;
  document.getElementById('s-streak').textContent = state.streak;

  // Badge
  const badge = document.getElementById('q-dynasty-badge');
  badge.textContent = q._partLabel;
  badge.style.background = q._partColor + '22';
  badge.style.border = '1px solid ' + q._partColor + '55';
  badge.style.color = '#fff';

  // Number & Question
  document.getElementById('q-number').textContent = `Q${idx + 1}`;
  document.getElementById('q-text').textContent = q.q;

  // Options
  const optsWrap = document.getElementById('q-options');
  optsWrap.innerHTML = '';
  const labels = ['①','②','③','④'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span>${opt}`;
    btn.onclick = () => selectAnswer(i, q);
    optsWrap.appendChild(btn);
  });

  // Hide explanation & next
  document.getElementById('q-explanation').style.display = 'none';
  const btnNext = document.getElementById('btn-next');
  btnNext.style.display = 'none';
  btnNext.className = 'btn-next';

  // Animate in
  const area = document.getElementById('question-area');
  area.style.opacity = '0';
  area.style.transform = 'translateY(10px)';
  requestAnimationFrame(() => {
    area.style.transition = 'opacity .3s ease, transform .3s ease';
    area.style.opacity = '1';
    area.style.transform = 'translateY(0)';
  });
}

// ── SELECT ANSWER ──
function selectAnswer(chosen, q) {
  if (state.answered) return;
  state.answered = true;

  const btns = document.querySelectorAll('.opt-btn');
  btns.forEach(b => b.disabled = true);

  const isCorrect = chosen === q.a;

  if (isCorrect) {
    btns[chosen].classList.add('correct');
    state.correct++;
    state.streak++;
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;
    showToast('✓ 정답!', false);
    checkCombo();
  } else {
    btns[chosen].classList.add('wrong');
    btns[q.a].classList.add('correct');
    state.wrong++;
    state.streak = 0;
    btns[chosen].classList.add('shake');
    showToast('✗ 오답! 정답: ' + q.opts[q.a], true);
    state.wrongList.push({ q: q.q, a: q.opts[q.a] });
  }

  // Show explanation
  document.getElementById('ex-text').textContent = q.ex;
  document.getElementById('q-explanation').style.display = 'flex';

  // Score update
  document.getElementById('s-correct').textContent = state.correct;
  document.getElementById('s-wrong').textContent = state.wrong;
  document.getElementById('s-streak').textContent = state.streak;

  // Next button
  const btnNext = document.getElementById('btn-next');
  const isLast = state.current === state.questions.length - 1;
  btnNext.textContent = isLast ? '결과 보기 🏆' : '다음 문제 →';
  if (isLast) btnNext.classList.add('last');
  btnNext.style.display = 'block';
}

// ── NEXT QUESTION ──
function nextQuestion() {
  state.current++;
  if (state.current >= state.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ── COMBO CHECK ──
function checkCombo() {
  const pop = document.getElementById('combo-popup');
  const msgs = {
    3:  '🔥 3연속 정답!',
    5:  '⚡ 5연속! 대단해요!',
    7:  '💥 7연속!! 엄청난 실력!',
    10: '👑 10연속!!! 역사 마스터!!',
    15: '🐉 15연속!!!! 전설의 경지!',
  };
  const msg = msgs[state.streak];
  if (msg) {
    pop.textContent = msg;
    pop.classList.add('show');
    setTimeout(() => pop.classList.remove('show'), 1800);
  }
}

// ── TOAST ──
function showToast(msg, isWrong) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isWrong ? ' wrong-toast' : '') + ' show';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1600);
}

// ── RESULT ──
function showResult() {
  state.totalTime = Math.floor((Date.now() - state.startTime) / 1000);
  const total = state.questions.length;
  const pct = Math.round(state.correct / total * 100);

  saveBestScore(pct);

  // Emoji & Title
  let emoji, title, msg;
  if (pct === 100) {
    emoji = '🏆'; title = '완벽한 정답!';
    msg = '모든 문제를 맞혔어요! 중국 역사 완전 정복! 역사 천재 인증 🎉';
  } else if (pct >= 90) {
    emoji = '🌟'; title = '거의 완벽!';
    msg = '엄청난 실력이에요! 틀린 문제 딱 몇 개만 더 복습하면 완벽해져요.';
  } else if (pct >= 75) {
    emoji = '😎'; title = '훌륭해요!';
    msg = '중국 역사를 많이 알고 있네요! 조금 더 공부하면 완벽해질 거예요.';
  } else if (pct >= 60) {
    emoji = '📚'; title = '잘 하고 있어요!';
    msg = '기초는 탄탄해요! 파트별 집중 훈련으로 약점을 보완해봐요.';
  } else if (pct >= 40) {
    emoji = '🔥'; title = '도전 정신!';
    msg = '중국 역사는 어렵지만 포기하지 마세요! 강의록을 다시 읽고 도전해봐요.';
  } else {
    emoji = '💪'; title = '다시 도전!';
    msg = '아직 배울 게 많아요. 강의록을 꼼꼼히 읽고 파트별로 도전해봐요!';
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-big-score').textContent = state.correct;
  document.getElementById('result-score-denom').textContent = '/ ' + total;
  document.getElementById('result-pct').textContent = pct + '%';
  document.getElementById('result-msg').textContent = msg;

  document.getElementById('rs-correct').textContent = state.correct;
  document.getElementById('rs-wrong').textContent = state.wrong;
  document.getElementById('rs-streak').textContent = state.maxStreak;

  const t = state.totalTime;
  const tStr = t >= 60 ? Math.floor(t/60) + '분 ' + (t%60) + '초' : t + '초';
  document.getElementById('rs-time').textContent = tStr;

  // Wrong review
  const wr = document.getElementById('wrong-review');
  const wrList = document.getElementById('wr-list');
  if (state.wrongList.length > 0) {
    wr.style.display = 'block';
    wrList.innerHTML = state.wrongList.map((item, i) =>
      `<div class="wr-item">
        <div class="wr-q">${i+1}. ${item.q}</div>
        <div class="wr-a">✅ 정답: ${item.a}</div>
      </div>`
    ).join('');
  } else {
    wr.style.display = 'none';
  }

  showScreen('screen-result');
}

// ── RETRY / HOME ──
function retryQuiz() {
  if (state.mode === 'random') startRandom();
  else if (state.mode === 'full') startFull();
  else if (state.partKey) startPart(state.partKey);
  else startRandom();
}

function goHome() {
  showScreen('screen-home');
  hidePartSelect();
  document.querySelector('.mode-cards').style.display = 'grid';
}

function confirmExit() {
  if (confirm('퀴즈를 종료하고 홈으로 돌아갈까요?')) goHome();
}

// ── KEYBOARD ──
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('screen-quiz').classList.contains('active')) return;
  const keys = { '1':0, '2':1, '3':2, '4':3 };
  if (keys[e.key] !== undefined && !state.answered) {
    const btns = document.querySelectorAll('.opt-btn');
    if (btns[keys[e.key]]) btns[keys[e.key]].click();
  }
  if ((e.key === 'Enter' || e.key === ' ') && state.answered) {
    const btn = document.getElementById('btn-next');
    if (btn.style.display !== 'none') nextQuestion();
  }
});
