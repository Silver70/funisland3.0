<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ferry_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->constrained('ferry_routes');
            $table->dateTime('departure_at');
            $table->string('direction', 20);
            $table->integer('capacity');
            $table->decimal('base_price', 10, 2);
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ferry_schedules');
    }
};
