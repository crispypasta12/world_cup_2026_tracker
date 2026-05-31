import { NextRequest } from "next/server";
import { fetchH2H } from "@/lib/utils/h2h";

export type { H2HMatch } from "@/lib/utils/h2h";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const home = searchParams.get("home");
  const away = searchParams.get("away");
  const limit = Math.min(Number(searchParams.get("limit") ?? "10"), 20);

  if (!home || !away) {
    return Response.json({ error: "home and away query params required" }, { status: 400 });
  }

  try {
    const matches = await fetchH2H(home, away, limit);
    return Response.json({ matches });
  } catch {
    return Response.json({ matches: [] });
  }
}
