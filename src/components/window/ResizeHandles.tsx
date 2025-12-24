"use client";

import React from "react";

export type ResizeDirection =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type ResizeHandlesProps = {
  enabled: boolean;
  onResizeStart: (
    direction: ResizeDirection,
    event: React.PointerEvent
  ) => void;
};

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  enabled,
  onResizeStart,
}) => {
  if (!enabled) return null;

  const base =
    "absolute z-50 pointer-events-auto";

  return (
    <>
      {/* Edges */}
      <div
        className={`${base} top-0 left-0 right-0 h-1 cursor-ns-resize`}
        onPointerDown={(e) => onResizeStart("top", e)}
      />
      <div
        className={`${base} bottom-0 left-0 right-0 h-1 cursor-ns-resize`}
        onPointerDown={(e) => onResizeStart("bottom", e)}
      />
      <div
        className={`${base} left-0 top-0 bottom-0 w-1 cursor-ew-resize`}
        onPointerDown={(e) => onResizeStart("left", e)}
      />
      <div
        className={`${base} right-0 top-0 bottom-0 w-1 cursor-ew-resize`}
        onPointerDown={(e) => onResizeStart("right", e)}
      />

      {/* Corners */}
      <div
        className={`${base} top-0 left-0 w-2 h-2 cursor-nwse-resize`}
        onPointerDown={(e) => onResizeStart("top-left", e)}
      />
      <div
        className={`${base} top-0 right-0 w-2 h-2 cursor-nesw-resize`}
        onPointerDown={(e) => onResizeStart("top-right", e)}
      />
      <div
        className={`${base} bottom-0 left-0 w-2 h-2 cursor-nesw-resize`}
        onPointerDown={(e) => onResizeStart("bottom-left", e)}
      />
      <div
        className={`${base} bottom-0 right-0 w-2 h-2 cursor-nwse-resize`}
        onPointerDown={(e) => onResizeStart("bottom-right", e)}
      />
    </>
  );
};
