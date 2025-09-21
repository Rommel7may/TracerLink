<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    // 👇 Specify the correct table name
    protected $table = 'alumni';

    // ✅ Define the fillable fields including the new fields
    protected $fillable = [
        'student_number',
        'email',
        'program_id',
        'last_name',
        'given_name',
        'middle_initial',
        'sex',
        'present_address',
        'contact_number',
        'graduation_year',
        'employment_status',
        'company_name',
        'work_position',          // ✅ Newly added field
        'further_studies',
        'sector',
        'work_location',
        'employer_classification',
        'related_to_course',
        'consent',
        'instruction_rating',     // ✅ New field added for 5-star rating
    ];

    /**
     * 🔗 Define the relationship: Alumni belongs to a Program
     */
    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
