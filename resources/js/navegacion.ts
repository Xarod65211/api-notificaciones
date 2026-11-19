export type ItemMenu = { texto: string; ruta: string; activo?: string; roles?: string[] };

export const navegacion: { titulo: string; items: ItemMenu[] }[] = [
    {
        titulo: 'General',
        items: [
            { texto: 'Panel', ruta: 'dashboard' },
            { texto: 'Notificaciones', ruta: 'notificaciones.index', activo: 'notificaciones.*' },
            { texto: 'Cómo integrar', ruta: 'integracion' },
        ],
    },
    {
        titulo: 'Administración',
        items: [
            { texto: 'Sistemas cliente', ruta: 'sistemas.index', roles: ['admin'] },
            { texto: 'Usuarios', ruta: 'usuarios.index', roles: ['admin'] },
        ],
    },
];

export const tonoEstado: Record<string, string> = { en_cola: 'info', enviada: 'ok', reintentando: 'alerta', fallida: 'error' };
export const textoEstado: Record<string, string> = { en_cola: 'En cola', enviada: 'Enviada', reintentando: 'Reintentando', fallida: 'Fallida' };
export const nombresRol: Record<string, string> = { admin: 'Administrador', consulta: 'Consulta' };

export type Paginado<T> = { data: T[]; links: { url: string | null; label: string; active: boolean }[]; total: number };
