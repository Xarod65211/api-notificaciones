import { ButtonHTMLAttributes } from 'react';

export default function DangerButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-estado-error px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}
