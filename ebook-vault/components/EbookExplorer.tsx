"use client";

import { useState } from "react";
import type { TreeNode } from "@/lib/buildTree";


export default function EbookExplorer({
  tree,
}: {
  tree: TreeNode[];
}) {

  const [selectedFile, setSelectedFile] = useState("");


  function renderTree(nodes: TreeNode[], level = 0) {

    return nodes.map((node) => (

      <div key={node.path}>

        <div
          onClick={() => {
            if (node.type === "file") {
              setSelectedFile(node.path);
            }
          }}
          className="
            cursor-pointer
            hover:bg-gray-100
            rounded
            p-1
          "
          style={{
            paddingLeft: `${level * 20}px`
          }}
        >

          {node.type === "folder"
            ? "📁"
            : "📄"
          }

          {" "}

          {node.name}

        </div>


        {node.children &&
          renderTree(
            node.children,
            level + 1
          )
        }

      </div>

    ));
  }


  return (

    <main className="flex h-screen">


      {/* LEFT SIDEBAR */}

      <aside className="w-1/3 border-r p-4 overflow-auto">

        <h1 className="font-bold text-xl mb-4">
          📚 Ebook Library
        </h1>


        {renderTree(tree)}

      </aside>



      {/* RIGHT CONTENT */}

      <section className="flex-1 p-8">


        {
          selectedFile ?

          <div>

            <h2 className="text-xl font-bold">
              {selectedFile}
            </h2>


            <p className="mt-5">
              Markdown content will appear here
            </p>

          </div>

          :

          <h2>
            Select a markdown file
          </h2>
        }


      </section>


    </main>

  );
}