import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      );
    }

    const { planId, userEmail } = await request.json();

    if (!planId || !userEmail) {
      return NextResponse.json(
        { error: "planId and userEmail required" },
        { status: 400 }
      );
    }

    // Map plan IDs to Stripe price IDs
    const priceMap: Record<string, string> = {
      starter: process.env.STRIPE_PRICE_STARTER || "price_starter",
      pro: process.env.STRIPE_PRICE_PRO || "price_pro",
      business: process.env.STRIPE_PRICE_BUSINESS || "price_business",
    };

    const priceId = priceMap[planId];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: userEmail,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
