# My Work

A personal portfolio and public learning notebook for AI engineering and research. Writing, projects, research, and dated learning notes live together in one Git-backed website.

The design uses an off-white background, dark typography, and a restrained green accent. The codebase has no third-party runtime dependencies and requires Node.js 24.

## Run locally

```sh
npm run dev
```

Open `http://localhost:4321`. To produce the static website and run its checks:

```sh
npm run build
npm test
npm run check
```

`npm run check` builds the site and runs the tests. The generated website is written to `dist/`.

## What is included

- Profile, research background, and space for publication links and a CV.
- Searchable technical writing with article pages and an RSS feed.
- Project and learning-note collections ready for original work.
- A dated activity view drawn from published writing and learning notes.
- Contact information and browser-local reading preferences.
- GitHub Actions checks and a pull request template.

The initial article explains the purpose of this portfolio. Project results, publication details, and learning activity are not invented. Empty collections remain empty until real work is added. Contact currently points to GitHub; an email address must be configured before email contact is available.

## Edit the content

| File | Purpose |
| --- | --- |
| `data/profile.json` | Name, background, contact links, CV, and publications |
| `data/writing.json` | Articles and drafts |
| `data/projects.json` | Project descriptions and links |
| `data/notes.json` | Dated learning notes |

See the [content guide](docs/content-guide.md) for field descriptions and examples, [architecture](docs/architecture.md) for how the site works, and [contributing guide](CONTRIBUTING.md) for the development workflow.

## Hosting

Public website: **https://venkatsaisnehith.github.io/My-Work/**

GitHub Pages serves the complete portfolio. Every push to `main` runs the build and tests, uploads the checked output, and deploys it through the `github-pages` environment. Branches and pull requests run checks without publishing. Deployment history is visible in the repository’s Actions tab. No hosting secrets or separate server are required.

Set `SITE_URL` to the final public URL (including `/My-Work` for the project site) when building for production so canonical links, the sitemap, and the feed use the correct address. Without it, development uses localhost.

```sh
SITE_URL=https://venkatsaisnehith.github.io/My-Work npm run check
```

GitHub stores the source and content. Keep a separate local clone as a backup. Secrets and private personal records should never be added to this public repository.

## Before sharing professionally

- Confirm the public name, headline, and biography.
- Add the titles, authors, venue, year, and links for the two publications.
- Add a reviewed public CV and its link.
- Set the email and LinkedIn links you want to publish.
- Add the first reproducible project with code, measurements, and limitations.
- Verify the live site after updating content.

The [roadmap](docs/roadmap.md) describes a manageable publishing routine and possible later improvements.

### Adding a personal domain later

Configure the domain in repository Settings → Pages and update DNS as GitHub instructs. Change `SITE_URL` in `.github/workflows/ci.yml` to the new HTTPS address. The build derives the link prefix from that URL, so a root domain automatically removes `/My-Work` from navigation and assets. Keep domain registration separate from the public repository.
