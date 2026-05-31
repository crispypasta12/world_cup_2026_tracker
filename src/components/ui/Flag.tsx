interface FlagProps {
  countryCode: string;
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
  const code = countryCode.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${w}x${h}/${code}.png`}
      srcSet={`https://flagcdn.com/${w * 2}x${h * 2}/${code}.png 2x`}
      width={w}
      height={h}
      alt={name ? `${name} flag` : countryCode}
      className={`${cls} object-cover rounded-sm inline-block shrink-0`}
    />
  );
}
