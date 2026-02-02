"use client";

import React from "react";
import { Button } from "@/components/ui";

export const CTA: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gray-900 text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-yellow-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">

        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
          Ready to Secure Your <br />
          <span className="text-yellow-400">Vehicle Privacy?</span>
        </h2>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          One-time purchase, no subscriptions. Stick it, Scan it, Secure it.
          Join thousands of smart vehicle owners today.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-10 py-6 h-auto font-bold shadow-lg shadow-yellow-400/20">
            Buy Now on Amazon 🛒
          </Button>
          <Button variant="outline" size="lg" className="border-gray-700 text-white hover:bg-gray-800 text-lg px-10 py-6 h-auto">
            View All Features
          </Button>
        </div>

        <div className="pt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
            One-time Buy
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
            Lifetime Validity
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
            No Hidden Fees
          </span>
        </div>

      </div>
    </section>
  );
};
