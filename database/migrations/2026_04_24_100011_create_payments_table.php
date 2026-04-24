<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('payable_type', 50);
            $table->unsignedBigInteger('payable_id');
            $table->decimal('amount', 10, 2);
            $table->char('payment_reference', 36)->unique();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['payable_type', 'payable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
