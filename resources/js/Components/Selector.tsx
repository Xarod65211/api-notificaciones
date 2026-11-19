import { SelectHTMLAttributes } from 'react';

export default function Selector({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select {...props} className={`control min-h-10 ${className}`}>
            {children}
        </select>
    );
}
