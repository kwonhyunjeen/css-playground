(function () {
  "use strict";

  const COLORS = ["#aba09c"];

  // Sequence
  //  0: ARE YOU READY  →  type  +  delete   (teaser soft, medium size)
  //  1: ARE            →  type  +  explode  (light blast)
  //  2: YOU            →  type  +  explode  (medium blast)
  //  3: READY          →  type  +  explode  (heavy blast)
  const STEPS = [
    {
      text: "ARE YOU READY",
      action: "type-delete",
      label: "teaser",
      intensity: 0,
    },
    { text: "ARE", action: "type-explode", label: "are", intensity: 0.45 },
    { text: "YOU", action: "type-explode", label: "you", intensity: 0.7 },
    { text: "READY", action: "type-explode", label: "ready", intensity: 1.0 },
  ];

  // Config
  let typingSpeed = 90;
  let baseForce = 600;
  let gravity = 600;

  // DOM
  const glow = document.getElementById("glow");
  const stage = document.getElementById("stage");
  const container = document.getElementById("textContainer");
  const caret = document.getElementById("caret");
  const pCanvas = document.getElementById("particleCanvas");
  const pCtx = pCanvas.getContext("2d");

  // Canvas
  function resizeCanvas() {
    pCanvas.width = innerWidth * devicePixelRatio;
    pCanvas.height = innerHeight * devicePixelRatio;
    pCanvas.style.width = innerWidth + "px";
    pCanvas.style.height = innerHeight + "px";
    pCtx.setTransform(1, 0, 0, 1, 0, 0);
    pCtx.scale(devicePixelRatio, devicePixelRatio);
  }
  addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function jitter(b) {
    return b + (Math.random() - 0.5) * b * 0.5;
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  // State
  let exploding = [];
  let particles = [];
  let timers = [];
  let cycle = 1;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function tm(fn, ms) {
    const t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  function clearChars() {
    container.querySelectorAll(".char").forEach((el) => el.remove());
  }

  // TYPE
  function typeText(text, onDone) {
    clearChars();
    caret.classList.remove("hidden");
    caret.classList.add("typing");
    let i = 0;

    function next() {
      if (i >= text.length) {
        caret.classList.remove("typing");
        if (onDone) tm(onDone, 30);
        return;
      }
      const ch = text[i];
      const span = document.createElement("span");
      span.className = "char in";
      if (ch === " ") {
        span.innerHTML = "&nbsp;";
        span.style.width = "0.45em";
      } else {
        span.textContent = ch;
        span.style.color = COLORS[(i * 3) % COLORS.length];
      }
      container.insertBefore(span, caret);
      i++;
      tm(next, jitter(typingSpeed));
    }
    next();
  }

  // DELETE
  function deleteText(onDone) {
    caret.classList.add("typing");

    function next() {
      const chars = container.querySelectorAll(".char");
      if (!chars.length) {
        caret.classList.remove("typing");
        if (onDone) tm(onDone, 250);
        return;
      }
      const last = chars[chars.length - 1];
      last.classList.add("deleting");
      tm(() => {
        last.remove();
        tm(next, jitter(typingSpeed * 0.3));
      }, 40);
    }
    next();
  }

  // EXPLODE
  function explodeText(intensity, onDone) {
    caret.classList.add("hidden");

    const force = baseForce * (0.5 + intensity * 1.0);
    const numParticles = Math.floor(20 + intensity * 60);

    // Shake
    stage.classList.remove("shake", "shake-heavy");
    void stage.offsetWidth;
    stage.classList.add(intensity >= 1 ? "shake-heavy" : "shake");
    tm(() => stage.classList.remove("shake", "shake-heavy"), 600);

    // Glow flash
    const a = 0.06 + intensity * 0.16;
    glow.style.background = `radial-gradient(circle, rgba(171,160,156,${a}) 0%, transparent 55%)`;
    tm(() => {
      glow.style.background =
        "radial-gradient(circle, rgba(171,160,156,0.04) 0%, transparent 70%)";
    }, 300);

    // Burst particles
    const cx = innerWidth / 2,
      cy = innerHeight / 2;
    for (let p = 0; p < numParticles; p++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = rand(60, 180 + intensity * 450);
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1,
        decay: rand(0.45, 1.0 + intensity * 0.6),
        size: rand(1.5, 3 + intensity * 3.5),
        color: COLORS[~~(Math.random() * COLORS.length)],
      });
    }

    // Chars → exploding pieces
    const chars = container.querySelectorAll(".char");
    chars.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const color = el.style.color || COLORS[i % COLORS.length];
      const txt = el.textContent;
      if (!txt.trim()) {
        el.remove();
        return;
      }

      const clone = document.createElement("span");
      clone.className = "char-explode";
      clone.textContent = txt;
      clone.style.fontSize = getComputedStyle(el).fontSize;
      clone.style.color = color;
      clone.style.textShadow = `0 0 ${14 + intensity * 26}px ${color}, 0 0 ${36 + intensity * 44}px ${color}`;
      document.body.appendChild(clone);

      const angle = rand(-Math.PI, Math.PI);
      const speed = rand(force * 0.4, force * 1.6);

      exploding.push({
        el: clone,
        x: r.left,
        y: r.top,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - rand(60, 280) * intensity,
        rot: 0,
        spin: rand(-540, 540) * (0.4 + intensity),
        opacity: 1,
      });

      el.remove();
    });

    // Cleanup
    tm(
      () => {
        exploding.forEach((c) => c.el.remove());
        exploding = [];
        if (onDone) onDone();
      },
      900 + intensity * 220,
    );
  }

  // Sequence runner
  function startSequence() {
    let idx = 0;

    function next() {
      if (idx >= STEPS.length) {
        cycle++;
        idx = 0;
        tm(next, 900);
        return;
      }

      const step = STEPS[idx];

      if (step.action === "type-delete") {
        // Teaser: type full sentence → hold → delete
        typeText(step.text, () => {
          tm(() => {
            deleteText(() => {
              idx++;
              tm(next, 450);
            });
          }, 900);
        });
      } else {
        // Word: type → hold → explode
        // Typing speed slows slightly for detonate words (weight)
        const savedSpeed = typingSpeed;
        typingSpeed = Math.round(typingSpeed * (1 + step.intensity * 0.3));

        typeText(step.text, () => {
          typingSpeed = savedSpeed;
          tm(
            () => {
              explodeText(step.intensity, () => {
                idx++;
                // Gap shrinks: 550 → 400 → 250  (acceleration feel)
                const gap = Math.max(50, 550 - idx * 120);
                tm(next, gap);
              });
            },
            80 - step.intensity * 40,
          );
        });
      }
    }

    next();
  }

  // Render loop
  let lastTime = performance.now();

  function animate(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Exploding chars
    for (const c of exploding) {
      c.vy += gravity * dt;
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.rot += c.spin * dt;
      c.opacity = Math.max(0, c.opacity - dt * 0.6);
      c.el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`;
      c.el.style.opacity = c.opacity;
    }

    // Particles
    pCtx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += gravity * 0.22 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Core dot
      pCtx.globalAlpha = p.life;
      pCtx.fillStyle = p.color;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      pCtx.fill();

      // Soft glow
      pCtx.globalAlpha = p.life * 0.2;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size * p.life * 4, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.globalAlpha = 1;

    requestAnimationFrame(animate);
  }

  // Init
  requestAnimationFrame(animate);
  startSequence();
})();
