// File location:
// components/chunk-manager/CopyStatus.tsx

"use client";

import { Copy } from "lucide-react";


interface Props {

  copyCount:number;

}


export default function CopyStatus({

  copyCount,

}:Props){

  return (

    <div

      className="
        flex
        items-center
        gap-2
        rounded-full
        bg-green-50
        px-3
        py-1
        text-sm
        font-medium
        text-green-700
      "

    >

      <Copy size={14}/>

      <span>

        Copied {copyCount} {copyCount === 1 ? "time" : "times"}

      </span>


    </div>

  );

}