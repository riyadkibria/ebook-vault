import { Octokit } from "octokit";


const octokit = new Octokit();


export async function getRepoFiles(){

  const response =
    await octokit.rest.git.getTree({

      owner: "riyadkibria",

      repo: "My-ebook-library",

      tree_sha: "main",

      recursive: "true"

    });


  return response.data.tree;

}