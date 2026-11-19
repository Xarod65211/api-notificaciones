import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function Encabezado({ titulo, descripcion, volver, children }: { titulo: string; descripcion?: string; volver?: string; children?: ReactNode }) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                {volver && (
                    <Link href={volver} className="enlace mb-1 inline-block text-sm">
                        Volver
                    </Link>
                )}
                <h1 className="text-2xl font-semibold">{titulo}</h1>
                {descripcion && <p className="mt-1 text-sm text-slate-500">{descripcion}</p>}
            </div>
            {children && <div className="flex flex-wrap gap-2">{children}</div>}
        </div>
    );
}
