import React from "react";
import clsx from "clsx";

type Breakpoint = "sm" | "md" | "lg";

function bpFlexRow(breakpoint: Breakpoint) {
  switch (breakpoint) {
    case "sm":
      return "sm:flex-row";
    case "md":
      return "md:flex-row";
    case "lg":
    default:
      return "lg:flex-row";
  }
}

export default function CTAGroup({
  children,
  breakpoint = "lg",
  gap = 3,
  mobilePadding = true,
  className,
}: {
  children: React.ReactNode;
  breakpoint?: Breakpoint;
  gap?: 2 | 3 | 4 | 5 | 6;
  mobilePadding?: boolean;
  className?: string;
}) {
  const gapClass = `gap-${gap}`;
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center",
        bpFlexRow(breakpoint),
        gapClass,
        mobilePadding && "px-3 sm:px-0",
        className
      )}
    >
      {children}
    </div>
  );
}

