<?php

namespace App\Services;

use App\Models\Alumni;
use App\Models\Program;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AlumniImportService
{
    protected const HEADERS = [
        'Student Number',
        'Email',
        'Program',
        'Last Name',
        'Given Name',
        'M.I',
        'Sex',
        'Present Address',
        'Contact No.',
        'Batch Year',
        'Employment Status',
        'Company Name',
        'Further Studies',
        'Sector',
        'Work Location',
        'Employer Classification',
        'Related To Course',
        'Consent',
        'Instruction Rating'
    ];

    /**
     * Import alumni from uploaded Excel file
     */
    public function import($file): array
    {
        try {
            $data = Excel::toArray([], $file);

            if (empty($data[0])) {
                throw new \Exception('File is empty');
            }

            $rows = $data[0];
            array_shift($rows);

            $imported = 0;
            $errors = [];

            foreach ($rows as $index => $row) {
                if ($this->isRowInvalid($row)) {
                    continue;
                }

                try {
                    $this->importRow($row);
                    $imported++;
                } catch (\Exception $e) {
                    Log::error("Import error at row " . ($index + 2) . ": " . $e->getMessage());
                    $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                }
            }

            return [
                'imported' => $imported,
                'errors' => $errors,
                'message' => "{$imported} alumni imported successfully"
            ];
        } catch (\Exception $e) {
            Log::error('Import failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check if row is invalid or empty
     */
    protected function isRowInvalid($row): bool
    {
        return !isset($row[0]) 
            || trim($row[0]) === '' 
            || strtolower(trim($row[0])) === 'student number';
    }

    /**
     * Import single row into database
     */
    protected function importRow($row): void
    {
        $programName = isset($row[2]) ? strtoupper(trim($row[2])) : null;

        $program = null;
        if ($programName) {
            $program = Program::firstOrCreate(['name' => $programName]);
        }

        Alumni::updateOrCreate(
            ['student_number' => $row[0]],
            [
                'email' => $row[1] ?? null,
                'program_id' => $program->id ?? null,
                'last_name' => $row[3] ?? null,
                'given_name' => $row[4] ?? null,
                'middle_initial' => $row[5] ?? null,
                'sex' => $row[6] ?? null,
                'present_address' => $row[7] ?? null,
                'contact_number' => $row[8] ?? null,
                'graduation_year' => isset($row[9]) ? (int) $row[9] : null,
                'employment_status' => $row[10] ?? null,
                'company_name' => $row[11] ?? null,
                'further_studies' => $row[12] ?? null,
                'sector' => $row[13] ?? null,
                'work_location' => $row[14] ?? null,
                'employer_classification' => $row[15] ?? null,
                'related_to_course' => $row[16] ?? null,
                'consent' => (isset($row[17]) && strtolower($row[17]) === 'yes') ? 1 : 0,
            ]
        );
    }

    /**
     * Get shared headers for consistency
     */
    public static function getHeaders(): array
    {
        return self::HEADERS;
    }
}
