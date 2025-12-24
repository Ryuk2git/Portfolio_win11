"use client";

import React from "react";
import { useWindowStore } from "@/stores/windowStores";
import { WindowInstance } from "@/types/winodow";

export const DesktopIcons: React.FC = () => {
  const { windows, openWindow } = useWindowStore();

  /**
   * Desktop icons are derived from the window registry.
   * Order here is purely visual.
   */
  const desktopWindows: WindowInstance[] = Object.values(windows);

  return (
    <div className="absolute inset-0 p-4">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          maxWidth: 320,
        }}
      >
        {desktopWindows.map((win) => (
          <div
            key={win.id}
            onDoubleClick={() => openWindow(win.id)}
            className="flex flex-col items-center justify-center text-neutral-200 cursor-default select-none"
            aria-label={`Desktop icon for ${win.title}`}
          >
            {/* Icon Placeholder */}
            <div className="w-12 h-12 mb-1 rounded bg-neutral-700 flex items-center justify-center">
              <span className="text-xs">APP</span>
            </div>

            {/* Label */}
            <span className="text-xs text-center truncate w-full">
              {win.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
