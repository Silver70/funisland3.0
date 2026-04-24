<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 20)->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('event_schedule_id')->constrained('event_schedules');
            $table->foreignId('park_ticket_id')->nullable()->constrained('park_tickets');
            $table->unsignedTinyInteger('quantity');
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_bookings');
    }
};
