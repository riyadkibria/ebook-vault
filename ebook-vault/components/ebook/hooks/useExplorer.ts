"use client";

import { useRef, useState } from "react";
import { getFileContent } from "@/lib/github";

export function useExplorer() {
  // =====================================================
  // Sidebar State
  // =====================================================

  const [openFolders, setOpenFolders] =
    useState<Set<string>>(new Set());

  // =====================================================
  // Reader State
  // =====================================================

  const [selectedFile, setSelectedFile] =
    useState("");

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // Mobile Drawer
  // =====================================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // =====================================================
  // Floating Menu Position
  // =====================================================

  const [menuPosition, setMenuPosition] =
    useState({
      x: 16,
      y: 16,
    });

  // =====================================================
  // Drag Helpers
  // =====================================================

  const dragging = useRef(false);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  // =====================================================
  // Sidebar
  // =====================================================

  function toggleFolder(path: string) {
    setOpenFolders((prev) => {
      const next = new Set(prev);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }

  // =====================================================
  // File Loader
  // =====================================================

  async function openFile(path: string) {
    try {
      setSelectedFile(path);

      setMobileOpen(false);

      setLoading(true);

      const markdown =
        await getFileContent(path);

      setContent(markdown);
    } catch (error) {
      console.error(error);

      setContent("# Failed to load file");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // Mobile Floating Button
  // =====================================================

  function startDrag(
    e: React.TouchEvent<HTMLButtonElement>
  ) {
    dragging.current = true;

    dragOffset.current = {
      x:
        e.touches[0].clientX -
        menuPosition.x,

      y:
        e.touches[0].clientY -
        menuPosition.y,
    };
  }

  function moveDrag(
    e: React.TouchEvent<HTMLButtonElement>
  ) {
    if (!dragging.current) return;

    setMenuPosition({
      x:
        e.touches[0].clientX -
        dragOffset.current.x,

      y:
        e.touches[0].clientY -
        dragOffset.current.y,
    });
  }

  function stopDrag() {
    dragging.current = false;
  }

  // =====================================================
  // Helpers
  // =====================================================

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function openMobileMenu() {
    setMobileOpen(true);
  }

  // =====================================================
  // Exports
  // =====================================================

  return {
    // Sidebar

    openFolders,
    toggleFolder,

    // Reader

    selectedFile,
    content,
    loading,
    openFile,

    // Mobile

    mobileOpen,
    openMobileMenu,
    closeMobileMenu,

    // Floating Menu

    menuPosition,
    startDrag,
    moveDrag,
    stopDrag,
  };
}