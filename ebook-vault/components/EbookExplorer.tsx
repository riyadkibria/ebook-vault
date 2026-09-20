"use client";

import { useState } from "react";

type FileItem = {
  path: string;
  type: string;
};


export default function EbookExplorer({
  files,
}: {
  files: FileItem[];
}) {

  const [selectedFile, setSelectedFile] = useState("");

  const markdownFiles = files.filter(
    (file) => file.type === "blob"
  );


  return (

    <main className="flex h-screen">


      {/* LEFT SIDEBAR */}

      <aside className="w-1/3 border-r p-5 overflow-auto">


        <h1 className="text-xl font-bold mb-5">
          📚 Ebook Library
        </h1>


        {markdownFiles.map((file)=>(

          <div

            key={file.path}

            onClick={() =>
              setSelectedFile(file.path)
            }

            className="
              cursor-pointer
              p-2
              rounded
              hover:bg-gray-100
            "

          >

            📄 {file.path}

          </div>


        ))}


      </aside>



      {/* RIGHT CONTENT */}

      <section className="flex-1 p-8">


        {

        selectedFile ?

        (

          <>
          <h2 className="text-2xl font-bold">

            {selectedFile}

          </h2>


          <div className="mt-8">

            Markdown content will appear here

          </div>

          </>

        )

        :

        (

          <h2>
            Select a markdown file
          </h2>

        )

        }


      </section>



    </main>

  );
}