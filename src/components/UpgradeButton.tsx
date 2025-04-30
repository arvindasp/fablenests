"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function UpgradeButton() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to upgrade.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("❌ Checkout failed:", data.error);
        alert("Something went wrong during checkout.");
      }
    } catch (err) {
      console.error("❌ Error creating checkout session:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
