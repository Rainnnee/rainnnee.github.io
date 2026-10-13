# Design notes

## Current direction

This is a first, deliberately minimal landing page. The only visible text is Rain Piao's name. The chosen artwork is **Pastel Skyline Under Cherry Blossom Skies**, supplied by the owner. Its luminous center gives the name room, while the city and rooftop give the backdrop a sense of place.

Bright azure, white, and soft pink retain the illustrated album-cover feeling the owner likes. The image remains behind the name rather than competing with it. The setting is an illustration, not a claim about where Rain lives.

## Name treatment

The visual wordmark reads **ℝain ℙiao**. Blackboard-bold ℝ evokes the real numbers and ℙ evokes probability. The remaining letters stay conventional so the name remains legible. A fine underline takes inspiration from the name example supplied by the owner. The accessible heading and browser title use the plain name **Rain Piao**. The name is live text, not baked into the image.

## Palette

| Token | Color | Purpose |
| --- | --- | --- |
| Sky | `#d8edfa` | Fallback page background |
| Paper | `#fffaf7` | Gentle light behind the name |
| Pink | `#efacd0` | Underline accent and text selection |
| Ink | `#173f70` | Name and typography |

The image supplies the stronger blue and pink hues. All colors are editable in `assets/styles/main.css`.

## Artwork and references

`assets/images/sky.webp` is an optimized WebP copy of **Pastel Skyline Under Cherry Blossom Skies.png**, an image supplied by the owner on 2026-10-13. The original PNG remains with the owner. No Xeuphoria album artwork is distributed with this site.

Mood and palette references requested by the owner:

- [Xeuphoria — Piano Book](https://music.apple.com/us/album/piano-book/1800022237)
- [Xeuphoria — Piano Sessions: Sakura](https://www.xeuphoria.com/)
- [Xeuphoria — Piano Sessions: Reflections](https://www.youtube.com/watch?v=TvSZGenmAlk)
- [Xeuphoria — Evolve, containing Nerves](https://officialxeuphoria.bandcamp.com/album/evolve)

These informed color and atmosphere, not an affiliation or endorsement.

## Future writing panels: 毛玻璃

For later writing sections, use a restrained live glass panel over the stationary background. CSS `backdrop-filter: blur(...) saturate(...)` samples and filters the pixels behind the panel. As the content panel moves during scrolling, it samples a new part of the fixed background, creating the moving-through-glass effect. A second frozen or continually regenerated image is unnecessary; browsers perform this filter directly.

Start with a modest blur (around `12px`), a translucent white fill, a subtle white border, and a soft shadow. Preserve strong text contrast with a more opaque fill. Add an opaque fill fallback for browsers that do not support `backdrop-filter`. Keep the artwork stationary in the viewport while content scrolls over it. The name-only page has no panels yet; apply this decision when writing is added.

## Replacing the background

Replace `assets/images/sky.webp` with an optimized image, update its intrinsic dimensions in `index.html` if they differ, and check both wide and narrow views. Preserve `alt=""` because the image is decorative. Record the new source and review it through a feature branch and pull request.
