"use client";

import { BookOpen } from "lucide-react";

interface Props {
  current: number;
  total: number;
}

export default function ChunkProgress({
  current,
  total,
}: Props) {
  if (total === 0) return null;

  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-6 rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-xl shadow-sm">

      <div className="flex items-center justify-between p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>

          <div>

            <p className="text-sm font-semibold text-gray-900">
              Reading Progress
            </p>

            <p className="text-xs text-gray-500">
              Chunk {current + 1} of {total}
            </p>

          </div>

        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {Math.round(percentage)}%
        </span>

      </div>

      <div className="px-4 pb-4">

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}