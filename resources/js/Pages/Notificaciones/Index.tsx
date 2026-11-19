import Encabezado from '@/Components/Encabezado';
import Estado from '@/Components/Estado';
import Paginacion from '@/Components/Paginacion';
import Selector from '@/Components/Selector';
import TextInput from '@/Components/TextInput';
import Vacio from '@/Components/Vacio';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Paginado, textoEstado, tonoEstado } from '@/navegacion';
import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Fila = { id: number; sistema: string; evento: string; asunto: string; para: string; estado: string; intentos: number; fecha: string };
type Props = { notificaciones: Paginado<Fila>; sistemas: { id: number; nombre: string }[]; estados: Record<string, string>; filtros: Record<string, string> };

export default function Index({ notificaciones, sistemas, estados, filtros }: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? '');
    const filtrar = (c: Record<string, string>) => router.get(route('notificaciones.index'), { ...filtros, ...c }, { preserveState: true, replace: true });
    const enviar = (e: FormEvent) => {
        e.preventDefault();
        filtrar({ buscar });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notificaciones" />
            <Encabezado titulo="Notificaciones" descripcion={`${notificaciones.total} correos recibidos por la API`} />
            <div className="tarjeta">
                <form onSubmit={enviar} className="flex flex-wrap gap-3 border-b border-slate-200 p-4">
                    <label htmlFor="buscar" className="sr-only">Buscar</label>
                    <TextInput id="buscar" placeholder="Asunto o destinatario" value={buscar} onChange={(e) => setBuscar(e.target.value)} className="max-w-xs" />
                    <label htmlFor="sistema" className="sr-only">Sistema</label>
                    <Selector id="sistema" value={filtros.sistema ?? ''} onChange={(e) => filtrar({ sistema: e.target.value })} className="max-w-[14rem]">
                        <option value="">Todos los sistemas</option>
                        {sistemas.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                    </Selector>
                    <label htmlFor="estado" className="sr-only">Estado</label>
                    <Selector id="estado" value={filtros.estado ?? ''} onChange={(e) => filtrar({ estado: e.target.value })} className="max-w-[12rem]">
                        <option value="">Todos los estados</option>
                        {Object.keys(estados).map((k) => <option key={k} value={k}>{textoEstado[k]}</option>)}
                    </Selector>
                </form>
                {notificaciones.data.length ? (
                    <div className="overflow-x-auto">
                        <table className="tabla">
                            <thead><tr><th>#</th><th>Sistema</th><th>Asunto</th><th>Para</th><th>Intentos</th><th>Recibida</th><th>Estado</th></tr></thead>
                            <tbody>
                                {notificaciones.data.map((n) => (
                                    <tr key={n.id}>
                                        <td><Link href={route('notificaciones.show', n.id)} className="enlace cifra">{n.id}</Link></td>
                                        <td className="whitespace-nowrap">{n.sistema}</td>
                                        <td><p>{n.asunto}</p><p className="text-xs text-slate-500">{n.evento}</p></td>
                                        <td className="max-w-[14rem] truncate" title={n.para}>{n.para}</td>
                                        <td className="cifra">{n.intentos}</td>
                                        <td className="cifra whitespace-nowrap">{n.fecha}</td>
                                        <td><Estado tono={tonoEstado[n.estado]}>{textoEstado[n.estado]}</Estado></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Vacio titulo="No hay notificaciones con estos filtros." />
                )}
                <Paginacion links={notificaciones.links} />
            </div>
        </AuthenticatedLayout>
    );
}
