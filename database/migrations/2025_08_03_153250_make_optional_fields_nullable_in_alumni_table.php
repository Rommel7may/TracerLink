<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('work_location')->nullable()->change();
            $table->string('employer_classification')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->string('work_location')->nullable(false)->change();
            $table->string('employer_classification')->nullable(false)->change();
        });
    }
};

