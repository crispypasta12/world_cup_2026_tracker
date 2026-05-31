interface FlagProps {
  src?: string;        // direct URL from API (area.flag)
  countryCode?: string; // fallback 2-letter ISO code for flagcdn.com
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { w: 20, h: 15, cls: "w-5 h-4" },
  md: { w: 32, h: 24, cls: "w-8 h-6" },
  lg: { w: 48, h: 36, cls: "w-12 h-9" },
};

export default function Flag({ src, countryCode, name, size = "md" }: FlagProps) {
  const { w, h, cls } = sizes[size];

  const imgSrc = src ?? (countryCode
    ? `https://flagcdn.com/${w}x${h}/${countryCode.toLowerCase()}.png`
    : null);

  if (!imgSrc) return <span className={`${cls} inline-block bg-slate-700 rounded-sm shrink-0`} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      width={w}
      height={h}
      alt={name ? `${name} flag` : (countryCode ?? "")}
      className={`${cls} object-cover rounded-sm inline-block shrink-0`}
    />
  );
}
