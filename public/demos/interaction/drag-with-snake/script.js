// ─── Spring physics engine ───
class Spring {
  constructor(target, stiffness, damping) {
    this.position = target;
    this.velocity = 0;
    this.target = target;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  update(dt) {
    const force = -this.stiffness * (this.position - this.target);
    const dampingForce = -this.damping * this.velocity;
    this.velocity += (force + dampingForce) * dt;
    this.position += this.velocity * dt;
    return this.position;
  }

  setTarget(t) {
    this.target = t;
  }
}

// ─── Configuration ───
const COLORS = [
  { bg: "#5686F5", shadow: "rgba(86,134,245,0.4)" },
  { bg: "#7B61FF", shadow: "rgba(123,97,255,0.4)" },
  { bg: "#A855F7", shadow: "rgba(168,85,247,0.4)" },
  { bg: "#EC4899", shadow: "rgba(236,72,153,0.4)" },
  { bg: "#F43F5E", shadow: "rgba(244,63,94,0.4)" },
  { bg: "#F97316", shadow: "rgba(249,115,22,0.4)" },
  { bg: "#EAB308", shadow: "rgba(234,179,8,0.4)" },
  { bg: "#22C55E", shadow: "rgba(34,197,94,0.4)" },
  { bg: "#06B6D4", shadow: "rgba(6,182,212,0.4)" },
  { bg: "#3B82F6", shadow: "rgba(59,130,246,0.4)" },
  { bg: "#8B5CF6", shadow: "rgba(139,92,246,0.4)" },
  { bg: "#D946EF", shadow: "rgba(217,70,239,0.4)" },
];

let ballCount = 8;
let baseStiffness = 120;
let baseDamping = 14;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let mouseActive = false;

const cursor = document.getElementById("cursor");
const glow = document.getElementById("glow");
const hint = document.getElementById("hint");
const linesCanvas = document.getElementById("linesCanvas");
const ctx = linesCanvas.getContext("2d");

let balls = [];

function createBalls() {
  document.querySelectorAll(".follower").forEach((el) => el.remove());
  balls = [];

  for (let i = 0; i < ballCount; i++) {
    const ratio = i / Math.max(ballCount - 1, 1);
    const size = 50 - ratio * 30;
    const stiffness = baseStiffness * (1 - ratio * 0.85);
    const damping = baseDamping * (1 - ratio * 0.6);
    const color = COLORS[i % COLORS.length];

    const el = document.createElement("div");
    el.className = "follower";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.background = color.bg;
    el.style.boxShadow = `0 0 ${20 + i * 4}px ${color.shadow}`;
    el.style.opacity = 1 - ratio * 0.35;
    el.style.zIndex = ballCount - i;
    document.body.appendChild(el);

    balls.push({
      el,
      springX: new Spring(mouseX, stiffness, damping),
      springY: new Spring(mouseY, stiffness, damping),
      x: mouseX,
      y: mouseY,
      color,
    });
  }
}

// ─── Event listeners ───
document.addEventListener("pointermove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  if (!mouseActive) {
    mouseActive = true;
    hint.classList.add("hidden");
  }

  document.getElementById("mx").textContent = Math.round(mouseX);
  document.getElementById("my").textContent = Math.round(mouseY);
});

document.addEventListener("pointerdown", () =>
  cursor.classList.add("pressing"),
);
document.addEventListener("pointerup", () =>
  cursor.classList.remove("pressing"),
);

// Stiffness slider
const stiffSlider = document.getElementById("stiffness");
const stiffVal = document.getElementById("stiffVal");
stiffSlider.addEventListener("input", () => {
  baseStiffness = Number(stiffSlider.value);
  stiffVal.textContent = baseStiffness;
  updateSpringParams();
});

// Damping slider
const dampSlider = document.getElementById("damping");
const dampVal = document.getElementById("dampVal");
dampSlider.addEventListener("input", () => {
  baseDamping = Number(dampSlider.value);
  dampVal.textContent = baseDamping;
  updateSpringParams();
});

// Count buttons
document.getElementById("countInc").addEventListener("click", () => {
  if (ballCount < 12) {
    ballCount++;
    document.getElementById("countVal").textContent = ballCount;
    document.getElementById("bc").textContent = ballCount;
    createBalls();
  }
});
document.getElementById("countDec").addEventListener("click", () => {
  if (ballCount > 2) {
    ballCount--;
    document.getElementById("countVal").textContent = ballCount;
    document.getElementById("bc").textContent = ballCount;
    createBalls();
  }
});

function updateSpringParams() {
  balls.forEach((b, i) => {
    const ratio = i / Math.max(ballCount - 1, 1);
    const stiffness = baseStiffness * (1 - ratio * 0.85);
    const damping = baseDamping * (1 - ratio * 0.6);
    b.springX.stiffness = stiffness;
    b.springX.damping = damping;
    b.springY.stiffness = stiffness;
    b.springY.damping = damping;
  });
}

// ─── Resize canvas ───
function resizeCanvas() {
  linesCanvas.width = window.innerWidth * devicePixelRatio;
  linesCanvas.height = window.innerHeight * devicePixelRatio;
  linesCanvas.style.width = window.innerWidth + "px";
  linesCanvas.style.height = window.innerHeight + "px";
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ─── Animation loop ───
let lastTime = performance.now();

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  // Update springs
  balls.forEach((b) => {
    b.springX.setTarget(mouseX);
    b.springY.setTarget(mouseY);
    b.x = b.springX.update(dt);
    b.y = b.springY.update(dt);
    b.el.style.transform = `translate(calc(${b.x}px - 50%), calc(${b.y}px - 50%))`;
  });

  // Update glow
  if (balls.length > 0) {
    const mid = balls[Math.floor(balls.length / 2)];
    glow.style.transform = `translate(calc(${mid.x}px - 50%), calc(${mid.y}px - 50%))`;
  }

  // Draw connection lines
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (balls.length > 1) {
    ctx.lineWidth = 1;
    for (let i = 0; i < balls.length - 1; i++) {
      const a = balls[i];
      const nb = balls[i + 1];
      const alpha = 0.12 - (i / balls.length) * 0.08;
      ctx.strokeStyle = `rgba(86,134,245,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animate);
}

// ─── Init ───
createBalls();
cursor.style.left = mouseX + "px";
cursor.style.top = mouseY + "px";
requestAnimationFrame(animate);
