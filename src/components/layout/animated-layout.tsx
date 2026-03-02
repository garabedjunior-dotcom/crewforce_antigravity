"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 overflow-auto h-full"
        >
            {children}
        </motion.div>
    );
}

