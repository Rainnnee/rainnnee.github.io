# ℝain ℙiao

A tribute to my favorite music producer, [**Xeuphoria**](https://www.xeuphoria.com/), whose piano sessions have accompanied me through days and nights of studying, thinking, and unwinding. The skies and colors of this website are a small homage to the worlds their music and album artwork evoke.

[Visit my website](https://rainnnee.github.io/rainpiao/)

This is my personal website, bringing together my interests in applied mathematics, statistics, data science, computer science, and machine learning.

## Behind the initials

**ℝ** nods to the real numbers. **ℙ** nods to probability.

They give my name a mathematical accent while keeping it recognizable. For accessibility, the page title and accessible heading use the plain name **Rain Piao**.

## Built with

HTML, CSS, and a small amount of JavaScript, hosted on GitHub Pages. No build step is required.

```text
index.html                 Page structure and metadata
projects/                   Detail pages for selected projects
assets/styles/main.css     Layout, typography, and color theme
assets/styles/project-pages.css Detail-page layout
assets/scripts/main.js     Intro animation and display preference
assets/scripts/project-detail.js Mode switch on project pages
assets/images/sky-full.png Pixel-preserving supplied skyline
assets/images/sky-preview.jpg Fast-loading skyline preview
assets/images/rain-piao-headshot.jpg Optimized profile portrait
assets/audio/               Web-ready copies of selected music
docs/design.md             Design decisions and artwork provenance
CONTRIBUTING.md            Development and publishing workflow
.github/                   Pull request template
```

## Local preview

From the repository directory:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

The published website lives under `/rainpiao/`, so asset links must remain relative.

## Development

Use a short-lived feature branch and a focused commit message. Preview desktop and mobile layouts, then open a pull request and merge it into `main` to publish through GitHub Pages.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

## Artwork

The website background is an AI-generated image supplied by me. Its visual direction is inspired by Xeuphoria’s album artwork; the image itself was not created by Xeuphoria. The full-resolution PNG is retained without recompression; a small preview appears first and fades into the full image after it loads. No Xeuphoria album artwork is distributed with this site.
