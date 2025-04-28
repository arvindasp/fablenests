// src/app/api/webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase"; // keep it, we'll use it soon

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // no apiVersion needed here anymore
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body
  const sig = req.headers.get("stripe-signature")!; // <- FIXED here

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle the event
  switch (event.type) {
    case "checkout.session.completed":
  const session = event.data.object as Stripe.Checkout.Session;
  console.log("Checkout completed!", session);

  const email = session.customer_email;
  if (email) {
    const { error } = await supabase
      .from("users")
      .update({ plan: "nestling" })
      .eq("email", email);

    if (error) {
      console.error("Failed to update user plan:", error.message);
    } else {
      console.log(`User ${email} upgraded to Nestling plan.`);
    }
  } else {
    console.error("No email found in session.");
  }
  break;
    
    case "invoice.payment_failed":
      console.log("Payment failed", event.data.object);
      // TODO: Downgrade or notify user here
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response("Success", { status: 200 });
}
