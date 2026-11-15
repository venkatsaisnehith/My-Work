# Working on this portfolio

This repository is the source of truth for the website, published writing, and learning notes. Keep private application trackers, credentials, unpublished research, and personal correspondence outside the repository.

## Development workflow

1. Open an issue describing a concrete change or use a clear task description.
2. Create a focused branch, such as `feature/article-search` or `content/evaluation-notes`.
3. Make the change and run `npm run check` with Node.js 24.
4. Review the affected pages locally, including a mobile viewport and keyboard navigation when the interface changes.
5. Stage the relevant files, inspect `git diff --staged`, and commit a coherent unit of work with an accurate message.
6. Push the branch and open a pull request. Review the GitHub Actions result and generated site artifact before merging.

Use commits to document actual progress. Do not split trivial edits to inflate activity, backdate contributions, or claim generated material as completed personal research. A small, reviewed improvement is a useful contribution. A missed day needs no artificial commit.

## Writing and evidence

- Separate learning notes, opinions, project plans, and completed experiments clearly.
- Only publish results that were actually measured. Record the setup and limitations so others can reproduce them.
- Cite papers, datasets, code, and quotations. Respect their licenses and privacy restrictions.
- Verify profile and publication details before adding them. Do not invent a DOI, employer, metric, testimonial, or contact address.
- Keep articles marked as drafts until their content and examples are ready.
- Prefer a meaningful weekly update and occasional substantial article over a daily publishing obligation.

## Review checklist

Confirm that links work, text is readable, controls have accessible labels, and the navigation works without a mouse. Check that no temporary files, secrets, or generated build output were staged. Hosting is a separate decision; the quality workflow builds a downloadable artifact and does not deploy the website.
