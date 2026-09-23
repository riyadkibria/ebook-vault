export const dynamic = "force-dynamic";
export const revalidate = 0;

import RepoList from "@/components/repo/RepoList";

import EbookExplorer from "@/components/ebook/EbookExplorer";

import { getRepoTree } from "@/lib/github";
import { buildTree } from "@/lib/buildTree";

import type { Repo } from "@/components/repo/RepoCard";

export default async function Home() {
  const files = await getRepoTree();

  const markdownFiles = files.filter(
    (file: any) =>
      file.path.endsWith(".md")
  );

  const tree = buildTree(markdownFiles);

  function handleRepoSelect(
    repo: Repo
  ) {
    console.log(
      "Selected repository:",
      repo
    );

    /*
      Next step we'll replace this with:

      router.push(`/repo/${repo.name}`);

      so EbookExplorer loads the
      selected repository instead
      of the default one.
    */
  }

  return (
    <main
      className="
        flex
        h-screen
        flex-col
      "
    >
      {/* ---------------- Repository List ---------------- */}

      <section
        className="
          border-b
          bg-white
          p-6
        "
      >
        <h1
          className="
            mb-4
            text-2xl
            font-bold
          "
        >
          GitHub Repositories
        </h1>

        <RepoList
          onSelect={handleRepoSelect}
        />
      </section>

      {/* ---------------- Existing EbookExplorer ---------------- */}

      <section
        className="
          min-h-0
          flex-1
        "
      >
        <EbookExplorer
          tree={tree}
        />
      </section>
    </main>
  );
}