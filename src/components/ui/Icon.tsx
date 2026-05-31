import type { SVGProps } from "react";

type IconName =
  | "arrow-right"
  | "calendar"
  | "chevron-right"
  | "clock"
  | "download"
  | "flag"
  | "map-pin"
  | "search"
  | "shield"
  | "spark"
  | "star"
  | "stadium"
  | "trophy"
  | "users";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const paths: Record<IconName, string[]> = {
  "arrow-right": ["M5 12h14", "M13 6l6 6-6 6"],
  calendar: [
    "M8 3v4",
    "M16 3v4",
    "M4 9h16",
    "M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  ],
  "chevron-right": ["M9 18l6-6-6-6"],
  clock: ["M12 7v5l3 2", "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
  download: [
    "M12 3v12",
    "M8 11l4 4 4-4",
    "M5 21h14a2 2 0 0 0 2-2v-3",
    "M3 16v3a2 2 0 0 0 2 2",
  ],
  flag: ["M5 21V4", "M5 4h12l-2 5 2 5H5"],
  "map-pin": ["M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z", "M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"],
  search: ["M21 21l-4.35-4.35", "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"],
  spark: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"],
  star: [
    "M12 3.5l2.4 5.1 5.6.7-4.1 3.9 1.1 5.5-5-2.8-5 2.8 1.1-5.5L4 9.3l5.6-.7L12 3.5Z",
  ],
  stadium: [
    "M4 11c1.9-2.4 4.7-4 8-4s6.1 1.6 8 4",
    "M5 11v6c0 2.2 3.1 4 7 4s7-1.8 7-4v-6",
    "M8 13c1 .8 2.4 1.3 4 1.3s3-.5 4-1.3",
    "M8 17c1 .8 2.4 1.3 4 1.3s3-.5 4-1.3",
  ],
  trophy: [
    "M8 4h8v4a4 4 0 0 1-8 0V4Z",
    "M9 18h6",
    "M10 14v4",
    "M14 14v4",
    "M6 6H4a2 2 0 0 0 2 4",
    "M18 6h2a2 2 0 0 1-2 4",
  ],
  users: ["M16 21v-2a4 4 0 0 0-8 0v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
};

export default function Icon({ name, className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      {...props}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
