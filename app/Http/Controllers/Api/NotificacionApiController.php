<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\EnviarNotificacion;
use App\Models\Notificacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificacionApiController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $sistema = $request->attributes->get('sistema');
        $datos = $request->validate([
            'evento' => ['required', 'string', 'max:60'],
            'asunto' => ['required', 'string', 'max:150'],
            'cuerpo' => ['required', 'string', 'max:20000'],
            'para' => ['required', 'array', 'min:1', 'max:20'],
            'para.*' => ['required', 'email:filter'],
            'cc' => ['nullable', 'array', 'max:20'],
            'cc.*' => ['email:filter'],
            'clave' => ['nullable', 'string', 'max:80'],
        ]);

        if (! empty($datos['clave'])) {
            $existente = $sistema->notificaciones()->where('clave', $datos['clave'])->first();
            if ($existente) {
                return response()->json($existente->paraApi() + ['duplicada' => true], 200);
            }
        }

        $n = $sistema->notificaciones()->create($datos + ['estado' => 'en_cola']);
        EnviarNotificacion::dispatch($n->id);

        return response()->json($n->fresh()->paraApi(), 202);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $n = $request->attributes->get('sistema')->notificaciones()->find($id);

        return $n ? response()->json($n->paraApi()) : response()->json(['mensaje' => 'No existe en este sistema.'], 404);
    }
}
