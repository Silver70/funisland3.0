<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->constrained('promotions');
            $table->foreignId('user_id')->constrained('users');
            $table->string('applied_to_type', 50);
            $table->unsignedBigInteger('applied_to_id');
            $table->decimal('discount_amount', 10, 2);
            $table->timestamp('created_at')->nullable();

            $table->index(['applied_to_type', 'applied_to_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_usages');
    }
};
