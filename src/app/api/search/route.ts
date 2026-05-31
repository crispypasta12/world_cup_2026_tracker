import { getTeams, getMatches } from "@/lib/api/client";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
    return NextResponse.json({ teams, matches });
  } catch {
    return NextResponse.json({ teams: [], matches: [] });
  }
}
