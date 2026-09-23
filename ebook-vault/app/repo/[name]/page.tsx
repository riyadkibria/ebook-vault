import EbookExplorer from "@/components/ebook/EbookExplorer";

import {
  getRepoTree
} from "@/lib/github";

import {
  buildTree
} from "@/lib/buildTree";


interface Props {

  params:{
    name:string;
  };

}



export default async function RepoPage({

  params

}:Props){


  const repoName = params.name;



  const files = await getRepoTree(

    repoName

  );



  const markdownFiles = files.filter(

    (file:any)=>

      file.path
        ?.toLowerCase()
        .endsWith(".md")

  );



  const tree = buildTree(

    markdownFiles

  );



  return (

    <EbookExplorer

      tree={tree}

    />

  );

}