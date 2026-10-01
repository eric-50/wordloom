"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch {
      setError("Checkout didn’t open. Try again in a moment.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : "Subscribe to Pro ($29/mo)"}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
