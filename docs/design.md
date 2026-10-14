# Design notes

## Purpose and content

The page introduces Rain Piao to recruiting, academic, and general visitors through a single-page portfolio. It opens with an animated name over the supplied skyline, then settles into a compact banner and a short portfolio with education, research, selected projects, interests, and profile links. The academic and project details are based on Rain’s resume; the site leaves out private contact details and GPA.

The landing copy currently reflects the interests Rain has shared: applied mathematics, statistics, data science, computer science, and machine learning. The plain accessible heading and document title use “Rain Piao,” while the visual wordmark uses **ℝain ℙiao**. Education lists the two B.S. programs as Rain specified. A Music section reserves a place for future recordings or listening notes without pretending that audio playback is ready.

## Two presentation modes

The default Immersive mode uses the supplied skyline as a vivid masthead and as a soft background behind translucent reading panels. Navigation overlaps the masthead. A live CSS `backdrop-filter` layer begins just below the navigation, keeping the title and banner crisp while softly transitioning into a blurred page behind the cards. The blur boundary is measured from the navigation's lower edge, so it moves with the navigation as the masthead contracts and while the navigation sticks during scrolling.

On each page load in Immersive mode, one fixed sky image stays in place while the name moves from the center of the viewport into the shorter masthead. The name resolves from blur to clear; its underline expands outward from the center. The masthead contracts at the same time as the title moves. The navigation and the blur boundary move together, gradually placing the blurred layer beneath the navigation. The intro runs in Immersive mode on each page load; Reading mode is the user-selected still presentation. The page is not locked during the sequence: scrolling, clicking, tapping, Tab, or Escape dismisses it. A small oval down-arrow appears when a mouse pointer reaches the bottom edge; touch screens get the cue after the intro. A section link restores its target after the opening sequence.

One two-position switch changes between Immersive and Reading modes. Reading is a deliberately calmer, denser layout: white background, familiar serif type, compact spacing, plain panels, and no opening or scroll animation. It keeps the same semantic content and links. The selected mode is saved locally; Immersive is the default. Keyboard focus, skip navigation, clear headings, and readable contrast are available in both modes.

## Name and palette

**ℝ** nods to the real numbers; **ℙ** nods to probability. The blackboard-bold initials give the name a mathematical accent while the other letters remain familiar. The underlining is a quiet reference to the example Rain shared.

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

The color and atmosphere reference requested by Rain includes:

- [Xeuphoria — Piano Book](https://music.apple.com/us/album/piano-book/1800022237)
- [Xeuphoria — Piano Sessions: Sakura](https://www.xeuphoria.com/)
- [Xeuphoria — Piano Sessions: Reflections](https://www.youtube.com/watch?v=TvSZGenmAlk)
- [Xeuphoria — Evolve, containing “Nerves”](https://officialxeuphoria.bandcamp.com/album/evolve)

The README opens with Rain’s personal tribute to Xeuphoria, whose piano sessions accompanied them while studying, thinking, and unwinding. The site’s visual direction is a homage to the worlds their music and album artwork evoke; this does not imply affiliation or endorsement.

The ASA DataFest badge in Immersive mode uses the official 200 × 200 PNG published in the American Statistical Association’s [graphic standards](https://www.amstat.org/graphic-standards). It appears only beside Rain’s participation in that event. Other project and research markers are original decorative SVG motifs, not organization logos. UCLA’s official boxed mark is not included: UCLA’s brand site limits downloaded assets to university business and staff use, so the education entry uses the institution’s name in text.

## Updating the site

Keep content in semantic HTML and styles in `assets/styles/main.css`. The small `assets/scripts/main.js` file handles the two presentation modes, opening sequence, scroll cue, and current section indication. Keep asset URLs relative so they work beneath `/rainpiao/` on GitHub Pages. Record any replacement artwork’s source and provenance here, and do not add album artwork used as visual reference.
