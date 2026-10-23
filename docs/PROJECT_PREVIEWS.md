# Website previews

The project cards use actual captures of the URLs in `src/data/portfolio.json`. Still screenshots are stored in `public/projects/01.png` through `04.png`; matching GIFs load on card hover or preview keyboard focus and are removed when interaction ends. Reduced-motion and the global pause setting keep the still image.

Captured on October 21, 2026 at 1280 × 800. GIFs are 640 × 400, approximately six seconds long. Netflix was re-recorded to show only its public landing page and button hover states, without navigating to account screens. Its assets use versioned filenames (`01-v2.png` and `01-v2.gif`) to refresh cached previews without local-image query strings. Nearperk and ViewTube show scrolling previews. These are recordings, not live embeds.

To refresh, run `node scripts/capture-projects.mjs` from the portfolio directory with Chrome installed and network access, then `python3 scripts/encode-project-previews.py` with Pillow installed. Both scripts accept an optional project number to refresh only one site. Temporary frames are stored under `/tmp/portfolio-capture-NN`.

Quick Show — Movie Booking was added on October 23, 2026 from its public landing page. `04.png` and `04.gif` show the actual site and a scrolling preview; no reservation was submitted.
