import { cn } from "@/lib/utils";

// Gentle, asymmetric curves — organic rather than a perfect sine wave.
// "top" caps a colored band from above (wavy crest, solid below);
// "bottom" closes it from below (solid above, wavy under-edge).
const PATHS = {
  top: "M0,28 C160,46 340,8 640,20 C920,31 1180,10 1440,26 L1440,48 L0,48 Z",
  bottom: "M0,0 L1440,0 L1440,22 C1220,40 980,8 700,22 C420,36 180,12 0,26 Z",
} as const;

/**
 * Full-width wavy section edge. Color comes from `currentColor`, so pass a
 * text color class (e.g. "text-wash-blush") matching the band it belongs to.
 * The 1px negative margin fuses it to the band, preventing sub-pixel seams.
 */
export function WaveDivider({
  position,
  className,
}: {
  position: "top" | "bottom";
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={cn(
        "block h-7 w-full sm:h-12",
        position === "top" ? "-mb-px" : "-mt-px",
        className,
      )}
    >
      <path fill="currentColor" d={PATHS[position]} />
    </svg>
  );
}
