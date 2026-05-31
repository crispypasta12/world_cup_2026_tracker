import { getMatches } from "@/lib/api/client";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const matches = await getMatches();
    const today = new Date().toISOString().slice(0, 10);
    const count = matches.filter((m) => m.utcDate.startsWith(today)).length;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
