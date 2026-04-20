const mainPanel = document.getElementById("mainPanel");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const contentWrapper = document.getElementById("contentWrapper");
const appContainer = document.querySelector(".app-container");
const rootStyle = document.documentElement.style;

let isDragging = false;
let startX = 0;
let currentX = 0;
let panelState = "full";
let activeTheme = "dark";
let isThemeSwitching = false;

let maxDragDistance = 0;
let snapThreshold = 0;

function updateDimensions() {
  const appWidth = appContainer.clientWidth;
  maxDragDistance = appWidth * -0.85;
  snapThreshold = appWidth * -0.3;
}

// 디바이스 크기에 맞게 scale 조정
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

updateDimensions();
updateDeviceScale();
window.addEventListener("resize", () => {
  updateDimensions();
  updateDeviceScale();
});

mainPanel.addEventListener("pointerdown", (e) => {
  if (isThemeSwitching) return;
  isDragging = true;
  startX = e.clientX;
  mainPanel.classList.add("is-dragging");
  mainPanel.setPointerCapture(e.pointerId);
});

document.addEventListener("pointermove", (e) => {
  if (!isDragging || isThemeSwitching) return;

  currentX = e.clientX;
  let deltaX = currentX - startX;

  if (panelState === "opened") deltaX += maxDragDistance;
  if (deltaX > 0) deltaX = 0;
  if (deltaX < maxDragDistance) deltaX = maxDragDistance;

  const progress = deltaX / maxDragDistance;
  rootStyle.setProperty("--drag-x", `${deltaX}px`);
  rootStyle.setProperty("--progress", progress.toFixed(3));
});

const endGesture = (e) => {
  if (!isDragging) return;
  isDragging = false;
  mainPanel.classList.remove("is-dragging");

  const currentProgress =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--progress"),
    ) || 0;

  if (currentProgress > 0.3) {
    rootStyle.setProperty("--drag-x", `${maxDragDistance}px`);
    rootStyle.setProperty("--progress", "1");
    panelState = "opened";
  } else {
    rootStyle.setProperty("--drag-x", `0px`);
    rootStyle.setProperty("--progress", "0");
    panelState = "full";
  }
};

document.addEventListener("pointerup", endGesture);
document.addEventListener("pointercancel", endGesture);

const themeContent = {
  light: {
    greeting: "Good morning,",
    heroLabel: "Readiness",
    heroValue: "92",
    heroSub: "Prime for focus and energy",
    sectionTitle: "Morning Start",
    card1Icon: "☀️",
    card1Title: "Morning Clarity",
    card1Desc: "15 Min • Guided Meditation",
    card2Icon: "🌱",
    card2Title: "Daily Intentions",
    card2Desc: "5 Min • Journaling",
  },
  dark: {
    greeting: "Good evening,",
    heroLabel: "Sleep Score",
    heroValue: "85",
    heroSub: "Optimal sleep quality",
    sectionTitle: "Wind Down",
    card1Icon: "🌌",
    card1Title: "Deep Sleep Sounds",
    card1Desc: "45 Min • Ambient noise",
    card2Icon: "🌬️",
    card2Title: "Night Breathwork",
    card2Desc: "10 Min • Relaxing",
  },
};

function updateDOMContent(theme) {
  const data = themeContent[theme];
  document.getElementById("greetingText").textContent = data.greeting;
  document.getElementById("heroLabel").textContent = data.heroLabel;
  document.getElementById("heroValue").textContent = data.heroValue;
  document.getElementById("heroSub").textContent = data.heroSub;
  document.getElementById("sectionTitle").textContent = data.sectionTitle;

  document.getElementById("card1Icon").textContent = data.card1Icon;
  document.getElementById("card1Title").textContent = data.card1Title;
  document.getElementById("card1Desc").textContent = data.card1Desc;

  document.getElementById("card2Icon").textContent = data.card2Icon;
  document.getElementById("card2Title").textContent = data.card2Title;
  document.getElementById("card2Desc").textContent = data.card2Desc;
}

themeToggleBtn.addEventListener("click", () => {
  if (panelState !== "opened" || isThemeSwitching) return;
  isThemeSwitching = true;

  contentWrapper.classList.add("fade-out");

  setTimeout(() => {
    let nextTheme;
    if (activeTheme === "dark") {
      mainPanel.classList.replace("dark-mode", "light-mode");
      nextTheme = "light";
      rootStyle.setProperty("--icon-morph", "1");
    } else {
      mainPanel.classList.replace("light-mode", "dark-mode");
      nextTheme = "dark";
      rootStyle.setProperty("--icon-morph", "0");
    }

    updateDOMContent(nextTheme);
    activeTheme = nextTheme;

    setTimeout(() => {
      contentWrapper.classList.remove("fade-out");
      setTimeout(() => {
        isThemeSwitching = false;
      }, 400);
    }, 50);
  }, 400);
});
