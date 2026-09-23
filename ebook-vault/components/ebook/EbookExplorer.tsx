"use client";


import type { TreeNode } from "@/lib/buildTree";


import Sidebar from "./Sidebar";

import Reader from "./Reader";

import MobileMenu from "./MobileMenu";


import { useExplorer } from "./hooks/useExplorer";



interface Props {

  tree: TreeNode[];

}




export default function EbookExplorer({

  tree,

}: Props) {



  const {

    // Sidebar

    openFolders,

    toggleFolder,


    // Reader

    selectedFile,

    content,

    loading,

    openFile,


    // Mobile

    mobileOpen,

    openMobileMenu,

    closeMobileMenu,


    // Floating Button

    menuPosition,

    startDrag,

    moveDrag,

    stopDrag,


  } = useExplorer();





  return (


    <main

      className="
        flex
        h-full
        min-h-0
        overflow-hidden
        bg-gray-50
      "

    >



      {/* Mobile Floating Menu */}

      <MobileMenu

        open={openMobileMenu}

        position={menuPosition}

        startDrag={startDrag}

        moveDrag={moveDrag}

        stopDrag={stopDrag}

      />





      {/* Mobile Overlay */}

      {

        mobileOpen && (

          <div

            onClick={closeMobileMenu}

            className="
              fixed
              inset-0
              z-40
              bg-black/30
              md:hidden
            "

          />

        )

      }







      {/* Sidebar */}

      <Sidebar

        tree={tree}

        openFolders={openFolders}

        selectedFile={selectedFile}

        toggleFolder={toggleFolder}

        openFile={openFile}

        mobileOpen={mobileOpen}

        closeMobile={closeMobileMenu}

      />







      {/* Reader */}

      <Reader

        selectedFile={selectedFile}

        content={content}

        loading={loading}

      />




    </main>

  );

}