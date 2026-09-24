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

  onSelect:
    (repo: Repository)=>void;

}



export default function RepositorySidebar({

  repositories,

  selectedRepository,

  onSelect,

}: Props) {


  return (

    <aside
      className="
        w-80
        border-r
        bg-white
        p-5
      "
    >


      <h1
        className="
          mb-5
          text-xl
          font-bold
        "
      >
        GitHub Library
      </h1>



      <div
        className="
          space-y-2
        "
      >


        {
          repositories.map(
            (repo)=>(

              <button

                key={
                  repo.id
                }

                onClick={()=>
                  onSelect(repo)
                }

                className={`
                  w-full
                  rounded-lg
                  p-3
                  text-left
                  transition

                  ${
                    selectedRepository?.id === repo.id

                    ?

                    "bg-black text-white"

                    :

                    "hover:bg-gray-100"
                  }

                `}
              >

                <div
                  className="
                    font-medium
                  "
                >
                  📁 {repo.name}
                </div>


                <div
                  className="
                    mt-1
                    text-xs
                    opacity-70
                  "
                >
                  ⭐ {repo.stars}
                </div>


              </button>

            )
          )
        }


      </div>


    </aside>

  );
}