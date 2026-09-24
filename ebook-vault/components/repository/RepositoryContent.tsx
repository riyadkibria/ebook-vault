// ===========================================================
// File: components/repository/RepositoryContent.tsx
// ===========================================================

"use client";

import {
  useEffect,
  useState,
} from "react";

import FileTree from "./FileTree";
import MarkdownReader from "./MarkdownReader";

import {
  buildTree,
  TreeNode,
} from "@/lib/buildTree";

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

interface GithubTreeItem {
  path: string;
  type: "blob" | "tree";
}

interface Props {
  repository: Repository | null;
}

export default function RepositoryContent({
  repository,
}: Props) {

  const [tree, setTree] =
    useState<TreeNode[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<string | null>(null);

  const [content, setContent] =
    useState("");

  const [contentLoading, setContentLoading] =
    useState(false);



  // =====================================================
  // Load Repository Tree
  // =====================================================

  useEffect(() => {

    if (!repository) {

      setTree([]);
      setSelectedFile(null);
      setContent("");

      return;

    }

    // ✅ Fix TypeScript
    const repo = repository;

    async function loadTree() {

      try {

        setLoading(true);

        const response = await fetch(
          `/api/github/tree?repo=${repo.name}&branch=${repo.defaultBranch}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch repository tree"
          );
        }

        const data: GithubTreeItem[] =
          await response.json();

        const structuredTree =
          buildTree(data);

        setTree(structuredTree);

      } catch (error) {

        console.error(
          "Tree error:",
          error
        );

        setTree([]);

      } finally {

        setLoading(false);

      }

    }

    loadTree();

  }, [repository]);



  // =====================================================
  // Load Markdown Content
  // =====================================================

  useEffect(() => {

    if (!repository || !selectedFile) {

      setContent("");

      return;

    }

    // ✅ Fix TypeScript
    const repo = repository;
    const file = selectedFile;

    async function loadContent() {

      try {

        setContentLoading(true);

        const response = await fetch(
          `/api/github/content?repo=${repo.name}&path=${encodeURIComponent(file)}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch markdown"
          );
        }

        const data =
          await response.json();

        setContent(
          data.content ?? ""
        );

      } catch (error) {

        console.error(
          "Markdown error:",
          error
        );

        setContent("");

      } finally {

        setContentLoading(false);

      }

    }

    loadContent();

  }, [
    repository,
    selectedFile,
  ]);



  if (!repository) {

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

  // ✅ Fix TypeScript everywhere below
  const repo = repository;



  return (

    <section
      className="
        flex
        flex-1
        h-screen
        overflow-hidden
        bg-gray-50
      "
    >

      {/* ===================================
          LEFT SIDEBAR
      ==================================== */}

      <aside
        className="
          w-80
          shrink-0
          overflow-y-auto
          border-r
          bg-white
          p-4
        "
      >

        <div className="mb-5">

          <h2
            className="
              text-xl
              font-bold
            "
          >
            {repo.name}
          </h2>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {repo.fullName}
          </p>

        </div>

        {loading && (

          <p className="text-gray-500">

            Loading files...

          </p>

        )}

        {!loading && tree.length > 0 && (

          <FileTree

            nodes={tree}

            onFileSelect={setSelectedFile}

          />

        )}

        {!loading && tree.length === 0 && (

          <p className="text-gray-500">

            No markdown files found.

          </p>

        )}

      </aside>



      {/* ===================================
          MARKDOWN READER
      ==================================== */}

      <main
        className="
          flex-1
          overflow-y-auto
          p-10
        "
      >

        {!selectedFile && (

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-gray-400
            "
          >

            Select a markdown file

          </div>

        )}

        {selectedFile && contentLoading && (

          <div
            className="
              rounded-xl
              border
              bg-white
              p-6
              text-gray-500
            "
          >

            Loading markdown...

          </div>

        )}

        {selectedFile &&
          !contentLoading &&
          content.length > 0 && (

            <MarkdownReader

              content={content}

              fileName={selectedFile}

            />

          )}

        {selectedFile &&
          !contentLoading &&
          content.length === 0 && (

            <div
              className="
                rounded-xl
                border
                bg-white
                p-6
                text-gray-500
              "
            >

              No content found.

            </div>

          )}

      </main>

    </section>

  );

}