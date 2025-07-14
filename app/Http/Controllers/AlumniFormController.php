<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;

class AlumniFormController extends Controller
{
    public function show($student_number)
    {
        $student = Student::where('student_number', $student_number)->first();

        if (!$student) {
            abort(404, 'Student not found');
        }

        return Inertia::render('AlumniForm', [
            'student_number' => $student->student_number,
            'email' => $student->email,
            'program' => $student->program,
        ]);
    }
}
