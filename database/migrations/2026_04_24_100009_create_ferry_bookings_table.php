<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ferry_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 20)->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('schedule_id')->constrained('ferry_schedules');
            $table->foreignId('hotel_booking_id')->nullable()->constrained('hotel_bookings');
            $table->unsignedTinyInteger('passenger_count');
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ferry_bookings');
    }
};
