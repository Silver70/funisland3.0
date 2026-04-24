<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('park_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_reference', 20)->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('ticket_type_id')->constrained('park_ticket_types');
            $table->date('visit_date');
            $table->unsignedTinyInteger('quantity');
            $table->string('status', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('park_tickets');
    }
};
