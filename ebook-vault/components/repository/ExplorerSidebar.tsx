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
          TOP : Repository List (Always Visible)
      ====================================== */}

      <div

        className="
          max-h-72
          overflow-y-auto
          border-b
          p-4
        "

      >

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
            space-y-1
          "

        >

          {
            repositories.map((repo)=>(

              <button

                key={repo.id}

                onClick={() =>
                  onRepositorySelect(repo)
                }

                className={`

                  w-full
                  rounded-md
                  px-3
                  py-2
                  text-left
                  text-sm
                  transition

                  ${
                    selectedRepository?.id === repo.id

                    ? "bg-gray-200 font-semibold"

                    : "hover:bg-gray-100"

                  }

                `}

              >

                {repo.name}

              </button>

            ))
          }


        </div>


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


        {
          !selectedRepository && (

            <p

              className="
                text-sm
                text-gray-400
              "

            >

              Select repository

            </p>

          )
        }





        {
          selectedRepository && (

            <>

              <div

                className="
                  mb-4
                "

              >

                <h3

                  className="
                    text-sm
                    font-semibold
                  "

                >

                  {selectedRepository.name}

                </h3>


                <p

                  className="
                    truncate
                    text-xs
                    text-gray-500
                  "

                >

                  {selectedRepository.fullName}

                </p>


              </div>





              {
                treeLoading && (

                  <p

                    className="
                      text-sm
                      text-gray-500
                    "

                  >

                    Loading files...

                  </p>

                )
              }





              {
                !treeLoading &&
                tree.length > 0 && (

                  <FileTree

                    nodes={tree}

                    onFileSelect={
                      onFileSelect
                    }

                  />

                )
              }





              {
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

                )
              }


            </>

          )
        }


      </div>


    </aside>

  );

}