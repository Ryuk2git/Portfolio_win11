import { ReactNode } from "react";

/**
 * All possible windows in the system.
 * Add new windows ONLY here.
 */
export type WindowId =
  | "about"
  | "projects"
  | "skills"
  | "contact";

/**
 * Single window instance (OS-level model)
 */
export interface WindowInstance {
  id: WindowId;
  title: string;

  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;

  zIndex: number;
  position: { x: number; y: number }; 
  size: { width: number; height: number };

  /**
   * React component rendered inside the window
   */
  content: ReactNode | null;
}
