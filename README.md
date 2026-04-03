# Shaheen Gucci Online Game Center

A static multilingual gaming marketplace website built with HTML5, CSS3, Bootstrap 5, Tailwind CSS, and vanilla JavaScript.

## Project Structure 

```text
shaheen-gucci-online-game-center/
├─ index.html
├─ README.md
├─ assets/
│  ├─ css/
│  │  └─ main.css
│  └─ js/
│     ├─ main.js
│     ├─ translations.js
│     ├─ marketplace-data.js
│     ├─ marketplace-page.js
│     ├─ uc-packages.js
│     ├─ uc-page.js
│     ├─ sell-page.js
│     ├─ contact-page.js
│     ├─ component-loader.js
│     └─ component-interactions.js
├─ components/
│  ├─ navbar.html
│  ├─ footer.html
│  ├─ language-switcher.html
│  ├─ account-card.html
│  ├─ pricing-card.html
│  ├─ cta-section.html
│  └─ faq-accordion.html
└─ pages/
   ├─ marketplace.html
   ├─ pubg-uc-prices.html
   ├─ sell-your-account.html
   ├─ contact.html
   ├─ about.html
   ├─ faq.html
   └─ terms.html
```

## GitHub Pages Notes

- Keep `index.html` in the project root.
- Keep shared assets inside `assets/`.
- Root page links should use:
  - `pages/about.html`
  - `assets/css/main.css`
- Files inside `pages/` should use:
  - `../index.html`
  - `../assets/css/main.css`
  - `../assets/js/main.js`
- If you use reusable HTML partials with `component-loader.js`, set:
  - `window.SG_COMPONENT_BASE = '../';` on pages inside `pages/`
  - `window.SG_COMPONENT_BASE = '';` on `index.html`

## SEO Basics

Each page should include:

- Unique `<title>`
- Unique `<meta name="description">`
- Favicon link
- Open Graph tags

Recommended head additions:

```html
<link rel="icon" href="assets/icons/favicon.png" type="image/png">
<meta property="og:title" content="Shaheen Gucci Online Game Center">
<meta property="og:description" content="Premium gaming marketplace for accounts, PUBG UC offers, and seller submissions.">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/images/brand/og-cover.jpg">
```

For files inside `pages/`, use `../assets/...` paths.

## Performance Tips

- Prefer compressed images like `.webp` where possible.
- Keep icons in SVG format.
- Avoid very large background images.
- Reuse `main.css` and shared JS files instead of duplicating code.
- Load only page-specific JavaScript where needed.
- Minify CSS and JS later for production if you want smaller files.

## Deployment Steps

1. Create a new GitHub repository.
2. Upload this project to the repository root.
3. Push your code to the `main` branch.
4. Open the GitHub repository in your browser.
5. Go to `Settings`.
6. Open `Pages`.
7. Under `Build and deployment`, choose:
   - `Source: Deploy from a branch`
   - `Branch: main`
   - `Folder: / (root)`
8. Save the settings.
9. Wait for GitHub Pages to publish the site.
10. Open the generated site URL.

## Git Commands

```bash
git init
git add .
git commit -m "Initial static website for Shaheen Gucci Online Game Center"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If the remote already exists:

```bash
git add .
git commit -m "Update website"
git push
```

## Optional Improvements

- Add `404.html` for GitHub Pages.
- Add `sitemap.xml` and `robots.txt`.
- Add a real favicon in `assets/icons/`.
- Add Open Graph preview image in `assets/images/brand/`.
- Replace placeholder contact links with real WhatsApp, Telegram, and email values.
