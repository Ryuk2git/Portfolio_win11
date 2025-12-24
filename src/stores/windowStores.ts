import { create } from "zustand";
import React from "react";
import { WindowId, WindowInstance } from "@/types/winodow";

interface WindowManagerState {
  windows: Record<WindowId, WindowInstance>;
  activeWindowId: WindowId | null;
  highestZIndex: number;

  // lifecycle
  openWindow: (id: WindowId, content?: React.ReactNode) => void;
  closeWindow: (id: WindowId) => void;

  // visibility
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;

  // focus
  focusWindow: (id: WindowId) => void;

  // geometry
  updateWindowPosition: (
    id: WindowId,
    position: { x: number; y: number }
  ) => void;

  updateWindowSize: (
    id: WindowId,
    size: { width: number; height: number }
  ) => void;
}

const Z_INDEX_RESET_THRESHOLD = 10_000;

export const useWindowStore = create<WindowManagerState>((set, get) => ({
  // --------------------------------
  // INITIAL WINDOW REGISTRY
  // --------------------------------
  windows: {
    about: {
      id: "about",
      title: "About Me",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      position: { x: 120, y: 100 },
      size: { width: 520, height: 360 },
      content: null,
    },
    projects: {
      id: "projects",
      title: "Projects",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      position: { x: 160, y: 140 },
      size: { width: 600, height: 420 },
      content: null,
    },
    skills: {
      id: "skills",
      title: "Skills",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      position: { x: 200, y: 180 },
      size: { width: 500, height: 340 },
      content: null,
    },
    contact: {
      id: "contact",
      title: "Contact",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 0,
      position: { x: 240, y: 220 },
      size: { width: 480, height: 320 },
      content: null,
    },
  },

  activeWindowId: null,
  highestZIndex: 1,

  // --------------------------------
  // ACTIONS
  // --------------------------------

  openWindow: (id, content) => {
    const { windows, highestZIndex } = get();

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: highestZIndex,
          content: content ?? windows[id].content,
        },
      },
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          zIndex: 0,
        },
      },
      activeWindowId: activeWindowId === id ? null : activeWindowId,
    });
  },

  minimizeWindow: (id) => {
    const { windows, activeWindowId } = get();

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isMinimized: true,
        },
      },
      activeWindowId: activeWindowId === id ? null : activeWindowId,
    });
  },

  restoreWindow: (id) => {
    const { windows, highestZIndex } = get();

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isMinimized: false,
          isOpen: true,
          zIndex: highestZIndex,
        },
      },
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    });
  },

  maximizeWindow: (id) => {
    const { windows } = get();

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          isMaximized: !windows[id].isMaximized,
        },
      },
    });
  },

  focusWindow: (id) => {
    const { windows, highestZIndex, activeWindowId } = get();

    if (
      activeWindowId === id ||
      !windows[id].isOpen ||
      windows[id].isMinimized
    ) {
      return;
    }

    // Z-index normalization safeguard
    if (highestZIndex > Z_INDEX_RESET_THRESHOLD) {
      const rebasedWindows = Object.fromEntries(
        Object.entries(windows).map(([key, win], index) => [
          key,
          { ...win, zIndex: index + 1 },
        ])
      ) as Record<WindowId, WindowInstance>;

      set({
        windows: rebasedWindows,
        highestZIndex: Object.keys(rebasedWindows).length + 1,
      });
      return;
    }

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          zIndex: highestZIndex,
        },
      },
      activeWindowId: id,
      highestZIndex: highestZIndex + 1,
    });
  },

  // --------------------------------
  // GEOMETRY
  // --------------------------------
  updateWindowPosition: (id, position) => {
    const { windows } = get();
    const win = windows[id];

    if (!win || win.isMaximized) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          position,
        },
      },
    });
  },

  updateWindowSize: (id, size) => {
    const { windows } = get();
    const win = windows[id];

    if (!win || win.isMaximized) return;

    set({
      windows: {
        ...windows,
        [id]: {
          ...win,
          size,
        },
      },
    });
  },
}));
