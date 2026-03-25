'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
        </div>
    );
}