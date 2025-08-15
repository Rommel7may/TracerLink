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
    Schema::table('alumni', function (Blueprint $table) {
        $table->unsignedTinyInteger('instruction_rating')->nullable();
    });
}

public function down(): void
{
    Schema::table('alumni', function (Blueprint $table) {
        $table->dropColumn('instruction_rating');
    });
}

};
