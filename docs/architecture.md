# Architecture

## One repository, one website

This is a dependency-free static website built with Node.js 24. Content is maintained as JSON in Git. The build produces HTML pages and public assets in `dist/`; a static host serves those files without an application server or database.

```text
data/*.json ─────────┐
                    ├─ scripts/build.mjs ── dist/ ── static hosting
public/styles.css ──┤
public/app.js ───────┘
```

The architecture keeps content available outside any hosting provider. Changing hosts does not require moving a database. Each article is part of the same website.

## Content model

`profile.json` contains the public identity, biography, contact links, CV link, and publication metadata. The other collections contain articles, projects, and learning notes. Article bodies use a small set of structured blocks instead of arbitrary executable content.

Draft articles are source material, not public pages. Published article dates and learning-note dates supply the activity view. That view is a record of dated content, not a GitHub contribution count or proof of time spent studying.

The initial content uses only the background supplied by the owner. Missing publication details and project outcomes need to be provided before they can be displayed as evidence.

## Pages and navigation

| Route | Purpose |
| --- | --- |
| `/` | Introduction and a view into the work |
| `/about/` | Background, interests, and profile |
| `/writing/` | Article collection and discovery |
| `/writing/<slug>/` | A published article |
| `/projects/` | Implemented work and supporting links |
| `/research/` | Research background and publications |
| `/notes/` | Dated learning notebook |
| `/contact/` | Available ways to reach the owner |
| `/preferences/` | Local reading preferences |

The build also supplies an RSS feed, sitemap, robots file, and `.nojekyll` file. `SITE_URL` controls the public origin used for generated absolute URLs; localhost is a development fallback.

## Browser behavior

The site uses ordinary HTML navigation. Client-side JavaScript adds collection filtering, the mobile navigation menu, and reading preferences. Preferences are saved in the current browser's local storage, not to an account or server.

There is no authentication system, private dashboard, or browser-based publishing backend. The source files are the editing interface. Contact links use the configured destinations; the site does not claim to deliver or store messages. Email contact needs a configured public email address.

## Verification and delivery

`npm run build` generates the website. `npm test` checks the generated output. `npm run check` performs both in order, and GitHub Actions runs the same check for repository changes. The workflow retains a build artifact for review; it does not choose a hosting provider or deploy the site.

Changes should be grouped into meaningful commits and reviewed through branches and pull requests. The repository history records actual development; it should not manufacture streaks, backdate work, or imply that generated sample content is completed research.

## Boundaries

A static site is suitable for the portfolio and notebook. Persistent visitor messages, protected administration, or collaborative editing would require additional services and a separate design decision. Add those only when there is a concrete need, with clear handling of credentials and visitor data.
