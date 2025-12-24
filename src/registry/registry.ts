"use client";

import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import { WindowId } from "@/types/winodow";
import { AppMetadata } from "@/types/appMetadata";

/** Lazily mountable app component */
export type AppComponent = LazyExoticComponent<ComponentType<unknown>>;

/** Optional future metadata container (unused in Phase 2) */
export type AppDescriptor = {
  component: AppComponent;
  title: string;
  icon?: string;
};

export type AppDefinition = {
  component: AppComponent;
  metadata: AppMetadata;
};

/** Central WindowId → App mapping (single source of truth) */
export const appRegistry: Record<WindowId, AppDefinition> = {
  about: {
    component: lazy(() => import("@/apps/AboutApp")),
    metadata: {
      title: "About Me",
      icon: "👤",
      defaultSize: { width: 480, height: 320 },
      minSize: { width: 360, height: 240 },
      resizable: true,
    },
  },

  projects: {
    component: lazy(() => import("@/apps/ProjectApp")),
    metadata: {
      title: "Projects",
      icon: "📁",
      defaultSize: { width: 640, height: 420 },
      minSize: { width: 480, height: 320 },
      resizable: true,
    },
  },

  skills: {
    component: lazy(() => import("@/apps/SkillsApp")),
    metadata: {
      title: "Skills",
      icon: "🛠️",
      defaultSize: { width: 520, height: 360 },
      minSize: { width: 400, height: 280 },
      resizable: true,
    },
  },

  contact: {
    component: lazy(() => import("@/apps/ContactApp")),
    metadata: {
      title: "Contact",
      icon: "✉️",
      defaultSize: { width: 420, height: 300 },
      minSize: { width: 360, height: 240 },
      resizable: false,
    },
  },
};

/** Safe resolver used by the Window component */
export function resolveAppComponent(
  id: WindowId
): AppComponent | null {
  const appDef = appRegistry[id];
  return appDef ? appDef.component : null;
}

/** Compile-time guard for WindowId coverage */
export const _exhaustiveCheck: Record<WindowId, true> = {
  about: true,
  projects: true,
  skills: true,
  contact: true,
};
