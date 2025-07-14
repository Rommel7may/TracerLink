<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $fillable = [
        'student_number',
        'email',
        'program',
        'last_name',
        'given_name',
        'middle_initial',
        'present_address',
        'active_email',
        'contact_number',
        'graduation_year',
        'employment_status',
        'further_studies',
        'sector',
        'work_location',
        'employer_classification',
        'consent',
    ];
}