# Design notes

## Purpose and content

The page introduces Rain Piao to recruiting, academic, and general visitors through a conventional single-page portfolio. The opening animation quickly resolves into a clear masthead, an introduction, areas of interest, and links to existing profiles. It does not invent education, roles, projects, publications, availability, or contact details. Add those sections when verified material is ready to publish.

The landing copy currently reflects the interests Rain has shared: applied mathematics, statistics, data science, computer science, and machine learning. The plain accessible heading and document title use “Rain Piao,” while the visual wordmark uses **ℝain ℙiao**.

## Composition and motion

The supplied skyline is a vivid, full-width banner with rounded lower corners. The wordmark sits over open sky. A narrow navigation strip overlaps the bottom edge and stays available while scrolling. A restrained, translucent reading panel sits over a stationary, softly veiled version of the artwork; the glass blur samples the background behind the panel as it moves. This is rendered live with CSS `backdrop-filter`, with a solid, more opaque fallback.

On a first visit in a tab, the wordmark appears at the center of the viewport, its underline draws in, and the decorative wordmark moves into alignment with the permanent masthead. The full-screen artwork fades to reveal the banner and page underneath. The sequence lasts about 1.1 seconds and can be dismissed by scrolling, clicking, tapping, pressing Tab, or pressing Escape. A hash link, reduced-motion preference, or Simple display mode skips the sequence. The real heading and page content exist before the animation, and without JavaScript the complete page remains visible.

The Atmosphere/Simple control changes the reading surfaces while keeping the same content and preserving page position. It stores the choice locally when browser storage is available. Reduced-motion preference is respected independently.

## Name and palette

**ℝ** nods to the real numbers; **ℙ** nods to probability. The blackboard-bold initials give the name a mathematical accent while the other letters remain familiar. The underlining is a quiet reference to the example Rain shared.

| Token | Color | Use |
| --- | --- | --- |
| Navy | `#173F70` | Wordmark, headings, and primary text |
| Warm white | `#FFFAF7` | Reading surface and page base |
| Pale sky | `#D8EDFA` | Sky-toned fallback |
| Pink | `#EFACD0` | Underline, focus, and small accents |

The image provides most of the page’s brighter blue and pink. Body copy uses a clean system sans-serif; the wordmark and large headings use a local serif stack. No external font download is needed.

## Artwork and inspiration

`assets/images/sky.webp` is an optimized WebP copy of **Pastel Skyline Under Cherry Blossom Skies**, an AI-generated image supplied by Rain on 2026-10-13. The source PNG remains with Rain. No Xeuphoria album artwork is distributed with this site.

The color and atmosphere reference requested by Rain includes:

- [Xeuphoria — Piano Book](https://music.apple.com/us/album/piano-book/1800022237)
- [Xeuphoria — Piano Sessions: Sakura](https://www.xeuphoria.com/)
- [Xeuphoria — Piano Sessions: Reflections](https://www.youtube.com/watch?v=TvSZGenmAlk)
- [Xeuphoria — Evolve, containing “Nerves”](https://officialxeuphoria.bandcamp.com/album/evolve)

The README opens with Rain’s personal tribute to Xeuphoria, whose piano sessions accompanied them while studying, thinking, and unwinding. The site’s visual direction is a homage to the worlds their music and album artwork evoke; this does not imply affiliation or endorsement.

## Updating the site

Keep content in semantic HTML and styles in `assets/styles/main.css`. The small `assets/scripts/main.js` file handles only the intro sequence, display preference, and current section indication. Keep asset URLs relative so they work beneath `/rainpiao/` on GitHub Pages. Record any replacement artwork’s source and provenance here, and do not add album artwork used as visual reference.
