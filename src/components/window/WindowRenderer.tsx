"use client";

import React from "react";
import { useWindowStore } from "@/stores/windowStores";
import { WindowInstance } from "@/types/winodow";
import { Window } from "./Window";

export const WindowRenderer: React.FC = () => {
  /**
   * Select only the data required for rendering.
   * This avoids unnecessary re-renders and keeps concerns clean.
   */
  const windows = useWindowStore((state) => state.windows);

  /**
   * Filter only open windows and sort them by zIndex.
   * Higher zIndex should appear above lower ones.
   */
  const openWindows = React.useMemo<WindowInstance[]>(() => {
     return Object.values(windows)
      .filter((win) => win.isOpen)
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);

  /**
   * Render nothing if no windows are open.
   * This keeps the DOM minimal and avoids unnecessary layers.
   */
  if (openWindows.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden={false}
    >
      {openWindows.map((window) => (
        <Window
          key={window.id}
          window={window}
        />
      ))}
    </div>
  );
};
