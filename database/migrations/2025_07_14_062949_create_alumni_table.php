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
        Schema::create('alumni', function (Blueprint $table) {
            $table->id();
            $table->string('student_number')->unique();
            $table->string('email');
            $table->string('program');
            $table->string('last_name');
            $table->string('given_name');
            $table->string('middle_initial')->nullable();
            $table->string('present_address');
            $table->string('active_email');
            $table->string('contact_number');
            $table->string('graduation_year');
            $table->string('employment_status')->nullable();
            $table->string('further_studies')->nullable();
            $table->string('sector')->nullable();
            $table->string('work_location')->nullable();
            $table->string('employer_classification')->nullable();
            $table->boolean('consent')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni');
    }
};
