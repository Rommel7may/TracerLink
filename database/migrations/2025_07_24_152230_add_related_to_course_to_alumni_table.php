<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Add 'related_to_course' column to 'alumni' table.
     */
    public function up(): void {
        Schema::table('alumni', function (Blueprint $table) {
            $table->enum('related_to_course', ['yes', 'no', 'unsure'])
                  ->nullable()
                  ->after('employer_classification');
        });
    }

    /**
     * Remove 'related_to_course' column from 'alumni' table.
     */
    public function down(): void {
        Schema::table('alumni', function (Blueprint $table) {
            $table->dropColumn('related_to_course');
        });
    }
};
