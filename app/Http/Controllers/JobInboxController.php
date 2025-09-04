<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class JobInboxController extends Controller
{

    public function index(){
        
         return Inertia::render('JobInbox');
    }
 
}
