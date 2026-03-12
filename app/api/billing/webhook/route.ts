import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      );
    }

    const sig = request.headers.get("stripe-signature");
    const body = await request.text();

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig || "", webhookSecret);
    } catch (error: any) {
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    try {
      switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Get user by email
        const { data: user } = await supabase.auth.admin.listUsers();
        const matchedUser = user?.users.find(
          (u) => u.email === (subscription.metadata?.userId as string)
        );

        if (matchedUser) {
          // Determine plan from subscription
          let credits = 1000; // Starter default
          const lineItem = subscription.items.data[0];
          const priceId = lineItem?.price.id;

          if (priceId === process.env.STRIPE_PRICE_PRO) {
            credits = 10000;
          } else if (priceId === process.env.STRIPE_PRICE_BUSINESS) {
            credits = 30000;
          }

          // Update subscription
          await supabase.from("subscriptions").upsert(
            {
              user_id: matchedUser.id,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              plan_id:
                priceId === process.env.STRIPE_PRICE_PRO
                  ? "pro"
                  : priceId === process.env.STRIPE_PRICE_BUSINESS
                    ? "business"
                    : "starter",
              status: subscription.status,
              current_period_end: new Date(
                (subscription as any).current_period_end * 1000
              ).toISOString(),
            },
            { onConflict: "user_id" }
          );

          // Add/update credits
          await supabase.from("usage_credits").upsert(
            {
              user_id: matchedUser.id,
              credits,
            },
            { onConflict: "user_id" }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Get user and update status
        const { data: user } = await supabase.auth.admin.listUsers();
        const matchedUser = user?.users.find(
          (u) => u.email === (subscription.metadata?.userId as string)
        );

        if (matchedUser) {
          await supabase
            .from("subscriptions")
            .update({ status: "canceled" })
            .eq("user_id", matchedUser.id);

          // Reset credits to starter tier
          await supabase
            .from("usage_credits")
            .update({ credits: 1000 })
            .eq("user_id", matchedUser.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
