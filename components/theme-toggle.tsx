'use client';
import React from "react";
import { useState } from 'react';

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`border-2 border-gray-400 dark:border-gray-700 cursor-pointer hover:border-amber-300 dark:hover:border-blue-800 bg-gray-300 dark:bg-gray-800 min-w-9 max-h-5 rounded-full`}
            onClick={() => {
                setIsOpen(!isOpen)
                setTimeout(() => {
                    setTheme(theme === "light" ? "dark" : "light");
                }, 200);
            }}>
            <div
                className={`bg-blue-50 max-h-4 max-w-4 rounded-full cursor-pointer transform transition-transform duration-200 ${isOpen ? 'translate-x-[100%]' : 'translate-x-0'
                    }`}
            >
                {
                    theme === "light" ?
                        <Sun className="max-h-4 max-w-4 text-amber-500 rounded-full p-0.5 " /> : <Moon className="max-h-4 max-w-4 dark:text-black rounded-full p-0.5" />
                }
            </div>
        </div>
    )
}