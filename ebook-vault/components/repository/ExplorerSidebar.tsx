// ===========================================================
// File: components/repository/ExplorerSidebar.tsx
// ===========================================================

"use client";

import {
  Search,
} from "lucide-react";

import {
  useState,
} from "react";


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


  const [

    search,

    setSearch,

  ] = useState("");



  const filteredRepositories =

    repositories.filter(repo =>

      repo.name

        .toLowerCase()

        .includes(

          search.toLowerCase()

        )

    );





  return (


    <aside


      className="

        flex

        h-screen

        w-80

        shrink-0

        flex-col

        border-r

        border-gray-200

        bg-white

      "


    >




      {/* =====================================
          Premium Header
      ====================================== */}



      <div


        className="

          shrink-0

          border-b

          border-gray-200

          p-4

        "


      >



        <div

          className="

            mb-4

            flex

            items-center

            justify-between

          "

        >


          <h2

            className="

              text-base

              font-semibold

              tracking-tight

              text-gray-800

            "

          >

            Ebook Library

          </h2>



          <span

            className="

              rounded-full

              bg-gray-100

              px-2

              py-1

              text-xs

              text-gray-500

            "

          >

            {repositories.length}

          </span>



        </div>






        {/* Search */}



        <div


          className="

            relative

          "


        >


          <Search


            size={16}


            className="

              absolute

              left-3

              top-1/2

              -translate-y-1/2

              text-gray-400

            "


          />



          <input


            value={search}


            onChange={(e)=>

              setSearch(e.target.value)

            }


            placeholder="Search library..."


            className="

              w-full

              rounded-xl

              border

              border-gray-200

              bg-gray-50

              py-2

              pl-9

              pr-3

              text-sm

              outline-none

              transition

              focus:border-gray-400

              focus:bg-white

            "


          />



        </div>







        {/* Repository Select */}



        <select


          value={

            selectedRepository?.id ?? ""

          }


          onChange={(e)=>{


            const repo =

              repositories.find(

                r =>

                r.id === Number(

                  e.target.value

                )

              );



            if(repo){

              onRepositorySelect(repo);

            }


          }}


          className="

            mt-3

            w-full

            rounded-xl

            border

            border-gray-200

            bg-white

            px-3

            py-2

            text-sm

            text-gray-700

            outline-none

            transition

            hover:border-gray-300

          "


        >


          <option value="">


            Select repository


          </option>



          {


            filteredRepositories.map(repo=>(


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
          Tree Explorer
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

                mt-12

                text-center

                text-sm

                text-gray-400

              "


            >


              Choose a repository


            </div>


          )


        }







        {


          selectedRepository && treeLoading && (


            <div


              className="

                rounded-xl

                bg-gray-50

                p-4

                text-sm

                text-gray-500

              "


            >


              Loading files...


            </div>


          )


        }








        {


          selectedRepository &&

          !treeLoading &&

          tree.length > 0 && (


            <div


              className="

                rounded-xl

                border

                border-gray-100

                bg-gray-50/50

                p-2

              "


            >


              <FileTree


                nodes={tree}


                onFileSelect={onFileSelect}


              />


            </div>


          )


        }








        {


          selectedRepository &&

          !treeLoading &&

          tree.length === 0 && (


            <div


              className="

                rounded-xl

                bg-gray-50

                p-4

                text-center

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