// ─── Spring Physics ───
class Spring {
  constructor(pos, stiffness, damping) {
    this.pos = pos;
    this.vel = 0;
    this.target = pos;
    this.stiffness = stiffness;
    this.damping = damping;
  }
  update(dt) {
    const f = -this.stiffness * (this.pos - this.target);
    const d = -this.damping * this.vel;
    this.vel += (f + d) * dt;
    this.pos += this.vel * dt;
    return this.pos;
  }
  setTarget(t) {
    this.target = t;
  }
  isSettled() {
    return Math.abs(this.pos - this.target) < 0.3 && Math.abs(this.vel) < 0.3;
  }
}

// ─── Configuration ───
const GRID = 4;
const TOTAL = GRID * GRID;
const BALL_SIZE = 80;
const GAP = 24;
const CELL = BALL_SIZE + GAP;

// Base spring params — dragged ball
const BASE_STIFFNESS = 180;
const BASE_DAMPING = 18;

// How much distance reduces spring responsiveness
const DIST_STIFFNESS_FACTOR = 0.55;
const DIST_DAMPING_FACTOR = 0.35;

// 16 vivid base colors (HSL hues spread across spectrum)
const BASE_HUES = [
  150,
  220,
  270,
  330, // row 0: green, blue, purple, pink
  220,
  270,
  330,
  30, // row 1: blue, purple, pink, orange
  270,
  330,
  30,
  100, // row 2: purple, pink, orange, lime
  330,
  30,
  100,
  170, // row 3: pink, orange, lime, cyan
];

// ─── State ───
let balls = [];
let dragging = false;
let dragIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;
let mouseX = 0;
let mouseY = 0;
let hueOffset = 0;
let lastTime = performance.now();

// ─── Compute grid center positions ───
function getGridPositions() {
  const totalW = GRID * BALL_SIZE + (GRID - 1) * GAP;
  const totalH = totalW;
  const startX = (window.innerWidth - totalW) / 2;
  const startY = (window.innerHeight - totalH) / 2;
  const positions = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      positions.push({
        x: startX + c * CELL + BALL_SIZE / 2,
        y: startY + r * CELL + BALL_SIZE / 2,
        row: r,
        col: c,
      });
    }
  }
  return positions;
}

// ─── Create balls ───
function createBalls() {
  const positions = getGridPositions();

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement("div");
    el.className = "ball";
    el.dataset.index = i;

    const hue = BASE_HUES[i];
    el.style.background = `hsl(${hue}, 85%, 60%)`;
    el.style.zIndex = i;

    document.body.appendChild(el);

    balls.push({
      el,
      row: positions[i].row,
      col: positions[i].col,
      baseHue: hue,
      springX: new Spring(positions[i].x, BASE_STIFFNESS, BASE_DAMPING),
      springY: new Spring(positions[i].y, BASE_STIFFNESS, BASE_DAMPING),
      x: positions[i].x,
      y: positions[i].y,
    });

    // Position immediately
    el.style.transform = `translate(${positions[i].x - BALL_SIZE / 2}px, ${positions[i].y - BALL_SIZE / 2}px)`;
  }
}

// ─── Update spring params based on drag source ───
function updateSpringParams(sourceBall) {
  for (let i = 0; i < TOTAL; i++) {
    const b = balls[i];
    if (i === dragIndex) {
      // Dragged ball: very stiff, follows cursor tightly
      b.springX.stiffness = 600;
      b.springX.damping = 35;
      b.springY.stiffness = 600;
      b.springY.damping = 35;
    } else {
      const dist =
        Math.abs(b.row - sourceBall.row) + Math.abs(b.col - sourceBall.col);
      const stiffness = BASE_STIFFNESS / (1 + dist * DIST_STIFFNESS_FACTOR);
      const damping = BASE_DAMPING / (1 + dist * DIST_DAMPING_FACTOR);
      b.springX.stiffness = stiffness;
      b.springX.damping = damping;
      b.springY.stiffness = stiffness;
      b.springY.damping = damping;
    }
  }
}

// ─── Pointer events ───
document.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(".ball");
  if (!target) return;

  e.preventDefault();
  target.setPointerCapture(e.pointerId);

  dragIndex = parseInt(target.dataset.index);
  dragging = true;

  const b = balls[dragIndex];
  dragOffsetX = e.clientX - b.x;
  dragOffsetY = e.clientY - b.y;
  mouseX = e.clientX;
  mouseY = e.clientY;

  target.classList.add("dragging");
  updateSpringParams(b);
});

document.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  e.preventDefault();
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("pointerup", (e) => {
  if (!dragging) return;
  e.preventDefault();

  if (dragIndex >= 0) {
    balls[dragIndex].el.classList.remove("dragging");
  }

  dragging = false;
  dragIndex = -1;

  // Set all targets back to grid center
  const positions = getGridPositions();
  for (let i = 0; i < TOTAL; i++) {
    // Use bouncier spring for return
    balls[i].springX.stiffness = 120;
    balls[i].springX.damping = 10;
    balls[i].springY.stiffness = 120;
    balls[i].springY.damping = 10;
    balls[i].springX.setTarget(positions[i].x);
    balls[i].springY.setTarget(positions[i].y);
  }
});

// ─── Handle resize ───
window.addEventListener("resize", () => {
  if (!dragging) {
    const positions = getGridPositions();
    for (let i = 0; i < TOTAL; i++) {
      balls[i].springX.setTarget(positions[i].x);
      balls[i].springY.setTarget(positions[i].y);
    }
  }
});

// ─── Animation loop ───
function animate(now) {
  const rawDt = (now - lastTime) / 1000;
  const dt = Math.min(rawDt, 0.033); // cap at ~30fps min step
  lastTime = now;

  // Hue rotation
  hueOffset += dt * 40; // 40 degrees per second
  if (hueOffset >= 360) hueOffset -= 360;

  // If dragging, compute targets for all balls
  if (dragging && dragIndex >= 0) {
    const dragBall = balls[dragIndex];
    const cursorX = mouseX - dragOffsetX;
    const cursorY = mouseY - dragOffsetY;

    // The dragged ball targets the cursor directly
    dragBall.springX.setTarget(cursorX);
    dragBall.springY.setTarget(cursorY);

    // Other balls: maintain their grid offset relative to the dragged ball
    const positions = getGridPositions();
    const dragHomeX = positions[dragIndex].x;
    const dragHomeY = positions[dragIndex].y;

    for (let i = 0; i < TOTAL; i++) {
      if (i === dragIndex) continue;
      const offsetX = positions[i].x - dragHomeX;
      const offsetY = positions[i].y - dragHomeY;
      balls[i].springX.setTarget(cursorX + offsetX);
      balls[i].springY.setTarget(cursorY + offsetY);
    }
  }

  // Update springs & render
  for (let i = 0; i < TOTAL; i++) {
    const b = balls[i];
    b.x = b.springX.update(dt);
    b.y = b.springY.update(dt);

    // Apply hue rotation to color
    const hue = (b.baseHue + hueOffset) % 360;
    b.el.style.background = `hsl(${Math.round(hue)}, 85%, 60%)`;

    // Position via transform
    b.el.style.transform = `translate(${b.x - BALL_SIZE / 2}px, ${b.y - BALL_SIZE / 2}px)`;
  }

  requestAnimationFrame(animate);
}

// ─── Init ───
createBalls();
requestAnimationFrame(animate);
