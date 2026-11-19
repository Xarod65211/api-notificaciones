<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use App\Models\Sistema;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PanelController extends Controller
{
    public function __invoke(): Response
    {
        $porDia = collect(range(13, 0))->map(function (int $atras) {
            $dia = Carbon::today()->subDays($atras);
            $q = fn () => Notificacion::whereDate('created_at', $dia);

            return ['dia' => $dia->format('d/m'), 'enviadas' => $q()->where('estado', 'enviada')->count(), 'fallidas' => $q()->where('estado', 'fallida')->count()];
        });

        return Inertia::render('Panel', [
            'indicadores' => [
                'hoy' => Notificacion::where('estado', 'enviada')->whereDate('enviada_en', today())->count(),
                'en_cola' => Notificacion::whereIn('estado', ['en_cola', 'reintentando'])->count(),
                'fallidas' => Notificacion::where('estado', 'fallida')->count(),
                'sistemas' => Sistema::where('activo', true)->count(),
            ],
            'porDia' => $porDia,
            'porSistema' => Sistema::withCount([
                'notificaciones as total' => fn ($q) => $q->where('created_at', '>=', now()->subDays(14)),
                'notificaciones as fallidas' => fn ($q) => $q->where('created_at', '>=', now()->subDays(14))->where('estado', 'fallida'),
            ])->orderByDesc('total')->get(['id', 'nombre', 'activo']),
        ]);
    }
}
