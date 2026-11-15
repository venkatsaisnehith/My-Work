# Content guide

Content lives in `data/`. Edit it on a branch, run `npm run check`, review the generated pages locally, and open a pull request. Keep JSON valid: quote property names, use double-quoted strings, and avoid trailing commas.

## Profile

`data/profile.json` holds `name`, `headline`, `location`, `bio`, `email`, `github`, `linkedin`, `cv`, and `publications`. Preserve the value shapes used in the existing file when updating it.

Use only public information you want employers and researchers to see. Leave unavailable links empty rather than supplying placeholder destinations. Add an email only if you want it visible publicly. A CV link should resolve to a reviewed public document. Publication entries should use verified titles, authorship, venues, dates, and persistent links.

The two publications mentioned in the owner's background still need their actual metadata. Their existence is not a substitute for bibliographic details.

## Articles

Add an entry to `data/writing.json`. A draft can be developed in Git without appearing on the public website:

```json
{
  "slug": "evaluating-my-first-ai-system",
  "title": "Evaluating my first AI system",
  "summary": "The question, baseline, and evaluation plan for an experiment in progress.",
  "date": "2026-11-15",
  "tags": ["Evaluation", "AI engineering"],
  "status": "draft",
  "body": [
    {"type": "paragraph", "text": "State the concrete problem and why it matters."},
    {"type": "heading", "text": "Evaluation plan"},
    {"type": "list", "items": ["Define a baseline", "Choose a test set", "Record limitations"]},
    {"type": "code", "language": "python", "text": "print('An illustrative code example')"}
  ]
}
```

Use a unique lowercase hyphenated slug. Set `status` to `published` only when the article is ready. Use an accurate publication date in `YYYY-MM-DD` form, and keep drafts out of the public record until they are ready.

An effective technical article explains the problem, concept, system structure, code, experiments, bottlenecks, and lessons learned. Separate a proposed design from an implemented system. Label illustrative examples and cite sources for claims that are not your own findings. Include commands, dependencies, and data assumptions when readers should be able to reproduce results.

The supported body blocks are `paragraph`, `heading`, `code`, and `list`. A paragraph or heading uses `text`; code uses `text` and an optional `language`; a list uses `items`. Keep content as text rather than injecting HTML. For diagrams, add support deliberately through the renderer rather than embedding unreviewed markup into text fields.

## Projects

`data/projects.json` begins empty. Each project uses `title`, `summary`, `status`, `tags`, `repository`, and `demo`:

```json
{
  "title": "Your actual project title",
  "summary": "What you implemented, the evaluation performed, and the result.",
  "status": "In progress",
  "tags": ["Evaluation"],
  "repository": "",
  "demo": ""
}
```

Replace example language with real work before publishing. Link a repository when it exists and leave `demo` empty until a working demonstration is available. Describe your contribution and known limitations. Do not invent benchmarks, users, deployments, or completion dates.

## Learning notes

`data/notes.json` begins empty. Add short notes using `date`, `title`, `text`, and `tags`:

```json
{
  "date": "2026-11-15",
  "title": "A concrete lesson from today's experiment",
  "text": "Describe what you tried, what you learned, and what you will investigate next.",
  "tags": ["Learning"]
}
```

Use the date the work actually happened. Notes and published articles supply the activity display; they do not measure study hours or synchronize GitHub commits. A useful note can be brief. Avoid empty updates created only to preserve a streak.

## Before publishing

Run `npm run check`, inspect the page on a narrow and wide viewport, and follow its links. Confirm that results are reproducible, sources are credited, confidential material is absent, and dates are accurate. Once hosting is chosen, build with the final `SITE_URL` so feed and sitemap URLs point to the public website.
