import { getMatches } from "@/lib/api/client";
import BracketView from "@/components/bracket/BracketView";

export const revalidate = 120;

export const metadata = {
  title: "Knockout Bracket | WC 2026",
};

const KNOCKOUT_STAGES = [
  "LAST_32",
  "LAST_16",
  "QUARTER_FINALS",
  "SEMI_FINALS",
  "THIRD_PLACE",
  "FINAL",
];

export default async function BracketPage() {
  let matches: import("@/lib/api/types").Match[] = [];
  try {
    const all = await getMatches();
    matches = all.filter((m) => KNOCKOUT_STAGES.includes(m.stage));
  } catch {
    matches = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Knockout Bracket</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Round of 32 through the Final.
        </p>
      </div>

      <BracketView matches={matches} />
    </div>
  );
}
