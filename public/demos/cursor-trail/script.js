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

const cursor = document.getElementById("cursor");
const hint = document.getElementById("hint");
const controlsPanel = document.getElementById("controlsPanel");
const linesCanvas = document.getElementById("linesCanvas");
const ctx = linesCanvas.getContext("2d");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 3;
let mouseActive = false;

let ballCount = 10;
let baseStiffness = 30;
let baseDamping = 5;
let balls = [];

// Create snake nodes
function createBalls() {
  document.querySelectorAll(".follower").forEach((el) => el.remove());
  balls = [];

  for (let i = 0; i < ballCount; i++) {
    const ratio = i / Math.max(ballCount - 1, 1);
    const size = 36 - ratio * 28;
    const stiffness = baseStiffness * (1 - ratio * 0.7);
    const damping = baseDamping * (1 - ratio * 0.4);

    const hue = 15 + ratio * 20;
    const saturation = 80 - ratio * 30;
    const lightness = 60 - ratio * 30;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const el = document.createElement("div");
    el.className = "follower";
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.background = color;
    el.style.opacity = 1 - ratio * 0.2;
    el.style.zIndex = ballCount - i;
    document.body.appendChild(el);

    balls.push({
      el,
      springX: new Spring(mouseX, stiffness, damping),
      springY: new Spring(mouseY, stiffness, damping),
      x: mouseX,
      y: mouseY,
    });
  }
}

// Interaction
function updatePointerPosition(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  if (!mouseActive) {
    mouseActive = true;
    if (hint) hint.classList.add("hidden");
  }
}

window.addEventListener("pointermove", updatePointerPosition);
window.addEventListener("pointerdown", (e) => {
  updatePointerPosition(e);
  cursor.classList.add("pressing");
});
window.addEventListener("pointerup", () => cursor.classList.remove("pressing"));

controlsPanel.addEventListener("pointerdown", (e) => e.stopPropagation());
controlsPanel.addEventListener("pointermove", (e) => e.stopPropagation());

controlsPanel.addEventListener(
  "pointerenter",
  () => (cursor.style.opacity = "0"),
);
controlsPanel.addEventListener(
  "pointerleave",
  () => (cursor.style.opacity = "1"),
);

// Controls
document.getElementById("stiffness").addEventListener("input", (e) => {
  baseStiffness = Number(e.target.value);
  document.getElementById("stiffVal").textContent = baseStiffness;
  updateSpringParams();
});

document.getElementById("damping").addEventListener("input", (e) => {
  baseDamping = Number(e.target.value);
  document.getElementById("dampVal").textContent = baseDamping;
  updateSpringParams();
});

const countInput = document.getElementById("countVal");

document.getElementById("countInc").addEventListener("click", () => {
  if (ballCount < 30) {
    ballCount += 1;
    countInput.value = ballCount;
    createBalls();
  }
});
document.getElementById("countDec").addEventListener("click", () => {
  if (ballCount > 4) {
    ballCount -= 1;
    countInput.value = ballCount;
    createBalls();
  }
});

countInput.addEventListener("change", () => {
  const val = Math.min(30, Math.max(4, Math.round(Number(countInput.value))));
  ballCount = val;
  countInput.value = val;
  createBalls();
});

function updateSpringParams() {
  balls.forEach((b, i) => {
    const ratio = i / Math.max(ballCount - 1, 1);
    b.springX.stiffness = baseStiffness * (1 - ratio * 0.7);
    b.springX.damping = baseDamping * (1 - ratio * 0.4);
    b.springY.stiffness = baseStiffness * (1 - ratio * 0.7);
    b.springY.damping = baseDamping * (1 - ratio * 0.4);
  });
}

// Canvas sizing
function resizeCanvas() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  linesCanvas.width = w * devicePixelRatio;
  linesCanvas.height = h * devicePixelRatio;
  linesCanvas.style.width = w + "px";
  linesCanvas.style.height = h + "px";
  ctx.scale(devicePixelRatio, devicePixelRatio);

  if (!mouseActive) {
    mouseX = w / 2;
    mouseY = h / 3;
  }
}
window.addEventListener("resize", resizeCanvas);

let lastTime = performance.now();

function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  balls.forEach((b) => {
    b.springX.setTarget(mouseX);
    b.springY.setTarget(mouseY);
    b.x = b.springX.update(dt);
    b.y = b.springY.update(dt);
    b.el.style.transform = `translate(calc(${b.x}px - 50%), calc(${b.y}px - 50%))`;
  });

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (balls.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(balls[0].x, balls[0].y);

    for (let i = 1; i < balls.length; i++) {
      ctx.lineTo(balls[i].x, balls[i].y);
    }
    ctx.strokeStyle = "rgba(229, 107, 68, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

// Initialize
resizeCanvas();
createBalls();
cursor.style.left = mouseX + "px";
cursor.style.top = mouseY + "px";
requestAnimationFrame(animate);
