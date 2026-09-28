// ===========================================================
// File: components/repository/RepositoryExplorer.tsx
// ===========================================================

"use client";

import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Menu,
  PanelLeft,
  X,
} from "lucide-react";

import ExplorerSidebar from "./ExplorerSidebar";
import MarkdownReader from "./MarkdownReader";

import { buildTree, TreeNode } from "@/lib/buildTree";

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
  repositories: Repository[];
}

export default function RepositoryExplorer({ repositories }: Props) {
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  const [tree, setTree] = useState<TreeNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [markdown, setMarkdown] = useState("");
  const [markdownLoading, setMarkdownLoading] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const scrollRef = useRef<HTMLElement | null>(null);

  // =======================================
  // Load Repository Tree
  // =======================================

  useEffect(() => {
    if (!selectedRepository) {
      setTree([]);
      setSelectedFile(null);
      setMarkdown("");
      return;
    }

    const repo = selectedRepository;
    const controller = new AbortController();

    async function loadTree() {
      try {
        setTreeLoading(true);

        const response = await fetch(
          `/api/github/tree?repo=${repo.name}&branch=${repo.defaultBranch}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load repository tree");
        }

        const data: GithubTreeItem[] = await response.json();

        setTree(buildTree(data));
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        console.error("Tree error:", error);
        setTree([]);
      } finally {
        if (!controller.signal.aborted) {
          setTreeLoading(false);
        }
      }
    }

    loadTree();

    return () => controller.abort();
  }, [selectedRepository]);

  // =======================================
  // Load Markdown Content
  // =======================================

  useEffect(() => {
    if (!selectedRepository || !selectedFile) {
      setMarkdown("");
      return;
    }

    const repo = selectedRepository;
    const file = selectedFile;
    const controller = new AbortController();

    async function loadMarkdown() {
      try {
        setMarkdownLoading(true);

        const response = await fetch(
          `/api/github/content?repo=${repo.name}&path=${encodeURIComponent(file)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch markdown");
        }

        const data = await response.json();

        setMarkdown(data.content ?? "");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        console.error("Markdown error:", error);
        setMarkdown("");
      } finally {
        if (!controller.signal.aborted) {
          setMarkdownLoading(false);
        }
      }
    }

    loadMarkdown();

    return () => controller.abort();
  }, [selectedRepository, selectedFile]);

  // =======================================
  // UI Effects
  // =======================================

  // Jump back to the top whenever a new file opens
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setReadProgress(0);
  }, [selectedFile]);

  // Close the drawer with Escape and lock page scroll while it is open
  useEffect(() => {
    if (!mobileSidebarOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const max = el.scrollHeight - el.clientHeight;
    setReadProgress(max > 0 ? Math.min(el.scrollTop / max, 1) : 0);
  }

  function handleRepositorySelect(repo: Repository) {
    setSelectedRepository(repo);
    setSelectedFile(null);
    setMarkdown("");
    setMobileSidebarOpen(false);
  }

  const pathSegments = selectedFile ? selectedFile.split("/") : [];
  const fileTitle = pathSegments[pathSegments.length - 1];

  return (
    <main className="relative flex h-screen overflow-hidden bg-neutral-50 text-neutral-900 antialiased">
      {/* ===================================== */}
      {/* Mobile Top Bar                        */}
      {/* ===================================== */}

      <header className="fixed inset-x-0 top-0 z-30 flex h-11 items-center gap-1.5 border-b border-neutral-200 bg-white/85 px-2 backdrop-blur-xl md:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open file browser"
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <Menu size={17} strokeWidth={1.75} />
        </button>

        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="truncate text-[13px] font-semibold tracking-tight text-neutral-900">
            {fileTitle ?? "Ebook Library"}
          </span>

          {selectedRepository && fileTitle && (
            <span className="truncate text-[11px] text-neutral-500">
              {selectedRepository.name}
            </span>
          )}
        </div>
      </header>

      {/* ===================================== */}
      {/* Sidebar                               */}
      {/* ===================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full border-r border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10 md:shadow-none">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close file browser"
            className="absolute right-2 top-2 z-50 flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 md:hidden"
          >
            <X size={16} strokeWidth={1.75} />
          </button>

          <ExplorerSidebar
            repositories={repositories}
            selectedRepository={selectedRepository}
            tree={tree}
            treeLoading={treeLoading}
            onRepositorySelect={handleRepositorySelect}
            onFileSelect={(file) => {
              setSelectedFile(file);
              setMobileSidebarOpen(false);
            }}
          />
        </div>
      </aside>

      {/* Mobile Overlay */}

      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-neutral-950/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ===================================== */}
      {/* Reader Column                         */}
      {/* ===================================== */}

      <div className="relative flex min-w-0 flex-1 flex-col pt-11 md:pt-0">
        {/* Desktop Breadcrumb Bar */}

        <div className="hidden h-9 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white/80 px-[1.5vw] backdrop-blur-xl md:flex">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1 text-xs"
          >
            {selectedRepository ? (
              <>
                <span className="shrink-0 font-medium text-neutral-900">
                  {selectedRepository.name}
                </span>

                {pathSegments.map((segment, index) => {
                  const isLast = index === pathSegments.length - 1;

                  return (
                    <span
                      key={`${segment}-${index}`}
                      className="flex min-w-0 items-center gap-1"
                    >
                      <ChevronRight
                        size={12}
                        className="shrink-0 text-neutral-300"
                      />

                      <span
                        className={`truncate ${
                          isLast
                            ? "font-medium text-neutral-900"
                            : "text-neutral-500"
                        }`}
                      >
                        {segment}
                      </span>
                    </span>
                  );
                })}
              </>
            ) : (
              <span className="text-neutral-500">Ebook Library</span>
            )}
          </nav>

          {selectedRepository && (
            <a
              href={selectedRepository.url}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <ExternalLink size={12} strokeWidth={1.75} />
              Open on GitHub
            </a>
          )}
        </div>

        {/* Reading progress */}

        {selectedFile && !markdownLoading && markdown && (
          <div className="absolute inset-x-0 top-11 z-20 h-0.5 bg-transparent md:top-9">
            <div
              className="h-full origin-left bg-neutral-900 transition-transform duration-150 ease-out"
              style={{ transform: `scaleX(${readProgress})` }}
            />
          </div>
        )}

        {/* Scroll area */}

        <section
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="mx-auto flex min-h-full w-full flex-col px-3 py-3 md:max-w-[82vw] md:px-[1.5vw] md:py-[1.5vw]">
            {/* Empty: nothing selected */}

            {!selectedFile && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200">
                  {selectedRepository ? (
                    <BookOpen
                      size={17}
                      strokeWidth={1.5}
                      className="text-neutral-400"
                    />
                  ) : (
                    <FolderGit2
                      size={17}
                      strokeWidth={1.5}
                      className="text-neutral-400"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
                    {selectedRepository
                      ? "Pick a file to start reading"
                      : "Choose a repository"}
                  </h2>

                  <p className="max-w-[16rem] text-xs leading-relaxed text-neutral-500">
                    {selectedRepository
                      ? `Browse the markdown files in ${selectedRepository.name} from the sidebar.`
                      : "Select a repository from the sidebar to browse its markdown files."}
                  </p>
                </div>

                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 md:hidden"
                >
                  <PanelLeft size={14} strokeWidth={1.75} />
                  {selectedRepository ? "Browse files" : "Browse repositories"}
                </button>
              </div>
            )}

            {/* Loading skeleton */}

            {selectedFile && markdownLoading && (
              <div
                role="status"
                aria-live="polite"
                className="animate-pulse space-y-5 rounded-xl bg-white p-4 ring-1 ring-neutral-200 md:p-[1.5vw]"
              >
                <span className="sr-only">Loading markdown</span>

                <div className="h-6 w-1/2 rounded-md bg-neutral-200/80" />

                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-neutral-200/70" />
                  <div className="h-3 w-11/12 rounded bg-neutral-200/70" />
                  <div className="h-3 w-full rounded bg-neutral-200/70" />
                  <div className="h-3 w-3/4 rounded bg-neutral-200/70" />
                </div>

                <div className="h-24 w-full rounded-lg bg-neutral-200/60" />

                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-neutral-200/70" />
                  <div className="h-3 w-5/6 rounded bg-neutral-200/70" />
                  <div className="h-3 w-2/3 rounded bg-neutral-200/70" />
                </div>
              </div>
            )}

            {/* Content */}

            {selectedFile && !markdownLoading && markdown && (
              <article className="rounded-xl bg-white p-4 ring-1 ring-neutral-200 md:p-[1.75vw]">
                <MarkdownReader fileName={selectedFile} content={markdown} />
              </article>
            )}

            {/* Empty file / error */}

            {selectedFile && !markdownLoading && !markdown && (
              <div className="flex flex-1 flex-col items-center justify-center gap-1 py-12 text-center">
                <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
                  This file is empty or couldn&apos;t be loaded
                </h2>

                <p className="max-w-[16rem] text-xs leading-relaxed text-neutral-500">
                  Try opening it again, or pick another file from the sidebar.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}