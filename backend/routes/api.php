<?php

# use Illuminate\Http\Request
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BitacoraController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\UserController;

// Rutas publicas (no requieren token)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Rutas protegidas (requieren header Authorization: Bearer {token})
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::middleware('section:products')->group(function () {
        Route::get('/products/export/pdf', [ProductController::class, 'exportPdf']);
        Route::get('/products/export/excel', [ProductController::class, 'exportExcel']);
        Route::apiResource('products', ProductController::class);
    });

    Route::middleware('section:users')->group(function () {
        Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
        Route::get('/users/export/excel', [UserController::class, 'exportExcel']);
        Route::apiResource('users', UserController::class);
    });

    Route::middleware('section:profiles')->group(function () {
        Route::get('/profiles/export/pdf', [ProfileController::class, 'exportPdf']);
        Route::get('/profiles/export/excel', [ProfileController::class, 'exportExcel']);
        Route::apiResource('profiles', ProfileController::class);
        Route::apiResource('sections', SectionController::class)->only(['index', 'store']);
        Route::get('/bitacora', [BitacoraController::class, 'index']);
    });
});