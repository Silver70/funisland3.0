<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')->constrained('room_types');
            $table->string('room_number', 20)->unique();
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
