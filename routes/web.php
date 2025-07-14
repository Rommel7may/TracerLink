<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SendController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AlumniController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\AlumniFormController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
//Next Page
Route::resource('/send',SendController::class);
Route::resource('/alumni',AlumniController::class);
Route::resource('/list',ListController::class);
Route::resource('/data',DataController::class);
Route::resource('/job',JobController::class);

//CRUD Student
Route::get('/students', [StudentController::class, 'index'])->name('students.index');
Route::post('/students', [StudentController::class, 'store'])->name('students.store');
Route::put('/students/{student}', [StudentController::class, 'update']);
Route::delete('/students/{student}', [StudentController::class, 'destroy']);

//Try mailing
Route::post('/send-email', [SendController::class, 'sendEmail']);
Route::get('/alumni-form/{student_number}', [AlumniFormController::class, 'show'])
    ->name('alumni.form');

Route::get('/test-email-view', function () {
    return view('emails.alumni-form', [
        'student' => (object) ['student_number' => '2023-00001'],
        'formUrl' => 'https://example.com/alumni-form/2023-00001',
    ]);
});

Route::post('/alumni-form/{student_number}/submit', [AlumniController::class, 'store'])
    ->name('alumni.store');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
