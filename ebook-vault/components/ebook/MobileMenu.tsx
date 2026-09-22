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

        h-10
        w-10

        rounded-full

        border

        bg-white/70

        backdrop-blur-xl

        shadow-lg

        flex

        items-center

        justify-center

        transition

        active:scale-90

        hover:shadow-xl
      "
    >
      <Menu size={18} />
    </button>
  );
}