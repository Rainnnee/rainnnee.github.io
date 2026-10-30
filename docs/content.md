# Maintaining the portfolio content

## Projects and research

Projects are grouped into three separate, permanently visible sections in `index.html`: Research (`#research`), Software (`#software`), and Competitions (`#competitions`). The work navigation jumps between those sections rather than filtering a single gallery. Each group has a heading, brief scope, and its own set of articles. All content and navigation remain usable without JavaScript.

Research uses two larger illustrated cards across on desktop; software uses three readable cards across; competitions use two shorter illustrated entries. The layout becomes two columns on medium screens and a single column on phones. Overview descriptions are intentionally concise; full contributions and context belong on each linked detail page. Reading shows the same groups as a continuous, professional list.

To add a project, place a semantic article inside the appropriate `.work-group__cards`. Keep a stable `data-project-id`, a cover, clear status, short summary, tools, and detail-page link. Choose its primary context independently of technologies: an ML software project can sit under Software, with machine learning in its visible tags. Keep current work first within each group. Navigation counts come from the actual articles; no filter logic or duplicate project data is required.

Keep jobs and internships separate from these project categories. Do not add an empty group just to fill space.

## Jobs and internships

Professional experience is separate from the project library. There are no entries yet, so its section and navigation link remain hidden. The page already contains an inert entry template, a renderer, chronological ordering, and both-mode styling.

When an actual role is ready to publish, add an object to the `employment-data` JSON script in `index.html`. Use these fields:

| Field | Content |
| --- | --- |
| `role` | Actual position title |
| `organization` | Employer or organization name |
| `period` | Display date range |
| `startDate` | ISO start date (`YYYY-MM` or `YYYY-MM-DD`); roles sort newest first |
| `highlights` | Array of factual contribution statements |
| `url` | Optional public role or organization URL |

The renderer uses text nodes and restricts optional links to HTTP(S). Do not put a planned internship, project affiliation, CFan, or SouLA into employment to fill space. Real work appears between Education and Projects. Keep role descriptions factual and independently reviewable.

## Toolkit

Toolkit uses one consistent component for Programming, Statistics & data, Computer vision & ML, and Development & publishing. Each group lists tools, practical methods, and a link to an actual project as evidence. Keep capabilities grounded in the linked work or Rain’s supplied profile; no proficiency percentages or invented levels. PyTorch remains explicitly marked as learning. Mathematical foundations have a separate expandable list.

Tool badges are local copies of the Shields.io assets used in Rain’s GitHub profile. Preserve their labels and logos. Sources are the badge URLs in `Rainnnee/Rainnnee`’s README; local hosting avoids runtime badge-service requests. Reading presents tools and methods as plain text without the decorative surfaces or project cross-links.

## Pusheng / PDF to MIDI

The entry is based on the local `MIDI Scanner` repository's README and project status report, reviewed October 27, 2026. The offline recognition/evaluation work exists; the musician-facing upload/review application remains in development. Do not describe the interface, expressive playback, or general-purpose recognition reliability as shipped.

The confirmed repository URL is `https://github.com/Rainnnee/pdf-to-midi`. It is labeled “not public yet” on the detail page, so visitors are told before following a restricted or unavailable link. Do not change repository visibility from the website task.

## BruinML research entries

Research has two separate entries. The CLIP-based detection work is completed (2026 through October 2026), with its ALT 2027 manuscript still under review. The Fall 2026 demonstration-ranking project is ongoing. Its public description is limited to the research question and intended direction; add individual contributions or results only when Rain provides them. Keep the private Overleaf notes out of the website repository.
