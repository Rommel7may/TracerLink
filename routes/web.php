<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    SendController,
    StudentController,
    AlumniController,
    ListController,
    DataController,
    JobPostController,
    AlumniFormController,
    UpdateAlumniFormController,
    JobFormController,
    ChartController,
    AlumniExportController,
    UpdateEmailController,
    YesNoController,
    LocationController,
    ProgramController,
    DashboardController,
    PursuingStudiesController,
    TotalGraduatesController,
    AlumniImportController,
    GenderChartController,
    EmployabilityController, 
    TestController,
};

// 🌐 Public Welcome Page
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// 📝 Public Alumni Form
Route::get('/alumni-form/{student_number}', [AlumniFormController::class, 'show'])->name('alumni.form');
Route::post('/alumni-form/{student_number}/submit', [AlumniFormController::class, 'store'])->name('alumni.store');

// 🔗 Blank Form (Public Link)
Route::get('/alumni-form-link', fn () => Inertia::render('AlumniForm'))->name('alumni.form.link');

// 🔄 Alumni Update via Signed Link
Route::get('/alumni-update-form/{student_number}', [UpdateAlumniFormController::class, 'show'])
    ->middleware('signed')
    ->name('alumni.update.form');
Route::put('/alumni-update-form/{student_number}', [UpdateAlumniFormController::class, 'update'])
    ->name('alumni.update.submit');

// ✅ Email Duplication Check
Route::get('/check-active-email', [AlumniFormController::class, 'checkActiveEmail'])->name('alumni.email.check');

// 📊 Public Charts and Export
Route::get('/alumni-chart', [ChartController::class, 'alumniPie'])->name('alumni.chart');
Route::get('/alumni-chart-options', [ChartController::class, 'options'])->name('alumni.chart.options');
Route::get('/related', [YesNoController::class, 'YesNo'])->name('related.chart');
Route::get('/location', [LocationController::class, 'location'])->name('location.chart');
Route::get('/export-alumni', [AlumniExportController::class, 'export'])->name('alumni.export');

// 📈 New Analytics Charts
Route::get('/chart/pursuing-studies', [PursuingStudiesController::class, 'chart'])->name('chart.pursuing.studies');
Route::get('/chart/total-graduates', [TotalGraduatesController::class, 'total'])->name('chart.total.graduates');

// 👨‍👩‍👧 Gender Chart (FIXED ✅)
Route::get('/chart/gender', [GenderChartController::class, 'genderData'])->name('chart.gender');

// 🧪 Test Email Blade Preview
Route::get('/test-email-view', fn () => view('emails.AlumniUpdateForm', [
    'student' => (object)[
        'student_number' => '2023-00001',
        'given_name' => 'Juan',
    ],
    'formUrl' => url('/alumni-update-form/2023-00001'),
]))->name('test.email.view');

// ✅ Public Job Form Link (from email)
Route::get('/job-form/{alumni}', [JobFormController::class, 'show'])->name('job-form.show');

// 🔐 Admin-Only Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {

    // 📊 Dashboard Page
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/program-counts', [DashboardController::class, 'programCounts'])->name('dashboard.program.counts');

    // 📧 Email Sending
    Route::post('/send-email', [SendController::class, 'sendEmail'])->name('email.send');
    Route::post('/send-email-to-alumni', [SendController::class, 'sendToProgram'])->name('email.to.program');
    Route::post('/send-email-to-all-alumni', [UpdateEmailController::class, 'sendToAll'])->name('email.to.all.alumni');
    Route::post('/send-email-to-selected-alumni', [UpdateEmailController::class, 'sendToSelected']);

    // 👨‍🎓 Alumni CRUD
    Route::get('/alumni-data', [AlumniController::class, 'index'])->name('alumni.index');
    Route::post('/alumni', [AlumniController::class, 'store'])->name('alumni.store');
    Route::put('/alumni/{id}', [AlumniController::class, 'update'])->name('alumni.update');
    Route::delete('/alumni/{id}', [AlumniController::class, 'destroy'])->name('alumni.destroy');

    // 👩‍🎓 Student CRUD
    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

    // ✅ API Route for Dynamic Programs Dropdown
    Route::get('/students/programs', [StudentController::class, 'programList'])->name('students.programs');

    // 📦 Resource Controllers
    Route::resource('/send', SendController::class)->only(['index', 'create', 'store']);
    Route::resource('/list', ListController::class);
    Route::resource('/data', DataController::class);
    Route::resource('/jobpost', JobPostController::class);
    Route::resource('/program', ProgramController::class);
    Route::resource('/test', TestController::class);

    // 👈 Employability Route ✅
    Route::get('/employability', [EmployabilityController::class, 'index'])->name('employability.index');

    // 🧠 API for Frontend Fetching
    Route::get('/alumni-form', [ProgramController::class, 'create']);
    Route::get('/alumni/create', [AlumniController::class, 'create']);
    Route::get('/api/programs', fn () => \App\Models\Program::all());

    // ✅ Import Alumni (main + alias para sa React)
    Route::post('/alumni/import', [AlumniImportController::class, 'import'])->name('alumni.import');
    Route::post('/import-alumni', [AlumniImportController::class, 'import'])->name('alumni.import.alias');
});

