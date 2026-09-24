import { NextResponse } from "next/server";

const OWNER = process.env.GITHUB_OWNER!;
const TOKEN = process.env.GITHUB_TOKEN;

interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
}

interface GithubTree {
  tree: {
    path: string;
    type: "blob" | "tree";
  }[];
}

async function github<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(TOKEN
        ? {
            Authorization: `Bearer ${TOKEN}`,
          }
        : {}),
    },

    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `GitHub API Error ${response.status}: ${message}`
    );
  }

  return response.json() as Promise<T>;
}

async function hasMarkdownFile(
  repoName: string,
  branch: string
): Promise<boolean> {
  try {
    const tree = await github<GithubTree>(
      `https://api.github.com/repos/${OWNER}/${repoName}/git/trees/${branch}?recursive=1`
    );

    return tree.tree.some(
      (item) =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith(".md")
    );
  } catch (error) {
    console.error(
      `Unable to inspect repository: ${repoName}`,
      error
    );

    return false;
  }
}

export async function GET() {
  try {
    const repos = await github<GithubRepo[]>(
      `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated&type=public`
    );

    const markdownRepos = await Promise.all(
      repos.map(async (repo) => {
        const containsMarkdown = await hasMarkdownFile(
          repo.name,
          repo.default_branch
        );

        if (!containsMarkdown) {
          return null;
        }

        return {
          id: repo.full_name,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          defaultBranch: repo.default_branch,
          url: repo.html_url,
        };
      })
    );

    return NextResponse.json(
      markdownRepos.filter(Boolean)
    );
  } catch (error) {
    console.error("GitHub API Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch GitHub repositories.",
      },
      {
        status: 500,
      }
    );
  }
}