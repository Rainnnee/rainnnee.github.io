(() => {
  const body = document.body;
  const toggle = document.querySelector(".mode-toggle");
  const modeLabel = document.querySelector(".mode-toggle__label");
  const intro = document.querySelector(".intro");
  const introWordmark = document.querySelector(".intro__wordmark");
  const pageWordmark = document.querySelector(".wordmark");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function readMode() {
    try {
      return localStorage.getItem("rainpiao-mode") === "simple" ? "simple" : "atmosphere";
    } catch {
      return "atmosphere";
    }
  }

  function setMode(mode, persist = false) {
    const simple = mode === "simple";
    body.dataset.mode = simple ? "simple" : "atmosphere";
    toggle.setAttribute("aria-pressed", String(simple));
    toggle.setAttribute("aria-label", `Switch to ${simple ? "Atmosphere" : "Simple"} mode`);
    modeLabel.textContent = simple ? "Simple" : "Atmosphere";
    if (persist) {
      try {
        localStorage.setItem("rainpiao-mode", simple ? "simple" : "atmosphere");
      } catch {
        // The control still works for this visit when storage is unavailable.
      }
    }
  }

  setMode(readMode());
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    setMode(body.dataset.mode === "simple" ? "atmosphere" : "simple", true);
  });

  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(({ section }) => section);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const item = navLinks.find(({ section }) => section === entry.target);
        if (!item) continue;
        if (entry.isIntersecting) {
          for (const { link } of navLinks) link.removeAttribute("aria-current");
          item.link.setAttribute("aria-current", "location");
        }
      }
    }, { rootMargin: "-18% 0px -68% 0px" });
    for (const { section } of navLinks) observer.observe(section);
  }

  function hasSeenIntro() {
    try {
      return sessionStorage.getItem("rainpiao-intro-seen") === "yes";
    } catch {
      return false;
    }
  }

  function markIntroSeen() {
    try {
      sessionStorage.setItem("rainpiao-intro-seen", "yes");
    } catch {
      // The intro can still complete when session storage is unavailable.
    }
  }

  function playIntro() {
    if (!intro || !introWordmark || !pageWordmark || body.dataset.mode === "simple" || reduceMotion.matches || location.hash || hasSeenIntro()) return;

    body.classList.add("is-intro-running");
    intro.hidden = false;
    introWordmark.getBoundingClientRect();
    requestAnimationFrame(() => {
      intro.classList.add("is-active");
      requestAnimationFrame(() => {
        const start = introWordmark.getBoundingClientRect();
        const end = pageWordmark.getBoundingClientRect();
        const x = end.left + end.width / 2 - (start.left + start.width / 2);
        const y = end.top + end.height / 2 - (start.top + start.height / 2);
        const scale = end.width / start.width;
        introWordmark.animate(
          [
            { transform: "translate(0, 0) scale(1)" },
            { transform: `translate(${x}px, ${y}px) scale(${scale})` },
          ],
          { duration: 780, delay: 350, easing: "cubic-bezier(.22, .72, .2, 1)", fill: "forwards" },
        );
        intro.classList.add("is-leaving");
      });
    });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      markIntroSeen();
      intro.classList.remove("is-active", "is-leaving");
      intro.hidden = true;
      body.classList.remove("is-intro-running");
      body.classList.add("is-intro-finished");
      removeListeners();
    };
    const onKeyDown = (event) => {
      if (event.key === "Tab" || event.key === "Escape") finish();
    };
    const onScroll = () => finish();
    const onInteract = () => finish();
    const removeListeners = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.setTimeout(finish, 1160);
  }

  playIntro();
})();
