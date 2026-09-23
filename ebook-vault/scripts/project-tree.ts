import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "PROJECT_STRUCTURE.md");

const EXCLUDED_FOLDERS = new Set([
  ".git",
  ".next",
  ".vercel",
  ".vscode",
  "node_modules",
  "coverage",
  "dist",
  "build",
  "out",
]);

const EXCLUDED_FILES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  ".DS_Store",
  "Thumbs.db",
]);

const lines: string[] = [];

function walk(directory: string, indent = ""): void {
  const entries = fs
    .readdirSync(directory, {
      withFileTypes: true,
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      EXCLUDED_FOLDERS.has(entry.name)
    ) {
      continue;
    }

    if (
      entry.isFile() &&
      EXCLUDED_FILES.has(entry.name)
    ) {
      continue;
    }

    lines.push(
      `${indent}├── ${entry.name}${
        entry.isDirectory() ? "/" : ""
      }`
    );

    if (entry.isDirectory()) {
      walk(
        path.join(directory, entry.name),
        indent + "│   "
      );
    }
  }
}

lines.push(`# ${path.basename(ROOT)}`);
lines.push("");
lines.push("```text");

walk(ROOT);

lines.push("```");

fs.writeFileSync(
  OUTPUT,
  lines.join("\n"),
  "utf8"
);

console.log("✅ PROJECT_STRUCTURE.md generated");