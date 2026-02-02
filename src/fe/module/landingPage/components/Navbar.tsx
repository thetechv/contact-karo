"use client";

import React, { useState } from "react";
import { Button, ThemeToggle } from "@/fe/components/ui";

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-50">
                        Contact<span className="text-yellow-500">Karo</span>
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Home</a>
                    <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">How It Works</a>
                    <ThemeToggle />
                </div>

                {/* Mobile Icons */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
                    <a href="#" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-gray-50 dark:border-gray-800">Home</a>
                    <a href="#features" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-gray-50 dark:border-gray-800">Features</a>
                    <a href="#how-it-works" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2 border-b border-gray-50 dark:border-gray-800">How It Works</a>
                </div>
            )}
        </nav>
    );
};
