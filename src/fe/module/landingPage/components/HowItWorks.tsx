"use client";

import React from "react";
import { HOW_IT_WORKS_STEPS, SECURITY_FEATURES } from "../constants";

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-white dark:bg-black overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Content & Steps */}
          <div className="order-2 lg:order-1">
            <div className="mb-12">
              <span className="text-yellow-500 font-bold tracking-wider uppercase text-sm">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-2 mb-6">
                Simple, Secure, <br /> and Smart.
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Protecting your privacy hasn't been this easy. Three simple
                steps to peace of mind.
              </p>
            </div>

            <div className="space-y-8">
              {HOW_IT_WORKS_STEPS.map((step, idx) => (
                <div key={step.id} className="flex gap-6 group">
                  <div className="shrink-0 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-3xl shadow-sm border border-gray-100 dark:border-gray-800 group-hover:bg-yellow-400 group-hover:text-white transition-colors duration-300">
                      {step.icon}
                    </div>
                    {idx !== HOW_IT_WORKS_STEPS.length - 1 && (
                      <div className="absolute top-14 left-7 w-px h-full bg-gray-200 dark:bg-gray-800 -z-10" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Pills */}
            <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">
                Security Features
              </h4>
              <div className="flex flex-wrap gap-3">
                {SECURITY_FEATURES.map((feat, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-colors cursor-default"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 bg-gray-900 dark:bg-gray-950 rounded-[3rem] p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gray-800 dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-700 dark:border-gray-800">
                <div className="bg-white dark:bg-black rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  {/* Abstract glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400 rounded-full blur-[60px] opacity-40"></div>

                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-gray-900 dark:bg-gray-800 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">🛡️</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      ContactKaro
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-mono">
                      SECURE TAG ID
                    </p>

                    <div className="space-y-3 text-left">
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                          <span className="block font-bold text-sm">
                            Wrong Parking
                          </span>
                          <span className="text-xs opacity-70">
                            Scan to notify owner
                          </span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20 flex items-center gap-3">
                        <span className="text-xl">💬</span>
                        <div>
                          <span className="block font-bold text-sm">
                            Contact Owner
                          </span>
                          <span className="text-xs opacity-70">
                            Privacy protected
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annotation */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm font-medium">
                    Scan the tag to instantly <br /> connect without sharing
                    numbers.
                  </p>
                </div>
              </div>
            </div>

            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