// 📍 Job Posts
Route::get('/job-posts', [JobPostController::class, 'index'])->name('job-posts.index');
Route::post('/job-posts', [JobPostController::class, 'store'])->name('job-posts.store');
Route::put('/job-posts/{job_post}', [JobPostController::class, 'update'])->name('job-posts.update');
Route::delete('/job-posts/{job_post}', [JobPostController::class, 'destroy'])->name('job-posts.destroy');

// ✅ Send email to unemployed alumni by program
Route::post('/job-posts/send-email', [JobPostController::class, 'sendEmail'])->name('job-posts.send-email');

// ✅ Send email to all employed alumni (NEW)
Route::post('/job-posts/send-email-to-all-employed', [JobPostController::class, 'sendEmailToAllEmployed'])->name('job-posts.send-email-to-all-employed');

// ✅ Bulk delete students
Route::post('/students/bulk-delete', [StudentController::class, 'bulkDelete']);

// ✅ Import students from Excel
Route::post('/students/import', [StudentController::class, 'import'])->name('students.import');

// ✅ Send email to selected students
Route::post('/students/send-email', [SendController::class, 'sendEmail'])->name('students.send-email');
Route::post('/alumni/bulk-delete', [AlumniController::class, 'bulkDelete'])->name('alumni.bulk-delete');


// ⚙️ Program setting page
Route::get('/settings/program', function () {
    $programs = \App\Models\Program::all();
    return Inertia::render('settings/ProgramCrud', [
        'programs' => $programs,
    ]);
});

Route::get('/test-realtime', function() {
    event(new \App\Events\TestRealtime('Hello from Laravel!'));
    return 'Event fired!';
});
Route::post('/alumni', [AlumniController::class, 'store']);


// routes/web.php or routes/api.php
Route::get('/test-broadcast', function () {
    $alumni = App\Models\Alumni::first(); // Get any alumni
    event(new App\Events\AlumniCreated($alumni));
    return 'Event broadcasted!';
});

Route::get('/api/programs', function() {
    return response()->json(\App\Models\Program::all());
});
// Route::get('/test-broadcast-debug', function () {
//     $alumni = App\Models\Alumni::first();
    
//     \Log::info('=== START BROADCAST DEBUG ===');
//     \Log::info('Testing broadcast for alumni: ' . $alumni->id);
    
//     // Test if broadcasting is configured
//     $broadcastManager = app('Illuminate\Broadcasting\BroadcastManager');
//     $driver = $broadcastManager->getDefaultDriver();
//     \Log::info('Default broadcast driver: ' . $driver);
    
//     // Test the event
//     $event = new App\Events\AlumniCreated($alumni);
//     \Log::info('Event channel: ' . $event->broadcastOn()->name);
//     \Log::info('Event name: ' . $event->broadcastAs());
//     \Log::info('Event data: ' . json_encode($event->broadcastWith()));
    
//     // Test broadcasting
//     try {
//         \Log::info('Attempting to broadcast...');
//         broadcast($event)->toOthers();
//         \Log::info('Broadcast completed without errors');
//     } catch (\Exception $e) {
//         \Log::error('Broadcast error: ' . $e->getMessage());
//     }
    
//     \Log::info('=== END BROADCAST DEBUG ===');
    
//     return response()->json([
//         'status' => 'debug_completed',
//         'alumni' => $alumni->student_number,
//         'driver' => $driver
//     ]);
// });

Route::get('/programs', function () {
    return Program::select('id', 'name')->orderBy('name')->get();
});

// 🧩 Include extra route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
