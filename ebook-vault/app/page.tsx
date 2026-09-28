import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Ebook Vault</h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/repositories"
            className="rounded-lg border px-6 py-3 hover:bg-gray-100 transition"
          >
            Repositories
          </Link>

          <Link
            href="/copied-chunk"
            className="rounded-lg border px-6 py-3 hover:bg-gray-100 transition"
          >
            Copied Chunks
          </Link>
        </div>
      </div>
    </main>
  );
}