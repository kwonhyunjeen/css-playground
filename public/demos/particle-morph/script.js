const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const NUM_PARTICLES = 1500;
const particles = [];
const colors = ["#2b7fff", "#ffffff", "#8ec5ff", "#1c398e"];
for (let i = 0; i < NUM_PARTICLES; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: 0,
    vy: 0,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 2.5 + 1,
  });
}

// Mouse coordinate
let mouse = { x: -1000, y: -1000 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

let scrollProgress = 0;
let targetScroll = 0;

window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  targetScroll = Math.max(0, Math.min(1, window.scrollY / maxScroll));
});

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getTargetPosition(i, state, time) {
  let tx, ty;

  if (state < 0.33) {
    // Fist
    const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
    const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;
    const radius = Math.min(w, h) * 0.35;
    tx =
      w / 2 +
      radius * Math.cos(theta) * Math.sin(phi) +
      Math.sin(time * 0.001 + i) * 15;
    ty =
      h / 2 +
      radius * Math.sin(theta) * Math.sin(phi) +
      Math.cos(time * 0.002 + i) * 15;
  } else if (state < 0.66) {
    // Second
    const spacing = (w * 0.8) / NUM_PARTICLES;
    tx = w * 0.1 + i * spacing;
    ty =
      h / 2 +
      Math.sin(i * 0.02 + time * 0.003) * 150 +
      Math.cos(i * 0.05 - time * 0.001) * 80;
  } else {
    // Third
    const cols = Math.floor(Math.sqrt(NUM_PARTICLES * (w / h)));
    const rows = Math.ceil(NUM_PARTICLES / cols);
    const spacingX = (w * 0.6) / cols;
    const spacingY = (h * 0.6) / rows;
    const col = i % cols;
    const row = Math.floor(i / cols);
    tx = w / 2 - ((cols - 1) * spacingX) / 2 + col * spacingX;
    ty = h / 2 - ((rows - 1) * spacingY) / 2 + row * spacingY;
  }
  return { x: tx, y: ty };
}

function animate(time) {
  // 스크롤 부드럽게
  scrollProgress = lerp(scrollProgress, targetScroll, 0.05);

  // 잔상 효과
  ctx.fillStyle = "rgba(11, 17, 13, 0.25)";
  ctx.fillRect(0, 0, w, h);

  particles.forEach((p, i) => {
    const target = getTargetPosition(i, scrollProgress, time);

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let repelX = 0;
    let repelY = 0;

    // 마우스가 반경 120px 이내로 들어오면 강하게 밀어냄
    if (dist < 120) {
      const force = (120 - dist) / 120;
      repelX = -(dx / dist) * force * 35;
      repelY = -(dy / dist) * force * 35;
    }

    // 스프링 탄성
    const springDx = target.x - p.x;
    const springDy = target.y - p.y;

    // 가속도
    p.vx += springDx * 0.015;
    p.vy += springDy * 0.015;

    // 마우스 반발력
    p.vx += repelX;
    p.vy += repelY;

    // 마찰력
    p.vx *= 0.88;
    p.vy *= 0.88;

    p.x += p.vx;
    p.y += p.vy;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
