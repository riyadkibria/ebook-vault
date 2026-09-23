"use client";

import { Menu } from "lucide-react";

interface Props {
  open: () => void;

  position: {
    x: number;
    y: number;
  };

  startDrag: (
    e: React.TouchEvent<HTMLButtonElement>
  ) => void;

  moveDrag: (
    e: React.TouchEvent<HTMLButtonElement>
  ) => void;

  stopDrag: () => void;
}

export default function MobileMenu({
  open,
  position,
  startDrag,
  moveDrag,
  stopDrag,
}: Props) {
  return (
    <button
      onClick={open}
      onTouchStart={startDrag}
      onTouchMove={moveDrag}
      onTouchEnd={stopDrag}
      style={{
        left: position.x,
        top: position.y,
      }}
      className="
        md:hidden
        fixed
        z-50

        h-11
        w-11

        rounded-full

        border
        border-white/60

        bg-white/60

        backdrop-blur-xl

        shadow-[0_8px_30px_rgba(15,23,42,0.12)]

        ring-1
        ring-slate-900/5

        flex

        items-center

        justify-center

        text-slate-700

        transition-all
        duration-200
        ease-out

        active:scale-90
        active:bg-white/80

        hover:shadow-[0_10px_36px_rgba(15,23,42,0.18)]
        hover:ring-slate-900/10
      "
    >
      <Menu size={19} strokeWidth={2.25} />
    </button>
  );
}