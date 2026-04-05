const cards = document.querySelectorAll(".card-content");
const MAG_STRENGTH = 0.12; // 자석의 강도 (0~1)

// 카드 중심 좌표 저장
let cardData = [];
function updateCardData() {
  cardData = [];
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    cardData.push({
      el: card,
      parent: card.closest(".card-wrapper"),
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    });
  });
}
updateCardData();
window.addEventListener("resize", updateCardData);

document.addEventListener("mousemove", (e) => {
  const mx = e.clientX;
  const my = e.clientY;

  cardData.forEach((card) => {
    //자석 효과
    const dx = mx - card.centerX;
    const dy = my - card.centerY;

    // 마우스와의 거리 계산
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 특정 거리(300px) 안에 있을 때만 반응
    if (dist < 300) {
      const tx = dx * MAG_STRENGTH * (1 - dist / 300);
      const ty = dy * MAG_STRENGTH * (1 - dist / 300);
      card.el.style.transform = `translate(${tx}px, ${ty}px)`;
    } else {
      card.el.style.transform = "translate(0, 0)";
    }

    // Spotlight
    const rect = card.parent.getBoundingClientRect();
    const lx = mx - rect.left;
    const ly = my - rect.top;
    card.parent.style.setProperty("--mouse-x", `${lx}px`);
    card.parent.style.setProperty("--mouse-y", `${ly}px`);
  });
});
