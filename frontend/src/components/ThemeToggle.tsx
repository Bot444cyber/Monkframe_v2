"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-xl border border-border bg-card/50 flex items-center justify-center opacity-0" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-9 h-9 rounded-xl border border-border bg-card/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center group overflow-hidden"
            aria-label="Toggle theme"
        >
            <div className="relative w-4 h-4 overflow-hidden">
                <Sun
                    className={`absolute inset-0 h-4 w-4 transition-all duration-500 transform ${theme === "dark" ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                        }`}
                />
                <Moon
                    className={`absolute inset-0 h-4 w-4 transition-all duration-500 transform ${theme === "dark" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                        }`}
                />
            </div>

            {/* Decorative effect */}
            <span className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
}
