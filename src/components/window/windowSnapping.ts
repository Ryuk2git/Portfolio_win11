export type SnapIntent =
  | "none"
  | "fullscreen"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

/* ---------- constants ---------- */

const EDGE_THRESHOLD_X = 40;
const EDGE_THRESHOLD_Y = 40;
const CORNER_THRESHOLD = 60;

/* ---------- detection ---------- */

export function detectSnapIntent(
  x: number,
  y: number,
  vw: number,
  vh: number
): SnapIntent {
  // corners
  if (x <= CORNER_THRESHOLD && y <= CORNER_THRESHOLD) return "top-left";
  if (x >= vw - CORNER_THRESHOLD && y <= CORNER_THRESHOLD) return "top-right";
  if (x <= CORNER_THRESHOLD && y >= vh - CORNER_THRESHOLD)
    return "bottom-left";
  if (x >= vw - CORNER_THRESHOLD && y >= vh - CORNER_THRESHOLD)
    return "bottom-right";

  // fullscreen
  if (y <= EDGE_THRESHOLD_Y) return "fullscreen";

  // halves
  if (x <= EDGE_THRESHOLD_X) return "left";
  if (x >= vw - EDGE_THRESHOLD_X) return "right";

  return "none";
}

/* ---------- geometry ---------- */

export type Geometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function resolveSnapGeometry(
  intent: SnapIntent,
  vw: number,
  vh: number,
  taskbarHeight: number,
  minW: number,
  minH: number,
  current: Geometry
): Geometry {
  const usableH = vh - taskbarHeight;
  let g = current;

  switch (intent) {
    case "fullscreen":
      g = { x: 0, y: 0, width: vw, height: usableH };
      break;

    case "left":
      g = { x: 0, y: 0, width: vw / 2, height: usableH };
      break;

    case "right":
      g = { x: vw / 2, y: 0, width: vw / 2, height: usableH };
      break;

    case "top-left":
      g = { x: 0, y: 0, width: vw / 2, height: usableH / 2 };
      break;

    case "top-right":
      g = { x: vw / 2, y: 0, width: vw / 2, height: usableH / 2 };
      break;

    case "bottom-left":
      g = { x: 0, y: usableH / 2, width: vw / 2, height: usableH / 2 };
      break;

    case "bottom-right":
      g = {
        x: vw / 2,
        y: usableH / 2,
        width: vw / 2,
        height: usableH / 2,
      };
      break;
  }

  return {
    x: g.x,
    y: g.y,
    width: Math.max(g.width, minW),
    height: Math.max(g.height, minH),
  };
}
