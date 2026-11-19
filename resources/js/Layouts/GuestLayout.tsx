import { usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    const { app } = usePage().props;
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-marino px-4 py-10">
            <p className="font-titulo text-xl font-semibold text-white">{app.nombre}</p>
            <p className="mt-1 text-sm text-slate-300">Sistema de demostración con datos ficticios</p>
            <div className="mt-6 w-full max-w-md rounded-xl bg-white p-6 sm:p-8">{children}</div>
        </div>
    );
}
