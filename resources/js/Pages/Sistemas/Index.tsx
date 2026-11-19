import Encabezado from '@/Components/Encabezado';
import Estado from '@/Components/Estado';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Sistema = { id: number; nombre: string; descripcion: string | null; activo: boolean; token_prefijo: string; notificaciones: number; ultimo_uso: string };

export default function Index({ sistemas, tokenNuevo }: { sistemas: Sistema[]; tokenNuevo?: { sistema: string; token: string } }) {
    const { data, setData, post, processing, errors, reset } = useForm({ nombre: '', descripcion: '' });
    const [copiado, setCopiado] = useState(false);
    const crear = (e: FormEvent) => {
        e.preventDefault();
        post(route('sistemas.store'), { onSuccess: () => reset() });
    };
    const alternar = (s: Sistema) => router.patch(route('sistemas.update', s.id), { nombre: s.nombre, descripcion: s.descripcion, activo: !s.activo }, { preserveScroll: true });
    const regenerar = (s: Sistema) => confirm(`¿Regenerar el token de ${s.nombre}? El actual deja de funcionar.`) && router.post(route('sistemas.token', s.id), {}, { preserveScroll: true });
    const copiar = async (t: string) => {
        await navigator.clipboard?.writeText(t);
        setCopiado(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Sistemas cliente" />
            <Encabezado titulo="Sistemas cliente" descripcion="Cada sistema que envía correos tiene su propio token. Se guarda solo su huella SHA-256." />

            {tokenNuevo && (
                <div className="mb-6 rounded-xl border border-turquesa bg-turquesa-50 p-5">
                    <p className="text-sm font-semibold text-marino">Token de {tokenNuevo.sistema}. Cópielo ahora: no se vuelve a mostrar.</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <code className="cifra break-all rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200">{tokenNuevo.token}</code>
                        <button type="button" onClick={() => copiar(tokenNuevo.token)} className="enlace text-sm">{copiado ? 'Copiado' : 'Copiar'}</button>
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="tarjeta overflow-x-auto lg:col-span-2" aria-label="Sistemas">
                    <table className="tabla">
                        <thead><tr><th>Sistema</th><th>Token</th><th>Enviadas</th><th>Último uso</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
                        <tbody>
                            {sistemas.map((s) => (
                                <tr key={s.id}>
                                    <td><p className="font-medium">{s.nombre}</p><p className="text-xs text-slate-500">{s.descripcion}</p></td>
                                    <td className="cifra text-slate-500">{s.token_prefijo}…</td>
                                    <td className="cifra">{s.notificaciones}</td>
                                    <td className="whitespace-nowrap">{s.ultimo_uso}</td>
                                    <td><Estado tono={s.activo ? 'ok' : 'neutro'}>{s.activo ? 'Activo' : 'Desactivado'}</Estado></td>
                                    <td className="space-x-3 whitespace-nowrap text-right text-sm">
                                        <button type="button" className="enlace" onClick={() => regenerar(s)}>Nuevo token</button>
                                        <button type="button" className="enlace" onClick={() => alternar(s)}>{s.activo ? 'Desactivar' : 'Activar'}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <form onSubmit={crear} className="tarjeta space-y-4 self-start p-5">
                    <h2 className="text-base font-semibold">Registrar sistema</h2>
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput id="nombre" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} required />
                        <InputError message={errors.nombre} />
                    </div>
                    <div>
                        <InputLabel htmlFor="descripcion" value="Para qué lo usa (opcional)" />
                        <TextInput id="descripcion" value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} />
                    </div>
                    <PrimaryButton disabled={processing} className="w-full">Registrar y generar token</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
