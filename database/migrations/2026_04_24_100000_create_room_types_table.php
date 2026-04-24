<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('base_price_per_night', 10, 2);
            $table->unsignedTinyInteger('max_occupancy');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
