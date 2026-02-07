"use client";

import React from "react";
import { Button } from "@/fe/components/ui";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative pt-12 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-white dark:bg-black transition-colors duration-300"
    >
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-24 -translate-x-12 w-96 h-96 bg-gray-100 dark:bg-gray-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-400/10 text-yellow-800 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
              <span>🚀</span> Next Gen Parking Tag
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-[1.1]">
              Privacy & Security <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                At Its Best.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              ContactKaro Vehicle Parking Tag. Scan with any camera. Keep your
              contact details private while staying reachable for emergencies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 shadow-yellow-200 dark:shadow-none shadow-xl hover:shadow-2xl hover:shadow-yellow-300 transition-all bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Add to Cart 🛒
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 bg-transparent border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Learn More
              </Button>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-400 font-medium">
              <span>Available on</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png"
                alt="Amazon"
                className="h-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer dark:invert"
              />
            </div>
          </div>

          {/* Visual Content / Mockup */}
          <div className="flex-1 w-full max-w-md lg:max-w-full relative group perspective-1000">
            {/* The Card Mockup */}
            <div className="relative z-10 bg-white dark:bg-gray-950 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                    contact<span className="text-yellow-500">Karo</span>.in
                  </h3>
                  <p className="text-xs text-gray-400 font-medium tracking-wide">
                    SECURE CAR TAG
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
              </div>

              {/* QR Section */}
              <div className="bg-gray-900 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-gray-800 to-gray-900 opacity-90" />
                <div className="relative z-10 w-48 h-48 mx-auto bg-white rounded-xl p-3 flex items-center justify-center shadow-lg">
                  {/* Fake QR */}
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border-4 border-gray-900">
                    <span className="font-mono text-2xl font-bold tracking-widest text-gray-900">
                      QR CODE
                    </span>
                  </div>
                </div>
                <p className="relative z-10 text-gray-400 text-xs mt-4 font-mono tracking-widest">
                  ID: ContactKaro-X001
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-yellow-50 dark:bg-gray-900 text-yellow-800 dark:text-yellow-400">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-lg">
                    !
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">
                      Wrong Parking Alert
                    </span>
                    <span className="text-xs opacity-75">
                      Instant Notification
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-lg">
                    📞
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm">
                      Emergency Contact
                    </span>
                    <span className="text-xs opacity-75">
                      Connect without sharing number
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Background for Mockup */}
            <div className="absolute inset-0 bg-yellow-400 rounded-[2.5rem] rotate-6 scale-95 -z-10 opacity-20 group-hover:rotate-3 transition-transform duration-500 delay-75" />
            <div className="absolute inset-0 bg-gray-900 dark:bg-gray-700 rounded-[2.5rem] -rotate-3 scale-95 -z-20 opacity-5 dark:opacity-20 group-hover:-rotate-1 transition-transform duration-500 delay-100" />
          </div>
        </div>
      </div>
    </section>
  );
};
