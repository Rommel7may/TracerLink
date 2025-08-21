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

    /**
     * Store a newly created student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_number' => 'required|string|unique:students',
            'student_name'   => 'required|string|max:255',
            'email' => 'required|email|unique:students',
            // 'program' => 'required|string',
        ]);

        $student = Student::create($validated);

        // ✅ For Inertia redirect or Axios JSON response
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
            'email' => 'required|email|unique:students,email,' . $student->id,
            'program' => 'required|string',
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
    
public function import(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:xlsx,xls',
    ]);

    $file = $request->file('file');
    $spreadsheet = IOFactory::load($file->getPathname());
    $sheet = $spreadsheet->getActiveSheet();
    $rows = $sheet->toArray();

    $inserted = 0;

    foreach ($rows as $index => $row) {
        // Skip header row
        if ($index === 0) continue;

        $student_number = $row[0] ?? null;
        $student_name = $row[1] ?? null;
        $email = $row[2] ?? null; // optional
        $program = $row[3] ?? null; // optional

        if (!$student_number || !$student_name) continue;

        // Avoid duplicates
        if (Student::where('student_number', $student_number)->exists()) continue;

        Student::create([
            'student_number' => $student_number,
            'student_name' => $student_name,
            'email' => $email,
            'program' => $program,
        ]);

        $inserted++;
    }

    return response()->json([
        'message' => "$inserted students imported successfully!",
    ]);
}

public function bulkDelete(Request $request)
{
    $ids = $request->input('ids', []);
    Student::whereIn('id', $ids)->delete();

    return response()->json(['message' => 'Students deleted successfully']);
}
}