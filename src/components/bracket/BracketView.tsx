import type { Match } from "@/lib/api/types";
import BracketSlot from "./BracketSlot";

interface BracketViewProps {
  matches: Match[];
}

const KNOCKOUT_STAGES = [
  { key: "LAST_32", label: "Round of 32", slots: 16 },
  { key: "LAST_16", label: "Round of 16", slots: 8 },
  { key: "QUARTER_FINALS", label: "Quarter-Finals", slots: 4 },
  { key: "SEMI_FINALS", label: "Semi-Finals", slots: 2 },
  { key: "FINAL", label: "Final", slots: 1 },
];

export default function BracketView({ matches }: BracketViewProps) {
  const byStage = new Map<string, Match[]>();
  for (const m of matches) {
    if (!byStage.has(m.stage)) byStage.set(m.stage, []);
    byStage.get(m.stage)!.push(m);
  }

  const presentStages = KNOCKOUT_STAGES.filter(
    (s) => byStage.has(s.key) || s.key === "LAST_32"
  );

  if (presentStages.length === 0) {
    return (
      <div className="text-center text-slate-500 py-16">
        Knockout stage bracket will appear once the group stage is complete.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max items-start">
        {presentStages.map((stage) => {
          const stageMatches = byStage.get(stage.key) ?? [];
          const slots = Array.from({ length: stage.slots });

          return (
            <div key={stage.key} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                {stage.label}
              </h3>
              <div
                className="flex flex-col"
                style={{ gap: `${Math.max(8, 80 / stage.slots)}px` }}
              >
                {slots.map((_, i) => (
                  <BracketSlot
                    key={i}
                    match={stageMatches[i]}
                    placeholder={`Match ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
