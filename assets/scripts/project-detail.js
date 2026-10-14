(() => {
  const body = document.body;
  const root = document.documentElement;
  const toggle = document.querySelector(".mode-toggle");

  function currentMode() {
    try {
      return localStorage.getItem("rainpiao-mode") === "accessible" ? "accessible" : "animated";
    } catch {
      return "animated";
    }
  }

  function setMode(mode, persist = false) {
    const accessible = mode === "accessible";
    root.dataset.mode = accessible ? "accessible" : "animated";
    body.dataset.mode = root.dataset.mode;
    toggle.setAttribute("aria-checked", String(accessible));
    toggle.setAttribute("aria-label", `Switch to ${accessible ? "Immersive" : "Reading"} mode`);
    if (persist) {
      try {
        localStorage.setItem("rainpiao-mode", root.dataset.mode);
      } catch {
        // Keep the mode toggle usable when browser storage is unavailable.
      }
    }
  }

  setMode(currentMode());
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    setMode(body.dataset.mode === "accessible" ? "animated" : "accessible", true);
  });
})();
