import Encabezado from '@/Components/Encabezado';
import Estado from '@/Components/Estado';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Selector from '@/Components/Selector';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Usuario = { id: number; name: string; email: string; rol: string; activo: boolean };

export default function Index({ usuarios, roles }: { usuarios: Usuario[]; roles: Record<string, string> }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', rol: 'supervisor', password: '' });
    const crear = (e: FormEvent) => {
        e.preventDefault();
        post(route('usuarios.store'), { onSuccess: () => reset() });
    };
    const actualizar = (u: Usuario, cambios: Partial<Usuario>) => router.patch(route('usuarios.update', u.id), { rol: u.rol, activo: u.activo, ...cambios }, { preserveScroll: true });

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />
            <Encabezado titulo="Usuarios" descripcion="Administrador: todo. Almacén: stock, aprobaciones y entregas. Supervisor: crea y sigue sus solicitudes." />
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="tarjeta lg:col-span-2" aria-label="Cuentas">
                    <div className="overflow-x-auto">
                        <table className="tabla">
                            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th></tr></thead>
                            <tbody>
                                {usuarios.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <label htmlFor={`rol-${u.id}`} className="sr-only">Rol de {u.name}</label>
                                            <Selector id={`rol-${u.id}`} value={u.rol} onChange={(e) => actualizar(u, { rol: e.target.value })} className="min-w-[9rem]">
                                                {Object.entries(roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                            </Selector>
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => actualizar(u, { activo: !u.activo })} className="text-left" title={u.activo ? 'Desactivar' : 'Activar'}>
                                                <Estado tono={u.activo ? 'ok' : 'neutro'}>{u.activo ? 'Activa' : 'Desactivada'}</Estado>
                                                <span className="ml-2 text-xs text-turquesa underline">{u.activo ? 'Desactivar' : 'Activar'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <form onSubmit={crear} className="tarjeta space-y-4 self-start p-5">
                    <h2 className="text-base font-semibold">Crear cuenta</h2>
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Correo" />
                        <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <InputLabel htmlFor="rol" value="Rol" />
                        <Selector id="rol" value={data.rol} onChange={(e) => setData('rol', e.target.value)}>
                            {Object.entries(roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </Selector>
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="Contraseña inicial" />
                        <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        <InputError message={errors.password} />
                    </div>
                    <PrimaryButton disabled={processing} className="w-full">Crear cuenta</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
