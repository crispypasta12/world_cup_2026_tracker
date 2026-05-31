import { fifaToIso } from "@/lib/utils/countryCode";

interface FlagProps {
  countryCode?: string; // FIFA 3-letter code (e.g. "ENG", "BRA") or ISO 2-letter
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { w: 20, h: 15, cls: "w-5 h-4" },
  md: { w: 32, h: 24, cls: "w-8 h-6" },
  lg: { w: 48, h: 36, cls: "w-12 h-9" },
};

export default function Flag({ countryCode, name, size = "md" }: FlagProps) {
  const { w, h, cls } = sizes[size];

  if (!countryCode) {
    return <span className={`${cls} inline-block bg-slate-700 rounded-sm shrink-0`} />;
  }

  // Convert FIFA 3-letter → ISO 2-letter; fall back to lowercasing as-is
  const isoCode = countryCode.length === 3
    ? (fifaToIso(countryCode) ?? countryCode.toLowerCase())
    : countryCode.toLowerCase();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${w}x${h}/${isoCode}.png`}
      srcSet={`https://flagcdn.com/${w * 2}x${h * 2}/${isoCode}.png 2x`}
      width={w}
      height={h}
      alt={name ? `${name} flag` : countryCode}
      className={`${cls} object-cover rounded-sm inline-block shrink-0`}
    />
  );
}
