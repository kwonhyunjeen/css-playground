const folder = document.getElementById("folder");
const overlay = document.getElementById("overlay");
const items = Array.from(document.querySelectorAll(".folder span"));

function updateDeviceScale() {
  const paddingV = 80;
  const paddingH = 32;
  const scaleH = (window.innerHeight - paddingV) / 812;
  const scaleW = (window.innerWidth - paddingH) / 375;
  const scale = Math.min(scaleH, scaleW, 1);
  document.documentElement.style.setProperty(
    "--device-scale",
    scale.toFixed(4),
  );
}
updateDeviceScale();
window.addEventListener("resize", updateDeviceScale);

function updateCSSPosition(item, pos) {
  const x = (pos % 3) - 1;
  const y = Math.floor(pos / 3) - 1;
  item.style.setProperty("--x", x);
  item.style.setProperty("--y", y);
  item.style.setProperty("--i", pos);
}

items.forEach((item, index) => {
  item.dataset.pos = index;
  updateCSSPosition(item, index);
});

folder.addEventListener("click", () => {
  if (!folder.classList.contains("active")) {
    folder.classList.add("active");
    overlay.classList.add("active");
  }
});

overlay.addEventListener("click", () => {
  folder.classList.remove("active");
  overlay.classList.remove("active");
});

// 드래그 앤 드롭 및 Shift 로직
let draggingItem = null;
let startX = 0,
  startY = 0;
let initialX = 0,
  initialY = 0;
let currentPos = -1;

items.forEach((item) => {
  item.addEventListener("pointerdown", (e) => {
    // 폴더가 열려있을 때만 드래그 허용
    if (!folder.classList.contains("active")) return;
    e.stopPropagation();

    draggingItem = item;
    currentPos = parseInt(item.dataset.pos);

    // 드래그 시작 시점의 마우스 위치와 초기 매트릭스 위치 기록
    startX = e.clientX;
    startY = e.clientY;
    initialX = (currentPos % 3) - 1;
    initialY = Math.floor(currentPos / 3) - 1;

    item.classList.add("dragging");
    item.setPointerCapture(e.pointerId); // 마우스가 아이콘을 벗어나도 이벤트를 추적
  });
});

document.addEventListener("pointermove", (e) => {
  if (!draggingItem) return;

  // 마우스 이동 거리 계산
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  // 인라인 스타일로 실시간 위치 적용 (초기 위치 기준)
  draggingItem.style.transform = `translate(calc(90px * ${initialX} + ${dx}px), calc(90px * ${initialY} + ${dy}px)) scale(1.15)`;

  // 폴더 기준 마우스의 상대 좌표로 타겟 그리드 구역 판별
  const folderRect = folder.getBoundingClientRect();
  const relativeX = e.clientX - folderRect.left;
  const relativeY = e.clientY - folderRect.top;

  // 폴더 중앙(Width/2)을 기준으로 열(Col), 행(Row) 계산
  let col = Math.round((relativeX - folderRect.width / 2) / 90) + 1;
  let row = Math.round((relativeY - folderRect.height / 2) / 90) + 1;

  // 3x3 그리드 바깥으로 나가지 않도록 고정
  col = Math.max(0, Math.min(2, col));
  row = Math.max(0, Math.min(2, row));

  const targetPos = row * 3 + col;

  // 다른 아이콘 영역을 침범했다면 밀어내기(Shift) 실행
  if (targetPos !== currentPos) {
    shiftItems(currentPos, targetPos);
    currentPos = targetPos;
  }
});

document.addEventListener("pointerup", (e) => {
  if (!draggingItem) return;

  // 드래그 종료
  draggingItem.classList.remove("dragging");
  draggingItem.style.transform = "";
  draggingItem.releasePointerCapture(e.pointerId);
  draggingItem = null;
});

// Shift 함수: 아이콘 위치 변경
function shiftItems(fromPos, toPos) {
  items.forEach((item) => {
    if (item === draggingItem) return;

    let pos = parseInt(item.dataset.pos);

    // 타겟 위치 한 칸씩 이동
    if (fromPos < toPos && pos > fromPos && pos <= toPos) {
      pos--;
      item.dataset.pos = pos;
      updateCSSPosition(item, pos);
    } else if (fromPos > toPos && pos < fromPos && pos >= toPos) {
      pos++;
      item.dataset.pos = pos;
      updateCSSPosition(item, pos);
    }
  });

  draggingItem.dataset.pos = toPos;
  updateCSSPosition(draggingItem, toPos);
}
