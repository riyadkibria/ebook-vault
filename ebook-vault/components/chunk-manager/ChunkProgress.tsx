"use client";

import { BookOpen } from "lucide-react";

interface Props {
  current: number;
  total: number;
}

export default function ChunkProgress({ current, total }: Props) {
  if (total <= 0) return null;

  const position = Math.min(Math.max(current + 1, 1), total);
  const percentage = (position / total) * 100;

  return (
    <div className="mb-4 rounded-xl border border-slate-200/70 bg-white/80 px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
            <BookOpen size={14} strokeWidth={2.25} />
          </div>

          <p className="text-[13px] font-medium tracking-tight text-slate-700">
            Chunk{" "}
            <span className="tabular-nums text-slate-900">{position}</span>
            <span className="text-slate-400"> / </span>
            <span className="tabular-nums text-slate-500">{total}</span>
          </p>
        </div>

        <span className="text-[13px] font-semibold tabular-nums text-sky-600">
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={position}
        aria-valuetext={`Chunk ${position} of ${total}`}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-indigo-400 transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}