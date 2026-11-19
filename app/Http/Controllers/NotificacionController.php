<?php

namespace App\Http\Controllers;

use App\Jobs\EnviarNotificacion;
use App\Mail\CorreoNotificacion;
use App\Models\Notificacion;
use App\Models\Sistema;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificacionController extends Controller
{
    public function index(Request $request): Response
    {
        $notificaciones = Notificacion::with('sistema:id,nombre')
            ->when($request->sistema, fn ($q, $s) => $q->where('sistema_id', $s))
            ->when($request->estado, fn ($q, $e) => $q->where('estado', $e))
            ->when($request->buscar, fn ($q, $b) => $q->where(fn ($w) => $w->where('asunto', 'like', "%{$b}%")->orWhere('para', 'like', "%{$b}%")))
            ->latest('id')->paginate(20)->withQueryString()
            ->through(fn ($n) => [
                'id' => $n->id, 'sistema' => $n->sistema->nombre, 'evento' => $n->evento, 'asunto' => $n->asunto,
                'para' => implode(', ', $n->para), 'estado' => $n->estado, 'intentos' => $n->intentos,
                'fecha' => $n->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Notificaciones/Index', [
            'notificaciones' => $notificaciones,
            'sistemas' => Sistema::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => Notificacion::ESTADOS,
            'filtros' => $request->only('sistema', 'estado', 'buscar'),
        ]);
    }

    public function show(Notificacion $notificacion): Response
    {
        $notificacion->load('sistema:id,nombre');

        return Inertia::render('Notificaciones/Show', [
            'n' => $notificacion->only('id', 'evento', 'asunto', 'cuerpo', 'para', 'cc', 'clave', 'estado', 'intentos', 'ultimo_error') + [
                'sistema' => $notificacion->sistema->nombre,
                'creada' => $notificacion->created_at->format('d/m/Y H:i:s'),
                'enviada' => $notificacion->enviada_en?->format('d/m/Y H:i:s'),
            ],
            'vistaPrevia' => (new CorreoNotificacion($notificacion))->render(),
        ]);
    }

    public function reintentar(Notificacion $notificacion): RedirectResponse
    {
        if ($notificacion->estado !== 'fallida') {
            return back()->with('error', 'Solo se reintentan las notificaciones fallidas.');
        }
        $notificacion->update(['estado' => 'en_cola', 'intentos' => 0, 'ultimo_error' => null]);
        EnviarNotificacion::dispatch($notificacion->id);

        return back()->with('exito', 'La notificación volvió a la cola.');
    }

    public function integracion(): Response
    {
        return Inertia::render('Integracion', ['url' => rtrim(config('app.url'), '/').'/api/v1/notificaciones']);
    }
}
