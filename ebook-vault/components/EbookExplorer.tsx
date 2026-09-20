"use client";

import { useState } from "react";


type FileItem = {
  path: string;
  type: string;
};


type Props = {
  files: FileItem[];
};


export default function EbookExplorer({
  files,
}: Props) {


  const [selected, setSelected] = useState("");


  return (
    <div className="flex h-screen">

      <div className="w-1/3 border-r p-4 overflow-auto">

        <h2 className="font-bold mb-4">
          📚 Library
        </h2>


        {files.map((file) => (

          <div
            key={file.path}
            onClick={() => setSelected(file.path)}
            className="
              cursor-pointer
              hover:bg-gray-100
              p-2
              rounded
            "
          >

            {file.type === "tree"
              ? "📁"
              : "📄"}

            {" "}

            {file.path}

          </div>

        ))}


      </div>


      <div className="flex-1 p-6">

        <h2 className="text-xl font-bold">

          {selected || "Select a file"}

        </h2>


      </div>


    </div>
  );
}