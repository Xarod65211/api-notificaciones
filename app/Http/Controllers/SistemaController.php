<?php

namespace App\Http\Controllers;

use App\Models\Sistema;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SistemaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sistemas/Index', [
            'sistemas' => Sistema::withCount('notificaciones')->orderBy('nombre')->get()->map(fn ($s) => [
                'id' => $s->id, 'nombre' => $s->nombre, 'descripcion' => $s->descripcion, 'activo' => $s->activo,
                'token_prefijo' => $s->token_prefijo, 'notificaciones' => $s->notificaciones_count,
                'ultimo_uso' => $s->ultimo_uso?->diffForHumans() ?? 'Nunca',
            ]),
            'tokenNuevo' => session('token_nuevo'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:80', 'unique:sistemas'],
            'descripcion' => ['nullable', 'string', 'max:255'],
        ]);
        $sistema = new Sistema($datos);
        $token = $sistema->emitirToken();

        return back()->with('token_nuevo', ['sistema' => $sistema->nombre, 'token' => $token])
            ->with('exito', "Se registró {$sistema->nombre}. Copie el token ahora: no se vuelve a mostrar.");
    }

    public function update(Request $request, Sistema $sistema): RedirectResponse
    {
        $sistema->update($request->validate([
            'nombre' => ['required', 'string', 'max:80', Rule::unique('sistemas')->ignore($sistema)],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'activo' => ['required', 'boolean'],
        ]));

        return back()->with('exito', $sistema->activo ? "{$sistema->nombre} está activo." : "{$sistema->nombre} quedó desactivado: la API rechazará su token.");
    }

    public function regenerar(Sistema $sistema): RedirectResponse
    {
        $token = $sistema->emitirToken();

        return back()->with('token_nuevo', ['sistema' => $sistema->nombre, 'token' => $token])
            ->with('exito', "Token de {$sistema->nombre} regenerado. El anterior dejó de funcionar.");
    }
}
