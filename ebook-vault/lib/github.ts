import { Octokit } from "octokit";

const octokit = new Octokit();

export async function getRepoTree() {

  const response = await octokit.rest.git.getTree({

    owner: "riyadkibria",
    repo: "My-ebook-library",
    tree_sha: "main",
    recursive: "true",

  });


  return response.data.tree;

}


export async function getFileContent(path:string){

  const response =
    await octokit.rest.repos.getContent({

      owner:"riyadkibria",
      repo:"My-ebook-library",
      path,

    });


  if(!Array.isArray(response.data)
      && "content" in response.data){

    return Buffer
      .from(response.data.content,"base64")
      .toString("utf-8");

  }


  return "";
}