import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`inline-flex min-h-10 items-center justify-center rounded-lg bg-turquesa px-4 text-sm font-semibold text-white transition-colors hover:bg-turquesa-700 disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}
