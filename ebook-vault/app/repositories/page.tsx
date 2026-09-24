// ===========================================================
// app/repositories/page.tsx
// ===========================================================

import {
  getRepositories,
} from "@/lib/github-repos";

import RepositoryExplorer from "@/components/repository/RepositoryExplorer";


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

    <RepositoryExplorer
      repositories={repositories}
    />

  );
}