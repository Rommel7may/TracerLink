<?php

namespace App\Http\Controllers;
// Controller for test form display
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    public function index(){
        return Inertia::render('formTest');
    }
}
