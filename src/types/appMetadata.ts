export type AppSize = {
  width: number;
  height: number;
};

export type AppMetadata = {
  /** Human-readable window title */
  title: string;

  /** Optional icon reference (emoji, svg path, or future token) */
  icon?: string;

  /** Default window size on first open */
  defaultSize: AppSize;

  /** Minimum allowed window size */
  minSize: AppSize;

  /** Whether the window can be resized */
  resizable: boolean;
};
