<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Usuarios/Index', [
            'usuarios' => User::orderBy('name')->get(['id', 'name', 'email', 'rol', 'activo']),
            'roles' => User::ROLES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'rol' => ['required', Rule::in(array_keys(User::ROLES))],
            'password' => ['required', Password::min(8)],
        ]);
        User::create($datos + ['email_verified_at' => now()]);

        return back()->with('exito', "Se creó la cuenta de {$datos['name']}.");
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $datos = $request->validate([
            'rol' => ['required', Rule::in(array_keys(User::ROLES))],
            'activo' => ['required', 'boolean'],
        ]);
        if ($usuario->is($request->user()) && (! $datos['activo'] || $datos['rol'] !== 'admin')) {
            return back()->with('error', 'No puede quitarse a sí mismo el rol de administrador ni desactivar su cuenta.');
        }
        $usuario->update($datos);

        return back()->with('exito', "Se actualizó la cuenta de {$usuario->name}.");
    }
}
