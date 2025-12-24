"use client";

import { useWindowStore } from "@/stores/windowStores";
import { WindowRenderer } from "../window/WindowRenderer";
import { Taskbar } from "../taskbar/taskbar";
import { DesktopIcons } from "./DesktopIcons";

export default function Desktop() {
  // const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <>
      <DesktopIcons />
      <WindowRenderer />
      <Taskbar />
    </>

  );
}
