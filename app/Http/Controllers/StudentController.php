<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

class StudentController extends Controller
{
    /**
     * Display all students.
     */
    public function index()
    {
        $students = Student::all();

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    public function getAllStudents()
    {
        return Student::all();
    }

    /**
     * Store a newly created student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:students',
            'student_name'   => 'required|string|max:255',
            'email'          => 'required|email|unique:students',
            'year'           => 'required|integer|min:2022|max:' . date('Y'), // ✅ limit from 2022-current year
        ]);

        $student = Student::create($validated);

        if ($request->wantsJson()) {
            return response()->json($student);
        }

        return redirect()->route('students.index')->with('success', 'Student added!');
    }

    /**
     * Update an existing student.
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

        return response()->json($student);
    }

    /**
     * Delete the specified student.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(['success' => true]);
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
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        $inserted = 0;

        foreach ($rows as $row) {
            $student_number = trim($row[0] ?? '');
            $student_name   = trim($row[1] ?? '');
            $email          = trim($row[2] ?? '');
            $program        = trim($row[3] ?? '');
            $year           = trim($row[4] ?? ''); // ✅ column 5 as Year (optional depende sa file)

            // detect email kahit saan column
            foreach ($row as $cell) {
                $cell = trim($cell);
                if (filter_var($cell, FILTER_VALIDATE_EMAIL)) {
                    $email = $cell;
                    break;
                }
            }

            // skip invalid rows
            if (!$student_number || !is_numeric($student_number) || !$student_name) continue;
            if (Student::where('student_number', $student_number)->exists()) continue;

            // fallback year kung empty → current year
            $year = ($year && is_numeric($year)) ? (int)$year : date('Y');
            if ($year < 2022 || $year > date('Y')) {
                $year = date('Y');
            }

            Student::create([
                'student_number' => $student_number,
                'student_name'   => $student_name,
                'email'          => $email ?: null,
                'program'        => $program ?: null,
                'year'           => $year,
            ]);

            $inserted++;
        }

        return redirect()->route('students.index')
            ->with('success', "{$inserted} students imported successfully!");
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
