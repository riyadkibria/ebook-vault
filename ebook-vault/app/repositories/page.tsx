// ===========================================================
// app/repositories/page.tsx
// ===========================================================

import {
  getRepositories,
} from "@/lib/github-repos";


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


export default async function RepositoriesPage() {

  const repositories: Repository[] =
    await getRepositories();


  return (

    <main className="
      flex
      min-h-screen
      bg-gray-50
    ">

      {/* =========================
          Left Sidebar
      ========================== */}

      <aside className="
        w-80
        border-r
        bg-white
        p-5
        shadow-sm
      ">


        <div className="
          mb-6
        ">

          <h1 className="
            text-xl
            font-bold
          ">
            GitHub Library
          </h1>


          <p className="
            mt-1
            text-sm
            text-gray-500
          ">
            {repositories.length} repositories
          </p>


        </div>



        <div className="
          space-y-2
          overflow-y-auto
          max-h-[calc(100vh-150px)]
        ">


          {repositories.map((repo) => (

            <a
              key={repo.id}
              href={`#${repo.name}`}
              className="
                group
                block
                rounded-lg
                border
                border-transparent
                p-3
                transition

                hover:border-gray-200
                hover:bg-gray-50
              "
            >


              <div className="
                flex
                items-center
                justify-between
              ">


                <h2 className="
                  truncate
                  font-medium
                  text-gray-900
                  group-hover:text-black
                ">
                  📁 {repo.name}
                </h2>


                <span className="
                  text-xs
                  text-gray-400
                ">
                  ⭐ {repo.stars}
                </span>


              </div>



              <p className="
                mt-1
                truncate
                text-xs
                text-gray-500
              ">
                {repo.language ?? "Unknown"}
              </p>


            </a>

          ))}


        </div>


      </aside>



      {/* =========================
          Main Content
      ========================== */}

      <section className="
        flex-1
        p-8
      ">


        <header className="
          mb-8
        ">


          <h2 className="
            text-3xl
            font-bold
          ">
            Repositories
          </h2>


          <p className="
            mt-2
            text-gray-500
          ">
            Select a repository from the sidebar
          </p>


        </header>



        <div className="
          space-y-6
        ">


          {repositories.map((repo)=>(


            <article
              id={repo.name}
              key={repo.id}
              className="
                rounded-xl
                border
                bg-white
                p-6
                shadow-sm
              "
            >


              <h3 className="
                text-xl
                font-semibold
              ">
                {repo.name}
              </h3>



              <p className="
                mt-2
                text-gray-600
              ">
                {
                  repo.description ??
                  "No description provided."
                }
              </p>



              <div className="
                mt-4
                flex
                gap-5
                text-sm
                text-gray-500
              ">

                <span>
                  ⭐ {repo.stars}
                </span>


                <span>
                  {repo.language ?? "Unknown"}
                </span>


                <span>
                  Branch:
                  {" "}
                  {repo.defaultBranch}
                </span>


              </div>



              <p className="
                mt-3
                text-xs
                text-gray-400
              ">
                Updated:
                {" "}
                {
                  new Date(
                    repo.updatedAt
                  ).toLocaleDateString()
                }
              </p>



              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-4
                  inline-block
                  rounded-lg
                  bg-black
                  px-4
                  py-2
                  text-sm
                  text-white
                  hover:bg-gray-800
                "
              >
                Open GitHub
              </a>


            </article>


          ))}


        </div>


      </section>


    </main>

  );
}