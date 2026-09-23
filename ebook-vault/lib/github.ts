import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = "riyadkibria";

const DEFAULT_REPO = "My-ebook-library";

/* -------------------------------------------------------
   Get Markdown Tree
------------------------------------------------------- */

export async function getRepoTree(
  repo: string = DEFAULT_REPO
) {
  const response =
    await octokit.rest.git.getTree({
      owner: OWNER,

      repo,

      tree_sha: "main",

      recursive: "true",
    });

  return response.data.tree.filter(
    (item) =>
      item.type === "blob" &&
      item.path?.toLowerCase().endsWith(".md")
  );
}

/* -------------------------------------------------------
   Get Markdown File Content
------------------------------------------------------- */

export async function getFileContent(
  path: string,

  repo: string = DEFAULT_REPO
) {
  try {
    const response =
      await octokit.rest.repos.getContent({
        owner: OWNER,

        repo,

        path,
      });

    if (
      !Array.isArray(response.data) &&
      response.data.type === "file" &&
      response.data.content
    ) {
      return Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");
    }

    return "";
  } catch (error) {
    console.error(
      "GitHub content fetch error:",
      error
    );

    return "";
  }
}

/* -------------------------------------------------------
   Get Public Repositories
------------------------------------------------------- */

export async function getRepositories() {
  const response =
    await octokit.rest.repos.listForUser({
      username: OWNER,

      type: "public",

      sort: "updated",

      per_page: 100,
    });

  const repositories = [];

  for (const repo of response.data) {
    try {
      const tree =
        await octokit.rest.git.getTree({
          owner: OWNER,

          repo: repo.name,

          tree_sha:
            repo.default_branch,

          recursive: "true",
        });

      const hasMarkdown =
        tree.data.tree.some(
          (item) =>
            item.type === "blob" &&
            item.path
              ?.toLowerCase()
              .endsWith(".md")
        );

      if (!hasMarkdown) {
        continue;
      }

      repositories.push({
        id: repo.id,

        name: repo.name,

        fullName: repo.full_name,

        description:
          repo.description,

        language: repo.language,

        stars:
          repo.stargazers_count,

        updatedAt:
          repo.updated_at,

        url: repo.html_url,
      });
    } catch {
      // Ignore repositories
      // that cannot be inspected.
    }
  }

  return repositories;
}