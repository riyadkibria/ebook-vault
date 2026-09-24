// ===========================================================
// app/repositories/page.tsx
// ===========================================================

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  defaultBranch: string;
  url: string;
}

async function getRepositories(): Promise<Repository[]> {
  const response = await fetch(
    "http://localhost:3000/api/github/repos",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
}

export default async function RepositoriesPage() {
  const repositories = await getRepositories();

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-4xl font-bold">
        GitHub Repositories
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {repositories.map((repo) => (
          <article
            key={repo.id}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                {repo.name}
              </h2>

              <p className="text-sm text-gray-500">
                {repo.fullName}
              </p>

              <p className="min-h-12 text-gray-700">
                {repo.description ??
                  "No description provided."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>⭐ {repo.stars}</span>

                <span>
                  {repo.language ?? "Unknown"}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Updated{" "}
                {new Date(
                  repo.updatedAt
                ).toLocaleDateString()}
              </p>

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800"
              >
                View Repository
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
