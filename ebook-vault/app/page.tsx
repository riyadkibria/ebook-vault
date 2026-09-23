export const dynamic = "force-dynamic";

export const revalidate = 0;


import HomeClient from "@/components/home/HomeClient";


import {  
  getRepoTree,  
  getRepositories  
} from "@/lib/github"; 


import {  
  buildTree  
} from "@/lib/buildTree"; 




export default async function Home(){



  const repos =

    await getRepositories();




  const files =

    await getRepoTree();




  const markdownFiles =

    files.filter(

      (file:any)=>

        file.path

          ?.toLowerCase()

          .endsWith(".md")

    );




  const tree =

    buildTree(

      markdownFiles

    );





  return (

    <HomeClient

      repos={repos}

      initialTree={tree}

    />

  );


}