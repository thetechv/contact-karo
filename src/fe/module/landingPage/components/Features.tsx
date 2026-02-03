"use client";

import React from "react";
import { FEATURES } from "../constants";

export const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-gray-50 dark:bg-black transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 tracking-tight">
            Why Choose <span className="text-yellow-500">ContactKaro?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Advanced privacy features designed for the modern vehicle owner.
            Safe, secure, and simple.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={`group relative bg-white dark:bg-gray-950 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden`}
            >
              {/* Hover Gradient */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />

              <div className="mb-6 relative">
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <a
                href={feature.learnMore}
                className="inline-flex items-center text-yellow-600 dark:text-yellow-500 font-bold hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors group/link"
              >
                Learn More
                <span className="ml-2 group-hover/link:translate-x-1 transition-transform">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
