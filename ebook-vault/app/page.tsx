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
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Ebook Library
      </h1>

      <div>
        {files.map((file) => (
          <div key={file.sha} className="mb-2">
            {file.type === "tree" ? "📁" : "📄"}{" "}
            {file.path}
          </div>
        ))}
      </div>
    </main>
  );
}