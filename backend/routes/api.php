<?php

# use Illuminate\Http\Request
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('products', ProductController::class);
Route::apiResource('profiles', ProfileController::class);
Route::apiResource('sections', SectionController::class)->only(['index', 'store']);
Route::apiResource('users', UserController::class);
