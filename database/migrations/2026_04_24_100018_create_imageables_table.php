<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('imageables', function (Blueprint $table) {
            $table->foreignId('image_id')->constrained('images');
            $table->unsignedBigInteger('imageable_id');
            $table->string('imageable_type', 50);

            $table->primary(['image_id', 'imageable_id', 'imageable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('imageables');
    }
};
