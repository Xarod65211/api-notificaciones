<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    public const ESTADOS = ['en_cola' => 'En cola', 'enviada' => 'Enviada', 'reintentando' => 'Reintentando', 'fallida' => 'Fallida'];

    public const MAX_INTENTOS = 5;

    protected $table = 'notificaciones';

    protected $fillable = ['sistema_id', 'evento', 'asunto', 'cuerpo', 'para', 'cc', 'clave', 'estado', 'intentos', 'ultimo_error', 'enviada_en'];

    protected $casts = ['para' => 'array', 'cc' => 'array', 'enviada_en' => 'datetime'];

    public function sistema(): BelongsTo
    {
        return $this->belongsTo(Sistema::class);
    }

    public function paraApi(): array
    {
        return [
            'id' => $this->id, 'estado' => $this->estado, 'intentos' => $this->intentos,
            'evento' => $this->evento, 'clave' => $this->clave,
            'creada_en' => $this->created_at?->toIso8601String(), 'enviada_en' => $this->enviada_en?->toIso8601String(),
            'error' => $this->estado === 'fallida' ? $this->ultimo_error : null,
        ];
    }
}
