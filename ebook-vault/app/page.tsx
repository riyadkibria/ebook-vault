export const dynamic = "force-dynamic";
export const revalidate = 0;


import EbookExplorer from "@/components/EbookExplorer";
import { getRepoTree } from "@/lib/github";
import { buildTree } from "@/lib/buildTree";


export default async function Home(){

  const files =
    await getRepoTree();


  const markdownFiles =
    files.filter(
      (file:any)=>
        file.path.endsWith(".md")
    );


  const tree =
    buildTree(markdownFiles);



  return (

    <EbookExplorer
      tree={tree}
    />

  );

}