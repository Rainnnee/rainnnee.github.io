# Rain Piao — personal website

A small personal website for Rain Piao, hosted on GitHub Pages.

- **Website:** https://rainnnee.github.io/rainpiao/
- **Repository:** `Rainnnee/rainpiao`
- **Current scope:** an illustrated background and a mathematical name treatment. No biography or project content yet.

## Project layout

```text
index.html                 Accessible page structure and metadata
assets/styles/main.css     Layout, typography, and color tokens
assets/images/             Optimized original website artwork
docs/design.md             Visual decisions and asset provenance
CONTRIBUTING.md            Development and publishing workflow
.github/                   Pull request template
```

## Preview locally

No package installation or build step is required. From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The public site lives under `/rainpiao/`, so keep asset links relative (for example `./assets/styles/main.css`).

## Publishing

GitHub Pages publishes the root of `main`. Work on a feature branch, verify the result, then open a pull request. Merging that pull request into `main` triggers the existing Pages deployment. Check the Actions run and live site after merging.

See [CONTRIBUTING.md](CONTRIBUTING.md) for commit categories and review checks, and [docs/design.md](docs/design.md) for the visual direction.
