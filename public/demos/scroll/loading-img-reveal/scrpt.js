document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.querySelector(".progress-bar");
  const wraps = document.querySelectorAll(".reveal-wrap");

  let pTarget = 0;
  let pCurrent = 0;
  let pVelocity = 0;

  const mTension = 0.06;
  const mFriction = 0.22;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  const state = Array.from(wraps).map(() => ({
    cInset: 40,
    tInset: 40,
    cScale: 1.3,
    tScale: 1.3,
    cY: -10,
    tY: -10,
  }));

  function tick() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const maxScroll = document.documentElement.scrollHeight - windowHeight;
    pTarget = maxScroll > 0 ? scrollY / maxScroll : 0;

    const acceleration =
      mTension * (pTarget - pCurrent) - mFriction * pVelocity;
    pVelocity += acceleration;
    pCurrent += pVelocity;

    const scaleVal = Math.max(0, pCurrent);
    progressBar.style.transform = `scaleX(${scaleVal})`;

    // Image reveal & parallax
    wraps.forEach((wrap, i) => {
      const rect = wrap.getBoundingClientRect();
      const img = wrap.querySelector(".reveal-image");

      const startScroll = windowHeight;
      const endScroll = windowHeight / 2 - rect.height / 2;

      let progress = (startScroll - rect.top) / (startScroll - endScroll);
      progress = Math.max(0, Math.min(1, progress));

      state[i].tInset = 40 - 40 * progress; // 40% -> 0%
      state[i].tScale = 1.3 - 0.3 * progress; // 1.3 -> 1.0
      state[i].tY = -10 + 10 * progress; // -10% -> 0%

      state[i].cInset = lerp(state[i].cInset, state[i].tInset, 0.08);
      state[i].cScale = lerp(state[i].cScale, state[i].tScale, 0.08);
      state[i].cY = lerp(state[i].cY, state[i].tY, 0.08);

      // DOM 적용
      wrap.style.clipPath = `inset(0 ${state[i].cInset.toFixed(2)}% 0 ${state[i].cInset.toFixed(2)}%)`;
      img.style.transform = `scale(${state[i].cScale.toFixed(3)}) translateY(${state[i].cY.toFixed(2)}%)`;
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
});
