<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Program;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class AlumniImportController extends Controller
{
    public function import(Request $request)
    {
        // Validate uploaded file
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls,csv|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $file = $request->file('file');

        try {
    // Optional: clear table first if you want full refresh
    // Alumni::truncate();

    // Convert Excel to array
    $data = Excel::toArray([], $file);

    if (empty($data[0])) {
        return response()->json(['error' => 'File is empty'], 422);
    }

    $rows = $data[0];
    array_shift($rows); // remove header

    foreach ($rows as $index => $row) {
        // Skip invalid rows
        if (!isset($row[0]) || empty($row[0])) {
            continue; // student_number missing
        }

        $programName = isset($row[2]) ? strtoupper(trim($row[2])) : null;

        $program = null;
        if ($programName) {
            $program = Program::firstOrCreate(['name' => $programName]);
        }

        try {
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
                    'instruction_rating' => isset($row[18]) ? (int) $row[18] : null,
                ]
            );
        } catch (\Exception $rowEx) {
            // Log the row that failed
            \Log::error("Failed to import row #$index: " . $rowEx->getMessage());
        }
    }

    return response()->json(['message' => 'Import successful']);
} catch (\Exception $e) {
    return response()->json([
        'error' => 'Import failed: ' . $e->getMessage()
    ], 500);
}

    }
}
