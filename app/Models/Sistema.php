<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Sistema extends Model
{
    protected $table = 'sistemas';

    protected $fillable = ['nombre', 'descripcion', 'activo'];

    protected $hidden = ['token_hash'];

    protected $casts = ['activo' => 'boolean', 'ultimo_uso' => 'datetime'];

    public function notificaciones(): HasMany
    {
        return $this->hasMany(Notificacion::class);
    }

    /** Genera un token nuevo y devuelve el texto plano. Solo se guarda su hash. */
    public function emitirToken(): string
    {
        $token = 'ntf_'.Str::random(40);
        $this->forceFill(['token_hash' => hash('sha256', $token), 'token_prefijo' => substr($token, 0, 8)])->save();

        return $token;
    }

    public static function porToken(?string $token): ?self
    {
        return $token ? static::where('token_hash', hash('sha256', $token))->first() : null;
    }
}
