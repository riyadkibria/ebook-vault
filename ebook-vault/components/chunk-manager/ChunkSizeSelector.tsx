"use client";

import { Layers } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const sizes = [500, 1000, 1500, 2000, 3000, 5000];

export default function ChunkSizeSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Layers size={18} />
      </div>

      <div className="flex flex-col">

        <label
          htmlFor="chunk-size"
          className="text-xs font-medium uppercase tracking-wide text-gray-500"
        >
          Chunk Size
        </label>

        <select
          id="chunk-size"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            mt-1
            rounded-xl
            border
            border-gray-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-gray-800
            outline-none
            transition
            duration-200
            hover:border-blue-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size.toLocaleString()} words
            </option>
          ))}
        </select>

      </div>

    </div>
  );
}