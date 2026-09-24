// ===========================================================
// File: lib/github.ts
// ===========================================================


import { Octokit } from "octokit";



const octokit = new Octokit({

  auth: process.env.GITHUB_TOKEN,

});



const OWNER = process.env.GITHUB_OWNER!;

const DEFAULT_REPO = "My-ebook-library";





/* -------------------------------------------------------
   Types
------------------------------------------------------- */


export interface GithubTreeItem {

  path: string;

  type: "blob" | "tree";

}



export interface Repository {

  id: number;

  name: string;

  fullName: string;

  description: string | null;

  language: string | null;

  stars: number;

  updatedAt: string;

  url: string;

  defaultBranch: string;

}







/* -------------------------------------------------------
   Get Complete Repository Tree
------------------------------------------------------- */


export async function getRepoTree(

  repo: string = DEFAULT_REPO,

  branch: string = "main"

): Promise<GithubTreeItem[]> {


  try {


    const response =

      await octokit.rest.git.getTree({

        owner: OWNER,

        repo,

        tree_sha: branch,

        recursive: "true",

      });



    return response.data.tree

      .filter(

        (item) =>

          item.path &&

          (

            item.type === "blob" ||

            item.type === "tree"

          )

      )

      .map(

        (item) => ({

          path: item.path!,

          type:

            item.type === "tree"

              ? "tree"

              : "blob",

        })

      );



  } catch(error) {


    console.error(

      "GitHub tree fetch error:",

      error

    );


    return [];

  }

}







/* -------------------------------------------------------
   Get Markdown/File Content
------------------------------------------------------- */


export async function getFileContent(

  path: string,

  repo: string = DEFAULT_REPO

): Promise<string> {


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


      return Buffer

        .from(

          response.data.content,

          "base64"

        )

        .toString("utf-8");


    }



    return "";



  } catch(error) {


    console.error(

      "GitHub content fetch error:",

      error

    );


    return "";

  }

}







/* -------------------------------------------------------
   Get All Public Repositories
------------------------------------------------------- */


export async function getRepositories():

Promise<Repository[]> {


  try {


    const response =

      await octokit.rest.repos.listForUser({

        username: OWNER,

        type: "owner",

        sort: "updated",

        per_page: 100,

      });



    return response.data.map(

      (repo) => ({


        id:

          repo.id,


        name:

          repo.name,


        fullName:

          repo.full_name,


        description:

          repo.description ?? null,


        language:

          repo.language ?? null,


        stars:

          repo.stargazers_count ?? 0,


        updatedAt:

          repo.updated_at ?? "",


        url:

          repo.html_url,


        defaultBranch:

          repo.default_branch ?? "main",


      })

    );



  } catch(error) {


    console.error(

      "Repository fetch error:",

      error

    );


    return [];

  }

}