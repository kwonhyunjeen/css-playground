(function () {
  "use strict";

  const hgContainer = document.getElementById("hgalleryContainer");
  const hgStrip = document.getElementById("hgStrip");

  function setupHGallery() {
    if (!hgContainer || !hgStrip) return;
    // 스크롤 영역 높이를 스트립 전체 너비로 설정 (수직 스크롤이 수평 거리로 매핑되도록)
    const stripW = hgStrip.scrollWidth;
    const viewW = window.innerWidth;
    // 총 수평 이동 거리 = 스트립 너비 - 뷰포트 너비 (마지막 이미지가 오른쪽 끝에 도달하도록)
    const travel = Math.max(0, stripW - viewW);
    // 섹션 높이 = 뷰포트 높이 (sticky) + 이동 거리
    hgContainer.style.height = window.innerHeight + travel + "px";
  }

  setupHGallery();
  window.addEventListener("resize", setupHGallery);

  function updateHGallery() {
    if (!hgContainer || !hgStrip) return;
    const rect = hgContainer.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top);
    const stripW = hgStrip.scrollWidth;
    const viewW = window.innerWidth;
    const travel = Math.max(0, stripW - viewW);
    // 스크롤된 거리를 이동 거리 범위로 제한
    const tx = Math.min(scrolled, travel);
    hgStrip.style.transform = "translateX(" + -tx + "px)";
  }

  // 갤러리 정보 카드 텍스트 분할
  const hgTitle = document.getElementById("hgTitle");
  const hgDesc = document.getElementById("hgDesc");

  const bowlCards = document.querySelectorAll(".bowl-card");
  const bowlCardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          bowlCardObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  bowlCards.forEach((c) => bowlCardObs.observe(c));

  const bowlsTitle = document.getElementById("bowlsTitle");

  const bowlNames = document.querySelectorAll(".bowl-name");
  const bowlDescs = document.querySelectorAll(".bowl-desc");

  const container = document.getElementById("stackContainer");
  const cards = document.querySelectorAll(".stack-card");
  const dots = document.querySelectorAll(".ref-dot");
  const counterEl = document.getElementById("currentIndex");
  const N = cards.length;

  const enterTilts = [0, 2.0, -1.8];
  const exitTilts = [-1.5, 1.2, -0.8];

  function setHeight() {
    container.style.height = N * 100 + "vh";
  }
  setHeight();
  window.addEventListener("resize", setHeight);

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function update() {
    const rect = container.getBoundingClientRect();
    const viewH = window.innerHeight;
    // 컨테이너 상단에서 스크롤된 픽셀 수
    const scrolled = -rect.top;
    // 이 섹션 내에서 스크롤 가능한 총 거리
    const total = container.offsetHeight - viewH;
    if (total <= 0) return;

    const gp = clamp(scrolled / total, 0, 1);

    const seg = 1 / Math.max(N - 1, 1);
    let activeIdx = 0;

    cards.forEach((card, i) => {
      // inProgress: 0 = below viewport, 1 = fully covering screen
      let inP;
      if (i === 0) {
        inP = 1;
      } else {
        // 카드 i가 세그먼트 [(i-1)*seg, i*seg] 동안 진입
        const enterStart = (i - 1) * seg;
        const enterEnd = i * seg;
        inP = clamp((gp - enterStart) / (enterEnd - enterStart), 0, 1);
      }

      // outProgress: 0 = fully visible, 1 = fully pushed back
      let outP = 0;
      if (i < N - 1) {
        // 카드 i가 세그먼트 [i*seg, (i+1)*seg] 동안 아웃
        const exitStart = i * seg;
        const exitEnd = (i + 1) * seg;
        outP = clamp((gp - exitStart) / (exitEnd - exitStart), 0, 1);
      }

      const y = (1 - inP) * 100;

      const scale = 1 - outP * 0.08;

      const enterRot = (enterTilts[i] || 0) * (1 - inP);
      const exitRot = (exitTilts[i] || 0) * outP;
      const rz = enterRot + exitRot;

      const opacity = 1 - outP * 0.55;

      const radius = i === 0 ? 0 : (1 - inP) * 16;

      card.style.setProperty("--y", y + "%");
      card.style.setProperty("--scale", scale);
      card.style.setProperty("--rz", rz + "deg");
      card.style.setProperty("--opacity", opacity);
      card.style.setProperty("--radius", radius + "px");
      card.style.zIndex = i + 1;

      const isActive = inP > 0.5 && outP < 0.5;
      card.classList.toggle("is-active", isActive);
      if (isActive) activeIdx = i;
    });

    counterEl.textContent = String(activeIdx + 1).padStart(2, "0");
    dots.forEach((d, i) => d.classList.toggle("is-active", i === activeIdx));
  }

  let raf = null;
  window.addEventListener(
    "scroll",
    () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          update();
          updateHGallery();
          raf = null;
        });
    },
    { passive: true },
  );
  update();
  updateHGallery();

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  document
    .querySelectorAll(".reveal, .reveal-left")
    .forEach((el) => revealObs.observe(el));

  function splitChars(el, staggerMs, noise, perDurationMs) {
    const text = el.textContent.trim();
    el.textContent = "";
    perDurationMs = perDurationMs || 1000;

    const chars = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") chars.push(i);
    }
    const totalChars = chars.length;

    const order = [];
    for (let i = 0; i < totalChars; i++) order.push(i);

    if (noise > 0) {
      for (let i = 0; i < totalChars; i++) {
        const range = Math.floor(totalChars * noise);
        const j = Math.min(
          totalChars - 1,
          Math.max(0, i + Math.floor(Math.random() * range * 2) - range),
        );
        [order[i], order[j]] = [order[j], order[i]];
      }
    }

    let charIdx = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        el.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.textContent = text[i];
        const perOrder = order[charIdx];
        span.style.transitionDelay = perOrder * staggerMs + "ms";
        span.style.setProperty("--per-duration", perDurationMs + "ms");
        el.appendChild(span);
        charIdx++;
      }
    }
  }

  // Title "HAPPINESS" — per-char, direction: right, stagger: 100ms, noise: 0.2
  if (hgTitle) splitChars(hgTitle, 100, 0.2, 1000);
  // Desc — per-word, direction: up, stagger: ~14ms
  if (hgDesc) splitWords(hgDesc, 14, 1000);

  const hgTextObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          hgTextObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  if (hgTitle) hgTextObs.observe(hgTitle);
  if (hgDesc) hgTextObs.observe(hgDesc);

  if (bowlsTitle) splitChars(bowlsTitle, 100, 0.2, 1000);

  bowlNames.forEach((el) => splitChars(el, 100, 0.2, 1000));
  bowlDescs.forEach((el) => splitWords(el, 32, 1000));

  const bowlTextObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          bowlTextObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  if (bowlsTitle) bowlTextObs.observe(bowlsTitle);
  bowlNames.forEach((el) => bowlTextObs.observe(el));
  bowlDescs.forEach((el) => bowlTextObs.observe(el));

  const connectLabel = document.getElementById("connectLabel");
  if (connectLabel) splitChars(connectLabel, 100, 0, 1000);

  const connectHeading = document.getElementById("connectHeading");
  if (connectHeading) splitChars(connectHeading, 55.6, 0.2, 1000);

  const connectObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          connectObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  if (connectLabel) connectObs.observe(connectLabel);
  if (connectHeading) connectObs.observe(connectHeading);

  const connectDot = document.getElementById("connectDot");
  if (connectDot) {
    const dotObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            dotObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    dotObs.observe(connectDot);
  }

  const connectFloat = document.getElementById("connectFloat");
  const connectSection = document.getElementById("connectSection");

  function updateFloatRadius() {
    if (!connectFloat || !connectSection) return;
    const rect = connectSection.getBoundingClientRect();
    const viewH = window.innerHeight;
    const sectionH = connectSection.offsetHeight;
    const progressY = Math.max(
      0,
      Math.min(1, -rect.top / Math.max(sectionH - viewH, 1)),
    );
    const t = Math.max(0, Math.min(1, (progressY - 0.45) / 0.05));
    const radius = 4 + t * 12;
    connectFloat.style.setProperty("--float-radius", radius + "px");
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!connectFloat) return;
      requestAnimationFrame(updateFloatRadius);
    },
    { passive: true },
  );
  updateFloatRadius();

  const finaleSection = document.getElementById("finaleSection");
  const finaleBgClip = document.getElementById("finaleBgClip");

  function updateFinaleRadius() {
    if (!finaleSection || !finaleBgClip) return;
    const rect = finaleSection.getBoundingClientRect();
    const viewH = window.innerHeight;
    const sectionH = finaleSection.offsetHeight;
    const progressY = Math.max(
      0,
      Math.min(1, -rect.top / Math.max(sectionH - viewH, 1)),
    );
    // Radius: 16px at start → 0 after 50% scroll
    const t = Math.max(0, Math.min(1, (progressY - 0.49) / 0.01));
    const radius = 16 * (1 - t);
    finaleSection.style.setProperty("--finale-radius", radius + "px");
  }

  window.addEventListener(
    "scroll",
    () => {
      requestAnimationFrame(updateFinaleRadius);
    },
    { passive: true },
  );
  updateFinaleRadius();

  function splitWords(el, staggerMs, perDurationMs) {
    const text = el.textContent.trim();
    el.textContent = "";
    perDurationMs = perDurationMs || 1000;
    const words = text.split(/\s+/);
    words.forEach((word, i) => {
      if (i > 0) el.appendChild(document.createTextNode(" "));
      const span = document.createElement("span");
      span.textContent = word;
      span.style.transitionDelay = i * staggerMs + "ms";
      span.style.setProperty("--per-duration", perDurationMs + "ms");
      el.appendChild(span);
    });
  }

  const nlTitle = document.getElementById("nlTitle");
  if (nlTitle) splitWords(nlTitle, 100, 1000);

  const nlDesc = document.getElementById("nlDesc");
  if (nlDesc) splitWords(nlDesc, 21, 1000);

  const finaleCopyright = document.getElementById("finaleCopyright");
  if (finaleCopyright) splitWords(finaleCopyright, 50, 1000);

  const finaleNavLinks = document.querySelectorAll(".finale-nav-link");
  finaleNavLinks.forEach((link) => {
    splitChars(link, 50, 0, 1000);
  });

  const nlPrivacy = document.getElementById("nlPrivacy");
  if (nlPrivacy) {
    const measure = () => {
      const h = nlPrivacy.scrollHeight;
      nlPrivacy
        .closest(".nl-privacy-wrap")
        .style.setProperty("--privacy-h", h + "px");
    };
    measure();
    window.addEventListener("resize", measure);
  }

  const finaleTextObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          finaleTextObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  [nlTitle, nlDesc, finaleCopyright].forEach((el) => {
    if (el) finaleTextObs.observe(el);
  });
  finaleNavLinks.forEach((link) => finaleTextObs.observe(link));

  const form = document.getElementById("subscribeForm");
  const nlSubmitBtn = document.getElementById("nlSubmitBtn");

  if (nlSubmitBtn && form) {
    nlSubmitBtn.addEventListener("click", () => {
      const input = form.querySelector(".nl-email-input");
      if (input && input.value && input.validity.valid) {
        nlSubmitBtn.querySelector(".btn-sparkle-label").textContent =
          "Thank you!";
        setTimeout(() => {
          form.reset();
          nlSubmitBtn.querySelector(".btn-sparkle-label").textContent =
            "Submit";
        }, 2500);
      } else {
        if (input) input.focus();
      }
    });
  }
})();
