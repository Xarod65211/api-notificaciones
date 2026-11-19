import Encabezado from '@/Components/Encabezado';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const respuestas: [string, string][] = [
    ['202', 'Recibida y en cola. Devuelve el id y el estado.'],
    ['200', 'Ya existía una notificación con la misma clave: no se duplica.'],
    ['401', 'Token ausente o no válido.'],
    ['403', 'El sistema está desactivado.'],
    ['422', 'Datos inválidos. Devuelve el detalle por campo.'],
    ['429', 'Más de 60 solicitudes por minuto con el mismo token.'],
];

export default function Integracion({ url }: { url: string }) {
    const ejemplos: Record<string, string> = {
        curl: `curl -X POST ${url} \u005c
  -H "Authorization: Bearer ntf_SU_TOKEN" \u005c
  -H "Content-Type: application/json" \u005c
  -d '{
    "evento": "orden.aprobada",
    "asunto": "Orden 1042 aprobada",
    "cuerpo": "La orden 1042 fue aprobada y pasa a compras.",
    "para": ["compras@empresa.test"],
    "cc": ["jefatura@empresa.test"],
    "clave": "orden-1042-aprobada"
  }'`,
        PHP: `$respuesta = Http::withToken(env('NOTIFICACIONES_TOKEN'))
    ->post('${url}', [
        'evento' => 'orden.aprobada',
        'asunto' => 'Orden 1042 aprobada',
        'cuerpo' => 'La orden 1042 fue aprobada y pasa a compras.',
        'para' => ['compras@empresa.test'],
        'clave' => 'orden-1042-aprobada',
    ]);`,
        Python: `requests.post(
    "${url}",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "evento": "orden.aprobada",
        "asunto": "Orden 1042 aprobada",
        "cuerpo": "La orden 1042 fue aprobada y pasa a compras.",
        "para": ["compras@empresa.test"],
        "clave": "orden-1042-aprobada",
    },
    timeout=10,
)`,
    };
    const [lenguaje, setLenguaje] = useState('curl');

    return (
        <AuthenticatedLayout>
            <Head title="Cómo integrar" />
            <Encabezado titulo="Cómo integrar un sistema" descripcion="Un POST con el token del sistema. El envío ocurre en segundo plano, con hasta 5 intentos." />
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="tarjeta lg:col-span-2" aria-labelledby="t-ej">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
                        <h2 id="t-ej" className="text-base font-semibold">Enviar una notificación</h2>
                        <div role="tablist" className="flex gap-1 rounded-lg bg-slate-100 p-1">
                            {Object.keys(ejemplos).map((l) => (
                                <button key={l} role="tab" aria-selected={lenguaje === l} type="button" onClick={() => setLenguaje(l)}
                                    className={`min-h-8 rounded-md px-3 text-sm ${lenguaje === l ? 'bg-white font-semibold text-marino' : 'text-slate-600'}`}>{l}</button>
                            ))}
                        </div>
                    </div>
                    <pre className="cifra m-5 overflow-x-auto rounded-lg bg-marino p-4 text-[13px] leading-relaxed text-slate-100"><code>{ejemplos[lenguaje]}</code></pre>
                    <p className="px-5 pb-5 text-sm text-slate-600">
                        Consulte el estado con <code className="rounded bg-slate-100 px-1">GET {url}/{'{id}'}</code> usando el mismo token.
                        La <strong>clave</strong> es opcional: si su sistema reintenta la misma llamada, no se envía dos veces.
                    </p>
                </section>
                <section className="tarjeta self-start" aria-labelledby="t-cod">
                    <h2 id="t-cod" className="px-5 pt-5 text-base font-semibold">Respuestas</h2>
                    <dl className="mt-3 divide-y divide-slate-100 text-sm">
                        {respuestas.map(([c, t]) => (
                            <div key={c} className="flex gap-3 px-5 py-2.5"><dt className="cifra w-10 font-semibold text-marino">{c}</dt><dd className="text-slate-600">{t}</dd></div>
                        ))}
                    </dl>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
