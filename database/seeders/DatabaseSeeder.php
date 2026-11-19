<?php

namespace Database\Seeders;

use App\Models\Notificacion;
use App\Models\Sistema;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Sistemas cliente y 14 días de notificaciones inventadas.
 */
class DatabaseSeeder extends Seeder
{
    /** Token conocido para probar la API con el ejemplo del README. Solo existe en la demostración. */
    public const TOKEN_DEMO = 'ntf_demo0000000000000000000000000000000000';

    public function run(): void
    {
        User::create(['name' => 'Ana Rojas', 'email' => 'admin@demo.test', 'rol' => 'admin', 'password' => 'demo1234', 'email_verified_at' => now()]);
        User::create(['name' => 'Raúl Limachi', 'email' => 'consulta@demo.test', 'rol' => 'consulta', 'password' => 'demo1234', 'email_verified_at' => now()]);

        $sistemas = collect([
            ['Control de EPP', 'Aprobaciones y entregas de EPP', true],
            ['Formularios dinámicos', 'Respuestas fuera de rango', true],
            ['Inventario de activos', 'Asignaciones y mantenimientos', true],
            ['Mesa de ayuda', 'Sistema retirado', false],
        ])->map(function ($s) {
            $sistema = new Sistema(['nombre' => $s[0], 'descripcion' => $s[1], 'activo' => $s[2]]);
            $sistema->emitirToken();

            return $sistema;
        });
        $sistemas[0]->forceFill(['token_hash' => hash('sha256', self::TOKEN_DEMO), 'token_prefijo' => substr(self::TOKEN_DEMO, 0, 8)])->save();

        $plantillas = [
            ['solicitud.aprobada', 'Solicitud SOL-%05d aprobada', 'La solicitud fue aprobada y el stock quedó reservado. Puede pasar por almacén.', 'almacen@empresa.test'],
            ['respuesta.fuera_de_rango', 'Lectura fuera de rango en R-%05d', 'Una lectura del compresor quedó fuera del rango aceptado. Revísela en el sistema.', 'mantenimiento@empresa.test'],
            ['activo.asignado', 'Se le asignó el activo AF-%05d', 'Se registró la entrega del activo a su nombre. El acta está disponible en el sistema.', 'personal@empresa.test'],
            ['mantenimiento.vence', 'Mantenimiento por vencer: equipo %05d', 'El mantenimiento preventivo vence en 7 días.', 'tic@empresa.test'],
        ];
        $errores = [
            'Expected response code 250 but got code "550", with message "550 5.1.1 Mailbox unavailable"',
            'Connection could not be established with host "smtp.empresa.test:587": Connection timed out',
        ];

        $momento = Carbon::now()->subMinutes(21100);
        for ($i = 0; $i < 260; $i++) {
            $momento = $momento->copy()->addMinutes(25 + ($i * 37 % 61) + ($i % 40 < 8 ? 120 : 0));
            $sis = $i % 7 === 0 ? 2 : ($i % 3 === 0 ? 1 : 0);
            $p = $plantillas[$sis === 2 ? ($i % 2 ? 2 : 3) : $sis];
            $fallida = $i % 23 === 5;
            $estado = $i >= 257 ? 'en_cola' : ($fallida ? 'fallida' : 'enviada');
            $n = new Notificacion([
                'sistema_id' => $sistemas[$sis]->id, 'evento' => $p[0], 'asunto' => sprintf($p[1], 1000 + $i), 'cuerpo' => $p[2],
                'para' => [$fallida && $i % 2 ? 'buzon-inexistente@empresa.test' : $p[3]], 'cc' => $i % 4 === 0 ? ['jefatura@empresa.test'] : null,
                'clave' => $p[0].'-'.(1000 + $i), 'estado' => $estado,
                'intentos' => $estado === 'en_cola' ? 0 : ($fallida ? Notificacion::MAX_INTENTOS : 1 + ($i % 11 === 0 ? 1 : 0)),
                'ultimo_error' => $fallida ? $errores[$i % 2] : null,
                'enviada_en' => $estado === 'enviada' ? $momento->copy()->addSeconds(4) : null,
            ]);
            $n->created_at = $momento;
            $n->updated_at = $momento;
            $n->save();
        }
        foreach ($sistemas->take(3) as $s) {
            $s->forceFill(['ultimo_uso' => $s->notificaciones()->max('created_at')])->save();
        }
    }
}
