import { NextRequest } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe signature");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("✅ Webhook received:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    console.log("🧾 Checkout Session:", session);

    if (!email) {
      console.error("❌ Missing customer_email in session object");
    } else {
      const { error } = await supabaseAdmin
        .from("users")
        .update({ plan: "nestling" })
        .eq("email", email);

      if (error) {
        console.error("❌ Failed to update Supabase user plan:", error.message);
      } else {
        console.log(`✅ Plan updated to 'nestling' for ${email}`);
      }
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return new Response("OK", { status: 200 });
}

// This export is for Next.js to avoid parsing the request body as JSON
export const config = {
  api: {
    bodyParser: false,
  },
};
