import { Octokit } from "octokit";


const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});



export async function getRepoTree() {


  const response =
    await octokit.rest.git.getTree({

      owner: "riyadkibria",

      repo: "My-ebook-library",

      tree_sha: "main",

      recursive: "true",

    });



  return response.data.tree.filter(

    (item) =>

      item.type === "blob" &&

      item.path?.endsWith(".md")

  );

}





export async function getFileContent(
  path:string
){


  try {


    const response =

      await octokit.rest.repos.getContent({

        owner:"riyadkibria",

        repo:"My-ebook-library",

        path,

      });





    if(

      !Array.isArray(response.data)

      &&

      response.data.type === "file"

      &&

      response.data.content

    ){



      return Buffer

        .from(

          response.data.content,

          "base64"

        )

        .toString("utf-8");


    }





    return "";



  }

  catch(error){


    console.error(
      "GitHub content fetch error:",
      error
    );


    return "";

  }


}