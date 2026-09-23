// app/page.tsx

export const dynamic = "force-dynamic";

export const revalidate = 0;


import RepoContainer from "@/components/repo/RepoContainer";

import EbookExplorer from "@/components/ebook/EbookExplorer";

import { 
  getRepoTree,
  getRepositories
} from "@/lib/github";

import { buildTree } from "@/lib/buildTree";



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

    buildTree(markdownFiles);



  return (


    <main

      className="
        flex
        h-screen
        flex-col
      "

    >



      {/* ---------------- Repository Section ---------------- */}


      <section

        className="
          border-b
          bg-white
          p-6
        "

      >


        <h1

          className="
            mb-4
            text-2xl
            font-bold
          "

        >

          GitHub Repositories

        </h1>



        <RepoContainer

          repos={repos}

        />


      </section>





      {/* ---------------- Ebook Explorer ---------------- */}


      <section

        className="
          min-h-0
          flex-1
        "

      >


        <EbookExplorer

          tree={tree}

        />


      </section>



    </main>


  );

}