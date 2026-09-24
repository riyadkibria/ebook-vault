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
        h-screen
        w-80
        shrink-0
        flex-col
        border-r
        bg-white
      "

    >


      {/* =====================================
          Repository Header
      ====================================== */}

      <div

        className="
          shrink-0
          border-b
          p-3
        "

      >

        <h2

          className="
            mb-2
            text-sm
            font-bold
            uppercase
            text-gray-700
          "

        >

          Library

        </h2>


        <select

          value={
            selectedRepository?.id ?? ""
          }

          onChange={(e)=>{

            const repo =
              repositories.find(
                r =>
                r.id === Number(e.target.value)
              );

            if(repo){

              onRepositorySelect(repo);

            }

          }}

          className="
            w-full
            rounded-md
            border
            px-3
            py-2
            text-sm
            outline-none
          "

        >

          <option value="">

            Select repository

          </option>


          {
            repositories.map(repo=>(

              <option

                key={repo.id}

                value={repo.id}

              >

                {repo.name}

              </option>

            ))
          }


        </select>


      </div>





      {/* =====================================
          File Tree Area
          (Main Sidebar Content)
      ====================================== */}


      <div

        className="
          flex-1
          overflow-y-auto
          p-3
        "

      >


        {
          !selectedRepository && (

            <div

              className="
                mt-10
                text-center
                text-sm
                text-gray-400
              "

            >

              Select a repository

            </div>

          )
        }





        {
          selectedRepository && treeLoading && (

            <div

              className="
                text-sm
                text-gray-500
              "

            >

              Loading tree...

            </div>

          )
        }





        {
          selectedRepository &&
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
          selectedRepository &&
          !treeLoading &&
          tree.length === 0 && (

            <div

              className="
                text-sm
                text-gray-500
              "

            >

              No markdown files found

            </div>

          )
        }


      </div>


    </aside>

  );

}