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

  repository: Repository | null;

}



export default function RepositoryContent({

  repository,

}: Props) {



  if (!repository) {

    return (

      <section
        className="
          flex
          flex-1
          items-center
          justify-center
          text-gray-400
        "
      >

        Select a repository

      </section>

    );

  }



  console.log(
    "Content received:",
    repository
  );



  return (

    <section
      className="
        flex-1
        p-8
      "
    >


      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >


        <h2
          className="
            text-3xl
            font-bold
          "
        >

          {repository.name}

        </h2>



        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >

          {repository.fullName}

        </p>



        <p
          className="
            mt-5
            text-gray-700
          "
        >

          {
            repository.description ??
            "No description provided."
          }

        </p>



        <div
          className="
            mt-5
            flex
            gap-5
            text-sm
            text-gray-600
          "
        >

          <span>
            ⭐ {repository.stars}
          </span>


          <span>
            {repository.language ?? "Unknown"}
          </span>


          <span>
            Branch:
            {" "}
            {repository.defaultBranch}
          </span>


        </div>



      </div>


    </section>

  );

}