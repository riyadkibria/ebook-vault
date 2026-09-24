// app/api/github/repos/route.ts

import { NextResponse } from "next/server";

const OWNER = process.env.GITHUB_OWNER;
const TOKEN = process.env.GITHUB_TOKEN;

if (!OWNER) {
  throw new Error("Missing GITHUB_OWNER in .env.local");
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
}

interface GithubTreeResponse {
  tree?: {
    path: string;
    type: "blob" | "tree";
  }[];
}

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  defaultBranch: string;
  url: string;
}

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
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
    const error = await response.text();

    throw new Error(
      `GitHub API ${response.status}\n${error}`
    );
  }

  return response.json();
}

async function hasMarkdownFile(
  repo: GithubRepo
): Promise<boolean> {
  try {
    const tree = await githubFetch<GithubTreeResponse>(
      `https://api.github.com/repos/${OWNER}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
    );

    if (!tree.tree) {
      return false;
    }

    return tree.tree.some(
      (item) =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith(".md")
    );
  } catch (error) {
    console.error(
      `Failed checking ${repo.name}`,
      error
    );

    return false;
  }
}

export async function GET() {
  try {
    const repos = await githubFetch<GithubRepo[]>(
      `https://api.github.com/users/${OWNER}/repos?sort=updated&per_page=100&type=owner`
    );

    const result: Repository[] = [];

    for (const repo of repos) {
      const markdown = await hasMarkdownFile(repo);

      if (!markdown) {
        continue;
      }

      result.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
        defaultBranch: repo.default_branch,
        url: repo.html_url,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch repositories.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}