"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
    >
      {loading ? "Redirecting..." : "Upgrade to Nestling Plan"}
    </button>
  );
}
