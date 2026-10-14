# Design notes

## Purpose and content

The page introduces Rain Piao to recruiting, academic, and general visitors through a single-page portfolio. It opens with an animated name over the supplied skyline, then settles into a compact banner and a portfolio with education, research, selected projects, interests, music, and profile links. Each project card opens a focused detail page. The academic and project details are based on Rain’s resume; the site leaves out private contact details and GPA.

The landing copy currently reflects the interests Rain has shared: applied mathematics, statistics, data science, computer science, and machine learning. The plain accessible heading and document title use “Rain Piao,” while the visual wordmark uses **ℝain ℙiao**. Short editorial captions sit above the About, Education, Research, Projects, Music, and Interests headings as unboxed text. Education lists the two B.S. programs as Rain specified. The Music section includes two user-supplied tracks with browser audio controls. The Immersive music card uses the Logic Pro app icon as a visual cue; Reading mode hides it. The Interests area keeps the academic fields visible in both modes and adds a separate, clearly provisional personal-interest board in Immersive mode only.

## Two presentation modes

The default Immersive mode uses the supplied skyline at its original colors as a vivid masthead and as a soft background behind translucent reading panels. Navigation overlaps the masthead. A live CSS `backdrop-filter` layer uses a broad gradient mask that follows the top edge of the page content below the navigation. The navigation keeps its own glass treatment; the background blur and a light wash move with the content edge, gradually filling the screen as the page scrolls without switching suddenly to a fully blurred state.

On each page load in Immersive mode, one fixed sky image stays in place. The name begins appearing immediately at screen center by resolving from blur to clear and sliding upward, while its underline grows outward from the center at the same time. The reveal takes about two seconds; as soon as it finishes, the masthead contracts, carrying the name into the small top banner as the page content rises into view from below. The title begins moving into the banner at about two seconds; the full sequence takes about 3.8 seconds and never zooms the name. Immersive mode disables browser scroll restoration for that load and starts at the top, so refresh replays the opening consistently; section links return to their target when the sequence finishes. The navigation and blur boundary move together, gradually placing the blurred layer beneath the navigation. The intro runs in Immersive mode on each page load; Reading mode is the user-selected still presentation. The page is not locked during the sequence: scrolling, clicking, tapping, Tab, or Escape dismisses it. A small oval down-arrow appears when a mouse pointer reaches the bottom edge; touch screens get the cue after the intro.

One two-position switch changes between Immersive and Reading modes. At intermediate screen widths, the navigation links move to their own row while the mode switch stays beside the name. Reading is a deliberately calmer, denser layout: white background, familiar serif type, compact spacing, plain panels, and no opening or scroll animation. It retains the academic interests and project links while hiding the personal-interest board to keep the page focused. The selected mode is saved locally and shared with project detail pages; Immersive is the default. Keyboard focus, skip navigation, clear headings, and readable contrast are available in both modes.

## Name and palette

**ℝ** nods to the real numbers; **ℙ** nods to probability. The blackboard-bold initials give the name a mathematical accent while the other letters remain familiar. A thin underline spans the wordmark. Its navy center covers about 62% of the name width, with longer transparent fades at both ends so the line emerges softly from the sky.

| Token | Color | Use |
| --- | --- | --- |
| Navy | `#173F70` | Wordmark, headings, and primary text |
| Warm white | `#FFFAF7` | Reading surfaces and glass panels |
| Pale sky | `#D8EDFA` | Sky-toned fallback |
| Pink | `#EFACD0` | Underline, focus, and small accents |
| Cyan | `#59DEFF` | Ambient light in the immersive header |
| Lilac | `#DFD3FF` | Project-card accent |

The image provides most of the page’s brighter blue and pink in Immersive mode, supported by soft cyan and lilac color fields. Education and project cards use individual pastel tints so the information remains easy to scan. The name and large headings use a local serif stack; Reading mode uses a familiar local serif throughout. No external font download is needed.

## Artwork and inspiration

`assets/images/sky-full.png` is the 3344 × 1880 PNG supplied by Rain on 2026-10-13. It is stored byte-for-byte, without lossy compression or resizing. `assets/images/sky-preview.jpg` is a 1600 × 899 preview displayed immediately while the full PNG loads; the crisp image fades in once the browser has decoded it. The preview uses the same crop as the full image. No Xeuphoria album artwork is distributed with this site.

`assets/images/rain-piao-headshot.jpg` is a 1001 × 1400 web-sized copy of Rain’s supplied portrait. It keeps the original photo and natural colors; CSS frames it as a rounded arch beside the About section, with a plain rectangular frame in Reading mode. The original PNG is not included in the repository.

`assets/audio/breath-away.m4a` and `assets/audio/camelia-overdose.m4a` are AAC listening copies made from the WAV tracks Rain supplied. The masters remain outside the repository. The players use `preload="none"`, so audio is downloaded only when a visitor starts playback. Durations are 4:40 and 2:39.

The project cards link to static detail pages in `projects/`. Each page summarizes only the role, methods, and outcome currently supplied for that project and provides a path back to the portfolio. Personal-interest cards for music, running, chess, VALORANT, cosplay, and community contributions are placeholders; official SiFan, CFan, and SouLA links can be added when Rain provides the intended public URLs.

The color and atmosphere reference requested by Rain includes:

- [Xeuphoria — Piano Book](https://music.apple.com/us/album/piano-book/1800022237)
- [Xeuphoria — Piano Sessions: Sakura](https://www.xeuphoria.com/)
- [Xeuphoria — Piano Sessions: Reflections](https://www.youtube.com/watch?v=TvSZGenmAlk)
- [Xeuphoria — Evolve, containing “Nerves”](https://officialxeuphoria.bandcamp.com/album/evolve)

The README opens with Rain’s personal tribute to Xeuphoria, whose piano sessions accompanied them while studying, thinking, and unwinding. The site’s visual direction is a homage to the worlds their music and album artwork evoke; this does not imply affiliation or endorsement.

The ASA DataFest badge in Immersive mode uses the official 200 × 200 PNG published in the American Statistical Association’s [graphic standards](https://www.amstat.org/graphic-standards). It appears only beside Rain’s participation in that event. The IMC Prosperity 4 project thumbnail uses the event artwork published on [IMC Prosperity](https://prosperity.imc.com/). The LiDAR traffic monitoring project uses the Seyond logo published on [Seyond’s website](https://seyond.com/wp-content/uploads/2024/11/logo-01.png). The Logic Pro icon is Apple’s app artwork from its [App Store listing](https://apps.apple.com/us/app/logic-pro/id634148309). BruinML’s small Immersive-mode mark comes from the organization’s [LinkedIn profile](https://www.linkedin.com/company/bruinml); the organization name remains visible as text in both modes. The UCLA boxed wordmark was supplied by Rain and is used as a small decorative mark in Immersive mode only, alongside the institution’s full name and degree text. Rain confirmed the asset would be used in accordance with UCLA Policy 110 and its brand guidelines. Reading mode hides both institution and organization logo images.

## Updating the site

Keep content in semantic HTML and styles in `assets/styles/`. `assets/scripts/main.js` handles the main page’s two presentation modes, opening sequence, scroll cue, current section indication, and content-following blur ramp. `assets/scripts/project-detail.js` keeps the mode preference available on project pages. Keep asset URLs relative so they work beneath `/rainpiao/` on GitHub Pages. Record any replacement artwork’s source and provenance here, and do not add album artwork used as visual reference.
