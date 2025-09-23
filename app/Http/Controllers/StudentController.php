<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

class StudentController extends Controller
{
    /**
     * Return all students as JSON.
     */
    public function index()
    {
        return response()->json(Student::all());
    }

    /**
     * Store a new student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:students',
            'student_name'   => 'required|string|max:255',
            'email'          => 'required|email|unique:students',
            'year'           => 'required|integer|min:2022|max:' . date('Y'),
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student added successfully',
            'student' => $student
        ]);
    }

    /**
     * Update a student.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:students,student_number,' . $student->id,
            'student_name'   => 'required|string|max:255',
            'email'          => 'nullable|email|unique:students,email,' . $student->id,
            'year'           => 'required|integer|min:2022|max:' . date('Y'),
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ]);
    }

    /**
     * Delete a student.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }

    /**
     * Import students from Excel.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getPathname());
        $rows = $spreadsheet->getActiveSheet()->toArray();

        array_shift($rows); // skip header
        $inserted = 0;

        foreach ($rows as $row) {
            $student_number = trim($row[0] ?? '');
            $student_name   = trim($row[1] ?? '');
            $email          = trim($row[2] ?? '');
            $year           = trim($row[3] ?? '');

            if (empty($student_number) || empty($student_name) || empty($year) || !is_numeric($year)) {
                continue;
            }

            $year = (int)$year;
            if ($year < 2022 || $year > (int)date('Y')) {
                continue;
            }

            if (Student::where('student_number', $student_number)->exists()) {
                continue;
            }

            Student::create([
                'student_number' => $student_number,
                'student_name'   => $student_name,
                'email'          => $email ?: null,
                'year'           => $year,
            ]);

            $inserted++;
        }

        return response()->json([
            'message' => "{$inserted} students imported successfully!"
        ]);
    }

    /**
     * Bulk delete.
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Student::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Students deleted successfully']);
    }
}
