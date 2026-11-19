import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    rol: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: { user: User };
    flash: { exito?: string; error?: string };
    app: { nombre: string };
    ziggy: Config & { location: string };
};
