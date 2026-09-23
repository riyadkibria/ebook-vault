// File: components/home/HomeClient.tsx

"use client";


import {
  useState
} from "react";




import EbookExplorer from "@/components/ebook/EbookExplorer";

import {
  buildTree
} from "@/lib/buildTree";



interface Props {

  repos:any[];

  initialTree:any;

}




export default function HomeClient({

  repos,

  initialTree

}:Props){



  const [

    tree,

    setTree

  ] = useState(

    initialTree

  );




  function handleTreeLoad(

    files:any[]

  ){


    const markdownFiles =

      files.filter(

        (file:any)=>

          file.path

            ?.toLowerCase()

            .endsWith(".md")

      );



    const newTree =

      buildTree(

        markdownFiles

      );



    setTree(

      newTree

    );


  }





  return (

    <main

      className="

        flex

        h-screen

        flex-col

      "

    >



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




        



      </section>





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