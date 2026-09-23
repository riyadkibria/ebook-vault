"use client";

import {
  useEffect,
  useState,
} from "react";

import RepoCard, {
  type Repo,
} from "./RepoCard";

interface Props {
  onSelect: (repo: Repo) => void;
}

export default function RepoList({
  onSelect,
}: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadRepositories();
  }, []);

  async function loadRepositories() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/github/repos",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load repositories."
        );
      }

      const data: Repo[] =
        await response.json();

      setRepos(data);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load repositories."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="
              h-56
              animate-pulse
              rounded-2xl
              border
              bg-gray-100
            "
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-6
          text-red-600
        "
      >
        <p>{error}</p>

        <button
          onClick={loadRepositories}
          className="
            mt-4
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-white
          "
        >
          Retry
        </button>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div
        className="
          rounded-xl
          border
          bg-gray-50
          p-10
          text-center
          text-gray-500
        "
      >
        No repositories containing
        Markdown (.md) files were found.
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {repos.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          onOpen={onSelect}
        />
      ))}
    </div>
  );
}