<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("reservations", function (Blueprint $table) {
            $table->id();
            $table->string("first_name");
            $table->string("last_name");
            $table->string("phone", 32);

            $table->dateTime("reservation_time");

            $table->string("pin_code");
            $table->dateTime("pin_active_from");
            $table->dateTime("pin_active_until");

            $table->timestamp("confirmed_at")->nullable();
            $table->timestamp("extended_at")->nullable();
            $table->timestamp("processed_at")->nullable();

            $table->timestamps();

            $table->unique("pin_code");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("reservations");
    }
};
