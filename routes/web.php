<?php

use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\PanelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SistemaController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/panel');

Route::middleware('auth')->group(function () {
    Route::get('/panel', PanelController::class)->name('dashboard');
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/perfil', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('notificaciones', [NotificacionController::class, 'index'])->name('notificaciones.index');
    Route::get('notificaciones/{notificacion}', [NotificacionController::class, 'show'])->name('notificaciones.show');
    Route::get('integracion', [NotificacionController::class, 'integracion'])->name('integracion');

    Route::middleware('rol:admin')->group(function () {
        Route::post('notificaciones/{notificacion}/reintentar', [NotificacionController::class, 'reintentar'])->name('notificaciones.reintentar');
        Route::get('sistemas', [SistemaController::class, 'index'])->name('sistemas.index');
        Route::post('sistemas', [SistemaController::class, 'store'])->name('sistemas.store');
        Route::patch('sistemas/{sistema}', [SistemaController::class, 'update'])->name('sistemas.update');
        Route::post('sistemas/{sistema}/token', [SistemaController::class, 'regenerar'])->name('sistemas.token');
        Route::get('usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::post('usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
        Route::patch('usuarios/{usuario}', [UsuarioController::class, 'update'])->name('usuarios.update');
    });
});

require __DIR__.'/auth.php';
