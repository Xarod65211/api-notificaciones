<?php

namespace App\Jobs;

use App\Mail\CorreoNotificacion;
use App\Models\Notificacion;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EnviarNotificacion implements ShouldQueue
{
    use Queueable;

    public int $tries = Notificacion::MAX_INTENTOS;

    public function __construct(public int $notificacionId) {}

    /** Espera creciente entre intentos: 10 s, 30 s, 1 min, 5 min. */
    public function backoff(): array
    {
        return [10, 30, 60, 300];
    }

    public function handle(): void
    {
        $n = Notificacion::find($this->notificacionId);
        if (! $n || $n->estado === 'enviada') {
            return;
        }
        $n->increment('intentos');
        try {
            Mail::to($n->para)->cc($n->cc ?? [])->send(new CorreoNotificacion($n));
        } catch (Throwable $e) {
            $n->update(['estado' => 'reintentando', 'ultimo_error' => mb_substr($e->getMessage(), 0, 500)]);
            throw $e;
        }
        $n->update(['estado' => 'enviada', 'enviada_en' => now(), 'ultimo_error' => null]);
    }

    public function failed(Throwable $e): void
    {
        Notificacion::whereKey($this->notificacionId)->update(['estado' => 'fallida', 'ultimo_error' => mb_substr($e->getMessage(), 0, 500)]);
    }
}
