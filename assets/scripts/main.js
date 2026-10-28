(() => {
  const body = document.body;
  const root = document.documentElement;
  const toggle = document.querySelector(".mode-toggle");
  const scrollCue = document.querySelector(".scroll-cue");
  const masthead = document.querySelector(".masthead");
  const pageContent = document.querySelector(".page-content");
  const skyInterlude = document.querySelector(".sky-interlude");
  const fullSky = document.querySelector(".sky-background");
  const initialHash = window.location.hash;
  let finishIntro = () => {};
  const detailStates = new Map();

  function updateBlurBoundary() {
    const contentTop = pageContent.getBoundingClientRect().top;
    // Keep the ramp's coordinates continuous as the content crosses the viewport top.
    root.style.setProperty("--blur-ramp-start", `${contentTop - 96}px`);
    root.style.setProperty("--blur-ramp-middle", `${contentTop + 60}px`);
    root.style.setProperty("--blur-ramp-end", `${contentTop + 300}px`);
    if (skyInterlude) {
      const { top, bottom } = skyInterlude.getBoundingClientRect();
      root.style.setProperty("--sky-window-top", `${top - 70}px`);
      root.style.setProperty("--sky-window-clear-top", `${top + 70}px`);
      root.style.setProperty("--sky-window-clear-bottom", `${bottom - 70}px`);
      root.style.setProperty("--sky-window-bottom", `${bottom + 70}px`);
    }
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
    for (const details of document.querySelectorAll(".skill-group, .coursework")) {
      if (accessible) {
        if (!detailStates.has(details)) detailStates.set(details, details.open);
        details.open = true;
      } else if (detailStates.has(details)) {
        details.open = detailStates.get(details);
        detailStates.delete(details);
      }
    }
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
    if (skyInterlude) boundaryObserver.observe(skyInterlude);
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

  const experience = document.querySelector(".experience");
  const experienceTrack = document.querySelector("[data-experience-track]");
  if (experience && experienceTrack) {
    const cards = [...experienceTrack.querySelectorAll(":scope > .project-card")];
    const count = experience.querySelector("[data-experience-count]");
    const previous = experience.querySelector("[data-experience-previous]");
    const next = experience.querySelector("[data-experience-next]");
    const indexButtons = [...experience.querySelectorAll("[data-experience-go]")];
    let activeCard = 0;
    let scrollFrame = 0;

    function updateExperienceControls() {
      scrollFrame = 0;
      const trackRect = experienceTrack.getBoundingClientRect();
      const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index }))
        .filter(({ rect }) => rect.left >= trackRect.left - 4 && rect.right <= trackRect.right + 4);
      const nearest = cards.reduce((best, card, index) =>
        Math.abs(card.getBoundingClientRect().left - trackRect.left) < Math.abs(cards[best].getBoundingClientRect().left - trackRect.left) ? index : best, 0);
      activeCard = visible[0]?.index ?? nearest;
      const last = visible.at(-1)?.index ?? activeCard;
      const from = String(activeCard + 1).padStart(2, "0");
      const to = String(last + 1).padStart(2, "0");
      count.textContent = `${from}${last > activeCard ? `–${to}` : ""} / ${String(cards.length).padStart(2, "0")}`;
      previous.disabled = experienceTrack.scrollLeft <= 2;
      next.disabled = experienceTrack.scrollLeft >= experienceTrack.scrollWidth - experienceTrack.clientWidth - 3;
      for (const [index, button] of indexButtons.entries()) {
        if (index === activeCard) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      }
    }
    function scheduleExperienceControlsUpdate() {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateExperienceControls);
    }
    function showExperienceCard(index) {
      const target = Math.max(0, Math.min(cards.length - 1, index));
      const left = cards[target].getBoundingClientRect().left - experienceTrack.getBoundingClientRect().left + experienceTrack.scrollLeft;
      experienceTrack.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    previous.addEventListener("click", () => showExperienceCard(activeCard - 1));
    next.addEventListener("click", () => showExperienceCard(activeCard + 1));
    for (const button of indexButtons) button.addEventListener("click", () => showExperienceCard(Number(button.dataset.experienceGo)));
    experienceTrack.addEventListener("scroll", scheduleExperienceControlsUpdate, { passive: true });
    experienceTrack.addEventListener("keydown", (event) => {
      if (event.target !== experienceTrack) return;
      const target = { ArrowLeft: activeCard - 1, ArrowRight: activeCard + 1, Home: 0, End: cards.length - 1 }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      showExperienceCard(target);
    });
    window.addEventListener("resize", scheduleExperienceControlsUpdate, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(scheduleExperienceControlsUpdate).observe(experienceTrack);
    experience.classList.add("experience--ready");
    updateExperienceControls();
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
    finishIntro = (restoreSection = true) => {
      if (finished) return;
      finished = true;
      delete root.dataset.intro;
      removeListeners();
      if (restoreSection && initialHash) {
        let targetId;
        try { targetId = decodeURIComponent(initialHash.slice(1)); }
        catch { targetId = initialHash.slice(1); }
        const target = document.getElementById(targetId);
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
      if (["Tab", "Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) finishIntro(false);
    };
    const onInteract = () => finishIntro(false);
    const removeListeners = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onInteract, { passive: true, once: true });
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });

    window.setTimeout(() => {
      if (root.dataset.intro === "name") root.dataset.intro = "lift";
    }, 2000);
    window.setTimeout(finishIntro, 3400);
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

  // A one-use, short-lived hint distinguishes an observed keyboard reload.
  // Browsers that reserve the shortcut simply fall back to the normal intro.
  window.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== "r") return;
    try { sessionStorage.setItem("rainpiao-keyboard-reload", String(Date.now())); }
    catch { /* Reload remains usable without storage. */ }
  }, { capture: true });

  playIntro();
})();
