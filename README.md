# Editable Portfolio CMS

This is a React + Vite portfolio where the public site is generated from `src/data/portfolio.json` and the admin dashboard stores post-deployment edits in browser `localStorage`.

## Edit The Portfolio

- Seed content lives in `src/data/portfolio.json`.
- Public sections, project cards, skills, timeline items, social links, contact details, and resume URL are rendered from that JSON.
- Add a project by adding another object to the `projects` array.
- Add skills by editing the `skills` array.
- Add roles by editing the `experience` array.

## Admin Dashboard

- Open `/admin` after deployment or `http://127.0.0.1:5173/admin` during local development.
- Example password: `admin123`.
- The password is intentionally simple client-side protection, not server-grade authentication.
- Dashboard edits are saved under the storage key defined in `site.storageKey`.
- Use Settings > Export JSON to save the edited CMS data.
- Use Settings > Import JSON to load a saved export into another browser.
- Use Settings > Reset local edits to return to `src/data/portfolio.json`.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist`.

## Deploy

### Netlify

1. Push this folder to a Git repository.
2. Create a new Netlify site from the repository.
3. Use build command `npm run build`.
4. Use publish directory `dist`.
5. The included `public/_redirects` file allows `/admin` to load as a single-page app route.

### Vercel

1. Import the repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add a rewrite from `/(.*)` to `/index.html` if direct visits to `/admin` do not resolve automatically.

### GitHub Pages

1. Build with `npm run build`.
2. This repository includes a GitHub Actions workflow at `.github/workflows/gh-pages.yml` which builds and publishes the `dist` folder to GitHub Pages automatically when you push to the `main` branch.

   - Ensure your default branch is `main` (or edit the workflow to match your branch name).
   - Push the repository to GitHub (replace <repo-url> if different):

     ```bash
     git remote add origin https://github.com/balas05/Portfolio.git
     git push -u origin main
     ```

3. After the workflow runs (check the Actions tab), verify Pages deployment at: `https://balas05.github.io/Portfolio/`.

4. SPA fallback: if direct `/admin` routes do not resolve, open the admin dashboard using the hash route: `https://balas05.github.io/Portfolio/#admin`.

5. If you prefer to publish a pre-built `dist` folder manually, commit the `dist` folder and configure Pages to serve from the `gh-pages` or `main` branch accordingly.

Notes:
- The workflow uses `npm ci` and `npm run build` and publishes `./dist`.
- If your branch is named `master` or another name, update the `on.push.branches` entry in `.github/workflows/gh-pages.yml`.


## Updating Live Content After Deployment

For quick edits, use `/admin` and save changes. They persist in the browser that made the edits. For permanent source-controlled changes, export JSON from the dashboard and replace `src/data/portfolio.json` with the exported content before rebuilding.
