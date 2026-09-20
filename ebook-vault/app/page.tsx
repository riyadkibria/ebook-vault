import { Octokit } from "octokit";

async function getRepoTree() {
  const octokit = new Octokit();

  const response = await octokit.rest.git.getTree({
    owner: "riyadkibria",
    repo: "My-ebook-library",
    tree_sha: "main",
    recursive: "true",
  });

  return response.data.tree;
}

export default async function Home() {
  const files = await getRepoTree();

  return (
    <main className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📚 My Ebook Library
      </h1>


      <div className="bg-white rounded-lg shadow p-6">

        {files.map((file) => (

          <div
            key={file.sha}
            className="
              flex
              items-center
              gap-3
              py-2
              px-3
              rounded
              hover:bg-gray-100
              transition
              cursor-pointer
            "
          >

            <span className="text-xl">

              {file.type === "tree"
                ? "📁"
                : "📄"}

            </span>


            <span className="text-gray-800">

              {file.path}

            </span>


          </div>

        ))}

      </div>

    </main>
  );
}