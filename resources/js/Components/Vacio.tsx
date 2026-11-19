import { ReactNode } from 'react';

export default function Vacio({ titulo, children }: { titulo: string; children?: ReactNode }) {
    return (
        <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-700">{titulo}</p>
            {children && <div className="mt-1 text-sm text-slate-500">{children}</div>}
        </div>
    );
}
