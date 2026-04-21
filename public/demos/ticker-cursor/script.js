const GALLERY_ITEMS = [
  {
    ticker: "• SPIDER MAN 🕸 🗽 🕷 • SPIDER MAN 🕸 🗽 🕷 ",
    img: "./imgs/spiderman.jpg",
  },
  {
    ticker: "• TOY STORY 🥔 🛸 🦖 • TOY STORY 🥔 🛸 🦖 ",
    img: "./imgs/toystory.jpg",
  },
  {
    ticker: "• DOOMS DAY 💥 🌋 💀 • DOOMS DAY 💥 🌋 💀 ",
    img: "./imgs/doomsday.jpeg",
  },
];

document.getElementById("gallery").innerHTML = GALLERY_ITEMS.map(
  ({ ticker, img }) =>
    `<div class="card" data-ticker="${ticker}" style="background-image: url('${img}')"></div>`,
).join("");

const tracker = document.getElementById("cursorTracker");
const visual = document.getElementById("cursorVisual");
const textWrapper = document.getElementById("cursorTextWrapper");
const cards = document.querySelectorAll(".card");

let currentText = "";

cards.forEach((card) => {
  card.addEventListener("mouseenter", (e) => {
    const newText = card.dataset.ticker;

    if (currentText !== newText) {
      currentText = newText;
      textWrapper.innerHTML = "";

      const chars = Array.from(newText);
      const angleStep = 360 / chars.length;

      chars.forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;

        // Adjust by adding -90 degrees (12시 방향부터 텍스트가 시작되도록 하기 위함)
        const rad = (i * angleStep - 90) * (Math.PI / 180);

        // radius 값(46)이 커서 테두리와 텍스트 사이의 여백(Padding)을 결정
        const radius = 46;

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        // 계산된 x, y 좌표로 이동시킨 후, 텍스트가 원의 바깥쪽을 향하도록 회전
        span.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${i * angleStep}deg)`;

        textWrapper.appendChild(span);
      });
    }
    visual.classList.add("active");
  });

  card.addEventListener("mouseleave", () => {
    visual.classList.remove("active");
  });
});

// 부드러운 마우스 추적 (Lerp)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function renderLoop() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;

  tracker.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  requestAnimationFrame(renderLoop);
}

renderLoop();
