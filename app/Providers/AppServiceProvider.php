<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('sistemas', fn (Request $r) => Limit::perMinute(60)->by(hash('sha256', (string) $r->bearerToken())));
        Vite::prefetch(concurrency: 3);
    }
}
