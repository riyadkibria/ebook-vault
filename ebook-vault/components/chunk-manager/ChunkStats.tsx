"use client";

import type { Chunk } from "@/lib/chunk";
import {
  FileText,
  Type,
  Hash,
  Layers3,
} from "lucide-react";

interface Props {
  chunk?: Chunk;
  total: number;
}

export default function ChunkStats({
  chunk,
  total,
}: Props) {
  if (!chunk) return null;

  const stats = [
    {
      title: "Words",
      value: chunk.words.toLocaleString(),
      icon: Type,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Characters",
      value: chunk.characters.toLocaleString(),
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "AI Tokens",
      value: `~${chunk.estimatedTokens.toLocaleString()}`,
      icon: Hash,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Chunk",
      value: `${chunk.id + 1} / ${total}`,
      icon: Layers3,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ title, value, icon: Icon, color, bg }) => (
        <div
          key={title}
          className="
            rounded-2xl
            border
            border-gray-200/70
            bg-white/80
            p-4
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-200
            hover:-translate-y-1
            hover:shadow-lg
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {title}
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
              </p>
            </div>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
            >
              <Icon className={color} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}