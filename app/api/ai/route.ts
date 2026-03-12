import { NextResponse } from "next/server";
import { generateAIResponse } from "../../../lib/openrouter";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, model } = body;
  try {
    const result = await generateAIResponse(messages, model);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
