'use client';

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
    name: string | null;
    color?: string;
    size?: 'sm' | 'md';
    className?: string;
}

export function Avatar({ name, color, size = 'md', className }: AvatarProps) {
    const dims = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white shadow-sm',
                dims,
                className
            )}
            style={{ backgroundColor: color || '#6366f1' }}
            title={name || 'User'}
        >
            {getInitials(name)}
        </div>
    );
}