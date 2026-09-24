// ===========================================================
// File: app/repositories/page.tsx
// ===========================================================

import RepositoryExplorer from "@/components/repository/RepositoryExplorer";

import {
  getRepositories,
} from "@/lib/github-repos";



export default async function RepositoriesPage() {


  const repositories =
    await getRepositories();



  return (

    <RepositoryExplorer

      repositories={repositories}

    />

  );

}