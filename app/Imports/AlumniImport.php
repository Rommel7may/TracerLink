<?php

namespace App\Imports;

use App\Models\Alumni;
use App\Models\Program;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class AlumniImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        unset($row[0]);
        
        if (empty($row['student_number'])) {
        return null;
    }
        // Convert Program JSON to program_id
        $programId = null;
        if (!empty($row['program'])) {
            $decoded = json_decode($row['program'], true);
            if (is_array($decoded) && isset($decoded['id'])) {
                $programId = $decoded['id'];
            } else {
                // fallback: try to find program by name
                $program = Program::where('name', $row['program'])->first();
                $programId = $program ? $program->id : null;
            }
        }

        return new Alumni([
            'student_number'          => $row['student_number'] ?? null,
            'program_id'              => $programId,
            'email'                   => $row['email'] ?? null,
            'last_name'               => $row['last_name'] ?? null,
            'given_name'              => $row['given_name'] ?? null,
            'middle_initial'          => $row['middle_initial'] ?? null,
            'present_address'         => $row['present_address'] ?? null,
            'contact_number'          => $row['contact_number'] ?? null,
            'graduation_year'         => $row['graduation_year'] ?? null,
            'employment_status'       => $row['employment_status'] ?? null,
            'company_name'            => $row['company_name'] ?? null,
            'further_studies'         => $row['further_studies'] ?? null,
            'sector'                  => $row['sector'] ?? null,
            'work_location'           => $row['work_location'] ?? null,
            'employer_classification' => $row['employer_classification'] ?? null,
            'related_to_course'       => $row['related_to_course'] ?? null,
            'consent'                 => strtolower($row['consent_given'] ?? 'no') === 'yes' ? 1 : 0,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.student_number' => 'required|string|max:50|unique:alumni,student_number',
            '*.email'          => 'nullable|email|unique:alumni,email',
            '*.last_name'      => 'required|string|max:255',
            '*.given_name'     => 'required|string|max:255',
            '*.graduation_year'=> 'nullable|digits:4',
        ];
    }

    public function customValidationMessages()
    {
        return [
            '*.student_number.required' => 'Student number is required.',
            '*.student_number.unique'   => 'Duplicate student number found.',
            '*.email.email'             => 'Invalid email format.',
            '*.last_name.required'      => 'Last name is required.',
            '*.given_name.required'     => 'Given name is required.',
        ];
    }
}
