<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('map_locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type', 50);
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_locations');
    }
};
