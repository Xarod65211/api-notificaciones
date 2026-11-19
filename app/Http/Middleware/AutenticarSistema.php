<?php

namespace App\Http\Middleware;

use App\Models\Sistema;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Autentica a un sistema cliente por su token Bearer. */
class AutenticarSistema
{
    public function handle(Request $request, Closure $next): Response
    {
        $sistema = Sistema::porToken($request->bearerToken());
        if (! $sistema) {
            return response()->json(['mensaje' => 'Token ausente o no válido.'], 401);
        }
        if (! $sistema->activo) {
            return response()->json(['mensaje' => 'El sistema está desactivado.'], 403);
        }
        $sistema->forceFill(['ultimo_uso' => now()])->saveQuietly();
        $request->attributes->set('sistema', $sistema);

        return $next($request);
    }
}
