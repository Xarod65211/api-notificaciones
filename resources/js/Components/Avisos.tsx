import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Avisos() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);
    useEffect(() => setVisible(true), [flash]);
    if (!visible || (!flash?.exito && !flash?.error)) return null;
    const error = Boolean(flash.error);
    return (
        <div role="status" className={`mb-6 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-estado-error' : 'border-green-200 bg-green-50 text-estado-ok'}`}>
            <span>{flash.error ?? flash.exito}</span>
            <button type="button" onClick={() => setVisible(false)} className="font-medium underline">
                Cerrar aviso
            </button>
        </div>
    );
}
