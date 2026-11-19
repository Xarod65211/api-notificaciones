<?php

use App\Http\Controllers\Api\NotificacionApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['sistema', 'throttle:sistemas'])->group(function () {
    Route::post('notificaciones', [NotificacionApiController::class, 'store']);
    Route::get('notificaciones/{id}', [NotificacionApiController::class, 'show'])->whereNumber('id');
});
