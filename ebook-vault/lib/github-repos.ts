const OWNER = process.env.GITHUB_OWNER!;
const TOKEN = process.env.GITHUB_TOKEN;

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

interface GithubTree {
  tree: {
    path: string;
    type: "blob" | "tree";
  }[];
}

export interface Repository {
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


async function githubFetch<T>(
  url: string
): Promise<T> {

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",

      ...(TOKEN
        ? {
            Authorization:
              `Bearer ${TOKEN}`,
          }
        : {}),
    },

    next: {
      revalidate: 300,
    },
  });


  if (!response.ok) {

    const error =
      await response.text();

    throw new Error(
      `GitHub API Error ${response.status}: ${error}`
    );
  }


  return response.json();
}



async function hasMarkdownFile(
  repo: GithubRepo
): Promise<boolean> {

  try {

    const tree =
      await githubFetch<GithubTree>(
        `https://api.github.com/repos/${OWNER}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
      );


    return tree.tree.some(
      (item) =>
        item.type === "blob" &&
        item.path
          .toLowerCase()
          .endsWith(".md")
    );


  } catch (error) {

    console.error(
      repo.name,
      error
    );

    return false;
  }
}



export async function getRepositories():
Promise<Repository[]> {


  const repos =
    await githubFetch<GithubRepo[]>(
      `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=updated&type=public`
    );


  const results =
    await Promise.all(

      repos.map(async(repo)=>{


        const hasMarkdown =
          await hasMarkdownFile(repo);


        if(!hasMarkdown){
          return null;
        }


        return {

          id: repo.id,

          name: repo.name,

          fullName:
            repo.full_name,

          description:
            repo.description,

          language:
            repo.language,

          stars:
            repo.stargazers_count,

          updatedAt:
            repo.updated_at,

          defaultBranch:
            repo.default_branch,

          url:
            repo.html_url,
        };

      })

    );


  return results.filter(
    Boolean
  ) as Repository[];

}