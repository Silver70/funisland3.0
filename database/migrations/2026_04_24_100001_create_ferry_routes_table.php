<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ferry_routes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('origin', 100);
            $table->string('destination', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ferry_routes');
    }
};
