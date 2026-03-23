import { hexacoItems } from "@/lib/data/hexaco-items";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(hexacoItems);
}
