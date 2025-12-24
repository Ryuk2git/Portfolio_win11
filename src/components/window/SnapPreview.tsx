"use client";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SnapPreviewProps = {
  rect: Rect | null;
};

export function SnapPreview({ rect }: SnapPreviewProps) {
  if (!rect) return null;

  return (
    <div
      aria-hidden
      className="fixed pointer-events-none z-[9999]
                 border border-blue-500/60
                 bg-blue-500/10"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    />
  );
}
