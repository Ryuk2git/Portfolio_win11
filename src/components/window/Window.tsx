"use client";

import React, { useRef, useState, useEffect, Suspense, useCallback } from "react";
import { WindowInstance } from "@/types/winodow";
import { useWindowStore } from "@/stores/windowStores";
import { appRegistry } from "@/registry/registry";
import { ResizeHandles, ResizeDirection } from "./ResizeHandles";

interface WindowProps {
  window: WindowInstance;
}

type ResizeState = {
  direction: ResizeDirection;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
};



export const Window: React.FC<WindowProps> = ({ window }) => {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const windowRef = useRef<HTMLDivElement>(null);

  // -----------------------------
  // LOCAL DRAG STATE (PHASE 1)
  // -----------------------------
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(isDragging);

  // -----------------------------
  // LOCAL RESIZE STATE (PHASE 3)
  // -----------------------------
  const resizeRef = useRef<ResizeState | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  // -----------------------------
  // DRAG START (TITLE BAR ONLY)
  // -----------------------------
  

  // -----------------------------
  // DRAG MOVE
  // -----------------------------
  // Use refs + stable callbacks so listeners can be added/removed reliably
  const windowStateRef = useRef(window);
  const updateWindowPositionRef = useRef(updateWindowPosition);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    windowStateRef.current = window;
  }, [window]);

  useEffect(() => {
    updateWindowPositionRef.current = updateWindowPosition;
  }, [updateWindowPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;

    const win = windowStateRef.current;
    const viewportWidth = globalThis.innerWidth;
    const viewportHeight = globalThis.innerHeight;
    const TASKBAR_HEIGHT = 48; // keep consistent with resize

    let x = e.clientX - dragOffset.current.x;
    let y = e.clientY - dragOffset.current.y;

    // Clamp left/top
    x = Math.max(0, x);
    y = Math.max(0, y);

    // Clamp right edge
    const maxX = viewportWidth - win.size.width;
    if (x > maxX) x = maxX;

    // Clamp bottom edge (taskbar-aware)
    const maxY = viewportHeight - TASKBAR_HEIGHT - win.size.height;
    if (y > maxY) y = maxY;

    updateWindowPositionRef.current(win.id, { x, y });
  }, []);

  // -----------------------------
  // DRAG END
  // -----------------------------
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // -----------------------------
  // GUARANTEED CLEANUP
  // -----------------------------
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // -----------------------------
  // DRAG START (TITLE BAR ONLY)
  // -----------------------------
  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.isMaximized || isResizing) return;

    e.stopPropagation();

    setIsDragging(true);
    isDraggingRef.current = true;
    focusWindow(window.id);

    dragOffset.current = {
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  // -----------------------------
  // APP + METADATA RESOLUTION
  // -----------------------------
  const appDef = appRegistry[window.id];
  const metadata = appDef?.metadata;

  const isResizable =
    !!metadata?.resizable &&
    !window.isMinimized &&
    !window.isMaximized;

  // -----------------------------
  // RESIZE START
  // -----------------------------
  const onResizeStart = (
    direction: ResizeDirection,
    e: React.PointerEvent
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isResizable || !metadata) return;

    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: window.size.width,
      startHeight: window.size.height,
      startLeft: window.position.x,
      startTop: window.position.y,
    };

    setIsResizing(true);
    windowRef.current?.setPointerCapture(
      e.pointerId
    );
  };

  // -----------------------------
  // RESIZE MOVE / END
  // -----------------------------
  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (
      e: PointerEvent
    ) => {
      const state = resizeRef.current;
      if (!state || !metadata) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      let width = state.startWidth;
      let height = state.startHeight;
      let x = state.startLeft;
      let y = state.startTop;

      if (state.direction.includes("right")) {
        width += dx;
      }
      if (state.direction.includes("left")) {
        width -= dx;
        x += dx;
      }
      if (state.direction.includes("bottom")) {
        height += dy;
      }
      if (state.direction.includes("top")) {
        height -= dy;
        y += dy;
      }

      const minW = metadata.minSize.width;
      const minH = metadata.minSize.height;

      if (width < minW) {
        if (state.direction.includes("left")) {
          x += width - minW;
        }
        width = minW;
      }

      if (height < minH) {
        if (state.direction.includes("top")) {
          y += height - minH;
        }
        height = minH;
      }

      const viewportWidth = globalThis.innerWidth;
      const viewportHeight = globalThis.innerHeight;
      const TASKBAR_HEIGHT = 48;

      // Clamp right edge
      if (x + width > viewportWidth) {
        if (state.direction.includes("right")) {
          width = viewportWidth - x;
        } else {
          x = viewportWidth - width;
        }
      }

      // Clamp bottom edge (taskbar-aware)
      if (y + height > viewportHeight - TASKBAR_HEIGHT) {
        if (state.direction.includes("bottom")) {
          height = viewportHeight - TASKBAR_HEIGHT - y;
        } else {
          y = viewportHeight - TASKBAR_HEIGHT - height;
        }
      }

      // Clamp left/top edges (safety)
      x = Math.max(0, x);
      y = Math.max(0, y);

      updateWindowPosition(window.id, { x, y });
      updateWindowSize(window.id, {
        width,
        height,
      });
    };

    const handlePointerUp = () => {
      resizeRef.current = null;
      setIsResizing(false);
    };

    globalThis.addEventListener(
      "pointermove",
      handlePointerMove
    );
    globalThis.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      globalThis.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      globalThis.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, [ isResizing, metadata, updateWindowPosition, updateWindowSize, window.id ]);

  // -----------------------------
  // FOCUS HANDLER
  // -----------------------------
  const handleFocus = () => {
    focusWindow(window.id);
  };

  // -----------------------------
  // COMPUTED STYLE
  // -----------------------------
  const style: React.CSSProperties =
    window.isMaximized
      ? {
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }
      : {
          top: window.position.y,
          left: window.position.x,
          width: window.size.width,
          height: window.size.height,
        };

  return (
    <div
      ref={windowRef}
      onMouseDown={handleFocus}
      className="absolute pointer-events-auto select-none"
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
    >
      {/* Resize Handles (PHASE 3) */}
      <ResizeHandles
        enabled={isResizable}
        onResizeStart={onResizeStart}
      />

      {/* Window Frame */}
      <div className="flex flex-col w-full h-full rounded-md overflow-hidden bg-neutral-900 border border-neutral-700 shadow-lg">
        {/* Title Bar */}
        <div
          className="flex items-center justify-between h-9 px-2 bg-neutral-800 cursor-move"
          onMouseDown={handleTitleMouseDown}
        >
          <span className="text-sm text-neutral-200 truncate">
            {window.title}
          </span>

          <div className="flex items-center gap-1">
            <button
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              onClick={() =>
                minimizeWindow(window.id)
              }
              className="w-3 h-3 rounded-full bg-yellow-500"
              aria-label="Minimize window"
            />
            <button
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              onClick={() =>
                maximizeWindow(window.id)
              }
              className="w-3 h-3 rounded-full bg-green-500"
              aria-label="Maximize window"
            />
            <button
              onMouseDown={(e) =>
                e.stopPropagation()
              }
              onClick={() =>
                closeWindow(window.id)
              }
              className="w-3 h-3 rounded-full bg-red-500"
              aria-label="Close window"
            />
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 bg-neutral-950 overflow-auto">
          {appDef?.component ? (
            <Suspense
              fallback={
                <div className="p-4 text-sm text-neutral-400">
                  Loading…
                </div>
              }
            >
              {React.createElement(appDef.component)}
            </Suspense>
          ) : null}
        </div>
      </div>
    </div>
  );
};
