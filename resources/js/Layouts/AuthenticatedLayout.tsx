import Avisos from '@/Components/Avisos';
import { navegacion, nombresRol } from '@/navegacion';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export default function Authenticated({ children }: PropsWithChildren) {
    const { auth, app } = usePage().props;
    const [abierto, setAbierto] = useState(false);
    const grupos = navegacion.map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || i.roles.includes(auth.user.rol)) })).filter((g) => g.items.length);

    const menu = (
        <nav className="flex flex-1 flex-col gap-6 px-3 py-4" aria-label="Menú principal">
            {grupos.map((g) => (
                <div key={g.titulo}>
                    <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{g.titulo}</p>
                    <ul className="space-y-0.5">
                        {g.items.map((i) => {
                            const activo = route().current(i.activo ?? i.ruta);
                            return (
                                <li key={i.ruta}>
                                    <Link
                                        href={route(i.ruta)}
                                        aria-current={activo ? 'page' : undefined}
                                        className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${activo ? 'bg-marino-700 font-semibold text-white' : 'text-slate-300 hover:bg-marino-700 hover:text-white'}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${activo ? 'bg-turquesa-claro' : 'bg-transparent'}`} aria-hidden />
                                        {i.texto}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );

    const usuario = (
        <div className="border-t border-marino-600 px-6 py-4 text-sm">
            <p className="font-medium text-white">{auth.user.name}</p>
            <p className="text-xs text-slate-400">{nombresRol[auth.user.rol] ?? auth.user.rol}</p>
            <div className="mt-3 flex gap-4">
                <Link href={route('profile.edit')} className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
                    Mi perfil
                </Link>
                <Link href={route('logout')} method="post" as="button" className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
                    Cerrar sesión
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen lg:flex">
            <aside className="hidden w-64 shrink-0 flex-col bg-marino lg:flex">
                <Link href={route('dashboard')} className="px-6 pb-2 pt-6 font-titulo text-lg font-semibold text-white">
                    {app.nombre}
                </Link>
                {menu}
                {usuario}
            </aside>

            <header className="flex items-center justify-between bg-marino px-4 py-3 lg:hidden">
                <Link href={route('dashboard')} className="font-titulo font-semibold text-white">
                    {app.nombre}
                </Link>
                <button type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} className="min-h-10 rounded-lg border border-marino-600 px-3 text-sm text-white">
                    {abierto ? 'Cerrar menú' : 'Menú'}
                </button>
            </header>
            {abierto && (
                <div className="flex flex-col bg-marino lg:hidden">
                    {menu}
                    {usuario}
                </div>
            )}

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
                <div className="mx-auto max-w-6xl">
                    <Avisos />
                    {children}
                </div>
            </main>
        </div>
    );
}
