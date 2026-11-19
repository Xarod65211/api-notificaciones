<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('rol', 20)->default('consulta')->after('email');
            $table->boolean('activo')->default(true)->after('rol');
        });

        Schema::create('sistemas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 80)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('token_hash', 64)->unique();
            $table->string('token_prefijo', 12);
            $table->boolean('activo')->default(true);
            $table->timestamp('ultimo_uso')->nullable();
            $table->timestamps();
        });

        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sistema_id')->constrained('sistemas');
            $table->string('evento', 60);
            $table->string('asunto', 150);
            $table->text('cuerpo');
            $table->json('para');
            $table->json('cc')->nullable();
            $table->string('clave', 80)->nullable();
            $table->string('estado', 15)->default('en_cola')->index();
            $table->unsignedTinyInteger('intentos')->default(0);
            $table->text('ultimo_error')->nullable();
            $table->timestamp('enviada_en')->nullable();
            $table->timestamps();
            $table->unique(['sistema_id', 'clave']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
        Schema::dropIfExists('sistemas');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['rol', 'activo']));
    }
};
