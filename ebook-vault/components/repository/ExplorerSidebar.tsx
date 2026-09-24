// ===========================================================
// File: components/repository/ExplorerSidebar.tsx
// ===========================================================

"use client";

import FileTree from "./FileTree";

import {
  TreeNode,
} from "@/lib/buildTree";


interface Repository {

  id: number;

  name: string;

  fullName: string;

  description: string | null;

  language: string | null;

  stars: number;

  updatedAt: string;

  defaultBranch: string;

  url: string;

}


interface Props {

  repositories: Repository[];

  selectedRepository: Repository | null;

  tree: TreeNode[];

  treeLoading: boolean;

  onRepositorySelect: (
    repository: Repository
  ) => void;

  onFileSelect: (
    path: string
  ) => void;

}


export default function ExplorerSidebar({

  repositories,

  selectedRepository,

  tree,

  treeLoading,

  onRepositorySelect,

  onFileSelect,

}: Props) {


  return (

    <aside

      className="
        flex
        w-80
        shrink-0
        flex-col
        border-r
        bg-white
      "

    >


      {/* =====================================
          TOP : Repository Selector
      ====================================== */}

      <div

        className="
          border-b
          p-4
        "

      >


        {!selectedRepository ? (

          <>

            <h2

              className="
                mb-3
                text-lg
                font-bold
              "

            >

              Repositories

            </h2>


            <div

              className="
                max-h-72
                space-y-1
                overflow-y-auto
              "

            >

              {
                repositories.map((repo)=>(

                  <button

                    key={repo.id}

                    onClick={() =>
                      onRepositorySelect(repo)
                    }

                    className="
                      w-full
                      rounded-md
                      px-3
                      py-2
                      text-left
                      text-sm
                      hover:bg-gray-100
                    "

                  >

                    {repo.name}

                  </button>

                ))
              }


            </div>

          </>


        ) : (

          <div>


            <button

              onClick={() =>
                onRepositorySelect(selectedRepository)
              }

              className="
                mb-2
                text-xs
                text-gray-500
                hover:text-black
              "

            >

              Change repository

            </button>


            <h2

              className="
                text-lg
                font-semibold
              "

            >

              {selectedRepository.name}

            </h2>


            <p

              className="
                mt-1
                truncate
                text-xs
                text-gray-500
              "

            >

              {selectedRepository.fullName}

            </p>


          </div>

        )}


      </div>





      {/* =====================================
          BOTTOM : File Tree
      ====================================== */}


      <div

        className="
          flex-1
          overflow-y-auto
          p-4
        "

      >


        {!selectedRepository && (

          <p

            className="
              text-sm
              text-gray-400
            "

          >

            Select repository first

          </p>

        )}



        {selectedRepository && treeLoading && (

          <p

            className="
              text-sm
              text-gray-500
            "

          >

            Loading files...

          </p>

        )}



        {selectedRepository &&
          !treeLoading &&
          tree.length > 0 && (

            <FileTree

              nodes={tree}

              onFileSelect={
                onFileSelect
              }

            />

        )}



        {selectedRepository &&
          !treeLoading &&
          tree.length === 0 && (

            <p

              className="
                text-sm
                text-gray-500
              "

            >

              No markdown files

            </p>

        )}


      </div>


    </aside>

  );

}