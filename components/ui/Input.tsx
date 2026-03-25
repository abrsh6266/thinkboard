'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
        <input
            ref={ref}
            className={cn(
                'w-full px-4 py-2.5 rounded-xl border bg-white/70 backdrop-blur text-gray-900 placeholder-gray-400',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                error ? 'border-red-300' : 'border-gray-200',
                className
            )}
            {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
));

Input.displayName = 'Input';