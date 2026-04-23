<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
    });

Route::middleware(['auth', 'verified', 'role:hotel manager'])
    ->prefix('hotel-manager')
    ->name('hotel-manager.')
    ->group(function () {
        Route::inertia('dashboard', 'hotel-manager/dashboard')->name('dashboard');
    });

Route::middleware(['auth', 'verified', 'role:ferry operator'])
    ->prefix('ferry-operator')
    ->name('ferry-operator.')
    ->group(function () {
        Route::inertia('dashboard', 'ferry-operator/dashboard')->name('dashboard');
    });

Route::middleware(['auth', 'verified', 'role:visitor'])
    ->prefix('visitor')
    ->name('visitor.')
    ->group(function () {
        Route::inertia('dashboard', 'visitor/dashboard')->name('dashboard');
    });

require __DIR__.'/settings.php';
