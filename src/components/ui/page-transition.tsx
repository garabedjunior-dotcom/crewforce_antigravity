'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { slideUp } from '@/lib/animations';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
    return (
        <motion.div
            initial={slideUp.initial}
            animate={slideUp.animate}
            exit={slideUp.exit}
            transition={slideUp.transition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
