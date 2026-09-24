import {
  getRepositories,
} from "@/lib/github-repos";

import RepositoryExplorer 
from "@/components/repository/RepositoryExplorer";


export default async function RepositoriesPage(){

  const repositories =
    await getRepositories();


  return (
    <RepositoryExplorer
      repositories={repositories}
    />
  );
}