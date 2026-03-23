(function () {
  "use strict";
  /*
    Section 1: HORIZONTAL GALLERY ENGINE
    Vertical scroll → horizontal translateX
    1:1 linear mapping, no easing
  */
  const hgContainer = document.getElementById("hgalleryContainer");
  const hgStrip = document.getElementById("hgStrip");

  function setupHGallery() {
    if (!hgContainer || !hgStrip) return;
    // Set scroll area height = strip total width (so vertical scroll maps to horizontal distance)
    const stripW = hgStrip.scrollWidth;
    const viewW = window.innerWidth;
    // Total horizontal travel = strip width - viewport width (so last image reaches right edge)
    const travel = Math.max(0, stripW - viewW);
    // Section height = viewport height (for the sticky) + travel distance
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
    // Clamp scrolled to travel range
    const tx = Math.min(scrolled, travel);
    hgStrip.style.transform = "translateX(" + -tx + "px)";
  }

  // Text splits for gallery info card
  const hgTitle = document.getElementById("hgTitle");
  const hgDesc = document.getElementById("hgDesc");

  /*
    Section 2: OUR BOWLS — card reveal + text splits
  */
  // Bowl card staggered slide-up (IntersectionObserver based, CSS transition)
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

  // Bowls section title
  const bowlsTitle = document.getElementById("bowlsTitle");

  // Bowl names and descs — collect for text splitting later
  const bowlNames = document.querySelectorAll(".bowl-name");
  const bowlDescs = document.querySelectorAll(".bowl-desc");

  /* ========================================
     STACKING CARDS ENGINE v2
     ----------------------------------------
     Key fixes:
     1. Y translation is LINEAR (1:1 with scroll)
        — no easing curves, scroll IS the motion
     2. Cards tilt on ENTER + EXIT
        — entering card has slight rotateZ that
          settles to 0, exiting card tilts away
     ======================================== */
  const container = document.getElementById("stackContainer");
  const cards = document.querySelectorAll(".stack-card");
  const dots = document.querySelectorAll(".ref-dot");
  const counterEl = document.getElementById("currentIndex");
  const N = cards.length;

  // Per-card tilt when entering from below (degrees)
  const enterTilts = [0, 2.0, -1.8];
  // Per-card tilt when being pushed back by next card
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
    // How many pixels we've scrolled past the top of the container
    const scrolled = -rect.top;
    // Total scrollable distance within this section
    const total = container.offsetHeight - viewH;
    if (total <= 0) return;

    // Global progress: 0 (top) → 1 (bottom)
    const gp = clamp(scrolled / total, 0, 1);

    // Each transition between card i and card i+1
    // occupies one "segment" of the total scroll.
    // With N cards, there are (N-1) transitions.
    // Segment size = 1 / (N-1)
    //
    // Card 0: visible at gp=0, starts exiting at gp=0
    // Card 1: starts entering at gp=0, fully in at gp=seg, starts exiting at gp=seg
    // Card 2: starts entering at gp=seg, fully in at gp=2*seg
    //
    // This means each card enters during one full segment (1:1 with scroll)

    const seg = 1 / Math.max(N - 1, 1);
    let activeIdx = 0;

    cards.forEach((card, i) => {
      // --- inProgress: 0 = below viewport, 1 = fully covering screen ---
      let inP;
      if (i === 0) {
        inP = 1; // first card starts fully visible
      } else {
        // Card i enters during segment [(i-1)*seg, i*seg]
        const enterStart = (i - 1) * seg;
        const enterEnd = i * seg;
        inP = clamp((gp - enterStart) / (enterEnd - enterStart), 0, 1);
      }

      // --- outProgress: 0 = fully visible, 1 = fully pushed back ---
      let outP = 0;
      if (i < N - 1) {
        // Card i exits while card i+1 enters: segment [i*seg, (i+1)*seg]
        const exitStart = i * seg;
        const exitEnd = (i + 1) * seg;
        outP = clamp((gp - exitStart) / (exitEnd - exitStart), 0, 1);
      }

      // ==========================================
      // COMPUTE CSS VALUES — all LINEAR, no easing
      // ==========================================

      // Y: slides from 100% to 0% during entrance (1:1 with scroll)
      const y = (1 - inP) * 100;

      // Scale: shrinks from 1 → 0.92 during exit
      const scale = 1 - outP * 0.08;

      // RotateZ: two components combined
      //   Enter tilt: starts tilted, settles to 0 as card arrives
      //   Exit tilt: grows as card is pushed back
      const enterRot = (enterTilts[i] || 0) * (1 - inP);
      const exitRot = (exitTilts[i] || 0) * outP;
      const rz = enterRot + exitRot;

      // Opacity: fades during exit
      const opacity = 1 - outP * 0.55;

      // Border-radius: rounded when entering, flattens as card settles
      const radius = i === 0 ? 0 : (1 - inP) * 16;

      // APPLY — direct CSS variable writes, no transition
      card.style.setProperty("--y", y + "%");
      card.style.setProperty("--scale", scale);
      card.style.setProperty("--rz", rz + "deg");
      card.style.setProperty("--opacity", opacity);
      card.style.setProperty("--radius", radius + "px");
      card.style.zIndex = i + 1;

      // Active: card is mostly visible and not mostly exited
      const isActive = inP > 0.5 && outP < 0.5;
      card.classList.toggle("is-active", isActive);
      if (isActive) activeIdx = i;
    });

    // Update counter + dots
    counterEl.textContent = String(activeIdx + 1).padStart(2, "0");
    dots.forEach((d, i) => d.classList.toggle("is-active", i === activeIdx));
  }

  // Run on every scroll frame — rAF throttled
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
  update(); // initial
  updateHGallery(); // initial

  /* ========================================
     INTERSECTION OBSERVER — Generic reveals
     ======================================== */
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

  /* ========================================
     SECTION 2: PER-CHARACTER TEXT SPLIT
     ----------------------------------------
     Original uses clip-path based text-clip-reveal:
     - Each char is clipped (hidden) and unclipped on trigger
     - per-index = position in text
     - per-order = animation order (shuffled by noise)
     - transition-delay = per-order × stagger
     ======================================== */

  /**
   * Split text into per-character spans with clip-path reveal.
   * @param {Element} el - text element
   * @param {number} staggerMs - base stagger between chars (ms)
   * @param {number} noise - 0..1, how much to shuffle the order
   * @param {number} perDurationMs - duration of each char's clip animation
   */
  function splitChars(el, staggerMs, noise, perDurationMs) {
    const text = el.textContent.trim();
    el.textContent = "";
    perDurationMs = perDurationMs || 1000;

    // Collect non-space characters and assign per-index
    const chars = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") chars.push(i);
    }
    const totalChars = chars.length;

    // Generate per-order: start with sequential, then apply noise
    // Noise shuffles adjacent indices within a range proportional to noise factor
    const order = [];
    for (let i = 0; i < totalChars; i++) order.push(i);

    if (noise > 0) {
      // Swap each element with a random element within noise range
      for (let i = 0; i < totalChars; i++) {
        const range = Math.floor(totalChars * noise);
        const j = Math.min(
          totalChars - 1,
          Math.max(0, i + Math.floor(Math.random() * range * 2) - range),
        );
        [order[i], order[j]] = [order[j], order[i]];
      }
    }

    // Build spans
    let charIdx = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        el.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.textContent = text[i];
        const perOrder = order[charIdx];
        // transition-delay = per-order × stagger
        span.style.transitionDelay = perOrder * staggerMs + "ms";
        // per-duration for clip-path animation
        span.style.setProperty("--per-duration", perDurationMs + "ms");
        el.appendChild(span);
        charIdx++;
      }
    }
  }

  // === SECTION 1: Gallery info card text splits ===
  // Title "HAPPINESS" — per-char, direction: right, stagger: 100ms, noise: 0.2
  if (hgTitle) splitChars(hgTitle, 100, 0.2, 1000);
  // Desc — per-word, direction: up, stagger: ~14ms
  if (hgDesc) splitWords(hgDesc, 14, 1000);

  // Observe gallery text
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

  // === SECTION 2: Bowls title + card text splits ===
  // Title "Our Bowls" — per-char, direction: right, stagger: 100ms, noise: 0.2
  if (bowlsTitle) splitChars(bowlsTitle, 100, 0.2, 1000);

  // Bowl names — per-char, stagger: 100ms, noise: 0.2
  bowlNames.forEach((el) => splitChars(el, 100, 0.2, 1000));
  // Bowl descs — per-word, stagger: ~32ms
  bowlDescs.forEach((el) => splitWords(el, 32, 1000));

  // Observe bowls title and card inner texts
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

  // === SECTION 4: Connect CTA text splits ===
  // Split "Connect" label — clip from bottom→up, 100ms stagger, no noise
  // per-duration: 1000ms, total duration: 1700ms
  const connectLabel = document.getElementById("connectLabel");
  if (connectLabel) splitChars(connectLabel, 100, 0, 1000);

  // Split heading — clip from left→right, ~55.6ms stagger, 0.2 noise
  // per-duration: 1000ms, max-duration: 2500ms
  const connectHeading = document.getElementById("connectHeading");
  if (connectHeading) splitChars(connectHeading, 55.6, 0.2, 1000);

  // Observe both with intersection
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

  // Dot reveal
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

  /* ========================================
     SECTION 2: SCROLL-RELATIVE FLOAT IMAGE
     ======================================== */
  const connectFloat = document.getElementById("connectFloat");
  const connectSection = document.getElementById("connectSection");

  function updateFloatRadius() {
    if (!connectFloat || !connectSection) return;
    const rect = connectSection.getBoundingClientRect();
    const viewH = window.innerHeight;
    const sectionH = connectSection.offsetHeight;
    // progress-y: how far through the section (0 at top, 1 at bottom)
    const progressY = Math.max(
      0,
      Math.min(1, -rect.top / Math.max(sectionH - viewH, 1)),
    );
    // Radius grows as you scroll: starts at 4px, grows to 16px after 45% progress
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

  /* ========================================
     SECTION 3: FINALE — SCROLL-DRIVEN RADIUS
     ======================================== */
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

  /* ========================================
     SECTION 3: TEXT SPLITS — word & char reveals
     ======================================== */
  // Word-split helper with per-duration
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

  // Newsletter title — word reveal, 100ms stagger, 1000ms per-duration
  const nlTitle = document.getElementById("nlTitle");
  if (nlTitle) splitWords(nlTitle, 100, 1000);

  // Newsletter description — word reveal, ~21ms stagger, 1000ms per-duration
  const nlDesc = document.getElementById("nlDesc");
  if (nlDesc) splitWords(nlDesc, 21, 1000);

  // Copyright — word reveal, 50ms stagger, 1000ms per-duration
  const finaleCopyright = document.getElementById("finaleCopyright");
  if (finaleCopyright) splitWords(finaleCopyright, 50, 1000);

  // Nav links — per-character clip-path reveal, 50ms stagger, 1000ms per-duration
  const finaleNavLinks = document.querySelectorAll(".finale-nav-link");
  finaleNavLinks.forEach((link) => {
    splitChars(link, 50, 0, 1000);
  });

  // Privacy text height measurement
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

  // Observe all finale text elements
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

  /* ========================================
     SECTION 3: FORM
     ======================================== */
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
