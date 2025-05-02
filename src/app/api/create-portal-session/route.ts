import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Find the Stripe customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const customerId = customers.data[0].id;

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url }, { status: 200 });

  } catch (err: any) {
    console.error("Error creating portal session:", err.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
