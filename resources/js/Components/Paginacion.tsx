import { Link } from '@inertiajs/react';

type Enlace = { url: string | null; label: string; active: boolean };

export default function Paginacion({ links }: { links: Enlace[] }) {
    if (links.length <= 3) return null;
    const limpiar = (t: string) => t.replace('&laquo; Previous', 'Anterior').replace('Next &raquo;', 'Siguiente').replace('&laquo;', '').replace('&raquo;', '');
    return (
        <nav className="flex flex-wrap gap-1 border-t border-slate-200 px-4 py-3" aria-label="Paginación">
            {links.map((l, i) =>
                l.url ? (
                    <Link key={i} href={l.url} preserveScroll className={`min-w-9 rounded-md px-3 py-1.5 text-center text-sm ${l.active ? 'bg-marino text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                        {limpiar(l.label)}
                    </Link>
                ) : (
                    <span key={i} className="min-w-9 px-3 py-1.5 text-center text-sm text-slate-300">
                        {limpiar(l.label)}
                    </span>
                ),
            )}
        </nav>
    );
}
