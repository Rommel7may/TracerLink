<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Alumni;
use Illuminate\Support\Facades\URL;

class JobFormController extends Controller
{
    /**
     * Show the Job Form for an alumni.
     *
     * @param  \App\Models\Alumni  $alumni
     * @return \Inertia\Response
     */
    public function show(Alumni $alumni)
    {
        //make signed URL for security
        $formUrl = URL::signedRoute('job-form.show', ['alumni' => $alumni->id]);

        return Inertia::render('JobFormForEmail', [
            'alumni' => $alumni,
            'formUrl' => $formUrl,
        ]);
    }
}
