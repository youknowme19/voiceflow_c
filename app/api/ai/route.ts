export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { routeAIRequest } from "../../../lib/ai_router";

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, model, provider = "openrouter" } = body;
  try {
    const { aiResponse } = await routeAIRequest(messages, {
      provider,
      model
    });
    return NextResponse.json({ choices: [{ message: { content: aiResponse } }] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
