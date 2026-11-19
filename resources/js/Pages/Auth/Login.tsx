import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { nombresRol } from '@/navegacion';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword, demo }: { status?: string; canResetPassword: boolean; demo?: { email: string; rol: string }[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false as boolean });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />
            <h1 className="text-xl font-semibold">Iniciar sesión</h1>
            {status && <p className="mt-3 text-sm font-medium text-estado-ok">{status}</p>}

            <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Correo" />
                    <TextInput id="email" type="email" name="email" value={data.email} autoComplete="username" isFocused onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput id="password" type="password" name="password" value={data.password} autoComplete="current-password" onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    Mantener la sesión iniciada
                </label>
                <div className="flex items-center justify-between gap-4">
                    {canResetPassword ? (
                        <Link href={route('password.request')} className="enlace text-sm">
                            Olvidé mi contraseña
                        </Link>
                    ) : (
                        <span />
                    )}
                    <PrimaryButton disabled={processing}>Entrar</PrimaryButton>
                </div>
            </form>

            {demo && demo.length > 0 && (
                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm">
                    <p className="font-medium text-slate-700">Cuentas de demostración (contraseña: <code>demo1234</code>)</p>
                    <ul className="mt-2 space-y-1">
                        {demo.map((d) => (
                            <li key={d.email}>
                                <button type="button" className="enlace" onClick={() => setData({ ...data, email: d.email, password: 'demo1234' })}>
                                    {d.email}
                                </button>{' '}
                                <span className="text-slate-500">({nombresRol[d.rol] ?? d.rol})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </GuestLayout>
    );
}
