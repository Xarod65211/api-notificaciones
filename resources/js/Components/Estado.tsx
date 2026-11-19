const tonos: Record<string, string> = {
    ok: 'bg-green-50 text-estado-ok ring-green-200',
    alerta: 'bg-amber-50 text-estado-alerta ring-amber-200',
    error: 'bg-red-50 text-estado-error ring-red-200',
    neutro: 'bg-slate-100 text-estado-neutro ring-slate-200',
    info: 'bg-turquesa-50 text-turquesa-700 ring-teal-200',
};

export default function Estado({ tono = 'neutro', children }: { tono?: keyof typeof tonos | string; children: string }) {
    return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${tonos[tono] ?? tonos.neutro}`}>{children}</span>;
}
