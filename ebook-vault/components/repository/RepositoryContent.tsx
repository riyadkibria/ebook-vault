interface Repository {

  name: string;

  description: string | null;

  language: string | null;

}



interface Props {

  repository: Repository | null;

}



export default function RepositoryContent({

  repository,

}: Props) {



  if(!repository){

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



  return (

    <section
      className="
        flex-1
        p-8
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
          mt-4
          text-gray-600
        "
      >

        {
          repository.description ??
          "No description"
        }

      </p>


    </section>

  );

}