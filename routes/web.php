<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Hotel\HotelBookingController;
use App\Http\Controllers\Hotel\RoomController;
use App\Http\Controllers\Hotel\RoomTypeController;
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
        Route::get('userList', [UserManagementController::class, 'index'])->name('userList');
        Route::put('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.updateRole');
    });

Route::middleware(['auth', 'verified', 'role:hotel manager'])
    ->prefix('hotel-manager')
    ->name('hotel-manager.')
    ->group(function () {
        Route::inertia('dashboard', 'hotel-manager/dashboard')->name('dashboard');

        Route::get('room-types', [RoomTypeController::class, 'index'])->name('room-types.index');
        Route::post('room-types', [RoomTypeController::class, 'store'])->name('room-types.store');
        Route::put('room-types/{roomType}', [RoomTypeController::class, 'update'])->name('room-types.update');
        Route::delete('room-types/{roomType}', [RoomTypeController::class, 'destroy'])->name('room-types.destroy');

        Route::get('rooms', [RoomController::class, 'index'])->name('rooms.index');
        Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
        Route::put('rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
        Route::delete('rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

        Route::get('bookings', [HotelBookingController::class, 'index'])->name('bookings.index');
        Route::post('bookings', [HotelBookingController::class, 'store'])->name('bookings.store');
        Route::put('bookings/{hotelBooking}', [HotelBookingController::class, 'update'])->name('bookings.update');
        Route::patch('bookings/{hotelBooking}/cancel', [HotelBookingController::class, 'cancel'])->name('bookings.cancel');
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
