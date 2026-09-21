import { NextResponse } from "next/server";

import { getRepoTree } from "@/lib/github";
import { buildTree } from "@/lib/buildTree";


export async function GET(){

  const files =
    await getRepoTree();


  const markdownFiles =
    files.filter(
      (file:any)=>
        file.path.endsWith(".md")
    );


  const tree =
    buildTree(markdownFiles);



  return NextResponse.json(tree);

}