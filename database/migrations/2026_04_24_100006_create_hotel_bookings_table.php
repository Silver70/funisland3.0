<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 20)->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('room_id')->constrained('rooms');
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedTinyInteger('guests');
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_bookings');
    }
};
