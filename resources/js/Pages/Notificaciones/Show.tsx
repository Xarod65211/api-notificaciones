import Encabezado from '@/Components/Encabezado';
import Estado from '@/Components/Estado';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { textoEstado, tonoEstado } from '@/navegacion';
import { Head, router, usePage } from '@inertiajs/react';

type N = {
    id: number; sistema: string; evento: string; asunto: string; cuerpo: string; para: string[]; cc: string[] | null; clave: string | null;
    estado: string; intentos: number; ultimo_error: string | null; creada: string; enviada: string | null;
};

export default function Show({ n, vistaPrevia }: { n: N; vistaPrevia: string }) {
    const admin = usePage().props.auth.user.rol === 'admin';
    const datos: [string, string | null][] = [
        ['Sistema', n.sistema], ['Evento', n.evento], ['Para', n.para.join(', ')], ['Con copia', n.cc?.join(', ') || null],
        ['Clave de idempotencia', n.clave], ['Recibida', n.creada], ['Enviada', n.enviada], ['Intentos', String(n.intentos)],
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Notificación ${n.id}`} />
            <Encabezado titulo={n.asunto} descripcion={`Notificación #${n.id}`} volver={route('notificaciones.index')}>
                {admin && n.estado === 'fallida' && (
                    <PrimaryButton onClick={() => router.post(route('notificaciones.reintentar', n.id), {}, { preserveScroll: true })}>Reintentar envío</PrimaryButton>
                )}
            </Encabezado>
            {n.ultimo_error && (
                <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-estado-error">
                    <strong>Último error:</strong> <span className="cifra">{n.ultimo_error}</span>
                </p>
            )}
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="tarjeta self-start p-5" aria-label="Datos">
                    <Estado tono={tonoEstado[n.estado]}>{textoEstado[n.estado]}</Estado>
                    <dl className="mt-4 space-y-3 text-sm">
                        {datos.filter(([, v]) => v).map(([k, v]) => (
                            <div key={k}><dt className="text-slate-500">{k}</dt><dd className="break-words font-medium text-slate-800">{v}</dd></div>
                        ))}
                    </dl>
                </section>
                <section className="tarjeta overflow-hidden lg:col-span-2" aria-label="Vista previa del correo">
                    <h2 className="px-5 pt-5 text-base font-semibold">Vista previa del correo</h2>
                    <iframe title="Vista previa del correo" srcDoc={vistaPrevia} sandbox="" className="mt-3 h-[460px] w-full border-t border-slate-200 bg-fondo" />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
