(() => {
  const body = document.body;
  const root = document.documentElement;
  const toggle = document.querySelector(".mode-toggle");
  const scrollCue = document.querySelector(".scroll-cue");
  const intro = document.querySelector(".intro");
  const initialHash = window.location.hash;
  let finishIntro = () => {};

  function readMode() {
    try {
      const saved = localStorage.getItem("rainpiao-mode");
      if (saved === "accessible" || saved === "animated") return saved;
    } catch {
      // Keep the page usable when browser storage is unavailable.
    }
    return "animated";
  }

  function setMode(mode, persist = false) {
    const accessible = mode === "accessible";
    root.dataset.mode = accessible ? "accessible" : "animated";
    body.dataset.mode = root.dataset.mode;
    toggle.setAttribute("aria-checked", String(accessible));
    toggle.setAttribute("aria-label", `Switch to ${accessible ? "Immersive" : "Reading"} mode`);
    if (accessible) finishIntro();
    if (persist) {
      try {
        localStorage.setItem("rainpiao-mode", accessible ? "accessible" : "animated");
      } catch {
        // The control still works for this visit when storage is unavailable.
      }
    }
  }

  setMode(readMode());
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    setMode(body.dataset.mode === "accessible" ? "animated" : "accessible", true);
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

  function playIntro() {
    if (!intro || body.dataset.mode === "accessible") return;

    body.classList.add("is-intro-running");
    intro.hidden = false;
    if (initialHash) {
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = previousBehavior;
    }
    requestAnimationFrame(() => {
      intro.classList.add("is-active", "is-leaving");
    });

    let finished = false;
    finishIntro = () => {
      if (finished) return;
      finished = true;
      intro.classList.remove("is-active", "is-leaving");
      intro.hidden = true;
      body.classList.remove("is-intro-running");
      body.classList.add("is-intro-finished");
      removeListeners();
      if (initialHash) {
        const target = document.querySelector(initialHash);
        if (target) {
          const previousBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          document.documentElement.style.scrollBehavior = previousBehavior;
        }
      }
      if (window.matchMedia("(hover: none)").matches) body.classList.add("show-scroll-cue");
    };
    const onKeyDown = (event) => {
      if (event.key === "Tab" || event.key === "Escape") finishIntro();
    };
    const onScroll = () => finishIntro();
    const onInteract = () => finishIntro();
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
    window.setTimeout(finishIntro, 2050);
  }

  scrollCue.addEventListener("click", () => {
    document.querySelector("#about").scrollIntoView({ behavior: body.dataset.mode === "accessible" ? "auto" : "smooth" });
  });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    body.classList.toggle("show-scroll-cue", event.clientY > window.innerHeight - 88);
  }, { passive: true });
  window.addEventListener("scroll", () => {
    if (window.scrollY > 24) body.classList.remove("show-scroll-cue");
  }, { passive: true });

  playIntro();
})();
