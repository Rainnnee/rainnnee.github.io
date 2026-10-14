(() => {
  const body = document.body;
  const root = document.documentElement;
  const toggle = document.querySelector(".mode-toggle");
  const scrollCue = document.querySelector(".scroll-cue");
  const masthead = document.querySelector(".masthead");
  const pageContent = document.querySelector(".page-content");
  const fullSky = document.querySelector(".sky-background");
  const initialHash = window.location.hash;
  let finishIntro = () => {};

  function updateBlurBoundary() {
    const contentTop = pageContent.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    const start = Math.min(viewportHeight, Math.max(0, contentTop - 40));
    const middle = Math.min(viewportHeight + 160, Math.max(start + 1, contentTop + 80));
    const end = Math.min(viewportHeight + 320, Math.max(middle + 1, contentTop + 280));
    root.style.setProperty("--blur-ramp-start", `${start}px`);
    root.style.setProperty("--blur-ramp-middle", `${middle}px`);
    root.style.setProperty("--blur-ramp-end", `${end}px`);
  }

  let boundaryFrame = 0;
  function scheduleBlurBoundaryUpdate() {
    if (boundaryFrame) return;
    boundaryFrame = window.requestAnimationFrame(() => {
      boundaryFrame = 0;
      updateBlurBoundary();
    });
  }

  function revealFullSky() {
    root.dataset.imageLoaded = "true";
    delete root.dataset.imageLoading;
  }

  if (fullSky.complete) {
    if (fullSky.naturalWidth > 0) revealFullSky();
  } else {
    fullSky.addEventListener("load", () => {
      const ready = typeof fullSky.decode === "function" ? fullSky.decode() : Promise.resolve();
      ready.catch(() => {}).finally(revealFullSky);
    }, { once: true });
  }

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
  updateBlurBoundary();
  if ("ResizeObserver" in window) {
    const boundaryObserver = new ResizeObserver(scheduleBlurBoundaryUpdate);
    boundaryObserver.observe(masthead);
    boundaryObserver.observe(pageContent);
  }
  window.addEventListener("scroll", scheduleBlurBoundaryUpdate, { passive: true });
  window.addEventListener("resize", scheduleBlurBoundaryUpdate, { passive: true });
  toggle.addEventListener("click", () => {
    setMode(body.dataset.mode === "accessible" ? "animated" : "accessible", true);
    scheduleBlurBoundaryUpdate();
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

  function formatTrackTime(seconds) {
    const wholeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
  }

  for (const player of document.querySelectorAll("[data-track-player]")) {
    const audio = player.querySelector("audio");
    const playButton = player.querySelector(".track-player__play");
    const waveform = player.querySelector(".track-waveform");
    const timeReadout = player.querySelector(".track-player__current");
    const durationReadout = player.querySelector(".track-player__time time:last-of-type");
    const status = player.querySelector(".track-player__status");
    if (!audio || !playButton || !waveform || !timeReadout || !durationReadout) continue;

    const name = player.dataset.trackName || "audio sample";
    const knownDuration = Number(player.dataset.duration) || 0;
    let pendingSeek = null;
    let metadataRequested = false;

    function duration() {
      return Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : knownDuration;
    }

    function renderProgress(seconds = audio.currentTime) {
      const total = duration();
      const current = Math.max(0, Math.min(total, Number.isFinite(seconds) ? seconds : 0));
      const ratio = total > 0 ? current / total : 0;
      waveform.style.setProperty("--played", `${ratio * 100}%`);
      waveform.max = String(total);
      waveform.value = String(current);
      waveform.setAttribute("aria-valuetext", `${formatTrackTime(current)} of ${formatTrackTime(total)}`);
      timeReadout.textContent = formatTrackTime(current);
      timeReadout.dateTime = `PT${Math.floor(current)}S`;
      durationReadout.textContent = formatTrackTime(total);
    }

    function seekTo(seconds) {
      const target = Math.max(0, Math.min(duration(), seconds));
      pendingSeek = target;
      renderProgress(target);
      if (audio.readyState >= 1 && Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(target, audio.duration);
        pendingSeek = null;
      } else if (!metadataRequested) {
        metadataRequested = true;
        audio.load();
      }
    }

    function setPlaying(isPlaying) {
      playButton.setAttribute("aria-pressed", String(isPlaying));
      playButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${name}`);
    }

    playButton.hidden = false;
    waveform.hidden = false;
    player.querySelector(".track-player__time").hidden = false;
    player.classList.add("track-player--enhanced");
    audio.controls = false;
    audio.setAttribute("aria-hidden", "true");
    audio.tabIndex = -1;
    renderProgress(0);

    playButton.addEventListener("click", async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      for (const otherAudio of document.querySelectorAll("[data-track-player] audio")) {
        if (otherAudio !== audio) otherAudio.pause();
      }
      if (status) status.hidden = true;
      try {
        await audio.play();
      } catch {
        if (status) {
          status.textContent = `“${name}” could not be played. Try again in a moment.`;
          status.hidden = false;
        }
      }
    });

    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("timeupdate", () => renderProgress());
    audio.addEventListener("durationchange", () => renderProgress(pendingSeek ?? audio.currentTime));
    audio.addEventListener("loadedmetadata", () => {
      metadataRequested = false;
      if (pendingSeek !== null) {
        audio.currentTime = Math.min(pendingSeek, audio.duration);
        pendingSeek = null;
      }
      renderProgress();
    });
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("error", () => {
      if (status) {
        status.textContent = `“${name}” could not be loaded. Please try again later.`;
        status.hidden = false;
      }
      metadataRequested = false;
    });
    waveform.addEventListener("input", () => seekTo(Number(waveform.value)));
  }

  function playIntro() {
    if (root.dataset.intro !== "name" || body.dataset.mode === "accessible") return;
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousBehavior;

    let finished = false;
    finishIntro = () => {
      if (finished) return;
      finished = true;
      delete root.dataset.intro;
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

    window.setTimeout(() => {
      if (root.dataset.intro === "name") root.dataset.intro = "lift";
    }, 2000);
    window.setTimeout(finishIntro, 3800);
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
