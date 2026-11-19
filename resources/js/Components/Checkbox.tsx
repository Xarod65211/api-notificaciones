import { InputHTMLAttributes } from 'react';

export default function Checkbox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} type="checkbox" className={`h-4 w-4 rounded border-slate-300 text-turquesa focus:ring-turquesa ${className}`} />;
}
