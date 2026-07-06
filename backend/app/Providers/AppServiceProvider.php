<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use App\Models\Product;
use App\Models\User;
use App\Models\Profile;
use App\Observers\AuditObserver;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

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
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        Product::observe(AuditObserver::class);
        User::observe(AuditObserver::class);
        Profile::observe(AuditObserver::class);
    }
}
