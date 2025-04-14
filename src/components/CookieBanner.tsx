"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-[#eee3ce] text-center p-3 shadow-inner text-sm z-40">
      <p>
        We use cookies to enhance your experience.
        <button
          onClick={acceptCookies}
          className="underline font-semibold ml-1"
        >
          Got it
        </button>
      </p>
    </div>
  );
}
