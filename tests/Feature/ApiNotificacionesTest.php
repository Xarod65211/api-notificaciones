<?php

namespace Tests\Feature;

use App\Jobs\EnviarNotificacion;
use App\Mail\CorreoNotificacion;
use App\Models\Notificacion;
use App\Models\Sistema;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use RuntimeException;
use Tests\TestCase;

class ApiNotificacionesTest extends TestCase
{
    use RefreshDatabase;

    private Sistema $sistema;

    private string $token;

    private array $cuerpo = [
        'evento' => 'prueba', 'asunto' => 'Hola', 'cuerpo' => 'Texto', 'para' => ['a@demo.test'], 'clave' => 'k-1',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->sistema = new Sistema(['nombre' => 'Cliente']);
        $this->token = $this->sistema->emitirToken();
    }

    public function test_sin_token_o_con_token_falso_responde_401(): void
    {
        $this->postJson('/api/v1/notificaciones', $this->cuerpo)->assertUnauthorized();
        $this->withToken('ntf_falso')->postJson('/api/v1/notificaciones', $this->cuerpo)->assertUnauthorized();
    }

    public function test_un_sistema_desactivado_responde_403(): void
    {
        $this->sistema->update(['activo' => false]);
        $this->withToken($this->token)->postJson('/api/v1/notificaciones', $this->cuerpo)->assertForbidden();
    }

    public function test_valida_los_datos(): void
    {
        $this->withToken($this->token)->postJson('/api/v1/notificaciones', ['para' => ['no-es-correo']])
            ->assertUnprocessable()->assertJsonValidationErrors(['evento', 'asunto', 'cuerpo', 'para.0']);
    }

    public function test_encola_y_no_duplica_con_la_misma_clave(): void
    {
        Queue::fake();
        $id = $this->withToken($this->token)->postJson('/api/v1/notificaciones', $this->cuerpo)->assertStatus(202)->json('id');
        $this->withToken($this->token)->postJson('/api/v1/notificaciones', $this->cuerpo)->assertOk()->assertJson(['id' => $id, 'duplicada' => true]);

        $this->assertSame(1, Notificacion::count());
        Queue::assertPushed(EnviarNotificacion::class, 1);
    }

    public function test_el_job_envia_el_correo_y_marca_enviada(): void
    {
        Mail::fake();
        $id = $this->withToken($this->token)->postJson('/api/v1/notificaciones', $this->cuerpo)->json('id');

        Mail::assertSent(CorreoNotificacion::class, fn ($m) => $m->hasTo('a@demo.test'));
        $this->withToken($this->token)->getJson("/api/v1/notificaciones/{$id}")->assertOk()->assertJson(['estado' => 'enviada', 'intentos' => 1]);
    }

    public function test_un_fallo_definitivo_queda_como_fallida_y_se_puede_reintentar(): void
    {
        Queue::fake();
        $n = $this->sistema->notificaciones()->create($this->cuerpo + ['estado' => 'en_cola']);
        (new EnviarNotificacion($n->id))->failed(new RuntimeException('550 Mailbox unavailable'));
        $this->assertSame('fallida', $n->fresh()->estado);

        $admin = User::factory()->create(['rol' => 'admin']);
        $this->actingAs($admin)->post(route('notificaciones.reintentar', $n))->assertSessionHas('exito');
        $this->assertSame('en_cola', $n->fresh()->estado);
        Queue::assertPushed(EnviarNotificacion::class);
    }

    public function test_un_sistema_no_ve_notificaciones_de_otro(): void
    {
        $otro = new Sistema(['nombre' => 'Otro']);
        $tokenOtro = $otro->emitirToken();
        $n = $this->sistema->notificaciones()->create($this->cuerpo + ['estado' => 'enviada']);
        $this->withToken($tokenOtro)->getJson("/api/v1/notificaciones/{$n->id}")->assertNotFound();
    }

    public function test_el_token_se_guarda_solo_como_hash_y_regenerarlo_invalida_el_anterior(): void
    {
        $this->assertDatabaseMissing('sistemas', ['token_hash' => $this->token]);
        $admin = User::factory()->create(['rol' => 'admin']);
        $this->actingAs($admin)->post(route('sistemas.token', $this->sistema));
        $this->withToken($this->token)->postJson('/api/v1/notificaciones', $this->cuerpo)->assertUnauthorized();
    }

    public function test_el_rol_consulta_no_administra_sistemas(): void
    {
        $consulta = User::factory()->create(['rol' => 'consulta']);
        $this->actingAs($consulta)->get(route('sistemas.index'))->assertForbidden();
        $this->actingAs($consulta)->get(route('notificaciones.index'))->assertOk();
    }
}
