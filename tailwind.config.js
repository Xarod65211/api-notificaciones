import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                titulo: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                marino: { DEFAULT: '#172a46', 700: '#22395c', 600: '#2d4870' },
                turquesa: { DEFAULT: '#0f766e', 700: '#115e59', 50: '#f0fdfa', claro: '#5eead4' },
                fondo: '#f4f6f9',
                estado: { ok: '#15803d', alerta: '#b45309', error: '#b91c1c', neutro: '#475569' },
            },
        },
    },
    plugins: [forms],
};
