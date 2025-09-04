<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');              
            $table->text('description');              
            $table->string('company_name');         
            $table->string('location')->nullable();  
            $table->text('requirements')->nullable(); 
            $table->text('responsibilities')->nullable(); 
            $table->string('apply_link')->nullable();
            $table->foreignId('posted_by')->nullable()->constrained('users')->onDelete('set null'); 
            $table->string('status')->default('active');
            
            // Added date range fields for job posting
            $table->date('posted_date')->nullable(); // When the job was posted
            $table->date('application_deadline')->nullable(); // Deadline for applications
            $table->date('start_date')->nullable(); // Job start date (if applicable)
            
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};