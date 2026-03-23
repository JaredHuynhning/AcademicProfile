import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ detail: "Missing answers object" }, { status: 400 });
    }
    const result = scoreHexaco(answers);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ detail: "Scoring failed" }, { status: 500 });
  }
}
