# Hope Foundation — charity landing page

Plain HTML, CSS and JavaScript. No framework, no build step, no
dependencies. Deploys to Vercel as-is.

## Files

    index.html    the whole page
    styles.css    all styling (design tokens at the top of the file)
    script.js     menu, sticky header, counters, image placeholders
    donate.js     donation modal + the single payment integration point
    images/       put your .webp files here (see images/README.md)
    api/          Stripe function, disabled until you rename it

## Deploy

1. Push the folder to a GitHub repository.
2. Vercel -> Add New -> Project -> import the repo.
3. Framework Preset: **Other**.
   Build Command: leave empty.
   Output Directory: leave empty (root).
4. Deploy.

Nothing needs installing, so the build cannot fail.

## Changing the look

Every colour, font and spacing value lives in the `:root` block at the
top of `styles.css`. Change them there and the whole page follows.

## Payments

All donate buttons open one modal. The modal calls `startPayment()` in
`donate.js` — that function is the only thing you replace. Instructions
are written in the comment directly above it.

## Screenshots

There are no scroll-triggered reveal animations, so a full-page
screenshot from DevTools captures every section correctly.
