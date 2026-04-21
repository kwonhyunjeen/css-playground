const itemRefs = Array.from(document.querySelectorAll(".record-wrapper"));
const bgRefs = Array.from(document.querySelectorAll(".record-disc"));
const fgRefs = Array.from(document.querySelectorAll(".record-label-container"));
const cursorRef = document.getElementById("cursor");

const mouse = { x: -1000, y: -1000 };
const cursorState = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  op: 0,
};

let hasMoved = false; // 첫 움직임 flag

let itemRects = [];
let itemCenters = [];

const physicsData = itemRefs.map(() => ({
  bg: { x: 0, y: 0, vx: 0, vy: 0 },
  fg: { x: 0, y: 0, vx: 0, vy: 0 },
}));

const STIFFNESS = 0.025;
const DAMPING = 0.15;

function updateCenters() {
  itemRects = itemRefs.map((el) => el.getBoundingClientRect());
  itemCenters = itemRects.map((rect) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }));
}

updateCenters();
window.addEventListener("resize", updateCenters);

document.addEventListener("mousemove", (e) => {
  if (!hasMoved) hasMoved = true;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function loop() {
  const mx = mouse.x;
  const my = mouse.y;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  const offsetX = hasMoved ? (mx - winW / 2) / (winW / 2) : 0;
  const offsetY = hasMoved ? (my - winH / 2) / (winH / 2) : 0;

  if (hasMoved) {
    cursorState.x += (mx - cursorState.x) * 0.15;
    cursorState.y += (my - cursorState.y) * 0.15;
  }

  const maxDist = Math.sqrt(winW * winW + winH * winH);
  let currentlyHovered = null;

  itemRefs.forEach((_, i) => {
    const cx = itemCenters[i].x;
    const cy = itemCenters[i].y;

    const distToMouseCenter = Math.sqrt(
      Math.pow(cx - mx, 2) + Math.pow(cy - my, 2),
    );
    const distRatio = distToMouseCenter / maxDist;
    const distanceMultiplier = 1 + distRatio * 1.5;

    const targetBgX = -offsetX * 6.0 * distanceMultiplier;
    const targetBgY = -offsetY * 6.0 * distanceMultiplier;
    const targetFgX = -offsetX * 10.0 * distanceMultiplier;
    const targetFgY = -offsetY * 10.0 * distanceMultiplier;

    const pData = physicsData[i];

    pData.bg.vx += (targetBgX - pData.bg.x) * STIFFNESS - pData.bg.vx * DAMPING;
    pData.bg.vy += (targetBgY - pData.bg.y) * STIFFNESS - pData.bg.vy * DAMPING;
    pData.bg.x += pData.bg.vx;
    pData.bg.y += pData.bg.vy;

    pData.fg.vx += (targetFgX - pData.fg.x) * STIFFNESS - pData.fg.vx * DAMPING;
    pData.fg.vy += (targetFgY - pData.fg.y) * STIFFNESS - pData.fg.vy * DAMPING;
    pData.fg.x += pData.fg.vx;
    pData.fg.y += pData.fg.vy;

    bgRefs[i].style.transform =
      `translate3d(${pData.bg.x}px, ${pData.bg.y}px, 0) rotateX(${-pData.bg.vy * 0.8}deg) rotateY(${pData.bg.vx * 0.8}deg)`;
    fgRefs[i].style.transform =
      `translate3d(${pData.fg.x}px, ${pData.fg.y}px, 40px)`;

    const actualCx = cx + pData.bg.x;
    const actualCy = cy + pData.bg.y;
    const recordRadius = itemRects[i].width / 2;
    const distToActualCenter = Math.hypot(actualCx - mx, actualCy - my);

    const spotlight = bgRefs[i].querySelector(".spotlight");
    const edge = bgRefs[i].querySelector(".edge");

    if (hasMoved && distToActualCenter <= recordRadius) {
      currentlyHovered = i;
      spotlight.style.opacity = 1;
      edge.style.opacity = 1;

      const rect = itemRects[i];
      const relX = mx - rect.left - pData.bg.x;
      const relY = my - rect.top - pData.bg.y;

      bgRefs[i].style.setProperty("--mouse-x", `${relX}px`);
      bgRefs[i].style.setProperty("--mouse-y", `${relY}px`);
    } else {
      spotlight.style.opacity = 0;
      edge.style.opacity = 0;
    }
  });

  let minDistToItem = Infinity;
  itemCenters.forEach((center) => {
    const dist = Math.sqrt(
      Math.pow(center.x - mx, 2) + Math.pow(center.y - my, 2),
    );
    if (dist < minDistToItem) minDistToItem = dist;
  });
  const distRatioCircle = Math.min(minDistToItem / 350, 1);
  let targetOp =
    hasMoved && currentlyHovered === null
      ? Math.max(0.15, 1 - Math.pow(distRatioCircle, 2.5))
      : 0;
  cursorState.op += (targetOp - cursorState.op) * 0.25;

  if (cursorRef) {
    cursorRef.style.transform = `translate3d(${cursorState.x}px, ${cursorState.y}px, 0) translate(-50%, -50%)`;
    cursorRef.style.opacity = cursorState.op;
  }

  requestAnimationFrame(loop);
}

loop();
