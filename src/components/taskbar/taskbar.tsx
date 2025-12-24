"use client";

import React from "react";
import { useWindowStore } from "@/stores/windowStores";
import { WindowInstance } from "@/types/winodow";

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    focusWindow,
    restoreWindow,
  } = useWindowStore();

  /**
   * Convert window registry to a list of open windows.
   * Order does not affect z-index; this is purely visual.
   */
  const openWindows: WindowInstance[] = Object.values(windows).filter(
    (win) => win.isOpen
  );

  if (openWindows.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {openWindows.map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;

          return (
            <button
              key={win.id}
              onClick={() => {
                if (win.isMinimized) {
                  restoreWindow(win.id);
                } else if (activeWindowId !== win.id) {
                  focusWindow(win.id);
                }
              }}
              className={`px-4 h-8 rounded-md text-sm transition-none
                ${
                  isActive
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-800 text-neutral-300"
                }
              `}
              aria-label={`Taskbar item for ${win.title}`}
            >
              {win.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
