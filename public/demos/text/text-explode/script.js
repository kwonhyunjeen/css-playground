const WORDS = [
  "SYSTEM",
  "STATE",
  "COMPONENT",
  "MODULE",
  "BUILD",
  "SPACE",
  "TACTIC",
  "VISION",
  "STRIKE",
  "FLOW",
  "NODE",
  "CORE",
  "GRID",
  "REPO",
  "ACTION",
  "FIELD",
  "DATA",
  "RENDER",
  "PITCH",
  "LOGIC",
];

const container = document.getElementById("word-container");
let activeWords = [];

const TOTAL_WORDS = 80;
const EXPLOSION_RADIUS = 250;

function clamp(min, val, max) {
  return Math.min(Math.max(val, min), max);
}

function createWord() {
  const el = document.createElement("span");
  el.className = "word";
  el.textContent = WORDS[Math.floor(Math.random() * WORDS.length)];

  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const scale = 0.5 + Math.random() * 1.5;
  const rot = (Math.random() - 0.5) * 45;

  const fontSize = clamp(20, scale * window.innerWidth * 0.03, 80);
  el.style.fontSize = `${fontSize}px`;

  el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;
  el.style.zIndex = Math.floor(Math.random() * 10);

  el.dataset.x = x;
  el.dataset.y = y;
  el.dataset.rot = rot;
  el.dataset.vx = 0;
  el.dataset.vy = 0;
  el.dataset.vRot = 0;
  el.dataset.opacity = 1;
  el.dataset.exploding = "false";

  container.appendChild(el);
}

function initScatteredWords() {
  container.innerHTML = "";
  activeWords = [];
  for (let i = 0; i < TOTAL_WORDS; i++) {
    createWord();
  }
}

document.addEventListener("mousedown", (e) => {
  const cx = e.clientX;
  const cy = e.clientY;

  createRipple(cx, cy);

  document.querySelectorAll(".word").forEach((wordEl) => {
    if (wordEl.dataset.exploding === "true") return;

    const wx = parseFloat(wordEl.dataset.x);
    const wy = parseFloat(wordEl.dataset.y);

    const dx = wx - cx;
    const dy = wy - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < EXPLOSION_RADIUS) {
      wordEl.dataset.exploding = "true";

      // [핵심 로직] 방향 제한 (180도 부채꼴 범위 내 랜덤)

      // 1. 마우스에서 단어를 향하는 정방향 각도 계산
      let baseAngle = Math.atan2(dy, dx);

      // 2. 정방향을 기준으로 -90도 ~ +90도(총 180도) 사이의 무작위 오차 적용
      // Math.PI는 180도를 의미하므로, (Math.random() - 0.5) * Math.PI는 -90도 ~ +90도 범위가 됩니다.
      let randomAngle = baseAngle + (Math.random() - 0.5) * Math.PI;

      // 예외 처리: 단어의 중심축을 정확히 클릭해서 거리가 0이 된 경우 완전 무작위로 튕김
      if (distance === 0) {
        randomAngle = Math.random() * Math.PI * 2;
      }

      // 3. 힘(Power)은 10~50 사이의 무작위 값
      const randomPower = Math.random() * 40 + 10;

      wordEl.dataset.vx = Math.cos(randomAngle) * randomPower;
      wordEl.dataset.vy = Math.sin(randomAngle) * randomPower;
      wordEl.dataset.vRot = (Math.random() - 0.5) * 60;

      activeWords.push(wordEl);
    }
  });
});

function createRipple(x, y) {
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

function animate() {
  for (let i = activeWords.length - 1; i >= 0; i--) {
    const w = activeWords[i];

    let vx = parseFloat(w.dataset.vx);
    let vy = parseFloat(w.dataset.vy);
    let x = parseFloat(w.dataset.x);
    let y = parseFloat(w.dataset.y);
    let rot = parseFloat(w.dataset.rot);
    let vRot = parseFloat(w.dataset.vRot);
    let op = parseFloat(w.dataset.opacity);

    vx *= 0.94;
    vy += 0.8;
    vy *= 0.94;

    x += vx;
    y += vy;
    rot += vRot;
    op -= 0.025;

    if (op <= 0) {
      w.remove();
      activeWords.splice(i, 1);

      if (container.childElementCount === 0) {
        setTimeout(initScatteredWords, 500);
      }
      continue;
    }

    w.dataset.x = x;
    w.dataset.y = y;
    w.dataset.vx = vx;
    w.dataset.vy = vy;
    w.dataset.rot = rot;
    w.dataset.opacity = op;

    w.style.opacity = op;
    w.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;
  }
  requestAnimationFrame(animate);
}

initScatteredWords();
requestAnimationFrame(animate);
