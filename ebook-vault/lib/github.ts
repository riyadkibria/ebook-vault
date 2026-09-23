// File: lib/github.ts

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


  try {


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


        item.path

          ?.toLowerCase()

          .endsWith(".md")


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

export async function getRepositories() {



  try {



    const response =


      await octokit.rest.repos.listForUser({



        username: OWNER,


        type: "owner",


        sort: "updated",


        per_page: 100,



      });




    const repositories = [];




    for (const repo of response.data) {



      repositories.push({



        id: repo.id,



        name: repo.name,



        fullName:

          repo.full_name,



        description:

          repo.description ?? "",



        language:

          repo.language ?? "Unknown",



        stars:

          repo.stargazers_count ?? 0,



        updatedAt:

          repo.updated_at ?? "",



        url:

          repo.html_url,



        defaultBranch:

          repo.default_branch ?? "main",



      });



    }




    return repositories;




  } catch(error) {



    console.error(


      "Repository fetch error:",


      error


    );



    return [];



  }


}