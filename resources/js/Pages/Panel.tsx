import Encabezado from '@/Components/Encabezado';
import Estado from '@/Components/Estado';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type Props = {
    indicadores: { hoy: number; en_cola: number; fallidas: number; sistemas: number };
    porDia: { dia: string; enviadas: number; fallidas: number }[];
    porSistema: { id: number; nombre: string; activo: boolean; total: number; fallidas: number }[];
};

export default function Panel({ indicadores, porDia, porSistema }: Props) {
    const maximo = Math.max(1, ...porDia.map((d) => d.enviadas + d.fallidas));
    const tarjetas = [
        { texto: 'Enviadas hoy', valor: indicadores.hoy, href: route('notificaciones.index', { estado: 'enviada' }) },
        { texto: 'En cola o reintentando', valor: indicadores.en_cola, href: route('notificaciones.index', { estado: 'reintentando' }) },
        { texto: 'Fallidas, por revisar', valor: indicadores.fallidas, href: route('notificaciones.index', { estado: 'fallida' }) },
        { texto: 'Sistemas cliente activos', valor: indicadores.sistemas, href: route('notificaciones.index') },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Panel" />
            <Encabezado titulo="Panel" descripcion="Correos recibidos por la API y su estado de entrega." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tarjetas.map((t) => (
                    <Link key={t.texto} href={t.href} className="tarjeta p-5 transition-colors hover:border-turquesa">
                        <p className="text-sm text-slate-500">{t.texto}</p>
                        <p className="cifra mt-2 font-titulo text-3xl font-semibold text-marino">{t.valor}</p>
                    </Link>
                ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <section className="tarjeta p-5 lg:col-span-3" aria-labelledby="t-dias">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 id="t-dias" className="text-base font-semibold">Últimos 14 días</h2>
                        <p className="flex gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-turquesa" aria-hidden /> Enviadas</span>
                            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-estado-error" aria-hidden /> Fallidas</span>
                        </p>
                    </div>
                    <div className="mt-6 flex h-44 items-end gap-1.5">
                        {porDia.map((d) => (
                            <div key={d.dia} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                                <div className="flex w-full flex-col justify-end overflow-hidden rounded-t" style={{ height: `${((d.enviadas + d.fallidas) / maximo) * 100}%` }} aria-label={`${d.dia}: ${d.enviadas} enviadas y ${d.fallidas} fallidas`}>
                                    <div className="bg-estado-error" style={{ height: `${d.enviadas + d.fallidas ? (d.fallidas / (d.enviadas + d.fallidas)) * 100 : 0}%` }} />
                                    <div className="flex-1 bg-turquesa" />
                                </div>
                                <span className="text-[10px] text-slate-500">{d.dia}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="tarjeta lg:col-span-2" aria-labelledby="t-sis">
                    <h2 id="t-sis" className="px-5 pt-5 text-base font-semibold">Por sistema (14 días)</h2>
                    <table className="tabla mt-3">
                        <thead><tr><th>Sistema</th><th>Recibidas</th><th>Fallidas</th></tr></thead>
                        <tbody>
                            {porSistema.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.nombre} {!s.activo && <Estado tono="neutro">Desactivado</Estado>}</td>
                                    <td className="cifra">{s.total}</td>
                                    <td className={`cifra ${s.fallidas ? 'font-semibold text-estado-error' : ''}`}>{s.fallidas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
