# Development workflow

Keep the process proportional to this small, static site.

1. Start from up-to-date `main` and create a short-lived branch such as `feat/quiet-landing`, `fix/mobile-layout`, or `docs/update-readme`.
2. Make a focused change. Keep HTML in `index.html`, styling in `assets/styles/`, artwork in `assets/images/`, and project notes in `docs/`.
3. Preview the page on desktop and a narrow mobile viewport. Check readable text, no horizontal scrolling, correct accessible name, and working relative asset URLs under `/rainpiao/`.
4. Run `git diff --check`, review the diff, and commit only intended files. Do not commit credentials, local captures, or downloaded reference artwork.
5. Open a pull request explaining the visible change and how it was verified. Review the changed files and screenshots before merging.
6. Merge into `main`, wait for the Pages deployment, and verify the public URL. Use a revert commit if a release needs to be undone.

## Commit categories

Use the form `type: concise description`:

- `feat:` a new visible feature or design
- `fix:` a correction
- `docs:` project documentation
- `refactor:` code organization without a visible change
- `chore:` maintenance or configuration

Examples: `feat: add quiet illustrated landing page`, `fix: prevent name overflow on mobile`, `docs: document publishing workflow`.

An issue or project board is optional. Use issues for substantive future work and bugs; a separate board is not needed until there are multiple active tasks.
